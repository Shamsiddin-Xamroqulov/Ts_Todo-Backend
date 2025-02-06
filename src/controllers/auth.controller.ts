import { IncomingMessage, ServerResponse } from "http";
import { Auth } from "./controller.dto";
import { Error, User } from "../types";
import { ClientError, globalError, ServerError } from "../utils/error";
import { loginValidator, registerValidator } from "../utils/validator";
import { readFile } from "../models/readFile";
import { writeFile } from "../models/writeFile";
import { tokenService } from "../lib/jwt/jwt";
const { createToken } = tokenService;
class AuthController extends Auth {
    login(req: IncomingMessage, res: ServerResponse<IncomingMessage>): void {}
    register(req: IncomingMessage, res: ServerResponse<IncomingMessage>): void {}
    constructor(){
        super()
        this.register = async (req, res) => {
            try{
                let newUser:string = "";
                req.on("data", (chunk) => {
                    newUser += chunk
                });
                req.on("end", async () => {
                    try{
                        let user:User = JSON.parse(newUser);
                        const validator = registerValidator(user);
                        if(validator){
                            let users:User[] = await readFile("users.json");
                            if(users.some((u:User) => u.email == user.email)) throw new ClientError("It's user already exists !", 400);
                            user = {id: users.length ? (((users as User[]).at(-1) as User).id as number) +1 : 1, ...user}
                            users.push(user);
                            let write:boolean | void = await writeFile("users.json", users)
                            if(write) return res.end(JSON.stringify({message: "User successfully registred !", status: 201, accessToken: createToken({user_id: user.id, userAgent: req.headers["user-agent"]})}))
                            else throw new ServerError("User not saved !")         
                        }
                        return res.end(JSON.stringify({status: "Success"}))

                    }catch(error){
                        let err:Error = {
                            message: (error as Error).message,
                            status: (error as Error).status
                        }
                        globalError(res, err)
                    }  
                })
            }catch(error){
                let err:Error = {
                    message: (error as Error).message,
                    status: (error as Error).status
                }
                globalError(res, err)
            }
        }
        this.login = async (req, res) => {
            try{
                let user:string | User = "";
                req.on("data", (chunk) => {
                    user += chunk
                });
                req.on("end", async () => {
                    try{
                        user = JSON.parse(user as string)
                        let validator = loginValidator(user as User);
                        if(validator){
                            let users:User[] = await readFile("users.json");
                            let findUser = users.find((u:User) => u.email == (user as User).email);
                            if(!findUser) throw new ClientError("User not found !", 404);
                            if(findUser?.password == (user as User).password) return res.end(JSON.stringify({message: "User successfully logined !", status: 200, accessToken: createToken({user_id: (findUser as User).id, userAgent: req.headers["user-agent"]})}));
                            else throw new ClientError("User not found !", 404);
                        }
                    }catch(error){
                        let err:Error = {
                            message: (error as Error).message,
                            status: (error as Error).status
                        }
                        globalError(res, err)
                    }
                })
            }catch(error){
                let err:Error = {
                    message: (error as Error).message,
                    status: (error as Error).status
                }
                globalError(res, err)
            }
        }
    }
}

export default new AuthController()