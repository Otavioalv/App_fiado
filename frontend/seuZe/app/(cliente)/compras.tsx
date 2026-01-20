import { SearchInputList } from "@/src/components/common/SearchInputList";
import { ShoppingCard } from "@/src/components/common/ShoppingCard";
import { useShoppingList } from "@/src/hooks/useClienteQueries";
import { Text, View } from "react-native";


export default function Compras() {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
        isLoading,
        isRefetching,
        isError,
        error
    } = useShoppingList(
        {
            search: "",
            filter: "",
        }
    );

    console.log(JSON.stringify(data, null, "  "));

    return(
        <View>  
            <ShoppingCard
                marketName={"Pereira EIRELI"}
                nome={"Dana Doodwein"}
                price={"50"}
                prodName={"Maçãs Orgânicas"}
                apelido={"Daninha"}
                status="CANCELED"
            /> 
        </View>
    );
}
