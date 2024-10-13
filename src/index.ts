import fastify from "fastify";

const server = fastify();

server.get("/", (requset, response) => {
  return { hello: "world" };
});

async function start() {
  await server.listen({ port: 3000 });

  console.log("Server listening on port 3000");
}

start();
