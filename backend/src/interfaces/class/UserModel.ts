import { queryFilter } from "../utilsInterfeces";
import { idsPartnerInterface } from "../userInterfaces";

abstract class UserModel<T> {
    public abstract register(datasRegister: T): Promise<void>;
    public abstract findByUsername(nome: string): Promise<T>;
    public abstract findUserById(id: number): Promise<T>;
    public abstract findMultUsersByIds(ids: idsPartnerInterface): Promise<T[]>
    public abstract userExists(nome: string): Promise<boolean>;
    public abstract getPasswordUsingUser(nome: string): Promise<string>;
    public abstract getPasswordUsingUser(nome: string): Promise<string>;
    public abstract listAll(idCliente: number, filterOpt:queryFilter): Promise<T[]>
}

export {UserModel};