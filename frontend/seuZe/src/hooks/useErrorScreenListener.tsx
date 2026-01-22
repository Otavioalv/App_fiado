import { useEffect } from "react";
import { ErrorTypes } from "../types/responseServiceTypes";
import { AppError } from "../errors/AppError";


export function useErrorScreenListener(
    isError: boolean,
    error: unknown,
    setErrorType: (type: ErrorTypes) => void
) {
    useEffect(() => {   
        if(isError) {
            if(error instanceof AppError){
                const {message, type} = error;
                
                console.log("[Load List] Erro: ", message);
                console.log("[Load List] Type: ", type);
                console.log("\n");
    
                setErrorType(type);
            }
            else {
                console.log("[Load List] Erro Desconhecido: ", error, "\n");
                setErrorType("UNKNOWN");
            }
        }
    }, [isError, error, setErrorType]);
}
