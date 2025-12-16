import { AxiosError, AxiosResponse } from "axios";

export interface responseAxiosInterfaces<T> extends AxiosResponse {
    data: {
        status: 'sucess'| 'error';
        message: string, 
        data?: T,
        errors?: string,
    }
}

export interface errorAxiosInterface extends AxiosError {
    response: responseAxiosInterfaces<null>
}