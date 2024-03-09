---
title: Plugins
---

# Plugins

## Protocol

Plugins are executable applications that communicate with Nu by exchanging serialized data over stdin and stdout (much in the same way VSCode plugins do). The protocol is split into two stages.

The first stage of the protocol deals with the initial discovery of the plugin. When a plugin is registered the plugin executed and asked to reply with its configuration. Just as with commands, plugins have a signature that they respond to Nu with. Once Nu has this signature, it knows how to later invoke the plugin to do work.

The second stage is the actual doing of work. Here the plugins are executed and sent serialized input data. The plugin then replies with the serialized output data.

For more detailed information about how exactly this communication works, especially if trying to implement a plugin in a language other than Rust, see the [plugin protocol](plugin_protocol_reference.md) section.

## Discovery

Nu keeps a registry of plugins at the file system location defined by configuration variable `$nu.plugin-path`. To register a plugin, execute `register <path_to_plugin_executable>` in a Nu shell.

## Creating a plugin (in Rust)

In this section, we'll walk through creating a Nu plugin using Rust.

Let's create our project. For this example, we'll create a simple `len` command which will return the length of strings it's passed.

First off, we'll create our plugin:

```sh
> cargo new nu_plugin_len
> cd nu_plugin_len
```

Next, we'll add `nu` to our project's dependencies.

```sh
> cargo add nu-plugin nu-protocol
```

The `Cargo.toml` file should now look something like the following.

```toml
[package]
name = "nu_plugin_len"
version = "0.1.0"
edition = "2021"

[dependencies]
nu-plugin = "0.85.0" # These version numbers may differ
nu-protocol = "0.85.0"
```

With this, we can open up `src/main.rs` and create our plugin.

```rust
use nu_plugin::{serve_plugin, LabeledError, Plugin, JsonSerializer, EvaluatedCall, EngineInterface};
use nu_protocol::{Value, PluginSignature, Type};

struct Len;

impl Len {
    fn new() -> Self {
        Self
    }
}

impl Plugin for Len {
    fn signature(&self) -> Vec<PluginSignature> {
        vec![PluginSignature::build("len")
            .usage("calculates the length of its input")
            .input_output_type(Type::String, Type::Int)
        ]
    }

    fn run(
        &self,
        name: &str,
        _engine: &EngineInterface,
        call: &EvaluatedCall,
        input: &Value,
    ) -> Result<Value, LabeledError> {
        assert_eq!(name, "len");
        let span = input.span();
        match input {
            Value::String { val, .. } => Ok(
                Value::int(val.len() as i64, span)
            ),
            _ => Err(LabeledError {
                label: "Expected String input from pipeline".to_string(),
                msg: format!("requires string input; got {}", input.get_type()),
                span: Some(call.head),
            }),
        }
    }
}

fn main() {
    serve_plugin(&Len::new(), JsonSerializer)
}
```

There are a few moving parts here, so let's break them down one by one.

First off, let's look at main:

```rust
fn main() {
    serve_plugin(&Len::new(), JsonSerializer)
}
```

In main, we just call a single function `serve_plugin`. This will do the work of calling into our plugin, handling the JSON serialization/deserialization, and sending values and errors back to Nu for us. To start it up, we pass it something that implements the `Plugin` trait and something that implements the `PluginEncoder` trait. We're given a choice of serialization formats that Nu supports. Ordinarily plugins written in Rust should use `MsgPackSerializer`, but here we select JSON to demonstrate how the communication protocol works further on in this tutorial.

Next, above main, is this implementation of the `Plugin` trait for our particular plugin. Here, we'll implement the Plugin trait for our type, Len, which we'll see more of soon. Let's take a look at how we implement this trait:

```rust
impl Plugin for Len {
    fn signature(&self) -> Vec<PluginSignature> {
        vec![PluginSignature::build("len")
            .usage("calculates the length of its input")
            .input_type(Type::String)
            .output_type(Type::Int)
        ]
    }

    // ...
}
```

There are two methods required for this implementation. The first is the `signature` part, which is run by Nu when it first starts up. This tells Nu the basic information about the plugin: its name, the parameters it takes, the description, what kind of plugin it is, and defines the input and output types.
Here, we tell Nu that the name is "len", give it a basic description for `help` to display and declare that we expect to be passed a string and will return an integer.

