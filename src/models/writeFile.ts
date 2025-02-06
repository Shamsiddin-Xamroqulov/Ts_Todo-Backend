import fs from "fs/promises"
import { serverConfiguration } from "../config";
import { Todos, User } from "../types";
const {dbFilePath} = serverConfiguration;
export const writeFile = async (fileName:string, users:User[] | Todos[]):Promise<boolean | void> => {
    await fs.writeFile(dbFilePath(fileName), JSON.stringify(users, null, 4));
    return true;
};
