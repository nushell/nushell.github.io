---
title: 插件协议参考
---

# 插件协议参考

## Nu 如何运行插件

Nu 插件**必须**是一个可执行文件，文件名必须以 `nu_plugin_` 开头。插件可以在两种模式下运行：

1. **标准输入输出（Stdio）模式**，**必须**支持。插件会收到 `--stdio` 作为命令行参数。所有与插件的交互都通过标准输入（stdin）和输出（stdout）处理。标准错误（stderr）不会被重定向，插件可以使用它直接打印消息。

2. **本地套接字（Local socket）模式**，**可以**支持（通过 [`LocalSocket` 功能](#localsocket-功能) 进行广告）。插件会收到 `--local-socket` 作为第一个命令行参数，然后是用于通信的 Unix 域套接字路径或 Windows 命名管道名称。标准输入输出流都不会被重定向，它们都可以用于与用户的终端交互。有关该功能的详细信息，请参阅[特定文档](#localsocket-功能)。

其他命令行参数保留给将来可能添加的选项，包括其他通信方法。支持本文档所述协议的插件**应该**拒绝其他参数，并向 stderr 打印信息性消息。

启动插件后，Nu 期望插件立即发送其编码类型。目前支持两种编码类型：[`json`](#json) 和 [`msgpack`](#messagepack)。所需的编码类型**应该**首先发送，字符串长度作为单字节整数，然后是编码类型字符串。即，使用类似 C 的转义语法：`"\x04json"` 或 `"\x07msgpack"`。在本文档中，为了可读性将使用 JSON 格式，但 MessagePack 格式大致等效。有关格式的具体细节，请参阅[编码](#encoding)部分。

然后 Nu 将以所需的编码发送消息。第一条消息始终是 [`Hello`](#hello)。插件**必须**发送一条 `Hello` 消息，指示其兼容的预期 Nu 版本以及任何支持的协议功能。引擎也会发送一条 `Hello` 消息，包含其版本和任何支持的协议功能。插件**可以**验证其是否与引擎提供的 Nu 版本兼容，但如果确定不支持，引擎将结束与插件的通信。插件**不得**使用其支持但引擎在其 `Hello` 消息中未确认支持的协议功能。在发送 `Hello` 之前不允许发送任何其他消息。

然后插件**应该**接收并响应消息，直到其输入流关闭。

初始握手后典型的插件交互如下所示：

1. 引擎发送一个 [`Call`](#call)。调用包含一个用于标识响应的 ID。
2. 如果调用的 `input` 指定了流，引擎将发送[流消息](#流消息)。这些不需要在插件发送响应之前被消费。
3. 插件发送一个 [`CallResponse`](#callresponse)，使用步骤 1 中的相同 ID。
4. 如果插件在响应中指定了流数据作为输出，它**应该**现在发送具有相应流 ID 的[流消息](#流消息)。

插件**应该**响应进一步的插件调用。引擎**可以**在收到响应之前发送额外的插件调用，由插件决定是立即处理每个收到的调用，还是一次只处理一个并将其保留以供以后使用。无论如何，在收到响应之前发送另一个插件调用**不应该**导致错误。

插件**可以**在执行调用期间发送[引擎调用](#enginecall)以请求引擎执行操作。引擎调用[仅在调用上下文中有效](#enginecall-context)，否则不得发送。

引擎**可以**向插件发送 [`Goodbye`](#goodbye) 消息，指示它将不再发送任何插件调用。收到此消息后，插件**可以**选择不再接受任何插件调用，并**应该**在所有进行中的插件调用完成后退出。

**注意**：在此过程中，引擎还可能异步发送 [`Signal`](#signal) 消息，例如当触发中断（Ctrl+C）或重置信号时。插件应在收到这些消息时进行处理，例如，在发送 `Interrupt` 信号时暂停或停止操作。

## `Hello`

确定编码类型后，引擎和插件**必须**都发送一条 `Hello` 消息，包含相关的版本和协议支持信息。

| 字段         | 类型   | 描述                                               |
| ------------ | ------ | -------------------------------------------------- |
| **protocol** | string | **必须**为 `"nu-plugin"`。                         |
| **version**  | string | 引擎的版本，或插件支持的 Nu 目标版本。             |
| **features** | array  | 插件支持的协议功能。无法识别的元素**必须**被忽略。 |

要被接受，指定的 `version`**必须**与引擎版本[语义版本（semver）](https://semver.org)兼容。"0.x.y" 和 "x.y.z" 对于不同的 "x" 值被认为是不兼容的。

插件**可以**决定使用比此处指定的更严格的标准来拒绝引擎版本。

示例：

```json
{
  "Hello": {
    "protocol": "nu-plugin",
    "version": "0.94.0",
    "features": []
  }
}
```

### 功能

所有功能都是映射（maps），**必须**至少包含一个 `name` 键，并且**可以**包含其他键。无法通过 `name` 识别的功能**必须**被忽略，并且不会导致错误。插件**必须**仅广告它们实现的功能支持，并且**不应该**根据引擎的 `Hello` 消息来确定它们将广告的功能。

#### `LocalSocket` 功能

此功能广告支持本地套接字通信，而不是 stdio。

示例：

```json
{
  "name": "LocalSocket"
}
```

当向支持该功能的引擎广告本地套接字通信时，引擎将停止 stdio 通信，并使用 `--local-socket` 命令行参数重新启动插件。第二个参数要么是 Linux、Android、macOS 和其他类 Unix 操作系统上的 Unix 域套接字路径，要么是 Windows 上命名管道的名称（不带 `\\.\pipe\` 前缀）。

无论哪种情况，在启动期间，插件都需要按此顺序建立到套接字的两个独立连接：

1. 输入流连接，用于从引擎向插件发送消息
2. 输出流连接，用于从插件向引擎发送消息

连接是分开的，以便于不同线程对流的所有权。在这两个连接都建立后，引擎将移除套接字，并且不再接受进一步的连接。

如果本地套接字通信初始化失败，引擎将中止，停止插件，并使用 stdio 模式重新启动它，即使插件支持本地套接字。本地套接字模式是否成功初始化，以及因此是否允许插件使用 stdio，可以通过观察 Rust 插件的 [`EngineInterface::is_using_stdio()`](https://docs.rs/nu-plugin/latest/nu_plugin/struct.EngineInterface.html#method.is_using_stdio) 是否返回 `false` 来确定。

## 输入消息

这些是从引擎发送到插件的消息。[`Hello`](#hello) 和 [`Stream messages`](#流消息) 也包括在内。

### `Call`

此消息的主体是一个 2 元组（数组）：(`id`, `call`)。引擎为每个插件调用发送唯一的 ID。需要此 ID 来发送 [`CallResponse`](#callresponse)。

#### `Metadata` 插件调用

要求插件发送有关其自身的元数据。不接受参数。返回 [`Metadata`](#metadata-plugin-call-response) 或 [`Error`](#error-plugin-call-response)。

示例：

```json
{
  "Call": [0, "Metadata"]
}
```

#### `Signature` 插件调用

要求插件发送其命令签名。不接受参数。返回 [`Signature`](#signature-plugin-call-response) 或 [`Error`](#error-plugin-call-response)。

示例：

```json
{
  "Call": [0, "Signature"]
}
```

#### `Run` 插件调用

告诉插件运行一个命令。参数是以下映射：

| 字段      | 类型                                        | 描述                     |
| --------- | ------------------------------------------- | ------------------------ |
| **name**  | string                                      | 要运行的命令名称         |
| **call**  | [`EvaluatedCall`](#evaluatedcall)           | 有关调用的信息，包括参数 |
| **input** | [`PipelineDataHeader`](#pipelinedataheader) | 命令的管道输入           |

<a name="evaluatedcall"></a>

`EvaluatedCall` 是一个映射：

| 字段           | 类型                                              | 描述                 |
| -------------- | ------------------------------------------------- | -------------------- |
| **head**       | [`Span`](#span)                                   | 命令执行开始的位置。 |
| **positional** | [`Value`](#value) array                           | 位置参数。           |
| **named**      | 2-tuple (string, [`Value`](#value) or null) array | 命名参数，例如开关。 |

命名参数始终以其长名称发送，而不是短名称。

返回 [`PipelineData`](#pipelinedata-plugin-call-response) 或 [`Error`](#error-plugin-call-response)。

示例：

```json
{
  "Call": [
    0,
    {
      "Run": {
        "name": "inc",
        "call": {
          "head": {
            "start": 40400,
            "end": 40403
          },
          "positional": [
            {
              "String": {
                "val": "0.1.2",
                "span": {
                  "start": 40407,
                  "end": 40415
                }
              }
            }
          ],
          "named": [
            [
              "major",
              {
                "Bool": {
                  "val": true,
                  "span": {
                    "start": 40404,
                    "end": 40406
                  }
                }
              }
            ]
          ]
        }
      }
    }
  ]
}
```

#### `CustomValueOp` 插件调用

对从插件接收的自定义值执行操作。参数是一个 2 元组（数组）：(`custom_value`, `op`)。

自定义值以带范围的格式指定，作为没有 `type` 字段的 [`PluginCustomValue`](#plugincustomvalue)，而不是作为 `Value` - 请参阅示例。

##### `ToBaseValue`

返回一个代表自定义值的普通值，如果不可能则返回错误。不允许为此操作发送回自定义值。响应类型是 [`PipelineData`](#pipelinedata-plugin-call-response) 或 [`Error`](#error-plugin-call-response)。如果操作产生流，它将被消费为一个值。

示例：

```json
{
  "Call": [
    0,
    {
      "CustomValueOp": [
        {
          "item": {
            "name": "version",
            "data": [0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0]
          },
          "span": {
            "start": 90,
            "end": 96
          }
        },
        "ToBaseValue"
      ]
    }
  ]
}
```

##### `FollowPathInt`

返回在自定义值上跟随数字单元格路径（例如 `$custom_value.0`）的结果。这最常用于像列表或表格一样操作的自定义类型。参数是一个带范围的无符号整数。响应类型是 [`PipelineData`](#pipelinedata-plugin-call-response) 或 [`Error`](#error-plugin-call-response)。结果**可能**是另一个自定义值。如果操作产生流，它将被消费为一个值。

示例：

```nu
$version.0
```

```json
{
  "Call": [
    0,
    {
      "CustomValueOp": [
        {
          "item": {
            "name": "version",
            "data": [0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0]
          },
          "span": {
            "start": 90,
            "end": 96
          }
        },
        {
          "FollowPathInt": {
            "item": 0,
            "span": {
              "start": 320,
              "end": 321
            }
          }
        }
      ]
    }
  ]
}
```

##### `FollowPathString`

返回在自定义值上跟随字符串单元格路径（例如 `$custom_value.field`）的结果。这最常用于像列表或表格一样操作的自定义类型。参数是一个带范围的字符串。响应类型是 [`PipelineData`](#pipelinedata-plugin-call-response) 或 [`Error`](#error-plugin-call-response)。结果**可能**是另一个自定义值。如果操作产生流，它将被消费为一个值。

示例：

```nu
$version.field
```

```json
{
  "Call": [
    0,
    {
      "CustomValueOp": [
        {
          "item": {
            "name": "version",
            "data": [0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0]
          },
          "span": {
            "start": 90,
            "end": 96
          }
        },
        {
          "FollowPathString": {
            "item": "field",
            "span": {
              "start": 320,
              "end": 326
            }
          }
        }
      ]
    }
  ]
}
```

##### `PartialCmp`

将自定义值与另一个值进行比较，并返回应使用的 [`Ordering`](#ordering)（如果有）。参数类型是 [`Value`](#value)，可以是任何值 - 不仅仅是相同的自定义值类型。响应类型是 [`Ordering`](#ordering-plugin-call-response)。也可能返回 [`Error`](#error-plugin-call-response)，但目前错误不太可能呈现给用户 - 引擎将表现得好像你发送了 `{"Ordering": null}`。

示例（比较两个 `version` 自定义值）：

```json
{
  "Call": [
    0,
    {
      "CustomValueOp": [
        {
          "item": {
            "name": "version",
            "data": [0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0]
          },
          "span": {
            "start": 90,
            "end": 96
          }
        },
        {
          "PartialCmp": {
            "Custom": {
              "val": {
                "type": "PluginCustomValue",
                "name": "version",
                "data": [0, 0, 0, 0, 1, 0, 0, 0, 3, 0, 0, 0]
              },
              "span": {
                "start": 560,
                "end": 566
              }
            }
          }
        }
      ]
    }
  ]
}
```

##### `Operation`

返回在此自定义值和另一个值上评估 [`Operator`](#operator) 的结果。参数是一个 2 元组：(`operator`, `value`)，其中 `operator` 是一个带范围的 [`Operator`](#operator)，`value` 是一个 [`Value`](#value)，可以是任何值 - 不仅仅是相同的自定义值类型。响应类型是 [`PipelineData`](#pipelinedata-plugin-call-response) 或 [`Error`](#error-plugin-call-response)。结果**可能**是另一个自定义值。如果操作产生流，它将被消费为一个值。

示例：

```nu
$version + 7
```

```json
{
  "Call": [
    0,
    {
      "CustomValueOp": [
        {
          "item": {
            "name": "version",
            "data": [0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0]
          },
          "span": {
            "start": 90,
            "end": 96
          }
        },
        {
          "Operation": [
            {
              "item": {
                "Math": "Plus"
              },
              "span": {
                "start": 180,
                "end": 181
              }
            },
            {
              "Int": {
                "val": 7,
                "span": {
                  "start": 183,
                  "end": 184
                }
              }
            }
          ]
        }
      ]
    }
  ]
}
```

##### `Dropped`

此操作用于通知插件，一个在引擎中设置了 `notify_on_drop` 为 `true` 的 [`PluginCustomValue`](#plugincustomvalue) 已被丢弃 - 即，它的所有副本都已超出范围。有关在什么情况下发送此消息的更多信息，请参阅插件参考中的[丢弃通知](plugins.md#drop-notification)部分。响应类型是 [`Empty` pipeline data](#empty-header-variant) 或 [`Error`](#error-plugin-call-response)。

示例：

```json
{
  "Call": [
    0,
    {
      "CustomValueOp": [
        {
          "item": {
            "name": "handle",
            "data": [78, 60],
            "notify_on_drop": true
          },
          "span": {
            "start": 1820,
            "end": 1835
          }
        },
        "Dropped"
      ]
    }
  ]
}
```

### `EngineCallResponse`

对插件发出的[引擎调用](#enginecall)的响应。参数是一个 2 元组（数组）：(`engine_call_id`, `engine_call`)。

`engine_call_id` 指的是原始引擎调用中包含的相同数字。插件**必须**为每个引擎调用发送唯一的 ID。与 [`CallResponse`](#callresponse) 类似，有多种类型的响应：

#### `Error` 引擎调用响应

失败结果。包含一个 [`LabeledError`](#labelederror)。

示例：

```json
{
  "EngineCallResponse": [
    0,
    {
      "Error": {
        "LabeledError": {
          "msg": "连接已关闭。",
          "labels": [],
          "code": null,
          "url": null,
          "help": null,
          "inner": []
        }
      }
    }
  ]
}
```

#### `PipelineData` 引擎调用响应

包含 Nu [`Value`](#value) 或流的成功结果。主体是一个 [`PipelineDataHeader`](#pipelinedataheader)。

示例：

```json
{
  "EngineCallResponse": [
    0,
    {
      "ListStream": {
        "id": 23,
        "span": {
          "start": 8081,
          "end": 8087
        }
      }
    }
  ]
}
```

#### `Config` 引擎调用响应

[`Config` 引擎调用](#config-engine-call)的成功结果。主体是一个 [`Config`](#config)。

示例：

```json
{
  "EngineCallResponse": [
    0,
    {
      "Config": {
        "external_completer": null,
        "filesize_metric": true,
        "table_mode": "Rounded",
        "table_move_header": false,
        ...
      }
    }
  ]
}
```

此示例已缩写，因为 [`Config`](#config) 对象很大且经常变化。

#### `ValueMap` 引擎调用响应

产生普通映射的引擎调用（例如 [`GetEnvVars` 引擎调用](#getenvvars-engine-call)）的成功结果。主体是从字符串到 [`Value`s](#value) 的映射。

示例：

```json
{
  "EngineCallResponse": [
    0,
    {
      "ValueMap": {
        "FOO": {
          "String": {
            "val": "bar",
            "span": {
              "start": 2020,
              "end": 2024
            }
          }
        }
      }
    }
  ]
}
```

#### `Identifier` 引擎调用响应

产生内部标识符的引擎调用（例如 [`FindDecl`](#finddecl-engine-call)）的成功结果。主体是一个 `usize`（无符号整数，平台指针大小）。

示例：

```json
{
  "EngineCallResponse": [
    0,
    {
      "Identifier": 4221
    }
  ]
}
```

### `Signal`

`Signal` 消息类型用于将信号从引擎中继到插件，允许插件响应各种系统级或用户发起的信号。消息主体包含一个 `SignalAction` 枚举，目前支持以下变体：

- **`Interrupt`**：当引擎收到中断信号（例如 Ctrl+C）时发送，以优雅地中断插件的操作。
- **`Reset`**：当引擎的 `reset_signals` 方法被调用时发送，指示插件应重置其信号状态。

示例：

```json
{
  "Signal": "Interrupt"
}
```

### `Goodbye`

指示不再期望进一步的插件调用，并且插件**应该**在处理完任何进行中的插件调用后立即退出。

此消息不是映射，只是一个裸字符串，因为它不接受参数。

示例：

```json
"Goodbye"
```

## 输出消息

这些是从插件发送到引擎的消息。[`Hello`](#hello) 和 [`Stream messages`](#流消息) 也包括在内。

### `CallResponse`

#### `Error` 插件调用响应

尝试完成请求时发生错误。主体是一个 [`LabeledError`](#labelederror)。

强烈建议尽可能提供带标签的消息，让用户知道问题可能出现在脚本中的哪个位置。如果没有更合适的值范围可以使用，[`EvaluatedCall`](#evaluatedcall) 的 `head` 是一个很好的后备选择。

示例：

```json
{
  "CallResponse": [
    0,
    {
      "Error": {
        "msg": "发生了一个非常严重的错误",
        "labels": [
          {
            "text": "我不知道，但它超过九千了！",
            "span": {
              "start": 9001,
              "end": 9007
            }
          }
        ],
        "code": "my_plugin::bad::really_bad",
        "url": "https://example.org/my_plugin/error/bad/really_bad.html",
        "help": "你可以通过不做坏事来解决这个问题",
        "inner": [
          {
            "msg": "坏事"
          }
        ]
      }
    }
  ]
}
```

#### `Metadata` 插件调用响应

[`Metadata` 插件调用](#metadata-plugin-call)的成功响应。主体包含描述插件的字段，这些字段都不是必需的：

| 字段        | 类型    | 描述                                                                                           |
| ----------- | ------- | ---------------------------------------------------------------------------------------------- |
| **version** | string? | 插件的版本（不是协议版本！）。推荐使用[语义版本（SemVer）](https://semver.org)，但不是必需的。 |

示例：

```json
{
  "CallResponse": [
    0,
    {
      "Metadata": {
        "version": "1.2.3"
      }
    }
  ]
}
```

#### `Signature` 插件调用响应

[`Signature` 插件调用](#signature-plugin-call)的成功响应。主体是一个[签名](https://docs.rs/nu-protocol/latest/nu_protocol/struct.PluginSignature.html)数组。

示例：

```json
{
  "CallResponse": [
    0,
    {
      "Signature": [
        {
          "sig": {
            "name": "len",
            "description": "计算其输入的长度",
            "extra_description": "",
            "search_terms": [],
            "required_positional": [],
            "optional_positional": [],
            "rest_positional": null,
            "vectorizes_over_list": false,
            "named": [
              {
                "long": "help",
                "short": "h",
                "arg": null,
                "required": false,
                "desc": "显示此命令的帮助消息",
                "var_id": null,
                "default_value": null
              }
            ],
            "input_type": "String",
            "output_type": "Int",
            "input_output_types": [],
            "allow_variants_without_examples": false,
            "is_filter": false,
            "creates_scope": false,
            "allows_unknown_args": false,
            "category": "Default"
          },
          "examples": []
        }
      ]
    }
  ]
}
```

#### `Ordering` 插件调用响应

[`PartialCmp` 自定义值操作](#partialcmp)的成功响应。如果比较可能，主体是 [`Ordering`](#ordering)，如果值无法比较，则为 `null`。

示例：

```json
{
  "CallResponse": [
    0,
    {
      "Ordering": "Less"
    }
  ]
}
```

不可比较值的示例：

```json
{
  "CallResponse": [
    0,
    {
      "Ordering": null
    }
  ]
}
```

#### `PipelineData` 插件调用响应

包含 Nu [`Value`](#value) 或流的成功结果。主体是一个 [`PipelineDataHeader`](#pipelinedataheader)。

示例：

```json
{
  "CallResponse": [
    0,
    {
      "Value": {
        "Int": {
          "val": 42,
          "span": {
            "start": 12,
            "end": 14
          }
        }
      }
    }
  ]
}
```

### `EngineCall`

插件可以在执行[调用](#call)期间进行引擎调用。主体是一个包含以下键的映射：

| 字段        | 类型         | 描述                                                       |
| ----------- | ------------ | ---------------------------------------------------------- |
| **context** | integer      | 此引擎调用相关的[调用](#call)的 ID。                       |
| **id**      | integer      | 此引擎调用的唯一 ID，用于发送[响应](#enginecallresponse)。 |
| **call**    | `EngineCall` | 下面描述的选项之一。                                       |

<a name="enginecall-context"></a>

上下文**必须**是已接收的[调用](#call)的 ID，该调用当前处于以下两种状态之一：

1. [响应](#callresponse)尚未发送。
2. 响应包含流数据（即 [`ListStream`](#liststream-header-variant) 或 [`ByteStream`](#bytestream-header-variant)），并且响应启动的至少一个流仍在发送数据（即 [`End`](#end) 尚未发送）。

在响应完全发送且流结束后，该调用的 `context` 不能再使用。

引擎调用 ID**必须**在插件的生命周期内是唯一的，建议这是插件发出的所有引擎调用的顺序递增数字。它不按 `context` 分隔；响应只包含 `id`。

#### `GetConfig` 引擎调用

获取 Nushell 引擎配置。如果成功，返回一个 [`Config` 响应](#config-engine-call-response)。

示例：

```json
{
  "EngineCall": {
    "context": 0,
    "id": 0,
    "call": "GetConfig"
  }
}
```

#### `GetPluginConfig` 引擎调用

从 `$env.config.plugins.NAME` 中的插件部分获取插件的配置（如果存在）。如果成功，返回一个 [`PipelineData` 响应](#pipelinedata-engine-call-response)，如果设置了插件配置，它将包含一个 [`Value`](#value-header-variant)，如果没有设置插件配置，则为 [`Empty`](#empty-header-variant)。

如果插件配置被指定为闭包，引擎将评估该闭包并返回结果，这可能会导致[错误响应](#error-engine-call-response)。

示例：

```json
{
  "EngineCall": {
    "context": 3,
    "id": 8,
    "call": "GetPluginConfig"
  }
}
```

#### `GetEnvVar` 引擎调用

从调用者的作用域获取环境变量。如果成功，返回一个 [`PipelineData` 响应](#pipelinedata-engine-call-response)，如果环境变量存在，它将包含一个 [`Value`](#value-header-variant)，如果环境变量不存在，则为 [`Empty`](#empty-header-variant)。

示例：

```json
{
  "EngineCall": {
    "context": 7,
    "id": 41,
    "call": {
      "GetEnvVar": "PATH"
    }
  }
}
```

#### `GetEnvVars` 引擎调用

从调用者的作用域获取所有环境变量。如果成功，返回一个 [`ValueMap` 响应](#valuemap-engine-call-response)，包含作用域中的所有环境变量。

示例：

```json
{
  "EngineCall": {
    "context": 9,
    "id": 72,
    "call": "GetEnvVars"
  }
}
```

#### `GetCurrentDir` 引擎调用

获取调用者作用域中的当前目录路径。如果成功，始终返回一个绝对路径作为字符串 [`Value` pipeline data](#value-header-variant) 响应。值响应中包含的范围不太可能有用，可能为零。

示例：

```json
{
  "EngineCall": {
    "context": 7,
    "id": 40,
    "call": "GetCurrentDir"
  }
}
```

#### `AddEnvVar` 引擎调用

在调用者的作用域中设置环境变量。只有在插件调用响应发送之前调用，环境变量才能传播到调用者的作用域。无论哪种方式，它都会传播到同一上下文中进行的其他引擎调用。参数是一个 2 元组：(`name`, `value`)。成功时的响应类型是 [`Empty` pipeline data](#empty-header-variant)。

示例：

```json
{
  "EngineCall": {
    "context": 7,
    "id": 42,
    "call": {
      "AddEnvVar": [
        "FOO",
        {
          "String": {
            "val": "bar",
            "span": {
              "start": 2020,
              "end": 2024
            }
          }
        }
      ]
    }
  }
}
```

#### `GetHelp` 引擎调用

获取当前命令的完全格式化帮助文本。这有助于实现仅列出其子命令的顶级命令，而不是实现任何特定功能。成功时的响应是 [`Value` pipeline data](#value-header-variant)，始终包含一个字符串。

示例：

```json
{
  "EngineCall": {
    "context": 1,
    "id": 2,
    "call": "GetHelp"
  }
}
```

#### `EnterForeground` 引擎调用

以操作系统定义的方式将插件移动到前台组以进行直接终端访问。当插件将以原始模式驱动终端时（例如实现终端 UI），应调用此方法。在这种情况下，插件可能还需要在[本地套接字模式](#localsocket-feature)下运行。

当插件不需要任何操作时，此调用在成功时响应 [`Empty` pipeline data](#empty-header-variant)。在类 Unix 操作系统上，如果响应是 [`Value` pipeline data](#value-header-variant)，它包含一个 [`Int`](#int)，这是插件必须使用 `setpgid()` 加入的进程组 ID，以便处于前台。

如果插件已经在前台，此调用将失败并返回错误。

插件**应该**在不再需要处于前台时调用 [`LeaveForeground`](#leaveforeground-engine-call)。请注意，当接收到插件调用响应时，插件也会自动从前台移除，即使插件调用返回流也是如此。

示例：

```json
{
  "EngineCall": {
    "context": 0,
    "id": 0,
    "call": "EnterForeground"
  }
}
```

#### `LeaveForeground` 引擎调用

重置由 [`EnterForeground`](#enterforeground-engine-call) 设置的状态。

如果插件曾被 `EnterForeground` 的响应要求更改进程组，它也应该通过调用 `setpgid(0)` 来重置该状态，因为插件通常在自己的进程组中。

此调用在成功时响应 [`Empty` pipeline data](#empty-header-variant)。

示例：

```json
{
  "EngineCall": {
    "context": 0,
    "id": 0,
    "call": "LeaveForeground"
  }
}
```

#### `GetSpanContents` 引擎调用

从引擎获取 [`Span`](#span) 的内容。这可用于查看生成值的源代码。参数是一个 [`Span`](#span)。成功时的响应是 [`Value` pipeline data](3value-header-variant)，包含一个 [`Binary`](#binary) 值，因为结果不能保证是有效的 UTF-8。

示例：

```json
{
  "EngineCall": {
    "id": 72,
    "call": {
      "GetSpanContents": {
        "start": 38881,
        "end": 39007
      }
    }
  }
}
```

#### `EvalClosure` 引擎调用

将 [`Closure`](#closure) 和参数传递给引擎进行评估。如果成功，返回一个 [`PipelineData` 响应](#pipelinedata-engine-call-response)，其中包含闭包的输出，可能是一个流。

| 字段                | 类型                                        | 描述                                        |
| ------------------- | ------------------------------------------- | ------------------------------------------- |
| **closure**         | spanned [`Closure`](#closure)               | 要调用的闭包，通常来自 [`Value`](#value)。  |
| **positional**      | [`Value`](#value) array                     | 闭包的位置参数。                            |
| **input**           | [`PipelineDataHeader`](#pipelinedataheader) | 闭包的输入。                                |
| **redirect_stdout** | boolean                                     | 如果闭包以外部命令结束，是否重定向 stdout。 |
| **redirect_stderr** | boolean                                     | 如果闭包以外部命令结束，是否重定向 stderr。 |

`Closure` 没有包装为 `Value` - 即，它没有 `{"Closure": ...}` 包装。

示例：

```json
{
  "EngineCall": {
    "context": 7,
    "id": 40,
    "call": {
      "EvalClosure": {
        "closure": {
          "item": {
            "block_id": 72,
            "captures": []
          },
          "span": {
            "start": 780,
            "end": 812
          }
        },
        "positional": [
          {
            "Int": {
              "val": 7,
              "span": {
                "start": 3080,
                "end": 3081
              }
            }
          }
        ],
        "input": "Empty",
        "redirect_stdout": true,
        "redirect_stderr": false
      }
    }
  }
}
```

#### `FindDecl` 引擎调用

查找作用域中命令的声明 ID。主体是所需命令的名称，作为字符串。如果成功，返回一个 [`Identifier` 响应](#identifier-engine-call-response)，其中包含声明命令的 ID，如果在插件调用的作用域中找不到具有给定名称的命令，则返回一个[空](#empty-header-variant)的 [`PipelineData` 响应](#pipelinedata-engine-call-response)。

建议在找不到命令时提供描述性错误，说明需要什么命令，因为即使是 Nushell 提供的核心命令也可能被 `hide`。支持从同一或其他插件查找和调用命令，但请记住，在可能的情况下，在插件内部执行操作通常更高效。

示例：

```json
{
  "EngineCall": {
    "context": 7,
    "id": 48,
    "call": {
      "FindDecl": "inc"
    }
  }
}
```

#### `CallDecl` 引擎调用

将命令的声明 ID（通过 [`FindDecl`](#finddecl-engine-call) 找到）和参数传递给引擎进行调用。如果成功，返回一个 [`PipelineData` 响应](#pipelinedata-engine-call-response)，其中包含命令的输出，可能是一个流。

| 字段                | 类型                                        | 描述                                              |
| ------------------- | ------------------------------------------- | ------------------------------------------------- |
| **decl_id**         | unsigned integer                            | 要调用的声明的 ID。                               |
| **call**            | [`EvaluatedCall`](#evaluatedcall)           | 调用的参数和头范围。                              |
| **input**           | [`PipelineDataHeader`](#pipelinedataheader) | 命令的输入。                                      |
| **redirect_stdout** | boolean                                     | 如果声明的命令以外部命令结束，是否重定向 stdout。 |
| **redirect_stderr** | boolean                                     | 如果声明的命令以外部命令结束，是否重定向 stderr。 |

示例：

```json
{
  "EngineCall": {
    "context": 7,
    "id": 49,
    "call": {
      "CallDecl": {
        "decl_id": 432,
        "call": {
          "head": {
            "start": 40400,
            "end": 40403
          },
          "positional": [
            {
              "String": {
                "val": "0.1.2",
                "span": {
                  "start": 40407,
                  "end": 40415
                }
              }
            }
          ],
          "named": [
            [
              "major",
              {
                "Bool": {
                  "val": true,
                  "span": {
                    "start": 40404,
                    "end": 40406
                  }
                }
              }
            ]
          ]
        },
        "input": {
          "Value": {
            "Int": {
              "val": 400,
              "span": {
                "start": 40390,
                "end": 40393
              }
            }
          }
        },
        "redirect_stdout": true,
        "redirect_stderr": false
      }
    }
  }
}
```

### `Option`

设置影响引擎如何处理插件的选项。此消息不需要响应。

#### `GcDisabled` 选项

设置为 `true` 可停止插件被自动垃圾回收，或设置为 `false` 可再次启用。

示例：

```json
{
  "Option": {
    "GcDisabled": true
  }
}
```

## 流消息

流可以由插件和引擎发送。发送流的代理称为*生产者*，接收流的代理称为*消费者*。

所有流消息都引用一个流 ID。此标识符是从零开始的整数，由生产者在描述流用途的消息中指定：例如，[`Call`](#call) 或 [`CallResponse`](#callresponse)。生产者**不应该**重用之前使用过的标识符。最明显的实现是顺序的，每个新流获得一个递增的数字。流 ID 不需要在插件和引擎之间完全唯一：来自插件的流 `0` 和来自引擎的流 `0` 是不同的流。

### `Data`

此消息从生产者发送到消费者。主体是一个 2 元组（数组）：(`id`, `data`)。

`data` 对于列表流是 `List` 映射，其中主体是要发送的 [`Value`](#value)，对于原始流是 `Raw`，其中主体是带有字节缓冲区的 `Ok` 映射，或带有 [`LabeledError`](#labelederror) 的 `Err` 映射。

示例：

```json
{
  "Data": [
    0,
    {
      "List": {
        "String": {
          "val": "Hello, world!",
          "span": {
            "start": 40000,
            "end": 40015
          }
        }
      }
    }
  ]
}
```

```json
{
  "Data": [
    0,
    {
      "Raw": {
        "Ok": [72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33]
      }
    }
  ]
}
```

```json
{
  "Data": [
    0,
    {
      "Raw": {
        "Err": {
          "IOError": {
            "msg": "disconnected"
          }
        }
      }
    }
  ]
}
```

### `End`

此消息从生产者发送到消费者。主体是单个值 `id`。

**必须**由生产者在流结束时发送。生产者在流结束后**不得**再发送任何 [`Data`](#data) 消息。

消费者**必须**发送 [`Drop`](#drop) 作为回复，除非流结束是因为消费者选择丢弃流。

示例：

```json
{
  "End": 0
}
```

### `Ack`

此消息从消费者发送到生产者。主体是单个值 `id`。

由消费者发送以回复每个 [`Data`](#data) 消息，表明消费者已完成处理该消息。`Ack` 用于流量控制。如果消费者不需要立即处理流，或者难以跟上，它**不应该**发送 `Ack` 消息，直到准备好处理更多 `Data`。

示例：

```json
{
  "Ack": 0
}
```

### `Drop`

此消息从消费者发送到生产者。主体是单个值 `id`。

由消费者发送以表示对来自流的进一步消息不感兴趣。生产者**可以**在收到 `Drop` 后发送额外的 [`Data`](#data) 消息，但**应该**努力停止发送消息并尽快 [`End`](#end) 流。

消费者**不应该**将在 `Drop` 之后发送的 `Data` 消息视为错误，除非已经收到 `End`。

生产者**必须**发送 `End` 作为回复，除非流结束是因为生产者结束了流。

示例：

```json
{
  "Drop": 0
}
```

## 插件中的信号处理

插件可以通过注册处理程序来响应从引擎发送的信号，例如中断（Ctrl+C）或重置。插件的信号处理方法允许对用户或系统操作进行自定义响应，增强插件与 Nu 引擎的集成。

### `register_signal_handler`

`register_signal_handler` 方法允许插件注册一个处理程序，该处理程序将在收到信号时被调用。此方法接受具有以下签名的闭包：

```rust
|action: SignalAction| { ... }
```

闭包将使用从引擎接收的 `SignalAction` 变体调用。此方法返回一个 RAII 守卫，确保处理程序保持活动状态直到被丢弃。

#### 示例用法

以下是注册处理程序以响应 `Interrupt` 和 `Reset` 信号的示例：

```rust
let _guard = engine.register_signal_handler(Box::new(move |action| {
    match action {
        SignalAction::Interrupt => println!("Interrupt signal received"),
        SignalAction::Reset => println!("Reset signal received"),
    }
}));
```

#### `signals()`

`signals()` 方法允许插件检查信号状态，特别是 `Interrupt`。此方法返回一个 `Signals` 结构体，其中包括 `interrupted()` 方法，指示是否发生了中断。

```rust
if engine.signals().interrupted() {
    println!("Operation was interrupted.");
}
```

使用 `signals().interrupted()` 来检查中断状态，特别是在管理长时间运行的操作时。

## 编码

### JSON

JSON 编码将消息定义为 JSON 对象。不需要分隔符或填充。消息对象内部以及消息之间的空白字符（包括换行符）都是允许的。

引擎对其发出的格式更加严格：每条消息都以换行符结尾，并且消息内部不会发出不必要的空白字符和换行符。明确支持插件通过将接收的每一行解析为单独的消息来选择解析来自引擎的输入，因为这在所有语言中最常见。

字节数组被编码为表示每个字节的数字的普通 JSON 数组。虽然这效率低下，但具有最大的可移植性。

如果追求性能，**应该**尽可能首选 MessagePack，特别是如果字节流预计是插件的常见输入或输出。

### MessagePack

[MessagePack](https://msgpack.org) 是一种面向机器的二进制编码格式，其数据模型与 JSON 非常相似。消息被编码为映射。消息之间没有分隔符，也不接受填充字符。

大多数消息的编码方式与其 JSON 对应物相同。例如，以下 JSON 中的 [`Hello`](#hello) 消息：

```json
{
  "Hello": {
    "protocol": "nu-plugin",
    "version": "0.94.0",
    "features": []
  }
}
```

在 MessagePack 格式中编码为：

```text
81                   // 映射，一个元素
  a5 "Hello"         // 5 字符字符串
  83                 // 映射，三个元素
    a8 "protocol"    // 8 字符字符串
    a9 "nu-plugin"   // 9 字符字符串
    a7 "version"     // 7 字符字符串
    a6 "0.94.0"      // 6 字符字符串
    a8 "features"    // 8 字符字符串
    90               // 数组，零个元素
```

（逐字字节字符串为可读性而引用，不可打印字节以十六进制表示）

字节数组使用 MessagePack 的原生字节数组编码，这对字节内部的格式施加零约束。通常，MessagePack 编码比 JSON 高效得多，对于性能重要且 MessagePack 可用的插件，**应该**是首选。

<a name="value"></a>

## 值类型

[Rust 文档](https://docs.rs/nu-protocol/latest/nu_protocol/enum.Value.html)

`Value` 枚举描述了 Nu 中使用的所有结构化数据。

示例：

```json
{
  "Int": {
    "val": 5,
    "span": {
      "start": 90960,
      "end": 90963
    }
  }
}
```

### `Bool`

布尔值。

| 字段     | 类型            |
| -------- | --------------- |
| **val**  | boolean         |
| **span** | [`Span`](#span) |

示例：

```nu
true
```

```json
{
  "Bool": {
    "val": true,
    "span": {
      "start": 4040,
      "end": 4044
    }
  }
}
```

### `Int`

64 位有符号整数。

| 字段     | 类型            |
| -------- | --------------- |
| **val**  | integer         |
| **span** | [`Span`](#span) |

示例：

```nu
-2
```

```json
{
  "Int": {
    "val": -2,
    "span": {
      "start": 4040,
      "end": 4042
    }
  }
}
```

### `Float`

64 位（双精度）浮点数。

| 字段     | 类型            |
| -------- | --------------- |
| **val**  | double          |
| **span** | [`Span`](#span) |

示例：

```nu
36.4
```

```json
{
  "Float": {
    "val": 36.4,
    "span": {
      "start": 8040,
      "end": 8044
    }
  }
}
```

### `Filesize`

字节数量，内部是表示字节数的 64 位有符号整数。这以更人性化的比例（例如 `32.4 MiB`）漂亮地打印给用户。

| 字段     | 类型            |
| -------- | --------------- |
| **val**  | integer         |
| **span** | [`Span`](#span) |

示例：

```nu
32.4MiB
```

```json
{
  "Filesize": {
    "val": 33973248,
    "span": {
      "start": 7740,
      "end": 7747
    }
  }
}
```

### `Duration`

时间持续时间，内部是表示纳秒数的 64 位有符号整数。这以更人性化的比例（例如 `8sec 375ms 604µs 528ns`）漂亮地打印给用户。

| 字段     | 类型            |
| -------- | --------------- |
| **val**  | integer         |
| **span** | [`Span`](#span) |

示例：

```nu
8375604528ns
```

```json
{
  "Duration": {
    "val": 8375604528,
    "span": {
      "start": 181462,
      "end": 181465
    }
  }
}
```

### `Date`

日期/时间值，包括时区，以 [RFC 3339](https://www.rfc-editor.org/rfc/rfc3339) 格式表示。这根据用户的区域设置打印给用户。

| 字段     | 类型            |
| -------- | --------------- |
| **val**  | string          |
| **span** | [`Span`](#span) |

示例：

```nu
1996-12-19T16:39:57-08:00
```

```json
{
  "Date": {
    "val": "1996-12-19T16:39:57-08:00",
    "span": {
      "start": 181525,
      "end": 181528
    }
  }
}
```

### `Range`

值的范围。

| 字段     | 类型            |
| -------- | --------------- |
| **val**  | `Range`         |
| **span** | [`Span`](#span) |

`Range` 有两个变体，`IntRange` 和 `FloatRange`：

#### `IntRange`

| 字段      | 类型            |
| --------- | --------------- |
| **start** | integer         |
| **step**  | integer         |
| **end**   | `Bound` integer |

示例：

```nu
0..
```

```json
{
  "Range": {
    "val": {
      "IntRange": {
        "start": 0,
        "step": 1,
        "end": "Unbounded"
      }
    },
    "span": {
      "start": 1380,
      "end": 1383
    }
  }
}
```

```nu
7..10
```

```json
{
  "Range": {
    "val": {
      "IntRange": {
        "start": 7,
        "step": 1,
        "end": { "Included": 10 }
      }
    },
    "span": {
      "start": 1380,
      "end": 1385
    }
  }
}
```

```nu
7..<10
```

```json
{
  "Range": {
    "val": {
      "IntRange": {
        "start": 7,
        "step": 1,
        "end": { "Excluded": 10 }
      }
    },
    "span": {
      "start": 1380,
      "end": 1386
    }
  }
}
```

```nu
0..64..128
```

```json
{
  "Range": {
    "val": {
      "IntRange": {
        "start": 0,
        "step": 64,
        "end": { "Included": 128 }
      }
    },
    "span": {
      "start": 1380,
      "end": 1390
    }
  }
}
```

#### `FloatRange`

与 [`IntRange`](#intrange) 相同，但用于浮点数。

| 字段      | 类型           |
| --------- | -------------- |
| **start** | double         |
| **step**  | double         |
| **end**   | `Bound` double |

示例：

```nu
7.5..10.5
```

```json
{
  "Range": {
    "val": {
      "FloatRange": {
        "start": 7.5,
        "step": 1,
        "end": { "Included": 10.5 }
      }
    },
    "span": {
      "start": 1380,
      "end": 1389
    }
  }
}
```

### `String`

UTF-8 字符串。

| 字段     | 类型            |
| -------- | --------------- |
| **val**  | string          |
| **span** | [`Span`](#span) |

示例：

```nu
"Hello, nu!"
```

```json
{
  "String": {
    "val": "Hello, nu!",
    "span": {
      "start": 8990,
      "end": 9002
    }
  }
}
```

### `Glob`

文件系统通配符，根据通配符的扩展选择多个文件或目录。

如果 `no_expand` 为 true，则禁用通配符扩展，这仅作为文字路径使用。

| 字段          | 类型            |
| ------------- | --------------- |
| **val**       | string          |
| **no_expand** | boolean         |
| **span**      | [`Span`](#span) |

示例：

```nu
"src/**/*.rs" | into glob
```

```json
{
  "Glob": {
    "val": "src/**/*.rs",
    "no_expand": false,
    "span": {
      "start": 9400,
      "end": 9413
    }
  }
}
```

### `Record`

关联键值映射。如果记录包含在列表中，这将呈现为表格。键始终是字符串，但值可以是任何类型。

| 字段     | 类型                            |
| -------- | ------------------------------- |
| **val**  | map: string ⇒ [`Value`](#value) |
| **span** | [`Span`](#span)                 |

示例：

```nu
{foo: 5, bar: "hello nushell"}
```

```json
{
  "Record": {
    "val": {
      "foo": {
        "Int": {
          "val": 42,
          "span": {
            "start": 659813,
            "end": 659814
          }
        }
      },
      "bar": {
        "String": {
          "val": "hello nushell",
          "span": {
            "start": 659821,
            "end": 659836
          }
        }
      }
    },
    "span": {
      "start": 659807,
      "end": 659837
    }
  }
}
```

### `List`

任何类型的值列表。

| 字段     | 类型                    |
| -------- | ----------------------- |
| **vals** | [`Value`](#value) array |
| **span** | [`Span`](#span)         |

示例：

```nu
[1, 2, foo, bar]
```

```json
{
  "List": {
    "vals": [
      {
        "Int": {
          "val": 1,
          "span": {
            "start": 659951,
            "end": 659952
          }
        }
      },
      {
        "Int": {
          "val": 2,
          "span": {
            "start": 659954,
            "end": 659955
          }
        }
      },
      {
        "String": {
          "val": "foo",
          "span": {
            "start": 659957,
            "end": 659960
          }
        }
      },
      {
        "String": {
          "val": "bar",
          "span": {
            "start": 659962,
            "end": 659965
          }
        }
      }
    ],
    "span": {
      "start": 659950,
      "end": 659966
    }
  }
}
```

### `Block`

对已解析的 Nushell 代码块的引用，不包含任何捕获的变量。

| 字段     | 类型                        |
| -------- | --------------------------- |
| **val**  | unsigned integer (block id) |
| **span** | [`Span`](#span)             |

示例：

```json
{
  "Block": {
    "val": 44500,
    "span": {
      "start": 59400,
      "end": 59480
    }
  }
}
```

### `Closure`

对已解析的 Nushell 代码块的引用，包含从作用域捕获的变量。

| 字段     | 类型            |
| -------- | --------------- |
| **val**  | `Closure`       |
| **span** | [`Span`](#span) |

`Closure` 定义为：

| 字段         | 类型                                                          |
| ------------ | ------------------------------------------------------------- |
| **block_id** | unsigned integer                                              |
| **captures** | array of pairs (unsigned integer `var_id`, [`Value`](#value)) |

插件**不应该**尝试检查闭包的内容。建议仅将其用作 [`EvalClosure` 引擎调用](#evalclosure-engine-call)的参数。闭包的确切表示可能会在未来更改，以避免序列化所有捕获。

示例：

```nu
let foo = "bar"
{ || $foo }
```

```json
{
  "Closure": {
    "val": {
      "block_id": 1965,
      "captures": [
        [
          862,
          {
            "String": {
              "val": "bar",
              "span": {
                "start": 660030,
                "end": 660041
              }
            }
          }
        ]
      ]
    },
    "span": {
      "start": 660030,
      "end": 660041
    }
  }
}
```

### `Nothing`

值的缺失，在 Nushell 中由 `null` 表示。

| 字段     | 类型            |
| -------- | --------------- |
| **span** | [`Span`](#span) |

示例：

```nu
null
```

```json
{
  "Nothing": {
    "span": {
      "start": 64550,
      "end": 64554
    }
  }
}
```

### `Error`

值中包含的错误。尝试对值进行操作很可能会导致错误被转发。编写插件时，错误值通常应通过在遇到时从命令返回错误来处理。

| 字段     | 类型                            |
| -------- | ------------------------------- |
| **val**  | [`LabeledError`](#labelederror) |
| **span** | [`Span`](#span)                 |

示例：

```nu
error make {
  msg: "foo"
  label: {
    text: "bar"
    span: {
      start: 0
      end: 0
    }
  }
}
```

```json
{
  "Error": {
    "val": {
      "msg": "foo",
      "labels": [
        {
          "text": "bar",
          "span": {
            "start": 0,
            "end": 0
          }
        }
      ],
      "code": null,
      "url": null,
      "help": null,
      "inner": []
    }
  }
}
```

### `Binary`

原始字节数组。这有时从检测到非有效 UTF-8 数据的操作返回，但也可以使用 `into binary` 或二进制字面量创建。

| 字段     | 类型            |
| -------- | --------------- |
| **val**  | byte array      |
| **span** | [`Span`](#span) |

请注意，字节数组在 [JSON](#json) 和 [MessagePack](#messagepack) 中的编码不同 - 前者使用数字数组，但后者使用原生字节数组支持。

示例：

```nu
0x[aa bb cc dd]
```

```json
{
  "Binary": {
    "val": [170, 187, 204, 221],
    "span": {
      "start": 659637,
      "end": 659652
    }
  }
}
```

### `CellPath`

表示进入列表、记录和表格子字段的路径。

| 字段     | 类型            |
| -------- | --------------- |
| **val**  | `CellPath`      |
| **span** | [`Span`](#span) |

`CellPath` 定义为：

| 字段        | 类型         |
| ----------- | ------------ |
| **members** | `PathMember` |

`PathMember` 有两个变体，`String` 或 `Int`，并且都包含以下字段：

| 字段         | 类型                      |
| ------------ | ------------------------- |
| **val**      | string / unsigned integer |
| **span**     | [`Span`](#span)           |
| **optional** | boolean                   |

可选路径成员如果无法访问不会导致错误 - 路径访问将返回 [`Nothing`](#nothing)。

示例：

```nu
foo.0?.bar
# [foo {value: 0, optional: true} bar] | into cell-path
```

```json
{
  "CellPath": {
    "val": {
      "members": [
        {
          "String": {
            "val": "foo",
            "span": {
              "start": 659835,
              "end": 659838
            },
            "optional": false
          }
        },
        {
          "Int": {
            "val": 0,
            "span": {
              "start": 659847,
              "end": 659848
            },
            "optional": true
          }
        },
        {
          "String": {
            "val": "bar",
            "span": {
              "start": 659866,
              "end": 659869
            },
            "optional": false
          }
        }
      ]
    },
    "span": {
      "start": 659873,
      "end": 659887
    }
  }
}
```

### `Custom`

表示使用自定义功能扩展基础 nushell 类型的数据类型。插件可以使用自定义值来实现类似本地的数据类型，这些类型可以通过单元格路径索引、通过运算符操作，并以插件定义的方式进行比较。

插件的 `Custom` 值**可能**仅包含以下内容映射：

| 字段               | 类型       | 描述                                                                       |
| ------------------ | ---------- | -------------------------------------------------------------------------- |
| **type**           | string     | **必须**为 `"PluginCustomValue"`。                                         |
| **name**           | string     | 插件发出的人类可读的自定义值名称。                                         |
| **data**           | byte array | 插件定义的自定义值表示。                                                   |
| **notify_on_drop** | boolean    | 启用[丢弃通知](plugins.md#drop-notification)。如果不存在，默认为 `false`。 |

插件只会收到它们之前发出的自定义值。不允许发送来自其他插件的自定义值或在 Nu 引擎本身内使用的自定义值。

`notify_on_drop` 是一个可选字段，如果为 `false`**应该**省略，以节省字节。如果这对你的实现不方便，`"notify_on_drop": false` 仍然有效，但最好不包含它。

示例：

```json
{
  "Custom": {
    "val": {
      "type": "PluginCustomValue",
      "name": "database",
      "data": [36, 190, 127, 40, 12, 3, 46, 83],
      "notify_on_drop": true
    },
    "span": {
      "start": 320,
      "end": 340
    }
  }
}
```

## 嵌入式 Nu 类型

协议中使用的几种类型来自 Nu 源代码的其他地方，特别是 [`nu-protocol`](https://docs.rs/nu-protocol) crate。

Rust 枚举通常以 [serde](https://serde.rs) 的默认格式编码：

```javascript
"Variant"             // Variant
{ "Variant": value }  // Variant(value)
{ "Variant": [a, b] } // Variant(a, b)
{
  "Variant": {
    "one": 1,
    "two": 2
  }
}                     // Variant { one: 1, two: 2 }
```

结构体被编码为其字段的映射，没有结构体名称。

### `Span`

[文档](https://docs.rs/nu-protocol/latest/nu_protocol/span/struct.Span.html)

描述引擎内存中的代码区域，主要用于向用户提供诊断错误消息，其中包含有关导致错误的值来源的上下文。

| 字段      | 类型    | 描述                           |
| --------- | ------- | ------------------------------ |
| **start** | integer | 引用的第一个字符的索引。       |
| **end**   | integer | 引用的最后一个字符之后的索引。 |

### `PipelineDataHeader`

描述单个值或流的开始。

| 变体                                       | 描述                 |
| ------------------------------------------ | -------------------- |
| [`Empty`](#empty-header-variant)           | 不产生值；空流。     |
| [`Value`](#value-header-variant)           | 单个值               |
| [`ListStream`](#liststream-header-variant) | 指定将发送的列表流。 |
| [`ByteStream`](#bytestream-header-variant) | 指定将发送的字节流。 |

#### `Empty` 头变体

空流。不会发送任何内容。没有标识符，这等同于 `Nothing` 值。

表示形式是以下字符串：

```json
"Empty"
```

#### `Value` 头变体

单个值。不启动流，因此没有标识符。包含一个 [`Value`](#value)。

示例：

```json
{
  "Value": {
    "Int": {
      "val": 2,
      "span": {
        "start": 9090,
        "end": 9093
      }
    }
  }
}
```

#### `ListStream` 头变体

启动列表流。期望具有引用 ID 的 `List` 变体的 [`Data`](#data) 消息。

包含 <a name="liststreaminfo">`ListStreamInfo`</a>，一个映射：

| 字段     | 类型            | 描述                 |
| -------- | --------------- | -------------------- |
| **id**   | integer         | 流标识符             |
| **span** | [`Span`](#span) | 导致流的源代码引用。 |

示例：

```json
{
  "ListStream": {
    "id": 2,
    "span": {
      "start": 33911,
      "end": 33942
    }
  }
}
```

#### `ByteStream` 头变体

启动字节流。期望具有引用 ID 的 `Raw` 变体的 [`Data`](#data) 消息。

| 字段     | 类型                                | 描述                 |
| -------- | ----------------------------------- | -------------------- |
| **id**   | integer                             | 流标识符             |
| **span** | [`Span`](#span)                     | 导致流的源代码引用。 |
| **type** | [`ByteStreamType`](#bytestreamtype) | 流的预期类型。       |

<a name="bytestreamtype"></a> 字节流携带一个 `type` 字段，包含以下三个字符串之一：

| `type`      | 含义                                                            |
| ----------- | --------------------------------------------------------------- |
| `"Binary"`  | 流包含未知编码的二进制数据，应视为 `binary` 值。                |
| `"String"`  | 流包含有效 UTF-8 的文本数据，应视为 `string` 值。               |
| `"Unknown"` | 字节流的类型未知，应根据其内容是否可以解码为有效 UTF-8 来推断。 |

`Unknown` 类型由 Nu 用于表示外部命令的输出，如果它们没有通过 [`into string`](/commands/docs/into_string.md) 或 [`into binary`](/commands/docs/into_binary.md) 来显式设置其类型。声明输出类型仅为 `string` 或 `binary` 的命令**必须**适当地显式键入其输出字节流，以确保它们强制转换为正确的类型，而不是使用 `Unknown`。

示例：

```json
{
  "ByteStream": {
    "id": 7,
    "span": {
      "start": 49011,
      "end": 49027
    },
    "type": "String"
  }
}
```

### `LabeledError`

[文档](https://docs.rs/nu-protocol/latest/nu_protocol/struct.LabeledError.html)

灵活、通用的错误类型，具有任意数量的带标签的范围。

| 字段       | 类型                  | 描述                                                                   |
| ---------- | --------------------- | ---------------------------------------------------------------------- |
| **msg**    | string                | 在错误顶部显示的主要错误消息。                                         |
| **labels** | `ErrorLabel` array?   | 在源代码中标记错误的范围和消息。                                       |
| **code**   | string?               | 唯一且搜索友好的代码，可以匹配，例如 `nu::shell::missing_config_value` |
| **url**    | string?               | 链接到有关错误的附加信息的 URL。                                       |
| **help**   | string?               | 错误的附加帮助，通常是关于用户可以尝试什么的提示。                     |
| **inner**  | `LabeledError` array? | 错误引用的附加错误，可能是此错误的原因。                               |

大多数字段不是必需的 - 只有 `msg` 必须存在。`ErrorLabel`（在 `labels` 数组中）如下：

| 字段     | 类型            | 描述                         |
| -------- | --------------- | ---------------------------- |
| **text** | string          | 标签的消息。                 |
| **span** | [`Span`](#span) | 标签应指向的源代码中的范围。 |

::: tip
在阅读 `nu-plugin` crates 的 Rust 源代码时，此处指定 `LabeledError` 的许多地方实际上在该实现中表示为 `ShellError`。但是，`ShellError` 总是序列化为 `LabeledError`，因此协议中可以忽略两者之间的差异。
:::

示例：

```json
{
  "msg": "A really bad error occurred",
  "labels": [
    {
      "text": "I don't know, but it's over nine thousand!",
      "span": {
        "start": 9001,
        "end": 9007
      }
    }
  ],
  "code": "my_plugin::bad::really_bad",
  "url": "https://example.org/my_plugin/error/bad/really_bad.html",
  "help": "you can solve this by not doing the bad thing",
  "inner": [
    {
      "msg": "The bad thing"
    }
  ]
}
```

### `Config`

[文档](https://docs.rs/nu-protocol/latest/nu_protocol/struct.Config.html)

此结构体描述了 Nushell 的配置。它相当大且经常变化，因此如果你需要其中的任何内容，请参阅 Rust 文档。

### `Ordering`

[文档](https://doc.rust-lang.org/stable/std/cmp/enum.Ordering.html)

我们将 Rust `Ordering` 类型序列化为字面字符串，例如：

```js
'Less'; // 左侧小于右侧
'Equal'; // 两个值相等
'Greater'; // 左侧大于右侧
```

### `Operator`

[文档](https://docs.rs/nu-protocol/latest/nu_protocol/ast/enum.Operator.html)

使用 serde 的默认枚举表示法进行序列化。示例：

```js
{ "Math": "Append" }           // ++   Math(Append)
{ "Bits": "BitOr" }            // |    Bits(BitOr)
{ "Comparison": "RegexMatch" } // =~   Comparison(RegexMatch)
```

### `SignalAction`

`SignalAction` 枚举用于指定插件应响应来自引擎的信号而采取的操作。

| 变体        | 描述                                                                      |
| ----------- | ------------------------------------------------------------------------- |
| `Interrupt` | 表示收到了中断信号（例如 Ctrl+C）。插件应暂停、停止或结束其操作。         |
| `Reset`     | 表示来自引擎 `reset_signals` 函数的重置信号。插件应重置任何内部信号状态。 |

此枚举可以与 `register_signal_handler` 结合使用，以便在收到每种信号类型时执行特定任务。
