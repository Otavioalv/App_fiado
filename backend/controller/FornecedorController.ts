import { FastifyReply, FastifyRequest } from "fastify";
import { FornecedorModel } from "../models/FornecedorModel";
import { fornecedorInterface } from "../interfaces/fornecedorInterface";


class FornecedorController {
    private fornecedorModel:FornecedorModel = new FornecedorModel();

    async register(req: FastifyRequest, res: FastifyReply) {
        try {            
            const datasRegister: fornecedorInterface = req.body as fornecedorInterface;

            // verificar se o CEP existe
            // verificar se country existe 
            // verificar se city existe e se existe no country
            // verificar senha, remover espaços em branco e verificar se e segura
            // verificar se existe mais de um espaço no nome
            // remover espaços de inicio e fim do nome 
            

            const result = this.fornecedorModel.register(datasRegister);
            

            res.send({message: "registe", list: result});
        } catch(err) {
            
            console.error("Erro ao registrar fornecedor");
            
            res.status(500).send({message: "Erro", list: []});
        }
    }
}

export { FornecedorController };