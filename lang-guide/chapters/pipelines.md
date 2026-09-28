# Pipelines

## The pipeline special variable `$in`

`$in` holds the input of the current pipeline stage. It can be used in an expression that is itself a stage of the pipeline, in a closure, or in the body of a custom command:

```nu
[3 1 2] | sort | $in.0
# => 1
"hello" | $"($in) world"
# => hello world
```

See [Pipeline Input and the Special `$in` Variable](/book/pipelines.md#pipeline-input-and-the-special-in-variable) in the Book for details.

## Best practices for pipeline commands

## Interaction with Unix pipes

The output of an external command is a stream of bytes, which Nushell passes on to the next command as it arrives. If any external command in a pipeline exits with a non-zero exit code, the pipeline fails, even when it is not the last command (like `set -o pipefail` in Bash). Use `try` to handle the failure, or `complete` to capture the exit code:

```nu
try { ^false | lines } catch {|e| $e.exit_code }
# => 1
```

## Handling stdout and stderr

You can handle stderr in multiple ways:

1. Do nothing, stderr will be printed directly
2. Pipe stderr to the next command, using `e>|` or `o+e>|`
3. Redirect stderr to a file, using `e> file_path`, or `o+e> file_path`
4. Use `do -i { cmd } | complete` to capture both stdout and stderr as structured data

For the next examples, let's assume this file:

```nu
# demo.nu
print "foo"
print -e "barbar"
```

It prints `foo` to stdout and `barbar` to stderr. The following table illustrates the differences between the different redirection styles:

Redirection to a pipeline:

| type   | command                                        | `$result` contents | printed to terminal |
| ------ | ---------------------------------------------- | ------------------ | ------------------- |
| \|     | `let result = nu demo.nu \| str uppercase`     | "FOO"              | "barbar"            |
| e>\|   | `let result = nu demo.nu e>\| str uppercase`   | "BARBAR"           | "foo"               |
| o+e>\| | `let result = nu demo.nu o+e>\| str uppercase` | "FOO\nBARBAR"      | nothing             |

Redirection to a file:

| type           | command                    | `file.txt` contents | printed to terminal |
| -------------- | -------------------------- | ------------------- | ------------------- |
| o> file_path   | `nu demo.nu o> file.txt`   | "foo\n"             | "barbar"            |
| e> file_path   | `nu demo.nu e> file.txt`   | "barbar\n"          | "foo"               |
| o+e> file_path | `nu demo.nu o+e> file.txt` | "foo\nbarbar\n"     | nothing             |

`complete` command:

| type           | command                                      | `$result` contents                       |
| -------------- | -------------------------------------------- | ---------------------------------------- |
| use `complete` | `let result = do { nu demo.nu } \| complete` | record containing both stdout and stderr |

Note that `e>|` and `o+e>|` only work with external command, if you pipe internal commands' output through `e>|` and `o+e>|`, you will get an error:

```nu
ls e>| str length
# => Error: nu::shell::error
# =>
# =>   × Can't redirect stderr of internal command output
# =>    ╭─[repl_entry #1:1:4]
# =>  1 │ ls e>| str length
# =>    ·    ─┬─
# =>    ·     ╰── piping stderr only works on external commands
# =>    ╰────

ls o+e>| str length
# => Error: nu::shell::error
# =>
# =>   × Can't redirect stderr of internal command output
# =>    ╭─[repl_entry #2:1:4]
# =>  1 │ ls o+e>| str length
# =>    ·    ──┬──
# =>    ·      ╰── piping stderr only works on external commands
# =>    ╰────
```

You can also redirect `stdout` to a file, and pipe `stderr` to next command:

```nu
nu demo.nu o> file.txt e>| str uppercase
# => BARBAR
nu demo.nu e> file.txt | str uppercase
# => FOO
```

But you can't use redirection along with `o+e>|`, because it's ambiguous:

```nu
nu demo.nu o> file.txt o+e>| str uppercase
# => Error: nu::parser::multiple_redirections
# =>
# =>   × Multiple redirections provided for stdout.
# =>    ╭─[repl_entry #1:1:12]
# =>  1 │ nu demo.nu o> file.txt o+e>| str uppercase
# =>    ·            ─┬          ──┬──
# =>    ·             │            ╰── second redirection
# =>    ·             ╰── first redirection
# =>    ╰────
```

Also note that `complete` treats whatever is piped into it as the command's stdout. With `e>|`, the `stdout` field of the result holds the command's stderr (and `stderr` holds its stdout). With `o+e>|`, both streams end up in `stdout`. Use a plain `|` to get the two streams in their own fields.

## Stdio and redirection behavior examples

Pipeline and redirection behavior can be hard to follow when they are used with subexpressions, or custom commands. Here are some examples that show intended stdio behavior.

### Examples for subexpression

- `(^cmd1 | ^cmd2; ^cmd3 | ^cmd4)`

| Command   | Stdout     | Stderr   |
| --------- | ---------- | -------- |
| `cmd1`    | Piped      | Terminal |
| `cmd2`    | _Terminal_ | Terminal |
| `cmd3`    | Piped      | Terminal |
| `cmd4`    | Terminal   | Terminal |

- `(^cmd1 | ^cmd2; ^cmd3 | ^cmd4) | ^cmd5`

It runs `(^cmd1 | ^cmd2; ^cmd3 | ^cmd4)` first, then pipes _stdout_ to `^cmd5`, where both stdout and stderr are directed to the Terminal.

| Command   | Stdout     | Stderr   |
| --------- | ---------- | -------- |
| `cmd1`    | Piped      | Terminal |
| `cmd2`    | _Terminal_ | Terminal |
| `cmd3`    | Piped      | Terminal |
| `cmd4`    | Piped      | Terminal |

- `(^cmd1 | ^cmd2; ^cmd3 | ^cmd4) e>| ^cmd5`

It runs `(^cmd1 | ^cmd2; ^cmd3 | ^cmd4)` first, then pipes _stderr_ to `^cmd5`, where both stdout and stderr are directed to the Terminal.

| Command   | Stdout   | Stderr   |
| --------- | -------- | -------- |
| `cmd1`    | Piped    | Terminal |
| `cmd2`    | Terminal | Terminal |
| `cmd3`    | Piped    | Terminal |
| `cmd4`    | Terminal | Piped    |

- `(^cmd1 | ^cmd2; ^cmd3 | ^cmd4) o+e>| ^cmd5`

It runs `(^cmd1 | ^cmd2; ^cmd3 | ^cmd4)` first, then pipes _stdout and stderr_ to `^cmd5`, where both stdout and stderr are directed to the Terminal.

| Command   | Stdout   | Stderr   |
| --------- | -------- | -------- |
| `cmd1`    | Piped    | Terminal |
| `cmd2`    | Terminal | Terminal |
| `cmd3`    | Piped    | Terminal |
| `cmd4`    | Piped    | Piped    |

- `(^cmd1 | ^cmd2; ^cmd3 | ^cmd4) o> test.out`

| Command   | Stdout | Stderr   |
| --------- | ------ | -------- |
| `cmd1`    | Piped  | Terminal |
| `cmd2`    | File   | Terminal |
| `cmd3`    | Piped  | Terminal |
| `cmd4`    | File   | Terminal |

- `(^cmd1 | ^cmd2; ^cmd3 | ^cmd4) e> test.out`

| Command   | Stdout   | Stderr |
| --------- | -------- | ------ |
| `cmd1`    | Piped    | File   |
| `cmd2`    | Terminal | File   |
| `cmd3`    | Piped    | File   |
| `cmd4`    | Terminal | File   |

- `(^cmd1 | ^cmd2; ^cmd3 | ^cmd4) o+e> test.out`

| Command   | Stdout | Stderr |
| --------- | ------ | ------ |
| `cmd1`    | Piped  | File   |
| `cmd2`    | File   | File   |
| `cmd3`    | Piped  | File   |
| `cmd4`    | File   | File   |

### Examples for custom command

Given the following custom commands

```nu
def custom-cmd [] {
    ^cmd1 | ^cmd2
    ^cmd3 | ^cmd4
}
```

The custom command stdio behavior is the same as the previous section.

In the examples below the body of `custom-cmd` is `(^cmd1 | ^cmd2; ^cmd3 | ^cmd4)`.

- `custom-cmd`

| Command   | Stdout     | Stderr   |
| --------- | ---------- | -------- |
| `cmd1`    | Piped      | Terminal |
| `cmd2`    | _Terminal_ | Terminal |
| `cmd3`    | Piped      | Terminal |
| `cmd4`    | Terminal   | Terminal |

- `custom-cmd | ^cmd5`

It runs `custom-cmd` first, then pipes _stdout_ to `^cmd5`, where both stdout and stderr are directed to the Terminal.

| Command   | Stdout     | Stderr   |
| --------- | ---------- | -------- |
| `cmd1`    | Piped      | Terminal |
| `cmd2`    | _Terminal_ | Terminal |
| `cmd3`    | Piped      | Terminal |
| `cmd4`    | Piped      | Terminal |

- `custom-cmd e>| ^cmd5`

It runs `custom-cmd` first, then pipes _stderr_ to `^cmd5`, where both stdout and stderr are directed to the Terminal.

| Command   | Stdout   | Stderr   |
| --------- | -------- | -------- |
| `cmd1`    | Piped    | Terminal |
| `cmd2`    | Terminal | Terminal |
| `cmd3`    | Piped    | Terminal |
| `cmd4`    | Terminal | Piped    |

- `custom-cmd o+e>| ^cmd5`

It runs `custom-cmd` first, then pipes _stdout and stderr_ to `^cmd5`, where both stdout and stderr are directed to the Terminal.

| Command   | Stdout   | Stderr   |
| --------- | -------- | -------- |
| `cmd1`    | Piped    | Terminal |
| `cmd2`    | Terminal | Terminal |
| `cmd3`    | Piped    | Terminal |
| `cmd4`    | Piped    | Piped    |

- `custom-cmd o> test.out`

| Command   | Stdout | Stderr   |
| --------- | ------ | -------- |
| `cmd1`    | Piped  | Terminal |
| `cmd2`    | File   | Terminal |
| `cmd3`    | Piped  | Terminal |
| `cmd4`    | File   | Terminal |

- `custom-cmd e> test.out`

| Command   | Stdout   | Stderr |
| --------- | -------- | ------ |
| `cmd1`    | Piped    | File   |
| `cmd2`    | Terminal | File   |
| `cmd3`    | Piped    | File   |
| `cmd4`    | Terminal | File   |

- `custom-cmd o+e> test.out`

| Command   | Stdout | Stderr |
| --------- | ------ | ------ |
| `cmd1`    | Piped  | File   |
| `cmd2`    | File   | File   |
| `cmd3`    | Piped  | File   |
| `cmd4`    | File   | File   |
