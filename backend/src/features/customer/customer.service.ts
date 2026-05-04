import {CustomerRepository} from "./customer.repository";


export class CustomerService {
    // private clienteModel: ClienteModel = new ClienteModel();
    constructor(private customerRepository: CustomerRepository) {}

    public async register() {
        return this.customerRepository.register({
            nome: "nomsadifj sdsd fji",
            senha: "senha@123A",
            telefone: "92991482952"
        })
    }

    // public async update(){
    // }

    // public async findByUsername(){
    // }

    // public async findUserById(){
    // }

    // public async findMultUsersByIds(){
    // }
    
    // public async userExists(){
    // }

    // public async getPasswordUsingUser(){
    // }

    // public async listAll(){
    // }
    
    // public async getPartnerByIdFornecedor(){
    // }
    
    // public async getPartnerByIdFornecedor2() {
    // }
}

