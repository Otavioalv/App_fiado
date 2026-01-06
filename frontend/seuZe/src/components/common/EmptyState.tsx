import FeedbackTemplate, { FeedbackTemplateProps } from "./FeedbackTemplate";

export default function EmptyState({iconName, ...props}: FeedbackTemplateProps) {
    return (
        <FeedbackTemplate
            iconName={iconName}
            {...props}
        />
    );
}