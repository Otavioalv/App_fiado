import { FastifyReply, FastifyRequest } from "fastify";
import { payloadInterface } from "../interfaces/payloadInterface";
import { getPayloadFromToken, getTokenIdFromRequest } from "../utils/tokenUtils";
import { productInterface } from "../interfaces/productInterface";
import { errorResponse, successResponse } from "../utils/response";
import {ProdutoModel} from "../models/ProdutoModel";
import { z } from "zod";


class ProdutoController {
    private produtoModel:ProdutoModel = new ProdutoModel();

    public async addProducts(req: FastifyRequest, res: FastifyReply) {        
        try {
            const id_fornecedor: number = await getTokenIdFromRequest(req);
            const datasProduct: productInterface[] = await this.productShemaValidate(req);
            
            await this.produtoModel.addProducts(datasProduct, id_fornecedor);

            res.status(201).send(successResponse("Produtos adicionados"));
            return;
        } catch (e) {
            if(e instanceof z.ZodError) {
                res.status(400).send(errorResponse("Parametros invalidos", e.errors[0].path));
                return;
            }
            res.status(500).send(errorResponse("Erro interno no servidor", e));
            return;
        }
    }

    public async listProducts(req: FastifyRequest, res: FastifyReply) {
        try {
            // const {id_fornecedor} = await await req.body as fornecedorInterface;
            const id_fornecedor:number = await getTokenIdFromRequest(req);

            if(!id_fornecedor || typeof id_fornecedor != "number" || id_fornecedor < 0) {
               res.status(404).send(errorResponse("Parametros invalidos"));
               return;
            }

            const listProducts: productInterface[] = await this.produtoModel.listProducts(id_fornecedor);

            res.status(200).send(successResponse("Produtos listados com sucesso", {produto: listProducts}));
            return;
        } catch (e) {
            res.status(500).send(errorResponse("Erro interno no servidor", e));
            return;
        }
    }

    public async updateProtuct(req: FastifyRequest, res: FastifyReply) {
        try {
            const id_fornecedor: number = await getTokenIdFromRequest(req);
            const datasProduct: productInterface[] = await this.productShemaValidate(req);

            if(datasProduct.length > 1) {
                res.status(400).send(errorResponse("Somente um produto por vez"));
                return;
            }

            const result:boolean = await this.produtoModel.updateProtucts(datasProduct, id_fornecedor);

            if(!result) {
                res.status(404).send(errorResponse("Produto não existe ou não foi possivel encontra-lo"));
                return;
            }

            res.status(200).send(successResponse("Produto atualizado com sucesso"));
            return;
        } catch (e) {
            if(e instanceof z.ZodError) {
                res.status(400).send(errorResponse("Parametros invalidos", e.errors[0].path));
                return;
            }
            res.status(500).send(errorResponse("Erro interno no servidor", e));
            return;
        }
    }

    public async deleteProduct(req: FastifyRequest, res: FastifyReply) {
        try {
            const {id_produto} = req.body as productInterface;
            const id_fornecedor: number = await getTokenIdFromRequest(req);

            if(!id_produto || typeof id_produto != 'number' || id_produto < 0) {
                res.status(404).send(errorResponse("Parametros invalidos"));
                return 
            }

            const result:boolean = await this.produtoModel.deleteProduct(id_produto, id_fornecedor);

            if(!result) {
                res.status(404).send(errorResponse("Produto não existe ou não foi possivel encontra-lo"));
                return;
            }
            
            res.status(200).send(successResponse("Produto deletado com sucesso"));
            return;
        } catch(e) {
            res.status(500).send(errorResponse("Error interno no servidor", e));
            return;
        } 
    }

    private async productShemaValidate(req: FastifyRequest): Promise<productInterface[]>{
        try {
            const productSchema = z.object({
                id_produto: z.number().nonnegative("Insira um valor valido").optional(), 
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
}

export {ProdutoController}