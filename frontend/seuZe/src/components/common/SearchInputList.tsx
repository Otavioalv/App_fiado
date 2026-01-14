import { Pressable, StyleSheet, Text, View } from "react-native";
import { SpacingScreenContainer } from "../ui/SpacingScreenContainer";
import { InputTextSearch } from "../ui/InputTextSearch";
import { theme } from "@/src/theme";
import { Feather } from "@expo/vector-icons";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import FilterButton from "./FilterButton";
import { useBottomSheet } from "@/src/context/bottomSheetContext";
import { FilterOptionsBottom } from "./FilterOptionsBottom";


export type OnSubmitSearchType = (search: string, filter?: string) => void;

export interface SearchInputListProps {
    placeholder: string,
    // hasFilter: boolean,
    onSubmit: OnSubmitSearchType,

    inputValue: string, 
    setInputValue: Dispatch<SetStateAction<string>>,

    filterValue?: string,
    setFilterValue?: Dispatch<SetStateAction<string>>,


    filterList?: string[],
}

export function SearchInputList({
    // hasFilter,
    onSubmit,
    placeholder,
    inputValue,
    setInputValue,
    filterValue,
    setFilterValue,
    filterList,
}: SearchInputListProps) {
    const [search, setSearch] = useState<string>(inputValue);
    const [filter, setFilter] = useState<string>("");

    const {openSheet, closeSheet} = useBottomSheet();

    const handlerOpenFilter = () => {
        openSheet(
            <FilterOptionsBottom 
                filterList={filterList ?? []} 
                filterValue={filter} 
                setFilterValue={setFilter}
            />,
            ["35%"],
            false
        )
    };

    useEffect(() => {
        closeSheet();
        onSubmit(search, filter);
        
    }, [filter]);

    // Testar
    useEffect(() => {
        setFilter(filterValue ?? "");
        // console.log(filterValue);
        console.log("filter: ", filterValue);
    }, [filterValue]);


    return (
        <SpacingScreenContainer
            style={{paddingBottom: theme.padding.xs}}
        >
            <View
                style={styles.searchContainer}
            >   
                <Pressable
                    onPress={() => onSubmit(search, filter)}
                    style={styles.iconContainer}
                >
                    <Feather 
                        name="search"
                        style={styles.icon}
                    />
                </Pressable>

                <InputTextSearch
                    value={search}
                    onChangeText={setSearch}
                    placeholder={placeholder}
                />

                {filterList?.length && (
                    <FilterButton onPress={handlerOpenFilter}/>
                )}
            </View>
        </SpacingScreenContainer>
    );
}

const styles = StyleSheet.create({
    searchContainer: {
        borderRadius: 10000,
        overflow: "hidden",
        backgroundColor: "#ffffff",
        borderWidth: 1,
        // borderColor: theme.colors.pseudoLightGray,
        borderColor: theme.colors.orange,
        flexDirection: "row",
    },
    iconContainer: {
        // backgroundColor: "red",
        alignItems: "center",
        justifyContent: "center"
    },
    icon: {
        fontSize: theme.typography.textLG.fontSize, // testar alterar
        padding: theme.padding.xs,
        paddingLeft: theme.padding.sm,
        // color: theme.colors.pseudoLightGray
        color: theme.colors.orange,
        // flex: 1,
    }
});
