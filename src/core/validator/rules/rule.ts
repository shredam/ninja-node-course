export default abstract class Rule {
  public static ruleName = "";

  protected isValid = true;

  public constructor(
    protected readonly input: string,
    protected readonly value: any,
  ) {}

  public async validate() {}

  public passes() {
    return this.isValid === true;
  }

  public fails() {
    return this.isValid === false;
  }
}
