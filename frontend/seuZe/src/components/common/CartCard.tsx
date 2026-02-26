import { Animated, GestureResponderEvent, Pressable, PressableProps, StyleSheet, Text, View } from "react-native";
import { DefaultDescription, DefaultDescriptionSkeleton } from "../ui/DefaultDescription";
import { TextProductPrice, TextProductPriceSkeleton } from "../ui/TextProductPrice";
import { Stepper, StepperSkeleton } from "./Stepper";
import { memo, useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import { theme } from "@/src/theme";
import { PressableCard } from "../ui/PressableCard";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import DateTimePicker from "@react-native-community/datetimepicker";
import { DefaultCard } from "../ui/DefaultCard";
import { useAnimationOpacitySkeleton } from "@/src/hooks/useMyAnimations";


export interface CartCardProps extends PressableProps {
    productName: string,
    store: string,
    price: number,
    term: string, 
    quantity: number,
    onChangeQuantity: (newQuantity: number) => void,
    onChangeTerm: (newTerm: string) => void,
    onDelete?: ((event: GestureResponderEvent) => void) | null;
}

export function CartCard({
    productName,
    store,
    price,
    term,
    quantity,
    onChangeQuantity,
    onChangeTerm,
    onDelete,
}: CartCardProps){
    // const [date, setDate] = useState(parseISO(term));
    // const [showPicker, setShowPicker] = useState(false);

    const parsedDate = parseISO(term);
    const [showPicker, setShowPicker] = useState(false);    

    const onChange = (event: any, selectedDate?: Date) => {
        setShowPicker(false);

        if (selectedDate) {
            onChangeTerm(selectedDate.toISOString());
        }
    };


    return (
        <PressableCard>
            <View style={styles.infoTop}>
                <DefaultDescription
                    text1={productName}
                    text2={store}
                    size="S"
                />

                <TextProductPrice
                    price={price}
                />

                <Pressable
                    onPress={onDelete}
                    style={({ pressed }) => [{
                        opacity: pressed ? 0.5 : 1, // Diminui para 50% ao apertar
                    }]}
                >
                    <Feather
                        name="trash-2"
                        style={styles.trashIcon}
                    />
                </Pressable>
            </View>

            <View style={styles.infoBottom}>
                <Stepper
                    quantity={quantity}
                    setQuantity={(value) => {
                        if (typeof value === "function") {
                            const newValue = value(quantity)
                            onChangeQuantity(newValue)
                        } else {
                            onChangeQuantity(value)
                        }
                        // setQnt(value)
                    }}
                />
                <View style={styles.dateContainer}>
                    <Text style={styles.titleCalandar}>Prazo de pagamento</Text>

                    <Pressable
                        onPress={() => setShowPicker(true)}
                        style={({pressed}) => [
                            styles.infoDateContainer,
                            pressed && { opacity: 0.7 }
                        ]}
                    >
                        <Feather name="calendar" style={styles.calendarIcon} />
                        <Text style={styles.textCalandar}>
                            {format(parsedDate, "dd/MM/yyyy", { locale: ptBR })}
                        </Text>
                    </Pressable>

                    {showPicker && (
                        <DateTimePicker
                            value={parsedDate}
                            mode="date"
                            display="default"
                            onChange={onChange}
                            minimumDate={new Date()} // Impede selecionar datas passadas
                        />
                    )}
                </View>
            </View>
        </PressableCard>
    );
}

export const MemoCartCard = memo(CartCard);

export function CartCartSkeleton() {
    const anmOpacity = useAnimationOpacitySkeleton();
    return (
        <DefaultCard>
            <View style={styles.infoTop}>
                <DefaultDescriptionSkeleton size="S"/>
                <TextProductPriceSkeleton/>

                <Animated.View style={[anmOpacity, styles.trashIconSkeleton]}/>
            </View>
            <View style={styles.infoBottom}>
                <StepperSkeleton/>

                <View style={styles.dateContainer}>
                    <Animated.View style={[anmOpacity, styles.titleCalandarSkeleton]}/>
                    <Animated.View style={[anmOpacity, styles.textCalandarSkeleton]}/>
                </View>
            </View>
        </DefaultCard>
    );
}

export const MemoCartCardSkeleton = memo(CartCartSkeleton);


const styles = StyleSheet.create({
    infoTop: {
        flexDirection: "row",
        gap: theme.gap.md,
        alignItems: "center",
        justifyContent: "space-between"
    },
    infoBottom: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
    },
    trashIcon: {
        color: theme.colors.red,
        fontSize: theme.typography.textMD.fontSize,
    },
    trashIconSkeleton: {
        width: 15, 
        height: 23,
        borderRadius: 1000,
    },
    dateContainer: {
        alignItems: "center",
        gap: theme.gap.xs,
    },
    infoDateContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: theme.gap.xs,
    },
    calendarIcon: {
        color: theme.colors.orange,
        fontSize: theme.typography.textMD.fontSize,
    },
    titleCalandar: {
        color: theme.colors.textNeutral900,
        fontSize: theme.typography.textSM.fontSize,
    },
    textCalandar: {
        color: theme.colors.textNeutral900,
        fontSize: theme.typography.textSM.fontSize,
    },
    titleCalandarSkeleton: {
        width: 115,
        height: 15,
        borderRadius: 1000,
    },
    textCalandarSkeleton: {
        width: 90,
        height: 15,
        borderRadius: 1000,
    }
}); 
