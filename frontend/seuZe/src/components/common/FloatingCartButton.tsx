import React from "react";
import { Pressable, StyleSheet, Text, useWindowDimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { theme } from "@/src/theme";
import { useShoppingCartVisibility } from "@/src/context/shoppingVisilyCartContext";
import { useRouter } from "expo-router";

export default function FloatingCartButton() {
  const { hasItems, totalItems } = useShoppingCartVisibility();
  const router = useRouter();

  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();

  const BUBBLE_SIZE = 60;
  const MARGIN = 20;

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const context = useSharedValue({ x: 0, y: 0 });

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = {
        x: translateX.value,
        y: translateY.value,
      };
    })
    .onUpdate((event) => {
      const newX = event.translationX + context.value.x;
      const newY = event.translationY + context.value.y;

      // Limites corretos para TOP + LEFT
      const minX = -MARGIN;
      const maxX = SCREEN_WIDTH - BUBBLE_SIZE - MARGIN;

      const minY = -MARGIN;
      const maxY = SCREEN_HEIGHT - BUBBLE_SIZE - MARGIN;

      translateX.value = Math.min(Math.max(newX, minX), maxX);
      translateY.value = Math.min(Math.max(newY, minY), maxY);
    })
    .onEnd(() => {
      // Snap lateral (esquerda ou direita)
      const middle = SCREEN_WIDTH / 2 - BUBBLE_SIZE / 2;

      const targetX =
        translateX.value < middle
          ? 0
          : SCREEN_WIDTH - BUBBLE_SIZE - MARGIN;

      translateX.value = withSpring(targetX, {
        damping: 15,
        stiffness: 150,
        mass: 0.5,
      });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  if (!hasItems) return null;

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.bubble, animatedStyle]}>
        <Pressable onPress={() => router.push("/(cliente)/shopping_cart")}>
          <Feather name="shopping-cart" size={24} color="white" />
        </Pressable>

        {totalItems > 0 && (
          <Text style={styles.totalItems}>{totalItems}</Text>
        )}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  bubble: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.orange,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 100,
    left: 20,

    elevation: 10,
    zIndex: 9999,
  },
  totalItems: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "white",
    color: theme.colors.orange,
    fontSize: theme.typography.textSM.fontSize,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 999,
    fontWeight: "bold",
    borderWidth: 1,
    borderColor: theme.colors.orange,
  },
});
