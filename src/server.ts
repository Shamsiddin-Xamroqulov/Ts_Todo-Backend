import http from "node:http";
import {RateLimiterMemory} from "rate-limiter-flexible";
import { METHODS_ENUM, serverConfiguration } from "./config";
import userController from "./controllers/auth.controller";
import { checkToken } from "./models/checkToken";
import userTodos from "./controllers/todo.controller";
const { port } = serverConfiguration;

const reqLimit = new RateLimiterMemory({
    points: 1,
    duration: 6
})

const server = http.createServer(async (req, res) => {
    let reqUrl:string = (req.url as string).trim().toLocaleLowerCase();
    let reqMethod:string = (req.method as string).trim().toUpperCase();
    res.setHeader("Content-type", "application/json");
    let userId = req.headers.authorization || req.socket.remoteAddress || "anonymous"; 
    try {
        await reqLimit.consume(userId);
    } catch {
        res.writeHead(429, {"content-type": "application/json"})
        return res.end(JSON.stringify({ message: "Too many requests", status: 429 }));
    }
    if(reqUrl.startsWith("/api")){
        if(reqUrl.startsWith("/api/auth/register") && reqMethod == METHODS_ENUM.CREATE) return userController.register(req, res);
        if(reqUrl.startsWith("/api/auth/login") && reqMethod == METHODS_ENUM.CREATE) return userController.login(req, res);
        if(await checkToken(req, res)){
            if(reqUrl.startsWith("/api/todo/delete/") && reqMethod == METHODS_ENUM.DELETE) userTodos.deleteTodo(req, res);
            if(reqUrl.startsWith("/api/todo/") && reqMethod == METHODS_ENUM.READ) return userTodos.getTodo(req, res);
            if(reqUrl.startsWith("/api/todos") && reqMethod == METHODS_ENUM.READ) return userTodos.getTodos(req, res);
            if(reqUrl.startsWith("/api/todo/create") && reqMethod == METHODS_ENUM.CREATE) return userTodos.createTodo(req, res);
            if(reqUrl.startsWith("/api/todo/update/") && reqMethod == METHODS_ENUM.UPDATE) return userTodos.UpdateTodo(req, res);
        }
    }else return res.end(JSON.stringify({message: "Invalid URL", status: 404}));
})
server.listen(port, () => {
    console.log(`Server is runnin on ${port}-port`)
})