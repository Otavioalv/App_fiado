import { StyleSheet, View, FlatList } from "react-native";
import { ButtonQuickRedirectProps, MemoButtonQuickRedirect } from "../ui/ButtonQuickRedirect";
import { theme } from "@/src/theme";
import { useCallback } from "react";

export type ShortcutsType = ButtonQuickRedirectProps & {idSh: string};

export interface QuickShortcutsProps {
    shortcuts: ShortcutsType[]
};

export function QuickShortcuts({shortcuts}: QuickShortcutsProps) {
    // console.log(shortcuts[0]);

    const renderItem = useCallback(
        ({item}: {item: ButtonQuickRedirectProps}) => (
            <View style={styles.quickButtonsContainer}>
                <MemoButtonQuickRedirect title={item.title} icon={item.icon} onPress={item.onPress}/>
            </View>
        ),
        []
    );

    return(
        <FlatList
            data={shortcuts}
            keyExtractor={((item) => item.idSh)}
            scrollEnabled={false}
            numColumns={2}
            
            initialNumToRender={8}
            windowSize={10}
            maxToRenderPerBatch={10}

            contentContainerStyle={{gap: theme.gap.md, paddingVertical: theme.padding.sm}}
            columnWrapperStyle={{justifyContent: "space-between"}}

            renderItem={renderItem}
        />
    )
}

const styles = StyleSheet.create({
    quickButtonsList: {
    },
    quickButtonsContainer: {
        width: "48%",
        height: "100%",
    }
});
