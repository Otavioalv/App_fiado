import LoginForm from "@/src/components/common/LoginForm";
import LogoG from "@/src/components/common/LogoG";
import MyScreenContainer from "@/src/components/common/MyScreenContainer";
// import { ScrollView } from "react-native";
// import logoIcon from "../../assets/images/logo"
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";

export default function Login() {
    return (
        <KeyboardAwareScrollView
            style={{flex: 1}}
            contentContainerStyle={{flexGrow:1}} 
            enableOnAndroid={true}

            extraScrollHeight={300}
            enableAutomaticScroll={true}

            keyboardShouldPersistTaps="handled"
        >   
            <MyScreenContainer>
                <LogoG text="SEU ZÉ"/>
                <LoginForm title="Entre para continuar"/>
            </MyScreenContainer>
        </KeyboardAwareScrollView>
    )
}

