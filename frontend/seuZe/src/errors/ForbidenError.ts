import { AppError } from "./AppError";


export class ForbiddenError extends AppError {
    constructor() {
        super("Acesso negado", "FORBIDDEN", 403);
    }
}