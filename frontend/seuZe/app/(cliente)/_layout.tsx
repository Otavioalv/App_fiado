import FloatingCartButton from "@/src/components/common/FloatingCartButton";
import { useSession } from "@/src/context/authContext";
import { ShoppingCartVisibilityProvider } from "@/src/context/shoppingVisilyCartContext";
import { listShoppingCard } from "@/src/services/clienteService";
import { useShoppingCartStore } from "@/src/stores/cliente/shoppingCart.store";
import { Stack } from "expo-router";
import { useEffect } from "react";

export default function ClienteLayout() {
  const { session } = useSession()
  
  const setCart = useShoppingCartStore(state => state.setCart);
  const clearCart = useShoppingCartStore(state => state.clearCart);

  useEffect(() => {
    if (!session) {
      clearCart()
      return
    }

    async function loadCart() {
      try {
        const response = await listShoppingCard()
        setCart(response.list)
      }catch(e) {
        console.log("Erro ao carregar carrinho: ", e)
        setCart([]);
      }
    }
    loadCart()
  }, [clearCart, session, setCart])

  return (
    <ShoppingCartVisibilityProvider>
      <>
        <Stack 
          initialRouteName="(tabs)"
          screenOptions={{ 
            headerShown: false,
            animation: 'none',
            // animation: "slide_from_right",
            // animationDuration: 100,
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="notificacoes"/>
          <Stack.Screen name="shopping_cart"/>
          <Stack.Screen name="shopping_resume"/>
          {/* <Stack.Screen name="fornecedores" /> */}
        </Stack>

        <FloatingCartButton/>
      </>
    </ShoppingCartVisibilityProvider>
  );
}
