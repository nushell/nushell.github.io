# Escaping to the system

Nu provides a set of commands that you can use across different OSes ("internal" commands), and having this consistency is helpful. Sometimes, though, you want to run an external command that has the same name as an internal Nu command. To run the external `ls` or `date` command, for example, you use the caret (^) command. Escaping with the caret prefix calls the command that's in the user's PATH (e.g. `/bin/ls` instead of Nu's internal `ls` command).

Nu internal command:

```
> ls
```

Escape to external command:

```
> ^ls
```

