import {z} from 'zod';
import validator from "validator";

export const basicFormSchema = z.object({
    nome: z
        .string({message: "Campo obrigatório"})
        .nonempty({message: "Campo obrigatório"})
        .regex(/^[a-zA-Z\s]+$/, "O nome não pode ter acentos, números ou caracteres especiais")
        .min(2, "Nome muito curto"),
    telefone: z
        .string({message: "Campo obrigatório"})
        .nonempty({message: "Campo obrigatório"})
        .min(10, "Telefone inválido")
        .max(15, "Telefone inválido")
        .refine(tel => validator.isMobilePhone(tel, "pt-BR"), {message: "Telefone inválido"}),
    apelido: z
        .string()
        .min(2, {message: "Apelido muito curto"})
        .or(z.literal(""))
        .optional(),
});
export type BasicFormSchema = z.infer<typeof basicFormSchema>;


export const defaultRegisterSchema = basicFormSchema.safeExtend({
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


export const fornecedorRegisterSchema = defaultRegisterSchema.safeExtend({
        nomeEstabelecimento: z
                .string({message: "Campo obrigatório"})
                .nonempty({message: "Campo obrigatório"})
                .min(1, "Nome do estabelecimento muito curto"),
        logradouro: z
                .string({message: "Campo obrigatório"})
                .nonempty({message: "Campo obrigatório"})
                .min(5, "Endereço muito curto"),
        bairro: z
                .string({message: "Campo obrigatório"})
                .nonempty({message: "Campo obrigatório"}),
        uf: z
                .string({message: "Campo obrigatório"})
                .length(2, "UF deve conter 2 caracteres (AM, PA, AC...)")
                .regex(/^[A-Za-z]{2}$/, "UF deve conter apenas letras"),
        cep: z
                .string({message: "Campo obrigatório"})
                .nonempty({message: "Campo obrigatório"})
                .regex(/^\d{5}-?\d{3}$/, "CEP inválido"), // Aceita 12345678 ou 12345-678,
        numeroImovel: z
                .string({message: "Campo obrigatório"})
                .nonempty({message: "Campo obrigatório"})
                .regex(/^[A-Za-z0-9\-\/]+$/, "Número inválido"),

        complemento: z
                .string()
                .min(2, "Complemento muito curto")
                .or(z.literal(""))
                .optional(),
});

export type FornecedorRegisterSchema = z.infer<typeof fornecedorRegisterSchema>;


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
