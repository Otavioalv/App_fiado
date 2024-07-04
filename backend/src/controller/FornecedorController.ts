import { FastifyReply, FastifyRequest } from "fastify";
import { FornecedorModel } from "../models/FornecedorModel";
import { fornecedorInterface } from "../interfaces/fornecedorInterface";
import { errorResponse, successResponse } from "../utils/response";
import { ValidateDatasUserController } from "./ValidateDatasUserController";
import { loginInterface } from "../interfaces/loginInterface";
import { payloadInterface } from "../interfaces/payloadInterface";
import { productInterface } from "../interfaces/productInterface";
import {z} from 'zod';
import { removeAccents } from "../utils/removeAccents";
import { verify } from "jsonwebtoken";

import { generateToken } from "../utils/tokenUtils";


class FornecedorController{
    private fornecedorModel:FornecedorModel = new FornecedorModel();
    private validateDatasUserController:ValidateDatasUserController = new ValidateDatasUserController();

    public async register(req: FastifyRequest, res: FastifyReply) {
        try {            
            const datasRegister: fornecedorInterface = req.body as fornecedorInterface;
            const message = await this.validateDatasUserController.validateDatas(datasRegister);
            
            if(message.length) {
                res.status(400).send(errorResponse("dados invalidos", message));
                return;
            }

            if(await this.fornecedorModel.userExists(datasRegister.nome)) {
                res.status(400).send(errorResponse("Usuario já existe. Realize o login"));
                return;
            }

            datasRegister.senha = await this.validateDatasUserController.hashPassword(datasRegister.senha);

            const result = await this.fornecedorModel.register(datasRegister);

            res.status(200).send(successResponse("Ussuario registrado com sucesso", result));
            return;
        } catch(err) {
            res.status(500).send(errorResponse("Erro Interno no servidor", err));
            return
        }
    }

    public async login(req: FastifyRequest, res: FastifyReply) {
        try {
            const datasLogin: loginInterface = req.body as loginInterface;
            const message = await this.validateDatasUserController.validateLogin(datasLogin);

            if(message.length){
                res.status(400).send(errorResponse("dados invalidos", message));
                return;
            }

            datasLogin.nome = (await removeAccents(datasLogin.nome.trim())).toLowerCase();
            if(!await this.fornecedorModel.userExists(datasLogin.nome)) {
                res.status(404).send(errorResponse("Ussuario não existe"));
                return;
            }

            const hashedPass:string = await this.fornecedorModel.getPasswordUsingUser(datasLogin);

            if(!await this.validateDatasUserController.verifyPassword(hashedPass, datasLogin.senha)) {
                res.status(401).send(errorResponse("Senha incorreta"));
                return;
            }

            const token:string = await this.generateToken(datasLogin);

            res.status(200).send(successResponse("Login realizado com sucesso", {token}));
            return
        } catch(err) {
            res.status(500).send(errorResponse("Erro interno no servidor", err));
            return
        }
    }

    public async addProducts(req: FastifyRequest, res: FastifyReply) {        
        try {
            const token: string = req.headers.authorization as string;
            
            const productSchema = z.object({
                nome: z.string().min(1, "Nome e obrigatorio"),
                preco: z.number().positive("Insira um valor valido"),
                disponivel: z.boolean(),
            })
            const productArraySchema = z.array(productSchema);

            const datasProduct:productInterface[] = productArraySchema.parse(req.body);
                        
            this.fornecedorModel.addProducts(datasProduct);

            res.status(201).send(successResponse("Produtos adicionados"));
        } catch (e) {
            if(e instanceof z.ZodError) {
                res.status(400).send(errorResponse("Parametros invalidos", e.errors[0].path));
            }
            res.status(500).send(errorResponse("Erro interno no servidor"));
        }
    }

    private async generateToken(user: loginInterface):Promise<string>{
        const fornecedor = await this.fornecedorModel.findByUsername(user.nome);
        
        const payload: payloadInterface =  { 
            id: fornecedor.id_fornecedor ?? 0,
            nome: fornecedor.nome,
            usuario: "fornecedor"
        }

        const token:string = await generateToken(payload);

        return token;
    }
}

export { FornecedorController };
