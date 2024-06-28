import { TextInput } from "@mantine/core";
import { FieldProps } from "../../types";

export const FieldString = ({
    onChange,
    value,
    label,
}: FieldProps<string> & { label: string }) => {
    return (
        <TextInput
            label={label}
            value={value}
            onChange={(e) => onChange(e.currentTarget.value)}
        />
    )
}
