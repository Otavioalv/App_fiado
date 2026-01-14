import { StyleSheet, View, Text} from "react-native";
import {Feather} from "@expo/vector-icons";
import { theme } from "@/src/theme";
import { ButtonModern } from "../ui/ButtonModern";


export interface ActionButtonProps {
    label: string;
    onPress: () => void;
}

export interface FeedbackTemplateProps {
    title: string;
    description: string;
    iconName: keyof typeof Feather.glyphMap;
    primaryAction?: ActionButtonProps;
    secondaryAction?: ActionButtonProps;
}

export default function FeedbackTemplate({description, iconName, title, primaryAction, secondaryAction}: FeedbackTemplateProps) {
    return (
        <View style={styles.container}>
            <Feather style={styles.icon} name={iconName}/>
            <Text style={styles.textTitle}> 
                {title}
            </Text>
            <Text style={styles.textDesc}>
                {description}
            </Text>

            {(primaryAction || secondaryAction) && (
                <View style={styles.buttonContainer}>
                    {primaryAction && (
                        <ButtonModern
                            placeholder={primaryAction.label} 
                            onPress={primaryAction.onPress}
                        />
                    )}
                    {secondaryAction && (
                        <ButtonModern 
                            placeholder={secondaryAction.label} 
                            variant="outline"
                            onPress={secondaryAction.onPress}
                        />
                    )}
                </View>  
            )}
        </View>
    );
}   

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: theme.gap.md,
        
        // backgroundColor: "blue"
    },
    buttonContainer: {
        gap: theme.gap.md,
        // backgroundColor: "green",
        // flex: 1,
        // width: "100%"
    },
    icon: {
        color: theme.colors.orange,
        fontSize: theme.typography.text10XL.fontSize
    },
    textTitle: {
        ...theme.typography.textXL,
        color: theme.colors.textNeutral900,
        fontWeight: "bold"
    },
    textDesc: {
        fontSize: theme.typography.textMD.fontSize,
        textAlign: "center",
        color: theme.colors.textNeutral900
        // backgroundColor: "red"
    }
});