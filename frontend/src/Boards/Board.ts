
// for reading a board
export interface Board {
    id?: number;
    ownerId: string;
    name : string;
    description : string;
    categories: string[];
    members: string[];
    createdAt: Date;
}

// for creating a board
export interface createBoardRequest {
    name : string;
    description : string;
    categories: string[];
    members : string[];
}