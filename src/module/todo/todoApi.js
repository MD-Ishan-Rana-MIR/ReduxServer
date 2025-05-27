const express = require("express");
const verifyToken = require("../../middlewares/middleware");
const { createTodo, findAllTodo, todoByUser, todoStatusUpdate } = require("./todoController");

const todoRouter = express.Router();

todoRouter.post("/createTodo", verifyToken, createTodo);
todoRouter.get("/all-todo", findAllTodo);
todoRouter.get("/todo-byUser", verifyToken, todoByUser);
todoRouter.put("/todo-statusUpdate/:id", verifyToken, todoStatusUpdate);


module.exports = todoRouter;