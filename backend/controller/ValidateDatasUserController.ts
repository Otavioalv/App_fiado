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

    public async validateDatas(datasRegister: fornecedorInterface): Promise<Record<string, string[]>[]>{
        try {
            const messages: Record<string, string[]>[] = [];

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
                    const objMenssage = {
                        all: ["preencha os campos obrigatorios"]
                    };
    
                    messages.push(objMenssage);
            } 

            if(!validator.isLength(datasRegister.nomeEstabelecimento, { min: 3})) {        
                const objMenssage = {
                    nomeEstabelecimento: ["nome do estabelecimento deve conter mais de 5 caracteres"]
                };

                messages.push(objMenssage);
            }

            if(!validator.isLength(datasRegister.nome, {min: 5}) || /\s\s/.test(datasRegister.nome) || !/^[a-zA-Z\s\u00C0-\u00FF]+$/.test(datasRegister.nome)) {
                const objMenssage = {
                    nome: ["Nome do ussuario invalido"]
                };

                messages.push(objMenssage);
            }

            if(
                !validator.isLength(datasRegister.senha, {min: 8}) || 
                /\s/.test(datasRegister.senha) || 
                /[a-z]/.test(datasRegister.senha) ||
                /[@|-|_]/ || 
                /[0-9]/
            ) {
                const arrMenssage:string[] = [];
                arrMenssage.push("Senha invalida");

                const objMenssage = {
                    senha: arrMenssage
                };

                messages.push(objMenssage);
            }
            
            if(!validator.isMobilePhone(datasRegister.telefone, 'pt-BR')) {
                const objMenssage = {
                    telefone: ["Numero telefone invalido"]
                };

                messages.push(objMenssage);
            }
            
            if(!validator.isLength(datasRegister.logradouro, {min: 2})) {
                const objMenssage = {
                    logradouro: ["Logradouro deve conter mais de 2 caracteres"]
                };

                messages.push(objMenssage);
            }
            
            if(!validator.isLength(datasRegister.bairro, {min: 2})) {
                const objMenssage = {
                    bairro: ["Bairro deve ter mais de 2 caracteres"]
                };

                messages.push(objMenssage);
            }
            
            if(!validator.isLength(datasRegister.cep, {max: 8, min: 8})) {
                const objMenssage = {
                    cep: ["CEP deve conter exatamente 8 caracteres"]
                };

                messages.push(objMenssage);
            }
            
            if(!validator.isLength(datasRegister.uf, {max: 2, min: 2})) {
                const objMenssage = {
                    uf: ["Uf deve conter exatamente 2 caracteres"]
                };

                messages.push(objMenssage);
            }

            return messages
        } catch(err) {
            console.log(err);
            throw new Error("Erro ao validar dados");
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
