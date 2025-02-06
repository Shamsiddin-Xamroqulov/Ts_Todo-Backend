import { IncomingMessage, Server, ServerResponse } from "http";

export type Request = IncomingMessage;
export type Response = ServerResponse<Request>
export abstract class Auth {
    abstract register(req: Request, res:Response): void;
    abstract login(req: Request, res:Response): void;
}

export abstract class TodoControllertype {
    abstract getTodos(req: Request, res:Response): void;
    abstract getTodo(req: Request, res:Response): void;
    abstract createTodo(req: Request, res:Response): void;
    abstract deleteTodo(req: Request, res:Response): void;
    abstract UpdateTodo(req: Request, res:Response): void;
}