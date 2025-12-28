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