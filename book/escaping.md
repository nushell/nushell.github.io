# Escaping to the system

Nu provides a set of commands that you can use across different OSes ("internal" commands), and having this consistency is helpful. Sometimes, though, you want to run an external command that has the same name as an internal Nu command. To run the external `ls` or `date` command, for example, you use the caret (^) command. Escaping with the caret prefix calls the command that's in the user's PATH (e.g. `/bin/ls` instead of Nu's internal [`ls`](commands/ls.md) command).

Nu internal command:

```
> ls
```

Escape to external command:

```
> ^ls
```

## Windows note

When running an external command on Windows, nushell [used to](https://www.nushell.sh/blog/2022-08-16-nushell-0_67.html#windows-cmd-exe-changes-rgwood) use [Cmd.exe](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/cmd) to run the command, as a number of common commands on Windows are actually shell builtins and not available as separate executables. [Coming from CMD.EXE](coming_from_cmd.md) contains a list of these commands and how to map them to nushell native concepts.
