const Hapi = require("@hapi/hapi");
const routes = require("./routes");

const init = async () => {
  const server = Hapi.server({
    port: 9000, // Specify the port your server will listen on
    host: "localhost", // Specify the host (usually 'localhost' for development)
  });

  // Add routes, plugins, and other configurations here
  server.route(routes);

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();
