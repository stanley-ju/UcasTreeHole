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
    quoteId: string,
    file: any[]
}

export interface favoritePostRequest {
    student_number: string,
    postId: string,
    type: string
}

export interface submitCommentRequest {
    student_number: string,
    postId: string,
    content: string,
    replyId: string
}

export interface querySinglePostRequest {
    student_number: string,
    postId: string,
}

export interface queryPostWithKeywordRequest {
    student_number: string,
    startIndex: string,
    postNum: string,
    keyword: string
}

export interface queryHotListRequest {
    student_number: string,
    type: string,
    duration: string
}

export interface queryFavoritePostRequest {
    student_number: string,
    startIndex: string,
    postNum: string,
}

export interface queryUserPostRequest {
    student_number: string,
}

export interface changePasswordRequest {
    student_number: string,
    confirmPassword: string,
    newPassword: string,
}

export interface uploadAvatarRequest {
    student_number: string,
    avatar: any
}

export interface deleteUserPostRequest{
    student_number: string,
    postId: string,
}