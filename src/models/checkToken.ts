import { IncomingMessage } from "node:http";
import { ClientError, globalError } from "../utils/error";
import { Error, User } from "../types";
import { Response } from "../controllers/controller.dto";
import { tokenService } from "../lib/jwt/jwt";
import { readFile } from "./readFile";
import { TokenBody } from "../lib/jwt/jwt.dto";

export const checkToken = async (req:IncomingMessage, res: Response) => {
    try{
        let token = req.headers.token;
        if(!token) throw new ClientError("Unauthorized", 401);
        let verifyToken:TokenBody = tokenService.verifyToken(token as string) as TokenBody;
        let users = await readFile("users.json");
        if(!(users.some((user:User) => user.id == verifyToken.user_id))) throw new ClientError("Token is invalid !", 401);
        if(!(verifyToken.userAgent == req.headers["user-agent"])) throw new ClientError("Token is invalid !", 401);
        return true
    }catch(error){
        let err:Error = {
            message: (error as Error).message,
            status: (error as Error).status
        }
        globalError(res, err)
    }
}