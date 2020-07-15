const db = require("./database/models/index");
// console.log(db);
const cors = require("cors");

const express = require("express");
const app = express();
const path = require("path");

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    preflightContinue: true,
  })
);
app.use(express.static(path.join(__dirname, "/frontend/build")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());

module.exports = app;
