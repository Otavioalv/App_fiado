import React, { useRef } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import ReanimatedSwipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import { RectButton } from 'react-native-gesture-handler';
import { SharedValue } from 'react-native-reanimated';

const SwipeableListItem = ({ 
    item, 
    renderRightActions, 
    onOpen 
    }:{
        item: { 
            id: string, 
            title: string 
        }, 
        renderRightActions: ((progress: SharedValue<number>, translation: SharedValue<number>, swipeableMethods: SwipeableMethods) => React.ReactNode) | undefined, 
        onOpen: (currentRef: SwipeableMethods | null) => void 
    }) => {
    
    const swipeableRef = useRef(null);

    return (
        <ReanimatedSwipeable
            ref={swipeableRef}
            renderRightActions={renderRightActions}
            onSwipeableWillOpen={() => {
            // Chama a função passada pelo pai para fechar outros itens
                onOpen(swipeableRef.current);
            }}
            // Opcional: fechar ao arrastar um pouco
            rightThreshold={40}
        >
            <View style={styles.item}>
                <Text>{item.title}</Text>
            </View>
        </ReanimatedSwipeable>
    );
};

export default function Teste() {
    // Guarda a referência do item atualmente aberto
    const openedSwipeable = useRef<SwipeableMethods>(null);

    const closeOpenedSwipeable = (currentRef: SwipeableMethods | null) => {
        if (openedSwipeable.current && openedSwipeable.current !== currentRef) {
            openedSwipeable.current.close();
        }

        openedSwipeable.current = currentRef;
    };

  const renderRightActions = () => (
    <RectButton style={styles.deleteAction}>
      <Text style={styles.actionText}>Excluir</Text>
    </RectButton>
  );

  const data = [{ id: '1', title: 'Item 1' }, { id: '2', title: 'Item 2' }, { id: '3', title: 'Item 3' }];

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <SwipeableListItem
          item={item}
          renderRightActions={renderRightActions}
          onOpen={closeOpenedSwipeable}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  item: { 
    backgroundColor: 'white', 
    padding: 20, 
    borderBottomWidth: 1, 
    borderBottomColor: '#ccc' 
},
  deleteAction: { 
    backgroundColor: 'red', 
    justifyContent: 'center', 
    alignItems: 'flex-end', 
    flex: 1 },
  actionText: { 
    color: 'white', 
    fontWeight: 'bold', 
    padding: 20 },
});
