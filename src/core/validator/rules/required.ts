import Rule from "./rule";

export default class RequiredRule extends Rule {
  public static ruleName = "required";

  public async validate() {
    this.isValid = Boolean(this.value) && this.value.length > 0;
  }

  public error() {
    return `${this.input} is required`;
  }
}
