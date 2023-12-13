const {
  loginHandler,
  registerHandler,
  getUserByUserIdHandler,
  getTransactionByUserIdHandler,
  deleteTransactionByTransactionIdHandler,
  addTransactionByUserIdHandler,
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
  {
    method: "POST",
    path: "/transactions",
    handler: getTransactionByUserIdHandler,
  },
  {
    method: "DELETE",
    path: "/transactions",
    handler: deleteTransactionByTransactionIdHandler,
  },
  {
    method: "PUT",
    path: "/transactions",
    handler: addTransactionByUserIdHandler,
  },
];

module.exports = routes;
