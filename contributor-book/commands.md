---
title: Commands
---

# Commands

Commands are the building blocks for pipelines in Nu. They do the action of the pipeline, whether creating data, changing data as it flows from inputs to outputs, or viewing data once it has exited the pipeline. There are two types of commands: internal commands, those commands built to run inside of Nu, and external commands, commands that are outside of Nu and communicate with standard Unix-style `stdin`/`stdout`.

## Internal commands

All commands inside of Nu, including custom commands written in Nu and commands provided by plugins, are internal commands. Internal commands communicate with each other using [`PipelineData`](https://docs.rs/nu-protocol/latest/nu_protocol/enum.PipelineData.html).

### Signature

Commands use a light typechecking pass to ensure that arguments passed to them can be handled correctly. To enable this, each [`Command`](https://docs.rs/nu-protocol/latest/nu_protocol/engine/trait.Command.html) provides a [`Signature`](https://docs.rs/nu-protocol/latest/nu_protocol/struct.Signature.html) which tells Nu:

- The name of the command
- The positional arguments (e.g. in `start x y` the `x` and `y` are positional arguments)
- If the command takes an unbounded number of additional positional arguments (e.g. `start a1 a2 a3 ... a99 a100`)
- The named arguments (e.g. `ansi gradient --fgstart '0x40c9ff'`)
- The input and output types the command supports (e.g. `string -> int`)

With this information, a pipeline can be checked for potential problems before it's executed.

## External commands

An external command is any command that is not part of the Nu built-in commands or plugins. If a command is called that Nu does not know about, it will call out to the underlying environment with the provided arguments in an attempt to invoke this command as an external program. Prefixing a command with `^` (e.g. `^ls`) always runs the external program, even if Nu has an internal command with the same name.

## Communicating between internal and external commands

### Internal to internal

Internal commands communicate with each other using the complete value stream that Nu provides, which includes all the built-in file types. This includes communication between internal commands and plugins (in both directions).

### Internal to external

Internal commands that send text to external commands need to have prepared text strings ahead of time. Binary data is sent as-is. If structured data is sent directly to an external command, Nu renders it as text the way the `table` command would (without colors) and sends that:

```nu
[[name size]; [foo 1] [bar 2]] | ^cat
# => ╭───┬──────┬──────╮
# => │ # │ name │ size │
# => ├───┼──────┼──────┤
# => │ 0 │ foo  │    1 │
# => │ 1 │ bar  │    2 │
# => ╰───┴──────┴──────╯
```

This is rarely what the external command expects, so the user should either narrow down to a simple data cell or use one of the file type converters (like `to json`) to convert the table into a string representation.

The external command is opened so that its `stdin` is redirected, so that the data can be sent to it.

### External to internal

External commands send a stream of bytes via their `stdout`. Nu reads this output as a byte stream and makes it available to the internal command that is next in the pipeline, or displays it to the user if the external command is the last step of the pipeline. Commands like `lines` or `from json` turn the byte stream into structured data.

```nu
^echo hello | describe
# => byte stream
```

### External to external

External commands communicate with each other via `stdin`/`stdout`. As Nu will detect this situation, it will redirect the `stdout` of the first command to the `stdin` of the following external command. In this way, the expected behavior of a shell pipeline between external commands is maintained.
