import { create } from "zustand";
import { TypeUserList } from "@/src/types/responseServiceTypes";

type FilterCategoryStore = {
    requestedCategory: TypeUserList | null;
    request: (c: TypeUserList) => void;
    consume: () => void;
};

// Categoria global de fornecedores
export const useFilterCategoryStore = create<FilterCategoryStore>((set) => ({
    requestedCategory: null,
    request: (c) => set({ requestedCategory: c }),
    consume: () => set({ requestedCategory: null }),
}));
