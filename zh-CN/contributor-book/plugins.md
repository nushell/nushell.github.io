---
title: 插件
---

# 插件

## 协议

插件是可执行应用程序，通过交换序列化数据通过流与 Nu 通信（与 VSCode 插件的方式非常相似）。流可以是 stdio（所有插件都支持），也可以是本地套接字（例如 Unix 域套接字或 Windows 命名管道）（当支持时）。协议分为两个阶段。

协议的第一阶段处理插件的初始发现。当注册插件时，插件被执行并被要求回复其配置。与命令一样，插件有一个签名，它们用这个签名响应 Nu。一旦 Nu 有了这个签名，它就知道以后如何调用插件来工作。

第二阶段是实际的工作执行。在这里，插件被执行并发送序列化的输入数据。插件然后用序列化的输出数据回复。

有关这种通信如何工作的更详细信息，特别是如果尝试用 Rust 以外的语言实现插件，请参阅[插件协议](plugin_protocol_reference.md)部分。

## 发现

Nu 维护一个称为"插件注册文件"的插件注册表，位于配置变量 `$nu.plugin-path` 定义的文件系统位置。要添加插件，在 Nu shell 中执行 `plugin add <path_to_plugin_executable>`。插件的签名将被添加到插件注册文件中，供将来启动 Nu 时使用。要立即使它们可用，请调用 `plugin use <plugin_name>`。

## 启动环境

在 `stdio` 模式下启动时，`stdin` 和 `stdout` 被重定向用于插件协议，不得用于其他目的。Stderr 是继承的，可以用来打印到终端。

