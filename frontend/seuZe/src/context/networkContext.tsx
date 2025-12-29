import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

export type NetworkContextType = {
    isOnline: boolean;
}

const defaultNetworkContext: NetworkContextType = {
    isOnline: true,
}

const NetworkContext = createContext<NetworkContextType>(defaultNetworkContext);

export function useNetwork() {
    return useContext(NetworkContext);
}

export function NetworkProvider({children}: PropsWithChildren) {
    const [isOnline, setIsOnline] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            const online = Boolean(
                state.isConnected && state.isInternetReachable !== false
            );
            
            console.log("[Network Provider] online: ", online);

            setIsOnline(online);
        });

        return unsubscribe
    }, []);

    return (
        <NetworkContext.Provider 
            value={{
                isOnline
            }}
        >
            {children}
        </NetworkContext.Provider>
    )
}