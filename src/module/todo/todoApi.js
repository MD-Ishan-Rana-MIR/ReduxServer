const express = require("express");
const verifyToken = require("../../middlewares/middleware");
const { createTodo } = require("./todoController");

const todoRouter = express.Router();

todoRouter.post("/createTodo", verifyToken, createTodo);


module.exports = todoRouter