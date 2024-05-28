---
title: Plugin protocol reference
---

# Plugin protocol reference

## How Nu runs plugins

Nu plugins **must** be an executable file with a filename starting with `nu_plugin_`. Plugins can run in one of two modes:

1. Stdio mode, which **must** be supported. The plugin is passed `--stdio` as a command line argument. All interaction with the plugin is handled over standard input (stdin) and output (stdout). Standard error (stderr) is not redirected, and can be used by the plugin to print messages directly.

2. Local socket mode, which **may** be supported (advertised via the [`LocalSocket` feature](#localsocket-feature)). The plugin is passed `--local-socket` as the first command line argument, and then the path of the Unix domain socket or name of the Windows named pipe to use for communication. None of the standard input or output streams are redirected, and they may all be used to interact with the user's terminal. See the [documentation](#localsocket-feature) specific to the feature for more details.

Other command line arguments are reserved for options that might be added in the future, including other communication methods. Plugins that support the protocol as described in this document **should** reject other arguments and print an informational message to stderr.

Immediately after spawning a plugin, Nu expects the plugin to send its encoding type. Currently two encoding types are supported: [`json`](#json) and [`msgpack`](#messagepack). The desired encoding type **should** be sent first with the length of the string as a single byte integer and then the encoding type string. That is, with C-like escape syntax, `"\x04json"` or `"\x07msgpack"`. In this document, the JSON format will be used for readability, but the MessagePack format is largely equivalent. See the [Encoding](#encoding) section for specific intricacies of the formats.

Nu will then send messages in the desired encoding. The first message is always [`Hello`](#hello). The plugin **must** send a `Hello` message indicating the expected Nu version that it is compatible with, and any supported protocol features. The engine will also send a `Hello` message with its version, and any supported protocol features. The plugin **may** verify that it is compatible with the Nu version provided by the engine, but the engine will end communication with a plugin if it is determined to be unsupported. The plugin **must not** use protocol features it supports if they are not also confirmed to be supported by the engine in its `Hello` message. It is not permitted to send any other messages before sending `Hello`.

The plugin **should** then receive and respond to messages until its input stream is closed.

Typical plugin interaction after the initial handshake looks like this:

1. The engine sends a [`Call`](#call). The call contains an ID used to identify the response.
2. If the `input` of the call specified a stream, the engine will send [stream messages](#stream-messages). These do not need to be consumed before the plugin sends its response.
3. The plugin sends a [`CallResponse`](#callresponse), with the same ID from step 1.
4. If the plugin specified stream data as output in the response, it **should** now send [stream messages](#stream-messages) with the corresponding stream ID(s).

The plugin **should** respond to further plugin calls. The engine **may** send additional plugin calls before responses have been received, and it is up to the plugin to decide whether to handle each call immediately as it is received, or to process only one at a time and hold on to them for later. In any case, sending another plugin call before a response has been received **should not** cause an error.

The plugin **may** send [engine calls](#enginecall) during the execution of a call to request operations from the engine. Engine calls are [only valid within the context of a call](#enginecall-context) and may not be sent otherwise.

The engine **may** send a [`Goodbye`](#goodbye) message to the plugin indicating that it will no longer send any more plugin calls. Upon receiving this message, the plugin **may** choose not to accept any more plugin calls, and **should** exit after any in-progress plugin calls have finished.

## `Hello`

After the encoding type has been decided, both the engine and plugin **must** send a `Hello` message containing relevant version and protocol support information.

| Field        | Type   | Usage                                                                                 |
| ------------ | ------ | ------------------------------------------------------------------------------------- |
| **protocol** | string | **Must** be `"nu-plugin"`.                                                            |
| **version**  | string | The engine's version, or the target version of Nu that the plugin supports.           |
| **features** | array  | Protocol features supported by the plugin. Unrecognized elements **must** be ignored. |

To be accepted, the `version` specified **must** be [semver](https://semver.org) compatible with the engine's version. "0.x.y" and "x.y.z" for differing values of "x" are considered to be incompatible.

Plugins **may** decide to refuse engine versions with more strict criteria than specified here.

Example:

```json
{
  "Hello": {
    "protocol": "nu-plugin",
    "version": "0.94.0",
    "features": []
  }
}
```

### Features

All features are maps that **must** contain at least a `name` key, and **may** contain other keys. Features that are not recognized by `name` **must** be ignored, and not cause an error. Plugins **must** only advertise support for features they implement, and **should not** determine the features they will advertise depending on the engine's `Hello` message.

#### `LocalSocket` feature

This feature advertises support for local socket communication, instead of stdio.

Example:

```json
{
  "name": "LocalSocket"
}
```

When local socket communication is advertised to an engine supporting the feature, the engine will cease stdio communication and launch the plugin again with the `--local-socket` command line argument. The second argument is either a path to a Unix domain socket on Linux, Android, macOS, and other Unix-like operating systems, or the name of a named pipe (without the `\\.\pipe\` prefix) on Windows.

In either case, during startup, the plugin is expected to establish two separate connections to the socket, in this order:

1. The input stream connection, used to send messages from the engine to the plugin
2. The output stream connection, used to send messages from the plugin to the engine

The connections are separate in order to facilitate ownership of the streams by separate threads. After these connections are both established, the engine will remove the socket, and will not accept further connections.

If local socket communication fails to initialize, the engine will abort, stop the plugin, and start it again with the stdio mode, even if the plugin supports local sockets. Whether local socket mode initialized successfully, and therefore the plugin is allowed to use stdio, can be observed when
[`EngineInterface::is_using_stdio()`](https://docs.rs/nu-plugin/latest/nu_plugin/struct.EngineInterface.html#method.is_using_stdio) returns `false` for Rust plugins.

## Input messages

These are messages sent from the engine to the plugin. [`Hello`](#hello) and [`Stream messages`](#stream-messages) are also included.

### `Call`

The body of this message is a 2-tuple (array): (`id`, `call`). The engine sends unique IDs for each plugin call it makes. The ID is needed to send the [`CallResponse`](#callresponse).

#### `Signature` plugin call

Ask the plugin to send its command signatures. Takes no arguments. Returns [`Signature`](#signature-plugin-call-response) or [`Error`](#error-plugin-call-response)

Example:

```json
{
  "Call": [0, "Signature"]
}
```

#### `Run` plugin call

Tell the plugin to run a command. The argument is the following map:

| Field     | Type                                        | Usage                                                 |
| --------- | ------------------------------------------- | ----------------------------------------------------- |
| **name**  | string                                      | The name of the command to run                        |
| **call**  | [`EvaluatedCall`](#evaluatedcall)           | Information about the invocation, including arguments |
| **input** | [`PipelineDataHeader`](#pipelinedataheader) | Pipeline input to the command                         |

<a name="evaluatedcall"></a>

`EvaluatedCall` is a map:

| Field          | Type                                              | Usage                                                   |
| -------------- | ------------------------------------------------- | ------------------------------------------------------- |
| **head**       | [`Span`](#span)                                   | The position of the beginning of the command execution. |
| **positional** | [`Value`](#value) array                           | Positional arguments.                                   |
| **named**      | 2-tuple (string, [`Value`](#value) or null) array | Named arguments, such as switches.                      |

Named arguments are always sent by their long name, never their short name.

Returns [`PipelineData`](#pipelinedata-plugin-call-response) or [`Error`](#error-plugin-call-response).

Example:

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

#### `CustomValueOp` plugin call

Perform an operation on a custom value received from the plugin. The argument is a 2-tuple (array): (`custom_value`, `op`).

The custom value is specified in spanned format, as a [`PluginCustomValue`](#plugincustomvalue) without the `type` field, and not as a `Value` - see the examples.

##### `ToBaseValue`

Returns a plain value that is representative of the custom value, or an error if this is not possible. Sending a custom value back for this operation is not allowed. The response type is [`PipelineData`](#pipelinedata-plugin-call-response) or [`Error`](#error-plugin-call-response). If the operation produces a stream, it will be consumed to a value.

Example:

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

Returns the result of following a numeric cell path (e.g. `$custom_value.0`) on the custom value. This is most commonly used with custom types that act like lists or tables. The argument is a spanned unsigned integer. The response type is [`PipelineData`](#pipelinedata-plugin-call-response) or [`Error`](#error-plugin-call-response). The result **may** be another custom value. If the operation produces a stream, it will be consumed to a value.

Example:

```nushell
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

Returns the result of following a string cell path (e.g. `$custom_value.field`) on the custom value. This is most commonly used with custom types that act like lists or tables. The argument is a spanned string. The response type is [`PipelineData`](#pipelinedata-plugin-call-response) or [`Error`](#error-plugin-call-response). The result **may** be another custom value. If the operation produces a stream, it will be consumed to a value.

Example:

```nushell
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

Compares the custom value to another value and returns the [`Ordering`](#ordering) that should be used, if any. The argument type is a [`Value`](#value), which may be any value - not just the same custom value type. The response type is [`Ordering`](#ordering-plugin-call-response). [`Error`](#error-plugin-call-response) may also be returned, but at present the error is unlikely to be presented to the user - the engine will act as if you had sent `{"Ordering": null}`.

Example (comparing two `version` custom values):

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

Returns the result of evaluating an [`Operator`](#operator) on this custom value with another value. The argument is a 2-tuple: (`operator`, `value`), where `operator` is a spanned [`Operator`](#operator) and `value` is a [`Value`](#value), which may be any value - not just the same custom value type. The response type is [`PipelineData`](#pipelinedata-plugin-call-response) or [`Error`](#error-plugin-call-response). The result **may** be another custom value. If the operation produces a stream, it will be consumed to a value.

Example:

```nushell
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

This op is used to notify the plugin that a [`PluginCustomValue`](#plugincustomvalue) that had `notify_on_drop` set to `true` was dropped in the engine - i.e., all copies of it have gone out of scope. For more information on exactly under what circumstances this is sent, see the [drop notification](plugins.md#drop-notification) section of the plugin reference. The response type is [`Empty` pipeline data](#empty-header-variant) or [`Error`](#error-plugin-call-response).

Example:

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

A response to an [engine call](#enginecall) made by the plugin. The argument is a 2-tuple (array): (`engine_call_id`, `engine_call`)

The `engine_call_id` refers to the same number that the engine call being responded to originally contained. The plugin **must** send unique IDs for each engine call it makes. Like [`CallResponse`](#callresponse), there are multiple types of responses:

#### `Error` engine call response

A failure result. Contains a [`LabeledError`](#labelederror).

Example:

```json
{
  "EngineCallResponse": [
    0,
    {
      "Error": {
        "LabeledError": {
          "msg": "The connection closed.",
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

#### `PipelineData` engine call response

A successful result with a Nu [`Value`](#value) or stream. The body is a [`PipelineDataHeader`](#pipelinedataheader).

Example:

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

#### `Config` engine call response

A successful result of a [`Config` engine call](#config-engine-call). The body is a [`Config`](#config).

Example:

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

This example is abbreviated, as the [`Config`](#config) object is large and ever-changing.

#### `ValueMap` engine call response

A successful result for engine calls that produce plain maps, such as the [`GetEnvVars` engine call](#getenvvars-engine-call). The body is a map from strings to [`Value`s](#value).

Example:

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

### `Goodbye`

Indicate that no further plugin calls are expected, and that the plugin **should** exit as soon as it is finished processing any in-progress plugin calls.

This message is not a map, it is just a bare string, as it takes no arguments.

Example:

```json
"Goodbye"
```

## Output messages

These are messages sent from the plugin to the engine. [`Hello`](#hello) and [`Stream messages`](#stream-messages) are also included.

### `CallResponse`

#### `Error` plugin call response

An error occurred while attempting to fulfill the request. The body is a [`LabeledError`](#labelederror).

It is strongly preferred to provide labeled messages whenever possible to let the user know where the problem might be in their script. If there is no more suitable span from a value that can be used, `head` from [`EvaluatedCall`](#evaluatedcall) is a good fallback.

Example:

```json
{
  "CallResponse": [
    0,
    {
      "Error": {
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
    }
  ]
}
```

#### `Signature` plugin call response

A successful response to a [`Signature` plugin call](#signature-plugin-call). The body is an array of [signatures](https://docs.rs/nu-protocol/latest/nu_protocol/struct.PluginSignature.html).

Example:

```json
{
  "CallResponse": [
    0,
    {
      "Signature": [
        {
          "sig": {
            "name": "len",
            "usage": "calculates the length of its input",
            "extra_usage": "",
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
                "desc": "Display the help message for this command",
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

#### `Ordering` plugin call response

A successful response to the [`PartialCmp` custom value op](#partialcmp). The body is either [`Ordering`](#ordering) if the comparison is possible, or `null` if the values can't be compared.

Example:

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

Example with incomparable values:

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

#### `PipelineData` plugin call response

A successful result with a Nu [`Value`](#value) or stream. The body is a [`PipelineDataHeader`](#pipelinedataheader).

Example:

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

Plugins can make engine calls during execution of a [call](#call). The body is a map with the following keys:

| Field       | Type         | Usage                                                                                   |
| ----------- | ------------ | --------------------------------------------------------------------------------------- |
| **context** | integer      | The ID of the [call](#call) that this engine call relates to.                           |
| **id**      | integer      | A unique ID for this engine call, in order to send the [response](#enginecallresponse). |
| **call**    | `EngineCall` | One of the options described below.                                                     |

<a name="enginecall-context"></a>

The context **must** be an ID of a [call](#call) that was received that is currently in one of two states:

1. The [response](#callresponse) has not been sent yet.
2. The response contained stream data (i.e. [`ListStream`](#liststream-header-variant) or [`ByteStream`](#bytestream-header-variant)), and at least one of the streams started by the response is still sending data (i.e. [`End`](#end) has not been sent).

After a response has been fully sent, and streams have ended, the `context` from that call can no longer be used.

The engine call ID **must** be unique for the lifetime of the plugin, and it is suggested that this be a sequentially increasing number across all engine calls made by the plugin. It is not separated by `context`; the response only contains the `id`.

#### `GetConfig` engine call

Get the Nushell engine configuration. Returns a [`Config` response](#config-engine-call-response) if
successful.

Example:

```json
{
  "EngineCall": {
    "context": 0,
    "id": 0,
    "call": "GetConfig"
  }
}
```

#### `GetPluginConfig` engine call

Get the configuration for the plugin, from its section in `$env.config.plugins.NAME` if present. Returns a [`PipelineData` response](#pipelinedata-engine-call-response) if successful, which will contain either a [`Value`](#value-header-variant) or be [`Empty`](#empty-header-variant) if there is no configuration for the plugin set.

If the plugin configuration was specified as a closure, the engine will evaluate that closure and return the result, which may cause an [error response](#error-engine-call-response).

Example:

```json
{
  "EngineCall": {
    "context": 3,
    "id": 8,
    "call": "GetPluginConfig"
  }
}
```

#### `GetEnvVar` engine call

Get an environment variable from the caller's scope. Returns a [`PipelineData` response](#pipelinedata-engine-call-response) if successful, which will contain either a [`Value`](#value-header-variant) or be [`Empty`](#empty-header-variant) if the environment variable is not present.

Example:

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

#### `GetEnvVars` engine call

Get all environment variables from the caller's scope. Returns a [`ValueMap` response](#valuemap-engine-call-response) if successful, with all of the environment variables in the scope.

Example:

```json
{
  "EngineCall": {
    "context": 9,
    "id": 72,
    "call": "GetEnvVars"
  }
}
```

#### `GetCurrentDir` engine call

Get the current directory path in the caller's scope. This always returns an absolute path as a string [`Value` pipeline data](#value-header-variant) response if successful. The span contained within the value response is unlikely to be useful, and may be zero.

Example:

```json
{
  "EngineCall": {
    "context": 7,
    "id": 40,
    "call": "GetCurrentDir"
  }
}
```

#### `AddEnvVar` engine call

Set an environment variable in the caller's scope. The environment variable can only be propagated to the caller's scope if called before the plugin call response is sent. Either way, it is propagated to other engine calls made within the same context. The argument is a 2-tuple: (`name`, `value`). The response type is [`Empty` pipeline data](#empty-header-variant) when successful.

Example:

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

#### `GetHelp` engine call

Get fully formatted help text for the current command. This can help with implementing top-level commands that just list their subcommands, rather than implementing any specific functionality. The response on success is [`Value` pipeline data](#value-header-variant) that always contains a string.

Example:

```json
{
  "EngineCall": {
    "context": 1,
    "id": 2,
    "call": "GetHelp"
  }
}
```

#### `EnterForeground` engine call

Moves the plugin to the foreground group for direct terminal access, in an operating system-defined manner. This should be called when the plugin is going to drive the terminal in raw mode, for example to implement a terminal UI. It will likely be necessary for the plugin to also be running in [local socket mode](#localsocket-feature) in that case.

This call responds with [`Empty` pipeline data](#empty-header-variant) on success when no action is required by the plugin. On Unix-like operating systems, if the response is [`Value` pipeline data](#value-header-variant), it contains an [`Int`](#int) which is the process group ID the plugin must join using `setpgid()` in order to be in the foreground.

This call will fail with an error if the plugin is already in the foreground.

The plugin **should** call [`LeaveForeground`](#leaveforeground-engine-call) when it no longer needs to be in the foreground. Note that the plugin will also automatically be removed from the foreground when the plugin call response is received, even if the plugin call returns a stream.

Example:

```json
{
  "EngineCall": {
    "context": 0,
    "id": 0,
    "call": "EnterForeground"
  }
}
```

#### `LeaveForeground` engine call

Resets the state set by [`EnterForeground`](#enterforeground-engine-call).

If the plugin had been requested to change process groups by the response of `EnterForeground`, it should also reset that state by calling `setpgid(0)`, since plugins are normally in their own process group.

This call responds with [`Empty` pipeline data](#empty-header-variant) on success.

Example:

```json
{
  "EngineCall": {
    "context": 0,
    "id": 0,
    "call": "LeaveForeground"
  }
}
```

#### `GetSpanContents` engine call

Get the contents of a [`Span`](#span) from the engine. This can be used for viewing the source code that generated a value. The argument is a [`Span`](#span). The response on success is [`Value` pipeline data](3value-header-variant) containing a [`Binary`](#binary) value, as the result is not guaranteed to be valid UTF-8.

Example:

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

#### `EvalClosure` engine call

Pass a [`Closure`](#closure) and arguments to the engine to be evaluated. Returns a [`PipelineData` response](#pipelinedata-engine-call-response) if successful with the output of the closure, which may be a stream.

| Field               | Type                                        | Usage                                                                  |
| ------------------- | ------------------------------------------- | ---------------------------------------------------------------------- |
| **closure**         | spanned [`Closure`](#closure)               | The closure to call, generally from a [`Value`](#value).               |
| **positional**      | [`Value`](#value) array                     | Positional arguments for the closure.                                  |
| **input**           | [`PipelineDataHeader`](#pipelinedataheader) | Input for the closure.                                                 |
| **redirect_stdout** | boolean                                     | Whether to redirect stdout if the closure ends in an external command. |
| **redirect_stderr** | boolean                                     | Whether to redirect stderr if the closure ends in an external command. |

The `Closure` is not wrapped as a `Value` - i.e., it doesn't have `{"Closure": ...}` around it.

Example:

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

### `Option`

Sets options that affect how the engine treats the plugin. No response is expected for this message.

#### `GcDisabled` option

Set to `true` to stop the plugin from being automatically garbage collected, or `false` to enable it again.

Example:

```json
{
  "Option": {
    "GcDisabled": true
  }
}
```

## Stream messages

Streams can be sent by both the plugin and the engine. The agent that is sending the stream is known as the _producer_, and the agent that receives the stream is known as the _consumer_.

All stream messages reference a stream ID. This identifier is an integer starting at zero and is specified by the producer in the message that described what the stream would be used for: for example, [`Call`](#call) or [`CallResponse`](#callresponse). A producer **should not** reuse identifiers it has used once before. The most obvious implementation is sequential, where each new stream gets an incremented number. It is not necessary for stream IDs to be totally unique across both the plugin and the engine: stream `0` from the plugin and stream `0` from the engine are different streams.

### `Data`

This message is sent from producer to consumer. The body is a 2-tuple (array) of (`id`, `data`).

The `data` is either a `List` map for a list stream, in which case the body is the [`Value`](#value) to be sent, or `Raw` for a raw stream, in which case the body is either an `Ok` map with a byte buffer, or an `Err` map with a [`LabeledError`](#labelederror).

Examples:

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

This message is sent from producer to consumer. The body is a single value, the `id`.

**Must** be sent at the end of a stream by the producer. The producer **must not** send any more [`Data`](#data) messages after the end of the stream.

The consumer **must** send [`Drop`](#drop) in reply unless the stream ended because the consumer chose to drop the stream.

Example:

```json
{
  "End": 0
}
```

### `Ack`

This message is sent from consumer to producer. The body is a single value, the `id`.

Sent by the consumer in reply to each [`Data`](#data) message, indicating that the consumer has finished processing that message. `Ack` is used for flow control. If a consumer does not need to process a stream immediately, or is having trouble keeping up, it **should not** send `Ack` messages until it is ready to process more `Data`.

Example:

```json
{
  "Ack": 0
}
```

### `Drop`

This message is sent from consumer to producer. The body is a single value, the `id`.

Sent by the consumer to indicate disinterest in further messages from a stream. The producer **may** send additional [`Data`](#data) messages after `Drop` has been received, but **should** make an effort to stop sending messages and [`End`](#end) the stream as soon as possible.

The consumer **should not** consider `Data` messages sent after `Drop` to be an error, unless `End` has already been received.

The producer **must** send `End` in reply unless the stream ended because the producer ended the stream.

Example:

```json
{
  "Drop": 0
}
```

## Encoding

### JSON

The JSON encoding defines messages as JSON objects. No separator or padding is required. Whitespace within the message object as well as between messages is permitted, including newlines.

The engine is more strict about the format it emits: every message ends with a newline, and unnecessary whitespace and newlines will not be emitted within a message. It is explicitly supported for a plugin to choose to parse the input from the engine by parsing each line received as a separate message, as this is most commonly supported across all languages.

Byte arrays are encoded as plain JSON arrays of numbers representing each byte. While this is inefficient, it is maximally portable.

MessagePack **should** be preferred where possible if performance is desired, especially if byte streams are expected to be a common input or output of the plugin.

### MessagePack

[MessagePack](https://msgpack.org) is a machine-first binary encoding format with a data model very similar to JSON. Messages are encoded as maps. There is no separator between messages, and no padding character is accepted.

Most messages are encoded in the same way as their JSON analogue. For example, the following [`Hello`](#hello) message in JSON:

```json
{
  "Hello": {
    "protocol": "nu-plugin",
    "version": "0.94.0",
    "features": []
  }
}
```

is encoded in the MessagePack format as:

```
81                   // map, one element
  a5 "Hello"         // 5-character string
  83                 // map, three elements
    a8 "protocol"    // 8-character string
    a9 "nu-plugin"   // 9-character string
    a7 "version"     // 7-character string
    a6 "0.94.0"      // 6-character string
    a8 "features"    // 8-character string
    90               // array, zero elements
```

(verbatim byte strings quoted for readability, non-printable bytes in hexadecimal)

Byte arrays are encoded with MessagePack's native byte arrays, which impose zero constraints on the formatting of the bytes within. In general, the MessagePack encoding is much more efficient than JSON and **should** be the first choice for plugins where performance is important and MessagePack is available.

<a name="value"></a>

## Value types

[Rust documentation](https://docs.rs/nu-protocol/latest/nu_protocol/enum.Value.html)

The `Value` enum describes all structured data used in Nu.

Example:

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

A boolean.

| Field    | Type            |
| -------- | --------------- |
| **val**  | boolean         |
| **span** | [`Span`](#span) |

Example:

```nushell
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

A 64-bit signed integer.

| Field    | Type            |
| -------- | --------------- |
| **val**  | integer         |
| **span** | [`Span`](#span) |

Example:

```nushell
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

A 64-bit (double precision) floating point number.

| Field    | Type            |
| -------- | --------------- |
| **val**  | double          |
| **span** | [`Span`](#span) |

Example:

```nushell
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

A quantity of bytes, internally a 64-bit signed integer representing the number of bytes. This is pretty-printed to the user with a more human scale, e.g. `32.4 MiB`.

| Field    | Type            |
| -------- | --------------- |
| **val**  | integer         |
| **span** | [`Span`](#span) |

Example:

```nushell
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

A duration of time, internally a 64-bit signed integer representing the number of nanoseconds. This is pretty-printed to the user with a more human scale, e.g. `8sec 375ms 604µs 528ns`.

| Field    | Type            |
| -------- | --------------- |
| **val**  | integer         |
| **span** | [`Span`](#span) |

Example:

```nushell
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

A date/time value, including the time zone, represented in [RFC 3339](https://www.rfc-editor.org/rfc/rfc3339) format. This is printed to the user according to their locale.

| Field    | Type            |
| -------- | --------------- |
| **val**  | string          |
| **span** | [`Span`](#span) |

Example:

```nushell
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

A range of values.

| Field    | Type            |
| -------- | --------------- |
| **val**  | `Range`         |
| **span** | [`Span`](#span) |

`Range` has two variants, `IntRange` and `FloatRange`:

#### `IntRange`

| Field     | Type            |
| --------- | --------------- |
| **start** | integer         |
| **step**  | integer         |
| **end**   | `Bound` integer |

Examples:

```nushell
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

```nushell
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

```nushell
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

```nushell
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

Identical to [`IntRange`](#intrange) but for floats instead.

| Field     | Type           |
| --------- | -------------- |
| **start** | double         |
| **step**  | double         |
| **end**   | `Bound` double |

Example:

```nushell
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

A UTF-8 string.

| Field    | Type            |
| -------- | --------------- |
| **val**  | string          |
| **span** | [`Span`](#span) |

Example:

```nushell
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

A filesystem glob, selecting multiple files or directories depending on the expansion of wildcards.

If `no_expand` is true, the expansion of wildcards is disabled and this just acts as a literal path.

| Field         | Type            |
| ------------- | --------------- |
| **val**       | string          |
| **no_expand** | boolean         |
| **span**      | [`Span`](#span) |

Example:

```nushell
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

An associative key-value map. If records are contained in a list, this renders as a table. The keys are always strings, but the values may be any type.

| Field    | Type                            |
| -------- | ------------------------------- |
| **val**  | map: string ⇒ [`Value`](#value) |
| **span** | [`Span`](#span)                 |

Example:

```nushell
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

A list of values of any type.

| Field    | Type                    |
| -------- | ----------------------- |
| **vals** | [`Value`](#value) array |
| **span** | [`Span`](#span)         |

Example:

```nushell
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

A reference to a parsed block of Nushell code, without any captured variables.

| Field    | Type                        |
| -------- | --------------------------- |
| **val**  | unsigned integer (block id) |
| **span** | [`Span`](#span)             |

Example:

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

A reference to a parsed block of Nushell code, with variables captured from scope.

| Field    | Type            |
| -------- | --------------- |
| **val**  | `Closure`       |
| **span** | [`Span`](#span) |

`Closure` is defined as:

| Field        | Type                                                          |
| ------------ | ------------------------------------------------------------- |
| **block_id** | unsigned integer                                              |
| **captures** | array of pairs (unsigned integer `var_id`, [`Value`](#value)) |

The plugin **should not** try to inspect the contents of the closure. It is recommended that this is only used as an argument to the [`EvalClosure` engine call](#evalclosure-engine-call). The exact representation of a closure is likely to change in the future to avoid serializing all of the captures.

Example:

```nushell
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

The absence of a value, represented by `null` within Nushell.

| Field    | Type            |
| -------- | --------------- |
| **span** | [`Span`](#span) |

Example:

```nushell
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

An error contained within a value. Trying to operate on the value will most likely cause the error to be forwarded. When writing plugins, error values should typically be handled by returning the error from the command when encountered.

| Field    | Type                            |
| -------- | ------------------------------- |
| **val**  | [`LabeledError`](#labelederror) |
| **span** | [`Span`](#span)                 |

Example:

```nushell
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

An array of raw bytes. This is sometimes returned from operations that detect data that isn't valid as UTF-8, but can also be created with `into binary` or binary literals.

| Field    | Type            |
| -------- | --------------- |
| **val**  | byte array      |
| **span** | [`Span`](#span) |

Note that the encoding of byte arrays in [JSON](#json) and [MessagePack](#messagepack) is different - the former uses an array of numbers, but the latter uses the native byte array support.

Example:

```nushell
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

Represents a path into subfields of lists, records, and tables.

| Field    | Type            |
| -------- | --------------- |
| **val**  | `CellPath`      |
| **span** | [`Span`](#span) |

`CellPath` is defined as:

| Field       | Type         |
| ----------- | ------------ |
| **members** | `PathMember` |

`PathMember` has two variants, `String` or `Int`, and both contain the following fields:

| Field        | Type                      |
| ------------ | ------------------------- |
| **val**      | string / unsigned integer |
| **span**     | [`Span`](#span)           |
| **optional** | boolean                   |

Optional path members will not cause errors if they can't be accessed - the path access will just return [`Nothing`](#nothing) instead.

Example:

```nushell
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

Represents data types that extend the base nushell types with custom functionality. Plugins can use custom values to implement native-like data types that can be indexed by cell paths, operated on by operators, and compared in plugin-defined ways.

`Custom` values for plugins **may** only contain the following content map:

| Field              | Type       | Usage                                                                                     |
| ------------------ | ---------- | ----------------------------------------------------------------------------------------- |
| **type**           | string     | **Must** be `"PluginCustomValue"`.                                                        |
| **name**           | string     | The human-readable name of the custom value emitted by the plugin.                        |
| **data**           | byte array | Plugin-defined representation of the custom value.                                        |
| **notify_on_drop** | boolean    | Enable [drop notification](plugins.md#drop-notification). Default `false` if not present. |

Plugins will only be sent custom values that they have previously emitted. Custom values from other plugins or custom values used within the Nu engine itself are not permitted to be sent to or from the plugin.

`notify_on_drop` is an optional field that **should** be omitted if `false`, to save bytes. If this is not convenient for your implementation, `"notify_on_drop": false` is still valid, but it's preferred to not include it.

Example:

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

## Embedded Nu types

Several types used within the protocol come from elsewhere in Nu's source code, especially the [`nu-protocol`](https://docs.rs/nu-protocol) crate.

Rust enums are usually encoded in [serde](https://serde.rs)'s default format:

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

Structs are encoded as maps of their fields, without the name of the struct.

### `Span`

[Documentation](https://docs.rs/nu-protocol/latest/nu_protocol/span/struct.Span.html)

Describes a region of code in the engine's memory, used mostly for providing diagnostic error messages to the user with context about where a value that caused an error came from.

| Field     | Type    | Usage                                          |
| --------- | ------- | ---------------------------------------------- |
| **start** | integer | The index of the first character referenced.   |
| **end**   | integer | The index after the last character referenced. |

### `PipelineDataHeader`

Describes either a single value, or the beginning of a stream.

| Variant                                    | Usage                                    |
| ------------------------------------------ | ---------------------------------------- |
| [`Empty`](#empty-header-variant)           | No values produced; an empty stream.     |
| [`Value`](#value-header-variant)           | A single value                           |
| [`ListStream`](#liststream-header-variant) | Specify a list stream that will be sent. |
| [`ByteStream`](#bytestream-header-variant) | Specify a byte stream that will be sent. |

#### `Empty` header variant

An empty stream. Nothing will be sent. There is no identifier, and this is equivalent to a `Nothing` value.

The representation is the following string:

```json
"Empty"
```

#### `Value` header variant

A single value. Does not start a stream, so there is no identifier. Contains a [`Value`](#value).

Example:

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

#### `ListStream` header variant

Starts a list stream. Expect [`Data`](#data) messages of the `List` variant with the referenced ID.

Contains <a name="liststreaminfo">`ListStreamInfo`</a>, a map:

| Field    | Type            | Usage                                             |
| -------- | --------------- | ------------------------------------------------- |
| **id**   | integer         | The stream identifier                             |
| **span** | [`Span`](#span) | The source code reference that caused the stream. |

Example:

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

#### `ByteStream` header variant

Starts a byte stream. Expect [`Data`](#data) messages of the `Raw` variant with the referenced ID.

| Field    | Type                                | Usage                                             |
| -------- | ----------------------------------- | ------------------------------------------------- |
| **id**   | integer                             | The stream identifier                             |
| **span** | [`Span`](#span)                     | The source code reference that caused the stream. |
| **type** | [`ByteStreamType`](#bytestreamtype) | The expected type of the stream.                  |

<a name="bytestreamtype"></a> Byte streams carry a `type` field with one of the three following strings:

| `type`      | Meaning                                                                                                                               |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `"Binary"`  | The stream contains binary data of unknown encoding, and should be treated as a `binary` value.                                       |
| `"String"`  | The stream contains text data that is valid UTF-8, and should be treated as a `string` value.                                         |
| `"Unknown"` | The type of the byte stream is unknown and should be inferred depending on whether its contents can be decoded as valid UTF-8 or not. |

The `Unknown` type is used by Nu to represent the output of external commands if they are not passed through [`into string`](/commands/docs/into_string.md) or [`into binary`](/commands/docs/into_binary.md) to explicitly set their type. A command that declares an output type of exclusively either `string` or `binary` **must** explicitly type its output byte streams appropriately, to ensure they coerce to the correct type, rather than using `Unknown`.

Example:

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

[Documentation](https://docs.rs/nu-protocol/latest/nu_protocol/struct.LabeledError.html)

A flexible, generic error type, with any number of labeled spans.

| Field      | Type                  | Usage                                                                                                          |
| ---------- | --------------------- | -------------------------------------------------------------------------------------------------------------- |
| **msg**    | string                | The main error message to show at the top of the error.                                                        |
| **labels** | `ErrorLabel` array?   | Spans and messages to label the error in the source code.                                                      |
| **code**   | string?               | A unique machine- and search-friendly code that can be matched against, e.g. `nu::shell::missing_config_value` |
| **url**    | string?               | A URL that links to additional information about the error.                                                    |
| **help**   | string?               | Additional help for the error, usually a hint about what the user might try.                                   |
| **inner**  | `LabeledError` array? | Additional errors referenced by the error, possibly the cause(s) of this error.                                |

Most of the fields are not required - only `msg` must be present. `ErrorLabel` (in the `labels` array) is as follows:

| Field    | Type            | Usage                                                       |
| -------- | --------------- | ----------------------------------------------------------- |
| **text** | string          | The message for the label.                                  |
| **span** | [`Span`](#span) | The span in the source code that the label should point to. |

::: tip
When reading the Rust source code for the `nu-plugin` crates, many places where `LabeledError` is specified here are actually represented as `ShellError` in that implementation. However, `ShellError` always serializes as if it were `LabeledError`, so the difference between the two can be ignored within the protocol.
:::

Example:

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

[Documentation](https://docs.rs/nu-protocol/latest/nu_protocol/struct.Config.html)

This struct describes the configuration of Nushell. It is quite large and frequently changing, so please refer to the Rust documentation if there is anything you need from it.

### `Ordering`

[Documentation](https://doc.rust-lang.org/stable/std/cmp/enum.Ordering.html)

We serialize the Rust `Ordering` type as literal strings, for example:

```js
'Less'; // left hand side is less than right hand side
'Equal'; // both values are equal
'Greater'; // left hand side is greater than right hand side
```

### `Operator`

[Documentation](https://docs.rs/nu-protocol/latest/nu_protocol/ast/enum.Operator.html)

Serialized with serde's default enum representation. Examples:

```js
{ "Math": "Append" }           // ++   Math(Append)
{ "Bits": "BitOr" }            // |    Bits(BitOr)
{ "Comparison": "RegexMatch" } // =~   Comparison(RegexMatch)
```
