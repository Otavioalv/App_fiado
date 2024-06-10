import { fornecedorInterface } from "../interfaces/fornecedorInterface";

class FornecedorModel {
    public async register(datasRegister: fornecedorInterface) { 
        try {
            console.log("teste");
            
            return ["Teste deu certo"];
        } catch {

            return ["Deu ruim"];
        }
    }
}

export {FornecedorModel};