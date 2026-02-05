import { createContext, useContext, useRef, useState, useCallback, ReactNode, useEffect } from "react";
import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { StyleSheet, Keyboard } from "react-native";
import { theme } from "../theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type OpenSheetBottomType = (
    content: ReactNode, 
    snapPoints?: string[],
    enableDynamicSizing?: boolean
) => void

interface GlobalBottomSheetContextData {
    openSheet: OpenSheetBottomType;
    // safeOpenSheet: OpenSheetBottomType;
    closeSheet: () => void;
}

const GlobalBottomSheetContext = createContext<GlobalBottomSheetContextData>({} as GlobalBottomSheetContextData);

export function BottomSheetProvider({ children }: { children: ReactNode }) {
    const insets = useSafeAreaInsets();

    const [sheetContent, setSheetContent] = useState<ReactNode | null>(null);
    const [snapPoints, setSnapPoints] = useState<string[]>(['50%']);
    const [dynamicSizing, setDynamicSizing] = useState<boolean>(true);
    
    const bottomSheetRef = useRef<BottomSheet>(null);


    // Verifica se tela carregou
    useEffect(() => {
        if(sheetContent) {
            requestAnimationFrame(() => {
                Keyboard.dismiss();
                // bottomSheetRef.current?.expand();
                bottomSheetRef.current?.snapToIndex(0);
            });

        } else {
            bottomSheetRef.current?.close();
        }
    }, [sheetContent]);

    const closeSheet = useCallback(() => {
        Keyboard.dismiss();
        setSheetContent(null);
    }, []);

    const openSheet = useCallback<OpenSheetBottomType>((
        content: ReactNode, 
        snaps: string[] = ['25%', '50%', "75%", "100%"],
        enableDynamicSizing: boolean = true
    ) => {
        requestAnimationFrame(() => {
            setSnapPoints(snaps);
            setDynamicSizing(enableDynamicSizing);
            setSheetContent(content);
        });
    }, []);


    // const safeOpenSheet = useCallback<OpenSheetBottomType>((
    //     content, 
    //     snaps,
    //     enableDynamicSizing
    // ) => {
    //     requestAnimationFrame(() => openSheet(content, snaps, enableDynamicSizing));
    // }, [openSheet]);

    // Fundo tranaparente segurança
    const renderBackdrop = useCallback(
        (props: BottomSheetBackdropProps) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                opacity={0.5}
                pressBehavior="close"
                style={{marginBottom: insets.bottom}}
            />
        ),
        [insets]
    );

    return (
        <GlobalBottomSheetContext.Provider
            value={{ 
                openSheet,
                // safeOpenSheet,
                closeSheet 
            }}
        >
            {children}

            <BottomSheet
                ref={bottomSheetRef}
                // key={sheetKey}
                index={-1} 
                snapPoints={snapPoints}
                enablePanDownToClose={true}
                backdropComponent={renderBackdrop}
                keyboardBlurBehavior="restore"
                backgroundStyle={{ borderRadius: 24 }}
                onClose={() => setSheetContent(null)}
                handleIndicatorStyle={styles.indicatorStyle}
                enableOverDrag={false}
                enableDynamicSizing={dynamicSizing}
                topInset={insets.top}
                bottomInset={insets.bottom}
                
                // enableContentPanningGesture={false}
            >
                {sheetContent}
            </BottomSheet>
        </GlobalBottomSheetContext.Provider>
    );
}

export function useGlobalBottomSheet() {
    return useContext(GlobalBottomSheetContext);
}

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        padding: 14,
    },
    indicatorStyle: {
        backgroundColor: theme.colors.orange
    },
});
