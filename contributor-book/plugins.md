---
title: Plugins
---

# Plugins

## Protocol

Plugins are executable applications that communicate with Nu by exchanging serialized data over a stream (much in the same way VSCode plugins do). The stream may either be stdio, which all plugins support, or a local socket (e.g. Unix domain socket or Windows named pipe) when supported. The protocol is split into two stages.

The first stage of the protocol deals with the initial discovery of the plugin. When a plugin is registered the plugin is executed and asked to reply with its configuration. Just as with commands, plugins have a signature that they respond to Nu with. Once Nu has this signature, it knows how to later invoke the plugin to do work.

The second stage is the actual doing of work. Here the plugins are executed and sent serialized input data. The plugin then replies with the serialized output data.

For more detailed information about how exactly this communication works, especially if trying to implement a plugin in a language other than Rust, see the [plugin protocol](plugin_protocol_reference.md) section.

## Discovery

Nu keeps a registry of plugins known as the ‘plugin registry file’ at the file system location defined by configuration variable `$nu.plugin-path`. To add a plugin, execute `plugin add <path_to_plugin_executable>` in a Nu shell. The plugin's signatures will be added to the plugin registry file for future launches of Nu. To make them available immediately, call `plugin use <plugin_name>`.

## Launch environment

When launched in `stdio` mode, `stdin` and `stdout` are redirected for use in the plugin protocol, and must not be used for other purposes. Stderr is inherited, and may be used to print to the terminal.

When launched in `local-socket` mode, `stdin` and `stdout` can also be used to interact with the user's terminal. This is the default for Rust plugins unless `local-socket` is disabled, and can be checked for by calling [`EngineInterface::is_using_stdio()`](https://docs.rs/nu-plugin/latest/nu_plugin/struct.EngineInterface.html#method.is_using_stdio). Plugins may fall back to `stdio` mode if sockets are not working for some reason, so it is important to check this if you are going to be using `stdin` or `stdout`.

`local-socket` is a default Cargo feature of `nu-plugin`. To build a plugin without it, turn off the default features:

```toml
[dependencies]
nu-plugin = { version = "0.116.0", default-features = false }
```

