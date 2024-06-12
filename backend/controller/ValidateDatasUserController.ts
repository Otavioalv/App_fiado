import { FastifyReply, FastifyRequest } from "fastify";
import { errorResponse, successResponse } from "../utils/response";
import { ValidateDatasUserModel } from "../models/ValidateDatasUserModel";
import { fornecedorInterface } from "../interfaces/fornecedorInterface";
import validator from 'validator';

interface cepInterface {
    cep: string;
}


class ValidateDatasUserController  {
    private validateDatasUserModel: ValidateDatasUserModel = new ValidateDatasUserModel();

    public async validateDatas(req: FastifyRequest, res: FastifyReply) {
        try {
            const datasRegister: fornecedorInterface = req.body as fornecedorInterface;

            datasRegister.nomeEstabelecimento = datasRegister.nomeEstabelecimento.trim();

            datasRegister.nome = datasRegister.nome.trim();
            datasRegister.senha = datasRegister.senha.trim();
            datasRegister.apelido = datasRegister.apelido?.trim();
            datasRegister.telefone = datasRegister.telefone.trim();

            datasRegister.logradouro = datasRegister.logradouro.trim();
            datasRegister.bairro = datasRegister.bairro.trim();
            datasRegister.uf = datasRegister.uf.trim();
            datasRegister.cep = datasRegister.cep.trim();

            if(
                !datasRegister.nomeEstabelecimento || 
                !datasRegister.nome || 
                !datasRegister.senha || 
                !datasRegister.telefone || 
                !datasRegister.logradouro || 
                !datasRegister.bairro || 
                !datasRegister.cep || 
                !datasRegister.uf) {
                    console.log("preencha os campos obrigatorios");
            } 

            if(!validator.isLength(datasRegister.nomeEstabelecimento, { min: 3})) {
                console.log("nome do estabelecimento deve conter mais de 5 caracteres");
            }

            if(!validator.isLength(datasRegister.nome, {min: 5})) {
                console.log("Nome do ussuario deve ter mais de 5 caracteres");
            }

            if(!validator.isLength(datasRegister.senha, {min: 8})) {
                console.log("Senha tem q tem mais de 8 caracteres");
            }
            
            if(!validator.isMobilePhone(datasRegister.telefone, 'pt-BR')) {
                console.log("Numero telefone invalido");
            }
            
            if(!validator.isLength(datasRegister.logradouro, {min: 2})) {
                console.log("Logradouro deve tem mais de 2 caracteres");
            }
            
            if(!validator.isLength(datasRegister.bairro, {min: 2})) {
                console.log("Bairro deve ter mais de 2 caracteres");
            }
            
            if(!validator.isLength(datasRegister.cep, {max: 8, min: 8})) {
                console.log("CEP deve conter exatamente 8 caracteres");
            }
            
            if(!validator.isLength(datasRegister.uf, {max: 2, min: 2})) {
                console.log("Uf deve conter exatamente 2 caracteres");
            }
                        
            res.send(successResponse("Ussuario registrado com sucesso", "result"));

        } catch(err) {
            res.status(500).send(errorResponse("Erro Interno no servidor"));
        }
    }

    public async validateAdressCep(req: FastifyRequest, res: FastifyReply) {
        try {
            var obj = req.body as cepInterface;

            if(!obj.cep){
                res.status(400).send(errorResponse("CEP vazio"));
                return;
            }

            obj.cep = obj.cep.replace(/\D/g, ""); // remove qualquer caracter e mantem os numeros

            if(!/^[0-9]{8}$/.test(obj.cep)) {
                res.status(400).send(errorResponse("Formato do CEP inválido"));
                return;
            }
    
            const result = await this.validateDatasUserModel.validateAdressCep(obj.cep);
            res.send(successResponse("CEP validado com sucesso", result));
            
        } catch(err){
            var errorMenssage = "Erro interno no servidor";
            
            if(err instanceof Error)
                errorMenssage = `${errorMenssage}: ${err.message}`;

            res.status(500).send(errorResponse(errorMenssage));
        }
    }
}

export {ValidateDatasUserController};