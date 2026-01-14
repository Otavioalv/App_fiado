import { theme } from "@/src/theme";
// import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MyBottomSheetFlatList } from "./MyBottomSheetFlatList";
import { Feather } from "@expo/vector-icons";
import { BottomSheetView } from "@gorhom/bottom-sheet";

type FilterOptionsProps = {
    filterList: string[],
    filterValue: string,
    setFilterValue: Dispatch<SetStateAction<string>>,
}

export function FilterOptionsBottom({filterList, filterValue, setFilterValue}: FilterOptionsProps) {
    const [selected, setSelected] = useState<string>(filterValue);

    useEffect(() => {
        setSelected(filterValue);
    }, [filterValue]);


    const handleSetFilterValue = (value: string) => {
        setFilterValue(value);
        setSelected(value);
    }

    return (
        <BottomSheetView>

            <MyBottomSheetFlatList
                data={filterList}
                keyExtractor={(item:string, i: number) => item + i}
                contentContainerStyle={styles.contentContainer}
                style={styles.container}
    
                renderItem={({item}: {item: string}) => {
                    const isValue:boolean = item === selected;
    
                    return (
                        <Pressable 
                            style={styles.buttonOpc}
                            onPress={() => handleSetFilterValue(item)}
                        >
                            <Text
                                style={[
                                    styles.textBtt, 
                                    isValue ? styles.textchecked : styles.textNeutral
                                ]}
                            >
                                {item}
                            </Text>
    
                            <Feather 
                                name={isValue ? "check-circle" : "circle"}
                                style={[
                                    styles.textBtt, 
                                    isValue ? styles.textchecked : styles.textNeutral
                                ]}
                            />
                        </Pressable>
                    )
                }}
            />
        </BottomSheetView>
    );
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor: "blue",
        flex: 1
    },
    contentContainer: {
        gap: 0
        // paddingBottom: 20,
        // gap: theme.gap.sm,
    },
    buttonOpc: {
        // backgroundColor: "red",
        // marginBottom: 5,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: theme.padding.md,
        borderBottomWidth: 1,
        borderColor: theme.colors.pseudoLightGray

    },

    // Texto
    textBtt: {
        fontSize: theme.typography.textMD.fontSize
    },
    textchecked: {
        color: theme.colors.orange
    },
    textNeutral: {
        color: theme.colors.textNeutral900
    },

    // Icone
    // icon: {
    //     fontSize: theme.typography.textMD.fontSize
    // }
});