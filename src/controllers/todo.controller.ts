import { IncomingMessage, ServerResponse } from "http";
import http from "http";
import { readFile } from "../models/readFile";
import { Request, Response, TodoControllertype } from "./controller.dto";
import { ClientError, ServerError, globalError } from "../utils/error";
import { Error, todoResultType } from "../types";
import { Todos } from "../types";
import { validatorTodo } from "../utils/validator";
import { JwtPayload, verify } from "jsonwebtoken";
import path from "path";
import {writeFile} from "../models/writeFile"
import { TokenBody } from "../lib/jwt/jwt.dto";

class userTodos extends TodoControllertype {
  getTodos(req: IncomingMessage, res: ServerResponse<IncomingMessage>): void {}
  getTodo(req: IncomingMessage, res: ServerResponse<IncomingMessage>): Promise<void> | void {}
  createTodo(req: IncomingMessage, res: ServerResponse<IncomingMessage>): void {}
  deleteTodo(req: IncomingMessage, res: ServerResponse<IncomingMessage>): void {}
  UpdateTodo(req: Request, res: Response): void {}
  constructor() {
    super();
    this.getTodo = async (req:IncomingMessage, res:ServerResponse<IncomingMessage>) => {
        try {

            let newTodo:string = "";
            req.on("data", (chunk) => {
                newTodo += chunk;
            })
            req.on("end", async () => {
                try {
                    const req_url: string = (req.url as string).trim().toLowerCase();
                    const todo_id: number = Number(req_url.split("/").at(-1));
                    if (!todo_id) throw new ClientError("NOT FOUND", 404);
                    const todos: Todos[] = await (readFile("todos.json")) as Todos[];
                    const find_index_todo: number = todos.findIndex((t: Todos) => t.id == todo_id);
                    if (find_index_todo == -1) throw new ClientError("NOT FOUND", 404);
                    const result: Todos = todos[find_index_todo];
                    res.statusCode = 200;
                    res.end(JSON.stringify(result));
                } catch(error) {
                    let err: Error = {
                        message: (error as Error).message,
                        status: (error as Error).status,
                    };
                    globalError(res, err);
                }
            })
        } catch(error) {
            let err: Error = {
                message: (error as Error).message,
                status: (error as Error).status,
            };
            globalError(res, err);
        }
    }
    this.UpdateTodo = async (req:IncomingMessage, res:ServerResponse<IncomingMessage>) => {
        try {
            let todo_chunk: string = "";
            req.on("data", (chunk) => { todo_chunk += chunk });
            req.on("end", async () => {
                try {
                    const change_todo: Todos = JSON.parse(todo_chunk);
                    const todos: Todos[] = await (readFile("todos.json")) as Todos[];
                    let validator = validatorTodo(change_todo);
                    if (validator) {
                        const todo_id: number = Number((req.url as string).trim().split("/").at(-1));
                        if (!todo_id) throw new ClientError("NOT FOUND", 404);
                        const find_index_todo: number = todos.findIndex((t: Todos) => t.id == todo_id);
                        if (find_index_todo == -1) throw new ClientError("NOT FOUND", 404);
                        const token: string = req.headers.token as string;
                        const verify_token: TokenBody = verify(token, process.env.TOKEN_KEY as string) as TokenBody;
                        const todo: Todos = todos[find_index_todo];
                        if (todo.user_id != verify_token.user_id) throw new ClientError("Todo is not edit", 400);
                        todo.message = change_todo.message;
                        todo.isComplate = change_todo.isComplate;
                        const save_todo: boolean | void = await writeFile("todos.json", todos);
                        if (!save_todo) throw new ServerError("Todo is not changed");
                        const result: todoResultType = {
                            message: "Todo is changed",
                            status: 200,
                            todo
                        }
                        res.statusCode = 200;
                        res.end(JSON.stringify(result));
                    }
                } catch (error) {
                    let err: Error = {
                        message: (error as Error).message,
                        status: (error as Error).status,
                    };
                    globalError(res, err);
                }
            })
        } catch (error) {
            let err: Error = {
                message: (error as Error).message,
                status: (error as Error).status,
            };
            globalError(res, err);
        }
    }
    this.getTodos = async (req:IncomingMessage, res:ServerResponse<IncomingMessage>) => {
        try {
            let todos:Todos[] = await readFile("todos.json") as Todos[];
            res.setHeader("Content-type", "application/json");
            res.end(JSON.stringify(todos));
        } catch(error) {
            let err: Error = {
                message: (error as Error).message,
                status: (error as Error).status,
            };
            globalError(res, err);
        }
    };
    this.deleteTodo = async (req:IncomingMessage, res:ServerResponse<IncomingMessage>) => {
        const todos: Todos[] = await (readFile("todos.json")) as Todos[];
        const todo_id: number = Number((req.url as string).trim().split("/").at(-1));
        if (!todo_id) throw new ClientError("NOT FOUND", 404);
        const find_index_todo: number = todos.findIndex((t: Todos) => t.id == todo_id);
        if (find_index_todo == -1) throw new ClientError("NOT FOUND", 404);
        const token: string = req.headers.token as string;
        const verify_token: TokenBody = verify(token, process.env.TOKEN_KEY as string) as TokenBody;
        const todo: Todos = todos[find_index_todo];
        if (todo.user_id != verify_token.user_id) throw new ClientError("Todo is not deleted", 400);
        todos.splice(find_index_todo, 1);
        const delete_todo: boolean | void = await writeFile("todos.json", todos);
        if (!delete_todo) throw new ServerError("Todo is not deleted");
        const result: todoResultType = {
            message: "Todo is deleted",
            status: 200,
        }
        res.statusCode = 200;
        res.end(JSON.stringify(result));
    }
    this.createTodo = async (req:IncomingMessage, res:ServerResponse<IncomingMessage>) => {
        try {
            let newTodo:string = "";
            req.on("data", (chunk) => {
                newTodo += chunk
            })
            req.on("end", async () => {
                let todo:Todos = JSON.parse(newTodo);
                let validator: boolean | void = validatorTodo(todo);
                if(validator) {
                    let todos:Todos[] = await readFile("todos.json") as Todos[];
                    const token: string = req.headers.token as string;
                    let verifyToken: JwtPayload = verify(token, process.env.TOKEN_KEY as string) as JwtPayload
                    todo.isComplate = verifyToken.isComplate ||false;
                    todo.user_id = verifyToken.user_id;
                    todo.id = todos.length? todos[todos.length-1].id + 1 : 1;
                    todos.push(todo);
                    let writeTodos: boolean | void = await writeFile("todos.json", todos);
                    if(!writeTodos) throw new ServerError("Not Saved !");
                    const result: todoResultType = {
                        message: "Todo is saved",
                        status: 201,
                        todo
                    }
                    res.setHeader("Content-type", "application/json");
                    res.end(JSON.stringify(result))
                }
            })
        }catch(error){
            let err: Error = {
                message: (error as Error).message,
                status: (error as Error).status,
            };
            globalError(res, err);
        }
    }
  }
}

export default new userTodos();
