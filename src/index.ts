import Fastify from "fastify";
import router from "./core/router";

const server = Fastify({
  logger: true,
});

router.get("/", async (request: any, reply: any) => {
  return { hello: "world" };
});

const start = async () => {
  router.scan(server);
  try {
    await server.listen({ port: 3000 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
