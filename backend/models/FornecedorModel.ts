import { fornecedorInterface } from "../interfaces/fornecedorInterface";

class FornecedorModel {
    async register(datasRegister: fornecedorInterface) { 
        try {
            console.log(datasRegister);
            
            return ["Teste deu certo"];
        } catch {

            return ["Deu ruim"];
        }
    }
}

export {FornecedorModel};