import { useEffect } from "react";
import { ErrorTypes } from "../types/responseServiceTypes";
import { AppError } from "../errors/AppError";


export function mapAppErrorToErrorType(err: unknown): ErrorTypes {
    if (err instanceof AppError) {
        const {message, type} = err;

        console.log("[Use Error] Erro: ", message);
        console.log("[Use Error] Type: ", type);
        console.log("\n");

        return err.type;
    }

    return "UNKNOWN";
}



export function useErrorScreenListener(
    isError: boolean,
    error: unknown,
    setErrorType: (type: ErrorTypes | null) => void
) {
    useEffect(() => {   
        if(isError) {
            const errorHandled: ErrorTypes = mapAppErrorToErrorType(error);
            setErrorType(errorHandled);
        } else {
            setErrorType(null);
        }
    }, [isError, error, setErrorType]);
}
