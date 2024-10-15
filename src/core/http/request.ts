import { FastifyRequest } from "fastify";

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
    if (data.value) return data.value;

    return data;
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
    const value = this.input(key, defaultValue);

    return Number(value);
  }
}

const request = new Request();

export default request;
