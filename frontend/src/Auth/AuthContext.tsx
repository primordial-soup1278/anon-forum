import {createContext, useContext, useEffect, useState} from "react";
import { supabase } from "./supabase";
import { create } from "domain";

interface AuthContextType {
    session: any;
}

const AuthContext = createContext<AuthContextType>({session: null});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const [session, setSession] = useState<any>(null);

    useEffect(() => {
        const getSession = async () => {
            const { data } = await supabase.auth.getSession();
            setSession(data.session);
        }
        getSession();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => {
            authListener.subscription.unsubscribe();
        }

    },[]);


    return (
        <AuthContext.Provider value={{session}}>
            {children}
        </AuthContext.Provider>
    );
}