import { supabase } from "../Auth/supabase";
import type { createPostRequest } from "./Post";
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

