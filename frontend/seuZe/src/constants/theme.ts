import { DarkTheme, DefaultTheme, Theme } from "@react-navigation/native";


const customDefaultBG = "#FFFFFF";
const customDarkBG = "#000000"


export const MyDefaultTheme: Theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: customDefaultBG,
        text: "#ffffff"
    }
}

export const MyDarkTheme: Theme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        background: customDarkBG
    
    },
};
