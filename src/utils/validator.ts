import { todoSchema } from "../lib/joi/joi";
import { Todos, User } from "../types";
import { ClientError } from "./error";
// import Joi, {ObjectSchema} from "joi"

let emailRegex:RegExp = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

export const registerValidator = (user:User):boolean | void => {
    const {first_name, last_name, email, password} = user;
    if(!first_name) throw new ClientError("First name is required !", 400);
    if(!last_name) throw new ClientError("Last name is required !", 400);
    if(!email) throw new ClientError("Email is required !", 400);
    if(!password) throw new ClientError("Password name is required !", 400);
    if(!(emailRegex.test(email))) throw new ClientError("Email is invalid !", 400);
    if(!(password.length >= 5 && password.length <= 13)) throw new ClientError("Password is invalid !", 400)
    return true 
}
export const loginValidator = (user:User):boolean | void => {
    const {email, password} = user;
    if(!email) throw new ClientError("Email is required !", 400);
    if(!password) throw new ClientError("Password name is required !", 400);
    if(!(emailRegex.test(email))) throw new ClientError("Email is invalid !", 400);
    if(!(password.length >= 5 && password.length <= 12)) throw new ClientError("Password is invalid !", 400)
    return true 
}

export const validatorTodo = (todo:Todos): boolean | void => {
    todoSchema.validate(todo)
    return true;
}