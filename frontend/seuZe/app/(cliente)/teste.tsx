import { listPartner } from "@/src/services/clienteService";
import { useEffect } from "react";
import { Text, View } from "react-native";


export default function Teste() {
    
    const fetchListPartner = async () => {
        const list = await listPartner("accepted", undefined, {page: 4, size: 3});

        console.log(JSON.stringify(list, null, "  "));
    }

    useEffect(() => {
        fetchListPartner()
    }, []);

    return(
        <View>
            <Text>
                Teste
            </Text>
        </View>
    )
}