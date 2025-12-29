import { AppError } from "./AppError"

export class UnauthorizedError extends AppError {
    constructor() {
        super("Você não tem permissão para essa ação", "UNAUTHORIZED", 401);
    };
}