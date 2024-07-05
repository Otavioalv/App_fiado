import { FastifyReply, FastifyRequest } from "fastify";
import { payloadInterface } from "../interfaces/payloadInterface";
import { getPayloadFromToken } from "../utils/tokenUtils";
import { productInterface } from "../interfaces/productInterface";
import { errorResponse, successResponse } from "../utils/response";
import {ProdutoModel} from "../models/ProdutoModel";
import { z } from "zod";
import { fornecedorInterface } from "../interfaces/fornecedorInterface";


class ProdutoController {
    private produtoModel:ProdutoModel = new ProdutoModel();

    public async addProducts(req: FastifyRequest, res: FastifyReply) {        
        try {
            const token: string = req.headers.authorization as string;
            const decodedToken: payloadInterface = await getPayloadFromToken(token);
            const id_fornecedor: number = decodedToken.id;

            const productSchema = z.object({
                nome: z.string().min(1, "Nome e obrigatorio"),
                preco: z.number().nonnegative("Insira um valor valido"),
                quantidade: z.number().nonnegative("Insira um valor valido")
            })
            const productArraySchema = z.array(productSchema);

            const datasProduct:productInterface[] = productArraySchema.parse(req.body);
                        
            await this.produtoModel.addProducts(datasProduct, id_fornecedor);

            res.status(201).send(successResponse("Produtos adicionados"));
        } catch (e) {
            if(e instanceof z.ZodError) {
                res.status(400).send(errorResponse("Parametros invalidos", e.errors[0].path));
            }
            res.status(500).send(errorResponse("Erro interno no servidor", e));
        }
    }

    public async listProducts(req: FastifyRequest, res: FastifyReply) {
        try {
            const {id_fornecedor} = req.body as fornecedorInterface;
            
            if(!id_fornecedor || typeof id_fornecedor != "number" || id_fornecedor < 0) {
               res.status(404).send(errorResponse("Parametros invalidos"));
            }

            res.status(200).send(successResponse("Produtos listados com sucesso"));

        } catch (e) {
            res.status(500).send(errorResponse("Erro interno no servidor", e));
        }
    }
}

export {ProdutoController}