A plugin built this way leaves the [`LocalSocket` feature](plugin_protocol_reference.md#localsocket-feature) out of its `Hello` message, so Nu always runs it in `stdio` mode. If it's started with `--local-socket` anyway, it prints "local socket mode is not supported" to stderr and exits with status 1.

Environment variables set in the shell are set in the environment of a plugin when it is launched from a plugin call.

Plugins are always started with the directory of their executable as their working directory. This is because they may be sent calls with different shell working directory contexts over time. [`EngineInterface::get_current_dir()`](https://docs.rs/nu-plugin/latest/nu_plugin/struct.EngineInterface.html#method.get_current_dir) can be used to determine the current working directory of the context of a call. For more information, see [this section](#current-directory).

## Creating a plugin (in Rust)

In this section, we'll walk through creating a Nu plugin using Rust.

Let's create our project. For this example, we'll create a simple `len` command which will return the length of strings it's passed.

First off, we'll create our plugin:

```sh
cargo new nu_plugin_len
cd nu_plugin_len
```

Next, we'll add `nu` to our project's dependencies.

```sh
cargo add nu-plugin nu-protocol
```

The `Cargo.toml` file should now look something like the following.

```toml
[package]
name = "nu_plugin_len"
version = "0.1.0"
edition = "2024"

[dependencies]
nu-plugin = "0.116.0"
nu-protocol = "0.116.0"
```

Use the same version for both crates, matching the version of Nushell you want to use the plugin with. Nushell checks this version when it launches the plugin. Before 1.0, the minor version has to match: a plugin built with `nu-plugin` 0.116.0 works with any Nushell 0.116.x, but not with 0.115 or 0.117.

With this, we can open up `src/main.rs` and create our plugin.

```rust
use nu_plugin::{EvaluatedCall, JsonSerializer, serve_plugin};
use nu_plugin::{EngineInterface, Plugin, PluginCommand, SimplePluginCommand};
use nu_protocol::{LabeledError, Signature, Type, Value};

struct LenPlugin;

impl Plugin for LenPlugin {
    fn version(&self) -> String {
        env!("CARGO_PKG_VERSION").into()
    }

    fn commands(&self) -> Vec<Box<dyn PluginCommand<Plugin = Self>>> {
        vec![
            Box::new(Len),
        ]
    }
}

struct Len;

impl SimplePluginCommand for Len {
    type Plugin = LenPlugin;

    fn name(&self) -> &str {
        "len"
    }

    fn description(&self) -> &str {
        "calculates the length of its input"
    }

    fn signature(&self) -> Signature {
        Signature::build(PluginCommand::name(self))
            .input_output_type(Type::String, Type::Int)
    }

    fn run(
        &self,
        _plugin: &LenPlugin,
        _engine: &EngineInterface,
        call: &EvaluatedCall,
        input: &Value,
    ) -> Result<Value, LabeledError> {
        let span = input.span();
        match input {
            Value::String { val, .. } => Ok(
                Value::int(val.len() as i64, span)
            ),
            _ => Err(
                LabeledError::new("Expected String input from pipeline")
                    .with_label(
                        format!("requires string input; got {}", input.get_type()),
                        call.head,
                    )
            ),
        }
    }
}

fn main() {
    serve_plugin(&LenPlugin, JsonSerializer)
}
```

There are a few moving parts here, so let's break them down one by one.

First off, let's look at main:

```rust
fn main() {
    serve_plugin(&LenPlugin, JsonSerializer)
}
```

In `main()`, we just call a single function `serve_plugin`. This will do the work of calling into our plugin, handling the JSON serialization/deserialization, and sending values and errors back to Nu for us. To start it up, we pass it something that implements the `Plugin` trait and something that implements the `PluginEncoder` trait. We're given a choice of serialization formats that Nu supports. Ordinarily plugins written in Rust should use `MsgPackSerializer` as it is considerably faster, but here we select JSON to demonstrate how the communication protocol works further on in this tutorial.

`serve_plugin` reads the arguments that Nushell starts the plugin with (`--stdio`, or `--local-socket` and a socket name), tells Nushell which encoding the plugin uses, and then hands the connection to `serve_plugin_io`, which runs the protocol over any reader and writer. If two of the plugin's commands return the same `name()`, `serve_plugin_io` prints a warning to stderr when the plugin starts, and the command that comes later in `commands()` replaces the earlier one. When Nushell asks for the plugin's signatures during `plugin add`, `create_plugin_signature` builds each command's signature from its `signature()`, `description()`, `extra_description()`, `search_terms()`, and `examples()` methods. `nu-plugin` exports both functions, but they are hidden from its API documentation and aren't a public API. They exist for `nu-plugin-test-support`. In your own plugin, call `serve_plugin`, and test it with [`nu-plugin-test-support`](#testing-plugins).

`serve_plugin` also handles a plugin binary that someone runs by hand. With no arguments, or with `-h` or `--help`, it prints a summary and exits with status 0: the encoder, the plugin's `version()`, the path of the binary, and then each command's description, extra description, flags, and parameters. Any other arguments make it print "This plugin must be run from within Nushell", along with a hint that the plugin may not match the Nushell version, and exit with status 1.

Above `main()` is the implementation of the `SimplePluginCommand` trait for the `len` command that our plugin will expose, which is represented by the `Len` type. We use `SimplePluginCommand` rather than `PluginCommand` in order to simplify our implementation and avoid [handling streams](#using-streams-in-plugins). Let's take a look at how we implement this trait:

```rust
impl SimplePluginCommand for Len {
    type Plugin = LenPlugin;

    // ...
}
```

We first specify the plugin type our command expects. This allows us to receive a reference to it in `run()`, which we can use for shared state between commands.

```rust
impl SimplePluginCommand for Len {
    // ...


    fn name(&self) -> &str {
        "len"
    }

    fn description(&self) -> &str {
        "calculates the length of its input"
    }

    fn signature(&self) -> Signature {
        Signature::build(PluginCommand::name(self))
            .input_output_type(Type::String, Type::Int)
    }

    // ...
}
```

There are a few methods required for this implementation. We first define the `name` of the command, which is what the user will type at the prompt or in their script to run the command. The `description` is also required, which is a short documentation string for users to know what the command does, and is displayed along with completions and in `help`. Finally, we define the `signature`, which specifies arguments and types for the command.

We tell Nu that the name is "len", give it a basic description for `help` to display and declare that we expect to be passed a string and will return an integer.

`PluginCommand` and `SimplePluginCommand` have a few more methods, with default implementations that you can override:

- `extra_description()` returns longer help text. `help len` shows it below the description. The default is empty.
- `search_terms()` returns other words for the command. `help --find` matches them as well as the name and description, and `help commands` lists them in its `search_terms` column. The default is an empty list.
- `examples()` returns examples that `help` displays, and that [`nu-plugin-test-support`](#testing-plugins) can run as tests.
- `get_dynamic_completion()` computes [argument completions](#argument-completions).

```rust
impl SimplePluginCommand for Len {
    // ...

    fn extra_description(&self) -> &str {
        "Counts bytes, not characters, so multibyte text reports a larger length."
    }

    fn search_terms(&self) -> Vec<&str> {
        vec!["size", "count"]
    }
}
```

Next, in the `run` implementation, we describe how to do work as values flow into this plugin. Here, we receive a `Value` type that we expect to be a string. We also return either `Value` or an error.

```rust
impl SimplePluginCommand for Len {
    // ...

    fn run(
        &self,
        _plugin: &LenPlugin,
        _engine: &EngineInterface,
        call: &EvaluatedCall,
        input: &Value,
    ) -> Result<Value, LabeledError> {
        let span = input.span();
        match input {
            Value::String { val, .. } => Ok(
                Value::int(val.len() as i64, span)
            ),
            _ => Err(
                LabeledError::new("Expected String input from pipeline")
                    .with_label(
                        format!("requires string input; got {}", input.get_type()),
                        call.head,
                    )
            ),
        }
    }
}
```

We use Rust's pattern matching to check the type of the `Value` coming in, and then operate with it if it's a string. The value also contains a `span` so it carries with it where the value came from. If the value isn't a string, we give an error and let the user know where the value came from that is causing the problem. On error, we use `call.head` as the span so that Nu can underline the offending command name in the error message.

`LabeledError::new()` takes the main message, and builder methods add the rest:

- `with_label(text, span)` underlines a span with a message. Call it once for each span.
- `with_help(text)` adds a hint, shown after `help:`.
- `with_code(code)` sets a code such as `nu_plugin_len::wrong_input`. Nu prints it after `Error:`, in place of the default `nu::shell::error`.
- `with_url(url)` links the code to a page about the error. Terminals that support hyperlinks make the code clickable.
- `with_inner(error)` attaches another error, such as the one that caused this one. Nu prints each inner error after the main one. It takes a `LabeledError` or any `ShellError`.

```rust
Err(LabeledError::new("Expected String input from pipeline")
    .with_label(format!("requires string input; got {}", input.get_type()), call.head)
    .with_help("convert the value with `into string` first")
    .with_code("nu_plugin_len::wrong_input")
    .with_url("https://example.org/nu_plugin_len/errors#wrong_input"))
```

Our `Len` command doesn't require any parameters, but if it did we'd get them from the `EvaluatedCall`. Its `head` field is the span of the command name, and these methods read the arguments:

```rust
// For a call like: my-command 1 a b c --count 3 --verbose
let first: i64 = call.req(0)?;                    // a required positional
let second: Option<String> = call.opt(1)?;        // None if not given
let others: Vec<String> = call.rest(2)?;          // every positional from index 2 on
let count: Option<i64> = call.get_flag("count")?; // None if not given
let verbose: bool = call.has_flag("verbose")?;    // a switch
```

- `req(index)` and `opt(index)` convert a positional argument to any type that implements `FromValue`, such as `i64`, `String`, `Spanned<String>`, `Value`, or `Spanned<Closure>`. `req` fails if the argument is missing, and both fail if the conversion does.
- `rest(start)` converts all positional arguments from `start` to the end, including those that a spread (`...$list`) supplied.
- `nth(index)` returns a positional argument as an `Option<Value>`, without converting it.
- `has_flag(name)` is `true` for `--name` and `--name=true`, `false` when the switch is absent or given `--name=false`, and an error for a non-boolean value.
- `get_flag(name)` converts a flag's value with `FromValue`, and returns `None` when the flag is absent. `get_flag_value(name)` returns the value as an `Option<Value>` without converting it. For a switch given without a value, it returns `None`, so use `has_flag` for switches.
- `get_flag_span(name)` returns the span of the flag itself, which is useful in an error about a switch, since a switch has no value to take a span from.

Look up flags by their long name. Nu always sends the long name, even when the user typed the short one. It also doesn't fill in the `default_value` from your signature. `help` shows the default, but an argument the user left out is missing from the call, so `opt` and `get_flag` return `None` for it, and the plugin has to apply the default itself.

```rust
struct Len;
```

`Len` is defined as a unit struct, with no fields, and this is the most common type definition for a command in a plugin. However, you may choose to keep state here if you want to - every call of `len` shares the same reference.

Above that, let's have a look at the definition of `LenPlugin`, which implements the `Plugin` trait:

```rust
struct LenPlugin;

impl Plugin for LenPlugin {
    fn version(&self) -> String {
        env!("CARGO_PKG_VERSION").into()
    }

    fn commands(&self) -> Vec<Box<dyn PluginCommand<Plugin = Self>>> {
        vec![
            Box::new(Len),
        ]
    }
}
```

Again, we use a unit struct for `LenPlugin`, but this is the recommended place to put plugin state if needed. All commands also get a reference to the plugin type. This is what we eventually pass to `serve_plugin()` in `main()`.

`Plugin` has two required methods: `version()`, which reports the plugin's version back to Nu, and `commands()`, which initializes the plugin's commands. A boxed `dyn` reference is used so that we can keep all of the different command types in the single list. Dispatch by command name is automatically handled in `serve_plugin()` by looking at the name defined in the signature - in our case, that's `len`. A plugin can contain many commands, so if you end up adding more, just add them to the list returned by `commands()`.

For the version, we just use the `CARGO_PKG_VERSION` environment variable available at compile-time in order to get our plugin's version from Cargo.

Lastly, let's look at the top of the file:

```rust
use nu_plugin::{serve_plugin, JsonSerializer, EvaluatedCall};
use nu_plugin::{Plugin, PluginCommand, SimplePluginCommand, EngineInterface};
use nu_protocol::{LabeledError, Signature, Type, Value};
```

Here we import everything we need -- types and functions -- to be able to create our plugin.

Once we have finished our plugin, to use it all we need to do is install it.

```nu
cargo install --path . --locked
# nushell only (run with `nu -c` if not in nushell)
plugin add ~/.cargo/bin/nu_plugin_len # add .exe on Windows
```

If you're already running `nu` during the installation process of your plugin, ensure you restart `nu` so that it can load your plugin, or call `plugin use` to load it immediately:

```nu
plugin use len # the name of the plugin (without `nu_plugin_`)
```

Once `nu` starts up, it will discover the plugin and add its commands to the scope.

```nu
"hello" | len
# => 5
help len
# => calculates the length of its input
# =>
# => Usage:
# =>   > len
# =>
# => Flags:
# =>   -h, --help: Display the help message for this command
# =>
# => Command Type:
# =>   > plugin
# =>
# => Input/output types:
# =>   ╭───┬────────┬────────╮
# =>   │ # │ input  │ output │
# =>   ├───┼────────┼────────┤
# =>   │ 0 │ string │ int    │
# =>   ╰───┴────────┴────────╯
```

Run `plugin list` to see all plugins currently registered and available to this Nu session. Its `status` column shows whether each plugin is running, and the `pid` column shows its process ID if so.

## Using streams in plugins

The `SimplePluginCommand` trait that we just implemented for our plugin does not support streaming input or output. If we want to extend our plugin to support determining the lengths of lists, it would be helpful to not have to consume an entire list that is a stream. We can do this by implementing `PluginCommand` instead.

```rust
// add these imports:
use nu_protocol::{IntoPipelineData, PipelineData};
// ...

// change SimplePluginCommand to PluginCommand:
impl PluginCommand for Len {
    type Plugin = LenPlugin;

    // ...

    fn signature(&self) -> Signature {
        // ... add the list type to the signature
        Signature::build(PluginCommand::name(self))
            .input_output_types(vec![
                (Type::String, Type::Int),
                (Type::List(Type::Any.into()), Type::Int),
            ])
    }

    // ... and change input and output types to PipelineData
    fn run(
        &self,
        _plugin: &LenPlugin,
        _engine: &EngineInterface,
        call: &EvaluatedCall,
        input: PipelineData,
    ) -> Result<PipelineData, LabeledError> {
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
            PipelineData::Value(Value::String { val, .. }, _) => {
                Ok(Value::int(val.len() as i64, call.head).into_pipeline_data())
            },
            _ => Err(
                LabeledError::new(
                    "Expected String or iterable input from pipeline",
                ).with_label(
                    format!(
                        "requires string or iterable input; got {}",
                        input.get_type(),
                    ),
                    call.head,
                )
            ),
        }
    }
}
```

With this change, we can pipe a list (even a long one) to the command to get its length:

```nu
seq 1 10000 | len
# => 10000
```

Since `run()` also returns `PipelineData`, it is also possible for the plugin to produce a stream, or even to transform a stream. For example, if we wanted our plugin to have a `double` command that multiplies every integer by
two:

```rust
fn run(
    ..., 
    engine: &EngineInterface,
    call: &EvaluatedCall,
    input: PipelineData,
) -> Result<PipelineData, LabeledError> {
    input.map(|value| {
        let span = value.span();
        match value.as_int() {
            Ok(int) => Value::int(int * 2, span),

            // In list streams (i.e., lists of `Value`), errors are always represented by
            // `Value::Error`.
            Err(err) => Value::error(err, span),
        }
    }, engine.signals()).map_err(|e|
        LabeledError::new(
            "Failed",
        ).with_label(
            format!(
                "Failed; {}",
                e,
            ),
            call.head,
        )
    )
}
```

Since the input and output are both streaming, this will work even on an infinite stream. Here, `first 5` stops reading after five values:

```nu
generate { |n| {out: $n, next: ($n + 1)} } 0 | double | first 5
# => ╭───┬───╮
# => │ 0 │ 0 │
# => │ 1 │ 2 │
# => │ 2 │ 4 │
# => │ 3 │ 6 │
# => │ 4 │ 8 │
# => ╰───┴───╯
```

### Byte streams

`PipelineData` can also be a `ByteStream`, which carries raw bytes instead of values, for example the output of an external command or of `open --raw`. To accept one, declare a `Type::String` or `Type::Binary` input in the signature and match `PipelineData::ByteStream(stream, metadata)`. Then read it in whichever way fits:

- `stream.reader()` returns a `Reader` that implements `std::io::Read` and `BufRead`.
- `stream.lines()` returns an iterator of `Result<String, ShellError>`, one per line, without the line endings.
- `stream.chunks()` returns the data in pieces as string or binary `Value`s.
- `stream.into_bytes()` and `stream.into_string()` collect the whole stream.

`reader()`, `lines()`, and `chunks()` return `None` for an external command that has no standard output to read. This command counts the lines of its input:

```rust
fn run(
    &self,
    _plugin: &MyPlugin,
    _engine: &EngineInterface,
    call: &EvaluatedCall,
    input: PipelineData,
) -> Result<PipelineData, LabeledError> {
    match input {
        PipelineData::ByteStream(stream, _) => {
            let mut count = 0;
            if let Some(lines) = stream.lines() {
                for line in lines {
                    line?; // stop at the first read error
                    count += 1;
                }
            }
            Ok(Value::int(count, call.head).into_pipeline_data())
        }
        _ => Err(LabeledError::new("Expected a byte stream")
            .with_label("requires string or binary input", call.head)),
    }
}
```

To produce bytes, return `PipelineData::byte_stream(stream, None)`. `ByteStream::from_result_iter()` builds the stream from an iterator of `Result` byte buffers (anything that implements `AsRef<[u8]>`), and `ByteStream::read()` builds it from anything that implements `Read`. Both take a `ByteStreamType`: `String` or `Binary` tells Nu how to convert the bytes when it collects them, and `Unknown` lets it decide from the data. This command, from `nu_plugin_example`'s `example collect-bytes`, joins a list of strings or binary values into one stream:

```rust
fn run(
    &self,
    _plugin: &MyPlugin,
    engine: &EngineInterface,
    call: &EvaluatedCall,
    input: PipelineData,
) -> Result<PipelineData, LabeledError> {
    let stream = ByteStream::from_result_iter(
        input.into_iter().map(Value::coerce_into_binary),
        call.head,
        engine.signals().clone(),
        ByteStreamType::Unknown,
    );
    Ok(PipelineData::byte_stream(stream, None))
}
```

### When input streams end

Since 0.117.0, the SDK releases a call's input stream as soon as the call's response has been sent in full, or when Nu drops the call's output stream (for example after `first 5`). Reading from the input after that fails with `ShellError::Interrupted`, not a clean end of stream, so you can tell a cut-off stream from a complete one. Returning a lazy output stream that reads from the input, like `double` above, keeps the input alive for as long as that stream is being written.

This matters if a plugin hands its input to a background thread and keeps reading after `run()` has returned its response. To do that, call [`engine.set_gc_disabled(true)`](#disabling-garbage-collection) first. The SDK checks the setting each time a response finishes, and skips the release while garbage collection is disabled. Dropping the output stream still releases the input, whatever the setting.

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
use nu_protocol::{LabeledError, Signature, Type, Value};

struct MotdPlugin;

impl Plugin for MotdPlugin {
    fn version(&self) -> String {
        env!("CARGO_PKG_VERSION").into()
    }

    fn commands(&self) -> Vec<Box<dyn PluginCommand<Plugin = Self>>> {
        vec![
            Box::new(Motd),
        ]
    }
}

struct Motd;

impl SimplePluginCommand for Motd {
    type Plugin = MotdPlugin;

    fn name(&self) -> &str {
        "motd"
    }

    fn description(&self) -> &str {
        "Message of the day"
    }

    fn signature(&self) -> Signature {
        Signature::build(PluginCommand::name(self))
            .input_output_type(Type::Nothing, Type::String)
    }

    fn run(
        &self,
        _plugin: &MotdPlugin,
        engine: &EngineInterface,
        call: &EvaluatedCall,
        _input: &Value,
    ) -> Result<Value, LabeledError> {
        if let Some(config) = engine.get_plugin_config()? {
            let message = config.get_data_by_key("message")
                .ok_or_else(
                    || LabeledError::new("Message not present in config")
                        .with_label("add the `message` key here", config.span())
                )?;
            Ok(Value::string(message.as_str()?, call.head))
        } else {
            Err(LabeledError::new("Config for `motd` not set in $env.config.plugins"))
        }
    }
}

fn main() {
    serve_plugin(&MotdPlugin, MsgPackSerializer)
}
```

Example:

```nu
$env.config.plugins.motd = {message: "Nushell rocks!"}
motd
# => Nushell rocks!
```

`get_plugin_config()` returns `Ok(None)` when the user hasn't set `$env.config.plugins.motd`. If the setting is a closure, Nu runs it on every `get_plugin_config()` call, in the scope of the command call, and returns its result. When that closure fails, the method still returns `Ok`. The error arrives as `Ok(Some(Value::Error { .. }))`, so check for it if a broken configuration should fail the command:

```rust
match engine.get_plugin_config()? {
    Some(Value::Error { error, .. }) => return Err((*error).into()),
    Some(config) => { /* read the settings */ }
    None => { /* use the defaults */ }
}
```

For a full example, see [`nu_plugin_example`](https://github.com/nushell/plugin-examples/tree/main/rust/nu_plugin_example).

## Evaluating closures

Plugins can accept and evaluate closures using [`EngineInterface::eval_closure`](https://docs.rs/nu-plugin/latest/nu_plugin/struct.EngineInterface.html#method.eval_closure) or [`eval_closure_with_stream`](https://docs.rs/nu-plugin/latest/nu_plugin/struct.EngineInterface.html#method.eval_closure_with_stream).

```rust
use nu_plugin::*;
use nu_protocol::{LabeledError, PipelineData, Signature, SyntaxShape, Type, Value};

struct MyEachPlugin;

impl Plugin for MyEachPlugin {
    fn version(&self) -> String {
        env!("CARGO_PKG_VERSION").into()
    }

    fn commands(&self) -> Vec<Box<dyn PluginCommand<Plugin = Self>>> {
        vec![
            Box::new(MyEach),
        ]
    }
}

struct MyEach;

impl PluginCommand for MyEach {
    type Plugin = MyEachPlugin;

    fn name(&self) -> &str {
        "my-each"
    }

    fn description(&self) -> &str {
        "Run closure on each element of a list"
    }

    fn signature(&self) -> Signature {
        Signature::build(PluginCommand::name(self))
            .required(
                "closure",
                SyntaxShape::Closure(Some(vec![SyntaxShape::Any])),
                "The closure to evaluate",
            )
            .input_output_type(Type::list(Type::Any), Type::list(Type::Any))
    }

    fn run(
        &self,
        _plugin: &MyEachPlugin,
        engine: &EngineInterface,
        call: &EvaluatedCall,
        input: PipelineData,
    ) -> Result<PipelineData, LabeledError> {
        let closure = call.req(0)?;
        let engine_clone = engine.clone();
        Ok(input.map(move |item| {
            let span = item.span();
            engine_clone.eval_closure(&closure, vec![item.clone()], Some(item))
                .unwrap_or_else(|err| Value::error(err, span))
        }, engine.signals())?)
    }
}

fn main() {
    serve_plugin(&MyEachPlugin, MsgPackSerializer)
}
```

`my-each` works just like `each`:

```nu
[1 2 3] | my-each { |i| $i * 2 }
# => ╭───┬───╮
# => │ 0 │ 2 │
# => │ 1 │ 4 │
# => │ 2 │ 6 │
# => ╰───┴───╯
```

`eval_closure()` collects the closure's output into a single `Value`, and turns an error value into `Err`. `eval_closure_with_stream()` takes `PipelineData` as input and returns `PipelineData`, so the input and output can both be streams. Its last two arguments, `redirect_stdout` and `redirect_stderr`, matter when the closure ends in an external command. With `redirect_stdout` set to `true`, the command's standard output comes back to the plugin as a byte stream. With `false`, it goes to the terminal, as it would for an external command at the end of a pipeline in the REPL, and the plugin gets no data from it. `redirect_stderr` makes the same choice for standard error, and `false` sends it to the terminal. `eval_closure()` passes `true` and `false`. This command passes its input stream through a closure and returns the closure's output stream:

```rust
fn run(
    &self,
    _plugin: &MyPlugin,
    engine: &EngineInterface,
    call: &EvaluatedCall,
    input: PipelineData,
) -> Result<PipelineData, LabeledError> {
    let closure = call.req(0)?;
    // Capture the closure's standard output, and let its standard error reach the terminal
    Ok(engine.eval_closure_with_stream(&closure, vec![], input, true, false)?)
}
```

At present, the closures can only refer to values that would be valid to send to the plugin. This means that custom values from other plugins are not allowed. This is likely to be fixed in a future release.

## Custom values

Plugins can create custom values that embed plugin-specific data within the engine. In Rust, this data is automatically serialized as MessagePack using [rmp-serde](https://crates.io/crates/rmp-serde), which writes structs without their field names, so all you need to do is implement the [`CustomValue`](https://docs.rs/nu-protocol/latest/nu_protocol/trait.CustomValue.html) trait on a type that has `Serialize` and `Deserialize` implementations compatible with that format. Avoid any attributes that would cause a dependency on field names or field presence, such as `#[serde(skip_serializing_if = "...")]` or `#[serde(untagged)]`. We use the [typetag](https://crates.io/crates/typetag) crate to reconstruct the correct custom value type, so add `serde` (with the `derive` feature) and `typetag` to your plugin's dependencies.

To embed the custom value in a `Value`, use [`Value::custom()`](https://docs.rs/nu-protocol/latest/nu_protocol/enum.Value.html#method.custom). A minimal example:

```rust
use nu_protocol::{CustomValue, ShellError, Span, Value, record};
use serde::{Deserialize, Serialize};
use std::any::Any;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Animal {
    Dog {
        name: String,
        woof: bool,
    },
    Cat {
        name: String,
        meow: bool,
    },
}

#[typetag::serde]
impl CustomValue for Animal {
    fn clone_value(&self, span: Span) -> Value {
        Value::custom(Box::new(self.clone()), span)
    }

    fn type_name(&self) -> String {
        "Animal".into()
    }

    fn to_base_value(&self, span: Span) -> Result<Value, ShellError> {
        // Construct a simple Nushell value that makes sense here.
        // It must not be a custom value.
        Ok(match self {
            Animal::Dog { name, woof } => Value::record(record! {
                "type" => Value::string("dog", span),
                "name" => Value::string(name, span),
                "woof" => Value::bool(*woof, span),
            }, span),
            Animal::Cat { name, meow } => Value::record(record! {
                "type" => Value::string("cat", span),
                "name" => Value::string(name, span),
                "meow" => Value::bool(*meow, span),
            }, span),
        })
    }

    fn as_any(&self) -> &dyn Any {
        self
    }

    fn as_mut_any(&mut self) -> &mut dyn Any {
        self
    }
}

// Use the custom value
Value::custom(Box::new(Animal::Dog {
    name: "Rex".into(),
    woof: true,
}), call.head)
```

`type_name()` is what `describe` shows and what errors call the value. The trait has more methods with default implementations, which you can override to support cell paths, operators, comparison, and saving. For a plugin's custom value, Nu calls the plugin to run each of them, and starts the plugin first if it isn't running:

| Method                                                                    | When Nu calls it                                                                                                                                                                            | Default                                  |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `to_base_value(span)`                                                     | When it needs plain data: to display the value as a table, to convert it with commands like `to json`, or to turn it into a string.                                                         | Required                                 |
| `follow_path_int(self_span, index, path_span, optional)`                  | For a numeric cell path member, as in `$value.0`. `optional` is `true` for `$value.0?`.                                                                                                     | Error: the type doesn't support cell paths |
| `follow_path_string(self_span, column_name, path_span, optional, casing)` | For a named cell path member, as in `$value.name`. `casing` is `Casing::Insensitive` for `$value.name!`.                                                                                    | Same error                               |
| `operation(lhs_span, operator, op_span, right)`                           | For an operator with the custom value on its left, as in `$value + 1`, `$value == $other`, or `$value =~ "x"`. Comparison operators come here too, not to `partial_cmp`. `right` can be any value. | Error: unsupported operator              |
| `partial_cmp(other)`                                                      | When a command orders or compares values itself, as `sort` does. Return `None` when the values can't be compared.                                                                           | `None`                                   |
| `save(path, value_span, save_span)`                                       | When the value is piped to `save`, unless `save` converts it first because of the file extension (`.json`, for example).                                                                    | Error: the type doesn't implement saving |
| `notify_plugin_on_drop()`                                                 | See [Drop notification](#drop-notification).                                                                                                                                                | `false`                                  |

An operator with the custom value on its right side never reaches the plugin, so `1 + $value` is an error, and `1 == $value` is `false`. If the plugin's `partial_cmp` returns an error, Nu logs it and treats the values as not comparable.

Two other trait methods, `is_iterable()` and `update_data_at_cell_path()`, have no effect on a plugin's custom values, because Nu doesn't forward them to the plugin. Nu treats a plugin's custom value as not iterable, and changing a cell path inside one (`$value | update name 1`) works on its base value, so the result is plain data and no longer a custom value.

The `Plugin` trait has a hook for each of these operations: `custom_value_to_base_value()`, `custom_value_follow_path_int()`, `custom_value_follow_path_string()`, `custom_value_operation()`, `custom_value_partial_cmp()`, and `custom_value_save()`. Their defaults call the matching `CustomValue` method. Override a hook when the answer depends on the plugin's state and not only on the value's own data, since the hook gets `&self` (the plugin) and the `EngineInterface`. For example, `nu_plugin_custom_values` stores values in a map inside the plugin and hands out small handle values, and its `custom_value_to_base_value()` looks each handle up in that map. The Polars plugin overrides these hooks the same way, because its dataframes live in the plugin's memory.

### Drop notification

It is possible to ask Nushell to let you know when all copies of a custom value passed to it have gone out of scope and will no longer be used:

```rust
impl CustomValue for Animal {
    // ...
    fn notify_plugin_on_drop(&self) -> bool {
        true
    }
}
```

The notification is sent to the `Plugin` via [`custom_value_dropped()`](https://docs.rs/nu-plugin/latest/nu_plugin/trait.Plugin.html#method.custom_value_dropped):

```rust
impl Plugin for AnimalPlugin {
    // ...
    fn custom_value_dropped(
        &self,
        _engine: &EngineInterface,
        custom_value: Box<dyn CustomValue>,
    ) -> Result<(), LabeledError> {
        if let Some(animal) = custom_value.as_any().downcast_ref::<Animal>() {
            eprintln!("Animal dropped: {:?}", animal);
        }
        Ok(())
    }
}
```

Every custom value sent from the plugin to the engine counts as a new unique value for the purpose of drop checking. If you accept a custom value as an argument and then return it after, you will likely receive two drop notifications, even though the value data is identical. This has implications for trying to use custom values to reference count handles.

For a full example, see [`DropCheck`](https://github.com/nushell/nushell/blob/main/crates/nu_plugin_custom_values/src/drop_check.rs) in the `nu_plugin_custom_values` plugin.

## Manipulating the environment

Environment variables can be get or set through the [`EngineInterface`](https://docs.rs/nu-plugin/latest/nu_plugin/struct.EngineInterface.html). For example:

```rust
// Get the PATH environment variable (`None` if it isn't set)
let paths: Option<Value> = engine.get_env_var("PATH")?;
// Get all environment variables
let envs: HashMap<String, Value> = engine.get_env_vars()?;
// Set an environment variable
engine.add_env_var("FOO", Value::string("bar", call.head))?;
```

Environment variables set during a plugin call are available in the caller's scope after the plugin call returns, and are also visible to other engine calls (such as closure evaluations) during the plugin call. Setting an environment variable after the plugin call has returned a response - for example while a stream is being produced as the result of a plugin call - has no impact on the environment of the caller's scope.

### Current directory

As noted earlier in the [Launch environment](#launch-environment) section, plugins are always started in the directory of their executable. This is intentionally done to try to ensure the current directory of the shell context is handled correctly. For plugins that work with filesystem paths, relative paths should always be joined against the path returned by [`EngineInterface::get_current_dir()`](https://docs.rs/nu-plugin/latest/nu_plugin/struct.EngineInterface.html#method.get_current_dir):

```rust
use std::path::Path;
use nu_protocol::Spanned;

let relative_path: Spanned<String> = call.req(0)?;
let absolute_path = Path::new(&engine.get_current_dir()?).join(&relative_path.item);

// For example:
if !absolute_path.exists() {
    return Err(
        LabeledError::new(format!("{} does not exist", absolute_path.display()))
            .with_label("file not found", relative_path.span)
    );
}
```

Note that it is not safe (at least in Rust) to change the plugin's process working directory (e.g. with `std::env::set_current_dir()`) to the current directory from the call context, as multiple threads could be processing calls in different working directories simultaneously.

## Plugin garbage collection

Nu comes with a [plugin garbage collector](/book/plugins.html#plugin-garbage-collector), which automatically stops plugins that are no longer in active use according to the user's preferences. Plugins are considered inactive for garbage collection if all of the following are true:

1. They don't have any pending plugin calls that have not sent a response yet
2. They are not currently writing any streams as part of a response
3. They have not [explicitly opted out](#disabling-garbage-collection) of garbage collection

Note that the following will **not** cause a plugin to be considered active:

- Plugin custom values being held by the Nu engine
- Reading streams produced by the engine outside of an active plugin call / response stream
- Doing work in the background on another thread
- Anything else not mentioned above

When plugins are stopped by Nu, they are not killed. Instead, Nu waits for anything actively using the plugin to finish, then sends [`Goodbye`](plugin_protocol_reference.html#goodbye) and may close stdin, at which point the plugin should exit gracefully.

### Disabling garbage collection

In order to support use cases outside of those that are already guaranteed to keep the plugin from being garbage collected, an option is provided to disable and re-enable garbage collection as desired by the plugin. From Rust code, this can be set by calling [`EngineInterface::set_gc_disabled`](https://docs.rs/nu-plugin/latest/nu_plugin/struct.EngineInterface.html#method.set_gc_disabled):

```rust
engine.set_gc_disabled(true); // Turn off garbage collection
engine.set_gc_disabled(false); // Turn it back on
```

This option is global to the plugin, and will last beyond the scope of a plugin call. Calls that run at the same time share it, and the last call to `set_gc_disabled` wins, so calls that turn it on and off have to coordinate, keeping it disabled until all of their background work has finished.

In Rust, the setting also controls [when input streams end](#when-input-streams-end). While garbage collection is disabled, the SDK doesn't release a call's input stream when the response finishes, so a background thread can keep reading it. The user's `$env.config.plugin_gc` settings don't have this effect. Only the plugin's own `set_gc_disabled(true)` does.

In other languages, the [`GcDisabled` option](plugin_protocol_reference.html#gcdisabled-option) can be sent at any time:

```json
{
  "Option": {
    "GcDisabled": true
  }
}
```

Note that opting out of garbage collection does not stop users from explicitly stopping your plugin with the `plugin stop` command. We recommend against disabling garbage collection unless your plugin has a good reason to stay running - for example, to keep data in memory, to do background processing, or to keep shared resources like sockets or files open. For custom values that contain all of the data that they need to be interpreted properly, the plugin can always be re-launched as necessary.

If your plugin takes a particularly long time to launch, you can recommend to your users that they change their [garbage collection settings](/book/plugins.html#plugin-garbage-collector) to either increase the `stop_after` duration, or disable garbage collection entirely for your plugin.

## Making calls to other Nushell commands

Plugins can look up and make calls to other Nushell commands in the scope of the original plugin call. This includes internal commands, custom commands written in Nushell, as well as commands provided by plugins. The relevant calls are [`FindDecl`](plugin_protocol_reference.html#finddecl-engine-call) and [`CallDecl`](plugin_protocol_reference.html#calldecl-engine-call).

From Rust, use the [`.find_decl()`](https://docs.rs/nu-plugin/latest/nu_plugin/struct.EngineInterface.html#method.find_decl) and [`.call_decl()`](https://docs.rs/nu-plugin/latest/nu_plugin/struct.EngineInterface.html#method.call_decl) methods on `EngineInterface`. Provide arguments by adding them to an [`EvaluatedCall`](https://docs.rs/nu-plugin/latest/nu_plugin/struct.EvaluatedCall.html) via the builder or setter methods. For example:

```rust
// Find the two commands we need. We strongly recommend using a descriptive error here, and
// discourage `.unwrap()` or `.expect()` as it's quite possible to not find something in scope, even
// if it's a core Nushell command.
let find_decl = |name| {
    engine.find_decl(name)?.ok_or_else(|| {
        LabeledError::new(format!("can't find `{name}`"))
            .with_label("required here", call.head)
            .with_help("not found in scope, perhaps you have to import it")
    })
};
let std_assert = find_decl("std assert")?;
let view_ir = find_decl("view ir")?;
// `engine.find_decl()` returns an identifier which can also be passed to `view ir --decl-id`.
let ir_of_assert = engine
    .call_decl(
        view_ir,
        // Call `view ir --decl-id <std_assert>`
        EvaluatedCall::new(call.head)
            .with_flag("decl-id".into_spanned(call.head))
            .with_positional(Value::int(std_assert.get() as i64, call.head)),
        PipelineData::Empty,
        true,
        false,
    )?
    .into_value(call.head)?
    .into_string()?;
eprintln!("IR of `std assert`:");
eprintln!("{ir_of_assert}");
```

The `.into_spanned()` method comes from the `nu_protocol::IntoSpanned` trait. `EvaluatedCall` has three builder methods, which consume the call and return it: `with_positional(value)` adds a positional argument, `with_named(name, value)` adds a flag with a value, and `with_flag(name)` adds a switch. The `add_positional`, `add_named`, and `add_flag` methods do the same through a `&mut` reference, which suits a loop:

```rust
let mut args = EvaluatedCall::new(call.head);
args.add_named("separator".into_spanned(call.head), Value::string(",", call.head));
for value in values {
    args.add_positional(value);
}
```

Give flag names in their long form, without the leading `--`. In this example, `std assert` is only in scope if the user ran `use std` before calling the plugin command. Otherwise, `find_decl()` returns `None` and the command fails with the "can't find" error.

Keep in mind that the engine will not validate that the parameters of a call made by the plugin actually matches the signature of the command being called, so care must be taken when designing the plugin to try to match the documented signature. There is not currently a way to look up the signature of a command before running it, but we may add that in the future to make it easier to ensure a plugin call behaves as expected. As performance is a priority for plugins, we do not intend to validate call arguments from plugins at this time.

There is some overhead when making calls from plugins back to the engine, and it may be difficult to construct some of the arguments for commands - for example, it's not possible to create new closures from within plugins. We recommend trying to implement functionality within the plugin if possible, and falling back to command calls only when necessary. It is virtually guaranteed that a script that chains multiple commands together will be more performant than trying to put pipelines together from within a plugin, so you may want to provide a companion script with your plugins, or expect your users to compose pipelines made up of simple commands [rather than providing lots of different options](https://www.nushell.sh/contributor-book/philosophy_0_80.html#command-philosophy).

## Argument completions

Plugin commands can compute completions for their flags and positional arguments when the user presses <kbd>Tab</kbd>. In Rust, implement the `get_dynamic_completion()` method of `PluginCommand` or `SimplePluginCommand`. It receives the call being completed and an `ArgType` (`ArgType::Flag(name)` or `ArgType::Positional(index)`), and returns `Some` list of `DynamicSuggestion`s, or `None` to fall back to Nushell's default completions. This API is experimental and likely to change, which is why the method takes a deprecated `ExperimentalMarker` parameter (put `#[allow(deprecated)]` on your implementation to silence the warning). For a complete example, see [`arg_completion.rs`](https://github.com/nushell/nushell/blob/main/crates/nu_plugin_example/src/commands/arg_completion.rs) in `nu_plugin_example`. You can check the results with `commandline complete`, e.g. `'my-command --flag ' | commandline complete`.

This command offers colors for its `--color` flag, and leaves its positional arguments to Nushell's default completions:

```rust
use nu_plugin::{DynamicCompletionCall, EngineInterface, PluginCommand};
use nu_protocol::{DynamicSuggestion, SuggestionKind, Type, engine::ArgType};

impl PluginCommand for Paint {
    // ...

    #[allow(deprecated)]
    fn get_dynamic_completion(
        &self,
        _plugin: &Self::Plugin,
        _engine: &EngineInterface,
        _call: DynamicCompletionCall,
        arg_type: ArgType,
        _experimental: nu_protocol::engine::ExperimentalMarker,
    ) -> Option<Vec<DynamicSuggestion>> {
        match arg_type {
            ArgType::Flag(name) if name == "color" => Some(
                ["red", "green", "blue"]
                    .into_iter()
                    .map(|color| DynamicSuggestion {
                        value: color.into(),
                        description: Some(format!("paint it {color}")),
                        kind: Some(SuggestionKind::Value(Type::String)),
                        ..Default::default()
                    })
                    .collect(),
            ),
            _ => None,
        }
    }
}
```

Build each `DynamicSuggestion` with `..Default::default()` for the fields you don't set. The default has `append_whitespace: true`, so accepting a suggestion adds a space after it. The other fields are described with the [`CompletionItems`](plugin_protocol_reference.md#completionitems-plugin-call-response) response, where the protocol sends them. Return all of your candidates. Nushell matches them against what the user has typed, using the user's completion settings, and sorts them, so the plugin doesn't have to filter.

`kind` is an optional `SuggestionKind`: `Command(CommandType, Option<DeclId>)`, `Value(Type)`, `CellPath`, `Directory`, `File`, `Flag`, `Module`, `Operator`, or `Variable`. `commandline complete --detailed` reports it in its `kind` and `type` columns, and the Nushell language server uses it to label suggestions in an editor.

`DynamicCompletionCall` describes the command line as parsed so far. Its `call` field is the parser's `ast::Call`, with unevaluated argument expressions, `pos` is the cursor position, and `strip` tells whether a placeholder was added at the cursor.

## Testing plugins

Rust-based plugins can use the [`nu-plugin-test-support`](https://docs.rs/nu-plugin-test-support/) crate to write tests. Add it as a development dependency with the same version as `nu-plugin` (`cargo add --dev nu-plugin-test-support`). Examples can be tested automatically:

```rust
use nu_protocol::{Example, ShellError, Value};
use nu_plugin::PluginCommand;

struct FibPlugin;
struct Fib;

// ...

impl PluginCommand for Fib {
    type Plugin = FibPlugin;

    fn name(&self) -> &str {
        "fib"
    }

    // ...

    fn examples(&self) -> Vec<Example<'_>> {
        vec![
            Example {
                example: "fib 20",
                description: "Compute the 20th Fibonacci number",
                result: Some(Value::test_int(6765))
            },
        ]
    }

    // ...
}

#[test]
fn test_examples() -> Result<(), ShellError> {
    use nu_plugin_test_support::PluginTest;

    PluginTest::new("fib", FibPlugin.into())?.test_command_examples(&Fib)
}
```

Manual tests, including with input, can also be created, via `.eval()` and `.eval_with()`:

```rust
#[test]
fn test_fib_on_input() -> Result<(), ShellError> {
    use nu_plugin_test_support::PluginTest;
    use nu_protocol::{IntoPipelineData, Span};

    // this would be identical to `20 | fib`, but anything can be passed,
    // including a stream
    let result = PluginTest::new("fib", FibPlugin.into())?
        .eval_with("fib", Value::test_int(20).into_pipeline_data())?
        .into_value(Span::test_data())?;

    assert_eq!(Value::test_int(6765), result);
    Ok(())
}
```

The Nu context within tests is very basic and mostly only contains the plugin commands themselves, as well as all of the core language keywords from [`nu-cmd-lang`](https://docs.rs/nu-cmd-lang/). If you need to test your plugin with other commands, you can include those crates and then use `.add_decl()` to include them in the context:

```rust
#[test]
fn test_fib_with_sequence() -> Result<(), ShellError> {
    use nu_command::Seq;
    use nu_plugin_test_support::PluginTest;

    let result = PluginTest::new("fib", FibPlugin.into())?
        .add_decl(Box::new(Seq))?
        .eval("seq 1 10 | fib")?;

    assert_eq!(10, result.into_iter().count());
    Ok(())
}
```

Keep in mind that this will increase the compilation time of your tests, so it's generally preferred to do your other test logic within Rust if you can.

Tests on custom values are fully supported as well, but they will be serialized and deserialized to ensure that they are able to pass through the serialization that happens to custom values between the plugin and the engine safely.

`test_command_examples(&command)` runs the examples from one command's `examples()`. `test_examples()` takes any slice of `Example`s, which lets you test cases that you don't want to show in `help`. Both skip examples whose `result` is `None`, run the rest, and compare each result with the expected value. Custom values are compared with your plugin's `custom_value_partial_cmp()`. When an example fails, the test prints the example, its description, and a diff, and returns an error after running all of them:

```rust
#[test]
fn test_edge_cases() -> Result<(), ShellError> {
    use nu_plugin_test_support::PluginTest;

    PluginTest::new("fib", FibPlugin.into())?.test_examples(&[
        Example {
            example: "fib 0",
            description: "The 0th Fibonacci number",
            result: Some(Value::test_int(0)),
        },
    ])
}
```

`engine_state()` and `engine_state_mut()` give access to the test's `EngineState`, for example to set up configuration or environment variables before calling `eval()`. To check what a custom value looks like as plain data, pass it to `custom_value_to_base_value(&value, span)`, which runs it through your plugin's `custom_value_to_base_value()` the way the engine would.

## Example plugins

The Nushell repository has three Rust plugins for plugin developers, which Nushell's own tests also use. They aren't published on crates.io. Build one from a checkout with `cargo build -p nu_plugin_example`, then `plugin add target/debug/nu_plugin_example`.

### `nu_plugin_example`

Each command shows one part of the API:

| Command                          | What it shows                                                                                                    |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `example`                        | A command that only prints its subcommands' help, using `engine.get_help()`                                      |
| `example one`                    | A signature with every kind of argument: required, optional, rest, a switch, and a named flag. Returns nothing    |
| `example two`                    | The same signature, returning a list of records                                                                  |
| `example three`                  | The same signature, returning a `LabeledError`                                                                   |
| `example config`                 | Reading `$env.config.plugins.example` with `get_plugin_config()`                                                 |
| `example env`                    | Reading environment variables, the current directory (`--cwd`), and setting a variable (`--set`)                 |
| `example view span`              | Reading the source code behind a value's span with `get_span_contents()`                                         |
| `example disable-gc`             | Turning garbage collection off with `set_gc_disabled()`, and back on with `--reset`                              |
| `example ctrlc`                  | Waiting for Ctrl+C with `register_signal_handler()`                                                              |
| `example call-decl`              | Calling another command by name with `find_decl()` and `call_decl()`, passing a record of named arguments        |
| `example seq`                    | Producing a list stream                                                                                          |
| `example sum`                    | Consuming a list stream of numbers                                                                               |
| `example echo`                   | Passing its input stream through unchanged                                                                       |
| `example collect-bytes`          | Turning a list of strings or binary values into a byte stream                                                    |
| `example for-each`               | Running a closure on each value of an input stream with `eval_closure()`                                         |
| `example generate`               | Producing a stream by running a closure repeatedly, like `generate`                                              |
| `example arg-completion`         | Completing a flag and positional arguments with `get_dynamic_completion()`                                       |

### `nu_plugin_custom_values`

This plugin shows [custom values](#custom-values):

| Command                      | What it shows                                                                                                                     |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `custom-value generate`      | Returning a custom value (`CoolCustomValue`) that supports cell paths, comparison, and the `++` operator                           |
| `custom-value generate2`     | Returning a second custom value type, which can also be saved with `save`. With a closure argument, it passes the value to the closure |
| `custom-value update`        | Taking a custom value as pipeline input and returning a changed copy                                                              |
| `custom-value update-arg`    | Taking a custom value as an argument instead of as input                                                                          |
| `custom-value drop-check`    | A custom value with `notify_plugin_on_drop()`, which prints a message when Nu drops the last copy                                  |
| `custom-value handle make`   | Storing a value in the plugin's memory and returning a handle to it                                                               |
| `custom-value handle get`    | Getting the stored value back from a handle                                                                                       |
| `custom-value handle update` | Running a closure on the stored value and returning a new handle                                                                  |

The handle commands keep their data in the plugin, so they override `custom_value_to_base_value()` and `custom_value_dropped()` on the `Plugin`, which removes the stored value once Nu drops the last copy of its handle.

### `nu_plugin_stress_internals`

This plugin tests Nushell's side of the protocol, so it doesn't use the `nu-plugin` crate. It writes JSON messages by hand, and its one command, `stress_internals`, returns the options it was started with as a string. Environment variables make it misbehave on purpose:

| Variable                        | Effect                                                                         |
| ------------------------------- | ------------------------------------------------------------------------------ |
| `STRESS_ADVERTISE_LOCAL_SOCKET` | Advertise the `LocalSocket` feature in its `Hello`                             |
| `STRESS_REFUSE_LOCAL_SOCKET`    | Exit with status 1 when started with `--local-socket`, to test the fallback to stdio |
| `STRESS_EXIT_BEFORE_HELLO`      | Exit right after sending the encoding, without a `Hello`                       |
| `STRESS_EXIT_EARLY`             | Exit right after the `Hello` exchange, without answering any call             |
| `STRESS_WRONG_VERSION`          | Send version `0.0.0` in its `Hello`, which Nu rejects                          |

Only the presence of a variable matters, not its value. The plugin also prints its arguments to stderr when it starts.

## Under the hood

Writing Nu plugins in Rust is convenient because we can make use of the `nu-plugin` and `nu-protocol` crates, which are part of Nu itself and define the interface protocol. To write a plugin in another language you will need to implement that protocol yourself. If your goal is to write Nu plugins in Rust you can stop here. If you'd like to explore the low level plugin interface or write plugins in other languages such as Python, keep reading.

Ordinarily, Nu will execute the plugin and knows what data to pass to it and how to interpret the responses. Here we'll be doing it manually. Note that we'll be playing with our plugin using a conventional shell (like bash or zsh) as in Nu all of this happens under the hood.

We recommend keeping the [plugin protocol](plugin_protocol_reference.md) documentation handy as a reference while reading this section.

Assuming you've built the Rust plugin described above let's now run it with `--stdio` so that it communicates with us there:

```sh
$ ./target/release/nu_plugin_len --stdio
json{"Hello":{"protocol":"nu-plugin","version":"0.116.0","features":[{"name":"LocalSocket"}]}}
```

The application on start up prints the keyword `json`, followed by its own [`Hello`](plugin_protocol_reference.md#hello) message, and blocks for input on STDIN. The keyword tells Nu that the plugin wants to communicate via the JSON protocol rather than MsgPack. (It is preceded by a byte containing the length of the keyword, 4, which the terminal doesn't display.) In the JSON protocol, the plugin will listen for each JSON object written on stdin and respond accordingly. Newlines are not required, but it is likely that the plugin will not see your input before you hit `enter`, as terminals usually line buffer by default.

We can simulate an initial plugin registration by sending a [`Hello`](plugin_protocol_reference.md#hello) message first, in order to let the plugin know that we are compatible with it. It is important to use a `"version"` that is compatible with the one the plugin reported (the version of `nu-plugin` that it was built with, `0.116.0` here), as this is a critical part of how Nu ensures that plugins run with a compatible engine. If the versions aren't compatible, the plugin exits without answering any calls.

```json
{
  "Hello": {
    "protocol": "nu-plugin",
    "version": "0.116.0",
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
json{"Hello":{"protocol":"nu-plugin","version":"0.116.0","features":[{"name":"LocalSocket"}]}}
{"Hello":{"protocol":"nu-plugin","version":"0.116.0","features":[]}}
{"Call":[0,"Signature"]}
{"CallResponse":[0,{"Signature":[{"sig":{"name":"len","description":"calculates the length of its input","extra_description":"","search_terms":[],"required_positional":[],"optional_positional":[],"rest_positional":null,"named":[{"long":"help","short":"h","arg":null,"required":false,"desc":"Display the help message for this command","completion":null,"var_id":null,"default_value":null}],"input_output_types":[["String","Int"]],"allow_variants_without_examples":false,"is_filter":false,"creates_scope":false,"allows_unknown_args":false,"complete":null,"category":"Default"},"examples":[]}]}]}
```

The plugin prints its signature serialized as JSON. We'll reformat for readability.

```json
{
  "Signature": [
    {
      "sig": {
        "name": "len",
        "description": "calculates the length of its input",
        "extra_description": "",
        "search_terms": [],
        "required_positional": [],
        "optional_positional": [],
        "rest_positional": null,
        "named": [
          {
            "long": "help",
            "short": "h",
            "arg": null,
            "required": false,
            "desc": "Display the help message for this command",
            "completion": null,
            "var_id": null,
            "default_value": null
          }
        ],
        "input_output_types": [["String", "Int"]],
        "allow_variants_without_examples": false,
        "is_filter": false,
        "creates_scope": false,
        "allows_unknown_args": false,
        "complete": null,
        "category": "Default"
      },
      "examples": []
    }
  ]
}
```

This signature tells Nu everything it needs to pass data in and out of the plugin as well as format the help message and support type aware tab completion. A full description of these fields is beyond the scope of this tutorial, but the response is simply a serialized form of the [`PluginSignature`](https://docs.rs/nu-protocol/latest/nu_protocol/struct.PluginSignature.html) struct in the `nu-protocol` crate.

Now let's try simulating an invocation. Above we tested the plugin within Nu by executing the command `"hello" | len` and we got the response `5`. Of course this hides all of the typed data handling that makes Nu so powerful.

```sh
$ echo '{"Hello":{"protocol":"nu-plugin","version":"0.116.0","features":[]}}{"Call":[0,{"Run":{"name":"len","call":{"head":{"start":100953,"end":100957},"positional":[],"named":[]},"input":{"Value":[{"String":{"val":"hello","span":{"start":100953,"end":100957}}},null]}}}]}' | target/release/nu_plugin_len --stdio
json{"Hello":{"protocol":"nu-plugin","version":"0.116.0","features":[{"name":"LocalSocket"}]}}
{"CallResponse":[0,{"PipelineData":{"Value":[{"Int":{"val":5,"span":{"start":100953,"end":100957}}},null]}}]}
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
      "Value": [
        {
          "String": {
            "val": "hello",
            "span": {
              "start": 100953,
              "end": 100957
            }
          }
        },
        null
      ]
    }
  }
}
```

That is, we passed len the string "hello". A single `Value` input is a two-element array: the value itself, and its pipeline metadata (`null` here, as there is none). The plugin replied with a [`CallResponse`](plugin_protocol_reference.md#callresponse) for call ID `0`, containing the following [`PipelineData`](plugin_protocol_reference.md#pipelinedata-plugin-call-response) response:

```json
{
  "PipelineData": {
    "Value": [
      {
        "Int": {
          "val": 5,
          "span": {
            "start": 100953,
            "end": 100957
          }
        }
      },
      null
    ]
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
            "description": "calculates the length of its input",
            "extra_description": "",
            "search_terms": [],
            "required_positional": [],
            "optional_positional": [],
            "rest_positional": None,
            "named": [
                {
                    "long": "help",
                    "short": "h",
                    "arg": None,
                    "required": False,
                    "desc": "Display the help message for this command"
                }
            ],
            "input_output_types": [["String", "Int"]],
            "allow_variants_without_examples": True,
            "is_filter": False,
            "creates_scope": False,
            "allows_unknown_args": False,
            "category": "Default"
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
            "version": "0.116.0",
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
            "msg": "Len Error",
            "labels": [
                {
                    "text": error_msg,
                    "span": span,
                }
            ],
        }
    }
    send_response(id, error)


def handle_call(id, call_info):
    try:
        [value, metadata] = call_info["input"]["Value"]
        input = value["String"]
        output = {
            "PipelineData": {
                "Value": [
                    {
                        "Int": {
                            "val": len(input["val"]),
                            "span": input["span"]
                        }
                    },
                    None
                ]
            }
        }
        send_response(id, output)
    except:
        send_error(
            id,
            "Could not process input",
            call_info["call"]["head"]
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
            if call == "Metadata":
                send_response(id, {
                    "Metadata": {
                        "version": "0.1.0",
                    }
                })
            elif call == "Signature":
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
            if call == "Metadata":
                send_response(id, {
                    "Metadata": {
                        "version": "0.1.0",
                    }
                })
            elif call == "Signature":
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
            "version": "0.116.0",
            "features": []
        }
    }
    sys.stdout.writelines([json.dumps(hello)])
    sys.stdout.flush()
```

The first thing our plugin must do is write out the desired serialization format, in this case JSON, preceded by a byte with the length of its name. We do that with the `send_encoder()` method. Then we use `send_hello()` to send our [`Hello`](plugin_protocol_reference.md#hello) message, informing Nu of our compatibility with it, and which is required before we can send any other messages. Its `"version"` must be compatible with the Nushell version that runs the plugin, or Nu refuses to load it. Then we read the JSON serialized messages that Nu sends us. Since Nu always sends each message on its own line, we simply read each line of input and parse it separately.

Each [`Call`](plugin_protocol_reference.md#call) comes with an ID number, which we must keep for the [`CallResponse`](plugin_protocol_reference.md#callresponse) (including errors).

When we're sent a `Signature` request, we respond with the signature of this plugin, which is a bit of information to tell Nu how the command should be called.

When sent a `Run` request, we parse the supplied JSON and respond to the request

```python
def handle_call(id, call_info):
    try:
        [value, metadata] = call_info["input"]["Value"]
        input = value["String"]
        output = {
            "PipelineData": {
                "Value": [
                    {
                        "Int": {
                            "val": len(input["val"]),
                            "span": input["span"]
                        }
                    },
                    None
                ]
            }
        }
        send_response(id, output)
    except:
        send_error(
            id,
            "Could not process input",
            call_info["call"]["head"]
        )
```

The work of processing input is done by this `handle_call` function. Here, we assume we're given strings (we could make this more robust in the future and return meaningful errors otherwise), and then we extract the string we're given. A single `Value` input arrives as a two-element array of the value and its pipeline metadata, so we unpack it first. From there, we measure the length of the string and create a new `Int` value for that length.

Finally, we use the same item we were given and replace the payload with this new Int. We do this to reuse the `span` that was passed to us with the string, though this is an optional step. We could have instead opted to create new metadata and passed that out instead. We send `None` (`null`) as the pipeline metadata of our response. If the input isn't what we expect, we send an error labeled with the span of the call's `head`, which points at the command name.

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
            "msg": "Len Error",
            "labels": [
                {
                    "text": error_msg,
                    "span": span,
                }
            ],
        }
    }
    send_response(id, error)
```

`send_error()` formats and sends an error response for us. An error is a [`LabeledError`](plugin_protocol_reference.md#labelederror): a `msg`, plus optional `labels` that each attach some `text` to a `span`.

```python
import json
import sys
```

All of this takes a few imports to accomplish, so we make sure to include them.

```python
#!/usr/bin/env python3
```

Finally, we add a shebang line at the top that points to our Python interpreter.

Nu runs plugin files whose names end in `.py` with the `python` command found in your `PATH`, so the shebang line isn't used for them. Unless you pass `--shell`, Nu picks the interpreter from the extension:

| Extension | Command that Nu runs                        |
| --------- | ------------------------------------------- |
| `.py`     | `python FILE --stdio`                       |
| `.nu`     | `nu --stdin FILE --stdio`                   |
| `.rb`     | `ruby FILE --stdio`                         |
| `.jar`    | `java -jar FILE --stdio`                    |
| `.sh`     | `sh FILE --stdio` on Windows only           |
| other     | the file itself, as an executable           |

Each interpreter is looked up in `PATH`, so a `.nu` plugin runs under the first `nu` in `PATH`, which isn't necessarily the `nu` that started it. On Unix, a `.sh` file runs directly, so that its shebang line can pick `bash` or another shell. Windows runs `.bat` and `.cmd` files without help. In local socket mode, `--local-socket` and the socket name replace `--stdio`. If your interpreter has a different name, such as `python3`, pass its full path with `--shell` when adding the plugin:

```nu
plugin add --shell /usr/bin/python3 nu_plugin_len.py
plugin use len
"hello" | len
# => 5
```

On Unix-based platforms, you can instead save the file without the `.py` extension (as `nu_plugin_len`) and make it executable (using something like `chmod +x nu_plugin_len`). Nu then runs it directly, and the shebang line selects the interpreter.

Please see the [example Python plugin](https://github.com/nushell/nushell/tree/main/crates/nu_plugin_python) for a comprehensive example on how to implement a Nushell plugin in another language, including Python.

That example is stricter about versions than Nu is. It sends the version in its `NUSHELL_VERSION` constant in its `Hello`, and it exits as soon as the engine's `Hello` carries any other version, even a compatible patch release. Nu then reports "Failed to receive response to plugin call from `python_example`" instead of a version error. Set the constant to the exact version of your `nu` before you add it, or relax the check in your own plugin to compare only the major and minor versions, the way Nu does.
