import axios from 'axios';
import { Alert } from 'react-native';

const baseURL: string = process.env.EXPO_PUBLIC_API_URL || "";


Alert.alert("conexao da api Teste: ", baseURL);
Alert.alert("Teste: ", process.env.EXPO_PUBLIC_TESTE);

const api = axios.create({
    baseURL,
    // timeout: 10000,
    // headers: {"Content-Type": "application/json"}
});

export {api};