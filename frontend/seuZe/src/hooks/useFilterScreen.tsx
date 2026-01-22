import { useState } from "react";
import { Keyboard } from "react-native";
import { ErrorTypes } from "@/src/types/responseServiceTypes";

export function useFilterScreen<CategoryType = string>(initialCategory: CategoryType) {
    const [searchQuery, setSearchQuery] = useState("");
    const [typingText, setTypingText] = useState("");
    // const [filterQuery, setFilterQuery] = useState("");
    const [filter, setFilter] = useState("");
    const [errorType, setErrorType] = useState<ErrorTypes | null>(null);
    const [activeCategory, setActiveCategory] = useState<CategoryType>(initialCategory);

    const handleSearch = (txtSearch: string, txtFilter: string = "") => {
        Keyboard.dismiss();
        setErrorType(null);
        setTypingText(txtSearch.trim());
        setSearchQuery(txtSearch.trim());
        setFilter(txtFilter.trim());
        // setFilterQuery(txtFilter.trim());
    };

    return {
        searchQuery,
        typingText,
        setTypingText,
        // filterQuery,
        filter,
        errorType,
        activeCategory,
        setActiveCategory,
        handleSearch,
        setErrorType,
        setFilter,
    };
}
