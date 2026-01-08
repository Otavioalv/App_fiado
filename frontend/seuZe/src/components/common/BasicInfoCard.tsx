import { memo } from "react";
import { DefaultDescription, DefaultDescriptionSkeleton } from "../ui/DefaultDescription";
import { DefaultCard } from "../ui/DefaultCard";

export type BasicInfoCardProps = {
    title: string,
    info: string
}

export function BasicInfoCard({info, title}: BasicInfoCardProps) {
    return (
        <DefaultCard>
            <DefaultDescription
                text1={title}
                text2={info}
                size="S"
            />
        </DefaultCard>
    );
}

export function BasicInfoCardSkeleton() {
    return (
        <DefaultCard> 
            <DefaultDescriptionSkeleton size="S"/>
        </DefaultCard>
    );
}

export const MemoBasicInfoCard = memo(BasicInfoCard);
