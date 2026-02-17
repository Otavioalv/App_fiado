import { GenericInfiniteList, GenericInfiniteListType } from "@/src/components/common/GenericInfiniteList";
import { MemoNotificationCard, NotificationCardProps, NotificationCardSkeleton } from "@/src/components/common/NotificationCard";
import { ScreenErrorGuard } from "@/src/components/common/ScreenErrorGuard";
import { ButtonIcon } from "@/src/components/ui/ButtonIcon";
import { HeaderBottomContainer } from "@/src/components/ui/HeaderBottomContainer";
import { useListMessages } from "@/src/hooks/useClienteQueries";
import { useErrorScreenListener } from "@/src/hooks/useErrorScreenListener";
import { theme } from "@/src/theme";
import { ErrorTypes } from "@/src/types/responseServiceTypes";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {Pressable, StyleSheet, Text, View } from "react-native";



import ReanimatedSwipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, { SharedValue, useAnimatedStyle } from "react-native-reanimated";



interface SwipeableDeleteItemProps extends PropsWithChildren{
    itemId: number | string,
    renderRightActions: ((progress: SharedValue<number>, translation: SharedValue<number>, swipeableMethods: SwipeableMethods) => React.ReactNode) | undefined,
    onOpen: (currentRef: SwipeableMethods | null) => void,
}

const SwipeableDeleteItem = ({
    itemId,
    renderRightActions,
    onOpen,
    children,
}: SwipeableDeleteItemProps) => {
    const swipeableRef = useRef<SwipeableMethods>(null);

    useEffect(() => {
        swipeableRef.current?.close();
    }, [itemId]);

    return (
        <ReanimatedSwipeable
            // key={item.id}
            ref={swipeableRef}
            renderRightActions={renderRightActions}
            onSwipeableWillOpen={() => onOpen(swipeableRef.current)}
            rightThreshold={60}
        >
            {children}
        </ReanimatedSwipeable>
    );
};



export default function Notificacoes() {
    const router = useRouter();

    const [errorType, setErrorType] = useState<ErrorTypes | null>(null);

    const {
        data: dataMessages,
        refetch,
        isError, 
        error, 
        isLoading,
        isRefetching,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    } = useListMessages({
        filter: "",
        search: ""
    });

    // const swipeRef = useRef<SwipeableMethods | null>(null);
    // let rowRef: SwipeableMethods | null = null;

    const RightAction = ({
        onDelete,
        progress,
        dragX
    }: {
        onDelete: () => void;
        progress: SharedValue<number>;
        dragX: SharedValue<number>;
    }) => {
        const [width, setWidth] = useState(0);
        const animatedStyle = useAnimatedStyle(() => ({
            // opacity: progress.value,
            transform: [
                {translateX: dragX.value + width} 
            ]
        }));

        return (
            <Animated.View
                onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
                style={[
                    {
                        backgroundColor: "red",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: theme.padding.md
                    },
                    animatedStyle
                ]}
            >
                <Pressable
                    onPress={() => {
                        onDelete(); 
                    }}
                >
                    <Feather
                        name="trash-2"
                        style={{
                            fontSize: theme.typography.textXL.fontSize,
                            color: "white",
                        }}
                    />
                </Pressable>
            </Animated.View>
        );
    };

    const openedSwipeable = useRef<SwipeableMethods>(null);
    const closeOpenedSwipeable = (currentRef: SwipeableMethods | null) => {
        if (openedSwipeable.current && openedSwipeable.current !== currentRef) {
            openedSwipeable.current.close();
        }

        openedSwipeable.current = currentRef;
    }


    const renderItem = useCallback(
        ({item, index}: {item: NotificationCardProps, index: number}) => {
            return (
                <SwipeableDeleteItem
                    itemId={item.itemId}
                    renderRightActions={(progress, dragX) => (
                        <RightAction 
                            onDelete={() => {console.log(item.id);}}
                            dragX={dragX}
                            progress={progress}
                        />
                    )}
                    
                    onOpen={closeOpenedSwipeable}
                >
                    <MemoNotificationCard
                        {...item}
                    />
                </SwipeableDeleteItem>
            )
        }, 
        []
    );

    const renderItemSkeleton = useCallback(() => (
        <NotificationCardSkeleton/>
    ), []);




    const listMessages = useMemo(() => {
        if (!dataMessages) return [];

        const map = new Map<string, GenericInfiniteListType<NotificationCardProps>>();

        dataMessages.pages.forEach(page => {
            page.list.forEach(u => {
                const idString = u.id_mensagem?.toString();

                map.set(idString, {
                    id: idString, 
                    itemId: idString,
                    isRead: !!u.read_at,
                    notification: u.mensagem,
                    time: u.created_at,
                    type: u.type,
                });
            });
        });

        return Array.from(map.values());
    }, [dataMessages]);

    useErrorScreenListener(isError, error, setErrorType);

    return (
        <>
            <HeaderBottomContainer>
                <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                    <ButtonIcon
                        iconName="arrow-left"
                        variant="ghost"
                        onPress={() => router.back()}
                    />
                    <Text style={styles.title}>
                        Notificações
                    </Text>
                    <ButtonIcon
                        iconName="check"
                        variant="ghost"
                        onPress={() => router.back()}
                    />
                </View>
                <Text   
                    style={{
                        textAlign: "center",
                        color: theme.colors.darkGray
                    }}
                >
                    Mensagens lidas são apagadas automaticamente após 30 dias.
                </Text>
            </HeaderBottomContainer>

            <ScreenErrorGuard errorType={errorType} onRetry={refetch} >
                <GenericInfiniteList
                    SkeletonComponent={<NotificationCardSkeleton/>}
                    SkeletonList={{
                        data: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
                        keyExtractor: (i) => i,
                        renderItem: renderItemSkeleton
                    }}
                    data={listMessages}
                    renderItem={renderItem}
                    isFetchingNextPage={isFetchingNextPage}
                    isLoading={isLoading}
                    // isLoading={true}
                    isRefetching={isRefetching}
                    keyExtractor={(i) => i.id.toString()}
                    onEndReached={() => {
                        if(hasNextPage && !isFetchingNextPage) {
                            fetchNextPage();
                        }
                    }}
                    hasBorderSeparator={true}
                    hasSeparator={false}
                    hasPaddingList={false}
                    onRefresh={refetch}
                    // HeaderComponent={
                    //     <ChipList 
                    //         chipList={chipList}
                    //         itemSelected={activeCategory} 
                    //         setItemSelected={setActiveCategory}
                    //     />
                    // }
                    emptyMessage={"Nenhuma menssagem encontrada"}
                />
            </ScreenErrorGuard>
        </>
    );
}

const styles = StyleSheet.create({
    title: {
        ...theme.typography.title
    }
});