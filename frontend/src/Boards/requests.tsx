import type {createBoardRequest}  from "./Board";
import { supabase } from "../Auth/supabase";

export const createBoard = async (board : createBoardRequest) => {
    const {data : { session }} = await supabase.auth.getSession();
    console.log("SESSION IN REQ: ", session);

    if (!session) {
        throw new Error("User not authenticated");
    }

    const res = await fetch(`${import.meta.env.VITE_REACT_APP_BOARD_BASE_URL}/create-board`,{
        method: "POST",
        headers: {
            "content-type" : "application/json",
            Authorization : `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(board),
    });
    if (!res.ok) {
        const errorText = await res.text();
        console.error("Backend error response:", errorText);
        console.error("Status:", res.status, res.statusText);
        throw new Error(`Failed to create board: ${res.status} ${res.statusText} - ${errorText}`);
    }

    return await res.json();
}

// this request does not require authentication
export const getAllBoards = async () => {
    const res = await fetch(`${import.meta.env.VITE_REACT_APP_BOARD_BASE_URL}/get-all-board`, {
        method: "GET",
        headers: {
            "content-type" : "application/json",
        }
    });

    if(!res.ok) {
        const errorText = await res.text();
        console.error("Backend error response:", errorText);
        console.error("Status:", res.status, res.statusText);
        throw new Error(`Failed to fetch boards: ${res.status} ${res.statusText} - ${errorText}`);
    }

    // returns an array of boards
    return await res.json();
}

export const getBoardById = async (boardId : number) => {
    const res = await fetch(`${import.meta.env.VITE_REACT_APP_BOARD_BASE_URL}/${boardId}/get-board`, {
        method: "GET",
        headers: {
            "content-type" : "application/json",
        }
    });

    if(!res.ok) {
        const errorText = await res.text();
        console.error("Backend error response:", errorText);
        console.error("Status:", res.status, res.statusText);
        throw new Error(`Failed to fetch board: ${res.status} ${res.statusText} - ${errorText}`);
    }

    return await res.json();
}

export const subscribeToBoard = async (boardId : number) => {
    const {data : { session }} = await supabase.auth.getSession();

    if(!session) {
        throw new Error("User not authenticated");
    }

    const res = await fetch(`${import.meta.env.VITE_REACT_APP_BOARD_BASE_URL}/${boardId}/subscribe`, {
        method: "POST",
        headers : {
            "content-type" : "application/json",
            "Authorization" : `Bearer ${session.access_token}`,
        }
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error("Backend error response:", errorText);
        console.error("Status:", res.status, res.statusText);
        throw new Error(`Failed to subscribe to board: ${res.status} ${res.statusText} - ${errorText}`);
    }

    return await res.json();
}