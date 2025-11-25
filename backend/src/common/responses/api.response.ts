import { ApiResponseInterface } from "../../shared/interfaces/responseInterfaces";

const successResponse = <T>(message: string, data?: T): ApiResponseInterface<T> => ({
    status: "sucess",
    message,
    data,
});

const errorResponse = (message: string, errors?: any):ApiResponseInterface<null> => ({
    status: "error",
    message, 
    errors: errors instanceof Error ? errors.message : errors,
});

export {ApiResponseInterface, successResponse, errorResponse};
