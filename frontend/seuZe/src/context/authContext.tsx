// Seguindo orientações da documentação Expo

import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from "react";
import { UserType } from "../types/userType";
import { useStorageState } from "../hooks/useStorageState";
import { registerLogoutAction, setAuthToken } from "../services/api";

export type AuthContextType = {
    signIn: (token: string, type: UserType) => void;
    signOut: () => void;
    isLoading: boolean;
    userType?: string | null; // Talvez alterar pra UserType | null
    session?: string | null;
}


const defaultAuthContext:AuthContextType = {
    signIn: () => null,
    signOut: () => null,
    session: null,
    userType: null,
    isLoading: false
}

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// Coleta informações de login do usuario
export function useSession(): AuthContextType{
    const value = useContext(AuthContext);

    // Verifica se e diferente do app de produção e se o value esta vazio
    if(process.env.NODE_ENV !== "production") {
        if(!value) {
            throw new Error("useSession deve ser encapsulado em <SessionProvider/>");   
        }
    }

    return value;
}

export function SessionProvider({children}: PropsWithChildren) {
    const [[isLoadingSession, session], setSession] = useStorageState("user_token");
    const [[isLoadingType, userType], setUserType] = useStorageState("user_type");


    // Testar
    const [isReady, setIsReady] = useState<boolean>(false);
    
    // if(!isLoadingSession)
    //     setAuthToken(session);

    const signOut = useCallback(() => {
        // Define como 
        setAuthToken(null);
        setSession(null);
        setUserType(null);
    }, [setSession, setUserType]);

    // Testar
    useEffect(() => {
        const start = performance.now();
        console.log(`[Session provider] Setando token em authToken...`);


        if(!isLoadingSession) {
            setAuthToken(session); // Interessa
            setIsReady(true); // Interessa
            
            // setTimeout(() => {
            //     setAuthToken(session);
            //     setIsReady(true);
            // }, 10000);
            console.log("Token setado: ", session);
        }
        

        console.log("[Session provider] Token setado");
        console.log("[Session provider] Token: ", session);
        const end = performance.now();
        const duration = end - start;
        console.log("[Session provider] Time: ", duration);
        console.log("\n");
        // console.log("COLOCA SESSAO");

    }, [session, isLoadingSession]);

    useEffect(() => {
        registerLogoutAction(signOut);
        // console.log("COLOCA SIGNFUNCITON");
    }, [signOut]);

    
    // Define loading se algum deles estiverem em execução, so para quando os dois terminarem
    // const isLoading = isLoadingSession || isLoadingType;
    const isLoading = isLoadingSession || isLoadingType || !isReady;

    return (
        <AuthContext.Provider
            value={{
                signIn: (token, type) => {
                    // Salvar o token e o tipo
                    // console.log("DENTRO DE AUTH CONTEXT")
                    setAuthToken(token);
                    setSession(token);
                    setUserType(type);
                },
                signOut,
                session, 
                userType,
                isLoading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
