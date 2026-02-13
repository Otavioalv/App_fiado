import {RelationshipStatusType} from "@/src/types/responseServiceTypes"
import { DefaultCard } from "../ui/DefaultCard";
import { DefaultDescription, DefaultDescriptionSkeleton } from "../ui/DefaultDescription";
import { OnPressActionFunctionType, RelationshipActions, RelationshipActionsSkeleton } from "../ui/RelationshipActions";
import { memo } from "react";
import { PressableProps, StyleSheet, Text } from "react-native";
import { theme } from "@/src/theme";
import { PressableCard } from "../ui/PressableCard";

export interface UserCardProps extends PressableProps {
    title: string, 
    description: string,
    relationshipType: RelationshipStatusType,
    idUser: string | number,
    onPressActionFunction?: OnPressActionFunctionType,
    onPressAccepted?: (id: string | number) => void,
    date?: string,
};

export function UserCard({
    description, 
    title, 
    relationshipType, 
    date,
    idUser,
    onPressActionFunction,
    onPressAccepted,
    ...pressableProps
}: UserCardProps) {
    return (
        <PressableCard
            {...pressableProps}
        >
            <DefaultDescription
                text1={title}
                text2={description}
                size="M"
            />

            {date && 
                <Text
                    style={styles.textDate}
                >
                    Solicitado Em: {date}
                </Text>
            }

            <RelationshipActions 
                type={relationshipType}
                idUser={idUser}
                onPressAction={onPressActionFunction}
                onPressAccepted={onPressAccepted}
            />
        </PressableCard>
    );
}

export function UserCardSkeleton() {
    return (
        <DefaultCard>
            <DefaultDescriptionSkeleton size="M"/>
            <RelationshipActionsSkeleton/>
        </DefaultCard>
    )
}

export const MemoUserCard = memo(UserCard);
export const MemoUserCardSkeleton = memo(UserCardSkeleton);

const styles = StyleSheet.create({
    textDate: {
        fontSize: theme.typography.textSM.fontSize,
        color: theme.colors.darkGray
    }
});
