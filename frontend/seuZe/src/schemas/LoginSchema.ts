import z from "zod";


export const loginSchema = z.object({
    nome: z
        .string({message: "Campo obrigatório"})
        .nonempty({message: "Campo obrigatório"})
        .min(2, "Nome muito curto"),
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
})

export type LoginSchema = z.infer<typeof loginSchema>;