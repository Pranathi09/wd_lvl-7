const express = require("express");
const app = express();
const { Todolist } = require("./models");
const bodyParser = require("body-parser");
const path = require("path");
const { response } = require("express");
app.use(bodyParser.json());


app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname + "/public")));
const { Todos } = require("./models");


app.get("/", function(request, response) {
    response.send("Hello World");
});

app.get("/todos", async function(_request, response) {
    console.log("Processing list of all Todos ...");
    // FILL IN YOUR CODE HERE

    // First, we have to query our PostgerSQL database using Sequelize to get list of all Todos.
    // Then, we have to respond with all Todos, like:
    // response.send(todos)

    try {
        const todos = await Todolist.findAll({
            order: [
                ["id", "ASC"]
            ]
        });
        return response.json(todos);
    } catch (error) {
        console.log(error);
        return response.status(422).json(error);
    }
});

app.get("/todos/:id", async function(request, response) {
    try {
        const todo = await Todolist.findByPk(request.params.id);
        return response.json(todo);
    } catch (error) {
        console.log(error);
        return response.status(422).json(error);
    }
});

app.post("/todos", async function(request, response) {
    try {
        const todo = await Todolist.addTodo(request.body);
        return response.json(todo);
    } catch (error) {
        console.log(error);
        return response.status(422).json(error);
    }
});

app.put("/todos/:id/markAsCompleted", async function(request, response) {
    const todo = await Todo.findByPk(request.params.id);
    try {
        const updatedTodo = await todo.markAsCompleted();
        return response.json(updatedTodo);
    } catch (error) {
        console.log(error);
        return response.status(422).json(error);
    }
});

app.delete("/todos/:id", async function(request, response) {
    try {
        const todo = await Todolist.findByPk(request.params.id);
        if (todo) {
            await todo.delete();
            return response.json(true);
        } else {
            return response.json(false);
        }
    } catch (error) {
        console.log(error);
        return response.status(422).json(false);
    }
});

module.exports = app;
