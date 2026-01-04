import { supabase } from "../Auth/supabase";
import type { createPostRequest } from "./Post";
import type { createCommentRequest } from "./Comment";
export const createPost = async (boardID: number, post : createPostRequest) => {
    const { data : { session } } = await supabase.auth.getSession();
    console.log("SESSION IN REQ: ", session);

    if (!session) {
        throw new Error("User not authenticated");
    }

    const res = await fetch(`${import.meta.env.VITE_REACT_APP_POST_BASE_URL}/create-post`, {
        method: "POST",
        headers: {
            "content-type" : "application/json",
            Authorization : `Bearer ${session.access_token}`,
        },
        body : JSON.stringify(post)
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error("Backend error response:", errorText);
        console.error("Status:", res.status, res.statusText);
        throw new Error(`Failed to create post: ${res.status} ${res.statusText} - ${errorText}`);
    }
   
    return await res.json();
}


export const getPostsByBoardId = async (boardId : number) => {

    console.log("FETCHING POSTS FOR BOARD ID: ", boardId);
    const res = await fetch(`${import.meta.env.VITE_REACT_APP_POST_BASE_URL}/${boardId}/get-board-posts`,  {
        method: "GET",
        headers: {
            "content-type" : "application/json"
        }
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error("Backend error response:", errorText);
        console.error("Status:", res.status, res.statusText);
        throw new Error(`Failed to fetch posts: ${res.status} ${res.statusText} - ${errorText}`);
    }

    return await res.json();
}
export const getPostById = async (postId : number) => {
    const res = await fetch(`${import.meta.env.VITE_REACT_APP_POST_BASE_URL}/${postId}/get-post-by-id`,  {
        method: "GET",
        headers: {
            "content-type" : "application/json"
        }
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error("Backend error response:", errorText);
        console.error("Status:", res.status, res.statusText);
        throw new Error(`Failed to fetch post: ${res.status} ${res.statusText} - ${errorText}`);
    }

    return await res.json();
}

export const getCommentsByPostId = async (postId : number) => {

    const res = await fetch(`${import.meta.env.VITE_REACT_APP_COMMENT_BASE_URL}/${postId}/comment`, {
        method: "GET",
        headers: {
            "content-type" : "application/json"
        }
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error("Backend error response:", errorText);
        console.error("Status:", res.status, res.statusText);
        throw new Error(`Failed to fetch comments: ${res.status} ${res.statusText} - ${errorText}`);
    }

    return await res.json();
}


export const createComment = async (postId : number, comment : createCommentRequest) => {

    const { data : { session } } = await supabase.auth.getSession();

    if (!session) {
        throw new Error("User not authenticated");
    }

    const res = await fetch(`${import.meta.env.VITE_REACT_APP_COMMENT_BASE_URL}/${postId}/comment`, {
        method: "POST",
        headers: {
            "content-type" : "application/json",
            Authorization : `Bearer ${session.access_token}`,
        },
        body : JSON.stringify(comment)
    });
    if (!res.ok) {
        const errorText = await res.text();
        console.error("Backend error response:", errorText);
        console.error("Status:", res.status, res.statusText);
        throw new Error(`Failed to create comment: ${res.status} ${res.statusText} - ${errorText}`);
    }
    return await res.json();
}

export const voteOnPost = async (postId : number) => {
    const { data : { session } } = await supabase.auth.getSession();

    if (!session) {
        throw new Error("User not authenticated");
    }

    const res = await fetch(`${import.meta.env.VITE_REACT_APP_VOTE_BASE_URL}/${postId}`, {
        method: "POST",
        headers: {
            "content-type" : "application/json",
            Authorization : `Bearer ${session.access_token}`,
        }
    });

    if(!res.ok) {
        const errorText = await res.text();
        console.error("Backend error response:", errorText);
        console.error("Status:", res.status, res.statusText);
        throw new Error(`Failed to vote on post: ${res.status} ${res.statusText} - ${errorText}`);
    }

    return await res.json();

}