在 `local-socket` 模式下启动时，`stdin` 和 `stdout` 也可以用来与用户的终端交互。这是 Rust 插件的默认设置，除非 `local-socket` 被禁用，可以通过调用 [`EngineInterface::is_using_stdio()`](https://docs.rs/nu-plugin/latest/nu_plugin/struct.EngineInterface.html#method.is_using_stdio) 来检查。如果套接字由于某种原因无法工作，插件可能会回退到 `stdio` 模式，因此如果你要使用 `stdin` 或 `stdout`，检查这一点很重要。

shell 中设置的环境变量在从插件调用启动插件时设置在其环境中。

插件总是以其可执行文件的目录作为工作目录启动。这是因为它们可能随时间被发送具有不同 shell 工作目录上下文的调用。[`EngineInterface::get_current_dir()`](https://docs.rs/nu-plugin/latest/nu_plugin/struct.EngineInterface.html#method.get_current_dir) 可用于确定调用上下文的当前工作目录。有关更多信息，请参阅[此部分](#current-directory)。

## 创建插件（在 Rust 中）

在本节中，我们将使用 Rust 创建一个 Nu 插件。

让我们创建我们的项目。对于这个例子，我们将创建一个简单的 `len` 命令，它将返回传递给它的字符串的长度。

首先，我们将创建我们的插件：

```sh
cargo new nu_plugin_len
cd nu_plugin_len
```

接下来，我们将 `nu` 添加到我们项目的依赖项中。

```sh
cargo add nu-plugin nu-protocol
```

`Cargo.toml` 文件现在应该看起来像下面这样。

```toml
[package]
name = "nu_plugin_len"
version = "0.1.0"
edition = "2024"

[dependencies]
nu-plugin = "0.104.0"
nu-protocol = "0.104.0"
```

有了这个，我们可以打开 `src/main.rs` 并创建我们的插件。

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

这里有一些移动的部分，所以让我们逐个分解。

首先，让我们看看 main：

```rust
fn main() {
    serve_plugin(&LenPlugin, JsonSerializer)
}
```

在 `main()` 中，我们只调用一个函数 `serve_plugin`。这将完成调用我们的插件、处理 JSON 序列化/反序列化以及向 Nu 发送值和错误的工作。要启动它，我们传递给它实现 `Plugin` trait 的东西和实现 `PluginEncoder` trait 的东西。我们被提供了 Nu 支持的序列化格式的选择。通常用 Rust 编写的插件应该使用 `MsgPackSerializer`，因为它相当快，但这里我们选择 JSON 来演示本教程后面通信协议的工作原理。

在 `main()` 上面是我们的插件将暴露的 `len` 命令的 `SimplePluginCommand` trait 的实现，由 `Len` 类型表示。我们使用 `SimplePluginCommand` 而不是 `PluginCommand` 以简化我们的实现并避免[处理插件中的流](#using-streams-in-plugins)。让我们看看我们如何实现这个 trait：

```rust
impl SimplePluginCommand for Len {
    type Plugin = LenPlugin;

    // ...
}
```

我们首先指定我们的命令期望的插件类型。这允许我们在 `run()` 中接收对它的引用，我们可以用它来在命令之间共享状态。

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

这个实现需要一些方法。我们首先定义命令的 `name`，这是用户将在提示符或脚本中键入以运行命令的内容。`description` 也是必需的，这是用户知道命令做什么的简短文档字符串，并在完成和 `help` 中显示。最后，我们定义 `signature`，它指定命令的参数和类型。

我们告诉 Nu 名称是 "len"，给它一个基本的描述供 `help` 显示，并声明我们期望传递一个字符串并返回一个整数。

接下来，在 `run` 实现中，我们描述当值流入这个插件时如何工作。在这里，我们接收一个我们期望是字符串的 `Value` 类型。我们还返回 `Value` 或错误。

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

我们使用 Rust 的模式匹配来检查传入的 `Value` 的类型，然后如果它是字符串就操作它。值还包含一个 `span`，所以它携带着值来自哪里。如果值不是字符串，我们给出一个错误并让用户知道导致问题的值来自哪里。在错误时，我们使用 `call.head` 作为范围，以便 Nu 可以在错误消息中给冒犯的命令名称加下划线。

我们的 `Len` 命令不需要任何参数，但如果需要，我们会从 `EvaluatedCall` 获取它们。

```rust
struct Len;
```

`Len` 被定义为一个单元结构体，没有字段，这是插件中命令最常见的类型定义。但是，如果你想保持状态，你可以选择在这里保持状态 - 每个 `len` 的调用共享相同的引用。

在上面，让我们看看 `LenPlugin` 的定义，它实现了 `Plugin` trait：

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

再次，我们为 `LenPlugin` 使用单元结构体，但这是推荐的地方来放置插件状态（如果需要）。所有命令也获得对插件类型的引用。这是我们最终在 `main()` 中传递给 `serve_plugin()` 的东西。

`Plugin` 有两个必需的方法：`version()`，它向 Nu 报告插件的版本，和 `commands()`，它初始化插件的命令。使用盒装的 `dyn` 引用，以便我们可以将所有不同的命令类型保存在单个列表中。通过查看签名中定义的名称 - 在我们的例子中是 `len`，在 `serve_plugin()` 中通过命令名称自动处理分派。一个插件可以包含许多命令，所以如果你最终添加更多，只需将它们添加到 `commands()` 返回的列表中。

对于版本，我们只使用编译时可用的 `CARGO_PKG_VERSION` 环境变量，以便从 Cargo 获取我们插件的版本。

最后，让我们看看文件的顶部：

```rust
use nu_plugin::{serve_plugin, JsonSerializer, EvaluatedCall};
use nu_plugin::{Plugin, PluginCommand, SimplePluginCommand, EngineInterface};
use nu_protocol::{LabeledError, Signature, Type, Value};
```

这里我们导入我们需要的一切 - 类型和函数 - 以便能够创建我们的插件。

一旦我们完成了插件，要使用它，我们需要做的就是安装它。

```nu
> cargo install --path . --locked
# nushell only (run with `nu -c` if not in nushell)
> plugin add ~/.cargo/bin/nu_plugin_len # add .exe on Windows
```

如果你在安装插件的过程中已经在运行 `nu`，确保你重启 `nu` 以便它可以加载你的插件，或者调用 `plugin use` 立即加载它：

```nu
> plugin use len # the name of the plugin (without `nu_plugin_`)
```

一旦 `nu` 启动，它将发现插件并将其命令添加到范围中。

```nu
nu
"hello" | len
# => 5
help len
# => calculates the length of its input
# =>
# => Usage:
# =>   > len
# =>
# => Flags:
# =>   -h, --help - Display the help message for this command
# =>
# => Signatures:
# =>   <string> | len -> <int>
```

运行 `plugin list` 查看当前注册并可用于此 Nu 会话的所有插件，包括它们是否正在运行，以及如果是的话它们的进程 ID。

## 在插件中使用流

我们刚刚为插件实现的 `SimplePluginCommand` trait 不支持流输入或输出。如果我们想扩展我们的插件以支持确定列表的长度，如果不必消耗整个列表（如果是流）将会很有帮助。我们可以通过实现 `PluginCommand` 而不是 `SimplePluginCommand` 来做到这一点。

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

有了这个改变，我们可以管道一个列表（甚至是一个长列表）到命令来获取它的长度：

```nu
$ seq 1 10000 | len
10000
```

由于 `run()` 也返回 `PipelineData`，插件也可以产生流，甚至转换流。例如，如果我们希望我们的插件将每个整数乘以二：

```rust
fn run(
    ...,
    engine: &EngineInterface,
    call: &EvaluatedCall,
    input: PipelineData,
) -> Result<PipelineData, ShellError> {
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

由于输入和输出都是流，这甚至可以在无限流上工作：

```nu
$ generate { |n| {out: $n, next: ($n + 1)} } 0 | plugin
0
2
4
6
8
# ...
```

## 插件配置

用户可以向插件提供配置。对于名为 `motd` 的插件：

```nu
$env.config.plugins = {
    motd: {
        message: "Nushell rocks!"
    }
}
```

插件配置可以通过 [`EngineInterface::get_plugin_config`](https://docs.rs/nu-plugin/latest/nu_plugin/struct.EngineInterface.html#method.get_plugin_config) 检索。

```rust
use nu_plugin::*;
use nu_protocol::{Signature, Type, Value};

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

示例：

```nu
> $env.config.plugins.motd = {message: "Nushell rocks!"}
> motd
Nushell rocks!
```

有关完整示例，请参阅 [`nu_plugin_example`](https://github.com/nushell/plugin-examples/tree/main/rust/nu_plugin_example)。

## 评估闭包

插件可以使用 [`EngineInterface::eval_closure`](https://docs.rs/nu-plugin/latest/nu_plugin/struct.EngineInterface.html#method.eval_closure) 或 [`eval_closure_with_stream`](https://docs.rs/nu-plugin/latest/nu_plugin/struct.EngineInterface.html#method.eval_closure_with_stream) 接受和评估闭包。

```rust
use nu_plugin::*;
use nu_protocol::{PipelineData, Signature, SyntaxShape, Type, Value};

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

`my-each` 的工作方式就像 `each`：

```nu
> [1 2 3] | my-each { |i| $i * 2 }
╭───┬───╮
│ 0 │ 2 │
│ 1 │ 4 │
│ 2 │ 6 │
╰───┴───╯
```

目前，闭包只能引用可以发送到插件的有效值。这意味着不允许来自其他插件的自定义值。这很可能在未来的版本中修复。

## 自定义值

插件可以创建自定义值，在引擎中嵌入插件特定的数据。在 Rust 中，这些数据使用 [bincode](https://crates.io/crates/bincode) 自动序列化，所以你只需要在具有 `Serialize` 和 `Deserialize` 实现的类型上实现 [`CustomValue`](https://docs.rs/nu-protocol/latest/nu_protocol/trait.CustomValue.html) trait，这些实现与 bincode 兼容。这包括任何会导致依赖字段名称或字段存在的属性，例如 `#[serde(skip_serializing_if = "...")]` 或 `#[serde(untagged)]`。我们使用 [typetag](https://crates.io/crates/typetag) crate 来重建正确的自定义值类型。

要将自定义值嵌入到 `Value` 中，使用 [`Value::custom()`](https://docs.rs/nu-protocol/latest/nu_protocol/enum.Value.html#method.custom_value)。一个最小示例：

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

trait 中的任何方法都可以在插件自定义值上实现，支持单元格路径（例如 `$my_custom_value.field`）、操作符（例如 `++`）和比较（例如用于 `sort`）等功能。

### 丢弃通知

可以要求 Nushell 让你知道传递给它的自定义值的所有副本都已超出范围并且将不再使用：

```rust
impl CustomValue for Animal {
    // ...
    fn notify_plugin_on_drop(&self) -> bool {
        true
    }
}
```

通知通过 [`custom_value_dropped()`](https://docs.rs/nu-plugin/latest/nu_plugin/trait.Plugin.html#method.custom_value_dropped) 发送到 `Plugin`：

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

从插件发送到引擎的每个自定义值都计为用于丢弃检查的新唯一值。如果你接受一个自定义值作为参数然后返回它，你可能会收到两个丢弃通知，即使值数据是相同的。这对于尝试使用自定义值来引用计数句柄有影响。

有关完整示例，请参阅 `nu_plugin_custom_values` 插件中的 [`DropCheck`](https://github.com/nushell/nushell/blob/main/crates/nu_plugin_custom_values/src/drop_check.rs)。

## 操作环境

可以通过 [`EngineInterface`](https://docs.rs/nu-plugin/latest/nu_plugin/struct.EngineInterface.html) 获取或设置环境变量。例如：

```rust
// Get the PATH environment variable
let paths: Value = engine.get_env_var("PATH")?;
// Get all environment variables
let envs: HashMap<String, Value> = engine.get_env_vars()?;
// Set an environment variable
engine.add_env_var("FOO", Value::string("bar", call.head))?;
```

在插件调用期间设置的环境变量在插件调用返回后可在调用者范围内使用，并且在插件调用期间对其他引擎调用（例如闭包评估）也是可见的。在插件调用返回响应后设置环境变量 - 例如，在作为插件调用结果产生的流正在发送数据时 - 对调用者范围的环境没有影响。

### 当前目录

如[启动环境](#launch-environment)部分前面所述，插件总是以其可执行文件的目录作为工作目录启动。这是有意为之，试图确保 shell 上下文的当前目录得到正确处理。对于处理文件系统路径的插件，相对路径应始终与 [`EngineInterface::get_current_dir()`](https://docs.rs/nu-plugin/latest/nu_plugin/struct.EngineInterface.html#method.get_current_dir) 返回的路径连接：

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

请注意，将插件进程的工作目录（例如使用 `std::env::set_current_dir()`）更改为调用上下文的当前目录是不安全的（至少在 Rust 中），因为多个线程可能同时在不同的工作目录中处理调用。

## 插件垃圾收集

Nu 附带一个[插件垃圾收集器](/zh-CN/book/plugins.html#plugin-garbage-collector)，它会根据用户的偏好自动停止不再活跃使用的插件。如果满足以下所有条件，则认为插件不活跃进行垃圾收集：

1. 它们没有任何尚未发送响应的待处理插件调用
2. 它们当前没有作为响应的一部分写入任何流
3. 它们没有[明确选择退出](#disabling-garbage-collection)垃圾收集

请注意，以下情况**不会**导致插件被视为活跃：

- Nu 引擎持有的插件自定义值
- 在活跃插件调用/响应流之外读取引擎产生的流
- 在另一个线程上在后台进行工作
- 上面未提及的任何其他内容

当插件被 Nu 停止时，它们不会被杀死。相反，Nu 等待任何积极使用插件的东西完成，然后发送 [`Goodbye`](plugin_protocol_reference.html#goodbye) 并可能关闭 stdin，此时插件应该优雅退出。

### 禁用垃圾收集

为了支持那些已经保证防止插件被垃圾收集的用例之外的使用案例，提供了一个选项来根据需要禁用和重新启用垃圾收集。从 Rust 代码中，可以通过调用 [`EngineInterface::set_gc_disabled`](https://docs.rs/nu-plugin/latest/nu_plugin/struct.EngineInterface.html#method.set_gc_disabled) 来设置：

```rust
engine.set_gc_disabled(true); // Turn off garbage collection
engine.set_gc_disabled(false); // Turn it back on
```

此选项对插件是全局的，并且将持续超出插件调用的范围。在其他语言中，可以随时发送 [`GcDisabled` 选项](plugin_protocol_reference.html#gcdisabled-option)：

```json
{
  "Option": {
    "GcDisabled": true
  }
}
```

请注意，选择退出垃圾收集并不会阻止用户使用 `plugin stop` 命令明确停止你的插件。我们建议不要禁用垃圾收集，除非你的插件有充分的理由保持运行 - 例如，将数据保存在内存中，进行后台处理，或保持共享资源（如套接字或文件）打开。对于包含解释它们所需的所有数据的自定义值，插件总是可以根据需要重新启动。

如果你的插件启动时间特别长，你可以向用户建议更改他们的[垃圾收集设置](/zh-CN/book/plugins.html#plugin-garbage-collector)，要么增加 `stop_after` 持续时间，要么完全为你的插件禁用垃圾收集。

## 调用其他 Nushell 命令

插件可以在原始插件调用的范围内查找和调用其他 Nushell 命令。这包括内部命令、用 Nushell 编写的自定义命令，以及插件提供的命令。相关的调用是 [`FindDecl`](plugin_protocol_reference.html#finddecl-engine-call) 和 [`CallDecl`](plugin_protocol_reference.html#calldecl-engine-call)。

从 Rust 中，使用 `EngineInterface` 上的 [`.find_decl()`](https://docs.rs/nu-plugin/latest/nu_plugin/struct.EngineInterface.html#method.find_decl) 和 [`.call_decl()`](https://docs.rs/nu-plugin/latest/nu_plugin/struct.EngineInterface.html#method.call_decl) 方法。通过构建器或 setter 方法将它们添加到 [`EvaluatedCall`](https://docs.rs/nu-plugin/latest/nu_plugin/struct.EvaluatedCall.html) 中来提供参数。例如：

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
            .with_positional(Value::int(std_assert as i64, call.head)),
        PipelineData::Empty,
        true,
        false,
    )?
    .into_value(call.head)?
    .into_string()?;
eprintln!("IR of `std assert`:");
eprintln!("{ir_of_assert}");
```

请记住，引擎不会验证插件进行的调用的参数是否实际匹配被调用命令的签名，因此在设计插件以尝试匹配记录的签名时必须小心。目前没有方法在运行命令之前查找命令的签名，但我们可能在将来添加它，以使确保插件调用按预期行为更容易。由于性能是插件的优先事项，我们目前不打算验证来自插件的调用参数。

从插件调用回引擎有一些开销，并且可能难以构造某些命令的参数 - 例如，不可能从插件内创建新的闭包。我们建议在可能的情况下尝试在插件内实现功能，仅在必要时回退到命令调用。几乎可以肯定的是，将多个命令链接在一起的脚本将比尝试从插件内组装管道更高效，因此你可能希望为你的插件提供配套脚本，或者期望你的用户组成由简单命令组成的管道[而不是提供许多不同的选项](https://www.nushell.sh/contributor-book/philosophy_0_80.html#command-philosophy)。

## 测试插件

基于 Rust 的插件可以使用 [`nu-plugin-test-support`](https://docs.rs/nu-plugin-test-support/) crate 来编写测试。示例可以自动测试：

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

手动测试，包括有输入的测试，也可以通过 `.eval()` 和 `.eval_with()` 创建：

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

测试中的 Nu 上下文非常基础，主要只包含插件命令本身，以及来自 [`nu-cmd-lang`](https://docs.rs/nu-cmd-lang/) 的所有核心语言关键字。如果你需要测试你的插件与其他命令，你可以包含那些 crate，然后使用 `.add_decl()` 将它们包含在上下文中：

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

请记住，这将增加你的测试的编译时间，所以通常 preferred 在可能的情况下在 Rust 内做你的其他测试逻辑。

对自定义值的测试完全支持，但它们将被序列化和反序列化，以确保它们能够安全地通过插件和引擎之间发生的自定义值的序列化。

## 底层细节

用 Rust 编写 Nu 插件很方便，因为我们可以利用 `nu-plugin` 和 `nu-protocol` crate，它们是 Nu 本身的一部分并定义接口协议。要用其他语言编写插件，你需要自己实现该协议。如果你的目标是用 Rust 编写 Nu 插件，你可以在这里停止。如果你想探索低级插件接口或用其他语言（如 Python）编写插件，请继续阅读。

通常，Nu 将执行插件并知道要向其传递什么数据以及如何解释响应。在这里，我们将手动进行。请注意，我们将使用传统 shell（如 bash 或 zsh）来玩我们的插件，因为在 Nu 中所有这些都发生在底层。

我们建议在阅读本节时随时备好[插件协议](plugin_protocol_reference.md)文档作为参考。

假设你已经构建了上面描述的 Rust 插件，现在让我们用 `--stdio` 运行它，以便它与我们在那里通信：

```sh
$ ./target/release/nu_plugin_len --stdio
json
```

应用程序在启动时打印关键字 `json` 并阻塞在 STDIN 上等待输入。这告诉 Nu 插件希望通过 JSON 协议而不是 MsgPack 进行通信。在 JSON 协议中，插件将监听在 stdin 上写入的每个 JSON 对象并相应响应。不需要换行符，但插件可能在你点击 `enter` 之前看不到你的输入，因为终端通常默认行缓冲。

我们可以通过首先发送 [`Hello`](plugin_protocol_reference.md#hello) 消息来模拟初始插件注册，以便让插件知道我们与它兼容。在这里为 `"version"` 使用插件构建时使用的 `nu-plugin` 版本很重要，因为这是 Nu 如何确保插件与兼容引擎运行的关键部分。

```json
{
  "Hello": {
    "protocol": "nu-plugin",
    "version": "0.90.2",
    "features": []
  }
}
```

之后，我们向插件发送一个带有 ID `0` 的 [`Signature`](plugin_protocol_reference.md#signature-plugin-call) 调用：

```json
{
  "Call": [0, "Signature"]
}
```

把它们放在一起，看起来像这样：

```sh
$ ./target/release/nu_plugin_len --stdio
json{"Hello":{"protocol":"nu-plugin","version":"0.90.2","features":[]}}
{"Hello":{"protocol":"nu-plugin","version":"0.90.2","features":[]}}
{"Call":[0,"Signature"]}
{"CallResponse":[0, {"Signature":[{"sig":{"name":"len","description":"calculates the length of its input","extra_description":"","search_terms":[],"required_positional":[],"optional_positional":[],"rest_positional":null,"vectorizes_over_list":false,"named":[{"long":"help","short":"h","arg":null,"required":false,"desc":"Display the help message for this command","var_id":null,"default_value":null}],"input_type":"String","output_type":"Int","input_output_types":[],"allow_variants_without_examples":false,"is_filter":false,"creates_scope":false,"allows_unknown_args":false,"category":"Default"},"examples":[]}]}]}
```

插件将其签名序列化为 JSON 打印。我们将重新格式化以便于阅读。

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

这个签名告诉 Nu 它需要知道的一切，以便将数据传入和传出插件，以及格式化帮助消息和支持类型感知的选项卡完成。这些字段的完整描述超出了本教程的范围，但响应只是 `nu-plugin` crate 中 [`PluginSignature`](https://docs.rs/nu-protocol/latest/nu_protocol/struct.PluginSignature.html) 结构体的序列化形式。

现在让我们尝试模拟一个调用。上面我们在 Nu 中通过执行命令 `"hello" | len` 测试了插件，并得到了响应 `5`。当然，这隐藏了使 Nu 如此强大的类型化数据处理。

```nu
$ echo '{"Hello":{"protocol":"nu-plugin","version":"0.90.2","features":[]}}{"Call":[0,{"Run":{"name":"len","call":{"head":{"start":100953,"end":100957},"positional":[],"named":[]},"input":{"Value":{"String":{"val":"hello","span":{"start":100953,"end":100957}}}}}}]}' | target/release/nu_plugin_len --stdio
json{"Hello":{"protocol":"nu-plugin","version":"0.90.2","features":[]}}
{"PipelineData":{"Value":{"Int":{"val":5,"span":{"start":100953,"end":100957}}}}}
```

我们调用了我们的插件，并在 stdin 上传递了一个 [`Run`](plugin_protocol_reference.md#run-plugin-call) 插件调用，看起来像这样：

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

也就是说，我们向 len 传递了字符串 "hello"，它回复了以下 [`PipelineData`](plugin_protocol_reference.md#pipelinedata-plugin-call-response) 响应：

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

带有整数 5 以及保留源范围信息，这些信息可能对以后的错误消息有用。

在用像 Python 这样的非 Rust 语言实现插件时，你必须管理这种输入和输出序列化。请参阅[协议文档](plugin_protocol_reference.md)以获取有关协议本身的更具体细节。

## 创建插件（在 Python 中）

利用我们从上一节学到的知识，我们也可以用其他编程语言创建插件，尽管你不会受益于随 Nu 一起提供的插件接口库。在本节中，我们将用 Python 编写相同的 `len` 插件。

首先，让我们看看完整的插件：

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

注意：有方法可以使 python 更健壮，但这里我们保持简单以帮助解释。

让我们看看这个插件如何工作，从下到上：

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

对于这个插件，我们必须服务两个基本角色：响应插件配置的请求，以及实际进行过滤。这段代码充当我们的主例程，通过做一些工作然后返回响应来响应来自 Nu 的消息：要么返回插件签名，要么处理输入。

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

我们的插件必须做的第一件事是写出所需的序列化格式，在这种情况下是 JSON。我们用 `send_encoder()` 方法做到这一点。然后我们使用 `send_hello()` 发送我们的 [`Hello`](plugin_protocol_reference.md#hello) 消息，通知 Nu 我们与它的兼容性，这是在我们发送任何其他消息之前必需的。然后我们读取 Nu 发送给我们的 JSON 序列化消息。由于 Nu 总是将每条消息放在自己的行上，我们只需读取输入的每一行并分别解析它。

每个 [`Call`](plugin_protocol_reference.md#call) 都带有一个 ID 号，我们必须为 [`CallResponse`](plugin_protocol_reference.md#callresponse)（包括错误）保留。

当我们发送 `Signature` 请求时，我们使用此插件的签名进行响应，这是一些信息，告诉 Nu 应如何调用命令。

当我们发送 `Run` 请求时，我们解析提供的 JSON 并响应请求

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

处理输入的工作由这个 `handle_call` 函数完成。在这里，我们假设我们被给予字符串（我们可以在将来使这个更健壮并返回有意义的错误），然后我们提取给我们的字符串。从那里，我们测量字符串的长度并为此长度创建一个新的 `Int` 值。

最后，我们使用给我们的相同项目并用这个新的 Int 替换有效负载。我们这样做是为了重用传递给我们的字符串的 `span`，尽管这是一个可选步骤。我们可以选择创建新的元数据并传递出去。

我们有一些辅助函数：

```python
def send_response(id, response):
    msg = {
        "CallResponse": [id, response]
    }
    sys.stdout.writelines([json.dumps(msg)])
    sys.stdout.flush()
```

`send_response()` 格式化并写入带有给定 id 和主体的 [`CallResponse`](plugin_protocol_reference.md#callresponse)。

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

`send_error()` 格式化并发送错误响应给我们。

```python
import json
import sys
```

所有这些都需要一些导入才能完成，所以确保包含它们。

```python
#!/usr/local/bin/python3
```

最后，为了使运行我们的 Python 更容易，我们使这个文件可执行（使用类似 `chmod +x nu_plugin_len.py` 的东西）并在顶部添加我们的 python 路径。这个技巧适用于基于 Unix 的平台，对于 Windows 我们需要创建一个 .exe 或 .bat 文件来为我们调用 python 代码。

请参阅[示例 Python 插件](https://github.com/nushell/nushell/tree/main/crates/nu_plugin_python)以获取关于如何用另一种语言（包括 Python）实现 Nushell 插件的全面示例。
