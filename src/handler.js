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

const getTransactionByUserIdHandler = async (request, h) => {
  const { userId } = request.payload;

  if (!userId) {
    const response = h.response({
      status: "fail",
      message: "User Id undefined atau null!",
    });

    response.code(400);

    response.header("Access-Control-Allow-Origin", "*");

    return response;
  }

  let rows;
  let fields;
  try {
    // Example Query
    [result] = await pool.query(
      "SELECT * FROM transactions WHERE userId = ? ",
      [userId]
    );

    const response = h.response({
      status: "success",
      message: "Data inserted successfully",
      data: result,
    });

    response.code(201);

    return response;
  } catch (err) {
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
    message: "Error fetching data!",
  });

  response.code(400);

  response.header("Access-Control-Allow-Origin", "*");

  return response;
};

const deleteTransactionByTransactionIdHandler = async (request, h) => {
  const { transactionId } = request.payload;

  console.log(transactionId);

  if (!transactionId) {
    const response = h.response({
      status: "fail",
      message: "Transaction Id is undefined or null!",
    });

    response.code(400);

    response.header("Access-Control-Allow-Origin", "*");

    return response;
  }

  try {
    const [result] = await pool.query("DELETE FROM transactions WHERE id = ?", [
      transactionId,
    ]);

    if (result.affectedRows > 0) {
      // Transaction deleted successfully
      const response = h.response({
        status: "success",
        message: "Transaction deleted successfully",
      });

      response.code(200);

      response.header("Access-Control-Allow-Origin", "*");

      return response;
    } else {
      // No rows were affected, transaction not found
      const response = h.response({
        status: "fail",
        message: "Transaction not found or already deleted",
      });

      response.code(404);

      response.header("Access-Control-Allow-Origin", "*");

      return response;
    }
  } catch (err) {
    // Handle database error
    console.error("Error deleting transaction:", err);

    const response = h.response({
      status: "fail",
      message: "Error deleting transaction",
    });

    response.code(500);

    response.header("Access-Control-Allow-Origin", "*");

    return response;
  }
};

const addTransactionByUserIdHandler = async (request, h) => {
  const { name, amount, description, type, userId } = request.payload;

  // Validate amount (numeric) and type (0 or 1)
  if (isNaN(amount) || ![0, 1].includes(type)) {
    const response = h.response({
      status: "fail",
      message: "Invalid amount or type",
    });

    response.code(400); // Bad Request

    response.header("Access-Control-Allow-Origin", "*");

    return response;
  }

  try {
    // Check if the user with the specified userId exists
    const [userResult] = await pool.query("SELECT * FROM users WHERE id = ?", [
      userId,
    ]);

    if (userResult.length === 0) {
      // User with the specified userId does not exist
      const response = h.response({
        status: "fail",
        message: "User does not exist",
      });
      ``;
      response.code(404); // Not Found

      response.header("Access-Control-Allow-Origin", "*");

      return response;
    }

    // User exists, proceed with the transaction insertion
    const [result] = await pool.query(
      "INSERT INTO transactions (name, amount, description, type, userId) VALUES (?, ?, ?, ?, ?)",
      [name, amount, description, type, userId]
    );

    if (result.affectedRows > 0) {
      // Transaction inserted successfully
      const response = h.response({
        status: "success",
        message: "Transaction inserted successfully",
      });

      response.code(201); // Created

      response.header("Access-Control-Allow-Origin", "*");

      return response;
    } else {
      // No rows were affected, insertion failed
      const response = h.response({
        status: "fail",
        message: "Failed to insert transaction",
      });

      response.code(500); // Internal Server Error

      response.header("Access-Control-Allow-Origin", "*");

      return response;
    }
  } catch (err) {
    // Handle database error
    console.error("Error inserting transaction:", err);

    const response = h.response({
      status: "fail",
      message: "Error inserting transaction",
    });

    response.code(500); // Internal Server Error

    response.header("Access-Control-Allow-Origin", "*");

    return response;
  }
};

module.exports = {
  loginHandler,
  registerHandler,
  getUserByUserIdHandler,
  getTransactionByUserIdHandler,
  deleteTransactionByTransactionIdHandler,
  addTransactionByUserIdHandler,
};
