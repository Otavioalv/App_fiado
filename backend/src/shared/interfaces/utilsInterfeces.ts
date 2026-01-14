import { JwtPayload } from "jsonwebtoken";

// Tipos e interfaces que não consegui definir um tipo expecifico

// Testar
export type Cursor = {
  value: string;
  id: number;
};

export type queryFilter = {
    page: number;
    size: number;
    total: number;
    filter: string;
    totalPages?: number;
    search?: string;
    filterList?: string[];


    cursor?: Cursor;
};

export type FilterListShop = "Mais Recente"| "Mais Antigo"| "Quitado"| "Pendente"| "Retirado"| "Aguardando Retirada"| "Aceito" | "Recusado" |"Em Analise" | "Cancelados";


export interface payloadInterface extends JwtPayload {
    id: number,
    nome: string,
    usuario: "fornecedor" | "cliente",
} 
