import { FastifyReply, FastifyRequest } from "fastify";
import { getTokenIdFromRequest } from "../shared/utils/tokenUtils";
import { compraInterface, productInterface } from "../shared/interfaces/productInterface";
import { errorResponse, successResponse } from "../common/responses/api.response";
import {ProdutoModel} from "../models/produto.model";
import { z } from "zod";
import { queryFilter } from "../shared/interfaces/utilsInterfeces";
import { verifyQueryOptList } from "../shared/utils/verifyQueryOptList";
import { isNumeric } from "validator";
import { ClienteFornecedorModel } from "../models/clienteFornecedor.model";
import { ClienteModel } from "../models/cliente.model";
import { NotificationCompraInput, NotificationInput } from "../shared/interfaces/notifierInterfaces";
import { Notifications } from "../common/messages/notifications";


class ProdutoController {
    private produtoModel:ProdutoModel = new ProdutoModel();
    private clienteFornecedorModel: ClienteFornecedorModel = new ClienteFornecedorModel();
    private clienteModel: ClienteModel = new ClienteModel();

    public async addProducts(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> {        
        try {
            const id_fornecedor: number = await getTokenIdFromRequest(req);

            let productData = req.body as productInterface[];
             // Verifica o tipo do dado
            if(!productData.length || !Array.isArray(productData)) {
                return res.status(400).send(errorResponse("Dados não preenchidos corretamente"));
            }

            // Verifica dados
            productData = await this.productShemaValidate(productData);
            
            await this.produtoModel.addProducts(productData, id_fornecedor);

            return res.status(201).send(successResponse("Produtos adicionados"));
        } catch (e) {
            console.log("Erro ao adicionar produto >>> ", e);

            if(Array.isArray(e))
                return res.status(404).send(errorResponse("Erro com dados recebidos", e));

            return res.status(500).send(errorResponse("Erro interno no servidor", e));
        }
    }

    public async listProducts(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> {
        try {
            const {...filterOpt} = req.query as queryFilter;
            const id_fornecedor:number = await getTokenIdFromRequest(req);

            if(!filterOpt.search)
                filterOpt.search = "";

            if(!await verifyQueryOptList(filterOpt))
                return res.status(400).send(errorResponse("Um ou mais valores do filtro estão invalidos"));

            if(!id_fornecedor || typeof id_fornecedor != "number" || id_fornecedor < 0) {
               return res.status(400).send(errorResponse("Parametros invalidos"));
               
            }

            const listProducts: productInterface[] = await this.produtoModel.listProducts(id_fornecedor, filterOpt);

            return res.status(200).send(successResponse("Produtos listados com sucesso", {list: listProducts, pagination: filterOpt}));
            
        } catch (e) {
            return res.status(500).send(errorResponse("Erro interno no servidor", e));
        }
    }

    public async updateProduct(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> {
        try {
            const id_fornecedor = await getTokenIdFromRequest(req);
            // const produtos = await this.productShemaValidate(req);
            let produtos = req.body as productInterface[];
             
            // Verifica o tipo do dado
            if(!produtos.length || !Array.isArray(produtos)) {
                return res.status(400).send(errorResponse("Dados não preenchidos corretamente"));
            }

            // Verifica dados
            produtos = await this.productShemaValidate(produtos);

            if(produtos.some(p => !p.id_produto)) {
                return res.status(400).send(errorResponse("Algum produto não pode ser identificado na lista corretamente"));
            }

            const ids = produtos.map(p => p.id_produto ?? 0);

            const existentes = await this.produtoModel.getManyProducts(ids, id_fornecedor);

            if(existentes.length !== produtos.length) {
                return res.status(400).send(errorResponse("Um ou mais produtos não existem"));
            }

            await this.produtoModel.updateManyProducts(produtos, id_fornecedor);

            return res.status(200).send(successResponse("Produtos atualizados com sucesso"));
        } catch (e) {
            console.log("Erro ao atualizar produtos >>> ", e);

            if(Array.isArray(e))
                return res.status(404).send(errorResponse("Erro com dados recebidos", e));
            
            return res.status(500).send(errorResponse("Erro interno no servidor"));
        }
    }

    public async deleteProduct(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply>{
        try {
            const dataIds = req.body as number[];
            const id_fornecedor: number = await getTokenIdFromRequest(req);

            if (!Array.isArray(dataIds) || dataIds.length === 0) {
                return res.status(400).send(errorResponse("Parametros invalidos"));
            }

            if (!dataIds.every(id => Number.isInteger(id) && id > 0)) {
                return res.status(400).send(errorResponse("Lista Invalida"));
            }

            const result = await this.produtoModel.deleteManyProducts(dataIds, id_fornecedor);

            if (!result) {
                return res.status(400).send(errorResponse("Nenhum produto encontrado para deletar"));
            }

            return res.status(200).send(successResponse("Produtos deletados com sucesso"));

        } catch (e) {
            return res.status(500).send(errorResponse("Erro interno no servidor", e));
        }
    }

    public async listProductsByIdFornecedor(req: FastifyRequest, res: FastifyReply):Promise<FastifyReply> {
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


            // Preparar enviar notificação
            const compraAgrupada = compraData.reduce<Record<number, compraInterface[]>>((acc, item) => {
                if(!acc[item.id_fornecedor]) {
                    acc[item.id_fornecedor] = [];
                }

                acc[item.id_fornecedor].push({
                    nome_produto: item.nome_produto,
                    id_fornecedor: item.id_fornecedor,
                    id_produto: item.id_produto,
                    quantidade: item.quantidade,
                    prazo: item.prazo
                });

                return acc;
            }, {});


            // Mandar notificação
            const notificationService = req.server.notificationService;
            const clienteData = await this.clienteModel.findUserById(id_cliente);

            for(const [id_fornecedor, compra] of Object.entries(compraAgrupada)) {
                // console.log(id_fornecedor, compra);

                const data: NotificationCompraInput = {
                    toId: id_fornecedor,
                    created_at: new Date(),
                    fromUserType: "cliente",
                    toUserType: "fornecedor",
                    user: {
                        id: parseInt(id_fornecedor),
                        nome: clienteData.nome,
                        apelido: clienteData.apelido
                    },
                    produtos: compra
                };
                
                await notificationService.saveAndSendPrepared
                    (Notifications.solicitarCompra(data),
                    data
                );
            };
            return res.status(200).send(successResponse("Compra solicitada com sucesso"));
        } catch(e) {
            console.log("Erro ao efeturar compra >>> ", e);

            if(Array.isArray(e))
                return res.status(404).send(errorResponse("Erro com dados recebidos", e));
        
            return res.status(500).send(errorResponse("Erro interno no servidor"));
        } 
    }

    

    private async productShemaValidate(dataProd: productInterface[]): Promise<productInterface[]>{
        try {
            const productSchema = z.object({
                id_produto: z.number().nonnegative("Insira um valor valido").optional(), 
                nome: z.string().min(1, "Nome e obrigatorio"),
                preco: z.number().nonnegative("Insira um valor valido"),
                quantidade: z.number().nonnegative("Insira um valor valido")
            })
            const productArraySchema = z.array(productSchema);

            return productArraySchema.parse(dataProd);
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
            
            return compraArraySchema.parse(dataProd)
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