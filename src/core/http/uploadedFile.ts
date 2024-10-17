import { ensureDirectory } from "@mongez/fs";
import { Random } from "@mongez/reinforcements";
import { writeFileSync } from "fs";
import path from "path";

export default class UploadedFile {
  private bufferFileContent: any;

  public constructor(private readonly fileData: any) {}

  public get name() {
    return this.fileData.filename;
  }

  public get mimeType() {
    return this.fileData.mimetype;
  }

  public get extension() {
    return path.extname(this.fileData.filename).replace(".", "").toLowerCase();
  }

  public async size() {
    const file = await this.buffer();

    return file.toString().length;
  }

  public async buffer() {
    if (this.bufferFileContent) {
      return this.bufferFileContent;
    }

    this.bufferFileContent = await this.fileData.toBuffer();
    return this.bufferFileContent;
  }

  public async saveTo(path: string) {
    ensureDirectory(path);

    const fileContent = await this.buffer();

    writeFileSync(path + "/" + this.name, fileContent);
  }

  public async saveAs(path: string, name: string) {
    ensureDirectory(path);

    const fileContent = await this.buffer();

    writeFileSync(path + "/" + name, fileContent);
  }

  public async save(path: string) {
    ensureDirectory(path);

    const name = Random.string(64) + "." + this.extension;
    const fileContent = await this.buffer();

    writeFileSync(path + "/" + name, fileContent);

    return name;
  }
}
