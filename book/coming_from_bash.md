---
prev:
  text: Coming to Nu
  link: /book/coming_to_nu.md
---
# Coming from Bash

::: tip
If you're coming from `Git Bash` on Windows, then the external commands you're used to (e.g, `ln`, `grep`, `vi`, etc) will not be available in Nushell by default unless you have already explicitly made them available in the Windows Path environment variable.
To make these commands available in Nushell as well, add the following line to your `config.nu` with either `append` or `prepend`.

```nu
$env.Path = ($env.Path | prepend 'C:\Program Files\Git\usr\bin')
```
:::

## Command Equivalents:

| Bash                                 | Nu                                                            | Task                                                              |
| ------------------------------------ | ------------------------------------------------------------- | ----------------------------------------------------------------- |
| `ls`                                 | `ls`                                                          | Lists the files in the current directory                          |
| `ls <dir>`                           | `ls <dir>`                                                    | Lists the files in the given directory                            |
| `ls pattern*`                        | `ls pattern*`                                                 | Lists files that match a given pattern                            |
| `ls -la`                             | `ls --long --all` or `ls -la`                                 | List files with all available information, including hidden files |
| `ls -d */`                           | `ls \| where type == dir`                                     | List directories                                                  |
| `find . -name *.rs`                  | `ls **/*.rs`                                                  | Find recursively all files that match a given pattern             |
| `find . -name Makefile \| xargs vim` | `ls **/Makefile \| get name \| vim ...$in`                    | Pass values as command parameters                                 |
| `cd <directory>`                     | `cd <directory>`                                              | Change to the given directory                                     |
| `cd`                                 | `cd`                                                          | Change to the home directory                                      |
| `cd -`                               | `cd -`                                                        | Change to the previous directory                                  |
| `mkdir <path>`                       | `mkdir <path>`                                                | Creates the given path                                            |
| `mkdir -p <path>`                    | `mkdir <path>`                                                | Creates the given path, creating parents as necessary             |
| `touch test.txt`                     | `touch test.txt`                                              | Create a file                                                     |
| `> <path>`                           | `out> <path>` or `o> <path>`                                  | Save command output to a file                                     |
|                                      | `\| save <path>`                                              | Save command output to a file as structured data                  |
| `>> <path>`                          | `out>> <path>` or `o>> <path>`                                | Append command output to a file                                   |
|                                      | `\| save --append <path>`                                     | Append command output to a file as structured data                |
| `> /dev/null`                        | `\| ignore`                                                   | Discard command output                                            |
| `> /dev/null 2>&1`                   | `out+err>\| ignore` or `o+e>\| ignore`                        | Discard command output, including stderr                          |
| `command 2>&1 \| less`               | `command out+err>\| less` or `command o+e>\| less`            | Pipe stdout and stderr of an external command into less (NOTE: use [explore](explore.html) for paging output of internal commands) |
| `cmd1 \| tee log.txt \| cmd2`        | `cmd1 \| tee { save log.txt } \| cmd2`                        | Tee command output to a log file                                  |
| `command \| head -5`                 | `command \| first 5`                                          | Limit the output to the first 5 rows of an internal command (see also `last` and `skip`) |
| `cat <path>`                         | `open --raw <path>`                                           | Display the contents of the given file                            |
|                                      | `open <path>`                                                 | Read a file as structured data                                    |
| `cat <(<command1>) <(<command2>)`    | `[(command1), (command2)] \| str join`                        | Concatenate the outputs of command1 and command2                  |
| `cat <path> <(<command>)`            | `[(open --raw <path>), (command)] \| str join`                | Concatenate the contents of the given file and output of command  |
| `mv <source> <dest>`                 | `mv <source> <dest>`                                          | Move file to new location                                         |
| `for f in *.md; do echo $f; done`    | `ls *.md \| each { $in.name }`                                | Iterate over a list and return results                            |
| `for i in $(seq 1 10); do echo $i; done` | `for i in 1..10 { print $i }`                             | Iterate over a list and run a command on results                  |
| `cp <source> <dest>`                 | `cp <source> <dest>`                                          | Copy file to new location                                         |
| `cp -r <source> <dest>`              | `cp -r <source> <dest>`                                       | Copy directory to a new location, recursively                     |
| `rm <path>`                          | `rm <path>`                                                   | Remove the given file                                             |
|                                      | `rm -t <path>`                                                | Move the given file to the system trash                           |
| `rm -rf <path>`                      | `rm -r <path>`                                                | Recursively removes the given path                                |
| `date -d <date>`                     | `"<date>" \| into datetime -f <format>`                       | Parse a date ([format documentation](https://docs.rs/chrono/0.4.15/chrono/format/strftime/index.html)) |
| `date -d "tomorrow"`                 | `"tomorrow" \| date from-human`                               | Parse a human-readable date                                       |
|                                      | `date from-human --list`                                      | Show example phrases that `date from-human` understands           |
| `sed`                                | `str replace`                                                 | Find and replace a pattern in a string                            |
| `grep <pattern>`                     | `where $it =~ <substring>` or `find <substring>`              | Filter strings that contain the substring                         |
| `grep -i <pattern>`                  | `find -i <substring>`                                         | Filter strings that contain the substring, ignoring case          |
| `grep -o <regex>`                    | `find -o -r <regex>`                                          | Output only the matched text, one value per match                 |
| `grep -v <pattern>`                  | `find -v <substring>`                                         | Filter strings that don't contain the substring                   |
| `man <command>`                      | `help <command>`                                              | Get the help for a given command                                  |
|                                      | `help commands`                                               | List all available commands                                       |
|                                      | `help --find <string>`                                        | Search for match in all available commands                        |
| `command1 && command2`               | `command1; command2`                                          | Run a command, and if it's successful run a second                |
| `command1 \|\| command2`               | `try { command1 } catch { command2 }`                         | Run a command, and if it fails run a second                       |
| `stat $(which git)`                  | `stat ...(which git).path`                                    | Use command output as argument for other command                  |
| `echo /tmp/$RANDOM`                  | `$"/tmp/(random int)"`                                        | Use command output in a string                                    |
| `cargo b --jobs=$(nproc)`            | `cargo b $"--jobs=(sys cpu \| length)"`                       | Use command output in an option                                   |
| `echo $PATH`                         | `$env.PATH` (Non-Windows) or `$env.Path` (Windows)            | See the current path                                              |
| `echo $?`                            | `$env.LAST_EXIT_CODE`                                         | See the exit status of the last executed command                  |
| `set -o pipefail`                    | (default behavior)                                            | Fail a pipeline if any external command in it fails               |
| `<update ~/.bashrc>`                 | `vim $nu.config-path`                                         | Update PATH permanently                                           |
| `export PATH = $PATH:/usr/other/bin` | `$env.PATH = ($env.PATH \| append /usr/other/bin)`            | Update PATH temporarily                                           |
| `export`                             | `$env`                                                        | List the current environment variables                            |
| `<update ~/.bashrc>`                 | `vim $nu.config-path`                                         | Update environment variables permanently                          |
| `FOO=BAR ./bin`                      | `FOO=BAR ./bin`                                               | Update environment temporarily                                    |
| `export FOO=BAR`                     | `$env.FOO = "BAR"`                                            | Set environment variable for current session                      |
| `echo $FOO`                          | `$env.FOO`                                                    | Use environment variables                                         |
| `echo ${FOO:-fallback}`              | `$env.FOO? \| default "ABC"`                                  | Use a fallback in place of an unset variable                      |
| `unset FOO`                          | `hide-env FOO`                                                | Unset environment variable for current session                    |
| `alias s="git status -sb"`           | `alias s = git status -sb`                                    | Define an alias temporarily                                       |
| `type FOO`                           | `which FOO`                                                   | Display information about a command (builtin, alias, or executable) |
| `type -a FOO`                        | `which -a FOO`                                                | List the Nushell command and each executable in PATH with that name |
| `type -P FOO`                        | `which ^FOO`                                                  | Look up only the external program, skipping Nushell commands      |
| `compgen -c`                         | `which`                                                       | List every Nushell command and every executable in PATH           |
| `<update ~/.bashrc>`                 | `vim $nu.config-path`                                         | Add and edit alias permanently (for new shells)                   |
| `bash -c <commands>`                 | `nu -c <commands>`                                            | Run a pipeline of commands                                        |
| `bash <script file>`                 | `nu <script file>`                                            | Run a script file                                                 |
| `\`                                  | `( <command> )`                                               | A command can span multiple lines when wrapped with `(` and `)`   |
| `pwd` or `echo $PWD`                 | `pwd` or `$env.PWD`                                           | Display the current directory (`pwd` returns `$env.PWD`)          |
| `pwd -P`                             | `pwd -P` or `pwd --physical`                                  | Display the current directory with symbolic links resolved        |
| `read var`                           | `let var = input`                                             | Get input from the user                                           |
| `read -s secret`                     | `let secret = input -s`                                       | Get a secret value from the user without printing keystrokes      |

::: tip
In Nushell, `type` is the keyword that declares a [type alias](./custom_commands.md#type-aliases), so `type FOO` is a parse error rather than a command lookup. Use `which FOO` instead. If your system has an external `type` program (macOS has `/usr/bin/type`), run it as `^type FOO`.

[`which`](/commands/docs/which.md) returns a table with `command`, `path` and `type` columns. `path` is empty for a built-in command, and for a custom command or an alias it names the file that defines it. An alias also gets a `definition` column. Pass several names to look them up at once. A name that isn't found adds no row, so `which nosuch` returns an empty list.
:::

::: tip
Nushell rejects `&&`, `||`, `2>` and `2>&1` with a parse error that names the Nushell replacement. A lone `>` gets no error and writes no file. [But it's not Bash](./thinking_in_nu.md#but-it-s-not-bash) shows what it does instead.
:::

::: details More about find and date from-human
[`find`](/commands/docs/find.md) also searches tables. It keeps the rows where any cell matches, or only the cells in the columns you name with `--columns`. It wraps each match in ANSI color codes so that it stands out. Add `--no-highlight` (`-n`) to keep the values unchanged, for example before saving them. A number or file size used as the search term matches equal numbers and file sizes, not digits inside other numbers, so `[1 10 21] | find 1` returns only `1`.

With several search terms, `find` keeps the values that match any of them, so `[apple banana cherry date] | find an er` returns `banana` and `cherry`. `--regex` (`-r`) takes the pattern as its value, as in `find --regex 'an|er'`, and replaces the search terms, so passing both is an `Incompatible parameters` error. The same error comes from `--invert` (`-v`) together with `--only-matching` (`-o`), and from `--dotall` without `--regex`.

`find` splits a multi-line string into lines and returns the lines that match. With `--multiline` (`-m`), it searches the whole string as one value. `--multiline` doesn't take a byte stream, such as the output of an external command, so collect the output into a string first: `^cat notes.txt | collect | find -m 'a'`. In regex mode, `--dotall` (`-s`) lets `.` match a newline. `--rfind` (`-R`) highlights only the last match, and with `-o` it returns only the last match.

[`date from-human`](/commands/docs/date_from-human.md) understands phrases such as `Last Friday at 19:45`, `In 5 minutes and 30 seconds`, `10 hours and 5 minutes ago` and `Now`. `date from-human --list` shows more, with the date each one gives right now. Piping in a list converts each string. A phrase it can't parse fails with "Cannot parse as humanized date", and running it with no input fails with "Pipeline empty".
:::

## History Substitutions and Default Keybindings:

| Bash                                 | Nu                                                            | Task                                                              |
| ------------------------------------ | ------------------------------------------------------------- | ----------------------------------------------------------------- |
| `!!`                                 | `!!`                                                          | Insert last command-line from history                              |
| `!$`                                 | `!$`                                                          | Insert last spatially separated token from history                |
| `!<n>` (e.g., `!5`)                  | `!<n>`                                                        | Insert \<n\>th command from the beginning of the history          |
|                                      |                                                               | Tip: `history \| enumerate \| last 10` to show recent positions   |
| `!<-n>` (e.g., `!-5`)                | `!<-n>`                                                       | Insert \<n\>th command from the end of the history                |
| `!<string>` (e.g., `!ls`)            | `!<string>`                                                   | Insert the most recent history item that begins with the string   |
| <kbd>Ctrl/Cmd</kbd>+<kbd>R</kbd>     | <kbd>Ctrl/Cmd</kbd>+<kbd>R</kbd>                              | Reverse history search                                            |
| (Emacs Mode) <kbd>Ctrl</kbd>+<kbd>X</kbd><kbd>Ctrl</kbd>+<kbd>E</kbd> | <kbd>Ctrl/Cmd</kbd>+<kbd>O</kbd> | Edit the command-line in the editor defined by `$env.EDITOR`   |
| (Vi Command Mode) <kbd>V</kbd>       | <kbd>Ctrl/Cmd</kbd>+<kbd>O</kbd>                              | Edit the command-line in the editor defined by `$env.EDITOR`       |

Most common Emacs-mode and Vi-mode keybindings are also available. See the [Reedline Chapter](line_editor.html#setting-the-editing-mode).

::: tip
In Bash, history substitution occurs immediately after pressing <kbd>Enter</kbd> 
to execute the command-line. Nushell, however, *inserts* the substitution into
the command-line after pressing <kbd>Enter</kbd>. This allows you to confirm
the substitution and, if needed, make additional edits before execution.

With [SQLite history](./config_reference.md#history-file-format), `!<string>` first looks for the
most recent matching command that was run in the current directory. Only when there is none does it
search the rest of the history. The plain-text history file doesn't record directories, so with it
`!<string>` always searches the whole history.

This behavior extends to "Edit command-line in Editor" as well. While Bash immediately
executes the command after exiting the editor, Nushell (like other, more modern shells
such as Fish and Zsh) inserts the editor contents into the command-line, allowing you
to review and make changes before committing it to execution.
:::