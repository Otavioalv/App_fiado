import { StyleSheet, View } from "react-native";
import InputForm from "../ui/InputForm";

export default function BasicRegisterForm() {
    return (
         <View style={style.formContainer}>
            <InputForm title={"NOME"} placeholder="Nome de usuário"/>
            <InputForm title={"APELIDO"} placeholder="Apelido"/>
            <InputForm title={"TELEFONE"} placeholder="(00) 0 0000-0000" keyboardType="phone-pad"/> 
            <InputForm title={"SENHA"} placeholder="Senha" secureTextEntry={true}/>
        </View>
    );
}

const style = StyleSheet.create({
    formContainer: {
        gap: 20
    }
});