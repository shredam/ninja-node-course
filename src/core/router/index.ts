import { Route } from "./types";

export class Router {
  private static instance: Router;

  private routes: Route[] = [];

  private constructor() {}

  public static getInstance() {
    if (!Router.instance) {
      Router.instance = new Router();
    }

    return Router.instance;
  }

  public get(path: string, handler: any) {
    this.routes.push({
      method: "GET",
      path,
      handler,
    });

    return this;
  }

  public post(path: string, handler: any) {
    this.routes.push({
      method: "POST",
      path,
      handler,
    });

    return this;
  }

  public put(path: string, handler: any) {
    this.routes.push({
      method: "PUT",
      path,
      handler,
    });
  }

  public delete(path: string, handler: any) {
    this.routes.push({
      method: "DELETE",
      path,
      handler,
    });
  }

  public patch(path: string, handler: any) {
    this.routes.push({
      method: "PATCH",
      path,
      handler,
    });
  }

  public list() {
    return this.routes;
  }

  public scan(server: any) {
    this.routes.forEach(route => {
      const requsetMethod = route.method.toLowerCase();
      const requsetMethodunction = server[requsetMethod].bind(server);

      requsetMethodunction(route.path, route.handler);
    });
  }
}

const router = Router.getInstance();

export default router;
