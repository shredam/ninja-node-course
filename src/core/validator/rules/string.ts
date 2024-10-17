import { isString } from "@mongez/supportive-is";
import Rule from "./rule";

export default class StringRule extends Rule {
  public static ruleName = "string";

  public async validate() {
    this.isValid = isString(this.value);
  }

  public error() {
    return `${this.input} is not a string`;
  }
}
