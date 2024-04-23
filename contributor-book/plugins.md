---
title: Plugins
---

# Plugins

## Protocol

Plugins are executable applications that communicate with Nu by exchanging serialized data over stdin and stdout (much in the same way VSCode plugins do). The protocol is split into two stages.

The first stage of the protocol deals with the initial discovery of the plugin. When a plugin is registered the plugin is executed and asked to reply with its configuration. Just as with commands, plugins have a signature that they respond to Nu with. Once Nu has this signature, it knows how to later invoke the plugin to do work.

The second stage is the actual doing of work. Here the plugins are executed and sent serialized input data. The plugin then replies with the serialized output data.

For more detailed information about how exactly this communication works, especially if trying to implement a plugin in a language other than Rust, see the [plugin protocol](plugin_protocol_reference.md) section.

## Discovery

Nu keeps a registry of plugins known as the ‘plugin cache file’ at the file system location defined by configuration variable `$nu.plugin-path`. To add a plugin, execute `plugin add <path_to_plugin_executable>` in a Nu shell.

## Launch environment

Stdin and stdout are redirected for use in the plugin protocol, and must not be used for other purposes. Stderr is inherited, and may be used to print to the terminal.

Environment variables set in the shell are set in the environment of a plugin when it is launched from a plugin call.

