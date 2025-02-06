export interface ServerConfig {
    port: number | string,
    dbFilePath: (fileName:string) => string
}
export type Error = {
    message: string,
    status: number
}
export type User = {
    id?: number,
    first_name?: string,
    last_name?: string,
    email: string,
    password: string
}

export type Todos = {
    id: number,
    user_id: number,
    isComplate: boolean,
    message: string
}

export type todoResultType = Error & {todo?:Todos};