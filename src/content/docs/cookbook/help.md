---
title: Help
---

The `help` command is a good way to become familiar with all that Nu has to offer.

### How to see all supported commands:

```nu
help commands
```

---

### Specific information on a command

To find more specific information on a command, use `help <COMMAND>`. This works for regular commands (i.e. `http`) and subcommands (i.e. `http get`):

```nu
help http get
```

Output:

```nu
Fetch the contents from a URL.

Performs HTTP GET operation.

Search terms: network, fetch, pull, request, download, curl, wget

Usage:
  > http get {flags} <URL>

Flags:
  -h, --help - Display the help message for this command
  -u, --user <Any> - the username when authenticating
  -p, --password <Any> - the password when authenticating
  -m, --max-time <Int> - timeout period in seconds
  -H, --headers <Any> - custom headers you want to add
  -r, --raw - fetch contents as text rather than a table
  -k, --insecure - allow insecure server connections when using SSL
  -f, --full - returns the full response instead of only the body
  -e, --allow-errors - do not fail if the server returns an error code
  -R, --redirect-mode <String> - What to do when encountering redirects. Default: 'follow'. Valid options: 'follow' ('f'), 'manual' ('m'), 'error' ('e').

Parameters:
  URL <string>: The URL to fetch the contents from.

Input/output types:
  ╭───┬─────────┬────────╮
  │ # │  input  │ output │
  ├───┼─────────┼────────┤
  │ 0 │ nothing │ any    │
  ╰───┴─────────┴────────╯

Examples:
  Get content from example.com
  > http get https://www.example.com

  Get content from example.com, with username and password
  > http get --user myuser --password mypass https://www.example.com

  Get content from example.com, with custom header
  > http get --headers [my-header-key my-header-value] https://www.example.com

  Get content from example.com, with custom headers
  > http get --headers [my-header-key-A my-header-value-A my-header-key-B my-header-value-B] https://www.example.com
```
