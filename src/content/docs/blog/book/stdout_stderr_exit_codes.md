---
title: Stdout, Stderr, and Exit Codes
---

An important piece of interop between Nushell and external commands is working with the standard streams of data coming from the external.

The first of these important streams is stdout.

## Stdout

Stdout is the way that most external apps will send data into the pipeline or to the screen. Data sent by an external app to its stdout is received by Nushell by default if it's part of a pipeline:

```nu
> external | str join
```

The above would call the external named `external` and would redirect the stdout output stream into the pipeline. With this redirection, Nushell can then pass the data to the next command in the pipeline, here [`str join`](/commands/docs/str_join).

Without the pipeline, Nushell will not do any redirection, allowing it to print directly to the screen.

## Stderr

Another common stream that external applications often use to print error messages is stderr. By default, Nushell does not do any redirection of stderr, which means that by default it will print to the screen.

You can force Nushell to do a redirection by using `do { ... } | complete`. For example, if we wanted to call the external above and redirect its stderr, we would write:

```nu
> do { external } | complete
```

## Exit code

Finally, external commands have an "exit code". These codes help give a hint to the caller whether the command ran successfully.

Nushell tracks the last exit code of the recently completed external in one of two ways. The first way is with the `LAST_EXIT_CODE` environment variable.

```nu
> do { external }
> $env.LAST_EXIT_CODE
```

The second uses a command called [`complete`](/commands/docs/complete).

## Using the [`complete`](/commands/docs/complete) command

The [`complete`](/commands/docs/complete) command allows you to run an external to completion, and gather the stdout, stderr, and exit code together in one record.

If we try to run the external `cat` on a file that doesn't exist, we can see what [`complete`](/commands/docs/complete) does with the streams, including the redirected stderr:

```nu
> do { cat unknown.txt } | complete
╭───────────┬─────────────────────────────────────────────╮
│ stdout    │                                             │
│ stderr    │ cat: unknown.txt: No such file or directory │
│ exit_code │ 1                                           │
╰───────────┴─────────────────────────────────────────────╯
```

## `echo`, `print`, and `log` commands

The [`echo`](/commands/docs/echo) command is mainly for _pipes_. It returns its arguments, ignoring the piped-in value. There is usually little reason to use this over just writing the values as-is.

In contrast, the [`print`](/commands/docs/print) command prints the given values to stdout as plain text. It can be used to write to standard error output, as well. Unlike [`echo`](/commands/docs/echo), this command does not return any value (`print | describe` will return "nothing"). Since this command has no output, there is no point in piping it with other commands.

The [standard library](/book/standard_library) has commands to write out messages in different logging levels. For example:

```nu
use std log

def main [] {
    log debug "Debug message"
    log info "Info message"
    log warning "Warning message"
    log error "Error message"
    log critical "Critical message"
}
```

![Log message examples](../assets/images/0_79_std_log.png)

The log level for output can be set with the `NU_LOG_LEVEL` environment variable:

```nu
NU_LOG_LEVEL=DEBUG nu std_log.nu
```

## Using `out>`, `err>` to redirect stdout and stderr to files

If you want to redirect output to file, you can just type something like this:

```nu
cat unknown.txt out> out.log err> err.log
```

If you want to redirect both stdout and stderr to the same file, just type something like this:

```nu
cat unknown.txt out+err> log.log
```

## Raw streams

Both stdout and stderr are represented as "raw streams" inside of Nushell. These are streams of bytes rather than structured data, which are what internal Nushell commands use.

Because streams of bytes can be difficult to work with, especially given how common it is to use output as if it was text data, Nushell attempts to convert raw streams into text data. This allows other commands to pull on the output of external commands and receive strings they can further process.

Nushell attempts to convert to text using UTF-8. If at any time the conversion fails, the rest of the stream is assumed to always be bytes.

If you want more control over the decoding of the byte stream, you can use the [`decode`](/commands/docs/decode) command. The [`decode`](/commands/docs/decode) command can be inserted into the pipeline after the external, or other raw stream-creating command, and will handle decoding the bytes based on the argument you give decode. For example, you could decode shift-jis text this way:

```nu
> 0x[8a 4c] | decode shift-jis
貝
```
