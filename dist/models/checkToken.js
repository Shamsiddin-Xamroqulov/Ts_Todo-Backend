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
exports.checkToken = void 0;
const error_1 = require("../utils/error");
const jwt_1 = require("../lib/jwt/jwt");
const readFile_1 = require("./readFile");
const checkToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = req.headers.token;
        if (!token)
            throw new error_1.ClientError("Unauthorized", 401);
        let verifyToken = jwt_1.tokenService.verifyToken(token);
        let users = yield (0, readFile_1.readFile)("users.json");
        if (!(users.some((user) => user.id == verifyToken.user_id)))
            throw new error_1.ClientError("Token is invalid !", 401);
        if (!(verifyToken.userAgent == req.headers["user-agent"]))
            throw new error_1.ClientError("Token is invalid !", 401);
        return true;
    }
    catch (error) {
        let err = {
            message: error.message,
            status: error.status
        };
        (0, error_1.globalError)(res, err);
    }
});
exports.checkToken = checkToken;
