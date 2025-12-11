import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

// import Svg, { Text as SvgText } from "react-native-svg";

export type LogoGProps = {
    text: string
}

export default function LogoM({text}: LogoGProps) {
    return (
        <View style={styles.container}> 
            <Image 
                source={require("../../../assets/images/logo.png")} 
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
        fontSize: 50,
        fontWeight: "bold"
    }
});