import {
    createContext,
    useContext,
    useRef,
    useState,
    useCallback,
    ReactNode,
    useEffect
} from "react";

import {
    BottomSheetModal,
    BottomSheetBackdrop,
    BottomSheetBackdropProps
} from "@gorhom/bottom-sheet";

import { Keyboard, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "../theme";

type OpenSheetBottomType = (
    content: ReactNode,
    snapPoints?: string[],
    enableDynamicSizing?: boolean
) => void;

interface ContextData {
    openSheet: OpenSheetBottomType;
    closeSheet: () => void;
}

const GlobalBottomSheetModalContext = createContext({} as ContextData);

export function GlobalBottomSheetModalProvider({ children }: { children: ReactNode }) {
    const insets = useSafeAreaInsets();

    const [sheetContent, setSheetContent] = useState<ReactNode | null>(null);
    const [snapPoints, setSnapPoints] = useState(['50%']);
    const [dynamicSizing, setDynamicSizing] = useState(true);

    const bottomSheetRef = useRef<BottomSheetModal>(null);

    useEffect(() => {
        if (sheetContent) {
            requestAnimationFrame(() => {
                Keyboard.dismiss();
                bottomSheetRef.current?.present();
            });
        } else {
        bottomSheetRef.current?.dismiss();
            }
    }, [sheetContent]);

    const openSheet = useCallback<OpenSheetBottomType>(
        (
            content, 
            snaps = ['25%', '50%', "75%", "100%"], 
            enableDynamicSizing = true
        ) => {
            requestAnimationFrame(() => {
                setSnapPoints(snaps);
                setDynamicSizing(enableDynamicSizing);
                setSheetContent(content);
            });
        },[]
    );

    const closeSheet = useCallback(() => {
        Keyboard.dismiss();
        setSheetContent(null);
    }, []);

    const renderBackdrop = useCallback(
        (props: BottomSheetBackdropProps) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                opacity={0.5}
                pressBehavior="close"
                style={{ marginBottom: insets.bottom }}
            />
        ),
        [insets]
    );

    return (
        <GlobalBottomSheetModalContext.Provider value={{ openSheet, closeSheet }}>
            {children}

            <BottomSheetModal
                ref={bottomSheetRef}
                // index={-1}
                snapPoints={snapPoints}
                backdropComponent={renderBackdrop}
                enablePanDownToClose
                backgroundStyle={{ borderRadius: 24 }}
                handleIndicatorStyle={styles.indicatorStyle}
                topInset={insets.top}
                bottomInset={insets.bottom}
                enableDynamicSizing={dynamicSizing}
                onDismiss={() => setSheetContent(null)}
            >
                {sheetContent}
            </BottomSheetModal>
        </GlobalBottomSheetModalContext.Provider>
    );
}

export function useGlobalBottomModalSheet() {
    return useContext(GlobalBottomSheetModalContext);
}

const styles = StyleSheet.create({
    indicatorStyle: {
        backgroundColor: theme.colors.orange,
    },
});
