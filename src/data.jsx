import { StreamType } from './App';

export const data = {
    genericOptions: [
        {
            id: "hide_banner",
            name: "Hide banner",
            desc: "Suppress printing banner." +
            "All FFmpeg tools will normally show a copyright notice," +
            "build options and library versions." +
            "This option can be used to suppress printing this information.",
            type: "bool",
        },
    ],

    fileOptions: [
        {
            id: "stream_loop",
            pos: ["input"],
            type: "number",
            desc: "Set number of times input stream shall be looped."+
            "Loop 0 means no loop, loop -1 means infinite loop.",
            specialDesc: (v) => v == -1 ? "(infinite loop)" : null,
        },
        {
            id: "recast_media",
            pos: ["input", "output"],
            type: "bool",
            desc: "Allow forcing a decoder of a different media type than the"+
            "one detected or designated by the demuxer."+
            "Useful for decoding media data muxed as data streams.",
        },
        {
            id: "t",
            pos: ["input", "output"],
            type: "duration",
            desc: {
                input: "Limit the duration of data read from the input file",
                output: "Stop writing the output after its duration reaches duration",
            },
        },
        {
            id: "to",
            pos: ["input", "output"],
            type: "position",
            desc: {
                input: "Stop reading the input at position",
                output: "Stop writing the output at position",
            },
        },
        {
            id: "fs",
            pos: ["output"],
            desc: "Set the file size limit, expressed in bytes.",
            note: "No further chunk of bytes is written after the limit is exceeded. "+
            "The size of the output file is slightly more than the requested file size.",
            type: "limit_size",
        },
        {
            id: "ss",
            type: "position",
            pos: ["input", "output"],
            name: "Seek to",
            desc: {
                input: "Seeks the input file to position",
                output: "Decode but discard input until the timestamps reaches position",
            },
            note: {
                input: "Note that in most formats it is not possible to seek exactly, "+
                "so ffmpeg will seek to the closest seek point before position"
            }
        },
        {
            id: "sseof",
            pos: ["input"],
            desc: "Like the -ss option but relative to the 'end of file'. "+
            "That is negative values are earlier in the file, 0 is at EOF."
        }
    ],

    protocols: [
        {
            id: "file",
            pos: ["input", "output"],
            name: "File",
            desc: "Read from or write to a file.",
            filenameHint: "file:",
            options: [
                {
                    id: "truncate",
                    name: "Truncate existing files on write",
                    desc: "Default value is true",
                    type: "boolnum",
                    default: true
                },
                {
                    id: "blocksize",
                    desc: "Set I/O operation maximum block size, in bytes. Default value is INT_MAX, which results in not limiting the requested block size. Setting this value reasonably low improves user termination request reaction time, which is valuable for files on slow medium.",
                    type: "number"
                },
                {
                    id: "follow",
                    desc: "If set to 1, the protocol will retry reading at the end of the file, allowing reading files that still are being written. In order for this to terminate, you either need to use the rw_timeout option, or use the interrupt callback (for API users). ",
                    type: "boolnum",
                },
                {
                    id: "seekable",
                    desc: "Controls if seekability is advertised on the file. 0 means non-seekable, -1 means auto (seekable for normal files, non-seekable for named pipes).",
                    note: "Many demuxers handle seekable and non-seekable resources differently, overriding this might speed up opening certain files at the cost of losing some features (e.g. accurate seeking).",
                    type: "enum",
                    enum: [
                        { value: "-1", label: "Auto" },
                        { value: "0", label: "Non-Seekable" },
                    ]
                }
            ],
        },
        {
            id: "data",
            pos: ["input"],
            filenameHint: "data:",
            name: "Data URI",
        },
        {
            id: "ftp",
            pos: ["input", "output"],
            name: "FTP (File Transfer Protocol)",
            filenameHint: "ftp://",
            placeholder: "ftp://[user[:password]@]server[:port]/path/to/remote/resource.mpeg",
            options: [
                {
                    id: "timeout",
                    desc: "Set timeout in microseconds of socket I/O operations used by the underlying low level operation. By default it is set to -1, which means that the timeout is not specified.",
                    type: "number"
                },
                {
                    id: "ftp-anonymous-password",
                    desc: "Password used when login as anonymous user. Typically an e-mail address should be used.",
                    type: "string",
                },
                {
                    id: "ftp-user",
                    desc: "Set a user to be used for authenticating to the FTP server. This is overridden by the user in the FTP URL.",
                    type: "string",
                }
            ]
        },
        {
            id: "async",
            filenameHint: "async:",
            type: "URL",
            pos: ["input"],
            name: "Asynchronous data filling wrapper",
            desc: "Fill data in a background thread, to decouple I/O operation from demux thread"
        },
        {
            id: "cache",
            filenameHint: "cache:",
            type: "URL",
            pos: ["input"],
            name: "Caching wrapper",
            desc: "Cache the input stream to temporary file. It brings seeking capability to live streams.",
            options: [
                {
                    id: "read_ahead_limit",
                    desc: "Amount in bytes that may be read ahead when seeking isn’t supported",
                    note: "Range is -1 to INT_MAX. -1 for unlimited. Default is 65536.",
                    specialDesc: (v) => v == -1 && "(unlimited)",
                }
            ]
        },
        {
            id: "concat",
            filenameHint: "concat:",
            type: "URLList",
            pos: ["input"],
            name: "Concat multiple sources",
            desc: "Read and seek from many resources in sequence as if they were a unique resource.",
        },
        {
            id: "concatf",
            filenameHint: "concatf:",
            type: "URLListScript",
            pos: ["input"],
            name: "Concat from txt",
            desc: "Read and seek from many resources in sequence as if they were a unique resource.",
        },
        {
            id: "crypto",
            filenameHint: ["crypto:", "crypto+"],
            type: "URL",
            pos: ["input"],
            options: [
                {
                    id: "key",
                    desc: "Set the AES decryption key binary block from given hexadecimal representation.",
                    type: "string"
                },
                {
                    id: "iv",
                    desc: "Set the AES decryption initialization vector binary block from given hexadecimal representation.",
                    type: "string"
                }
            ]
        },
        {
            id: "md5",
            pos: ["output"],
            filenameHint: "md5:",
            desc: "Computes the MD5 hash of the data to be written, and on close writes this to the designated output or stdout if none is specified",
            specialDesc: (v) => !v && "(write to stdout)",
        },
        {
            id: "pipe",
            filenameHint: "pipe:",
            pos: ["input", "output"],
            desc: "Read and write from UNIX pipes.",
            type: "number",
            autocomplete: [
                { value: 0, label: "stdin" },
                { value: 1, label: "stdout" },
                { value: 2, label: "stderr" },
            ]
        },
    ],

    devices: [
        {
            id: "gdigrab",
            pos: ["input"],
            name: "Win32 GDI-based screen capture device",
            desc: "This device allows you to capture a region of the display on Windows",
            type: "enum",
            values: [
                {
                    label: "Desktop",
                    value: "desktop",
                    desc: "Capture the entire/fixed region of the desktop"
                },
                {
                    label: "Window",
                    type: "string",
                    prefix: "title=",
                    desc: "Capture contents of a single window"
                }
            ],
            options: [
                {
                    id: "draw_mouse",
                    type: "boolnum",
                    default: true,
                    desc: "Specify whether to draw the mouse pointer"
                },
                {
                    id: "framerate",
                    type: "fps",
                    desc: "Set the grabbing frame rate. Default value is ntsc, corresponding to a frame rate of 30000/1001"
                },
                {
                    id: "show_region",
                    type: "boolnum",
                    name: "Show grabbed region on screen",
                    desc: "If set to true, the grabbing region will be indicated on screen. With this option, it is easy to know what is being grabbed if only a portion of the screen is grabbed.",
                    checks: [
                        {
                            check: (v, f) => !(f.options.show_region && f.filename.startsWith("title=")),
                            msg: "show_region is incompatible with grabbing the contents of a single window"
                        }
                    ]
                },
                {
                    id: "video_size",
                    type: "VideoSize",
                    desc: "Set the video frame size. The default is to capture the full screen if desktop is selected, or the full window size if title=window_title is selected.",
                },
                {
                    id: "offset_x",
                    type: "number",
                    desc: "set the distance from the left edge of the screen or desktop",
                    requires: ["video_size"]
                },
                {
                    id: "offset_y",
                    type: "number",
                    desc: "set the distance from the top edge of the screen or desktop",
                    requires: ["video_size"]
                },
            ]
        }
    ],

    decoders: [],
    encoders: [],
    muxers: [],
    demuxers: [],

    videoSizeAbbr: {
        "ntsc": "720x480",
        "pal": "720x576",
        "qntsc": "352x240",
        "qpal": "352x288",
        "sntsc": "640x480",
        "spal": "768x576",
        "film": "352x240",
        "ntscfilm": "352x240",
        "sqcif": "128x96",
        "qcif": "176x144",
        "cif": "352x288",
        "4cif": "704x576",
        "16cif": "1408x1152",
        "qqvga": "160x120",
        "qvga": "320x240",
        "vga": "640x480",
        "svga": "800x600",
        "xga": "1024x768",
        "uxga": "1600x1200",
        "qxga": "2048x1536",
        "sxga": "1280x1024",
        "qsxga": "2560x2048",
        "hsxga": "5120x4096",
        "wvga": "852x480",
        "wxga": "1366x768",
        "wsxga": "1600x1024",
        "wuxga": "1920x1200",
        "woxga": "2560x1600",
        "wqsxga": "3200x2048",
        "wquxga": "3840x2400",
        "whsxga": "6400x4096",
        "whuxga": "7680x4800",
        "cga": "320x200",
        "ega": "640x350",
        "hd480": "852x480",
        "hd720": "1280x720",
        "hd1080": "1920x1080",
        "2k": "2048x1080",
        "2kflat": "1998x1080",
        "2kscope": "2048x858",
        "4k": "4096x2160",
        "4kflat": "3996x2160",
        "4kscope": "4096x1716",
        "nhd": "640x360",
        "hqvga": "240x160",
        "wqvga": "400x240",
        "fwqvga": "432x240",
        "hvga": "480x320",
        "qhd": "960x540",
        "2kdci": "2048x1080",
        "4kdci": "4096x2160",
        "uhd2160": "3840x2160",
        "uhd4320": "7680x4320"
    }
};
