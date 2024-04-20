import { FastifyReply, FastifyRequest } from "fastify";
import { ShopkeeperModel } from "../models/ShopkeeperModel";
import { shopkeeperInterface } from "../interfaces/shopkeeperInterface";


class ShopkeeperController {
    private shopkeeperModel:ShopkeeperModel = new ShopkeeperModel();

    async register(req: FastifyRequest, res: FastifyReply) {
        try {            
            const datasRegister: shopkeeperInterface = req.body as shopkeeperInterface;

            // verificar se o CEP existe
            // verificar se country existe 
            // verificar se city existe e se existe no country
            // verificar senha, remover espaços em branco e verificar se e segura
            // verificar se existe mais de um espaço no nome
            // remover espaços de inicio e fim do nome 
            

            const result = this.shopkeeperModel.register(datasRegister);
            

            res.send({message: "registe", list: result});
        } catch(err) {
            
            console.error("Erro ao registrar fornecedor");
            
            res.status(500).send({message: "Erro", list: []});
        }
    }
}

export { ShopkeeperController };