import { theme } from "@/src/theme";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { MyBottomSheetFlatList } from "./MyBottomSheetFlatList";
import { MemoButtonFilter } from "../ui/ButtonFilter";

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

    const handleSetFilterValue = useCallback((value: string) => {
        setFilterValue(value);
        setSelected(value);
    }, [setFilterValue]);

    
    const renderItem = useCallback(
        ({item}: {item: string}) => (
            <MemoButtonFilter
                onPress={handleSetFilterValue}
                selected={selected}
                title={item}
            />
        ),
        [handleSetFilterValue, selected]
    );

    
    const renderHeader = useCallback(() => (
        <View style={styles.headerContainer}>
             <Text style={styles.textHeader}>Filtrar por:</Text>
        </View>
    ), []);

    return (
        <MyBottomSheetFlatList
            data={filterList}
            keyExtractor={(item:string, i: number) => item + i}
            contentContainerStyle={styles.contentContainer}
            style={styles.container}
            ListHeaderComponent={renderHeader}
            renderItem={renderItem}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    contentContainer: {
        gap: 0,
    },
    headerContainer: {
        alignItems: "center", 
        paddingVertical: 10
    },
    textHeader: {
        fontSize: theme.typography.textMD.fontSize,
        color: theme.colors.textNeutral900
    },

});
