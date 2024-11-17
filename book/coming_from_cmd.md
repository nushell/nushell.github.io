# Coming from CMD.EXE

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
| `IF EXIST <filename> <command>`      | `if (<filename> \| path exists) { <command> }`                                      | Run a command if the file exists                                      |
| `IF DEFINED <variable> <command>`    | `if (scope variables \| any {\|var\| $var.name == '<variable>'}) { <command> }`     | Run a command if the variable is defined                              |
| `MD` or `MKDIR`                      | `mkdir`                                                                             | Create directories                                                    |
| `MKLINK`                             |                                                                                     | Create symbolic links                                                 |
| `MOVE`                               | `mv`                                                                                | Move files                                                            |
| `PATH`                               | `$env.Path`                                                                         | Display the current path variable                                     |
| `PATH <path>;%PATH%`                 | `$env.Path = ($env.Path \| append <path>`)                                          | Edit the path variable                                                |
| `PATH %PATH%;<path>`                 | `$env.Path = ($env.Path \| prepend <path>`)                                         | Edit the path variable                                                |
| `PAUSE`                              | `input "Press any key to continue . . ."`                                           | Pause script execution                                                |
| `PROMPT <template>`                  | `$env.PROMPT_COMMAND = { <command> }`                                               | Change the terminal prompt                                            |
| `PUSHD <path>`/`POPD`                | `enter <path>`/`dexit`                                                              | Change working directory temporarily                                  |
| `REM`                                | `#`                                                                                 | Comments                                                              |
| `REN` or `RENAME`                    | `mv`                                                                                | Rename files                                                          |
| `RD` or `RMDIR`                      | `rm`                                                                                | Remove directory                                                      |
| `SET <var>=<string>`                 | `$env.<var> = <string>`                                                             | Set environment variables                                             |
| `SETLOCAL`                           | (default behavior)                                                                  | Localize environment changes to a script                              |
| `START <path>`                       | Partially covered by `start <path>`                                                 | Open the path in the system-configured default application            |
| `START <internal command>`           |                                                                                     | Start a separate window to run a specified internal command           |
| `START <batch file>`                 |                                                                                     | Start a separate window to run a specified batch file                 |
| `TIME /T`                            | `date now \| format date "%H:%M:%S"`                                                | Get the current time                                                  |
| `TIME`                               |                                                                                     | Set the current time                                                  |
| `TITLE`                              |                                                                                     | Set the cmd.exe window name                                           |
| `TYPE`                               | `open --raw`                                                                        | Display the contents of a text file                                   |
|                                      | `open`                                                                              | Open a file as structured data                                        |
| `VER`                                |                                                                                     | Display the OS version                                                |
| `VERIFY`                             |                                                                                     | Verify that file writes happen                                        |
| `VOL`                                |                                                                                     | Show drive information                                                |

## Forwarded CMD.EXE commands

Nu accepts and runs *some* of CMD.EXE's internal commands through `cmd.exe`.

The internal commands are: `ASSOC`, `CLS`, `ECHO`, `FTYPE`, `MKLINK`, `PAUSE`, `START`, `VER`, `VOL`

These internal commands take precedence over external commands.

For example, with a `ver.bat` file in the current working directory, executing `^ver` executes CMD.EXE's internal `VER` command, *NOT* the `ver.bat` file.

Executing `./ver` or `ver.bat` *will* execute the local bat file though.

Note that Nushell has its own [`start` command](/commands/docs/start.md) which takes precedence.
You can call the CMD.EXE's internal `START` command with the external command syntax `^start`.
