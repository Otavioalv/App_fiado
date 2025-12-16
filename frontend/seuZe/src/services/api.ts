import axios from 'axios';
import { Alert } from 'react-native';
import * as SecureStore from  "expo-secure-store";

const baseURL: string = process.env.EXPO_PUBLIC_API_URL || "";


Alert.alert("conexao da api Teste: ", baseURL);
Alert.alert("Teste: ", process.env.EXPO_PUBLIC_TESTE);

const api = axios.create({
    baseURL,
    timeout: 10000,
    // headers: {"Content-Type": "application/json"}
});


// gancho q age de forma automatica a toda requisição
api.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync("user_token");

        if(token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }, 
    // Fazer verificação melhor
    (error) => Promise.reject(error)
);


export {api};
