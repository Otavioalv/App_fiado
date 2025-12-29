import { AppError } from "./AppError";


export class ServerError extends AppError {
    constructor() {
        super("Erro interno no servidor", "SERVER", 500);
    }
}