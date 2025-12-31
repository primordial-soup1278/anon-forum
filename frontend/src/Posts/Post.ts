

export interface post {
    id?: number;
    authorId: string;
    title: string;
    message: string;
    upvotes: number;
    category: string;

}
export interface createPostRequest {
    boardId?: number;
    title: string;
    message: string;
    category: string;
    
}