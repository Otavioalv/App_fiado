import { AppError } from "./AppError"

export class UnauthorizedError extends AppError {
    constructor() {
        super("Realize login e tente novamente", "UNAUTHORIZED", 401);
    };
}