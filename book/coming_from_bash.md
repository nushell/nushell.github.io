# Coming from Bash

Note: this table assumes Nu 0.14.1 or later.

| Bash        | Nu           | Task  |
| ------------- | ------------- | ----- |
| `ls`     | `ls` | Lists the files in the current directory |
| `ls <dir>`    | `ls <dir>`| Lists the files in the given directory |
| `ls pattern*` | `ls pattern*` | Lists files that match a given pattern |
| `ls -la` | `ls --full` or `ls -f` | List files with all available information |
| `ls -d */` | `ls | where type == Dir` | List directories |
| `find . -name *.rs` | `ls **/*.rs` | Find recursively all files that match a given pattern |
| `cd <directory>` | `cd <directory>` | Change to the given directory |
| `cd` | `cd` | Change to the home directory |
| `mkdir <path>` | `mkdir <path>` | Creates the given path |
| `mkdir -p <path>` | `mkdir <path>` | Creates the given path, creating parents as necessary |
| `touch test.txt` | `touch test.txt` | Create a file |
| `> <path>` | `| save --raw <path>` | Save string into a file |
| `cat <path>` | `open --raw <path>` | Display the contents of the given file |
| | `open <path>` | Read a file as structured data |
| `mv <source> <dest>` | `mv <source> <dest>` | Move file to new location |
| `cp <source> <dest>` | `cp <source> <dest>` | Copy file to new location |
| `cp -r <source> <dest>` | `cp -r <source> <dest>` | Copy directory to a new location, recursively |
| `rm <path>` | `rm <path>` | Remove the given file |
| | `rm -t <path>` | Move the given file to the system trash |
| `rm -rf <path>` | `rm -r <path>` | Recursively removes the given path |
| `chmod` | `<not yet possible>` | Changes the file attributes |
| `date -d <date>` | `echo <date> | str to-datetime -f <format>` | Parse a date ([format documentation](https://docs.rs/chrono/0.4.15/chrono/format/strftime/index.html)) |
| `man <command>` | `help <command>` | Get the help for a given command |
|  | `help commands` | List all available commands |
| `command1 && command2` | `command1; command2` | Run a command, and if it's successful run a second |
| `stat $(which git)` | `stat $(which git).path` | Use command output as argument for other command |
| `echo $PATH` | `echo $nu.path` | See the current path |
| `<update ~/.bashrc>` | `config set path [<dir1> <dir2> ...]` | Update PATH permanently |
| `export PATH = $PATH:/usr/other/bin` | `<not yet possible>` | Update PATH temporarily |
| `export` | `echo $nu.env` | List the current environment variables |
| `<update ~/.bashrc>` | `echo $nu.env | insert var value | config set_into env` | Update environment variables permanently |
| `FOO=BAR ./bin` | `FOO=BAR ./bin` | Update environment temporarily |
| `alias s="git status -sb"` | `alias s [] { git status -sb }` | Define an alias temporarily |
| `<update ~/.bashrc>` | `alias --save myecho [msg] { echo Hello $msg }` | Define an alias for all sessions (persist it in startup config) |
| `<update ~/.bashrc>` | `<update nu/config.toml>` | Add and edit alias permanently (for new shells), find path for the file with `config path` |
| `bash -c <commands>` | `nu -c <commands>` | Run a pipeline of commands (requires 0.9.1 or later) |
| `bash <script file>` | `nu <script file>` | Run a script file (requires 0.9.1 or later) |
| `\` | `<not yet possible>` | Line continuation is not yet supported. |
