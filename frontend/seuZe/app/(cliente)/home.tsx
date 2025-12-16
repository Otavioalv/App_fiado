import MyScreenContainer from "@/src/components/common/MyScreenContainer";
import { UserHeader } from "@/src/components/common/UserHeader";
import Button from "@/src/components/ui/Button";
import { useSession } from "@/src/context/authContext";
import { Alert, ScrollView, Text, View } from "react-native";


export default function Home() {
    const {session, signOut} = useSession();

    const logOut = () => {
        signOut();
    }


    return (
        <ScrollView>
            <UserHeader/>
            <MyScreenContainer>
                <Text>
                    Home
                </Text>

                <Button placeholder="teste" onPress={() => Alert.alert("TESTE", `Token: ${session}`)}/>
                <Button placeholder="LogOut" onPress={logOut}/>
            </MyScreenContainer>
        </ScrollView>
    );
}