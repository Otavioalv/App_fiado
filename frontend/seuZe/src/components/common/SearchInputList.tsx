import { Pressable, StyleSheet, View } from "react-native";
import { SpacingScreenContainer } from "../ui/SpacingScreenContainer";
import { InputTextSearch } from "../ui/InputTextSearch";
import { theme } from "@/src/theme";
import { Feather } from "@expo/vector-icons";
import { Dispatch, SetStateAction, useEffect } from "react";
import FilterButton from "./FilterButton";
import { useBottomSheet } from "@/src/context/bottomSheetContext";
import { FilterOptionsBottom } from "./FilterOptionsBottom";
import { OnSubmitSearchType } from "@/src/types/responseServiceTypes";


export interface SearchInputListProps {
    placeholder: string,
    onSubmit: OnSubmitSearchType,

    inputValue: string, 
    setInputValue: Dispatch<SetStateAction<string>>,

    filterValue?: string,
    setFilterValue?: Dispatch<SetStateAction<string>>,

    filterList?: string[],
}

export function SearchInputList({
    onSubmit,
    placeholder,
    inputValue,
    setInputValue,
    filterValue,
    setFilterValue,
    filterList,
}: SearchInputListProps) {

    const { openSheet, closeSheet } = useBottomSheet();
    
    
    const handleFilterSelected: Dispatch<SetStateAction<string>> = (value) => {
        
        const resolvedValue = typeof value === 'function' ? 
            (value as (prev: string) => string)(filterValue ?? "") : 
            value;

        if(setFilterValue) {
            setFilterValue(value);
            onSubmit(inputValue, resolvedValue);
        }
    }


    const handlerOpenFilter = () => {
        if(setFilterValue && filterValue) {
            openSheet(
                <FilterOptionsBottom 
                    filterList={filterList ?? []} 
                    filterValue={filterValue ?? ""} 
                    setFilterValue={handleFilterSelected}
                />,
                ["35%"],
                false
            )
        }
    };

    

    useEffect(() => {
        closeSheet();
    }, [filterValue, closeSheet]);


    return (
        <SpacingScreenContainer
            style={{paddingBottom: theme.padding.xs}}
        >
            <View
                style={styles.searchContainer}
            >   
                <Pressable
                    onPress={() => onSubmit(inputValue, filterValue)}
                    style={styles.iconContainer}
                >
                    <Feather 
                        name="search"
                        style={styles.icon}
                    />
                </Pressable>

                <InputTextSearch
                    style={{maxHeight: 50}}
                    value={inputValue}
                    onChangeText={setInputValue}
                    placeholder={placeholder}
                    onSubmitEditing={() => onSubmit(inputValue, filterValue)}
                    returnKeyType="search"
                />

                {filterList?.length && filterValue ? (
                    <FilterButton onPress={handlerOpenFilter}/>
                ): null}
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
        borderColor: theme.colors.orange,
        flexDirection: "row",
    },
    iconContainer: {
        alignItems: "center",
        justifyContent: "center"
    },
    icon: {
        fontSize: theme.typography.textLG.fontSize, // testar alterar
        padding: theme.padding.xs,
        paddingLeft: theme.padding.sm,
        color: theme.colors.orange,
    }
});
