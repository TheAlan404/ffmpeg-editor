import { ActionIcon, Box, Button, Card, Checkbox, CloseButton, Combobox, Container, CopyButton, Flex, Grid, Group, InputBase, Paper, ScrollArea, Select, Stack, Text, TextInput, Textarea, useCombobox } from '@mantine/core'
import { useListState, useSetState } from '@mantine/hooks';
import React, { useEffect, useState } from 'react'
import { data } from './data';
import { IconArrowRight, IconPlus } from '@tabler/icons-react';
import { modals } from '@mantine/modals';

export let StreamType = {
    Data: ["data"],
    Video: ["video"],
    Audio: ["audio"],
    Subtitles: ["subtitles"],
    All: ["data", "video", "audio", "subtitles"]
};

const InputWithAbbreviations = ({
    value,
    onChange,
    required,
    isNotAbbr,
    abbrList,
    inputProps,
    error,
}) => {
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    let isValid = (required ? !!value : !value) || abbrList[value] || isNotAbbr(value);

    let results = isNotAbbr(value) ? [] : Object.keys(abbrList).filter(a => a.includes(value.toLowerCase().trim()));

    return (
        <Combobox
            store={combobox}
            onOptionSubmit={(v) => {
                onChange(v);
                combobox.closeDropdown();
            }}>
            <Combobox.Target>
                <TextInput
                    value={value}
                    {...inputProps}
                    error={!isValid && error}
                    onChange={(e) => {
                        if (isNotAbbr(e.currentTarget.value)) {
                            combobox.closeDropdown();
                            onChange(e.currentTarget.value);
                        } else {
                            combobox.openDropdown();
                            combobox.updateSelectedOptionIndex();
                        }
                    }}
                    onClick={() => !isNotAbbr(value) && combobox.openDropdown()}
                    onFocus={() => !isNotAbbr(value) && combobox.openDropdown()}
                    onBlur={() => {
                        combobox.closeDropdown();
                    }}
                    rightSection={!isNotAbbr(value) && isValid && abbrList[value]}
                />
            </Combobox.Target>

            <Combobox.Dropdown>
                <Combobox.Options>
                    {results.map((abbr) => (
                        <Combobox.Option value={abbr} key={abbr}>
                            {abbr}
                        </Combobox.Option>
                    ))}
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
}

let getString = (str, pos, id) => {
    return typeof str == "string" ? str : (str ? str[pos] : (id ? ("-" + id) : null))
};

const OptionDefault = {
    Null: 0,
    bool: true,
    duration: "0",
    position: "0",
}

const OptionEdit = {
    Null() {
        return <>
            {"TODO"}
        </>
    },

    string({ id, name, desc, value, onChange, pos }) {
        <TextInput
            label={getString(name, pos, id)}
            value={value}
            onChange={(e) => onChange(e.currentTarget.value)} />
    },

    bool({ id, name, desc, value, onChange, pos }) {
        return <Checkbox
            label={getString(name, pos, id)}
            description={getString(desc, pos)}
            checked={value}
            onChange={(e) => onChange(e.currentTarget.checked)}
        />
    },

    VideoSize({ value, onChange, required }) {
        return <InputWithAbbreviations
            value={value}
            onChange={onChange}
            required={required}
            inputProps={{
                label: "Video Size",
                placeholder: "720x480 or '4k'"
            }}
            error="Invalid video size. Must be 'widthxheight' or a known size such as '4k'"
            isNotAbbr={(s) => (
                s
                && s.split("x").length == 2
                && s.split("x").every(x => !isNaN(x))
            )}
            abbrList={data.videoSizeAbbr}
        />;
    },

    enum({ id, name, desc, values, pos, value, onChange }) {
        return <Select
            label={name}
            description={desc}
            value={value}
            onChange={onChange}
            searchable
            data={values}
            />;
    },

    StreamSpecifier({ value, onChange }) {
        let li = (value || "").split(":");
        
        return <Group>
            <OptionEdit.enum
                name="Match stream from"
                values={[
                    { value: "stream_index", label: "Stream Index" },
                    { value: "stream_type", label: "Stream Type" },
                    { value: "program_id", label: "Program ID" },
                    { value: "stream_id", label: "Stream ID" },
                    { value: "m", label: "Metadata" },
                    { value: "u", label: "Usable" },
                ]}
                onChange={(v) => onChange()}
                />
            {}
        </Group>
    }
}

const App = () => {
    let [inputs, inputHandlers] = useListState([
        { filename: "input.mp4", options: {} }
    ]);

    let [outputs, outputHandlers] = useListState([
        { filename: "output.mkv", options: {} }
    ]);

    let [genericOptions, setGenericOptions] = useSetState({});

    let cmd = {
        inputs,
        outputs,
        genericOptions,
    };

    let cmdStr = cmdToString(cmd);

    return (
        <Box h="100vh">
            <Container mb="md">
                <Stack>
                    <Grid align="flex-end" columns={2}>
                        <Grid.Col span={{ base: 2, sm: "auto" }}>
                            <Textarea
                                value={cmdStr}
                                label="FFMPEG Command"
                                autosize
                                onChange={() => {

                                }}
                                classNames={{ input: "mantine-Code-root" }}
                                />
                        </Grid.Col>
                        <Grid.Col span="content">
                            <CopyButton value={cmdStr}>
                                {({ copied, copy }) => (
                                    <Button
                                        color={copied ? 'teal' : 'blue'}
                                        onClick={copy}
                                        bottom>
                                        {copied ? "Copied" : "Copy"}
                                    </Button>
                                )}
                            </CopyButton>
                        </Grid.Col>
                    </Grid>

                    <GenericEdit value={genericOptions} onChange={(v) => setGenericOptions(v)} />
                </Stack>
            </Container>

            <ScrollArea m="md">
                <Flex
                    align="center"
                    direction={{ base: 'column', sm: 'row' }}
                    gap={{ base: 'sm', sm: 'lg' }}>
                    {inputs.map((input, idx) => (
                        <FileEdit
                            file={input}
                            setFile={(f) => inputHandlers.setItem(idx, f)}
                            removeFile={() => inputHandlers.remove(idx)}
                            cmd={cmd}
                            pos="input"
                            idx={idx}
                            key={idx} />
                    ))}

                    <Stack align='center'>
                        <ActionIcon
                            onClick={() => inputHandlers.append({ filename: "", options: {} })}
                            variant="light"
                            size="xl"
                            radius="xl">
                            <IconPlus />
                        </ActionIcon>
                    </Stack>

                    <IconArrowRight />

                    {outputs.map((output, idx) => (
                        <FileEdit
                            file={output}
                            setFile={(f) => outputHandlers.setItem(idx, f)}
                            removeFile={() => outputHandlers.remove(idx)}
                            cmd={cmd}
                            pos="output"
                            idx={idx}
                            key={idx} />
                    ))}

                    <Stack align='center'>
                        <ActionIcon
                            onClick={() => outputHandlers.append({ filename: "", options: {} })}
                            variant="light"
                            size="xl"
                            radius="xl">
                            <IconPlus />
                        </ActionIcon>
                    </Stack>
                </Flex>
            </ScrollArea>

        </Box>
    )
}

const GenericEdit = ({ value, onChange }) => {
    return (
        data.genericOptions.map((opt, idx) => {
            let Editor = OptionEdit[opt.type];
            return <Editor
                value={value[opt.id]}
                onChange={(v) => onChange({
                    ...value,
                    [opt.id]: v,
                })}
                key={opt.id}
                {...opt}
            />
        })
    );
}

let detectFormat = (fn) => {
    let search = [
        ...data.protocols
    ];

    return search.find(p => p.filenameHint && fn.startsWith(p.filenameHint))
        || data.protocols.find(p => p.id == "file")
}

const FileEdit = ({ file, setFile, idx, cmd, pos, removeFile }) => {
    let fmt = file.format ? [...data.protocols, ...data.devices]
        .find(f => f.id == file.format) : detectFormat(file.filename);

    let FilenameEdit = OptionEdit[fmt.type || "string"] || OptionEdit.Null;

    return (
        <>
            <Card miw={{ base: "20vw", md: "20vw" }}>
                <Stack gap="md">
                    <Group justify='space-between'>
                        <Text fw={500}>
                            {pos[0].toUpperCase() + pos.slice(1)} #{idx}
                        </Text>
                        <CloseButton
                            onClick={() => {
                                modals.openConfirmModal({
                                    title: "Remove file?",
                                    centered: true,
                                    children: (
                                        <Text>
                                            Remove {file.filename}? There is no undo.
                                        </Text>
                                    ),
                                    labels: { confirm: 'Delete file', cancel: 'Cancel' },
                                    confirmProps: { color: 'red' },
                                    onCancel: () => {},
                                    onConfirm: () => removeFile(),
                                })
                            }}
                            />
                    </Group>

                    <Group grow>
                        <Select
                            label="Format (-f)"
                            value={fmt.id}
                            data={[
                                {
                                    group: "Protocols",
                                    items: data.protocols.filter(p => p.pos.includes(pos)).map(p => ({
                                        value: p.id,
                                        label: p.name ? `${p.name} (${p.id})` : p.id
                                    }))
                                },
                                {
                                    group: "Devices",
                                    items: data.devices.filter(p => p.pos.includes(pos)).map(p => ({
                                        value: p.id,
                                        label: p.name ? `${p.name} (${p.id})` : p.id
                                    }))
                                },
                            ]}
                            searchable
                            onChange={(f) => setFile({ ...file, format: f })}
                            />
                        <FilenameEdit
                            name="Filename"
                            value={file.filename}
                            onChange={(filename) => setFile({ ...file, filename })}
                            />
                    </Group>

                    <Button onClick={() => modals.open({
                        title: "Add an Option",
                        centered: true,
                        size: "lg",
                        children: (
                            <AddOptionModal
                                addOption={(id) => {
                                    let opt = data.fileOptions.find(o => o.id == id);

                                    setFile({
                                        ...file,
                                        options: {
                                            ...file.options,
                                            [id]: OptionDefault[opt.type],
                                        }
                                    })
                                }}
                                pos={pos}
                            />
                        )
                    })}>
                        Add Option
                    </Button>
                    
                    {Object.entries(file.options).map(([k, v]) => {
                        let opt = data.fileOptions.find(o => o.id == k);
                        let Editor = (OptionEdit[opt.type] || OptionEdit.Null);
                        return <Editor
                            value={v === undefined ? OptionDefault[opt.type] : v}
                            onChange={(val) => setFile({
                                ...file,
                                options: {
                                    ...file.options,
                                    [opt.id]: val,
                                }
                            })}
                            key={opt.id}
                            {...opt}
                        />
                    })}
                </Stack>
            </Card>
        </>
    );
}

const getAllStrings = ({ name, desc, id }, pos) => {
    return [
        getString(name, pos, id),
        getString(desc, pos),
        id,
    ].join(" ");
}

const AddOptionModal = ({ pos, addOption }) => {
    const [search, setSearch] = useState("");
    const combobox = useCombobox();

    const options = data.fileOptions.filter(o => o[pos])
        .filter((opt) => getAllStrings(opt, pos).toLowerCase().includes(search.toLowerCase().trim()))
        .map((opt) => {
            let name = getString(opt.name, pos);
            let desc = getString(opt.desc, pos);
            
            return <Combobox.Option value={opt.id} key={opt.id}>
                <Paper withBorder shadow="md" p="md">
                    <Stack>
                        {name ? <Group justify='space-between'>
                            <Text fw="bold">{name}</Text>
                            <Text c="dimmed">-{opt.id}</Text>
                        </Group> : <Text>
                            {opt.id}
                        </Text>}
                        <Text c="dimmed" size="sm">
                            {desc}
                        </Text>
                    </Stack>
                </Paper>
            </Combobox.Option>;
        });

    return (
        <>
            <Combobox
                store={combobox}
                onOptionSubmit={(val) => {
                    addOption(val);
                    modals.closeAll();
                }}
                classNames={{ option: "mantine-Combobox-option" }}
            >
                <Combobox.Target>
                    <TextInput
                        value={search}
                        onChange={(event) => setSearch(event.currentTarget.value)}
                        placeholder="Search options"
                        autoFocus
                    />
                </Combobox.Target>

                <Combobox.Options p="md">
                    {options.length > 0 ? options : <Combobox.Empty>Nothing found</Combobox.Empty>}
                </Combobox.Options>
            </Combobox>
        </>
    );
}

const cmdToString = ({
    inputs,
    outputs,
    genericOptions,
}) => {
    let args = ["ffmpeg"];

    const serialize = {
        bool: (k, v) => v ? ["-" + k] : [],
        boolnum: (k, v, o) => o.default === v ? [] : ["-" + k, v ? "1" : "0"],
        _: (k, v) => ["-" + k, q(v)],
    };

    const q = (s) => (
        s ? (
            s.replace(/[\w\d._]/g, "").length ? ("'" + s.replace(/'/g, "'\\''") + "'") : s
        ) : "''"
    );

    for (let [id, v] of Object.entries(genericOptions)) {
        let opt = data.genericOptions.find(o => o.id == id);

        let list = (serialize[opt.type] || serialize._)(id, v, opt);

        args.push(...list);
    }

    const serializeFile = (f, pos) => {
        for (let [id, v] of Object.entries(f.options)) {
            let opt = data.fileOptions.find(o => o.id == id);
            let list = (serialize[opt.type] || serialize._)(id, v, opt);
            args.push(...list);
        }

        if(f.format && f.format.id != "file") {
            args.push("-f");
            args.push(f.format.id);
        }

        if (pos == "input") {
            args.push("-i");
        };

        args.push(q(f.filename));
    };

    inputs.forEach(input => {
        serializeFile(input, "input");
    })

    outputs.forEach(output => {
        serializeFile(output, "output");
    })

    return args.join(" ");
}

export default App
