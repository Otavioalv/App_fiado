import { FastifyReply, FastifyRequest } from "fastify";
import { FornecedorModel } from "../models/FornecedorModel";
import { fornecedorInterface } from "../interfaces/fornecedorInterface";
import { errorResponse, successResponse } from "../utils/response";


class FornecedorController{
    private fornecedorModel:FornecedorModel = new FornecedorModel();
    
    public async register(req: FastifyRequest, res: FastifyReply) {
        try {            
            const datasRegister: fornecedorInterface = req.body as fornecedorInterface;

            datasRegister.nome = datasRegister.nome.trim();
            datasRegister.senha = datasRegister.senha.trim();
            datasRegister.apelido = datasRegister.apelido.trim();
            datasRegister.telefone = datasRegister.telefone.trim();
            datasRegister.uf = datasRegister.uf.trim();
            datasRegister.logradouro = datasRegister.logradouro.trim();
            datasRegister.cep = datasRegister.cep.trim();
            datasRegister.nomeEstabelecimento = datasRegister.nomeEstabelecimento.trim();


            // verificar se o CEP existe
            // verificar se city existe e se existe no country
            // verificar senha, remover espaços em branco e verificar se e segura
            // verificar se existe mais de um espaço no nome
            
            console.log(datasRegister);
            const result = await this.fornecedorModel.register(datasRegister);

            res.send(successResponse("Ussuario registrado com sucesso", result));
        } catch(err) {
            console.error("Erro ao registrar fornecedor: ", err);
            
            res.status(500).send(errorResponse("Erro Interno no servidor"));
        }
    }
}

export { FornecedorController };