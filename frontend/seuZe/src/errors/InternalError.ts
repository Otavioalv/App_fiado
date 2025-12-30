import { AppError } from "./AppError";


export class InternalError extends AppError {
    constructor() {
        super("Erro interno", "INTERNAL");
    }
}