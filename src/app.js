const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");
const conn=require("./config/db.js");
const mysql=require("mysql2");
const router = require("../src/routes/regrouts.js");

const app = express();
app.set("view engine", "ejs");

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  session({
    secret: "11111111fdf",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.static("public"));

// Routes
app.use("/", router);

module.exports = app;
