import { addressInterface } from "../interfaces/addressInterface";
import axios from 'axios';

class ValidateAddressModel{
    private viaCepApi:string = "https://viacep.com.br/ws/";
    private returnType:string = "/json/";

    public async cep(cep: string) {
        const url = this.viaCepApi + cep + this.returnType;

        console.log(url);
    }
}

export {ValidateAddressModel};