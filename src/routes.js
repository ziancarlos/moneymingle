const {
  loginHandler,
  registerHandler,
  getUserByUserIdHandler,
} = require("./handler");

const routes = [
  {
    method: "POST",
    path: "/login",
    handler: loginHandler,
  },
  {
    method: "POST",
    path: "/register",
    handler: registerHandler,
  },
  {
    method: "GET",
    path: "/user/{userId}",
    handler: getUserByUserIdHandler,
  },
];

module.exports = routes;
