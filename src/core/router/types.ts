export type Route = {
  method: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
  path: string;
  handler: any;
};
