import { AxiosError, AxiosResponse } from "axios";

export interface responseAxiosInterfaces<T> extends AxiosResponse {
    data: {
        status: 'sucess'| 'error';
        message: string, 
        data?: T,
        errors?: string,
    }
}

export interface BackendResponse<T> {
    status: 'sucess'| 'error';
    message: string, 
    data?: T,
    errors?: string,
}

export type ResponseAxiosInterfaces<T> = AxiosResponse<T> & {
    data: BackendResponse<T>
};


export interface errorAxiosInterface extends AxiosError {
    response: responseAxiosInterfaces<null>
}


export interface ErrorAxiosInterface extends AxiosError {
    response: responseAxiosInterfaces<null>
}