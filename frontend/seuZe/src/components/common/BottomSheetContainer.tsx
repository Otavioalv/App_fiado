import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import { PropsWithChildren } from "react";
import { Text, View } from "react-native";

type BottonSheetContainerProps = PropsWithChildren

export function BottomSheetContainer({children}: BottonSheetContainerProps) {
    return(
        <BottomSheet>
            <BottomSheetView>
                {children}
            </BottomSheetView>
        </BottomSheet>
    )
}




// import React, { forwardRef, useMemo, useCallback } from "react";
// import { StyleSheet, Text, View } from "react-native";
// import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
// import { theme } from "@/src/theme";

// interface FilterBottomSheetProps {
//     // Adicione props aqui se precisar passar a lista de filtros
//     data?: string[]; 
// }

// forwardRef permite que a tela pai chame .expand() ou .close()
// export function  BottomSheetContainer = forwardRef<BottomSheet, FilterBottomSheetProps>((props, ref) => {
//     // Pontos de parada: 25% e 50% da tela
//     const snapPoints = useMemo(() => ['25%', '50%'], []);

//     // Backdrop é aquele fundo escuro que aparece atrás
//     const renderBackdrop = useCallback(
//         (props: any) => (
//             <BottomSheetBackdrop
//                 {...props}
//                 disappearsOnIndex={-1}
//                 appearsOnIndex={0}
//                 opacity={0.5}
//             />
//         ),
//         []
//     );

//     return (
//         <BottomSheet
//             ref={ref}
//             index={-1} // Começa fechado
//             snapPoints={snapPoints}
//             enablePanDownToClose={true}
//             backdropComponent={renderBackdrop}
//             backgroundStyle={{ borderRadius: 24 }}
//         >
//             <BottomSheetView style={styles.contentContainer}>
//                 <Text style={styles.title}>Filtrar Resultados</Text>
//                 {/* AQUI VAI SUA LISTA DE FILTROS OU FLATLIST */}
//                 <Text>Coloque seus filtros aqui...</Text>
//             </BottomSheetView>
//         </BottomSheet>
//     );
// });

// const styles = StyleSheet.create({
//     contentContainer: {
//         flex: 1,
//         padding: 24,
//         alignItems: 'center',
//     },
//     title: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         color: theme.colors.text_primary, // Ajuste para seu tema
//         marginBottom: 20
//     }
// });