Plugins are always started with the directory of their executable as their working directory. This is because they may be sent calls with different shell working directory contexts over time. [`EngineInterface::get_current_dir()`](https://docs.rs/nu-plugin/latest/nu_plugin/struct.EngineInterface.html#method.get_current_dir) can be used to determine the current working directory of the context of a call. For more information, see [this section](#current-directory).

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
nu-plugin = "0.92.0" # These version numbers may differ
nu-protocol = "0.92.0"
```

With this, we can open up `src/main.rs` and create our plugin.

```rust
use nu_plugin::{EvaluatedCall, JsonSerializer, serve_plugin};
use nu_plugin::{EngineInterface, Plugin, PluginCommand, SimplePluginCommand};
use nu_protocol::{LabeledError, Signature, Type, Value};

struct LenPlugin;

impl Plugin for LenPlugin {
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

    fn usage(&self) -> &str {
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

    fn usage(&self) -> &str {
        "calculates the length of its input"
    }

    fn signature(&self) -> Signature {
        Signature::build(PluginCommand::name(self))
            .input_output_type(Type::String, Type::Int)
    }

    // ...
}
```

There are a few methods required for this implementation. We first define the `name` of the command, which is what the user will type at the prompt or in their script to run the command. The `usage` is also required, which is a short documentation string for users to know what the command does, and is displayed along with completions and in `help`. Finally, we define the `signature`, which specifies arguments and types for the command.

We tell Nu that the name is "len", give it a basic description for `help` to display and declare that we expect to be passed a string and will return an integer.

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

Our `Len` command doesn't require any parameters, but if it did we'd get them from the `EvaluatedCall`.

```rust
struct Len;
```

`Len` is defined as a unit struct, with no fields, and this is the most common type definition for a command in a plugin. However, you may choose to keep state here if you want to - every call of `len` shares the same reference.

Above that, let's have a look at the definition of `LenPlugin`, which implements the `Plugin` trait:

```rust
struct LenPlugin;

impl Plugin for LenPlugin {
    fn commands(&self) -> Vec<Box<dyn PluginCommand<Plugin = Self>>> {
        vec![
            Box::new(Len),
        ]
    }
}
```

Again, we use a unit struct for `LenPlugin`, but this is the recommended place to put plugin state if needed. All commands also get a reference to the plugin type. This is what we eventually pass to `serve_plugin()` in `main()`.

The only required method in `Plugin` is `commands()`, which initializes the plugin's commands. A boxed `dyn` reference is used so that we can keep all of the different command types in the single list. Dispatch by command name is automatically handled in `serve_plugin()` by looking at the name defined in the signature - in our case, that's `len`. A plugin can contain many commands, so if you end up adding more, just add them to the list returned by `commands()`.

Lastly, let's look at the top of the file:

```rust
use nu_plugin::{serve_plugin, JsonSerializer, EvaluatedCall};
use nu_plugin::{Plugin, PluginCommand, SimplePluginCommand, EngineInterface};
use nu_protocol::{LabeledError, Signature, Type, Value};
```

Here we import everything we need -- types and functions -- to be able to create our plugin.

Once we have finished our plugin, to use it all we need to do is install it.

```sh
> cargo install --path .
> plugin add ~/.cargo/bin/nu_plugin_len # add .exe on Windows
```

Once `nu` starts up, it will discover the plugin and add its commands to the scope.

If you're already running `nu` during the installation process of your plugin, ensure you restart `nu` so that it can load your plugin.

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
            input => {
                // Handle a string
                let span = input.span().unwrap_or(call.head);
                let value = input.into_value(span);
                match &value {
                    Value::String { val, .. } => Ok(
                        Value::int(val.len() as i64, value.span()).into_pipeline_data()
                    ),
                    _ => Err(
                        LabeledError::new(
                            "Expected String or iterable input from pipeline",
                        ).with_label(
                            format!(
                                "requires string or iterable input; got {}",
                                value.get_type(),
                            ),
                            call.head,
                        )
                    ),
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
use nu_protocol::{Signature, Type, Value};

struct MotdPlugin;

impl Plugin for MotdPlugin {
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

    fn usage(&self) -> &str {
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
> $env.config.plugins.motd = {message: "Nushell rocks!"}
> motd
Nushell rocks!
```

## Evaluating closures

Plugins can accept and evaluate closures using [`EngineInterface::eval_closure`](https://docs.rs/nu-plugin/latest/nu_plugin/struct.EngineInterface.html#method.eval_closure) or [`eval_closure_with_stream`](https://docs.rs/nu-plugin/latest/nu_plugin/struct.EngineInterface.html#method.eval_closure_with_stream).

```rust
use nu_plugin::*;
use nu_protocol::{PipelineData, Signature, SyntaxShape, Type, Value};

struct MyEachPlugin;

impl Plugin for MyEachPlugin {
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

    fn usage(&self) -> &str {
        "Run closure on each element of a list"
    }

    fn signature(&self) -> Signature {
        Signature::build(PluginCommand::name(self))
            .required(
                "closure",
                SyntaxShape::Closure(Some(vec![SyntaxShape::Any])),
                "The closure to evaluate",
            )
            .input_output_type(Type::ListStream, Type::ListStream)
    }

    fn run(
        &self,
        _plugin: &MyEachPlugin,
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
    serve_plugin(&MyEachPlugin, MsgPackSerializer)
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

## Custom values

Plugins can create custom values that embed plugin-specific data within the engine. In Rust, this data is automatically serialized using [bincode](https://crates.io/crates/bincode), so all you need to do is implement the [`CustomValue`](https://docs.rs/nu-protocol/latest/nu_protocol/trait.CustomValue.html) trait on a type that has `Serialize` and `Deserialize` implementations compatible with bincode. This includes any attributes that would cause a dependency on field names or field presence, such as `#[serde(skip_serializing_if = "...")]` or `#[serde(untagged)]`. We use the [typetag](https://crates.io/crates/typetag) crate to reconstruct the correct custom value type.

To embed the custom value in a `Value`, use [`Value::custom()`](https://docs.rs/nu-protocol/latest/nu_protocol/enum.Value.html#method.custom_value). A minimal example:

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
        Value::custom_value(Box::new(self.clone()), span)
    }

    fn value_string(&self) -> String {
        // The type name
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
}

// Use the custom value
Value::custom(Box::new(Animal::Dog {
    name: "Rex".into(),
    woof: true,
}), call.head)
```

Any of the methods in the trait can be implemented on plugin custom values, and functionality such as supporting cell paths (e.g. `$my_custom_value.field`), operators (e.g. `++`), and comparisons (e.g. for `sort`) are all supported.

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
        engine: &EngineInterface,
        custom_value: Box<dyn CustomValue>,
    ) {
        if let Some(animal) = custom_value.as_any().downcast_ref::<Animal>() {
            eprintln!("Animal dropped: {:?}", animal);
        }
    }
}
```

Every custom value sent from the plugin to the engine counts as a new unique value for the purpose of drop checking. If you accept a custom value as an argument and then return it after, you will likely receive two drop notifications, even though the value data is identical. This has implications for trying to use custom values to reference count handles.

For a full example, see [`DropCheck`](https://github.com/nushell/nushell/blob/main/crates/nu_plugin_custom_values/src/drop_check.rs) in the `nu_plugin_custom_values` plugin.

## Manipulating the environment

Environment variables can be get or set through the [`EngineInterface`](https://docs.rs/nu-plugin/latest/nu_plugin/struct.EngineInterface.html). For example:

```rust
// Get the PATH environment variable
let paths: Value = engine.get_env_var("PATH")?;
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
let absolute_path = Path::new(&engine.get_current_dir()?).join(&provided_path.item);

// For example:
if absolute_path.exists() {
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

This option is global to the plugin, and will last beyond the scope of a plugin call. In other languages, the [`GcDisabled` option](plugin_protocol_reference.html#gcdisabled-option) can be sent at any time:

```json
{
  "Option": {
    "GcDisabled": true
  }
}
```

Note that opting out of garbage collection does not stop users from explicitly stopping your plugin with the `plugin stop` command. We recommend against disabling garbage collection unless your plugin has a good reason to stay running - for example, to keep data in memory, to do background processing, or to keep shared resources like sockets or files open. For custom values that contain all of the data that they need to be interpreted properly, the plugin can always be re-launched as necessary.

If your plugin takes a particularly long time to launch, you can recommend to your users that they change their [garbage collection settings](/book/plugins.html#plugin-garbage-collector) to either increase the `stop_after` duration, or disable garbage collection entirely for your plugin.

## Testing plugins

Rust-based plugins can use the [`nu-plugin-test-support`](https://docs.rs/nu-plugin-test-support/) crate to write tests. Examples can be tested automatically:

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

    fn examples(&self) -> Vec<Example> {
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

    PluginTest::new("fib", FibPlugin.into())?.test_examples(&Fib)
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
        .into_value(Span::test_data());

    assert_eq!(Value::test_int(6765), result);
}
```

The Nu context within tests is very basic and mostly only contains the plugin commands themselves. If you need to test your plugin with other commands, you can include those crates and then use `.add_decl()` to include them in the context:

```rust
#[test]
fn test_fib_with_sequence() -> Result<(), ShellError> {
    use nu_command::Seq;
    use nu_plugin_test_support::PluginTest;

    let result = PluginTest::new("fib", FibPlugin.into())?
        .add_decl(Box::new(Seq))?
        .eval("seq 1 10 | fib")?;

    assert_eq!(10, result.into_iter().count());
}
```

Keep in mind that this will increase the compilation time of your tests, so it's generally preferred to do your other test logic within Rust if you can.

Tests on custom values are fully supported as well, but they will be serialized and deserialized to ensure that they are able to pass through the serialization that happens to custom values between the plugin and the engine safely.

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

This signature tells Nu everything it needs to pass data in and out of the plugin as well as format the help message and support type aware tab completion. A full description of these fields is beyond the scope of this tutorial, but the response is simply a serialized form of the [`PluginSignature`](https://docs.rs/nu-protocol/latest/nu_protocol/struct.PluginSignature.html) struct in the `nu-plugin` crate.

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
