import { StyleSheet, View, FlatList } from "react-native";
import { SectionContainer } from "./SectionContainer";
import { ButtonQuickRedirect, ButtonQuickRedirectProps } from "../ui/ButtonQuickRedirect";
import { theme } from "@/src/theme";

export type QuickShortcutsProps = {
    shortcuts: ButtonQuickRedirectProps[]
};

export function QuickShortcuts({shortcuts}: QuickShortcutsProps) {

    return(
        <SectionContainer title="Atalhos Rápidos">
            <FlatList
                data={shortcuts}
                keyExtractor={((item, index) => index.toString())}
                scrollEnabled={false}
                numColumns={2}

                contentContainerStyle={{gap: theme.gap.md, paddingVertical: theme.padding.sm}}
                columnWrapperStyle={{justifyContent: "space-between"}}

                renderItem={({item}) => (
                    <View style={styles.quickButtonsContainer}>
                        <ButtonQuickRedirect title={item.title} icon={item.icon} onPress={item.onPress}/>
                    </View>    
                )}
            />
        </SectionContainer>
    )
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor: "red",
        // width: "100%",
        // flex: 1
    },
    quickButtonsList: {
    },
    quickButtonsContainer: {
        width: "48%",
        height: "100%",
        // backgroundColor: "red",
        // position: "relative",
    }

});