import {z} from 'zod';

export const defaultRegisterSchema = z.object({
    nome: z
        .string({message: "Campo obrigatório"})
        .nonempty({message: "Campo obrigatório"})
        .regex(/^[a-zA-Z\s]+$/, "O nome não pode ter acentos, números ou caracteres especiais")
        .min(2, "Nome muito curto"),
    telefone: z
        .string({message: "Campo obrigatório"})
        .nonempty({message: "Campo obrigatório"})
        .min(10, "Telefone inválido")
        .max(15, "Telefone inválido"),
    apelido: z
        .string()
        .min(2, {message: "Apelido muito curto"})
        .or(z.literal(""))
        .optional(),
    
    senha: z
        .string({message: "Campo obrigatório"})
        .nonempty({message: "Campo obrigatório"})
        .min(8, "Senha deve conter no minimo 8 caracteres")
        .max(15, "Senha deve conter no maximo 15 caracteres")
        .refine((senha) => !senha.includes(" "), {message: "Senha não pode ter espaços"})
        .refine((senha) => /[a-zA-Z]/.test(senha), {message: "Senha deve conter pelo menos uma letra"})
        .refine((senha) => /[@\-_]/.test(senha), {message: "A senha deve conter pelo menos um caractere especial (@, -, _)"})
        .refine((senha) => /[0-9]/.test(senha), {message: "A senha deve conter pelo menos um número"})
        .refine((v) => /^[a-zA-Z0-9@\-_]+$/.test(v), {message: "Não pode conter caracteres invalidos ou letras com acento"}),
    
    confirmarSenha: z
        .string({message: "Campo obrigatório"})
        .nonempty({message: "Campo obrigatório"})
        .min(8, "Senha deve conter no minimo 8 caracteres")
        .max(15, "Senha deve conter no maximo 15 caracteres")
        .refine((senha) => !senha.includes(" "), {message: "Senha não pode ter espaços"})
        .refine((senha) => /[a-zA-Z]/.test(senha), {message: "Senha deve conter pelo menos uma letra"})
        .refine((senha) => /[@\-_]/.test(senha), {message: "A senha deve conter pelo menos um caractere especial (@, -, _)"})
        .refine((senha) => /[0-9]/.test(senha), {message: "A senha deve conter pelo menos um número"})
        .refine((v) => /^[a-zA-Z0-9@\-_]+$/.test(v), {message: "Não pode conter caracteres invalidos ou letras com acento"})
}).refine(data => data.senha === data.confirmarSenha, {
    message: "Senhas devem ser iguais", 
    path: ["confirmarSenha"]
});

export type DefaultRegisterSchema = z.infer<typeof defaultRegisterSchema>;