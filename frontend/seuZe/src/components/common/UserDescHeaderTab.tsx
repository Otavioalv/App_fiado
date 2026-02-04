import { StyleSheet, View } from "react-native";
import { ButtonIcon, ButtonIconSkeleton } from "../ui/ButtonIcon";
import { DefaultDescription, DefaultDescriptionSkeleton } from "../ui/DefaultDescription";
import { useRouter } from "expo-router";
import * as Clipboard from 'expo-clipboard';
import Toast from "react-native-toast-message";
import { formatPhone } from "@/src/utils";

interface UserDescHeaderTabProps {
    title: string,
    desc: string, 
    numberPhone: string,
    isLoading?: boolean
}

export function UserDescHeaderTab({
    desc,
    title,
    numberPhone,
    isLoading,
}: UserDescHeaderTabProps) {
    const router = useRouter();

    if(isLoading) {
        return <UserDescHeaderTabSkeleton/>
    }


    const copyPhone = async () => {
        const numberFormat = formatPhone(numberPhone);
        
        await Clipboard.setStringAsync(numberFormat);

        Toast.show({
            type: "success",
            text1: "Número copiado com sucesso!"
        });
    };


    return (
        <View
            style={styles.container}
        >
            <ButtonIcon
                iconName="arrow-left"
                variant="ghost"
                onPress={() => router.back()}
            />
            
            <DefaultDescription
                size="M"
                text1={title}
                text2={desc}
                isLoading={isLoading}
            />

            <ButtonIcon
                iconName="phone"
                variant="outline"
                isLoading={isLoading}
                onPress={copyPhone}
            />
        </View>
    );
}

export function UserDescHeaderTabSkeleton() {
    const router = useRouter();
    
    return (
        <View
            style={styles.container}
        >
            <ButtonIcon
                iconName="arrow-left"
                variant="ghost"
                onPress={() => router.back()}
            />
            <DefaultDescriptionSkeleton size="M"/>
            <ButtonIconSkeleton/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 0,
    }
});
