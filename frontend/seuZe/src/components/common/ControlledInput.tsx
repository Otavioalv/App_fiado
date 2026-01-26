import { Control, Controller, FieldValues, Path } from "react-hook-form";
// import InputForm, { InputFormProps } from "../ui/InputForm";
import ModernInputForm, { ModernInputFormProps } from "../ui/ModernInputForm";

export interface ControlledInputProps<T extends FieldValues> 
extends Omit<ModernInputFormProps, 'onChangeText' | "errorMessage" | "value">{
    control: Control<T>,
    name: Path<T>
}


export function ControlledInput<T extends FieldValues>({
    control,
    name,
    ...inputProps
}: ControlledInputProps<T>) {
    // console.log("AAAÇB > ", inputProps.value);

    return (
        <Controller
            control={control} 
            name={name}
            render={({field: {value, onChange}, fieldState: {error}}) => 
                <ModernInputForm
                    {...inputProps}

                    value={value} 
                    onChangeText={onChange}
                    errorMessage={error?.message}
                />
            }
        />
    )
}
