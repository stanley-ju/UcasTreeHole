export interface loginRequest {
    student_number: string,
    password: string
}

export interface registerRequest {
    student_number: string,
    password: string
}

export interface queryPostRequest {
    student_number: string,
    startIndex: string,
    postNum: string
}

export interface submitPostRequest {
    student_number: string,
    content: string,
    quoteId: string
}