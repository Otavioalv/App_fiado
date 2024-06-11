import { FastifyReply, FastifyRequest } from "fastify";
import { ValidateAddressModel } from "../models/ValidateAddressModel";
import { errorResponse, successResponse } from "../utils/response";


interface cepInterface {
    cep: string;
}
class ValidateAddressController {
    private validateAddressModel: ValidateAddressModel = new ValidateAddressModel();

    public async cep(req: FastifyRequest, res: FastifyReply) {

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
    
            const result = await this.validateAddressModel.cep(obj.cep);
            res.send(successResponse("CEP validado com sucesso", result));
            
        } catch(err){
            var errorMenssage = "Erro interno no servidor";
            
            if(err instanceof Error)
                errorMenssage = `${errorMenssage}: ${err.message}`;

            res.status(500).send(errorResponse(errorMenssage));
        }
    }
}

export {ValidateAddressController};
