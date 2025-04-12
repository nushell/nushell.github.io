# Pipelines

## The pipeline special variable `$in`

## Best practices for pipeline commands

## Interaction with Unix pipes

## Handling stdout and stderr

You can handle stderr in multiple ways:

1. Do nothing, stderr will be printed directly
2. Pipe stderr to the next command, using `e>|` or `e+o>|`
3. Redirect stderr to a file, using `e> file_path`, or `e+o> file_path`
4. Use `do -i { cmd } | complete` to capture both stdout and stderr as structured data

For the next examples, let's assume this file:

```nu
# demo.nu
print "foo"
print -e "barbar"
```

It prints `foo` to stdout and `barbar` to stderr. The following table illustrates the differences between the different redirection styles:

Redirection to a pipeline:

| type   | command                                     | `$result` contents | printed to terminal |
| ------ | ------------------------------------------- | ------------------ | ------------------- |
| \|     | `let result = nu demo.nu \| str upcase`     | "FOO"              | "barbar"            |
| e>\|   | `let result = nu demo.nu e>\| str upcase`   | "BARBAR"           | "foo"               |
| o+e>\| | `let result = nu demo.nu e+o>\| str upcase` | "FOO\nBARBAR"      | nothing             |

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
# => Error:   × `e>|` only works with external streams
# =>    ╭─[entry #1:1:1]
# =>  1 │ ls e>| str length
# =>    ·    ─┬─
# =>    ·     ╰── `e>|` only works on external streams
# =>    ╰────

