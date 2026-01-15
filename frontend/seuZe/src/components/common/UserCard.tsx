import {RelationshipStatusType} from "@/src/types/responseServiceTypes"
import { DefaultCard } from "../ui/DefaultCard";
import { DefaultDescription, DefaultDescriptionSkeleton } from "../ui/DefaultDescription";
import { RelationshipActions, RelationshipActionsSkeleton } from "../ui/RelationshipActions";
import { memo } from "react";

export interface UserCardProps {
    title: string, 
    description: string,
    relationshipType: RelationshipStatusType
}

export function UserCard({description, title, relationshipType}: UserCardProps) {
    return (
        <DefaultCard>
            <DefaultDescription
                text1={title}
                text2={description}
                size="M"
            />
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
