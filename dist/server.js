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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_http_1 = __importDefault(require("node:http"));
const rate_limiter_flexible_1 = require("rate-limiter-flexible");
const config_1 = require("./config");
const auth_controller_1 = __importDefault(require("./controllers/auth.controller"));
const checkToken_1 = require("./models/checkToken");
const todo_controller_1 = __importDefault(require("./controllers/todo.controller"));
const { port } = config_1.serverConfiguration;
const reqLimit = new rate_limiter_flexible_1.RateLimiterMemory({
    points: 2,
    duration: 60
});
const server = node_http_1.default.createServer((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let reqUrl = req.url.trim().toLocaleLowerCase();
    let reqMethod = req.method.trim().toUpperCase();
    res.setHeader("Content-type", "application/json");
    let userId = req.headers.authorization || req.socket.remoteAddress || "anonymous";
    try {
        yield reqLimit.consume(userId);
    }
    catch (_a) {
        return res.end(JSON.stringify({ message: "Too many requests", status: 429 }));
    }
    if (reqUrl.startsWith("/api")) {
        if (reqUrl.startsWith("/api/auth/register") && reqMethod == config_1.METHODS_ENUM.CREATE)
            return auth_controller_1.default.register(req, res);
        if (reqUrl.startsWith("/api/auth/login") && reqMethod == config_1.METHODS_ENUM.CREATE)
            return auth_controller_1.default.login(req, res);
        if (yield (0, checkToken_1.checkToken)(req, res)) {
            if (reqUrl.startsWith("/api/todo/delete/") && reqMethod == config_1.METHODS_ENUM.DELETE)
                todo_controller_1.default.deleteTodo(req, res);
            if (reqUrl.startsWith("/api/todo/") && reqMethod == config_1.METHODS_ENUM.READ)
                return todo_controller_1.default.getTodo(req, res);
            if (reqUrl.startsWith("/api/todos") && reqMethod == config_1.METHODS_ENUM.READ)
                return todo_controller_1.default.getTodos(req, res);
            if (reqUrl.startsWith("/api/todo/create") && reqMethod == config_1.METHODS_ENUM.CREATE)
                return todo_controller_1.default.createTodo(req, res);
            if (reqUrl.startsWith("/api/todo/update/") && reqMethod == config_1.METHODS_ENUM.UPDATE)
                return todo_controller_1.default.UpdateTodo(req, res);
        }
    }
    else
        return res.end(JSON.stringify({ message: "Invalid URL", status: 404 }));
}));
server.listen(port, () => {
    console.log(`Server is runnin on ${port}-port`);
});
