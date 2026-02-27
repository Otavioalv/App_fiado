import { FastifyReply, FastifyRequest } from "fastify";
import { getTokenIdFromRequest } from "../shared/utils/tokenUtils";
import { AllShoppingStatusType, compraInterface, productInterface, ShoppingStatusType } from "../shared/interfaces/productInterface";
import { errorResponse, successResponse } from "../common/responses/api.response";
import {ProdutoModel} from "../models/produto.model";
import { z } from "zod";
import { FilterListShop, queryFilter } from "../shared/interfaces/utilsInterfeces";
import { verifyQueryOptList } from "../shared/utils/verifyQueryOptList";
import { isNumeric } from "validator";
import { ClienteFornecedorModel } from "../models/clienteFornecedor.model";
import { ClienteModel } from "../models/cliente.model";
import { NotificationCompraInput, NotificationInput, UserType } from "../shared/interfaces/notifierInterfaces";
import { Notifications } from "../common/messages/notifications";
import { FornecedorModel } from "../models/fornecedor.model";
import { ResponseApi } from "../shared/consts/responseApi";
import { TypesListUser } from "../shared/interfaces/userInterfaces";


class ProdutoController {
    private produtoModel:ProdutoModel = new ProdutoModel();
    private clienteFornecedorModel: ClienteFornecedorModel = new ClienteFornecedorModel();
    private clienteModel: ClienteModel = new ClienteModel();
    private fornecedorModel: FornecedorModel = new FornecedorModel();

