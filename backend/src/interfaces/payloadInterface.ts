import { JwtPayload } from "jsonwebtoken";

export interface payloadInterface extends JwtPayload {
    id: number,
    nome: string,
    usuario: "fornecedor" | "cliente",
} 