import { HeaderBottomContainer } from "../ui/HeaderBottomContainer";
import { GenericTopTabs, TabItem } from "./GenericTopTabs";
import { RelationshipStatusType } from "@/src/types/responseServiceTypes";
import { OnPressActionFunctionType, RelationshipActions } from "../ui/RelationshipActions";
import { theme } from "@/src/theme";
import { UserDescHeaderTab } from "./UserDescHeaderTab";
import { StyleSheet } from "react-native";
import { NavigatorProps } from "expo-router/build/views/Navigator";


export interface UserDetailProps {
    title: string, 
    desc: string,
    numberPhone: string,
    tabList: TabItem[],
    idUser: string | number, 
    relationShipType: RelationshipStatusType,
    navigatorOpt?: NavigatorProps<any>,
    isLoading?: boolean,
    onPressAction?: OnPressActionFunctionType,
    // onPressAccepted?: (id: number | string) => void,
};


export function UserDetail({
    desc,
    title,
    tabList,
    relationShipType,
    numberPhone, 
    navigatorOpt,
    isLoading,
    idUser,
    onPressAction,
}: UserDetailProps) {
    console.log(navigatorOpt, 'userDetail');

    return (
        <>
            <HeaderBottomContainer
                style={styles.container}
            >
                <UserDescHeaderTab
                    title={title}
                    desc={desc}
                    numberPhone={numberPhone}
                    isLoading={isLoading}
                />

                <RelationshipActions
                    idUser={idUser} // Editar isso
                    type={relationShipType}
                    isLoading={isLoading}
                    onPressAction={onPressAction}

                />
            </HeaderBottomContainer>
            
            <GenericTopTabs
                tabs={tabList}
                navigatorOpt={navigatorOpt}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 0,
        gap: theme.gap.md
    }
});

