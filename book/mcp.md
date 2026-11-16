# MCP Server

The [Model Context Protocol](https://modelcontextprotocol.io) (MCP) is a standard way for AI agents and other LLM-based tools to call tools that run on your machine. Nushell has a built-in MCP server. Started with `nu --mcp`, it lets an MCP client look up Nushell commands and run Nushell code, and because Nushell returns structured data, the client gets tables and records back instead of text it has to parse.

::: warning
The server's `evaluate` tool runs any Nushell code it is given, including external commands, with your user's permissions. Only connect clients you trust. The HTTP transport has no authentication, so anyone who can reach its port can run commands as you.
:::

## Starting the Server

The MCP server is part of the default build (the `mcp` [Cargo feature](./installation.md)). Run `nu --mcp` to start it on the standard input and output streams, which is how most MCP clients launch a local server. Clients usually take a configuration like this one; see your client's documentation for where it goes:

```json
{
  "mcpServers": {
    "nushell": {
      "command": "nu",
      "args": ["--mcp"]
    }
  }
}
```

The server loads your `env.nu` and `config.nu` like an interactive session does, so your custom commands, aliases, and environment are available to the client. Add `-n` (`--no-config-file`) to the arguments to start from the defaults instead. While the configuration files are evaluated, [`$nu.is-mcp`](./special_variables.md#nu) is `true`, so they can set things up differently for the server:

```nu
if $nu.is-mcp {
    $env.NU_MCP_OUTPUT_LIMIT = 50kb
}
```

The session is not interactive (`$nu.is-interactive` is `false`):

- External commands get no standard input, so a command that waits for input doesn't hang. On Linux, macOS, and the BSDs, the server also detaches from the terminal, so programs such as `ssh` or `sudo` that ask for a password on the terminal fail right away instead of waiting.
- [`print`](/commands/docs/print.md) writes to stderr, so it doesn't interfere with the protocol messages on stdout.
- Output is not colored.

The server writes log lines to stderr at debug level and above. They include every request it receives and every response it sends, so the log holds the code a client ran and that code's output. An MCP client may save a server's stderr in a log file or show it in a debug panel.

## Tools

The server offers three tools. It has no MCP resources or prompts.

| Tool            | Argument | What it does                                                                                                                       |
| --------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `list_commands` | `find`   | Lists the available commands with their signatures and descriptions. `find` narrows the list by name, description, or search term. |
| `command_help`  | `name`   | Shows the help for one command. The name is the one you call it by, so an alias or a command imported from a module works too.     |
| `evaluate`      | `input`  | Runs Nushell code and returns the result.                                                                                          |

`list_commands` and `command_help` return plain text. `list_commands` writes one `<call signature> - <description>` line per command. Without `find`, it lists every command in scope, which is several hundred lines. With `find`, it keeps the commands whose name, description, or search terms contain that text as a plain substring, ignoring case. If nothing matches, the tool returns the error `No matching commands found`.

`command_help` shows a command's usage line, description, extra details, search terms, flags, and positional parameters. It leaves out the input and output types and the examples, which `evaluate` can get with `help <name>`. It knows the commands defined in the session, including custom commands from earlier `evaluate` calls, but not external programs. An unknown name returns the error ``command `<name>` not found``.

`evaluate` returns a NUON record with the directory the code ran in (`cwd`), its index in `$history` (see below), and the time it ran. The result itself is in `output`:

```nu
{cwd:"/home/me/project",history_index:1,timestamp:2026-10-16T14:03:42.606465+00:00,output:43}
```

The response carries the same record as JSON in its `structuredContent` field, for clients that read structured tool results. Code that returns nothing, such as an assignment, gets `output: []`.

An external command's output comes back as one string, with its stdout first and its stderr after it, separated by a newline when both have text. A non-zero exit code is not an error. Pipe the command into [`complete`](/commands/docs/complete.md) to get stdout, stderr, and the exit code as separate fields.

When the code fails, the response is marked as an error, and its content is a NUON record with the error's `code`, `msg`, and `labels`:

```nu
{code:"nu::shell::division_by_zero",msg:"Division by zero.",labels:[[text,span,line,column];["division by zero",/,1,3]]}
```

Each label has its message (`text`), the source code it points at (`span`), and the line and column where that code starts, counting from 1. Some errors also have `severity`, `help`, and `url` fields. A failed call gets no `history_index`, and nothing is stored in `$history` for it.

Calls to `evaluate` run one at a time. A call that arrives while another is running waits until that one finishes or [becomes a background job](#long-running-calls). `list_commands` and `command_help` don't wait.

### Server Instructions

When a client connects, the server identifies itself as `nushell-mcp-server`, with the title `Nushell MCP Server` and the version of `nu`. It also sends the client instructions, which most clients add to the model's context. They tell the model to:

- run a command once, with no `first` or `last` in the pipeline, and slice the saved result in `$history` by its `history_index`
- read the `evaluate` response as a record of `cwd`, `history_index`, `timestamp`, and `output`, where a result over the size limit has `note` in place of `output`
- change the three environment variables described below when the defaults don't fit
- prefer Nushell's own commands, which return structured data, to `to json` and text parsing
- find commands with `list_commands`, and read a command's usage, flags, and parameters with `command_help`
- turn the column-aligned text that many external programs print into a table with `detect columns`
- expect variables and environment changes to last from one call to the next, and remember that external commands see environment variables but not `let` variables
- quote and interpolate strings the Nushell way, and redirect with `o>`, `o+e>|`, and `ignore` instead of `>` and `2>&1`
- look up Bash commands in a table of Nushell equivalents
- let `http get` parse JSON responses, use `par-each` for parallel work, find files with `glob`, and use `polars` when that plugin is loaded
- collect promoted calls with `job recv`, and start long-lived programs with `job spawn`

The `evaluate` tool's description has a second Bash-to-Nushell table and names two of the limits, `NU_MCP_OUTPUT_LIMIT` and `NU_MCP_PROMOTE_AFTER`.

## State Between Calls

Each call to `evaluate` runs in the same session, like lines typed at the REPL. A variable, custom command, alias, or environment variable defined in one call is still there in the next. Over HTTP, each client session has its own state.

Every result is also stored in the `$history` list, at the `history_index` given in the response. A client can run a command once and then filter or page through `$history.<index>` instead of running it again. A few environment variables control how much is kept and returned. Set them in a configuration file, as above, or from the client with `evaluate`:

| Variable               | Default  | Effect                                                                                                                                                                              |
| ---------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NU_MCP_OUTPUT_LIMIT`  | `10kib`  | Larger results are left out of the response, which has a `note` field in place of `output`: `output truncated, full result in $history.0`. `0b` turns truncation off.               |
| `NU_MCP_HISTORY_LIMIT` | `100`    | How many results `$history` keeps. Older results are dropped. `0` still keeps the newest one.                                                                                       |
| `NU_MCP_PROMOTE_AFTER` | `120sec` | A call that runs longer than this becomes a [background job](#long-running-calls). The response is an error with the job id, and the result can be collected later with `job recv`. |

The output limit is measured on the result as [`to nuon`](/commands/docs/to_nuon.md) writes it, so the quotes around a string count toward it. The response itself shows a string without quotes when it can.

Each variable needs a value of the right type: a filesize for `NU_MCP_OUTPUT_LIMIT`, an int for `NU_MCP_HISTORY_LIMIT`, and a duration for `NU_MCP_PROMOTE_AFTER`, as in `$env.NU_MCP_PROMOTE_AFTER = 10min`.

`$history` indices count up for the whole session and never shift. A dropped result's index reads as `null`, the same as a result that was `null`, and `$history | length` still counts it. To keep a result for longer, save it with `let`.

### Long-Running Calls

A call that runs longer than `NU_MCP_PROMOTE_AFTER` keeps running as a [background job](./background_jobs.md), and the client gets an error response right away. A request that the client cancels while it runs becomes a background job the same way. Here each line is a separate `evaluate` call:

```nu
$env.NU_MCP_PROMOTE_AFTER = 1sec
sleep 2sec; [1 2 3] | each { $in * 2 }
job recv
```

The second call returns the error ``Operation promoted to background job (id: 1). Use `job list` to see it and `job recv` to get the result.`` Once the job has finished, `job recv` returns the string `[2,4,6]`. A `job recv` that is still waiting when the limit passes is promoted too, so give it a `--timeout` shorter than `NU_MCP_PROMOTE_AFTER`.

The job runs on a copy of the session. Variables, definitions, and environment changes it makes are thrown away, and its result is not added to `$history`. When it finishes, the result arrives in the session's own mailbox (job 0) as one string without a tag: the output written as NUON, an external command's output as plain text, or `Error: ` followed by the error record. The string is never truncated. Use [`from nuon`](/commands/docs/from_nuon.md) to turn NUON back into data.

In [`job list`](/commands/docs/job_list.md), the job's description is `mcp: ` followed by the first line of the code. A line longer than 40 characters is cut to 40 and ends in `...`. [`job kill`](/commands/docs/job_kill.md) interrupts it, and an `Error: ` message about the interruption still arrives in the mailbox.

## HTTP Transport

To let clients connect over the network, start the server with the streamable HTTP transport:

```nu
nu --mcp --mcp-transport http --mcp-port 3000
```

It listens on `127.0.0.1` (port `8080` unless `--mcp-port` is given) and prints `MCP HTTP server listening on http://127.0.0.1:3000` to stderr. Clients connect to a URL such as `http://127.0.0.1:3000/mcp`, but the server answers on every path, so `http://127.0.0.1:3000/` works as well. A client session that stays idle for 30 minutes is closed. Press <kbd>Ctrl</kbd>+<kbd>C</kbd> to stop the server.

To accept connections from other machines, bind to another address with `--mcp-host`. A bare IPv6 address such as `::` or `::1` works too, and the server adds the brackets that a socket address needs. To guard against DNS-rebinding attacks, the server only accepts requests whose `Host` header is `localhost`, `127.0.0.1`, or `::1`, so also list the host names that clients will use with `--mcp-allowed-hosts`. The list replaces the default one, so include `localhost` if local clients should still connect:

```nu
nu --mcp --mcp-transport http --mcp-host 0.0.0.0 --mcp-allowed-hosts nu.example.com localhost
```

A request with any other `Host` header is refused with `403 Forbidden`. An empty list, as in `--mcp-allowed-hosts=[]`, keeps the default list instead of allowing every host. Browser-based clients send an `Origin` header as well. It isn't checked unless you list the allowed origins with `--mcp-allowed-origins`, for example `--mcp-allowed-origins https://app.example.com`.

## Command-Line Flags

| Flag                                 | Description                                                                   |
| ------------------------------------ | ----------------------------------------------------------------------------- |
| `--mcp`                              | Start the MCP server.                                                         |
| `--mcp-transport <stdio\|http>`      | The transport to use. Default: `stdio`.                                       |
| `--mcp-port <port>`                  | The port for the HTTP transport. Default: `8080`.                             |
| `--mcp-host <address>`               | The address the HTTP transport binds to. Default: `127.0.0.1`.                |
| `--mcp-allowed-hosts <hosts...>`     | The `Host` header values to accept. Default: `localhost`, `127.0.0.1`, `::1`. |
| `--mcp-allowed-origins <origins...>` | The `Origin` header values to accept. Default: any.                           |

`--mcp-allowed-hosts` and `--mcp-allowed-origins` take one or more values, either as separate arguments or as one comma-separated list, which may be wrapped in brackets.

`--mcp-transport` ignores case and spaces around the value. Any other value, a typo included, stops `nu` with an `Invalid value` error that suggests the closest valid value, such as `Did you mean 'http'?`.
