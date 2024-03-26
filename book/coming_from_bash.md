# Coming from Bash

If you're coming from `Git Bash` on Windows, then the external commands you're used to (bash, grep, etc) will not be available in `nu` by default (unless you had explicitly made them available in the Windows Path environment variable).
To make these commands available in `nu` as well, add the following line to your `config.nu` with either `append` or `prepend`.

```
$env.Path = ($env.Path | prepend 'C:\Program Files\Git\usr\bin')
```

Note: this table assumes Nu 0.60.0 or later.

| Bash                                 | Nu                                                            | Task                                                              |
| ------------------------------------ | ------------------------------------------------------------- | ----------------------------------------------------------------- |
| `ls`                                 | `ls`                                                          | Lists the files in the current directory                          |
| `ls <dir>`                           | `ls <dir>`                                                    | Lists the files in the given directory                            |
| `ls pattern*`                        | `ls pattern*`                                                 | Lists files that match a given pattern                            |
| `ls -la`                             | `ls --long --all` or `ls -la`                                 | List files with all available information, including hidden files |
| `ls -d */`                           | `ls \| where type == dir`                                     | List directories                                                  |
| `find . -name *.rs`                  | `ls **/*.rs`                                                  | Find recursively all files that match a given pattern             |
| `find . -name Makefile \| xargs vim` | `ls **/Makefile \| get name \| vim $in`                       | Pass values as command parameters                                 |
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
| `command 2>&1 \| less`               | `command out+err>\| less` or `command o+e>\| less`            | Pipe stdout and stderr of a command into less                     |
| `cmd1 \| tee log.txt \| cmd2`        | `cmd1 \| tee { save log.txt } \| cmd2`                        | Tee command output to a log file                                  |
| `cat <path>`                         | `open --raw <path>`                                           | Display the contents of the given file                            |
|                                      | `open <path>`                                                 | Read a file as structured data                                    |
| `mv <source> <dest>`                 | `mv <source> <dest>`                                          | Move file to new location                                         |
| `cp <source> <dest>`                 | `cp <source> <dest>`                                          | Copy file to new location                                         |
| `cp -r <source> <dest>`              | `cp -r <source> <dest>`                                       | Copy directory to a new location, recursively                     |
| `rm <path>`                          | `rm <path>`                                                   | Remove the given file                                             |
|                                      | `rm -t <path>`                                                | Move the given file to the system trash                           |
| `rm -rf <path>`                      | `rm -r <path>`                                                | Recursively removes the given path                                |
| `date -d <date>`                     | `"<date>" \| into datetime -f <format>`                       | Parse a date ([format documentation](https://docs.rs/chrono/0.4.15/chrono/format/strftime/index.html)) |
| `sed`                                | `str replace`                                                 | Find and replace a pattern in a string                            |
| `grep <pattern>`                     | `where $it =~ <substring>` or `find <substring>`              | Filter strings that contain the substring                         |
| `man <command>`                      | `help <command>`                                              | Get the help for a given command                                  |
|                                      | `help commands`                                               | List all available commands                                       |
|                                      | `help --find <string>`                                        | Search for match in all available commands                        |
| `command1 && command2`               | `command1; command2`                                          | Run a command, and if it's successful run a second                |
| `stat $(which git)`                  | `stat (which git).path`                                       | Use command output as argument for other command                  |
| `echo /tmp/$RANDOM`                  | `$"/tmp/(random integer)"`                                    | Use command output in a string                                    |
| `cargo b --jobs=$(nproc)`            | `cargo b $"--jobs=(sys \| get cpu \| length)"`                | Use command output in an option                                   |
| `echo $PATH`                         | `$env.PATH` (Non-Windows) or `$env.Path` (Windows)            | See the current path                                              |
| `<update ~/.bashrc>`                 | `vim $nu.config-path`                                         | Update PATH permanently                                           |
| `export PATH = $PATH:/usr/other/bin` | `$env.PATH = ($env.PATH \| append /usr/other/bin)`            | Update PATH temporarily                                           |
| `export`                             | `$env`                                                        | List the current environment variables                            |
| `<update ~/.bashrc>`                 | `vim $nu.config-path`                                         | Update environment variables permanently                          |
| `FOO=BAR ./bin`                      | `FOO=BAR ./bin`                                               | Update environment temporarily                                    |
| `export FOO=BAR`                     | `$env.FOO = BAR`                                              | Set environment variable for current session                      |
| `echo $FOO`                          | `$env.FOO`                                                    | Use environment variables                                         |
| `echo ${FOO:-fallback}`              | `$env.FOO? \| default "ABC"`                                  | Use a fallback in place of an unset variable                      |
| `unset FOO`                          | `hide-env FOO`                                                | Unset environment variable for current session                    |
| `alias s="git status -sb"`           | `alias s = git status -sb`                                    | Define an alias temporarily                                       |
| `type FOO`                           | `which FOO`                                                   | Display information about a command (builtin, alias, or executable) |
| `<update ~/.bashrc>`                 | `vim $nu.config-path`                                         | Add and edit alias permanently (for new shells)                   |
| `bash -c <commands>`                 | `nu -c <commands>`                                            | Run a pipeline of commands                                        |
| `bash <script file>`                 | `nu <script file>`                                            | Run a script file                                                 |
| `\`                                  | `( <command> )`                                               | A command can span multiple lines when wrapped with `(` and `)`   |
| `pwd`                                | `$env.PWD`                                                    | Display the current directory                                     |
| `read var`                           | `let var = input`                                             | Get input from the user                                           |

