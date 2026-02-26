import React from 'react';
import { Button, StyleSheet, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { theme } from "@/src/theme";

export default function Teste() {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  
  const BUBBLE_SIZE = 60;
  // Margens para o botão não colar totalmente na quina da tela
  const MARGIN = 20;

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const context = useSharedValue({ x: 0, y: 0 });

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { x: translateX.value, y: translateY.value };
    })
    .onUpdate((event) => {
      // Cálculo dos limites
      // Como o botão começa em right:30, o limite de X para a direita é 30
      // O limite para a esquerda é -(LARGURA_DA_TELA - TAMANHO_BOTAO - MARGEM)
      
      const newX = event.translationX + context.value.x;
      const newY = event.translationY + context.value.y;

      // Limita o X (Horizontal)
      // Ajuste os números conforme a posição inicial do seu style (right: 30)
      const minX = -(SCREEN_WIDTH - BUBBLE_SIZE - MARGIN);
      const maxX = MARGIN; 
      
      // Limita o Y (Vertical) 
      // Ajuste conforme o bottom: 100
      const minY = -(SCREEN_HEIGHT - BUBBLE_SIZE - MARGIN - 100);
      const maxY = 100;

      translateX.value = Math.min(Math.max(newX, minX), maxX);
      translateY.value = Math.min(Math.max(newY, minY), maxY);
    })
    .onEnd(() => {
      // Efeito de "grudar" na borda lateral mais próxima ao soltar
      const targetX = translateX.value > -(SCREEN_WIDTH / 2) ? 0 : -(SCREEN_WIDTH - BUBBLE_SIZE - MARGIN - 10);
      
      // Configuração para uma mola muito rápida e sem "balanço" excessivo
        translateX.value = withSpring(targetX, {
          damping: 15,    // Menor amortecimento = para mais rápido
          stiffness: 150, // Maior rigidez = volta com mais força
          mass: 0.5,      // Menor massa = objeto mais leve para mover
        });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.bubble, animatedStyle]}>
          <Feather name="shopping-cart" size={24} color="white" />
        </Animated.View>
      </GestureDetector>

      <Button title='teste' onPress={() => console.log("teste")}/>
        
    </>
  );
}

const styles = StyleSheet.create({
  bubble: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 100, // Posição inicial Y
    right: 20,   // Posição inicial X
    elevation: 10,
    zIndex: 9999, // Garante que fica na frente de tudo
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
});
