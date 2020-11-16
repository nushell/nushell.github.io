---
title: Commands
---

# Commands

Commands are the building blocks for pipelines in Nu. They do the action of the pipeline, whether creating data, changing data as it flows from inputs to outputs, or viewing data once it has exited the pipeline. There are two types of commands: internal commands, those commands built to run inside of Nu, and external commands, commands that are outside of Nu and communicate with standard Unix-style `stdin`/`stdout`.

## Internal commands

All commands inside of Nu, including plugins, are internal commands. Internal commands communicate with each other using streams of [Tagged&lt;Value&gt;](https://github.com/nushell/nushell/blob/d30c40b40ebfbb411a503ad7c7bceae8029c6689/crates/nu-source/src/meta.rs#L91) and [ShellError](https://github.com/nushell/nushell/blob/main/crates/nu-errors/src/lib.rs#L179).

### Signature

Commands use a light typechecking pass to ensure that arguments passed to them can be handled correctly. To enable this, each command provides a Signature which tells Nu:

* The name of the command
* The positional arguments (e.g. in `start x y` the `x` and `y` are positional arguments)
* If the command takes an unbounded number of additional positional arguments (e.g. `start a1 a2 a3 ... a99 a100`)
* The named arguments (e.g. `start --now`)
* If the command is a filter or a sink

With this information, a pipeline can be checked for potential problems before it's executed.

## External commands

An external command is any command that is not part of the Nu built-in commands or plugins. If a command is called that Nu does not know about, it will call out to the underlying environment with the provided arguments in an attempt to invoke this command as an external program.

## Communicating between internal and external commands

### Internal to internal

Internal commands communicate with each other using the complete value stream that Nu provides, which includes all the built-in file types. This includes communication between internal commands and plugins (in both directions).

### Internal to external

Internal commands that send text to external commands need to have prepared text strings ahead of time. If an object is sent directly to an external command, that is considered an error as there is no way to infer how the structured data should be represented for the external command. The user is expected to either narrow down to a simple data cell or to use one of the file type converters (like `to-json`) to convert the table into a string representation.

The external command is opened so that its `stdin` is redirected, so that the data can be sent to it.

### External to internal

External commands send a series of strings via their `stdout`. These strings are read into the pipeline and are made available to the internal command that is next in the pipeline, or displayed to the user if the external command is the last step of the pipeline.

### External to external

External commands communicate with each other via `stdin`/`stdout`. As Nu will detect this situation, it will redirect the `stdout` of the first command to the `stdin` of the following external command. In this way, the expected behavior of a shell pipeline between external commands is maintained.
