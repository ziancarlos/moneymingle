const Hapi = require("@hapi/hapi");
// const HapiCorsHeaders = require("hapi-cors-headers");
const routes = require("./routes");
const HapiCors = require("hapi-cors");

const init = async () => {
  const server = Hapi.server({
    port: 9000, // Specify the port your server will listen on
    host: "localhost", // Specify the host (usually 'localhost' for development)
  });

  // Register the hapi-cors-headers plugin
  await server.register({
    plugin: HapiCors,
    options: {
      origins: ["*"], // Set your allowed origin
      methods: ["*"], // Add the HTTP methods you want to allow
    },
  });

  // Add routes, plugins, and other configurations here
  server.route(routes);

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();
