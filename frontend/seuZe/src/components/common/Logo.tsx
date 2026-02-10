import { theme } from "@/src/theme";
import { AppDefaultSizes } from "@/src/types/responseServiceTypes";
import { Image } from "expo-image";
import { ImageStyle, StyleSheet, Text, TextStyle, View } from "react-native";

// import Svg, { Text as SvgText } from "react-native-svg";

interface ComponentsStyles {
    image: ImageStyle,
    text: TextStyle
}
type SizesStyleType = Record<AppDefaultSizes, ComponentsStyles>;

export type LogoProps = {
    size: AppDefaultSizes,
    text?: string,
}



export default function Logo({
    size,
    text,
}: LogoProps) {
    const logoPng = require("@/assets/images/logo.png");

    const sizeStyle: SizesStyleType = {
        S: {
            text: styles.textSmall,
            image: styles.imageSmall,
        },
        M: {
            text: styles.textMedium,
            image: styles.imageMedium,
        },
        L: {
            text: styles.textLarge,
            image: styles.imageLarge,
        },
    }


    const currentStyle = sizeStyle[size];
    return (
        <View style={styles.container}> 
            <Image 
                source={logoPng} 
                style={[styles.imageBase, currentStyle.image]}
            />
            {text && (
                <Text style={[styles.textBase, currentStyle.text]}>
                    {text}
                </Text>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    }, 
    
    imageBase: {
        maxWidth: 600,
        aspectRatio: 1, 
        resizeMode: "contain",

    },
    imageSmall: {
        width: '40%',
    },
    imageMedium: {
        width: '40%',
    },
    imageLarge: {
        width: '40%',
    },



    textBase: {
        color: theme.colors.textNeutral900,
        fontWeight: "bold",
    },
    textSmall: {
        fontSize: theme.typography.text4XL.fontSize,
    },
    textMedium: {
        fontSize: theme.typography.text4XL.fontSize,
    },
    textLarge: {
        fontSize: theme.typography.text4XL.fontSize,
    }
});
