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

            const senhaValidada = await this.validarSenha(datasRegister.senha);
            if(senhaValidada.senha.length) {
                messages.push(senhaValidada);
            }

            if(datasRegister.apelido && 
                    (
                        !validator.isLength(datasRegister.apelido, {min: 1}) || 
                        /\s\s/.test(datasRegister.apelido) || 
                        !/^[a-zA-Z\s\u00C0-\u00FF]+$/.test(datasRegister.apelido)
                    )
            ) {
                const objMenssage = {
                    apelido: ["Apelido invalido"]
                }
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
            res.status(500).send(errorResponse("Erro interno no servidor", err));
        }
    }

    private async validarSenha(senha: string): Promise<Record<string, string[]>>{
        const arrMenssage:string[] = [];

        if(!validator.isLength(senha, {min: 8, max: 15}))
            arrMenssage.push("Senha deve conter no minimo 8 e no maximo 15 caracteres");

        if(/\s/.test(senha))
            arrMenssage.push("Senha não deve conter espaços");

        if(!/[a-z]/.test(senha))
            arrMenssage.push("Senha deve conter letras");

        if(!/[[@\-_]/.test(senha))
            arrMenssage.push("Senha deve conter pelo menos um desses caracteres especiais (@, -, _)");

        if(!/[0-9]/.test(senha))
            arrMenssage.push("Senha deve conter pelo menos um numero");

        if(/[\u00C0-\u00FF]/.test(senha))
            arrMenssage.push("Senha não deve conter letras acentuadas");
  

        const messages: Record<string, string[]> = {
            senha: arrMenssage
        };

       return messages;
    }       
}

export {ValidateDatasUserController};
