import { ErrorTypes } from "@/src/types/responseServiceTypes"
import { PropsWithChildren } from "react"
import MyScreenContainer from "./MyScreenContainer"
import FeedbackError from "./FeedbackError"


interface ScreenErrorGuardProps extends PropsWithChildren{
    errorType: ErrorTypes | null,
    onRetry: () => void,
}

export function ScreenErrorGuard({
    children,
    errorType, 
    onRetry,
}: ScreenErrorGuardProps) {
    if(errorType) {
        return (
            <MyScreenContainer>
                <FeedbackError
                    errorType={errorType}
                    onAction={onRetry}
                />
            </MyScreenContainer>
        )
    }

    return <>{children}</>
}