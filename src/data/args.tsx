import { Argument } from "../types";

export const genericOptions: Argument[] = [
    {
        id: "hide_banner",
        valueType: { type: "bool" },
    }
];

const recast_media: Argument = {
    id: "recast_media",
    valueType: { type: "bool" },
    desc: "Allow forcing a decoder of a different media type than the one detected or designated by the demuxer. Useful for decoding media data muxed as data streams.",
};

export const inputArguments: Argument[] = [
    recast_media,
    {
        id: "stream_loop",
        valueType: { type: "number" },
        desc: "Set number of times input stream shall be looped. Loop 0 means no loop, loop -1 means infinite loop",
        //specialDesc: (v) => v == -1 ? "(infinite loop)" : null,
    },
    {
        id: "t",
        valueType: { type: "duration" },
        desc: "Limit the duration of data read from the input file"
    },
    {
        id: "to",
        valueType: { type: "position" },
        desc: "Stop reading the input at position"
    },
];

export const outputArguments: Argument[] = [
    recast_media,
    {
        id: "t",
        valueType: { type: "duration" },
        desc: "Stop writing the output after its duration reaches duration"
    },
    {
        id: "to",
        valueType: { type: "position" },
        desc: "Stop writing the output at position"
    },
];
