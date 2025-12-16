// login seguindo a documentação do expo, adaptar pro codigo  alterar oq for necessario

import { useCallback, useEffect, useReducer } from "react";
import * as SecureStore from "expo-secure-store";

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

// Muito complexo, analisar com calma
function useAsyncState<T>(initialValue:[boolean, T | null] = [true, null]): UseStateHook<T>{
    return useReducer(
        (state: [boolean, T | null], action: T | null = null): [boolean, T | null] => [false, action],
        initialValue
    ) as UseStateHook<T>;
}


// Salva ou deleta um valor no SecureStore
export async function setStorageItemAsync(key: string, value: string | null) {
    if(value == null) 
        await SecureStore.deleteItemAsync(key);
    else 
        await SecureStore.setItemAsync(key, value);
}


// Coleta valor do SecureStore
export function useStorageState(key: string): UseStateHook<string> {
    const [state, setState] = useAsyncState<string>();

    // Coleta o valaor do SecureStore
    useEffect(() => {
        // Vai no setureStore, coleta o item pela chava, e saval com setState
        SecureStore.getItemAsync(key).then((value: string | null) => {
            setState(value);
        });
    }, [key, setState]);


    const setValue = useCallback((value: string | null) => {
        setState(value);
        setStorageItemAsync(key, value);
    }, [key, setState]);

    return [state, setValue];
}
