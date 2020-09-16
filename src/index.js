const express = require("express");
const middlewares = require("./middlewares/index");

const app = express();

const dbConnect = require("./db");

app.use(express.json());

app.use("/todos", require("./api/todo.routes"));
app.use(middlewares.errorHandler);

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await dbConnect();
    app.listen(PORT, () => {
      console.log(`App has been started on port ${PORT}...`);
    });
  } catch (e) {
    console.log("Server Error", e.message);
    process.exit(1);
  }
}

start();

module.exports = app;