const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const multerConfig = require("./multerConfig");

/**
 * Módulo para inserir os middlewares no app express.SS
 * @param {express} app - app express.
 * @returns {express} app com middlewares injetados.
 */
module.exports = app => {
  app.use(
    cors({
      origin: "*",
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"]
    })
  );
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(multer(multerConfig).single("arquivo"));
  app.use(
    "/files",
    express.static(path.resolve(__dirname, "..", "..", "..", "tmp", "uploads"))
  );
  return app;
};
