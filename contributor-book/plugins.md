---
title: Plugins
---

# Plugins

## Protocol

Plugins are executable applications that communicate with Nu by exchanging serialized data over stdin and stdout (much in the same way VSCode plugins do). The protocol is split into two stages.

The first stage of the protocol deals with the initial discovery of the plugin. When a plugin is registered the plugin executed and asked to reply with its configuration. Much the same was as commands, plugins have a signature that they respond to Nu with. Once Nu has this signature, it knows how to later invoke the plugin to do work.

The second stage is the actual doing of work. Here the plugins are executed and sent serialized input data. The plugin then replies with the serialized output data.

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
nu-plugin = "0.80.0" # These version numbers may differ
nu-protocol = "0.80.0"
```

With this, we can open up `src/main.rs` and create our plugin.

```rust
use nu_plugin::{serve_plugin, LabeledError, Plugin, JsonSerializer, EvaluatedCall};
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
            .input_type(Type::String)
            .output_type(Type::Int)
        ]
    }

    fn run(
        &mut self,
        name: &str,
        call: &EvaluatedCall,
        input: &Value,
    ) -> Result<Value, LabeledError> {
        assert_eq!(name, "len");
        match input {
            Value::String{ val, span } => Ok(
                Value::Int { val: val.len() as i64, span: span.clone() }
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
    serve_plugin(&mut Len::new(), JsonSerializer)
}
```

There are a few moving parts here, so let's break them down one by one.

First off, let's look at main:

```rust
fn main() {
    serve_plugin(&mut Len::new(), JsonSerializer)
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
        &mut self,
        name: &str,
        call: &EvaluatedCall,
        input: &Value,
    ) -> Result<Value, LabeledError> {
        assert_eq!(name, "len");
        match input {
            Value::String{ val, span } => Ok(
                Value::Int { val: val.len() as i64, span: span.clone() }
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

## Under the hood

Writing Nu plugins in Rust is convenient because we can make use of the `nu-plugin` and `nu-protocl` crates, which are part of Nu itself and define the interface protocol. To write a plugin in another language you will need to implement that protocol yourself. If you're goal is to write Nu plugins in Rust you can stop here. If you'd like to explore the low level plugin interface or write plugins in other languages such as Python, keep reading.

Ordinarily, Nu will execute the plugin and knows what data to pass to it and how to interpret the responses. Here we'll be doing it manually. Note that we'll be playing with our plugin using a conventional shell (like bash or zsh) as in Nu all of this happens under the hood.

Assuming you've built the Rust plugin described above let's now run it:

```sh
$ ./target/release/nu_plugin_len
json
```

The application on start up prints the keyword `json` and blocks for input on STDIN. This tells Nu that the plugin wants to communicate via the JSON protocol rather than MsgPack. You can simulate a plugin initiation request by typing `"Signature"` followed by a newline character and an EoF character. Typically, in Unix-like environments, these can be sent by hitting `enter` followed by `ctrl-d`, although that may vary depending on the terminal and shell you use.

```sh
$ ./target/release/nu_plugin_len
json"Signature"
{"Signature":[{"sig":{"name":"len","usage":"calculates the length of its input","extra_usage":"","search_terms":[],"required_positional":[],"optional_positional":[],"rest_positional":null,"vectorizes_over_list":false,"named":[{"long":"help","short":"h","arg":null,"required":false,"desc":"Display the help message for this command","var_id":null,"default_value":null}],"input_type":"String","output_type":"Int","input_output_types":[],"allow_variants_without_examples":false,"is_filter":false,"creates_scope":false,"allows_unknown_args":false,"category":"Default"},"examples":[]}]}
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

This signature tells Nu everything it needs to pass data in and out of the plugin as well as format the help message and support type aware tab completion. A full description of these fields is beyond the scope of this tutorial, but the response is simply a serialized form of the `PluginSignature` trait in the `nu-plugin` crate.

<!--
    Note that we don't link PluginSignature anywhere because the rust docs for
    PluginSignature do not currently exist. Once the API docs are updated we can link to
    https://docs.rs/nu-protocol/latest/nu_protocol/plugin_signature/struct.PluginSignature.html
-->

Now let's try simulating an invocation. Above we tested the plugin within Nu by executing the command `"hello" | len` and we got the response `5`. Of course this hides all of the typed data handling that makes Nu so powerful.

```sh
$ echo '{"CallInfo":{"name":"len","call":{"head":{"start":100953,"end":100957},"positional":[],"named":[]},"input":{"Value":{"String":{"val":"hello","span":{"start":100953,"end":100957}}}}}}' | target/release/nu_plugin_len
json{"Value":{"Int":{"val":5,"span":{"start":100953,"end":100957}}}}
```

We invoked our plugin and passed a serialized `CallInfo` object that looks like the following on stdin:

```json
{
  "CallInfo": {
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

That is, we passed len the string "hello" and it replied:

```json
{
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
```

with the integer 5 along with preserving source span information that may be useful for error messages later.

When implementing a plugin in a non-Rust language like Python, you must manage this input and output serialization.

## Creating a plugin (in Python)

Using our knowledge from the previous section, we can also create plugins in other programming languages, although you will not benefit from the plugin interface libraries that ship with Nu. In this section, we'll write the same `len` plugin in Python.

First, let's look at the full plugin:

```python
#!/usr/local/bin/python3
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


def send_error(error_msg, span):
        error = {
            "Error": {
                "label": "Len Error",
                "msg": error_msg,
                "span": span,
            }
        }
        sys.stdout.write(json.dumps(error))
        sys.stdout.flush()


def handle_call(call_info):
    try:
        input = call_info["input"]["Value"]["String"]
        output = json.dumps({
            "Value": {
                "Int": {
                    "val": len(input["val"]),
                    "span": input["span"]
                }
            }
        })
        sys.stdout.writelines([output])
        sys.stdout.flush()
    except:
        send_error(
            "Could not process input",
            call_info["call"]["head"]["span"]
        )


if __name__ == "__main__":
    send_encoder()
    input = "".join(sys.stdin.readlines())
    command = json.loads(input)

    if command == "Signature":
        sys.stdout.write(json.dumps({"Signature":[signature()]}))
    elif "CallInfo" in command:
        handle_call(command["CallInfo"])
    else:
        send_error("Unknown command passed to plugin", {"start": 0, "end": 1})
```

Note: there are ways to make the python more robust, but here we've left it simple to help with explanations.

Let's look at how this plugin works, from the bottom to the top:

```python
if __name__ == "__main__":
    send_encoder()
    input = "".join(sys.stdin.readlines())
    command = json.loads(input)

    if command == "Signature":
        sys.stdout.write(json.dumps({"Signature":[signature()]}))
    elif "CallInfo" in command:
        handle_call(command["CallInfo"])
    else:
        send_error("Unknown command passed to plugin", {"start": 0, "end": 1})
```

For this plugin, we have to serve two basic roles: responding to a request for the plugin configuration, and doing the actual filtering. This code acts as our main routine, responding to a message from Nu by doing some work and then returning a response: either returning with the plugin signature or handling input.

The first thing our plugin must do is write out the desired serialization format, in this case JSON. We do that with the `send_encoder` method. Then we read the JSON serialized command that Nu sends us.

When we're sent a 'Signature' request, we respond with the signature of this plugin, which is a bit of information to tell Nu how the command should be called.

When sent a `CallInfo` request, we parse the supplied JSON and respond to the request

```python
def handle_call(call_info):
    try:
        input = call_info["input"]["Value"]["String"]
        output = json.dumps({
            "Value": {
                "Int": {
                    "val": len(input["val"]),
                    "span": input["span"]
                }
            }
        })
        sys.stdout.writelines([output])
        sys.stdout.flush
    except:
        send_error(
            "Could not process input",
            call_info["call"]["head"]["span"]
        )
```

The work of processing input is done by this `handle_call` function. Here, we assume we're given strings (we could make this more robust in the future and return meaningful errors otherwise), and then we extract the string we're given. From there, we measure the length of the string and create a new `Int` value for that length.

Finally, we use the same item we were given and replace the payload with this new Int. We do this to reuse the `span` that was passed to us with the string, though this is an optional step. We could have instead opted to create new metadata and passed that out instead.

```python
import json
import sys
```

All of this takes a few imports to accomplish, so we make sure to include them.

```python
#!/usr/local/bin/python3
```

Finally, to make it easier to run our Python, we make this file executable (using something like `chmod +x nu_plugin_len.py`) and add the path to our python at the top. This trick works for Unix-based platforms, for Windows we would need to create an .exe or .bat file that would invoke the python code for us.
