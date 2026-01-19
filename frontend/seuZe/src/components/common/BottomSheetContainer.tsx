import BottomSheet, {  BottomSheetView } from "@gorhom/bottom-sheet";
import { PropsWithChildren } from "react";

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
