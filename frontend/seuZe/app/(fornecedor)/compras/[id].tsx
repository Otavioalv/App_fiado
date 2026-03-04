import MyScreenContainer from "@/src/components/common/MyScreenContainer";
import { SectionContainer } from "@/src/components/common/SectionContainer";
import { ButtonIcon } from "@/src/components/ui/ButtonIcon";
import { DefaultDescription, DefaultDescriptionSkeleton } from "@/src/components/ui/DefaultDescription";
import { HeaderBottomContainer } from "@/src/components/ui/HeaderBottomContainer";
import { IconBg, IconBgSkeleton } from "@/src/components/ui/IconBg";
import { PressableCard } from "@/src/components/ui/PressableCard";
import { StatusShopping, StatusShoppingSkeleton } from "@/src/components/ui/StatusShopping";
import { TextProductPrice, TextProductPriceSkeleton } from "@/src/components/ui/TextProductPrice";
import { theme } from "@/src/theme";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, StyleSheet, ScrollView, View, Switch, Animated } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ButtonModern, ButtonModernSkeleton } from "@/src/components/ui/ButtonModern";
import { useShoppingListFromid, useUpdateBuy } from "@/src/hooks/useFornecedorQueries";
import { formatCurrency, formatPhone } from "@/src/utils";
import { useAnimationOpacitySkeleton } from "@/src/hooks/useMyAnimations";
import Loading from "@/src/components/ui/Loading";
import { Dropdown } from 'react-native-element-dropdown';
import { useErrorScreenListener } from "@/src/hooks/useErrorScreenListener";
import { ErrorTypes } from "@/src/types/responseServiceTypes";
import { ScreenErrorGuard } from "@/src/components/common/ScreenErrorGuard";
import { PressablePress } from "@/src/components/ui/PressablePress";


const dataDropDown = [
  { label: 'Em Análise', value: undefined },
  { label: 'Aceito', value: true },
  { label: 'Recusado', value: false },
];

