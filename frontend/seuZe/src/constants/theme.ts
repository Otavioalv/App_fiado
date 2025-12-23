import { DarkTheme, DefaultTheme, Theme } from "@react-navigation/native";
import { theme } from "../theme";


const customDefaultBG = "#FFFFFF";
const customDarkBG = "#000000"


export const MyDefaultTheme: Theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: customDefaultBG,
        text: theme.colors.textNeutral900
    }
}

export const MyDarkTheme: Theme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        background: customDarkBG
    
    },
};
