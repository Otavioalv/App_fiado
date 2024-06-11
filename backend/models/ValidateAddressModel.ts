import { addressInterface } from "../interfaces/addressInterface";
import axios, { AxiosResponse } from 'axios';

class ValidateAddressModel{
    private viaCepApi:string = "https://viacep.com.br/ws/";
    private returnType:string = "/json/";

    public async cep(cep: string):Promise<addressInterface>{
        try {
            const url = this.viaCepApi + cep + this.returnType;
            const res:AxiosResponse<any, any> = await axios.get(url);

            if(res.data.erro) {
                throw new Error("CEP inválido");
            } else {
                const addressResult: addressInterface = {
                    bairro: res.data.bairro,
                    cep: res.data.cep,
                    logradouro: res.data.logradouro,
                    uf: res.data.uf,
                    complemento: res.data.complemento
                };

                return addressResult;
            }
        } catch(error){
            var errorMenssage = "Falha ao validar CEP";

            if(error instanceof Error)
                errorMenssage = `${errorMenssage} - (${error.message})`; 

            throw new Error(errorMenssage);
        }
    }
}

export {ValidateAddressModel};