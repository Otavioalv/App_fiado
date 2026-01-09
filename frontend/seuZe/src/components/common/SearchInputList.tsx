import { StyleSheet, TextInput, View } from "react-native";
import { SpacingScreenContainer } from "../ui/SpacingScreenContainer";
import { InputTextSearch } from "../ui/InputTextSearch";
import { theme } from "@/src/theme";
import { Feather } from "@expo/vector-icons";


export interface SearchInputListProps {
    placeholder: string,
    hasFilter: boolean,
    onSubmit: () => void,

    filterList?: string[],
}

export function SearchInputList({
    hasFilter,
    onSubmit,
    placeholder,
    filterList
}: SearchInputListProps) {
    return (
        <SpacingScreenContainer>
            <View
                style={styles.searchContainer}
            >   
                <Feather 
                    name="search"
                    style={styles.icon}
                />

                <InputTextSearch/>
            </View>
        </SpacingScreenContainer>
    );
}

const styles = StyleSheet.create({
    searchContainer: {
        // borderRadius: 10000,
        overflow: "hidden",
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: theme.colors.pseudoLightGray,
        flexDirection: "row",
        flex: 1
    },
    icon: {
        backgroundColor: "red",
        fontSize: theme.typography.textXL.fontSize, // testar alterar
        justifyContent: "center",
        alignItems: "center"
    }
});