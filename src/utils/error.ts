import {ServerResponse, IncomingMessage} from "http"
import { Error } from "../types";
export class ClientError extends Error {
    status: number;
    constructor(message:string, status:number){
        super(message);
        this.message = `ClientError: ${message}`;
        this.status = status;
    }
};
export class ServerError extends Error {
    status: number
    constructor(message:string){
        super(message);
        this.message = `ServerError: ${message}`;
        this.status = 500;
    }
};
export const globalError = (res:ServerResponse<IncomingMessage>, err:Error) => {
    let status = err.status || 500
    res.statusCode = status;
    return res.end(JSON.stringify({message: err.message, status}))
}