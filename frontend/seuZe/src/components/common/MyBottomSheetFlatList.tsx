import { theme } from "@/src/theme";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { BottomSheetFlatListProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetScrollable/types";
import { StyleSheet } from "react-native";

type Props<T> = BottomSheetFlatListProps<T>;

export function MyBottomSheetFlatList<T>(props: Props<T>) {
    return (
        <BottomSheetFlatList
            {...props}
            contentContainerStyle={[
                styles.flatListContainer,
                props.contentContainerStyle,
            ]}
        />
    );
}

const styles = StyleSheet.create({
    flatListContainer: {
        padding: theme.padding.sm,
        gap: theme.gap.sm,
    },
});
