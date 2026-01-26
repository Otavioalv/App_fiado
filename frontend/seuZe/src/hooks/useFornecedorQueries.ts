import { useMutation } from "@tanstack/react-query";
import { login, register } from "../services/fornecedorService";
import { FornecedorRegisterSchema } from "../schemas/FornecedorRegisterSchema";
import { LoginSchema } from "../schemas/LoginSchema";


export function useRegister() {
    return useMutation<boolean, any, FornecedorRegisterSchema>({
        mutationFn: async (data) => {
            return await register(data);
        },
        networkMode: "always",
        onSuccess: (s) => {
            console.log(s);
        }
    });
}

export function useLogin() {
    // Testar erro tipo any
    return useMutation<string | null, any, LoginSchema>({
        mutationFn: async (data) => {
            return await login(data);
        },
        networkMode: 'always',
        onSuccess: (s) => {
            console.log(s);
        }
    });
}
