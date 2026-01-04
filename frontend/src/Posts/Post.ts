

export interface post {
    id: number;
    authorId: string;
    title: string;
    message: string;
    upVotes: number;
    category: string;
    comments: string[];
    createdAt: string;
    userHasUpvoted: boolean;

}
export interface createPostRequest {
    boardId?: number;
    title: string;
    message: string;
    category: string;
    
}