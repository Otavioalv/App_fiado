import { FastifyReply, FastifyRequest } from "fastify";
import { ValidateAddressModel } from "../models/ValidateAddressModel";

class ValidateAddressController {
    private validateAddressModel: ValidateAddressModel = new ValidateAddressModel();

    public async cep(req: FastifyRequest, res: FastifyReply) {
        var obj = req.body as {cep: string};
        
        obj.cep = obj.cep.replace(/\D/g, "");
        if(obj.cep != "") {
            if(/^[0-9]{8}$/.test(obj.cep)) {
                const result = await this.validateAddressModel.cep(obj.cep);

                console.log(result);
            } else {
                console.log("Formato de cep invalido");
            }
        } else {
            console.log("cep vazio");
        }
    }
}

export {ValidateAddressController};