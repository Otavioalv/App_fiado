import {z} from 'zod';
import { defaultRegisterSchema } from './DefaultRegisterSchema';

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