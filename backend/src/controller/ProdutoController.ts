import { FastifyReply, FastifyRequest } from "fastify";
import { payloadInterface } from "../interfaces/payloadInterface";
import { getPayloadFromToken, getTokenIdFromRequest } from "../utils/tokenUtils";
import { compraInterface, productInterface } from "../interfaces/productInterface";
import { errorResponse, successResponse } from "../utils/response";
import {ProdutoModel} from "../models/ProdutoModel";
import { unknown, z } from "zod";
import { queryFilter } from "../interfaces/clienteFornecedorInterface";
import { verifyQueryOptList } from "../utils/verifyQueryOptList";
import { isNumeric } from "validator";
import { ClienteFornecedorModel } from "../models/ClienteFornecedorModel";
import { idsPartnerInterface } from "../interfaces/idsFornecedorInterface";


class ProdutoController {
    private produtoModel:ProdutoModel = new ProdutoModel();
    private clienteFornecedorModel: ClienteFornecedorModel = new ClienteFornecedorModel();

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
            const {...filterOpt} = req.query as queryFilter;
            const id_fornecedor:number = await getTokenIdFromRequest(req);

            if(!filterOpt.search)
                filterOpt.search = "";

            if(!await verifyQueryOptList(filterOpt))
                return res.status(400).send(errorResponse("Um ou mais valores do filtro estão invalidos"));

            if(!id_fornecedor || typeof id_fornecedor != "number" || id_fornecedor < 0) {
               res.status(400).send(errorResponse("Parametros invalidos"));
               return;
            }

            const listProducts: productInterface[] = await this.produtoModel.listProducts(id_fornecedor, filterOpt);

            res.status(200).send(successResponse("Produtos listados com sucesso", {list: listProducts, pagination: filterOpt}));
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
                    res.status(400).send(errorResponse("Um ou mais produtos não foram encontrados"));
                    return;
                }    
            } 

            res.status(200).send(successResponse("Produto atualizado com sucesso"));
            return;
        } catch(e) {
            if(e instanceof z.ZodError) {
                return res.status(400).send(errorResponse("Parametros invalidos", e.errors[0].path));   
            }

            return res.status(500).send(errorResponse("Erro interno no servidor", e));
            
        }
    }

    public async deleteProduct(req: FastifyRequest, res: FastifyReply) {
        try {
            const dataIds = req.body as number[];
            const id_fornecedor: number = await getTokenIdFromRequest(req);

            for(const idProd of dataIds) {
                if(!idProd || typeof idProd != 'number' || idProd < 0) {
                    return res.status(400).send(errorResponse("Parametros invalidos"));
                }

                const result:boolean = await this.produtoModel.deleteProduct(idProd, id_fornecedor);

                if(!result) {
                    return res.status(400).send(errorResponse("Um ou mais Produtos não existem ou não foi possivel encontra-los"));
                }
            }
            
            return res.status(200).send(successResponse("Produto deletado com sucesso"));
        } catch(e) {
            return res.status(500).send(errorResponse("Error interno no servidor", e));
        } 
    }

    public async listProductsByIdFornecedor(req: FastifyRequest, res: FastifyReply) {
        try {
            const {...filterOpt} = req.query as queryFilter;
            const {idFornecedor} = req.params as {idFornecedor:string | undefined};

            if(!filterOpt.search)
                filterOpt.search = "";

            if(!await verifyQueryOptList(filterOpt))
                return res.status(400).send(errorResponse("Um ou mais valores do filtro estão invalidos"));

            if(!idFornecedor || !isNumeric(idFornecedor))
                return res.status(400).send(errorResponse("Parametros invalidos"));



            const listProduct = await this.produtoModel.listProducts(parseInt(idFornecedor), filterOpt);


            return res.status(200).send(successResponse("Produtos listados com sucesso", {list: listProduct, pagination: filterOpt}));
        } catch(e) {
            return res.status(500).send(errorResponse("Error interno no servidor", e));
        } 
    }

    public async buyProducts(req: FastifyRequest, res: FastifyReply) {
        try {
            const id_cliente: number = await getTokenIdFromRequest(req);
            let productData = await req.body as compraInterface[];

            // Verifica o tipo do dado
            if(!productData.length || !Array.isArray(productData)) {
                return res.status(400).send(errorResponse("Dados não preenchidos corretamente"));
            }

            // Verifica dados
            productData = await this.compraDataValidate(productData);

            // Verificar se cliente e fornecedor são associados
            const ids:number[] = [... new Set(productData.map(p => p.id_fornecedor))];

            for(const idFornecedor of ids) {
                if(!await this.clienteFornecedorModel.getPartnerAccepted(idFornecedor, id_cliente))
                    return res.status(400).send(errorResponse("Um ou mais usuarios não são associados"));
            }

            // Verificar se produto existe pelo id, e pegar os valores como nome, valor_unt
            const compraData:compraInterface[] = [];

            for(const pd of productData) {
                
                const produto:productInterface = await this.produtoModel.getProductExists(pd.id_produto, pd.id_fornecedor);

                if(!produto) {
                    return res.status(404).send(errorResponse("Algum produto foi deletado ou não existe"));
                }

                const compra: compraInterface = {
                    ...pd,
                    nome_produto: produto.nome.trim(),
                    valor_unit: produto.preco,
                    id_cliente: id_cliente
                }

                compraData.push(compra);
            }
            
            await this.produtoModel.addCompra(compraData);

            return res.status(200).send(successResponse("Compra solicitada com sucesso"));
        } catch(e) {
            console.log("Erro ao efeturar compra >>> ", e);

            if(Array.isArray(e))
                return res.status(404).send(errorResponse("Erro com dados recebidos", e));
        
            return res.status(500).send(errorResponse("Erro interno no servidor"));
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

    private async compraDataValidate(dataProd: compraInterface[]): Promise<compraInterface[]>{
        try {
            const today = new Date();
            const totalDate = new Date((today.getFullYear() + 100).toString());

            const compraSchema = z.object({
                id_produto: z.number().nonnegative("Insira um valor valido"), 
                id_fornecedor: z.number().nonnegative("Insira um valor valido"),
                prazo: z.coerce.date().min(today, "Data tem que ser maior do que a data de hoje").max(totalDate, "Diminua a quantidade de tempo"),
                quantidade: z.number().min(1, "Insira um valor valido")
            });
            const compraArraySchema = z.array(compraSchema);
            
            // const dataProd:compraInterface[] = compraArraySchema.parse(await req.body);
            
            // console.log("DSAf: ", dataProd);

            // console.log(dataProd);
            return compraArraySchema.parse(dataProd)
            // return compraArraySchema.parse(dataProd);
        } catch(e) {
            if(e instanceof z.ZodError){
                const formatted = e.errors.map(err => ({
                    path: err.path,
                    message: err.message
                }));

                throw formatted
            }
            throw new Error("Erro ao validar dados");
        }
    }
}

export {ProdutoController}