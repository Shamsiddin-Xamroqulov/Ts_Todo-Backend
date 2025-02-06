import { config } from "dotenv";
import { ServerConfig } from "./types";
import path from "path";
config()

export enum METHODS_ENUM {
    CREATE = "POST",
    READ = "GET",
    UPDATE = "PUT",
    DELETE = "DELETE"
}

export const serverConfiguration:ServerConfig = {
    port: process.env.PORT || 3000,
    dbFilePath: (fileName:string) => path.resolve("db", fileName)
}