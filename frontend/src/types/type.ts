export interface loginRequest {
    student_number: string,
    password: string
}

export interface registerRequest {
    student_number: string,
    password: string
}

export interface ResponseData<T> {
    data: T;
    respMessage: string;
}