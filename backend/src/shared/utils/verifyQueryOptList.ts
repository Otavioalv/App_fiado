import { queryFilter } from "../interfaces/utilsInterfeces";

export async function verifyQueryOptList(queryOpt: queryFilter): Promise<boolean>{
        try {
            if(Object.keys(queryOpt).length === 0) {
                return false;
            }

            const pagination = Number(queryOpt.page);
            const size = Number(queryOpt.size);
            const search = String(queryOpt.search).trim();
            const {filterList, filter} = queryOpt;

            
            if(!queryOpt.search)
                queryOpt.search = "";

            
            if(
                (isNaN(pagination) || isNaN(size)) ||
                (pagination <= 0 || size <= 0) || 
                (search && typeof search !== "string") ||
                (size > 100) ||
                (filter && !filterList?.includes(filter))
            ){
                return false;
            }

            queryOpt.page = Number(queryOpt.page);
            queryOpt.size = Number(queryOpt.size);

            return true;
        } catch(e) {
            console.log("Erro ao verificar query para listar fornecedor >>> ", e);
            throw new Error("Erro ao verificar query para listar fornecedor");
        }
    }
