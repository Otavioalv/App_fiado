// Seguindo orientações da documentação Expo

import { createContext, PropsWithChildren, useContext } from "react";
import { UserType } from "../types/userType";
import { useStorageState } from "../hooks/useStorageState";

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

    // Define loading se algum deles estiverem em execução, so para quando os dois terminarem
    const isLoading = isLoadingSession || isLoadingType;

    return (
        <AuthContext.Provider
            value={{
                signIn: (token, type) => {
                    // Salvar o token e o tipo
                    // console.log("DENTRO DE AUTH CONTEXT")
                    setSession(token);
                    setUserType(type);
                },
                signOut: () => {
                    // Define como null
                    setSession(null);
                    setUserType(null);
                },
                session, 
                userType,
                isLoading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
