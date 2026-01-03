

export interface post {
    id?: number;
    authorId: string;
    title: string;
    message: string;
    upVotes: number;
    category: string;
    comments: string[];
    createdAt: string;

}
export interface createPostRequest {
    boardId?: number;
    title: string;
    message: string;
    category: string;
    
}