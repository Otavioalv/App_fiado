import { theme } from "@/src/theme";
import { FlatList, StyleSheet } from "react-native";
import { MemoButtonChip, MemoButtonChipSkeleton } from "../ui/ButtonChip";
import { Dispatch, SetStateAction, useCallback } from "react";

export interface ChipDataType<T>{
    id: T, 
    label: string,
}

interface ChipListProps<T> {
    chipList: ChipDataType<T>[]
    itemSelected: T,
    setItemSelected: Dispatch<SetStateAction<T>>
    onPress?: () => void,
}



export function ChipList<T>({
    chipList, 
    itemSelected,
    setItemSelected,
    onPress,
}: ChipListProps<T>) {

    const handleItemSelected = useCallback((value: typeof itemSelected) => {
        setItemSelected(value);
    }, [setItemSelected])

    const renderItem = useCallback(({item}: {item: ChipDataType<T>}) => 
        <MemoButtonChip
            label={item.label}
            isSelected={itemSelected === item.id}
            onPress={() => handleItemSelected(item.id)}
        />,
        [handleItemSelected, itemSelected]
    );

    return (
        <FlatList
            data={chipList}
            keyExtractor={(item) => item.id as string}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
            renderItem={renderItem}
        />
    );
}



export function ChipListSkeleton() {
    const data = ["1", "2", "3", "4", "5"];

    const renderItem = useCallback(() => 
        <MemoButtonChipSkeleton/>,
        []
    );

    return (
        <FlatList
            data={data}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item}
            contentContainerStyle={styles.contentContainer}
            renderItem={renderItem}
        />
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        gap: theme.gap.xs,
        padding: theme.padding.xs,
        paddingLeft: 0,
        // backgroundColor: "red",
    },
    
});
