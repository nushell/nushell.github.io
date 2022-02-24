---
title: Plugins
---

# Plugins

## Protocol

Plugins use JSON-RPC over stdin/stdout (much in the same way VSCode plugins do). The protocol is split into two stages.

The first stage of the protocol deals with the initial discovery of the plugin. A plugin is started up and then asked to reply with its configuration. Much the same was as commands, plugins have a signature that they respond to Nu with. Once Nu has this signature, it knows how to later invoke the plugin to do work.

The second stage is the actual doing of work. Here the plugins are sent either a stream of data where they act over the stream element-wise as a filter, or they take all the elements at once in a final processing step as a sink.

## Discovery

Nu discovers plugins by checking all directories specified by `plugin_dirs` config entry and the directory where `nu` executable lies. You can change the configuration by executing `config set plugin_dirs ["/path","/to","/search"]` in Nu.
In each directory, Nu is looking for executable files that match the pattern `nu_plugin_*` where `*` is a minimum of one alphanumeric character.
On Windows, this has a similar pattern of `nu_plugin_*.exe` or `nu_plugin_*.bat`.

Once a matching file has been discovered, Nu will invoke the file and pass to it the first JSON-RPC command: config.
Config replies with the signature of the plugin, which is identical to the signature commands use.

Nu continues in this way until it has traveled across all directories in the path.

After it has traversed the path, it will look in two more directories: the target/debug and the target/release directories. It will pick one or the other depending whether Nu was compiled in debug mode or release mode, respectively. This allows for easier testing of plugins during development.

## Creating a plugin (in Rust)

In this section, we'll walk through creating a Nu plugin using Rust.

Let's create our project. For this example, we'll create a simple `len` command which will return the length of strings it's passed.

First off, we'll create our plugin:

```
> cargo new nu_plugin_len
> cd nu_plugin_len
```

Next, we'll add `nu` to the list of dependencies to the Cargo.toml directory. At the bottom of the new Cargo.toml file, add this new dependency on the `nu` crate:

```
[dependencies]
nu-plugin = "~0"
nu-protocol = "~0"
nu-source = "~0"
nu-errors = "~0"
```

With this, we can open up src/main.rs and create our plugin.

```rust
use nu_errors::ShellError;
use nu_plugin::{serve_plugin, Plugin};
use nu_protocol::{
    CallInfo, Primitive, ReturnSuccess, ReturnValue, Signature, UntaggedValue, Value,
};

struct Len;

impl Len {
    fn new() -> Len {
        Len
    }

    fn len(&mut self, value: Value) -> Result<Value, ShellError> {
        match &value.value {
            UntaggedValue::Primitive(Primitive::String(s)) => Ok(Value {
                value: UntaggedValue::int(s.len() as i64),
                tag: value.tag,
            }),
            _ => Err(ShellError::labeled_error(
                "Unrecognized type in stream",
                "'len' given non-string info by this",
                value.tag.span,
            )),
        }
    }
}

impl Plugin for Len {
    fn config(&mut self) -> Result<Signature, ShellError> {
        Ok(Signature::build("len").desc("My custom len plugin").filter())
    }

    fn begin_filter(&mut self, _: CallInfo) -> Result<Vec<ReturnValue>, ShellError> {
        Ok(vec![])
    }

    fn filter(&mut self, input: Value) -> Result<Vec<ReturnValue>, ShellError> {
        Ok(vec![ReturnSuccess::value(self.len(input)?)])
    }
}

fn main() {
    serve_plugin(&mut Len::new());
}
```

There are a few moving parts here, so let's break them down one by one.

First off, let's look at main:

```rust
fn main() {
    serve_plugin(&mut Len::new());
}
```

In main, we just call a single function `serve_plugin`. This will do the work of calling into our plugin, handling the JSON serialization/deserialization, and sending values and errors back to Nu for us. To start it up, we pass it something that implements the `Plugin` trait.

Next, above main, is this implementation of the `Plugin` trait for our particular plugin. Here, we'll implement the Plugin trait for our type, Len, which we'll see more of soon. Let's take a look at how we implement this trait:

```rust
impl Plugin for Len {
    fn config(&mut self) -> Result<Signature, ShellError> {
        Ok(Signature::build("len").desc("My custom len plugin").filter())
    }

    fn begin_filter(&mut self, _: CallInfo) -> Result<Vec<ReturnValue>, ShellError> {
        Ok(vec![])
    }

    fn filter(&mut self, input: Value) -> Result<Vec<ReturnValue>, ShellError> {
        Ok(vec![ReturnSuccess::value(self.len(input)?)])
    }
}
```

