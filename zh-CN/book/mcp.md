# MCP 服务器

[Model Context Protocol](https://modelcontextprotocol.io)（MCP）是 AI Agent 与其他基于大语言模型（LLM）的工具调用本地运行工具的标准协议。Nushell 内置了 MCP 服务器。使用 `nu --mcp` 启动后，MCP 客户端可以查询 Nushell 命令并执行 Nushell 代码；得益于 Nushell 返回的是结构化数据，客户端接收到的是表格（table）和记录（record），而无需自行解析纯文本。

::: warning
服务器的 `evaluate` 工具会以当前用户的权限执行传入的任意 Nushell 代码，包括外部命令。请仅连接你信任的客户端。HTTP 传输方式没有任何身份验证，因此任何能够访问该端口的人都可以以你的身份执行命令。
:::

## 启动服务器

MCP 服务器是默认构建的一部分（即 `mcp` [Cargo 特性](./installation.md)）。运行 `nu --mcp` 会在标准输入和输出流上启动它，这也是大多数 MCP 客户端启动本地服务器的方式。客户端通常接受类似如下的配置；有关放置位置请参阅相应客户端的文档：

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

服务器会像交互式会话一样加载你的 `env.nu` 和 `config.nu`，因此你的自定义命令、别名和环境变量对客户端都是可用的。在参数中添加 `-n`（`--no-config-file`）可改为从默认配置启动。在解析配置文件期间，[`$nu.is-mcp`](./special_variables.md#nu) 的值为 `true`，因此可以在配置中针对服务器进行单独设置：

```nu
if $nu.is-mcp {
    $env.NU_MCP_OUTPUT_LIMIT = 50kb
}
```

该会话为非交互式（`$nu.is-interactive` 为 `false`）：

- 外部命令不会获取标准输入，因此等待输入的命令不会挂起。在 Linux、macOS 和 BSD 系统上，服务器还会与终端分离，因此像 `ssh` 或 `sudo` 这类在终端上请求密码的程序会立即失败而不是一直等待。
- [`print`](/commands/docs/print.md) 输出到 stderr，因此不会干扰 stdout 上的协议消息。
- 输出不带颜色。

## 工具

该服务器提供了三个工具：

| 工具            | 参数    | 功能说明                                                                                         |
| --------------- | ------- | ------------------------------------------------------------------------------------------------ |
| `list_commands` | `find`  | 列出可用命令及其签名和描述。`find` 可按名称、描述或搜索词筛选列表。                              |
| `command_help`  | `name`  | 显示单个命令的帮助信息。传入的名称为你调用它时所使用的名称，因此别名或从模块导入的命令同样适用。 |
| `evaluate`      | `input` | 执行 Nushell 代码并返回结果。                                                                    |

`evaluate` 返回一个 NUON 记录，其中包含代码运行所在的目录（`cwd`）、其在 `$history` 中的索引（见下文）以及运行时间。结果本身位于 `output` 字段中：

```nu
{cwd:"/home/me/project",history_index:1,timestamp:2026-10-16T14:03:42.606465+00:00,output:43}
```

当代码执行失败时，响应会被标记为错误，其内容是一个包含错误 `code`、`msg` 和 `labels` 的 NUON 记录：

```nu
{code:"nu::shell::division_by_zero",msg:"Division by zero.",labels:[[text,span,line,column];["division by zero",/,1,3]]}
```

服务器还会向客户端发送指令，解释这些工具的使用方法以及 Nushell 与 Bash 的不同之处。

## 调用之间的状态保持

每次调用 `evaluate` 都在同一个会话中运行，就像在 REPL 中逐行输入一样。在一次调用中定义的变量、自定义命令、别名或环境变量在下一次调用中依然存在。通过 HTTP 方式时，每个客户端会话都有自己独立的状态。

每次调用的结果还会存储在 `$history` 列表中，位于响应中给出的 `history_index` 处。客户端可以只执行一次命令，随后通过 `$history.<index>` 进行筛选或分页，而无需重新运行命令。有几个环境变量控制保留和返回的数据量。你可以像上面那样在配置文件中设置它们，也可以从客户端通过 `evaluate` 进行设置：

| 变量                   | 默认值   | 说明                                                                                                                                                  |
| ---------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NU_MCP_OUTPUT_LIMIT`  | `10kb`   | 超出此大小的结果将不在响应中直接返回，而是在原 `output` 处替换为 `note` 字段：`output truncated, full result in $history.0`。设置为 `0b` 可关闭截断。 |
| `NU_MCP_HISTORY_LIMIT` | `100`    | `$history` 保留的结果数量。较早的结果将被丢弃。                                                                                                       |
| `NU_MCP_PROMOTE_AFTER` | `120sec` | 运行时间超过此阈值的调用将转为[后台任务](./background_jobs.md)。响应将返回带有任务 ID 的错误，后续可通过 `job recv` 获取结果。                        |

## HTTP 传输

若要允许客户端通过网络连接，请使用支持流式传输的 HTTP 传输模式启动服务器：

```nu
nu --mcp --mcp-transport http --mcp-port 3000
```

服务器默认监听 `127.0.0.1`（除非指定 `--mcp-port`，否则端口为 `8080`），客户端连接到形如 `http://127.0.0.1:3000/mcp` 的 URL。闲置超过 30 分钟的客户端会话将被关闭。

若要接收来自其他机器的连接，请使用 `--mcp-host` 绑定到其他地址。为了防范 DNS 重绑定攻击，服务器仅接受 `Host` 标头为 `localhost`、`127.0.0.1` 或 `::1` 的请求，因此还需要使用 `--mcp-allowed-hosts` 列出客户端将使用的主机名。该列表会替换默认值，因此如果本地客户端仍需连接，请一并包含 `localhost`：

```nu
nu --mcp --mcp-transport http --mcp-host 0.0.0.0 --mcp-allowed-hosts nu.example.com localhost
```

任何携带其他 `Host` 标头的请求都将被拒绝并返回 `403 Forbidden`。基于浏览器的客户端还会发送 `Origin` 标头。除非使用 `--mcp-allowed-origins` 列出允许的源（例如 `--mcp-allowed-origins https://app.example.com`），否则不会检查该标头。

## 命令行标志

| 标志                                 | 说明                                                            |
| ------------------------------------ | --------------------------------------------------------------- |
| `--mcp`                              | 启动 MCP 服务器。                                               |
| `--mcp-transport <stdio\|http>`      | 要使用的传输方式。默认值：`stdio`。                             |
| `--mcp-port <port>`                  | HTTP 传输的端口。默认值：`8080`。                               |
| `--mcp-host <address>`               | HTTP 传输绑定的地址。默认值：`127.0.0.1`。                      |
| `--mcp-allowed-hosts <hosts...>`     | 接受的 `Host` 标头值。默认值：`localhost`、`127.0.0.1`、`::1`。 |
| `--mcp-allowed-origins <origins...>` | 接受的 `Origin` 标头值。默认值：任意。                          |

`--mcp-allowed-hosts` 和 `--mcp-allowed-origins` 接受一个或多个值，既可以作为多个独立参数传递，也可以作为单个逗号分隔的列表传递。
