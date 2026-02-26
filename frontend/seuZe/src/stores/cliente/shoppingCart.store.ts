import { CartLocalItem } from "@/src/types/responseServiceTypes";
import { create } from "zustand";


interface ShoppingCartStore {
    cartItems: CartLocalItem[],
    addItemToCartStore: (product: CartLocalItem) => void,
    setCart: (cartItems: CartLocalItem[]) => void,
    clearCart: () => void,
}



export function getDefaultPrazo() {
    const date = new Date()
    date.setDate(date.getDate() + 5)

    return date.toISOString() // ou formata como quiser
}


export const useShoppingCartStore = create<ShoppingCartStore>((set) => ({
    cartItems: [],
    addItemToCartStore: (product) => 
        set((state) => {
            const existing = state.cartItems.find(
                (item) => item.id_product === product.id_product
            );

            const productWithPrazo = {
                ...product,
                prazo: product.prazo ?? getDefaultPrazo(),
            }

            // Se produto existe, so atualiza ele na lista
            if(existing) {
                return {
                    cartItems: state.cartItems.map((item) =>
                    item.id_product === product.id_product
                        ? productWithPrazo
                        : item
                    ),
                };
            }
            return { cartItems: [...state.cartItems, productWithPrazo] };
        }),
    setCart: (cartItems) => set({cartItems}),
    clearCart: () => set({cartItems: []})
}));