Next, in the `run` implementation, we describe how to do work as values flow into this plugin. Here, we receive a `Value` type that we expect to be a string.
We also return either `Value` or an error.

```rust
impl Plugin for Len {
    // ...

    fn run(
        &self,
        name: &str,
        _engine: &EngineInterface,
        call: &EvaluatedCall,
        input: &Value,
    ) -> Result<Value, LabeledError> {
        assert_eq!(name, "len");
        let span = input.span();
        match input {
            Value::String { val, .. } => Ok(
                Value::int(val.len() as i64, span)
            ),
            _ => Err(LabeledError {
                label: "Expected String input from pipeline".to_string(),
                msg: format!("requires string input; got {}", input.get_type()),
                span: Some(call.head),
            }),
        }
    }
}
```

We use Rust's pattern matching to check the type of the `Value` coming in, and then operate with it if it's a string. The value also contains a `span` so it carries with it where the value came from. If the value isn't a string, we give an error and let the user know where the value came from that is causing the problem. On error, we use `call.head` as the span so that Nu can underline the offending command name in the error message.

Our `Len` command doesn't require any parameters, but if it did we'd get them from the `EvaluatedCall`.

Next, let's look at `Len` itself to see what it's doing:

```rust
struct Len;

impl Len {
    fn new() -> Self {
        Self
    }
}
```

We create a very simple `Len`, in fact, it has no structure at all. Instead, it's just a placeholder that will let us implement the plugin.

The `new` method is optional, it's just a convenient way to create a new value of the `Len` type to pass into `serve_plugin` later.

Lastly, let's look at the top of the file:

```rust
use nu_plugin::{serve_plugin, LabeledError, Plugin, JsonSerializer, EvaluatedCall};
use nu_protocol::{Value, PluginSignature, Type};
```

Here we import everything we need -- types and functions -- to be able to create our plugin.

Once we have finished our plugin, to use it all we need to do is install it.

```sh
> cargo install --path .
```

Once `nu` starts up, it will discover the plugin and register it as a command.

If you're already running `nu` during the installation process of your plugin, ensure you restart `nu` so that it can load and register your plugin or register it manually with `register ./target/release/nu_plugin_len`.

```
> nu
> "hello" | len
5
> help len
calculates the length of its input

Usage:
  > len

Flags:
  -h, --help - Display the help message for this command

Signatures:
  <string> | len -> <int>
```

## Using streams in plugins

The default `Plugin` trait that we just implemented for our plugin does not support streaming input or output. If we want to extend our plugin to support determining the lengths of lists, it would be helpful to not have to consume an entire list that is a stream. We can do this by implementing `StreamingPlugin` instead.

```rust
// add these imports:
use nu_plugin::StreamingPlugin;
use nu_protocol::{IntoPipelineData, PipelineData};
// ...

// change Plugin to StreamingPlugin:
impl StreamingPlugin for Len {
    fn signature(&self) -> Vec<PluginSignature> {
        // ... add the list type to the signature
        vec![PluginSignature::build("len")
            .usage("calculates the length of its input")
            .input_output_types(vec![
                (Type::String, Type::Int),
                (Type::List(Type::Any.into()), Type::Int),
            ])
        ]
    }

    // ... and change input and output types to PipelineData
    fn run(
        &self,
        name: &str,
        _engine: &EngineInterface,
        call: &EvaluatedCall,
        input: PipelineData,
    ) -> Result<PipelineData, LabeledError> {
        assert_eq!(name, "len");
        // Check if the input is a stream or list
        match input {
            PipelineData::ListStream(..) |
            PipelineData::Value(Value::List { .. }, _) => {
                // Count the iterable's elements
                let length = input.into_iter().count();
                Ok(
                    Value::int(length as i64, call.head).into_pipeline_data()
                )
            },
            input => {
                // Handle a string
                let span = input.span().unwrap_or(call.head);
                let value = input.into_value(span);
                match &value {
                    Value::String { val, .. } => Ok(
                        Value::int(val.len() as i64, value.span()).into_pipeline_data()
                    ),
                    _ => Err(LabeledError {
                        label: "Expected String or iterable input from pipeline".to_string(),
                        msg: format!("requires string or iterable input; got {}", value.get_type()),
                        span: Some(call.head),
                    }),
                }
            }
        }
    }
}
```

