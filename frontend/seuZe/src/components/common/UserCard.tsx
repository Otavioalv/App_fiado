import {RelationshipStatusType} from "@/src/types/responseServiceTypes"
import { DefaultCard } from "../ui/DefaultCard";
import { DefaultDescription } from "../ui/DefaultDescription";
import { RelationshipActions } from "../ui/RelationshipActions";
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

export const MemoUserCard = memo(UserCard);
