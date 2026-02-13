import { useLocalSearchParams} from "expo-router";
import { UserDetail } from "@/src/components/common/UserDetail";
import { TabItem } from "@/src/components/common/GenericTopTabs";
import { useListPartnerFromId, useUpdatePartnerInfoFornecedor } from "@/src/hooks/useClienteQueries";
import { useCallback, useMemo } from "react";
import { SobreTab } from "@/src/components/cliente/tabs/SobreTab";
import { ListProdsTab } from "@/src/components/cliente/tabs/ListProdsTab";
import { OnPressActionFunctionType } from "@/src/components/ui/RelationshipActions";


export default function FornecedorDetail() {
    const { id, tab } = useLocalSearchParams<{ id: string, tab: string }>();

   const initialTab = tab === "Produtos" ? "Produtos" : "Sobre";

    const {
        data: userData,
        isLoading: isLoadingUserData,
        isError: isErrorUserData,
    } = useListPartnerFromId(
        id
    );
    
    const { mutate } = useUpdatePartnerInfoFornecedor(id);

    const handleAction: OnPressActionFunctionType = useCallback(({ id, newStatus }) => {
        // console.log(id, newStatus);
        mutate({ id: id, newStatus: newStatus });
    }, [mutate]);

    // const handleOnPressAccepted = useCallback((id: string | number) => {
    //     router.push({
    //         pathname: `/fornecedores/[id]`,
    //         params: { tab: "Produtos", id: id}
    //     });
    // }, [router])


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
            navigatorOpt={{
                initialRouteName: initialTab
            }}
            idUser={id}
            title={userData?.nomeestabelecimento || ""}
            relationShipType={userData?.relationship_status ?? "NONE"}
            desc={desc}
            tabList={tabList}
            isLoading={isLoadingUserData || isErrorUserData}
            numberPhone={userData?.telefone || ""}
            onPressAction={handleAction}
        />
    );
}
