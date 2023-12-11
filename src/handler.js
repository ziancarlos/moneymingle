const mysql = require("mysql2/promise"); // Use 'mysql2' package for promise-based operations

// MySQL Connection Pooling
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "moneymingle",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const getUserByUserIdHandler = async (request, h) => {
  const { userId } = request.params;

  if (!userId) {
    const response = h.response({
      status: "fail",
      message: "Id User undefined atau null!",
    });

    response.code(400);

    response.header("Access-Control-Allow-Origin", "*");

    return response;
  }

  let rows;
  let fields;
  try {
    // Example Query
    [rows, fields] = await pool.query("SELECT * FROM users WHERE id = ?", [
      userId,
    ]);
  } catch (err) {
    const response = h.response({
      status: "fail",
      message: "Error fetching data!",
    });

    response.code(400);

    response.header("Access-Control-Allow-Origin", "*");

    return response;
  }

  if (rows.length === 0) {
    const response = h.response({
      status: "fail",
      message: "User tidak ditemukan",
    });

    response.code(400);

    response.header("Access-Control-Allow-Origin", "*");

    return response;
  }

  const response = h.response({
    status: "success",
    message: "User ditemukan",
    data: {
      user: rows[0],
    },
  });

  response.header("Access-Control-Allow-Origin", "*");

  response.code(201);

  return response;
};

const loginHandler = async (request, h) => {
  const { username, password } = request.payload;

  if (!username) {
    const response = h.response({
      status: "fail",
      message: "Username undefined atau null!",
    });

    response.code(400);

    response.header("Access-Control-Allow-Origin", "*");

    return response;
  }

  if (!password) {
    const response = h.response({
      status: "fail",
      message: "Password undefined atau null!",
    });

    response.code(400);

    response.header("Access-Control-Allow-Origin", "*");

    return response;
  }

  let rows;
  let fields;
  try {
    // Example Query
    [rows, fields] = await pool.query(
      "SELECT id FROM users WHERE username = ? AND password = ?",
      [username, password]
    );
  } catch (err) {
    const response = h.response({
      status: "fail",
      message: "Error fetching data!",
    });

    response.code(400);

    response.header("Access-Control-Allow-Origin", "*");

    return response;
  }

  if (rows.length === 0) {
    const response = h.response({
      status: "fail",
      message: "User tidak ditemukan",
    });

    response.code(400);

    response.header("Access-Control-Allow-Origin", "*");

    return response;
  }

  const response = h.response({
    status: "success",
    message: "User ditemukan",
    data: {
      userId: rows[0].id,
    },
  });

  response.header("Access-Control-Allow-Origin", "*");

  response.code(201);

  return response;
};

const registerHandler = async (request, h) => {
  const { username, email, password } = request.payload;
  if (!username) {
    const response = h.response({
      status: "fail",
      message: "Username undefined atau null!",
    });

    response.code(400);

    response.header("Access-Control-Allow-Origin", "*");

    return response;
  }

  if (!email) {
    const response = h.response({
      status: "fail",
      message: "Email undefined atau null!",
    });

    response.code(400);

    response.header("Access-Control-Allow-Origin", "*");

    return response;
  }

  let rows;
  let fields;
  try {
    // Example Query
    [rows, fields] = await pool.query(
      "SELECT id FROM users WHERE username = ? ",
      [username]
    );
  } catch (err) {
    const response = h.response({
      status: "fail",
      message: "Error fetching data!",
    });

    response.code(400);

    response.header("Access-Control-Allow-Origin", "*");

    return response;
  }

  if (rows.length > 0) {
    const response = h.response({
      status: "fail",
      message: "Username sudah digunakan!",
    });

    response.code(400);

    return response;
  }

  try {
    // Example Query
    [rows, fields] = await pool.query("SELECT id FROM users WHERE email = ? ", [
      email,
    ]);
  } catch (err) {
    const response = h.response({
      status: "fail",
      message: "Error fetching data!",
    });

    response.code(400);

    response.header("Access-Control-Allow-Origin", "*");

    return response;
  }

  if (rows.length > 0) {
    const response = h.response({
      status: "fail",
      message: "Email sudah digunakan!",
    });

    response.code(400);

    response.header("Access-Control-Allow-Origin", "*");

    return response;
  }

  if (!password) {
    const response = h.response({
      status: "fail",
      message: "Password undefined atau null!",
    });
  }

  try {
    // Example SQL query to insert data
    const sql =
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";

    // Execute the query using the MySQL connection pool
    const [result] = await pool.query(sql, [username, email, password]);

    const response = h.response({
      status: "success",
      message: "Data inserted successfully",
      data: {
        userId: result.insertId,
      },
    });

    response.code(201);

    return response;
  } catch (error) {
    const response = h.response({
      status: "fail",
      message: "Error fetching data!",
    });

    response.code(400);
    response.header("Access-Control-Allow-Origin", "*");

    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Error insert data!",
  });

  response.code(400);

  response.header("Access-Control-Allow-Origin", "*");

  return response;
};

module.exports = {
  loginHandler,
  registerHandler,
  getUserByUserIdHandler,
};