With this change, we can pipe a list (even a long one) to the command to get its length:

```nu
$ seq 1 10000 | len
10000
```

Since `run()` also returns `PipelineData`, it is also possible for the plugin to produce a stream, or even to transform a stream. For example, if we wanted our plugin to multiply every integer by
two:

```rust
fn run(..., input: PipelineData) -> Result<PipelineData, ShellError> {
    Ok(input.map(|value| {
        let span = value.span();
        match value.as_int() {
            Ok(int) => Value::int(int * 2, span),

            // In list streams (i.e., lists of `Value`), errors are always represented by
            // `Value::Error`.
            Err(err) => Value::error(err, span),
        }
    }))
}
```

Since the input and output are both streaming, this will work even on an infinite stream:

```nu
$ generate 0 { |n| {out: $n, next: ($n + 1)} } | plugin
0
2
4
6
8
# ...
```

## Plugin configuration

It is possible for a user to provide configuration to a plugin. For a plugin named `motd`:

```nu
$env.config.plugins = {
    motd: {
        message: "Nushell rocks!"
    }
}
```

The plugin configuration can be retrieved with [`EngineInterface::get_plugin_config`](https://docs.rs/nu-plugin/latest/nu_plugin/struct.EngineInterface.html#method.get_plugin_config).

```rust
use nu_plugin::*;
use nu_protocol::{PluginSignature, Value, Type};

struct Motd;

impl Plugin for Motd {
    fn signature(&self) -> Vec<PluginSignature> {
        vec![
            PluginSignature::build("motd")
                .usage("Message of the day")
                .input_output_type(Type::Nothing, Type::String)
        ]
    }

    fn run(
        &self,
        _name: &str,
        engine: &EngineInterface,
        call: &EvaluatedCall,
        _input: &Value,
    ) -> Result<Value, LabeledError> {
        if let Some(config) = engine.get_plugin_config()? {
            let message = config.get_data_by_key("message")
                .ok_or_else(|| LabeledError {
                    label: "Message not present in config".into(),
                    msg: "add the `message` key here".into(),
                    span: Some(config.span()),
                })?;
            Ok(Value::string(message.as_str()?, call.head))
        } else {
            Err(LabeledError {
                label: "Config for `motd` not set in $env.config.plugins".into(),
                msg: "".into(),
                span: None,
            })
        }
    }
}

fn main() {
    serve_plugin(&Motd, MsgPackSerializer)
}
```

Example:

```nu
> $env.config.plugins.motd = {message: "Nushell rocks!"}
> motd
Nushell rocks!
```

## Evaluating closures

Plugins can accept and evaluate closures using [`EngineInterface::eval_closure`](https://docs.rs/nu-plugin/latest/nu_plugin/struct.EngineInterface.html#method.eval_closure) or [`eval_closure_with_stream`](https://docs.rs/nu-plugin/latest/nu_plugin/struct.EngineInterface.html#method.eval_closure_with_stream).

```rust
use nu_plugin::*;
use nu_protocol::{PluginSignature, Value, Type, SyntaxShape, PipelineData};

struct MyEach;

impl StreamingPlugin for MyEach {
    fn signature(&self) -> Vec<PluginSignature> {
        vec![
            PluginSignature::build("my-each")
                .usage("Run closure on each element of a list")
                .required(
                    "closure",
                    SyntaxShape::Closure(Some(vec![SyntaxShape::Any])),
                    "The closure to evaluate",
                )
                .input_output_type(Type::ListStream, Type::ListStream)
        ]
    }

    fn run(
        &self,
        _name: &str,
        engine: &EngineInterface,
        call: &EvaluatedCall,
        input: PipelineData,
    ) -> Result<PipelineData, LabeledError> {
        let engine = engine.clone();
        let closure = call.req(0)?;
        Ok(input.map(move |item| {
            let span = item.span();
            engine.eval_closure(&closure, vec![item.clone()], Some(item))
                .unwrap_or_else(|err| Value::error(err, span))
        }, None)?)
    }
}

fn main() {
    serve_plugin(&MyEach, MsgPackSerializer)
}
```

`my-each` works just like `each`:

```nu
> [1 2 3] | my-each { |i| $i * 2 }
╭───┬───╮
│ 0 │ 2 │
│ 1 │ 4 │
│ 2 │ 6 │
╰───┴───╯
```

At present, the closures can only refer to values that would be valid to send to the plugin. This means that custom values from other plugins are not allowed. This is likely to be fixed in a future release.

## Under the hood

Writing Nu plugins in Rust is convenient because we can make use of the `nu-plugin` and `nu-protocol` crates, which are part of Nu itself and define the interface protocol. To write a plugin in another language you will need to implement that protocol yourself. If you're goal is to write Nu plugins in Rust you can stop here. If you'd like to explore the low level plugin interface or write plugins in other languages such as Python, keep reading.

Ordinarily, Nu will execute the plugin and knows what data to pass to it and how to interpret the responses. Here we'll be doing it manually. Note that we'll be playing with our plugin using a conventional shell (like bash or zsh) as in Nu all of this happens under the hood.

We recommend keeping the [plugin protocol](plugin_protocol_reference.md) documentation handy as a reference while reading this section.

Assuming you've built the Rust plugin described above let's now run it:

```sh
$ ./target/release/nu_plugin_len --stdio
json
```

The application on start up prints the keyword `json` and blocks for input on STDIN. This tells Nu that the plugin wants to communicate via the JSON protocol rather than MsgPack. In the JSON protocol, the plugin will listen for each JSON object written on stdin and respond accordingly. Newlines are not required, but it is likely that the plugin will not see your input before you hit `enter`, as terminals usually line buffer by default.

We can simulate an initial plugin registration by sending a [`Hello`](plugin_protocol_reference.md#hello) message first, in order to let the plugin know that we are compatible with it. It is important to use the version of `nu-plugin` that the plugin was built with here for the `"version"` as this is a critical part of how Nu ensures that plugins run with a compatible engine.

```json
{
  "Hello": {
    "protocol": "nu-plugin",
    "version": "0.90.2",
    "features": []
  }
}
```

After that, we send a [`Signature`](plugin_protocol_reference.md#signature-plugin-call) call to the plugin with ID `0`:

```json
{
  "Call": [0, "Signature"]
}
```

Putting that together, it looks like this:

```sh
$ ./target/release/nu_plugin_len --stdio
json{"Hello":{"protocol":"nu-plugin","version":"0.90.2","features":[]}}
{"Hello":{"protocol":"nu-plugin","version":"0.90.2","features":[]}}
{"Call":[0,"Signature"]}
{"CallResponse":[0, {"Signature":[{"sig":{"name":"len","usage":"calculates the length of its input","extra_usage":"","search_terms":[],"required_positional":[],"optional_positional":[],"rest_positional":null,"vectorizes_over_list":false,"named":[{"long":"help","short":"h","arg":null,"required":false,"desc":"Display the help message for this command","var_id":null,"default_value":null}],"input_type":"String","output_type":"Int","input_output_types":[],"allow_variants_without_examples":false,"is_filter":false,"creates_scope":false,"allows_unknown_args":false,"category":"Default"},"examples":[]}]}]}
```

The plugin prints its signature serialized as JSON. We'll reformat for readability.

```json
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
```

This signature tells Nu everything it needs to pass data in and out of the plugin as well as format the help message and support type aware tab completion. A full description of these fields is beyond the scope of this tutorial, but the response is simply a serialized form of the [`PluginSignature`](https://docs.rs/nu-protocol/latest/nu_protocol/struct.PluginSignature.html) trait in the `nu-plugin` crate.

Now let's try simulating an invocation. Above we tested the plugin within Nu by executing the command `"hello" | len` and we got the response `5`. Of course this hides all of the typed data handling that makes Nu so powerful.

```nu
$ echo '{"Hello":{"protocol":"nu-plugin","version":"0.90.2","features":[]}}{"Call":[0,{"Run":{"name":"len","call":{"head":{"start":100953,"end":100957},"positional":[],"named":[]},"input":{"Value":{"String":{"val":"hello","span":{"start":100953,"end":100957}}}}}}]}' | target/release/nu_plugin_len --stdio
json{"Hello":{"protocol":"nu-plugin","version":"0.90.2","features":[]}}
{"PipelineData":{"Value":{"Int":{"val":5,"span":{"start":100953,"end":100957}}}}}
```

We invoked our plugin and passed a [`Run`](plugin_protocol_reference.md#run-plugin-call) plugin call that looks like the following on stdin:

```json
{
  "Run": {
    "name": "len",
    "call": {
      "head": {
        "start": 100953,
        "end": 100957
      },
      "positional": [],
      "named": []
    },
    "input": {
      "Value": {
        "String": {
          "val": "hello",
          "span": {
            "start": 100953,
            "end": 100957
          }
        }
      }
    }
  }
}
```

That is, we passed len the string "hello" and it replied with the following [`PipelineData`](plugin_protocol_reference.md#pipelinedata-plugin-call-response) response:

```json
{
  "PipelineData": {
    "Value": {
      "Int": {
        "val": 5,
        "span": {
          "start": 100953,
          "end": 100957
        }
      }
    }
  }
}
```

with the integer 5 along with preserving source span information that may be useful for error messages later.

When implementing a plugin in a non-Rust language like Python, you must manage this input and output serialization. Please refer to the [protocol documentation](plugin_protocol_reference.md) for more specific details on the protocol itself.

## Creating a plugin (in Python)

Using our knowledge from the previous section, we can also create plugins in other programming languages, although you will not benefit from the plugin interface libraries that ship with Nu. In this section, we'll write the same `len` plugin in Python.

First, let's look at the full plugin:

```python
#!/usr/bin/env python3
import json
import sys


def signature():
    return {
        "sig": {
            "name": "len",
            "usage": "calculates the length of its input",
            "extra_usage": "",
            "search_terms": [],
            "required_positional": [],
            "optional_positional": [],
            "rest_positional": None,
            "vectorizes_over_list": False,
            "named": [],
            "input_type": "String",
            "output_type":"Int",
            "input_output_types":[],
            "allow_variants_without_examples": True,
            "is_filter": False,
            "creates_scope": False,
            "allows_unknown_args":False,
            "category":"Default"
        },
        "examples": []
    }


def send_encoder():
    sys.stdout.write(chr(4))
    for ch in "json":
        sys.stdout.write(chr(ord(ch)))
    sys.stdout.flush()


def send_hello():
    hello = {
        "Hello": {
            "protocol": "nu-plugin",
            "version": "0.90.2",
            "features": []
        }
    }
    sys.stdout.writelines([json.dumps(hello)])
    sys.stdout.flush()


def send_response(id, response):
    msg = {
        "CallResponse": [id, response]
    }
    sys.stdout.writelines([json.dumps(msg)])
    sys.stdout.flush()


def send_error(id, error_msg, span):
    error = {
        "Error": {
            "label": "Len Error",
            "msg": error_msg,
            "span": span,
        }
    }
    send_response(id, error)


def handle_call(id, call_info):
    try:
        input = call_info["input"]["Value"]["String"]
        output = {
            "PipelineData": {
                "Value": {
                    "Int": {
                        "val": len(input["val"]),
                        "span": input["span"]
                    }
                }
            }
        }
        send_response(id, output)
    except:
        send_error(
            id,
            "Could not process input",
            call_info["call"]["head"]["span"]
        )


if __name__ == "__main__":
    send_encoder()
    send_hello()
    for line in sys.stdin:
        input = json.loads(line)
        if "Hello" in input:
            pass
        elif input == "Goodbye":
            break
        elif "Call" in input:
            [id, call] = input["Call"]
            if call == "Signature":
                send_response(id, {"Signature": [signature()]})
            elif "Run" in call:
                handle_call(id, call["Run"])
            else:
                send_error(id, "Unknown call passed to plugin", {"start": 0, "end": 0})
        else:
            sys.stderr.writelines(["Unknown message passed to plugin"])
            sys.exit(1)
```

Note: there are ways to make the python more robust, but here we've left it simple to help with explanations.

Let's look at how this plugin works, from the bottom to the top:

```python
if __name__ == "__main__":
    send_encoder()
    send_hello()
    for line in sys.stdin:
        input = json.loads(line)
        if "Hello" in input:
            pass
        elif input == "Goodbye":
            break
        elif "Call" in input:
            [id, call] = input["Call"]
            if call == "Signature":
                send_response(id, {"Signature": [signature()]})
            elif "Run" in call:
                handle_call(id, call["Run"])
            else:
                send_error(id, "Unknown call passed to plugin", {"start": 0, "end": 0})
        else:
            sys.stderr.writelines(["Unknown message passed to plugin"])
            sys.exit(1)
```

For this plugin, we have to serve two basic roles: responding to a request for the plugin configuration, and doing the actual filtering. This code acts as our main routine, responding to a message from Nu by doing some work and then returning a response: either returning with the plugin signature or handling input.

```python
def send_encoder():
    sys.stdout.write(chr(4))
    for ch in "json":
        sys.stdout.write(chr(ord(ch)))
    sys.stdout.flush()


def send_hello():
    hello = {
        "Hello": {
            "protocol": "nu-plugin",
            "version": "0.90.2",
            "features": []
        }
    }
    sys.stdout.writelines([json.dumps(hello)])
    sys.stdout.flush()
```

The first thing our plugin must do is write out the desired serialization format, in this case JSON. We do that with the `send_encoder()` method. Then we use `send_hello()` to send our [`Hello`](plugin_protocol_reference.md#hello) message, informing Nu of our compatibility with it, and which is required before we can send any other messages. Then we read the JSON serialized messages that Nu sends us. Since Nu always sends each message on its own line, we simply read each line of input and parse it separately.

Each [`Call`](plugin_protocol_reference.md#call) comes with an ID number, which we must keep for the [`CallResponse`](plugin_protocol_reference.md#callresponse) (including errors).

When we're sent a `Signature` request, we respond with the signature of this plugin, which is a bit of information to tell Nu how the command should be called.

When sent a `Run` request, we parse the supplied JSON and respond to the request

```python
def handle_call(id, call_info):
    try:
        input = call_info["input"]["Value"]["String"]
        output = {
            "PipelineData": {
                "Value": {
                    "Int": {
                        "val": len(input["val"]),
                        "span": input["span"]
                    }
                }
            }
        }
        send_response(id, output)
    except:
        send_error(
            id,
            "Could not process input",
            call_info["call"]["head"]["span"]
        )
```

The work of processing input is done by this `handle_call` function. Here, we assume we're given strings (we could make this more robust in the future and return meaningful errors otherwise), and then we extract the string we're given. From there, we measure the length of the string and create a new `Int` value for that length.

Finally, we use the same item we were given and replace the payload with this new Int. We do this to reuse the `span` that was passed to us with the string, though this is an optional step. We could have instead opted to create new metadata and passed that out instead.

We have a couple of helpers:

```python
def send_response(id, response):
    msg = {
        "CallResponse": [id, response]
    }
    sys.stdout.writelines([json.dumps(msg)])
    sys.stdout.flush()
```

`send_response()` formats and writes a [`CallResponse`](plugin_protocol_reference.md#callresponse) with the given id and body.

```python
def send_error(id, error_msg, span):
    error = {
        "Error": {
            "label": "Len Error",
            "msg": error_msg,
            "span": span,
        }
    }
    send_response(id, error)
```

`send_error()` formats and sends an error response for us.

```python
import json
import sys
```

All of this takes a few imports to accomplish, so we make sure to include them.

```python
#!/usr/local/bin/python3
```

Finally, to make it easier to run our Python, we make this file executable (using something like `chmod +x nu_plugin_len.py`) and add the path to our python at the top. This trick works for Unix-based platforms, for Windows we would need to create an .exe or .bat file that would invoke the python code for us.

Please see the [example Python plugin](https://github.com/nushell/nushell/tree/main/crates/nu_plugin_python) for a comprehensive example on how to implement a Nushell plugin in another language, including Python.
