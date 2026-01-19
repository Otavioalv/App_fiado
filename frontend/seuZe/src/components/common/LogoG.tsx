import { theme } from "@/src/theme";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

// import Svg, { Text as SvgText } from "react-native-svg";

export type LogoGProps = {
    text: string
}

export default function LogoG({text}: LogoGProps) {
    const logoPng = require("@/assets/images/logo.png");

    return (
        <View style={styles.container}> 
            <Image 
                source={logoPng} 
                style={styles.image}
            />
            <Text style={styles.text}>
                {text}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    }, 
    image: {
        width: '40%',
        maxWidth: 600,
        aspectRatio: 1, 
        resizeMode: "contain",
    },
    text: {
        fontFamily: "ExpoSans-Bold",
        fontSize: theme.typography.text4XL.fontSize,
        fontWeight: "bold"
    }
});
