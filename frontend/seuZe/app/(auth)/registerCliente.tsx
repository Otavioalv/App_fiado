import RegisterCliente from "@/src/components/common/RegisterCliente";
import MyScreenContainer from "@/src/components/common/MyScreenContainer";
import LogoG from "@/src/components/common/LogoG";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function Register() {

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
                <RegisterCliente/>
            </MyScreenContainer>
        </KeyboardAwareScrollView>
    )
}



