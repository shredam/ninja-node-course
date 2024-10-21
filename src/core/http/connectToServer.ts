import config from "@mongez/config";
import multipart from "@fastify/multipart";
import Fastify from "fastify";
import router from "core/router";

export default async function connectToServer() {
  const server = Fastify();

  server.register(multipart, {
    attachFieldsToBody: true,
  });

  router.scan(server);

  try {
    const address = await server.listen({
      port: config.get("app.port"),
      host: config.get("app.baseUrl"),
    });

    console.log(`Start browsing using ${address}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}
