import Button from "@/src/components/ui/Button";
import { useSession } from "@/src/context/authContext";
import { Text, View, Alert } from "react-native";


export default function Perfil() {
    const {session, signOut} = useSession();

    const logOut = () => {
        signOut();
    }

    return(
        <View>
            <Text>
                Perfil
            </Text>

            <Button placeholder="teste" onPress={() => Alert.alert("TESTE", `Token: ${session}`)}/>
            <Button placeholder="LogOut" onPress={logOut}/>
        </View>
    )
}