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
            const id_fornecedor: number = await this.getIdFornecedorFromToken(req);
            const datasProduct: productInterface[] = await this.productShemaValidate(req);
            
            await this.produtoModel.addProducts(datasProduct, id_fornecedor);

            res.status(201).send(successResponse("Produtos adicionados"));
        } catch (e) {
            if(e instanceof z.ZodError) {
                res.status(400).send(errorResponse("Parametros invalidos", e.errors[0].path));
                return;
            }
            res.status(500).send(errorResponse("Erro interno no servidor", e));
        }
    }

    public async listProducts(req: FastifyRequest, res: FastifyReply) {
        try {
            const {id_fornecedor} = await await req.body as fornecedorInterface;
            
            if(!id_fornecedor || typeof id_fornecedor != "number" || id_fornecedor < 0) {
               res.status(404).send(errorResponse("Parametros invalidos"));
               return;
            }

            const listProducts: productInterface[] = await this.produtoModel.listProducts(id_fornecedor);

            res.status(200).send(successResponse("Produtos listados com sucesso", listProducts));
        } catch (e) {
            res.status(500).send(errorResponse("Erro interno no servidor", e));
        }
    }

    public async updateProtucts(req: FastifyRequest, res: FastifyReply) {
        try {
            const id_fornecedor: number = await this.getIdFornecedorFromToken(req);
            const datasProduct: productInterface[] = await this.productShemaValidate(req);

            await this.produtoModel.updateProtucts(datasProduct, id_fornecedor);

            res.status(200).send(successResponse("Produto atualizado com sucesso"));
        } catch (e) {
            res.status(500).send(errorResponse("Erro interno no servidor", e));
        }
    }

    private async productShemaValidate(req: FastifyRequest): Promise<productInterface[]>{
        try {
            const productSchema = z.object({
                nome: z.string().min(1, "Nome e obrigatorio"),
                preco: z.number().nonnegative("Insira um valor valido"),
                quantidade: z.number().nonnegative("Insira um valor valido")
            })
            const productArraySchema = z.array(productSchema);
    
            const datasProduct:productInterface[] = productArraySchema.parse(await req.body);
    
            return datasProduct;
        } catch(e) {
            if(e instanceof z.ZodError){
                throw e;
            }
            throw new Error("Erro ao validar dados");
        }
    }

    private async getIdFornecedorFromToken(req: FastifyRequest): Promise<number>{
        try {
            const token: string = req.headers.authorization as string;
            const decodedToken: payloadInterface = await getPayloadFromToken(token);
            const id_fornecedor: number = decodedToken.id;

            return id_fornecedor;
        } catch(e) {
            throw new Error("Erro ao recuperar id");
        }
    }
}

export {ProdutoController}