    public async addProducts(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> {        
        try {
            const id_fornecedor: number = await getTokenIdFromRequest(req);

            let productData = req.body as productInterface[];
             // Verifica o tipo do dado
            if(!productData.length || !Array.isArray(productData)) {
                return res.status(400).send(errorResponse(ResponseApi.Validation.REQUIRED_FIELDS));
            }

            // Verifica dados
            productData = await this.productShemaValidate(productData);
            
            await this.produtoModel.addProducts(productData, id_fornecedor);

            return res.status(201).send(successResponse(ResponseApi.Product.ADD_SUCCESS));
        } catch (e) {
            console.log("Erro ao adicionar produto >>> ", e);

            if(Array.isArray(e))
                return res.status(404).send(errorResponse(ResponseApi.Validation.INVALID_DATA, e));

            return res.status(500).send(errorResponse(ResponseApi.Server.INTERNAL_ERROR, e));
        }
    }

    public async listProducts(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> {
        try {
            interface QueryToIds {
                idCliente?: string, 
                idProduct?: string,
            }

            const {
                idCliente,
                idProduct,
                ...filterOpt
            } = req.query as queryFilter & QueryToIds;

            const {typeList} = req.params as {typeList: string | undefined};
            const id_fornecedor:number = await getTokenIdFromRequest(req);


            
            if(!filterOpt.search)
                filterOpt.search = "";

            if(!await verifyQueryOptList(filterOpt))
                return res.status(400).send(errorResponse(ResponseApi.Validation.INVALID_FILTER));

            if(!id_fornecedor || typeof id_fornecedor != "number" || id_fornecedor < 0) {
               return res.status(400).send(errorResponse(ResponseApi.Validation.INVALID_FORMAT));
            }

            const listProducts: productInterface[] = await this.produtoModel.listProducts(id_fornecedor, filterOpt);

            return res.status(200).send(successResponse(ResponseApi.Product.LIST_SUCCESS, {list: listProducts, pagination: filterOpt}));
            
        } catch (e) {
            return res.status(500).send(errorResponse(ResponseApi.Server.INTERNAL_ERROR, e));
        }
    }

    public async updateProduct(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> {
        try {
            const id_fornecedor = await getTokenIdFromRequest(req);
            // const produtos = await this.productShemaValidate(req);
            let produtos = req.body as productInterface[];

            // console.log(id_fornecedor);
             
            // Verifica o tipo do dado
            if(!produtos.length || !Array.isArray(produtos)) {
                return res.status(400).send(errorResponse(ResponseApi.Validation.REQUIRED_FIELDS));
            }

            // Verifica dados
            produtos = await this.productShemaValidate(produtos);
            
            // console.log(produtos);

            if(produtos.some(p => !p.id_produto)) {
                return res.status(400).send(errorResponse(ResponseApi.Product.NOT_FOUND));
            }

            const ids = produtos.map(p => p.id_produto ?? 0);

            const existentes = await this.produtoModel.getManyProducts(ids, id_fornecedor);

            if(existentes.length !== produtos.length) {
                return res.status(400).send(errorResponse(ResponseApi.Product.NOT_EXIST));
            }

            await this.produtoModel.updateManyProducts(produtos, id_fornecedor);

            return res.status(200).send(successResponse(ResponseApi.Product.UPDATE_SUCCESS));
        } catch (e) {
            console.log("Erro ao atualizar produtos >>> ", e);

            if(Array.isArray(e))
                return res.status(404).send(errorResponse(ResponseApi.Validation.INVALID_DATA, e));
            
            return res.status(500).send(errorResponse(ResponseApi.Server.INTERNAL_ERROR));
        }
    }

    public async deleteProduct(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply>{
        try {
            const dataIds = req.body as number[];
            const id_fornecedor: number = await getTokenIdFromRequest(req);

            if (!Array.isArray(dataIds) || dataIds.length === 0) {
                return res.status(400).send(errorResponse(ResponseApi.Validation.INVALID_DATA));
            }

            if (!dataIds.every(id => Number.isInteger(id) && id > 0)) {
                return res.status(400).send(errorResponse("Lista Invalida"));
            }

            const result = await this.produtoModel.deleteManyProducts(dataIds, id_fornecedor);

            if (!result) {
                return res.status(400).send(errorResponse(ResponseApi.Product.ALL_NOT_FOUND));
            }

            return res.status(200).send(successResponse(ResponseApi.Product.DELETE_SUCCESS));

        } catch (e) {
            return res.status(500).send(errorResponse(ResponseApi.Server.INTERNAL_ERROR, e));
        }
    }

    public async listProductsByIdFornecedor(req: FastifyRequest, res: FastifyReply):Promise<FastifyReply> {
        try {
            interface QueryToIds {
                idFornecedor?: string, 
                idProduct?: string,
            }

            const {
                idFornecedor, 
                idProduct, 
                ...filterOpt
            } = req.query as queryFilter & QueryToIds;

            const {typeList} = req.params as {typeList: string | undefined};
            const idCliente:number = await getTokenIdFromRequest(req);

            if(!idCliente) {
                return res.status(400).send(errorResponse(ResponseApi.Partner.LIST_ERROR));
            }
            
            filterOpt.filterList = ["Nome do Fornecedor", "Apelido", "Estabelecimento", "Nome do Produto"];
            if(!filterOpt.filter)
                filterOpt.filter = "Nome do Produto";

            const TYPES = ["accepted", "all", "none", "received", "sent"] as TypesListUser[];
            const lowTypeList = typeList ? typeList?.toLocaleLowerCase() : "all";
            if(!TYPES.includes(lowTypeList as TypesListUser)){
                return res.status(400).send(errorResponse(ResponseApi.Validation.INVALID_FILTER))
            };

            if(!await verifyQueryOptList(filterOpt))
                return res.status(400).send(errorResponse(ResponseApi.Validation.INVALID_FILTER));


            let fornecedorIdNum: number | undefined;
            let productIdNum: number | undefined;

            
            if(idFornecedor) {
                fornecedorIdNum = Number(idFornecedor);
                if(Number.isNaN(fornecedorIdNum)) { 
                    return res.status(400).send(errorResponse(ResponseApi.Validation.INVALID_FILTER));
                }
            }

            if(idProduct) {
                productIdNum = Number(idProduct);
                if(Number.isNaN(productIdNum)) { 
                    return res.status(400).send(errorResponse(ResponseApi.Validation.INVALID_FILTER));
                }
            }

            const listProduct = await this.produtoModel.listProductsByIdFornecedor(idCliente, filterOpt, typeList as TypesListUser, fornecedorIdNum, productIdNum);

            // console.log(fornecedorIdNum, filterOpt, typeList, idCliente);

            return res
                .status(200)
                .send(
                    successResponse(
                        ResponseApi.Product.LIST_SUCCESS,
                        {
                            list: listProduct, 
                            pagination: filterOpt
                        }
                    )
                );
        } catch(e) {
            return res.status(500).send(errorResponse(ResponseApi.Server.INTERNAL_ERROR, e));
        } 
    }

    public async cartList(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> {
        try {
            const {...filterOpt} = req.query as queryFilter;
            const idCliente:number = await getTokenIdFromRequest(req);

            if(!filterOpt.search)
                filterOpt.search = "";

            if(!await verifyQueryOptList(filterOpt))
                return res.status(400).send(errorResponse(ResponseApi.Validation.INVALID_FILTER));

            if(!idCliente || typeof idCliente != "number" || idCliente < 0) {
               return res.status(400).send(errorResponse(ResponseApi.Validation.INVALID_FORMAT));
            }

            const listCartResult = await this.produtoModel.listCart(idCliente, filterOpt);

            return res
            .status(200)
            .send(
                successResponse(
                    ResponseApi.Cart.LIST_SUCCESS,
                    { 
                        list: listCartResult,
                        pagination: filterOpt,
                    }
                )
            );

            
        } catch (e) {
            return res.status(500).send(errorResponse(ResponseApi.Server.INTERNAL_ERROR, e));
        }
    }

    public async cartAdd(req: FastifyRequest, res: FastifyReply) {
        try {
            const id_cliente: number = await getTokenIdFromRequest(req);
            let data = req.body as compraInterface[];

            // Verifica o tipo do dado
            if(!Array.isArray(data)) {
                return res.status(400).send(errorResponse(ResponseApi.Validation.REQUIRED_FIELDS));
            }

            // Verifica dados, quantidade, data, etc. Se der erro, vai pro catch
            data = await this.compraDataValidate(data);

            // Verificar se cliente e fornecedor são associados
            const ids:number[] = [... new Set(data.map(p => p.id_fornecedor))];

            for(const idFornecedor of ids) {
                if(!await this.clienteFornecedorModel.getPartnerAccepted(idFornecedor, id_cliente))
                    return res.status(400).send(errorResponse(ResponseApi.Partner.NOT_PARTNER));
            }

            // Verificar se produto existe pelo id, e pegar os valores como nome, valor_unt
            const compraData:compraInterface[] = [];
            
            for(const pd of data) {
                const produto:productInterface = await this.produtoModel.getProductExists(pd.id_compra, pd.id_fornecedor);
                // console.log(produto);

                if(!produto) {
                    return res.status(404).send(errorResponse(ResponseApi.Product.NOT_FOUND));
                }

                const compra: compraInterface = {
                    ...pd,
                    nome_produto: produto.nome_prod.trim(),
                    valor_unit: produto.preco,
                    id_cliente: id_cliente
                }

                compraData.push(compra);
            }


            await this.produtoModel.addToCart(data, id_cliente);
            // Definir resposta depois
            return res.status(200).send(successResponse(ResponseApi.Cart.ADD_SUCCESS));
        } catch(e) {
            return res.status(500).send(errorResponse(ResponseApi.Server.INTERNAL_ERROR, e));
        }
    }

    public async buyProducts(req: FastifyRequest, res: FastifyReply) {
        try {
            const id_cliente: number = await getTokenIdFromRequest(req);
            let productData = await req.body as compraInterface[];

            /* 
            Ao inves de passar array de produtos, ele so coleta direto do carrinho de compras
            */

            // Verifica o tipo do dado
            if(!productData.length || !Array.isArray(productData)) {
                return res.status(400).send(errorResponse(ResponseApi.Validation.REQUIRED_FIELDS));
            }

            // Verifica dados
            productData = await this.compraDataValidate(productData);

            // Verificar se cliente e fornecedor são associados
            const ids:number[] = [... new Set(productData.map(p => p.id_fornecedor))];

            for(const idFornecedor of ids) {
                if(!await this.clienteFornecedorModel.getPartnerAccepted(idFornecedor, id_cliente))
                    return res.status(400).send(errorResponse(ResponseApi.Partner.NOT_PARTNER));
            }

            // Verificar se produto existe pelo id, e pegar os valores como nome, valor_unt
            const compraData:compraInterface[] = [];
            
            
            for(const pd of productData) {
                const produto:productInterface = await this.produtoModel.getProductExists(pd.id_compra, pd.id_fornecedor);
                console.log(produto);

                if(!produto) {
                    return res.status(404).send(errorResponse(ResponseApi.Product.NOT_FOUND));
                }

                const compra: compraInterface = {
                    ...pd,
                    nome_produto: produto.nome_prod.trim(),
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
                    id_compra: item.id_compra,
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
            return res.status(200).send(successResponse(ResponseApi.Purchace.PURCHACE_REQUEST_SENT));
        } catch(e) {
            console.log("Erro ao efeturar compra >>> ", e);

            if(Array.isArray(e))
                return res.status(404).send(errorResponse(ResponseApi.Validation.INVALID_DATA, e));
        
            return res.status(500).send(errorResponse(ResponseApi.Server.INTERNAL_ERROR));
        } 
    }

    public async buyProduct2(req: FastifyRequest, res: FastifyReply) {
        try {
            const id_cliente: number = await getTokenIdFromRequest(req);

            await this.produtoModel.finalizarCompra(id_cliente);

            return res.status(200).send(
                successResponse(ResponseApi.Purchace.PURCHACE_REQUEST_SENT)
            );

        } catch (e: any) {
            // console.error("Erro ao finalizar compra >>>", e);

            if (e.code === 'P0001') {
                return res.status(400).send(
                    errorResponse(ResponseApi.Validation.INVALID_DATA, e.message)
                );
            }

            return res.status(500).send(
                errorResponse(ResponseApi.Server.INTERNAL_ERROR)
            );
        }
    }

    public async totalCart(req: FastifyRequest, res: FastifyReply) {
        try{
            const id_cliente: number = await getTokenIdFromRequest(req);

            const totalCart = await this.produtoModel.totalCart(id_cliente);

            return res.status(200).send(
                successResponse(ResponseApi.Cart.LIST_SUCCESS, {totalCart: totalCart})
            );

        }catch(e: any) {
            return res.status(500).send(errorResponse(ResponseApi.Server.INTERNAL_ERROR));
        }

    }

    public async shopList(req: FastifyRequest, res: FastifyReply, userType: UserType):Promise<void> {
        try{
            interface QueryToIds {
                toIdUser?: string, 
                idCompra?: string,
            }

            const fromIdUser = await getTokenIdFromRequest(req);
            const {typeList} = (req.params as {toUser?: string, typeList: string});
            const {
                toIdUser, 
                idCompra,
                ...filterOpt
            } = req.query as queryFilter & QueryToIds;

            if(!fromIdUser) {
                return res.status(400).send(errorResponse(ResponseApi.Partner.LIST_ERROR));
            }

            filterOpt.filterList =  [
                "Mais Recente", 
                "Mais Antigo",
                "Apelido",
                "Nome do Usuário",
                "Nome do Produto",
                "Nome do Estabelecimento",
            ] as FilterListShop[];
            

            if(!filterOpt.filter)
                filterOpt.filter = "Mais Recente" as FilterListShop;

            const TYPES = ["ALL", "ANALYSIS", "CANCELED", "PAID", "PENDING", "REFUSED", "WAIT_REMOVE", "REMOVED"] as AllShoppingStatusType[];
            const uppTypeList = typeList ? typeList.toUpperCase() : "ALL" as ShoppingStatusType;
            
            if(!TYPES.includes(uppTypeList as ShoppingStatusType)){
                return res.status(400).send(errorResponse(ResponseApi.Validation.INVALID_FILTER))
            };

            if(!await verifyQueryOptList(filterOpt))
                return res.status(400).send(errorResponse(ResponseApi.Validation.INVALID_FILTER, {list: [], pagination: filterOpt}));

            
            let toIdUserNum: number | undefined;
            let idCompraNum: number | undefined;
            
            if(toIdUser) {
                toIdUserNum = Number(toIdUser);
                if(Number.isNaN(toIdUserNum)) { 
                    return res.status(400).send(errorResponse(ResponseApi.Validation.INVALID_FILTER));
                }
            }
            if(idCompra) {
                idCompraNum = Number(idCompra);
                if(Number.isNaN(idCompraNum)) { 
                    return res.status(400).send(errorResponse(ResponseApi.Validation.INVALID_FILTER));
                }
            }
            

            const listProd:compraInterface[] = await this.produtoModel.getShopList2(fromIdUser, userType, filterOpt, uppTypeList as ShoppingStatusType, toIdUserNum, idCompraNum);

            return res.status(200).send(successResponse(ResponseApi.Purchace.LIST_SUCCESS, {list: listProd, pagination: filterOpt}));
        }catch(e) {
            console.log("Erro ao listar compras: ", e);
            return res.status(500).send(errorResponse(ResponseApi.Server.INTERNAL_ERROR));
        }
    }

    public async acceptOrRefucePurchaces(req: FastifyRequest, res: FastifyReply, accept: boolean):Promise<void> {
        try{
            const idsData = req.body as number[];
            const idUser = await getTokenIdFromRequest(req);
            
            // Verificação dos dados
            if(
                !Array.isArray(idsData) || 
                !idsData.length ||
                !idsData.every(id => Number.isInteger(id) && id > 0)
            ) {
                return res.status(400).send(errorResponse(ResponseApi.Validation.INVALID_DATA));
            }

            // Verificar se numeros se repeten, e remover
            const ids:number[] = [...new Set(idsData)];

            
            // Verificar se compra existe
            const existentes = await this.produtoModel.getManyPurchases(ids, idUser, "fornecedor");
            if(existentes.length !== ids.length || existentes.some(e => e.retirado === true))
                return res.status(400).send(errorResponse(ResponseApi.Purchace.NOT_EXIST));


            // Salvar no banco de dados
            await this.produtoModel.acceptOrRefuseManyPurchaces(ids, idUser, accept);
    
            // Notifica a desgraça do usuario
            const notificationService = req.server.notificationService;
            const fornecedorData = await this.fornecedorModel.findUserById(idUser);
            const clientesUk = [...new Set(existentes.map(e => e.id_cliente))];            

            for(const cliente of clientesUk) {
                console.log(cliente);
                const data:NotificationInput = {
                    toId: cliente!.toString(),
                    created_at: new Date(),
                    fromUserType: "fornecedor",
                    toUserType: "cliente",
                    user: {
                        id: idUser,
                        nome: fornecedorData.nome,
                        apelido: fornecedorData.apelido
                    }
                };

                const notification = accept ? Notifications.aceitarCompra(data) : Notifications.recusarCompra(data);

                await notificationService.saveAndSendPrepared(
                    notification,
                    data
                )
            }

            return res.status(200).send(successResponse(ResponseApi.Purchace.UPDATE_STATUS));
        }catch(e) {
            console.log("Erro ao listar compras: ", e);
            return res.status(500).send(errorResponse(ResponseApi.Server.INTERNAL_ERROR));
        }
    }

    public async cancelPurchaces(req: FastifyRequest, res: FastifyReply):Promise<void> {
        try{
            const idsData = req.body as number[];
            const idUser = await getTokenIdFromRequest(req);

            console.log(idsData, idUser);

            // Verificação dos dados
            if(
                !Array.isArray(idsData) || 
                !idsData.length ||
                !idsData.every(id => Number.isInteger(id) && id > 0)
            ) {
                return res.status(400).send(errorResponse(ResponseApi.Validation.INVALID_DATA));
            }

            // Verificar se numeros se repeten, e remover
            const ids:number[] = [...new Set(idsData)];
            
            // Verificar se compra existe
            const existentes = await this.produtoModel.getManyPurchases(ids, idUser, "cliente");
            if(existentes.length !== ids.length || existentes.some(e => e.retirado === true || existentes.some(e => e.cancelado === true)))
                return res.status(400).send(errorResponse(ResponseApi.Purchace.NOT_EXIST));

            // Salvar no banco de dados
            await this.produtoModel.cancelManyPurchaces(ids, idUser);
    
            return res.status(200).send(successResponse(ResponseApi.Purchace.CANCELL_PURCHACE));
        }catch(e) {
            console.log("Erro ao cancelar compras: ", e);
            return res.status(500).send(errorResponse(ResponseApi.Server.INTERNAL_ERROR));
        }
    }

    public async updatePurchaces(req: FastifyRequest, res: FastifyReply):Promise<void> {
        try{
            let comprasData = req.body as compraInterface[]; // id_produto/quitado/retirado/coletado_em
            const idUser = await getTokenIdFromRequest(req); 

            console.log(comprasData, idUser);

            // Verificar tipo
            if(!comprasData.length || !Array.isArray(comprasData)) {
                return res.status(400).send(errorResponse(ResponseApi.Validation.INVALID_DATA));
            }

            // Verificar dados
            comprasData = await this.compraUpdateValidate(comprasData);

            if(comprasData.some(c => !c.id_compra)) {
                return res.status(400).send(errorResponse(ResponseApi.Purchace.NOT_FOUND));
            }

            // verificar se produto existe
            const ids:number[] = comprasData.map(c => c.id_compra);

            const existentes = await this.produtoModel.getManyPurchases(ids, idUser, "fornecedor");

            if(existentes.length !== comprasData.length) {
                return res.status(400).send(errorResponse(ResponseApi.Purchace.NOT_EXIST));
            }

            // atualizar
            await this.produtoModel.updateManyPurchaces(comprasData, idUser);

            // Mandar notificação
            // Notifica a desgraça do usuario
            const notificationService = req.server.notificationService;
            const fornecedorData = await this.fornecedorModel.findUserById(idUser);
            const clientesUk = [...new Set(existentes.map(e => e.id_cliente))];       
            
            await Promise.all(
                clientesUk.map(cliente => {
                    const data:NotificationInput = {
                        toId: cliente!.toString(),
                        created_at: new Date(),
                        fromUserType: "fornecedor",
                        toUserType: "cliente",
                        user: {
                            id: idUser,
                            nome: fornecedorData.nome,
                            apelido: fornecedorData.apelido
                        }
                    };

                    notificationService.saveAndSendPrepared(
                        Notifications.atualizarCompra(data),
                        data
                    )    
                })
            );

            // for(const cliente of clientesUk) {
            //     // console.log(cliente);
            //     const data:NotificationInput = {
            //         toId: cliente!.toString(),
            //         created_at: new Date(),
            //         fromUserType: "fornecedor",
            //         toUserType: "cliente",
            //         user: {
            //             id: idUser,
            //             nome: fornecedorData.nome,
            //             apelido: fornecedorData.apelido
            //         }
            //     };

            //     await notificationService.saveAndSendPrepared(
            //         Notifications.atualizarCompra(data),
            //         data
            //     )
            // }


            return res.status(200).send(successResponse(ResponseApi.Purchace.UPDATE_PURCHACE));
        }catch(e) {
            console.log("Erro ao cancelar compras: ", e);
            
            if(Array.isArray(e))
                return res.status(404).send(errorResponse(ResponseApi.Validation.INVALID_DATA, e));

            return res.status(500).send(errorResponse(ResponseApi.Server.INTERNAL_ERROR));
        }
    }
    

    private async productShemaValidate(dataProd: productInterface[]): Promise<productInterface[]>{
        try {
            const productSchema = z.object({
                id_produto: z.number().nonnegative("Insira um valor valido").optional(), 
                nome_prod: z.string().min(1, "Nome e obrigatorio"),
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
                id_compra: z.number().nonnegative("Insira um valor valido"), 
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


    private async compraUpdateValidate(dataProd: compraInterface[]): Promise<compraInterface[]>{
        try {
            const today = new Date();
            

            const compraSchema = z.object({
                id_compra: z.number().nonnegative("Insira um valor valido"),
                quitado: z.boolean(),
                retirado: z.boolean(),
                coletado_em: z.coerce.date(),
            });
            const compraArraySchema = z.array(compraSchema);
            
            return compraArraySchema.parse(dataProd) as compraInterface[];
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
