export interface FieldProps<T> {
    value: T,
    onChange: (v: T) => void,
};

export interface Argument {
    id: string;
    name?: string;
    desc?: string;
    note?: string;
    valueType: ValueType;
}

export type ValueType = { type: "string" }
    | { type: "number" }
    | { type: "stringEnum", enum: EnumValue[] }
    | { type: "bool" }
    | { type: "duration" }
    | { type: "position" }
    | { type: "color" }
    | { type: "bytes" }
    | { type: "framerate" }
    | { type: "dimension" }
    | { type: "date" }

export type EnumValue = {
    label: string;
    value: string;
};
