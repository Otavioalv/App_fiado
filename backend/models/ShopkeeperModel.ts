import { shopkeeperInterface } from "../interfaces/shopkeeperInterface";

class ShopkeeperModel {
    async register(datasRegister: shopkeeperInterface) { 
        try {
            console.log(datasRegister);
            
            return ["Teste deu certo"];
        } catch {

            return ["Deu ruim"];
        }
    }
}

export {ShopkeeperModel};