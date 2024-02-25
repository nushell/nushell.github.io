---
title: Coming from CMD.EXE
---

This table was last updated for Nu 0.67.0.

| CMD.EXE                              | Nu                                                                                  | Task                                                                  |
| ------------------------------------ | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `ASSOC`                              |                                                                                     | Displays or modifies file extension associations                      |
| `BREAK`                              |                                                                                     | Trigger debugger breakpoint                                           |
| `CALL <filename.bat>`                | `<filename.bat>`                                                                    | Run a batch program                                                   |
|                                      | `nu <filename>`                                                                     | Run a nu script in a fresh context                                    |
|                                      | `source <filename>`                                                                 | Run a nu script in this context                                       |
|                                      | `use <filename>`                                                                    | Run a nu script as a module                                           |
| `CD` or `CHDIR`                      | `$env.PWD`                                                                          | Get the present working directory                                     |
| `CD <directory>`                     | `cd <directory>`                                                                    | Change the current directory                                          |
| `CD /D <drive:directory>`            | `cd <drive:directory>`                                                              | Change the current directory                                          |
| `CLS`                                | `clear`                                                                             | Clear the screen                                                      |
| `COLOR`                              |                                                                                     | Set the console default foreground/background colors                  |
|                                      | `ansi {flags} (code)`                                                               | Output ANSI codes to change color                                     |
| `COPY <source> <destination>`        | `cp <source> <destination>`                                                         | Copy files                                                            |
| `COPY <file1>+<file2> <destination>` | `[<file1>, <file2>] \| each { open --raw } \| str join \| save --raw <destination>` | Append multiple files into one                                        |
| `DATE /T`                            | `date now`                                                                          | Get the current date                                                  |
| `DATE`                               |                                                                                     | Set the date                                                          |
| `DEL <file>` or `ERASE <file>`       | `rm <file>`                                                                         | Delete files                                                          |
| `DIR`                                | `ls`                                                                                | List files in the current directory                                   |
| `ECHO <message>`                     | `print <message>`                                                                   | Print the given values to stdout                                      |
| `ECHO ON`                            |                                                                                     | Echo executed commands to stdout                                      |
| `ENDLOCAL`                           | `export-env`                                                                        | Change env in the caller                                              |
| `EXIT`                               | `exit`                                                                              | Close the prompt or script                                            |
| `FOR %<var> IN (<set>) DO <command>` | `for $<var> in <set> { <command> }`                                                 | Run a command for each item in a set                                  |
| `FTYPE`                              |                                                                                     | Displays or modifies file types used in file extension associations   |
| `GOTO`                               |                                                                                     | Jump to a label                                                       |
| `IF ERRORLEVEL <number> <command>`   | `if $env.LAST_EXIT_CODE >= <number> { <command> }`                                  | Run a command if the last command returned an error code >= specified |
| `IF <string> EQU <string> <command>` | `if <string> == <string> { <command> }`                                             | Run a command if strings match                                        |
| `IF EXIST <filename> <command>`      |                                                                                     | Run a command if the file exists                                      |
| `IF DEFINED <variable> <command>`    |                                                                                     | Run a command if the variable is defined                              |
| `MD` or `MKDIR`                      | `mkdir`                                                                             | Create directories                                                    |
| `MKLINK`                             |                                                                                     | Create symbolic links                                                 |
| `MOVE`                               | `mv`                                                                                | Move files                                                            |
| `PATH`                               | `$env.Path`                                                                         | Display the current path variable                                     |
| `PATH <path>;%PATH%`                 | `$env.Path = ($env.Path \| prepend <path>`)                                         | Edit the path variable                                                |
| `PATH %PATH%;<path>`                 | `$env.Path = ($env.Path \| prepend <path>`)                                         | Edit the path variable                                                |
| `PAUSE`                              | `input "Press any key to continue . . ."`                                           | Pause script execution                                                |
| `PROMPT <template>`                  | `$env.PROMPT_COMMAND = { <command> }`                                               | Change the terminal prompt                                            |
| `PUSHD <path>`/`POPD`                | `enter <path>`/`exit`                                                               | Change working directory temporarily                                  |
| `REM`                                | `#`                                                                                 | Comments                                                              |
| `REN` or `RENAME`                    | `mv`                                                                                | Rename files                                                          |
| `RD` or `RMDIR`                      | `rm`                                                                                | Remove directory                                                      |
| `SET <var>=<string>`                 | `$env.<var> = <string>`                                                             | Set environment variables                                             |
| `SETLOCAL`                           | (default behavior)                                                                  | Localize environment changes to a script                              |
| `START <path>`                       | `explorer <path>`                                                                   | Open a file as if double-clicked in File Explorer                     |
| `TIME /T`                            | `date now \| format date "%H:%M:%S"`                                                | Get the current time                                                  |
| `TIME`                               |                                                                                     | Set the current time                                                  |
| `TITLE`                              |                                                                                     | Set the cmd.exe window name                                           |
| `TYPE`                               | `open --raw`                                                                        | Display the contents of a text file                                   |
|                                      | `open`                                                                              | Open a file as structured data                                        |
| `VER`                                |                                                                                     | Display the OS version                                                |
| `VERIFY`                             |                                                                                     | Verify that file writes happen                                        |
| `VOL`                                |                                                                                     | Show drive information                                                |

Before Nu version 0.67, Nu [used to](https://www.nushell.sh/blog/2022-08-16-nushell-0_67#windows-cmd-exe-changes-rgwood) use CMD.EXE to launch external commands, which meant that the above builtins could be run as an `^external` command. As of version 0.67, however, Nu no longer uses CMD.EXE to launch externals, meaning the above builtins cannot be run from within Nu, except for `ASSOC`, `CLS`, `ECHO`, `FTYPE`, `MKLINK`, `PAUSE`, `START`, `VER`, and `VOL`, which are explicitly allowed to be interpreted by CMD if no executable by that name exists.
