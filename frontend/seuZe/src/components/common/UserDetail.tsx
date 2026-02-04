import { HeaderBottomContainer } from "../ui/HeaderBottomContainer";
import { GenericTopTabs, TabItem } from "./GenericTopTabs";
import { RelationshipStatusType } from "@/src/types/responseServiceTypes";
import { RelationshipActions } from "../ui/RelationshipActions";
import { theme } from "@/src/theme";
import { UserDescHeaderTab } from "./UserDescHeaderTab";
import { StyleSheet } from "react-native";


export interface UserDetailProps {
    title: string, 
    desc: string,
    numberPhone: string,
    tabList: TabItem[],
    relationShipType: RelationshipStatusType,
    isLoading?: boolean,
};


export function UserDetail({
    desc,
    title,
    tabList,
    relationShipType,
    numberPhone, 
    isLoading,
}: UserDetailProps) {
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
                    type={relationShipType}
                    isLoading={isLoading}
                />
            </HeaderBottomContainer>
            
            <GenericTopTabs
                tabs={tabList}
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

