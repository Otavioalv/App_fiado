import { ChipDataType, ChipList, ChipListSkeleton } from "@/src/components/common/ChipList";
import { GenericInfiniteList, GenericInfiniteListType } from "@/src/components/common/GenericInfiniteList";
import { NotificationBottomSheet, NotificationBottomSheetProps } from "@/src/components/common/NotificationBottomSheet";
import { MemoNotificationCard, NotificationCardProps, NotificationCardSkeleton } from "@/src/components/common/NotificationCard";
import { ScreenErrorGuard } from "@/src/components/common/ScreenErrorGuard";
import { ButtonIcon } from "@/src/components/ui/ButtonIcon";
import { ButtonModern } from "@/src/components/ui/ButtonModern";
import { HeaderBottomContainer } from "@/src/components/ui/HeaderBottomContainer";
import { SpacingScreenContainer } from "@/src/components/ui/SpacingScreenContainer";
import { useGlobalBottomModalSheet } from "@/src/context/globalBottomSheetModalContext";
import { useDeleteNotification, useListMessages, useMarkAllReadNotification, useMarkNotificationById } from "@/src/hooks/useClienteQueries";
import { useErrorScreenListener } from "@/src/hooks/useErrorScreenListener";
import { useFilterScreen } from "@/src/hooks/useFilterScreen";
import { theme } from "@/src/theme";
import { PaginationType, TypeMessageList } from "@/src/types/responseServiceTypes";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
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
            overshootRight={false}
            ref={swipeableRef}
            renderRightActions={renderRightActions}
            onSwipeableWillOpen={() => onOpen(swipeableRef.current)}
            rightThreshold={60}
        >
            {children}
        </ReanimatedSwipeable>
    );
};



const chipList: ChipDataType<TypeMessageList>[] = [
    {
        id: "all",
        label: "Todos"
    },
    {
        id: "unread",
        label: "Não lidas"
    },
    {
        id: "read",
        label: "Lidas"
    },
];



export default function Notificacoes() {
    const router = useRouter();

    const {
        errorType,
        setErrorType,

        activeCategory,
        setActiveCategory,
    } = useFilterScreen<TypeMessageList>("all");

    const filter: PaginationType = {
        page: 1,
        size: 20,
    }

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
    } = useListMessages(
        filter,
        activeCategory
    );

    const { 
        mutateAsync: fetchMarkAllNotifications,
        // isPending: isPendingMarkAllNotifications,
    } = useMarkAllReadNotification();
    
    const { mutate } = useDeleteNotification(filter, activeCategory);
    const {mutate: markNotificationById} = useMarkNotificationById(filter, activeCategory)

    const { closeSheet, openSheet } = useGlobalBottomModalSheet();


    const handleOpenInfoProduct = useCallback((notification: NotificationBottomSheetProps) => {
        // marcar a menssagem como lido
        if(notification.isRead) markNotificationById({id: Number(notification.notificationId)});

        openSheet(
            <NotificationBottomSheet
                {...notification}
            />, 
            ["100%"], 
            false
        );
    }, [openSheet, markNotificationById]);

    useFocusEffect(
        useCallback(() => {
            return () => closeSheet();
        }, [closeSheet])
    );

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
                style={[animatedStyle]}
            >
                <Pressable
                    style={{
                        flex: 1,
                        backgroundColor: "red",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: theme.padding.md
                    }}
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

    const DeleteNotification = useCallback(async (id: number) => {
        openedSwipeable.current?.close();
        mutate({id: id});
    }, [mutate]);

    const renderItem = useCallback(
        ({item, index}: {item: NotificationCardProps, index: number}) => {
            return (
                <SwipeableDeleteItem
                    itemId={item.itemId}
                    renderRightActions={(progress, dragX) => (
                        <RightAction 
                            onDelete={() => DeleteNotification(Number(item.itemId))}
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
        [DeleteNotification]
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

                const notification: NotificationBottomSheetProps = {
                    dateTime: u.created_at,
                    message: u.mensagem,
                    title: u.title_notification,
                    type: u.type,
                    userId: u.from_user_id,
                    notificationId: idString, 
                    routerName: `/fornecedores/${u.from_user_id}`,
                    isRead: !u.read_at,
                }

                map.set(idString, {
                    id: idString, 
                    itemId: idString,
                    isRead: !!u.read_at,
                    notification: u.mensagem,
                    title: u.title_notification,
                    time: u.created_at,
                    type: u.type,
                    onPress: () => handleOpenInfoProduct(notification)
                });
            });
        });

        return Array.from(map.values());
    }, [dataMessages, handleOpenInfoProduct]);

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
                    {/* <ButtonIcon
                        iconName="check"
                        variant="ghost"
                        onPress={() => router.back()}
                    /> */}
                    <ButtonModern
                        placeholder="Marcar todas como lido"
                        size="S"
                        variant="ghost"
                        onPress={async () => {
                            await fetchMarkAllNotifications()
                        }}
                    />
                    
                </View>
                <Text   
                    style={{
                        textAlign: "center",
                        color: theme.colors.darkGray
                    }}
                >
                    Notificações lidas são apagadas automaticamente após 30 dias.
                </Text>
            </HeaderBottomContainer>

            <ScreenErrorGuard errorType={errorType} onRetry={refetch} >
                <GenericInfiniteList
                    SkeletonComponent={<NotificationCardSkeleton/>}
                    SkeletonList={{
                        data: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
                        keyExtractor: (i) => i,
                        renderItem: renderItemSkeleton,
                        HeaderComponent: <ChipListSkeleton/>,
                        hasPaddingList: false, 
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
                    HeaderComponent={
                        <SpacingScreenContainer style={{paddingVertical: 0}}>
                            <ChipList 
                                chipList={chipList}
                                itemSelected={activeCategory} 
                                setItemSelected={setActiveCategory}
                            />
                        </SpacingScreenContainer>
                    }
                    emptyMessage={"Nenhuma notificação encontrada"}
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
