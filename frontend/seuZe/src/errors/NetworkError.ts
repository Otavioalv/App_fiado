import { AppError } from "./AppError"

export class NetworkError extends AppError {
    constructor(){
        super("Sem conexão com a internet", "NETWORK");
    }
}