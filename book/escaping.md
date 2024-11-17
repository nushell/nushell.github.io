# Escaping to the System

Nu provides a set of commands that you can use across different OSes ("internal" commands), and having this consistency is helpful. Sometimes, though, you want to run an external command that has the same name as an internal Nu command. To run the external [`ls`](/commands/docs/ls.md) or [`date`](/commands/docs/date.md) command, for example, you use the caret (^) command. Escaping with the caret prefix calls the command that's in the user's PATH (e.g. `/bin/ls` instead of Nu's internal [`ls`](/commands/docs/ls.md) command).

Nu internal command:

```nu
> ls
```

Escape to external command:

```nu
> ^ls
```

## Windows Note

When running an external command on Windows,
Nushell forwards some CMD.EXE internal commands to cmd instead of attempting to run external commands.
[Coming from CMD.EXE](coming_from_cmd.md) contains a list of these commands and describes the behavior in more detail.
