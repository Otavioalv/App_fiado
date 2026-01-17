import {RelationshipStatusType} from "@/src/types/responseServiceTypes"
import { DefaultCard } from "../ui/DefaultCard";
import { DefaultDescription, DefaultDescriptionSkeleton } from "../ui/DefaultDescription";
import { RelationshipActions, RelationshipActionsSkeleton } from "../ui/RelationshipActions";
import { memo } from "react";
import { StyleSheet, Text } from "react-native";
import { theme } from "@/src/theme";

export interface UserCardProps {
    title: string, 
    description: string,
    relationshipType: RelationshipStatusType,
    date?: string
}

export function UserCard({description, title, relationshipType, date}: UserCardProps) {
    return (
        <DefaultCard>
            <DefaultDescription
                text1={title}
                text2={description}
                size="M"
            />

            {date && 
                <Text
                    style={styles.textDate}
                >
                    {date}
                </Text>
            }

            <RelationshipActions type={relationshipType}/>
        </DefaultCard>
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
