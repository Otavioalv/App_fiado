
import { theme } from "@/src/theme";
import { useNetInfo } from "@react-native-community/netinfo";
import { StyleSheet, Text, View } from "react-native";

export function OfflineNotice() {
  const {
    // type,
    isConnected
  } = useNetInfo();

  if(isConnected !== false)
    return null;

  return (
    <View
      style={styles.container}
    >
      <Text style={styles.text}>
        Sem conexão com a internet
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
      backgroundColor: theme.colors.darkGray, 
      paddingVertical: theme.padding.xs,
      // zIndex: 990,
    },
    text: { 
      color: "white", 
      textAlign: "center" 
    }
});