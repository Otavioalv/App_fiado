import { FastifyReply, FastifyRequest } from "fastify";
import { payloadInterface } from "../interfaces/payloadInterface";
import { getPayloadFromToken, getTokenIdFromRequest } from "../utils/tokenUtils";
import { productInterface } from "../interfaces/productInterface";
import { errorResponse, successResponse } from "../utils/response";
import {ProdutoModel} from "../models/ProdutoModel";
import { z } from "zod";


class ProdutoController {
    private produtoModel:ProdutoModel = new ProdutoModel();

    public async addProducts(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> {        
        try {
            const id_fornecedor: number = await getTokenIdFromRequest(req);
            const datasProduct: productInterface[] = await this.productShemaValidate(req);
            
            await this.produtoModel.addProducts(datasProduct, id_fornecedor);

            return res.status(201).send(successResponse("Produtos adicionados"));
            
        } catch (e) {
            if(e instanceof z.ZodError) {
                return res.status(400).send(errorResponse("Parametros invalidos", e.errors[0].path));
                
            }
            return res.status(500).send(errorResponse("Erro interno no servidor", e));
            
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
            
            for(const prod of datasProduct) {
                const result:boolean = await this.produtoModel.updateProtucts([prod], id_fornecedor);

                if(!result) {
                    res.status(404).send(errorResponse("Um ou mais produtos não foram encontrados"));
                    return;
                }    
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
            const dataIds = req.body as number[];
            const id_fornecedor: number = await getTokenIdFromRequest(req);

            for(const idProd of dataIds) {
                if(!idProd || typeof idProd != 'number' || idProd < 0) {
                    return res.status(404).send(errorResponse("Parametros invalidos"));
                }

                const result:boolean = await this.produtoModel.deleteProduct(idProd, id_fornecedor);

                if(!result) {
                    return res.status(404).send(errorResponse("Um ou mais Produtos não existem ou não foi possivel encontra-los"));
                }
            }
            
            return res.status(200).send(successResponse("Produto deletado com sucesso"));
        } catch(e) {
            return res.status(500).send(errorResponse("Error interno no servidor", e));
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