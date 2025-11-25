export interface ApiResponseInterface<T> {
    status: 'sucess'| 'error';
    message: string;
    data?: T;
    errors?: any
}
