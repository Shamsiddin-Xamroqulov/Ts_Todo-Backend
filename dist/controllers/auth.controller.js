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
const controller_dto_1 = require("./controller.dto");
const error_1 = require("../utils/error");
const validator_1 = require("../utils/validator");
const readFile_1 = require("../models/readFile");
const writeFile_1 = require("../models/writeFile");
const jwt_1 = require("../lib/jwt/jwt");
const { createToken } = jwt_1.tokenService;
class AuthController extends controller_dto_1.Auth {
    login(req, res) { }
    register(req, res) { }
    constructor() {
        super();
        this.register = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let newUser = "";
                req.on("data", (chunk) => {
                    newUser += chunk;
                });
                req.on("end", () => __awaiter(this, void 0, void 0, function* () {
                    try {
                        let user = JSON.parse(newUser);
                        const validator = (0, validator_1.registerValidator)(user);
                        if (validator) {
                            let users = yield (0, readFile_1.readFile)("users.json");
                            if (users.some((u) => u.email == user.email))
                                throw new error_1.ClientError("It's user already exists !", 400);
                            user = Object.assign({ id: users.length ? users.at(-1).id + 1 : 1 }, user);
                            users.push(user);
                            let write = yield (0, writeFile_1.writeFile)("users.json", users);
                            if (write)
                                return res.end(JSON.stringify({ message: "User successfully registred !", status: 201, accessToken: createToken({ user_id: user.id, userAgent: req.headers["user-agent"] }) }));
                            else
                                throw new error_1.ServerError("User not saved !");
                        }
                        return res.end(JSON.stringify({ status: "Success" }));
                    }
                    catch (error) {
                        let err = {
                            message: error.message,
                            status: error.status
                        };
                        (0, error_1.globalError)(res, err);
                    }
                }));
            }
            catch (error) {
                let err = {
                    message: error.message,
                    status: error.status
                };
                (0, error_1.globalError)(res, err);
            }
        });
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let user = "";
                req.on("data", (chunk) => {
                    user += chunk;
                });
                req.on("end", () => __awaiter(this, void 0, void 0, function* () {
                    try {
                        user = JSON.parse(user);
                        let validator = (0, validator_1.loginValidator)(user);
                        if (validator) {
                            let users = yield (0, readFile_1.readFile)("users.json");
                            let findUser = users.find((u) => u.email == user.email);
                            if (!findUser)
                                throw new error_1.ClientError("User not found !", 404);
                            if ((findUser === null || findUser === void 0 ? void 0 : findUser.password) == user.password)
                                return res.end(JSON.stringify({ message: "User successfully logined !", status: 200, accessToken: createToken({ user_id: findUser.id, userAgent: req.headers["user-agent"] }) }));
                            else
                                throw new error_1.ClientError("User not found !", 404);
                        }
                    }
                    catch (error) {
                        let err = {
                            message: error.message,
                            status: error.status
                        };
                        (0, error_1.globalError)(res, err);
                    }
                }));
            }
            catch (error) {
                let err = {
                    message: error.message,
                    status: error.status
                };
                (0, error_1.globalError)(res, err);
            }
        });
    }
}
exports.default = new AuthController();
