import { ErrorTypes } from "../types/responseServiceTypes";


export class AppError extends Error {
    constructor(
        message: string,
        public type: ErrorTypes,
        public status?: number
    ){
        super(message);
        this.name = "AppError"
    }
}

export class ForbiddenError extends AppError {
    constructor() {
        super("Acesso negado", "FORBIDDEN", 403);
    }
}

export class InternalError extends AppError {
    constructor() {
        super("Erro interno", "INTERNAL");
    }
}

export class NetworkError extends AppError {
    constructor(){
        super("Sem conexão com a internet", "NETWORK");
    }
}

export class ServerError extends AppError {
    constructor() {
        super("Erro interno no servidor", "SERVER", 500);
    }
}

export class UnauthorizedError extends AppError {
    constructor() {
        super("Realize login e tente novamente", "UNAUTHORIZED", 401);
    };
}

export class UnknownError extends AppError {
    constructor() {
        super("Erro desconhecido", "UNKNOWN");
    }
}