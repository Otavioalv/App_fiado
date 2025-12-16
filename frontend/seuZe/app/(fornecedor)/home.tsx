import Button from "@/src/components/ui/Button";
import { useSession } from "@/src/context/authContext";
import { Alert, Text, View } from "react-native";


export default function Home() {
    const {session, signOut} = useSession();

    const logOut = () => {
        signOut();
    }


    return (
        <View>
            <Text>
                Home
            </Text>

            <Button placeholder="teste" onPress={() => Alert.alert("TESTE", `Token: ${session}`)}/>
            <Button placeholder="LogOut" onPress={logOut}/>
        </View>
    );
}