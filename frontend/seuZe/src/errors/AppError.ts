export type ErroTypes = "NETWORK" | "UNAUTHORIZED" | "SERVER" | "UNKNOWN" | "INTERNAL" | "CLIENT" | "FORBIDDEN";

export class AppError extends Error {
    constructor(
        message: string,
        public type: ErroTypes,
        public status?: number
    ){
        super(message);
        this.name = "AppError"
    }
}
