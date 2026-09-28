---
title: Help
---

# Help

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
# => Fetch the contents from a URL.
# =>
# => Performs HTTP GET operation.
# =>
# => Search terms: network, fetch, pull, request, download, curl, wget
# =>
# => Usage:
# =>   > http get {flags} <URL>
# =>
# => Flags:
# =>   -h, --help: Display the help message for this command
# =>   -u, --user <any>: The username when authenticating.
# =>   -p, --password <any>: The password when authenticating.
# =>   -m, --max-time <duration>: Max duration before timeout occurs.
# =>   -H, --headers <any>: Custom headers you want to add.
# =>   -r, --raw: Fetch contents as text rather than a table.
# =>   -k, --insecure: Allow insecure server connections when using SSL.
# =>   -f, --full: Returns the full response instead of only the body.
# =>   -e, --allow-errors: Do not fail if the server returns an error code.
# =>   --pool: Using a global pool as a client.
# =>   -R, --redirect-mode <string>: What to do when encountering redirects. Default: 'follow'. Valid options: 'follow' ('f'), 'manual' ('m'), 'error' ('e').
# =>   -U, --unix-socket <path>: Connect to the specified Unix socket instead of using TCP.
# =>
# => Command Type:
# =>   > built-in
# =>
# => Parameters:
# =>   URL <string>: The URL to fetch the contents from.
# =>
# => Input/output types:
# =>   ╭───┬─────────┬────────╮
# =>   │ # │  input  │ output │
# =>   ├───┼─────────┼────────┤
# =>   │ 0 │ nothing │ any    │
# =>   ╰───┴─────────┴────────╯
# =>
# => Examples:
# =>   Get content from example.com.
# =>   > http get https://www.example.com
# =>
# =>   Get content from example.com, with username and password.
# =>   > http get --user myuser --password mypass https://www.example.com
# =>
# =>   Get content from example.com, with custom header using a record.
# =>   > http get --headers {my-header-key: my-header-value} https://www.example.com
# =>
# =>   Get content from example.com, with custom headers using a list.
# =>   > http get --headers [my-header-key-A my-header-value-A my-header-key-B my-header-value-B] https://www.example.com
# =>
# =>   Get the response status code.
# =>   > http get https://www.example.com | metadata | get http_response.status
# =>
# =>   Check response status while streaming.
# =>   > http get --allow-errors https://example.com/file | metadata access {|m| if $m.http_response.status != 200 { error make {msg: "failed"} } else { } } | lines
# =>
# =>   Get from Docker daemon via Unix socket.
# =>   > http get --unix-socket /var/run/docker.sock http://localhost/containers/json
```

### Custom help command
If you want to change the `help` output, you can create your own custom command named `help` and it will also be used for all `--help` invocations. An example of this is in the standard library.
```nu
use std/help
```