export default function CompraEdit() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string}>();

    const [errorType, setErrorType] = useState<ErrorTypes | null>(null);
    
    const {
        data: shoppingDate,
        isLoading: isLoadingShoppingDate,
        isError: isErrorShoppingDate,
        error: errorShoppingDate,
        refetch: refetchShoppingDate,
    } = useShoppingListFromid(
        id
    );

    const {
        mutate: updateBuy,
        isPending: isPendingUpdateBuy,
    } = useUpdateBuy();
    
    const [isRemoved, setIsRemoved] = useState<boolean | undefined>(undefined);
    const [isPay, setIsPay] = useState<boolean | undefined>(undefined);
    const [isCanceled, setIsCanceled] = useState<boolean | undefined>(undefined);
    const [isAccept, setIsAccept] = useState<boolean | undefined>(undefined);
    const [collectedDate, setCollectedDate] = useState<Date | undefined>(
        shoppingDate?.coletado_em ? new Date(shoppingDate.coletado_em) : undefined
    );

    const [hasChange, setHasChange] = useState<boolean>(false);

    useEffect(() => {
        if (shoppingDate) {
            setIsRemoved(!!shoppingDate.retirado);
            setIsPay(!!shoppingDate.quitado);
            setIsCanceled(!!shoppingDate.cancelado);
            setIsAccept(shoppingDate.aceito);
            if (shoppingDate.coletado_em) {
                setCollectedDate(new Date(shoppingDate.coletado_em));
            }
        }
    }, [shoppingDate]); //

    const handleRemoved = () => {
        setIsRemoved(!isRemoved);
        setHasChange(true);
    }

    const handlePay = () => {
        setIsPay(!isPay);
        setHasChange(true);
    }

    const handleCanceled = () => {
        setIsCanceled(!isCanceled);
        setHasChange(true);
    }


    const onChangeDate = (event: any, selectedDate?: Date) => {
        setShowPicker(false);

        if(event.type === 'set' && selectedDate) {
            setCollectedDate(selectedDate);
            setHasChange(true);
        }
    };

    const handleCancelDate = () => {
        setCollectedDate(undefined);
        setHasChange(true);
    }

    const handleAccept = (item: any) => {
        setIsAccept(item.value);
        setHasChange(true);

        console.log("ACEITO TESTE");
    }

    const [showPicker, setShowPicker] = useState(false);    

    const formatDateBR = (dateString: string) => {
        if (!dateString) return "";
        
        const date = new Date(dateString);
        
        // Verifica se a data é válida antes de formatar
        if (isNaN(date.getTime())) return "Data inválida";

        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(date);
    }


    const handleUpdateBuy = async () => {
        if(!id) return;

        updateBuy({
            id_compra: Number(id),
            quitado: !!isPay,
            retirado: !!isRemoved,
            cancelado: !!isCanceled,
            coletado_em: collectedDate?.toISOString(),
            aceito: isAccept,
        }, {
            onSuccess: () => {
                setHasChange(false);
            }
        });


    }

    useErrorScreenListener(isErrorShoppingDate, errorShoppingDate, setErrorType);

    if(isLoadingShoppingDate) return <CompraEditSkeleton/>;
    return (
        <ScreenErrorGuard errorType={errorType} onRetry={refetchShoppingDate}>
            <Loading
                visible={isPendingUpdateBuy}
            />
            <HeaderBottomContainer style={styles.headerContainer}>
                <ButtonIcon
                    iconName="arrow-left"
                    variant="ghost"
                    onPress={() => router.back()}
                />
                <Text style={styles.title}>
                    Resumo do Pedido
                </Text>
            </HeaderBottomContainer>

            <ScrollView>
                <MyScreenContainer style={{alignItems: "stretch"}}>
                    <PressableCard>
                        <View style={styles.infoCardContainer}>
                            <View style={styles.infoSection}>
                                <IconBg
                                    name="box"
                                />
                                <View style={styles.infos}>
                                    <Text style={styles.textTitleInfo}>
                                        INFORMAÇÕES DO PRODUTO
                                    </Text>
                                    
                                    <Text style={styles.textProdName}> 
                                        {shoppingDate?.nome_produto}
                                    </Text>

                                    <Text style={styles.textProdValue}> 
                                        {shoppingDate?.quantidade} x {formatCurrency(shoppingDate?.valor_unit || "")}
                                    </Text>

                                    <TextProductPrice
                                        price={123.123}
                                        size="M"
                                    />
                                </View>
                            </View>
                            <View style={styles.infoSection}>
                                <IconBg
                                    name="user"
                                />
                                <View style={styles.infos}>
                                    <Text style={styles.textTitleInfo}>
                                        INFORMAÇÕES DO CLIENTE
                                    </Text>
                                    
                                    <Text style={styles.textProdName}> 
                                        {shoppingDate?.nome_user} {shoppingDate?.apelido_user ? `- (${shoppingDate.apelido_user})` : ""}
                                    </Text>

                                    <Text style={styles.textProdValue}> 
                                        {formatPhone(shoppingDate?.telefone_user)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </PressableCard>

                    <PressableCard>
                        <View style={styles.infoDateCardContainer}>
                            <View style={styles.infoDateSection}>
                                <View style={styles.infoDate}>
                                    <View style={styles.titleInfoDate}>
                                        <Feather name="clock" style={styles.textTitleDate}/>
                                        <Text style={styles.textTitleDate}>
                                            PEDIDO EM
                                        </Text>
                                    </View>
                                    <Text style={styles.textDate}> 
                                        {/* {format(shoppingDate?.created_at || "", "dd/MM/yyyy", { locale: ptBR })} */}
                                        {formatDateBR(shoppingDate?.created_at || "")}
                                    </Text>
                                </View>

                                <View style={styles.infoDate}>
                                    <View style={styles.titleInfoDate}>
                                        <Feather name="calendar" style={styles.textTitleDate}/>
                                        <Text style={styles.textTitleDate}>
                                            COLETAR ATÉ
                                        </Text>
                                    </View>
                                    <Text style={styles.textDate}> 
                                        {/* {format(shoppingDate?.prazo || "", "dd/MM/yyyy", { locale: ptBR })} */}
                                        {formatDateBR(shoppingDate?.prazo || "")}
                                    </Text>
                                </View>
                            </View>

                            <StatusShopping
                                shoppingStatus={shoppingDate?.shopping_status || "LOADING"}
                                paymentStatus={shoppingDate?.payment_status || "LOADING"}

                            />
                        </View>
                    </PressableCard>
                    
                    <SectionContainer title="Atualizar Status">

                        <Dropdown
                            style={[styles.dropdown, isPendingUpdateBuy && { opacity: 0.5 }]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            data={dataDropDown}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder="Selecione o status"
                            value={isAccept} // Seu estado: true, false ou null
                            disable={isPendingUpdateBuy}
                            onChange={handleAccept}
                            renderRightIcon={() => (
                                <Feather name="chevron-down" size={20} color={theme.colors.darkGray} />
                            )}
                        />

                        <PressablePress 
                            style={styles.editSection}
                            onPress={handleRemoved}
                        >
                            <DefaultDescription
                                text1="Produto Retirado"
                                text2="O cliente ja coletou o item?"
                                size="S"
                            />
                            
                            <Switch
                                trackColor={{ 
                                    false: theme.colors.pseudoLightGray, // Cinza quando desligado
                                    true: theme.colors.orange              // Laranja quando ligado
                                }}
                                thumbColor={"#ffffff"} 
                                ios_backgroundColor={theme.colors.pseudoLightGray}
                                disabled={isPendingUpdateBuy}
                                onValueChange={handleRemoved}
                                value={isRemoved}
                            />
                        </PressablePress>

                        <PressablePress 
                            style={styles.editSection}
                            onPress={handlePay}
                        >

                            <DefaultDescription
                                text1="Pagamento Quitado"
                                text2="Confirmação de recebimento total"
                                size="S"
                            />
                            
                            <Switch
                                trackColor={{ 
                                    false: theme.colors.pseudoLightGray, // Cinza quando desligado
                                    true: theme.colors.orange              // Laranja quando ligado
                                }}
                                thumbColor={"#ffffff"}
                                ios_backgroundColor={theme.colors.pseudoLightGray}
                                onValueChange={handlePay}
                                value={isPay}
                                disabled={isPendingUpdateBuy}
                            />
                        </PressablePress>
                        
                        <PressablePress     
                            style={styles.editSection}
                            onPress={handleCanceled}
                        >
                            <DefaultDescription
                                text1="Pedido Cancelado"
                                text2="Interromper operação"
                                size="S"
                            />
                            
                            <Switch
                                trackColor={{ 
                                    false: theme.colors.pseudoLightGray, // Cinza quando desligado
                                    true: theme.colors.orange              // Laranja quando ligado
                                }}
                                thumbColor={"#ffffff"}
                                ios_backgroundColor={theme.colors.pseudoLightGray}
                                onValueChange={handleCanceled}
                                value={isCanceled}
                                disabled={isPendingUpdateBuy}
                            />
                        </PressablePress>

                        <View style={styles.formDate}>
                            <View style={styles.titleInfoDate}>
                                <Feather name="calendar" style={styles.textTitleDate}/>
                                <Text style={styles.textTitleDate}>
                                    Coletado em
                                </Text>
                            </View>

                            <View style={styles.formDateColetadoEm}>
                                <View style={{ flex: 1 }}> 
                                    <PressableCard 
                                        onPress={() => setShowPicker(true)}
                                    >
                                        <Text style={{ 
                                            color: collectedDate ? theme.colors.textNeutral900 : theme.colors.darkGray 
                                        }}>
                                            {collectedDate ? 
                                                formatDateBR(collectedDate.toISOString()) : 
                                                "Clique para definir data de coleta"
                                            }
                                        </Text>
                                    </PressableCard>
                                </View>
                                {collectedDate && (
                                    <ButtonIcon 
                                        iconName="x" 
                                        variant="ghost" 
                                        onPress={handleCancelDate} 
                                    />
                                )}
                            </View>

                            {showPicker && (
                                <DateTimePicker
                                    value={collectedDate || new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={onChangeDate}
                                    minimumDate={new Date()} // Impede selecionar datas passadas
                                />
                            )}

                        </View>
                    </SectionContainer>

                    <ButtonModern
                        onPress={handleUpdateBuy}
                        placeholder={isPendingUpdateBuy ? "SALVANDO..." : "Salvar Alterações"}
                        variant={isPendingUpdateBuy || !hasChange ? "disabled" : 'primary'}
                        size="L"
                        disabled={!hasChange}
                    />
                </MyScreenContainer>

            </ScrollView>
        </ScreenErrorGuard>
    );
}


export function CompraEditSkeleton() {
    const anmOpacity = useAnimationOpacitySkeleton();
    return (
        <ScrollView>
            <MyScreenContainer style={{alignItems: "stretch"}}>
                <PressableCard>
                    <View style={styles.infoCardContainer}>
                        
                        <View style={styles.infoSection}>
                            <IconBgSkeleton/>
                            
                            <View style={styles.infos}>
                                <Animated.View style={[anmOpacity, styleSkelton.textTitleCard]}/>
                                <Animated.View style={[anmOpacity, styleSkelton.textTitleCard]}/>
                                <Animated.View style={[anmOpacity, styleSkelton.textTitleCard]}/>
                                <TextProductPriceSkeleton/>
                            </View>
                        </View>

                        <View style={styles.infoSection}>
                            <IconBgSkeleton/>
                            <View style={styles.infos}>
                                <Animated.View style={[anmOpacity, styleSkelton.textTitleCard]}/>
                                <Animated.View style={[anmOpacity, styleSkelton.textTitleCard]}/>
                                <Animated.View style={[anmOpacity, styleSkelton.textTitleCard]}/>
                            </View>
                        </View>
                    </View>

                </PressableCard>

                <PressableCard>
                    <View style={styles.infoDateCardContainer}>
                        <View style={styles.infoDateSection}>
                            <View style={styles.infoDate}>
                                <View style={styles.titleInfoDate}>
                                    <Feather name="clock" style={styles.textTitleDate}/>
                                    <Text style={styles.textTitleDate}>
                                        PEDIDO EM
                                    </Text>
                                </View>
                                <Animated.View style={[anmOpacity, styleSkelton.textTitleCard]}/>
                            </View>

                            <View style={styles.infoDate}>
                                <View style={styles.titleInfoDate}>
                                    <Feather name="calendar" style={styles.textTitleDate}/>
                                    <Text style={styles.textTitleDate}>
                                        COLETAR ATÉ
                                    </Text>
                                </View>
                                <Animated.View style={[anmOpacity, styleSkelton.textTitleCard]}/>
                            </View>
                        </View>

                        <StatusShoppingSkeleton/>
                    </View>
                </PressableCard>
                
                <SectionContainer title="Atualizar Status">
                    <View style={styles.editSection}>
                        <DefaultDescriptionSkeleton size="S"/>
                    </View>

                    <View style={styles.formDate}>
                        <View style={styles.titleInfoDate}>
                            <Feather name="calendar" style={styles.textTitleDate}/>
                            <Text style={styles.textTitleDate}>
                                Coletado em
                            </Text>
                        </View>
                        <PressableCard> 
                            <Animated.View style={[anmOpacity, styleSkelton.textTitleCard]}/>
                        </PressableCard>
                    </View>

                    <View style={styles.editSection}>
                        <DefaultDescriptionSkeleton size="S"/>
                    </View>
                </SectionContainer>


                <ButtonModernSkeleton size="L"/>
            </MyScreenContainer>
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "row", 
        alignItems: "center",
    },
    infoCardContainer: {
        gap: theme.gap.md,
    },
    infoDateCardContainer: {
        gap: theme.gap.md,
    },
    infoDateSection: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    infoDate: {
        

    },
    titleInfoDate: {
        flexDirection: "row",
        // justifyContent: "center",
        alignItems: "center",
        gap: theme.gap.xs,
    },
    infoSection: {
        flexDirection: "row",
        gap: theme.gap.sm,
        alignItems: "flex-start"
    },
    infos: {
        gap: theme.gap.xs,
    },
    textTitleInfo: {
        color: theme.colors.textNeutral900,
        fontSize: theme.typography.textSM.fontSize,
        fontWeight: "bold",
    },
    textProdName: {
        color: theme.colors.textNeutral900,
        fontSize: theme.typography.textSM.fontSize,
    },
    textProdValue: {
        color: theme.colors.darkGray,
        fontSize: theme.typography.textSM.fontSize,

    },
    title: {
        ...theme.typography.title
    },
    textTitleDate: {
        fontSize: theme.typography.textSM.fontSize,
        // color: theme.colors.darkGray,
        color: theme.colors.textNeutral900,
    },
    textDate: {
        fontSize: theme.typography.textMD.fontSize,
        fontWeight: "bold",
        color: theme.colors.textNeutral900,
    },
    formDate: {
        gap: theme.gap.sm,
    },
    editSection: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    formDateColetadoEm: {
        flexDirection: "row",
    },


    dropdown: {
        height: 55,
        backgroundColor: '#F8F9FA', // Fundo clarinho da imagem
        borderRadius: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    placeholderStyle: {
        fontSize: 16,
        color: theme.colors.darkGray,
    },
    selectedTextStyle: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.textNeutral900,
    },
});


const styleSkelton = StyleSheet.create({
    textTitleCard: {
        borderRadius: 999,
        width: 150, 
        height: 13,
    },
});

