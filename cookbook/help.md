---
title: Help
---

# Help

A good way to become familiar with all that nu has to offer is by utilizing the `help` command.

### How to see all supported commands:

```shell
> help commands | where is_custom == false | first 10 | drop column
```

Output

```
───┬───────────────┬────────────┬───────────┬───────────┬────────────────────────────────────────────────────────────────
 # │     name      │  category  │ is_plugin │ is_custom │                             usage
───┼───────────────┼────────────┼───────────┼───────────┼────────────────────────────────────────────────────────────────
 0 │ alias         │ core       │ false     │ false     │ Alias a command (with optional flags) to a new name
 1 │ all           │ filters    │ false     │ false     │ Test if every element of the input matches a predicate.
 2 │ ansi          │ platform   │ false     │ false     │ Output ANSI codes to change color.
 3 │ ansi gradient │ platform   │ false     │ false     │ draw text with a provided start and end code making a gradient
 4 │ ansi strip    │ platform   │ false     │ false     │ strip ansi escape sequences from string
 5 │ any           │ filters    │ false     │ false     │ Tests if any element of the input matches a predicate.
 6 │ append        │ filters    │ false     │ false     │ Append a row to the table.
 7 │ benchmark     │ system     │ false     │ false     │ Time the running time of a block
 8 │ build-string  │ strings    │ false     │ false     │ Create a string from the arguments.
 9 │ cal           │ generators │ false     │ false     │ Display a calendar.
───┴───────────────┴────────────┴───────────┴───────────┴────────────────────────────────────────────────────────────────
```

---

### Specific information on a command

To find more specific information on a command, use `help <COMMAND>`.

```shell
> help fetch
```

Output

```
Fetch the contents from a URL (HTTP GET operation).

Usage:
  > fetch {flags} <URL>

Flags:
  -h, --help
      Display this help message
  -u, --user <Any>
      the username when authenticating
  -p, --password <Any>
      the password when authenticating
  -t, --timeout <Int>
      timeout period in seconds
  -H, --headers <Any>
      custom headers you want to add
  -r, --raw
      fetch contents as text rather than a table

Parameters:
  URL: the URL to fetch the contents from

Examples:
  Fetch content from url.com
  > fetch url.com

  Fetch content from url.com, with username and password
  > fetch -u myuser -p mypass url.com

  Fetch content from url.com, with custom header
  > fetch -H [my-header-key my-header-value] url.com
```

---

### Specific information on a command subcommand

To find more specific information on a command subcommand, use `help <COMMAND> <SUBCOMMAND>`.

```shell
> help str reverse
```

Output

```
outputs the reversals of the strings in the pipeline

Usage:
  > str reverse ...(rest)

Flags:
  -h, --help
      Display this help message

Parameters:
  ...rest: optionally reverse text by column paths

Examples:
  Return the reversals of multiple strings
  > 'Nushell' | str reverse
```
