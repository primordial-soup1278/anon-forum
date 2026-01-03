
export interface createCommentRequest {
    content: string;
}

export interface comment {
    id: number;
    content: string;
    authorId: string;
    createdAt: string;
}

