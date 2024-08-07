import { FastifyReply, FastifyRequest } from "fastify";
import { compare, hash } from 'bcrypt';
import validator from 'validator';


import { ValidateDatasUserModel } from "../models/ValidateDatasUserModel";
import { FornecedorModel } from "../models/FornecedorModel";
import { errorResponse, successResponse } from "../utils/response";
import { fornecedorInterface } from "../interfaces/fornecedorInterface";
import { loginInterface } from "../interfaces/loginInterface";
import { payloadInterface } from "../interfaces/payloadInterface";
import { saltRoundPassword } from "../config";
import { removeAccents } from "../utils/removeAccents";
import { getPayloadFromToken } from "../utils/tokenUtils";
import { clienteInterface } from "../interfaces/clienteInterface";
import { ClienteModel } from "../models/ClienteModel";


interface cepInterface {
    cep: string;
}


class ValidateDatasUserController  {
    private validateDatasUserModel: ValidateDatasUserModel = new ValidateDatasUserModel();

    public async validateDatasFornecedor(datasRegister: fornecedorInterface):Promise<Record<string, string[]>[]>{
        try {
            const messages: Record<string, string[]>[] = [];
            
            // dados relacionados a fornecedor e cliente
            datasRegister.nome = datasRegister.nome.trim().toLowerCase();
            datasRegister.senha = datasRegister.senha.trim();
            datasRegister.apelido = datasRegister.apelido?.trim();
            datasRegister.telefone = datasRegister.telefone.trim();

            // dados relacionados a fornecedor
            datasRegister.nomeEstabelecimento = datasRegister.nomeEstabelecimento.trim();
            datasRegister.logradouro = datasRegister.logradouro.trim();
            datasRegister.bairro = datasRegister.bairro.trim();
            datasRegister.uf = datasRegister.uf.trim();
            datasRegister.cep = datasRegister.cep.trim();
            datasRegister.complemento = datasRegister.complemento?.trim();

            const nomeVerificado = await this.validarNome(datasRegister.nome);
            const senhaValidada = await this.validarSenha(datasRegister.senha);
            const apelidoValidado = await this.validarApelido(datasRegister.apelido);
            const telefoneValidado = await this.validarTelefone(datasRegister.telefone);

            if(
                !datasRegister.nome || 
                !datasRegister.senha || 
                !datasRegister.telefone || 
                
                !datasRegister.nomeEstabelecimento || 
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
                    nomeEstabelecimento: ["Nome do estabelecimento invalido"]
                };

                messages.push(objMenssage);
            }

            if(nomeVerificado.nome.length) {
                messages.push(nomeVerificado);
            }
            datasRegister.nome = await removeAccents(datasRegister.nome);

            if(senhaValidada.senha.length) {
                messages.push(senhaValidada);
            }

            if(apelidoValidado.apelido.length) {
                messages.push(apelidoValidado);
            }
            
            if(telefoneValidado.telefone.length) {
                messages.push(telefoneValidado);
            }
            
            if(!validator.isLength(datasRegister.logradouro, {min: 2})) {
                const objMenssage = {
                    logradouro: ["Nome do logradouro invalido"]
                };

                messages.push(objMenssage);
            }
            
            if(!validator.isLength(datasRegister.bairro, {min: 2})) {
                const objMenssage = {
                    bairro: ["Nome do bairro invalido"]
                };

                messages.push(objMenssage);
            }
            
            if(!validator.isLength(datasRegister.cep, {max: 8, min: 8})) {
                const objMenssage = {
                    cep: ["CEP deve conter exatamente 8 numeros"]
                };

                messages.push(objMenssage);
            }
            
            if(!validator.isLength(datasRegister.uf, {max: 2, min: 2})) {
                const objMenssage = {
                    uf: ["Uf deve conter exatamente 2 caracteres"]
                };

                messages.push(objMenssage);
            }

            if(datasRegister.complemento && 
                (
                    !validator.isLength(datasRegister.complemento, {min: 1}) ||
                    /\s\s/.test(datasRegister.complemento)
                )
            ) {
                const objMenssage = {
                    complemento: ["Complemento invalido"]
                }
                messages.push(objMenssage);
            }

            if(typeof datasRegister.numeroImovel != "number"){
                const objMenssage = {
                    numeroImovel: ["numero do imovel invalido"]
                }

                messages.push(objMenssage);
            }

            return messages
        } catch(err) {
            throw new Error("Erro ao validar dados");
        }
    }

    public async validateDatasCliente(datasRegister: clienteInterface): Promise<Record<string, string[]>[]>{
        try {
            datasRegister.nome = datasRegister.nome.trim().toLowerCase();
            datasRegister.senha = datasRegister.senha.trim();
            datasRegister.apelido = datasRegister.apelido?.trim();
            datasRegister.telefone = datasRegister.telefone.trim();

            const messages: Record<string, string[]>[] = [];

            const nomeVerificado = await this.validarNome(datasRegister.nome);
            const senhaValidada = await this.validarSenha(datasRegister.senha);
            const apelidoValidado = await this.validarApelido(datasRegister.apelido);
            const telefoneValidado = await this.validarTelefone(datasRegister.telefone);

            if(
                !datasRegister.nome || 
                !datasRegister.senha || 
                !datasRegister.telefone
            ) {
                const objMenssage = {
                    all: ["Preencha os campos obrigatorios"]
                };

                messages.push(objMenssage);
            }

            if(nomeVerificado.nome.length)
                messages.push(nomeVerificado);

            datasRegister.nome = await removeAccents(datasRegister.nome);

            if(senhaValidada.senha.length)
                messages.push(senhaValidada);
            
            if(apelidoValidado.apelido.length)
                messages.push(apelidoValidado);
            
            if(telefoneValidado.telefone.length)
                messages.push(telefoneValidado);

            return messages
        } catch (e) {
            throw new Error('Erro ao validar dados');
        }
    }

    public async validateLogin(datasLogin: loginInterface): Promise<Record<string, string[]>[]>{
        try {
            const messages: Record<string, string[]>[] = [];

            datasLogin.nome = datasLogin.nome.trim().toLowerCase();
            datasLogin.senha = datasLogin.senha.trim();

            const nomeVerificado = await this.validarNome(datasLogin.nome);
            const senhaValidada = await this.validarSenha(datasLogin.senha);

            if(nomeVerificado.nome.length) {
                messages.push(nomeVerificado);
            }
            datasLogin.nome = await removeAccents(datasLogin.nome);

            if(senhaValidada.senha.length) {
                messages.push(senhaValidada);
            }

            return messages;
        } catch(e) {
            throw new Error("Erro ao validar dados");
        }
    }

    public async validateAdressCep(req: FastifyRequest, res: FastifyReply) {
        try {
            var obj = await req.body as cepInterface;

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
            res.status(200).send(successResponse("CEP validado com sucesso", result));
            
        } catch(err){
            res.status(500).send(errorResponse("Erro interno no servidor", err));
        }
    }

    public async hashPassword(password: string): Promise<string>{
        try{
            const hashedPass:string = await hash(password, saltRoundPassword);
            return hashedPass;
        } catch(e) {
            throw new Error("Erro ao criar hash da senha");
        }
    }

    public async comparePassword(hashedPassword: string, password: string): Promise<boolean>{
        try {
            const match = await compare(password, hashedPassword);
            return match;
        } catch(e) {
            throw new Error("Erro ao verificar a senha");
        }
    }

    public async verifyFromToken(token: string): Promise<boolean>{
        try{
            const decodedToken:payloadInterface = await getPayloadFromToken(token);


            if(decodedToken.usuario == "fornecedor"){
                const fornecedor = await new FornecedorModel().findUserById(decodedToken.id);
                if(!fornecedor)     
                    throw new Error("Usuario não encontrado");
            } else if(decodedToken.usuario == 'cliente'){
                const cliente = await new ClienteModel().findUserById(decodedToken.id);
                if(!cliente) 
                    throw new Error("Usuario não encontrado");
            } else {
                throw new Error("Token invalido");
            }
            
            return true;
        
        } catch(e) {
            throw e;
        }

    }

    private async validarSenha(senha: string): Promise<{senha: string[]}>{
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
  

        const messages = {
            senha: arrMenssage
        };

       return messages;
    }   
    
    private async validarNome(nome: string): Promise<{nome: string[]}> {
        const arrMenssage: string[] = [];
        if(
            !validator.isLength(nome, {min: 4}) || 
            /\s\s/.test(nome) || 
            !/^[a-zA-Z\s\u00C0-\u00FF]+$/.test(nome) ||
            /[0-9]/.test(nome)
        ) {
            arrMenssage.push("Nome do ussuario invalido");
        }

        const objMenssage = {
            nome: arrMenssage
        };

        return objMenssage;
    }

    private async validarApelido(apelido: string | undefined): Promise<{apelido: string[]}> {
        const arrMenssage: string[] = [];

        if(apelido && 
            (
                !validator.isLength(apelido, {min: 1}) || 
                /\s\s/.test(apelido) || 
                !/^[a-zA-Z\s\u00C0-\u00FF]+$/.test(apelido)
            )
        ) {
            arrMenssage.push("Apelido invalido");
        }


        const objMenssage = {
            apelido: arrMenssage
        }

        return objMenssage;
    }

    private async validarTelefone(telefone: string): Promise<{telefone: string[]}> {
        const arrMessage: string[] = [];

        if(!validator.isMobilePhone(telefone, 'pt-BR')) {
            arrMessage.push("Numero telefone invalido");
        }

        const objMessage = {
            telefone: arrMessage
        }

        return objMessage;
    }

}

export {ValidateDatasUserController}