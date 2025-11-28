import { JwtPayload } from "jsonwebtoken";

// Tipos e interfaces que não consegui definir um tipo expecifico

export type queryFilter = {
    page: number;
    size: number;
    total: number;
    filter: string;
    totalPages?: number;
    search?: string;
    filterList?: string[]
};


export interface payloadInterface extends JwtPayload {
    id: number,
    nome: string,
    usuario: "fornecedor" | "cliente",
} 
