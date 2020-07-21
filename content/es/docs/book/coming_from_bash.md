---
layout: content
title: Llegando desde Bash
prev: Plugins
next: Mapa nushell de otras shells y lenguajes DSLs
link_prev: /es/plugins.html
link_next: /en/mapa_nushell.html
---

Nota: Esta tabla asume Nushell 0.14.1 or posterior.

| Bash        | Nu           | Task  |
| ------------- | ------------- | ----- |
| `ls`     | `ls` | Lists the files in the current directory |
| `ls <dir>`    | `ls <dir>`| Lists the files in the given directory |
| `ls pattern*` | `ls pattern*` | Lists files that match a given pattern |
| `ls -la` | `ls --full` or `ls -f` | List files with all available information |
| `ls -d */` | `ls | where type == Dir` | List directories |
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
| `man <command>` | `help <command>` | Get the help for a given command |
|  | `help commands` | List all available commands |
| `command1 && command2` | `command1; command2` | Run a command, and if it's successful run a second |
| `echo $PATH` | `echo $nu.path` | See the current path |
| `<update ~/.bashrc>` | `config --set [path [<dir1> <dir2> ...]]` | Update PATH permanently |
| `export PATH = $PATH:/usr/other/bin` | `<not yet possible>` | Update PATH temporarily |
| `export` | `echo $nu.env` | List the current environment variables |
| `<update ~/.bashrc>` | `echo $nu.env | insert var value | config --set_into env` | Update environment variables permanently |
| `FOO=BAR ./bin` | `FOO=BAR ./bin` | Update environment temporarily |
| `alias s="git status -sb"` | `alias s [] { git status -sb }` | Define an alias temporarily |
| `<update ~/.bashrc>` | `config --set [startup ["alias myecho [msg] { echo Hello $msg }"]]` | Add a first alias permanently (for new shells) |
| `<update ~/.bashrc>` | `config --get startup | append "alias s [] { git status -sb }" | config --set_into startup` | Add an additional alias permanently (for new shells) |
| `<update ~/.bashrc>` | `<update nu/config.toml>` | Add and edit alias permanently (for new shells), find path for the file with `config --path` |
| `bash -c <commands>` | `nu -c <commands>` | Run a pipeline of commands (requires 0.9.1 or later) |
| `bash <script file>` | `nu <script file>` | Run a script file (requires 0.9.1 or later) |
| `\` | `<not yet possible>` | Line continuation is not yet supported. |