The two most important parts of this implementation are the `config` part, which is run by Nu when it first starts up. This tells Nu the basic information about the plugin: its name, the parameters it takes, the description, and what kind of plugin it is.
Here, we tell Nu that the name is "len", give it a basic description for `help` to display and that we are a filter plugin (rather than a sink plugin).

Next, in the `filter` implementation, we describe how to do work as values flow into this plugin. Here, we receive one value (a `Value`) at a time.
We also return either a Vec of values or an error.
Returning a Vec instead of a single value allows us to remove values, or add new ones, in addition to working with the single value coming in.

Because `begin_filter` doesn't do anything, we can remove it. This would make the above:

```rust
impl Plugin for Len {
    fn config(&mut self) -> Result<Signature, ShellError> {
        Ok(Signature::build("len").desc("My custom len plugin").filter())
    }

    fn filter(&mut self, input: Value) -> Result<Vec<ReturnValue>, ShellError> {
        Ok(vec![ReturnSuccess::value(self.len(input)?)])
    }
}
```

If that's the case, why have a `begin_filter`?  Let's look at the signature of `begin_filter` a little closer:

```rust
fn begin_filter(&mut self, _: CallInfo) -> Result<Vec<ReturnValue>, ShellError> {
    Ok(vec![])
}
```

Our `Len` command doesn't require any parameters, but if it did this is where we'd get them. From here, we could configure our filter, and then use that with each step in of the `filter` command over the input.

Next, let's look at `Len` itself to see what it's doing:

```rust
struct Len;

impl Len {
    fn new() -> Len {
        Len
    }

    fn len(&mut self, value: Value) -> Result<Value, ShellError> {
        match &value.value {
            UntaggedValue::Primitive(Primitive::String(s)) => Ok(Value {
                value: UntaggedValue::int(s.len() as i64),
                tag: value.tag,
            }),
            _ => Err(ShellError::labeled_error(
                "Unrecognized type in stream",
                "'len' given non-string info by this",
                value.tag.span,
            )),
        }
    }
}
```

We create a very simple `Len`, in fact, it has no structure at all. Instead, it's just a placeholder that will let us implement the plugin.

From here, we create two methods:

```rust
impl Len {
    fn new() -> Len {
        Len
    }
    // ...
}
```

The first method is optional, it's just a convenient way to create a new value of the `Len` type. The real work is done in the second method:

```rust
impl Len {
    // ...

    fn len(&mut self, value: Value) -> Result<Value, ShellError> {
        match &value.value {
            UntaggedValue::Primitive(Primitive::String(s)) => Ok(Value {
                value: UntaggedValue::int(s.len() as i64),
                tag: value.tag,
            }),
            _ => Err(ShellError::labeled_error(
                "Unrecognized type in stream",
                "'len' given non-string info by this",
                value.tag.span,
            )),
        }
    }
}
```

This method will act over each element in the pipeline as it flows into our plugin. For our plugin, we really only care about strings so that we can return their length.

We use Rust's pattern matching to check the type of the Value coming in, and then operate with it if it's a string. The value is a `Tagged<Value>` so it carries with it where the value came from. If the value isn't a string, we give an error and let the user know where the value came from that is causing the problem. (Note, if we had wanted to also put an error underline under the command name, we could get the `name_span` from the CallInfo given to `begin_filter`)

Lastly, let's look at the top of the file:

```rust
use nu_errors::ShellError;
use nu_plugin::{serve_plugin, Plugin};
use nu_protocol::{
    CallInfo, Primitive, ReturnSuccess, ReturnValue, Signature, UntaggedValue, Value,
};
```

Here we import everything we need -- types and functions -- to be able to create our plugin.

Once we have finished our plugin, to use it all we need to do is install it.

```
> cargo install --path .
```

Once `nu` starts up, it will discover the plugin and register it as a command.
If you're already running `nu` during the installation process of your plugin, ensure you restart `nu` so that it can load and register your plugin.

```
> nu
> echo hello | len
5
> help len
This is my custom len plugin

Usage:
  > len {flags}

flags:
  -h, --help: Display this help message
```

**Provides executing regular expressions**

We basically use the [regex]<https://github.com/rust-lang/regex> crate. Unless there is a specific reason, it is recommended to use it.

