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

## Tools

The server offers three tools:

| Tool            | Argument | What it does                                                                                                                       |
| --------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `list_commands` | `find`   | Lists the available commands with their signatures and descriptions. `find` narrows the list by name, description, or search term. |
| `command_help`  | `name`   | Shows the help for one command. The name is the one you call it by, so an alias or a command imported from a module works too.     |
| `evaluate`      | `input`  | Runs Nushell code and returns the result.                                                                                          |

`evaluate` returns a NUON record with the directory the code ran in (`cwd`), its index in `$history` (see below), and the time it ran. The result itself is in `output`:

```nu
{cwd:"/home/me/project",history_index:1,timestamp:2026-10-16T14:03:42.606465+00:00,output:43}
```

When the code fails, the response is marked as an error, and its content is a NUON record with the error's `code`, `msg`, and `labels`:

```nu
{code:"nu::shell::division_by_zero",msg:"Division by zero.",labels:[[text,span,line,column];["division by zero",/,1,3]]}
```

The server also sends the client instructions that explain these tools and how Nushell differs from Bash.

## State Between Calls

Each call to `evaluate` runs in the same session, like lines typed at the REPL. A variable, custom command, alias, or environment variable defined in one call is still there in the next. Over HTTP, each client session has its own state.

Every result is also stored in the `$history` list, at the `history_index` given in the response. A client can run a command once and then filter or page through `$history.<index>` instead of running it again. A few environment variables control how much is kept and returned. Set them in a configuration file, as above, or from the client with `evaluate`:

| Variable               | Default  | Effect                                                                                                                                                                               |
| ---------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `NU_MCP_OUTPUT_LIMIT`  | `10kb`   | Larger results are left out of the response, which has a `note` field in place of `output`: `output truncated, full result in $history.0`. `0b` turns truncation off.                |
| `NU_MCP_HISTORY_LIMIT` | `100`    | How many results `$history` keeps. Older results are dropped.                                                                                                                        |
| `NU_MCP_PROMOTE_AFTER` | `120sec` | A call that runs longer than this becomes a [background job](./background_jobs.md). The response is an error with the job id, and the result can be collected later with `job recv`. |

## HTTP Transport

To let clients connect over the network, start the server with the streamable HTTP transport:

```nu
nu --mcp --mcp-transport http --mcp-port 3000
```

It listens on `127.0.0.1` (port `8080` unless `--mcp-port` is given), and clients connect to a URL such as `http://127.0.0.1:3000/mcp`. A client session that stays idle for 30 minutes is closed.

To accept connections from other machines, bind to another address with `--mcp-host`. To guard against DNS-rebinding attacks, the server only accepts requests whose `Host` header is `localhost`, `127.0.0.1`, or `::1`, so also list the host names that clients will use with `--mcp-allowed-hosts`. The list replaces the default one, so include `localhost` if local clients should still connect:

```nu
nu --mcp --mcp-transport http --mcp-host 0.0.0.0 --mcp-allowed-hosts nu.example.com localhost
```

A request with any other `Host` header is refused with `403 Forbidden`. Browser-based clients send an `Origin` header as well. It isn't checked unless you list the allowed origins with `--mcp-allowed-origins`, for example `--mcp-allowed-origins https://app.example.com`.

## Command-Line Flags

| Flag                                 | Description                                                                   |
| ------------------------------------ | ----------------------------------------------------------------------------- |
| `--mcp`                              | Start the MCP server.                                                         |
| `--mcp-transport <stdio\|http>`      | The transport to use. Default: `stdio`.                                       |
| `--mcp-port <port>`                  | The port for the HTTP transport. Default: `8080`.                             |
| `--mcp-host <address>`               | The address the HTTP transport binds to. Default: `127.0.0.1`.                |
| `--mcp-allowed-hosts <hosts...>`     | The `Host` header values to accept. Default: `localhost`, `127.0.0.1`, `::1`. |
| `--mcp-allowed-origins <origins...>` | The `Origin` header values to accept. Default: any.                           |

`--mcp-allowed-hosts` and `--mcp-allowed-origins` take one or more values, either as separate arguments or as one comma-separated list.
