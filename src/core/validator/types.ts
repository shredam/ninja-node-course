import Rule from "./rules/rule";

export type ValidationConfigurations = {
  stopOnFirstFailure?: boolean;
  returnErrorStrategy?: "first" | "all";
  responseStatus?: number;
  keys?: {
    response?: string;
    inputKey?: string;
    inputError?: string;
    inputErrors?: string;
  };
  rules?: Record<string, typeof Rule>;
};
