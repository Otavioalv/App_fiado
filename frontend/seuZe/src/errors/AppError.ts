export type ErroTypes = "NETWORK" | "UNAUTHORIZED" | "SERVER" | "UNKNOWN" | "INTERNAL" | "CLIENT";

export class AppError extends Error {
    constructor(
        message: string,
        public types: ErroTypes,
        public status?: number
    ){
        super(message);
        this.name = "AppError"
    }
}