ls e+o>| str length
# => Error:   × `o+e>|` only works with external streams
# =>    ╭─[entry #2:1:1]
# =>  1 │ ls e+o>| str length
# =>    ·    ──┬──
# =>    ·      ╰── `o+e>|` only works on external streams
# =>    ╰────
```

You can also redirect `stdout` to a file, and pipe `stderr` to next command:

```nu
nu demo.nu o> file.txt e>| str upcase
nu demo.nu e> file.txt | str upcase
```

But you can't use redirection along with `o+e>|`, because it's ambiguous:

```nu
nu demo.nu o> file.txt o+e>| str upcase
```

Also note that `complete` is special, it doesn't work with `e>|`, `o+e>|`.

## Stdio and redirection behavior examples

Pipeline and redirection behavior can be hard to follow when they are used with subexpressions, or custom commands.  Here are some examples that show intended stdio behavior.

### Examples for subexpression

- (^cmd1 | ^cmd2; ^cmd3 | ^cmd4)

| Command | Stdout     | Stderr     |
| ------- | --------   | ---------- |
| cmd1    | Piped      | Terminal   |
| cmd2    | *Terminal* | Terminal   |
| cmd3    | Piped      | Terminal   |
| cmd4    | Terminal   | Terminal   |

- (^cmd1 | ^cmd2; ^cmd3 | ^cmd4) | ^cmd5

It runs `(^cmd1 | ^cmd2; ^cmd3 | ^cmd4)` first, then pipes *stdout* to `^cmd5`, where both stdout and stderr are directed to the Terminal.

| Command | Stdout     | Stderr     |
| ------- | --------   | ---------- |
| cmd1    | Piped      | Terminal   |
| cmd2    | *Terminal* | Terminal   |
| cmd3    | Piped      | Terminal   |
| cmd4    | Piped      | Terminal  |

- (^cmd1 | ^cmd2; ^cmd3 | ^cmd4) e>| ^cmd5

It runs `(^cmd1 | ^cmd2; ^cmd3 | ^cmd4)` first, then pipes *stderr* to `^cmd5`, where both stdout and stderr are directed to the Terminal.

| Command | Stdout   | Stderr   |
| ------- | -------- | -------- |
| cmd1    | Piped    | Terminal |
| cmd2    | Terminal | Terminal |
| cmd3    | Piped    | Terminal |
| cmd4    | Terminal | Piped   |

- (^cmd1 | ^cmd2; ^cmd3 | ^cmd4) o+e>| ^cmd5

It runs `(^cmd1 | ^cmd2; ^cmd3 | ^cmd4)` first, then pipes *stdout and stderr* to `^cmd5`, where both stdout and stderr are directed to the Terminal.

| Command | Stdout   | Stderr   |
| ------- | -------- | -------- |
| cmd1    | Piped    | Terminal |
| cmd2    | Terminal | Terminal |
| cmd3    | Piped    | Terminal |
| cmd4    | Piped    | Piped   |

- (^cmd1 | ^cmd2; ^cmd3 | ^cmd4) o> test.out

| Command | Stdout   | Stderr   |
| ------- | -------- | -------- |
| cmd1    | Piped    | Terminal |
| cmd2    | File | Terminal |
| cmd3    | Piped    | Terminal |
| cmd4    | File    | Terminal   |

- (^cmd1 | ^cmd2; ^cmd3 | ^cmd4) e> test.out

| Command | Stdout   | Stderr   |
| ------- | -------- | -------- |
| cmd1    | Piped    | File |
| cmd2    | Terminal | File |
| cmd3    | Piped    | File |
| cmd4    | Terminal    | File   |

- (^cmd1 | ^cmd2; ^cmd3 | ^cmd4) o+e> test.out

| Command | Stdout   | Stderr   |
| ------- | -------- | -------- |
| cmd1    | Piped    | File |
| cmd2    | File | File |
| cmd3    | Piped    | File |
| cmd4    | File    | File   |

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

- custom-cmd

| Command | Stdout     | Stderr     |
| ------- | --------   | ---------- |
| cmd1    | Piped      | Terminal   |
| cmd2    | *Terminal* | Terminal   |
| cmd3    | Piped      | Terminal   |
| cmd4    | Terminal   | Terminal   |

- custom-cmd | ^cmd5

It runs `custom-cmd` first, then pipes *stdout* to `^cmd5`, where both stdout and stderr are directed to the Terminal.

| Command | Stdout     | Stderr     |
| ------- | --------   | ---------- |
| cmd1    | Piped      | Terminal   |
| cmd2    | *Terminal* | Terminal   |
| cmd3    | Piped      | Terminal   |
| cmd4    | Piped      | Terminal  |

- custom-cmd e>| ^cmd5

It runs `custom-cmd` first, then pipes *stderr* to `^cmd5`, where both stdout and stderr are directed to the Terminal.

| Command | Stdout   | Stderr   |
| ------- | -------- | -------- |
| cmd1    | Piped    | Terminal |
| cmd2    | Terminal | Terminal |
| cmd3    | Piped    | Terminal |
| cmd4    | Terminal | Piped   |

- custom-cmd o+e>| ^cmd5

It runs `custom-cmd` first, then pipes *stdout and stderr* to `^cmd5`, where both stdout and stderr are directed to the Terminal.

| Command | Stdout   | Stderr   |
| ------- | -------- | -------- |
| cmd1    | Piped    | Terminal |
| cmd2    | Terminal | Terminal |
| cmd3    | Piped    | Terminal |
| cmd4    | Piped    | Piped   |

- custom-cmd o> test.out

| Command | Stdout   | Stderr   |
| ------- | -------- | -------- |
| cmd1    | Piped    | Terminal |
| cmd2    | File | Terminal |
| cmd3    | Piped    | Terminal |
| cmd4    | File    | Terminal   |

- custom-cmd e> test.out

| Command | Stdout   | Stderr   |
| ------- | -------- | -------- |
| cmd1    | Piped    | File |
| cmd2    | Terminal | File |
| cmd3    | Piped    | File |
| cmd4    | Terminal    | File   |

- custom-cmd o+e> test.out

| Command | Stdout   | Stderr   |
| ------- | -------- | -------- |
| cmd1    | Piped    | File |
| cmd2    | File | File |
| cmd3    | Piped    | File |
| cmd4    | File    | File   |
