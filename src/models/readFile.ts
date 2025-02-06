import fs from "fs/promises"
import { serverConfiguration } from "../config";
import { User } from "../types";
const {dbFilePath} = serverConfiguration;
export const readFile = async (fileName:string):Promise<[] | User[]> => {
    let read:User[] | string = await fs.readFile(dbFilePath(fileName), "utf-8");
    return read ? JSON.parse(read): [];
};
