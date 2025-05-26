const express = require("express");
const verifyToken = require("../../middlewares/middleware");
const { createTodo, findAllTodo } = require("./todoController");

const todoRouter = express.Router();

todoRouter.post("/createTodo", verifyToken, createTodo);
todoRouter.get("/all-todo", findAllTodo )


module.exports = todoRouter