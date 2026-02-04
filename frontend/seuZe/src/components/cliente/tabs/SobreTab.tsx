import { GenericInfiniteList, GenericInfiniteListType } from "@/src/components/common/GenericInfiniteList";
import { ScreenErrorGuard } from "@/src/components/common/ScreenErrorGuard";
import { CardAboutInfoProps, MemoCardAboutInfo, MemoCardAboutInfoSkeleton } from "@/src/components/ui/CardAboutInfo";
import { useListPartnerFromId } from "@/src/hooks/useClienteQueries";
import { useErrorScreenListener } from "@/src/hooks/useErrorScreenListener";
import { ErrorTypes } from "@/src/types/responseServiceTypes";
import { formatPhone } from "@/src/utils";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";


export function SobreTab() {
    const { id } = useLocalSearchParams<{ id: string }>();    

    const [errorType, setErrorType] = useState<ErrorTypes | null>(null);

    const {
        data: userData,
        isLoading: isLoadingUserData,
        isRefetching: isRefetchingUserData,
        error: errorUserData,
        isError: isErrorUserData,
        refetch: refetchUserData,
    } = useListPartnerFromId(
        id
    );

    const loc: string = `${userData?.logradouro}, ${userData?.numeroimovel}${userData?.complemento ? ` - ${userData?.complemento}` : ""}, ${userData?.bairro}, CEP ${userData?.cep} - ${userData?.uf}`;
    const phoneNumber: string = formatPhone(userData?.telefone || "");

    const infoAbout: GenericInfiniteListType<CardAboutInfoProps>[] = [
        {      
            id: "1",
            iconName: "map-pin",
            info: loc,
        },
        {
            id: "2",
            iconName: "phone",
            info: phoneNumber,
        },
    ];

    const renderItem = useCallback(({item}: {item: CardAboutInfoProps}) => (
        <MemoCardAboutInfo
            iconName={item.iconName}
            info={item.info}
        />
    ), []);

    const renderItemSkeleton = useCallback(() => (
        <MemoCardAboutInfoSkeleton/>
    ), []);


    useErrorScreenListener(isErrorUserData, errorUserData, setErrorType);
    return (
        <ScreenErrorGuard
            errorType={errorType}
            onRetry={refetchUserData}
        >
            <GenericInfiniteList
                data={infoAbout}
                renderItem={renderItem}
                
                SkeletonComponent={<MemoCardAboutInfoSkeleton/>}
                SkeletonList={{
                    data: ["1", "2", "3"],
                    keyExtractor: (i) => i,
                    renderItem: renderItemSkeleton
                }}
                isLoading={isLoadingUserData}
                isRefetching={isRefetchingUserData}
                
                keyExtractor={(i) => i.id.toString()}
                
                onRefresh={refetchUserData}
            />
        </ScreenErrorGuard>
    );
}
