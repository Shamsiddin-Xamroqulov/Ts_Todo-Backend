"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const readFile_1 = require("../models/readFile");
const controller_dto_1 = require("./controller.dto");
const error_1 = require("../utils/error");
const validator_1 = require("../utils/validator");
const jsonwebtoken_1 = require("jsonwebtoken");
const writeFile_1 = require("../models/writeFile");
class userTodos extends controller_dto_1.TodoControllertype {
    getTodos(req, res) { }
    getTodo(req, res) { }
    createTodo(req, res) { }
    deleteTodo(req, res) { }
    UpdateTodo(req, res) { }
    constructor() {
        super();
        this.getTodo = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let newTodo = "";
                req.on("data", (chunk) => {
                    newTodo += chunk;
                });
                req.on("end", () => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const req_url = req.url.trim().toLowerCase();
                        const todo_id = Number(req_url.split("/").at(-1));
                        if (!todo_id)
                            throw new error_1.ClientError("NOT FOUND", 404);
                        const todos = yield ((0, readFile_1.readFile)("todos.json"));
                        const find_index_todo = todos.findIndex((t) => t.id == todo_id);
                        if (find_index_todo == -1)
                            throw new error_1.ClientError("NOT FOUND", 404);
                        const result = todos[find_index_todo];
                        res.statusCode = 200;
                        res.end(JSON.stringify(result));
                    }
                    catch (error) {
                        let err = {
                            message: error.message,
                            status: error.status,
                        };
                        (0, error_1.globalError)(res, err);
                    }
                }));
            }
            catch (error) {
                let err = {
                    message: error.message,
                    status: error.status,
                };
                (0, error_1.globalError)(res, err);
            }
        });
        this.UpdateTodo = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let todo_chunk = "";
                req.on("data", (chunk) => { todo_chunk += chunk; });
                req.on("end", () => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const change_todo = JSON.parse(todo_chunk);
                        const todos = yield ((0, readFile_1.readFile)("todos.json"));
                        let validator = (0, validator_1.validatorTodo)(change_todo);
                        if (validator) {
                            const todo_id = Number(req.url.trim().split("/").at(-1));
                            if (!todo_id)
                                throw new error_1.ClientError("NOT FOUND", 404);
                            const find_index_todo = todos.findIndex((t) => t.id == todo_id);
                            if (find_index_todo == -1)
                                throw new error_1.ClientError("NOT FOUND", 404);
                            const token = req.headers.token;
                            const verify_token = (0, jsonwebtoken_1.verify)(token, process.env.TOKEN_KEY);
                            const todo = todos[find_index_todo];
                            if (todo.user_id != verify_token.user_id)
                                throw new error_1.ClientError("Todo is not edit", 400);
                            todo.message = change_todo.message;
                            todo.isComplate = change_todo.isComplate;
                            const save_todo = yield (0, writeFile_1.writeFile)("todos.json", todos);
                            if (!save_todo)
                                throw new error_1.ServerError("Todo is not changed");
                            const result = {
                                message: "Todo is changed",
                                status: 200,
                                todo
                            };
                            res.statusCode = 200;
                            res.end(JSON.stringify(result));
                        }
                    }
                    catch (error) {
                        let err = {
                            message: error.message,
                            status: error.status,
                        };
                        (0, error_1.globalError)(res, err);
                    }
                }));
            }
            catch (error) {
                let err = {
                    message: error.message,
                    status: error.status,
                };
                (0, error_1.globalError)(res, err);
            }
        });
        this.getTodos = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let todos = yield (0, readFile_1.readFile)("todos.json");
                res.setHeader("Content-type", "application/json");
                res.end(JSON.stringify(todos));
            }
            catch (error) {
                let err = {
                    message: error.message,
                    status: error.status,
                };
                (0, error_1.globalError)(res, err);
            }
        });
        this.deleteTodo = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const todos = yield ((0, readFile_1.readFile)("todos.json"));
                const todo_id = Number(req.url.trim().split("/").at(-1));
                if (!todo_id)
                    throw new error_1.ClientError("NOT FOUND", 404);
                const find_index_todo = todos.findIndex((t) => t.id == todo_id);
                if (find_index_todo == -1)
                    throw new error_1.ClientError("NOT FOUND", 404);
                const token = req.headers.token;
                const verify_token = (0, jsonwebtoken_1.verify)(token, process.env.TOKEN_KEY);
                const todo = todos[find_index_todo];
                if (todo.user_id != verify_token.user_id)
                    throw new error_1.ClientError("Todo is not deleted", 400);
                todos.splice(find_index_todo, 1);
                const delete_todo = yield (0, writeFile_1.writeFile)("todos.json", todos);
                if (!delete_todo)
                    throw new error_1.ServerError("Todo is not deleted");
                const result = {
                    message: "Todo is deleted",
                    status: 200,
                };
                res.statusCode = 200;
                res.end(JSON.stringify(result));
            }
            catch (error) {
                let err = {
                    message: error.message,
                    status: error.status,
                };
                (0, error_1.globalError)(res, err);
            }
        });
        this.createTodo = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let newTodo = "";
                req.on("data", (chunk) => {
                    newTodo += chunk;
                });
                req.on("end", () => __awaiter(this, void 0, void 0, function* () {
                    let todo = JSON.parse(newTodo);
                    let validator = (0, validator_1.validatorTodo)(todo);
                    if (validator) {
                        let todos = yield (0, readFile_1.readFile)("todos.json");
                        const token = req.headers.token;
                        let verifyToken = (0, jsonwebtoken_1.verify)(token, process.env.TOKEN_KEY);
                        todo.isComplate = verifyToken.isComplate || false;
                        todo.user_id = verifyToken.user_id;
                        todo.id = todos.length ? todos[todos.length - 1].id + 1 : 1;
                        todos.push(todo);
                        let writeTodos = yield (0, writeFile_1.writeFile)("todos.json", todos);
                        if (!writeTodos)
                            throw new error_1.ServerError("Not Saved !");
                        const result = {
                            message: "Todo is saved",
                            status: 201,
                            todo
                        };
                        res.setHeader("Content-type", "application/json");
                        res.end(JSON.stringify(result));
                    }
                }));
            }
            catch (error) {
                let err = {
                    message: error.message,
                    status: error.status,
                };
                (0, error_1.globalError)(res, err);
            }
        });
    }
}
exports.default = new userTodos();
