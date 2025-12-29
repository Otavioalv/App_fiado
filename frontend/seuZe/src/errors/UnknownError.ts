import { AppError } from "./AppError";

export class UnknownError extends AppError {
    constructor() {
        super("Erro desconhecido", "UNKNOWN");
    }
}