## Creating a plugin (in Python)

We can also create plugins in other programming languages. In this section, we'll write the same `len` plugin in Python.

First, let's look at the full plugin:

```python
#!/usr/bin/python3
import json
import fileinput
import sys


def print_good_response(response):
    json_response = {"jsonrpc": "2.0", "method": "response", "params": {"Ok": response}}
    print(json.dumps(json_response))
    sys.stdout.flush()


def get_length(string_value):
    string_len = len(string_value["item"]["Primitive"]["String"])
    int_item = {"Primitive": {"Int": string_len}}
    int_value = string_value
    int_value["item"] = int_item
    return int_value


for line in fileinput.input():
    x = json.loads(line)
    method = x.get("method", None)
    if method == "config":
        config = {"name": "len", "usage": "Return the length of a string", "positional": [], "named": {}, "is_filter": True}
        print_good_response(config)
        break
    elif method == "begin_filter":
        print_good_response([])
    elif method == "filter":
        int_item = get_length(x["params"])
        print_good_response([{"Ok": {"Value": int_item}}])
    elif method == "end_filter":
        print_good_response([])
        break
    else:
        break
```

Note: there are ways to make the python more robust, but here we've left it simple to help with explanations.

Let's look at how this plugin works, from the bottom to the top:

```python
for line in fileinput.input():
    x = json.loads(line)
    method = x.get("method", None)
    if method == "config":
        config = {"name": "len", "usage": "Return the length of a string", "positional": [], "named": {}, "is_filter": True}
        print_good_response(config)
        break
    elif method == "begin_filter":
        print_good_response([])
    elif method == "filter":
        int_item = get_length(x["params"])
        print_good_response([{"Ok": {"Value": int_item}}])
    elif method == "end_filter":
        print_good_response([])
        break
    else:
        break
```

For this plugin, we have to serve two basic roles: responding to a request for the plugin configuration, and doing the actual filtering. This code acts as our main loop, responding to messages from Nu by doing some work and then returning a response. Each JSON message is sent to the plugin on a single line, so we need only to read the line and then parse the json it contains.

From there, we look at what method is being invoked. For this plugin, there are four methods we care about: config, begin_filter, filter, and end_filter. When we're sent a 'config' request, we respond with the signature of this plugin, which is a bit of information to tell Nu how the command should be called. Once sent, we break out of the loop so that the plugin can exit and be later called when filtering begins.

The other three methods -- begin_filter, filter, and end_filter -- all work together to do the work of filtering the data coming in. As this plugin will work 1-to-1 with each bit of data, turning strings into their string lengths, we do most of our work in the `filter` method. The 'end_filter' method here tells us it's time for the plugin to shut down, so we go ahead and break out of the loop.

```python
def get_length(string_value):
    string_len = len(string_value["item"]["Primitive"]["String"])
    int_item = {"Primitive": {"Int": string_len}}
    int_value = string_value
    int_value["item"] = int_item
    return int_value
```

The work of filtering is done by the `get_length` function. Here, we assume we're given strings (we could make this more robust in the future and return errors otherwise), and then we extract the string we're given. From there, we measure the length of the string and create a new `Int` value for that length.

Finally, we use the same item we were given and replace the payload with this new Int. We do this to reuse the metadata that was passed to us with the string, though this is an optional step. We could have instead opted to create new metadata and passed that out instead.

```python
def print_good_response(response):
    json_response = {"jsonrpc": "2.0", "method": "response", "params": {"Ok": response}}
    print(json.dumps(json_response))
    sys.stdout.flush()
```

Each response from the plugin back to Nu is also a json message that is sent on a single line. We convert the response to json and send it out with this helper function.

```python
import json
import fileinput
import sys
```

All of this takes a few imports to accomplish, so we make sure to include them.

```python
#!/usr/bin/python3
```

Finally, to make it easier to run our Python, we make this file executable (using something like `chmod +x nu_plugin_len`) and add the path to our python at the top. This trick works for Unix-based platforms, for Windows we would need to create an .exe or .bat file that would invoke the python code for us.

We are using Python 3 because Python 2 will not be maintained past 2020. However our script works accordingly with Python 2 and with Python 3.
Just change the first line into:

```python
#!/usr/bin/python
```

and you are good to go.

## Creating a plugin (in C#)

You can learn about creating a Nu plugin with C# here:

* [.Net Core nu-plugin-lib](https://github.com/myty/nu-plugin-lib)

