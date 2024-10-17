import { FastifyRequest } from "fastify";
import UploadedFile from "./uploadedFile";
import { Validator } from "core/validator";
import { only } from "@mongez/reinforcements";
import config from "@mongez/config";

export class Request {
  public request: any;

  public response: any;

  private handler: any;

  public setRequest(requset: FastifyRequest) {
    this.request = requset;

    return this;
  }

  public setResponse(response: any) {
    this.response = response;

    return this;
  }

  public setHandler(handler: any) {
    this.handler = handler;

    return this;
  }

  public async execute() {
    if (this.handler.validation) {
      if (this.handler.validation.rules) {
        const validator = new Validator(this, this.handler.validation.rules);

        try {
          await validator.scan();
        } catch (error) {
          console.log(error);
        }

        if (validator.fails()) {
          const responseErrorsKey = config.get(
            "validation.keys.response",
            "errors",
          );
          const responseStatus = config.get("validation.responseStatus", 400);

          return this.response.status(responseStatus).send({
            [responseErrorsKey]: validator.errors(),
          });
        }
      }
      if (this.handler.validation.validate) {
        const result = await this.handler.validation.validate(
          this,
          this.response,
        );

        if (result) {
          return result;
        }
      }
    }

    return await this.handler(this, this.response);
  }

  public input(key: string, defaultValue: any = null) {
    return (
      this.request.params[key] ||
      this.request.query[key] ||
      this.body[key] ||
      defaultValue
    );
  }

  public get body() {
    const body: any = {};
    for (const key in this.request.body) {
      const keyData = this.request.body[key];

      if (Array.isArray(keyData)) {
        body[key] = keyData.map(this.parseInputValue.bind(this));
      } else {
        body[key] = this.parseInputValue(keyData);
      }
    }

    return body;
  }

  private parseInputValue(data: any) {
    if (data.file) return data;

    if (data.value !== undefined) return data.value;

    return data;
  }

  public file(key: string): UploadedFile | null {
    const file = this.input(key);

    return file ? new UploadedFile(file) : null;
  }

  public get params() {
    return this.request.params;
  }

  public get query() {
    return this.request.query;
  }

  public all() {
    return {
      ...this.body,
      ...this.params,
      ...this.query,
    };
  }

  public only(keys: string[]) {
    return only(this.all, keys);
  }

  public bool(key: string, defaultValue = false) {
    const value = this.input(key, defaultValue);

    if (value === "true") {
      return true;
    }

    if (value === "false") {
      return false;
    }

    return Boolean(value);
  }

  public int(key: string, defaultValue = 0) {
    const value = this.input(key, defaultValue);

    return parseInt(value);
  }

  public float(key: string, defaultValue = 0) {
    const value = this.input(key, defaultValue);

    return parseFloat(value);
  }

  public number(key: string, defaultValue = 0) {
    const value = Number(this.input(key, defaultValue));

    return isNaN(value) ? defaultValue : value;
  }
}

const request = new Request();

export default request;
