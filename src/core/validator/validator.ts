import { Request } from "core/http/request";
import RulesList from "./rules-list";

export default class Validator {
  protected errorsList: any[] = [];

  public constructor(
    protected readonly request: Request,
    protected readonly rules: any,
  ) {}

  public async scan() {
    const inputsValues = this.request.only(Object.keys(this.rules));

    for (const input in this.rules) {
      const inputValue = inputsValues[input];
      const inputRules = this.rules[input];

      const rulesList = new RulesList(input, inputValue, inputRules);

      await rulesList.validate();

      if (rulesList.fails()) {
        this.errorsList.push(rulesList.errors());
      }
    }
  }

  public fails() {
    return this.errorsList.length > 0;
  }

  public passes() {
    return this.errorsList.length === 0;
  }

  public errors() {
    return this.errorsList;
  }
}
