import { useLocalSearchParams} from "expo-router";
import { UserDetail } from "@/src/components/common/UserDetail";
import { TabItem } from "@/src/components/common/GenericTopTabs";
import { useListPartnerFromId } from "@/src/hooks/useClienteQueries";
import { useMemo } from "react";
import { SobreTab } from "@/src/components/cliente/tabs/SobreTab";
import { ListProdsTab } from "@/src/components/cliente/tabs/ListProdsTab";


export default function FornecedorDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();    

    const {
        data: userData,
        isLoading: isLoadingUserData,
        isError: isErrorUserData,
    } = useListPartnerFromId(
        id
    );
  

    const tabList = useMemo<TabItem[]>(() => [
        {
            name:"Sobre" ,
            component: SobreTab, 
            options: {
                title: "Sobre",
                lazy: true,
                lazyPreloadDistance: 0,
            },
        },
        {
            name:"Produtos" ,
            component: ListProdsTab, 
            options: {
                title: "Produtos",
                lazy: true,
                lazyPreloadDistance: 0
            },
        },
    ], []);

    
    
    const desc: string =  `Resp: ${userData?.nome} ${userData?.apelido ? `- (${userData.apelido})` : ""}`;

    return (
        <UserDetail
            title={userData?.nomeestabelecimento || ""}
            relationShipType={userData?.relationship_status ?? "NONE"}
            desc={desc}
            tabList={tabList}
            isLoading={isLoadingUserData || isErrorUserData}
            numberPhone={userData?.telefone || ""}
        />
    );
}
