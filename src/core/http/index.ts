import Fastify from "fastify";
import multipart from "@fastify/multipart";
import router from "core/router";

export default async function connectToServer() {
  const server = Fastify({
    logger: true,
  });

  server.register(multipart, {
    attachFieldsToBody: true,
  });

  router.scan(server);

  try {
    await server.listen({ port: 3000 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}
