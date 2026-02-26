import React, { createContext, useContext, useMemo } from "react";
import { useShoppingCartStore } from "@/src/stores/cliente/shoppingCart.store";

interface ShoppingCartVisibilityContextData {
  hasItems: boolean;
  totalItems: number;
}

const ShoppingCartVisibilityContext = createContext<ShoppingCartVisibilityContextData | null>(null);

export function ShoppingCartVisibilityProvider({ children }: { children: React.ReactNode }) {
  const cartItems = useShoppingCartStore(state => state.cartItems);

  const value = useMemo(() => {
    return {
      hasItems: cartItems.length > 0,
      totalItems: cartItems.length,
    };
  }, [cartItems]);

  return (
    <ShoppingCartVisibilityContext.Provider value={value}>
      {children}
    </ShoppingCartVisibilityContext.Provider>
  );
}

export function useShoppingCartVisibility() {
  const context = useContext(ShoppingCartVisibilityContext);

  if (!context) {
    throw new Error("useShoppingCartVisibility must be used inside ShoppingCartVisibilityProvider");
  }

  return context;
}