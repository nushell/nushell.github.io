# 脚本

在 Nushell 中，你可以用 Nushell 语言编写和运行脚本。要运行一个脚本，你可以把它作为一个参数传递给`nu`命令行程序：

```nu
nu myscript.nu
```

这将在一个新的 Nu 实例中运行脚本直至完成。你也可以使用[`source`](/commands/docs/source.md)在 Nu 的 **当前** 实例中运行脚本：

```nu
source myscript.nu
```

我们来看一个脚本文件的例子吧：

```nu
# myscript.nu
def greet [name] {
  ["hello" $name]
}

greet "world"
```

脚本文件包含了自定义命令的定义以及主脚本本身，它将在自定义命令定义后运行。

在上面的例子中，首先`greet`是由 Nushell 解释器定义的，这使得我们之后可以调用这个定义，我们可以把上面的内容写成：

```nu
greet "world"

def greet [name] {
  ["hello" $name]
}
```

Nushell 并不要求定义必须放在脚本中调用该定义之前，你可以把定义放在你觉得舒服的地方。

## 脚本是如何被处理的

在一个脚本中定义总是先运行，这样我们就可以在脚本中调用定义。

在定义运行之后, 我们从脚本文件的顶部开始, 一个接一个地运行每一组命令。

## 脚本行

为了更好地理解 Nushell 是如何看待代码行的, 我们来看一个脚本的例子：

```nu
a
b; c | d
```

当这个脚本运行时，Nushell 将首先运行`a`命令至完成并查看其结果。接下来，Nushell 将按照[“分号”部分](pipelines.html#semicolons)中的规则运行`b; c | d`。

## 参数化脚本

脚本文件可以选择性地包含一个特殊的 "main" 命令。`main`将在任何其他 Nu 代码之后运行，主要用于向脚本添加位置参数和标志。你可以在脚本名称后面传递参数（`nu <script name> <script args>`）。比如：

```nu
# myscript.nu
def main [x: int] {
  $x + 10
}
```

```nu
nu myscript.nu 100
# => 110
```

## 参数类型解释

默认情况下，提供给脚本的参数会被解释为 `Type::Any` 类型，这意味着它们不受特定数据类型的约束，可以在脚本执行期间动态解释为适合任何可用的数据类型。

在前面的例子中，`main [x: int]` 表示参数 x 应该具有整数数据类型。但是，如果参数没有显式类型，它们将根据其表观数据类型进行解析。

例如：

```nu
# implicit_type.nu
def main [x] {
  $"Hello ($x | describe) ($x)"
}

# explicit_type.nu
def main [x: string] {
  $"Hello ($x | describe) ($x)"
}
```

```nu
nu implicit_type.nu +1
# => Hello int 1

nu explicit_type.nu +1
# => Hello string +1
```

## 子命令

一个脚本可以有多个[子命令](custom_commands.html#subcommands)，例如 `run` 或 `build`：

```nu
# myscript.nu
def "main run" [] {
    print "running"
}

def "main build" [] {
    print "building"
}

def main [] {
    print "hello from myscript!"
}
```

然后你可以在调用脚本时执行其子命令：

```nu
nu myscript.nu
# => hello from myscript!
nu myscript.nu build
# => building
nu myscript.nu run
# => running
```

与[模块](modules.html#main)不同，`main` 不需要被导出即可见。在上面的例子中，我们的 `main` 命令不是 `export def`，但它在运行 `nu myscript.nu` 时仍然被执行。如果我们通过运行 `use myscript.nu` 来使用 myscript 作为一个模块，而不是作为脚本运行 `myscript.nu`，那么尝试执行 `myscript` 命令将不起作用，因为 `myscript` 没有被导出。

需要注意的是，你必须定义一个 `main` 命令，以便 `main` 的子命令能够被正确暴露。例如，如果我们只定义了 `run` 和 `build` 子命令，它们在运行脚本时将无法访问：

```nu
# myscript.nu
def "main run" [] {
    print "running"
}

def "main build" [] {
    print "building"
}
```

```nu
nu myscript.nu build
nu myscript.nu run
```

这是当前脚本处理方式的一个限制。如果你的脚本只有子命令，你可以添加一个空的 `main` 来暴露子命令，像这样：

```nu
def main [] {}
```

## Shebangs (`#!`)

在 Linux 和 macOS 上，你可以选择使用 [shebang](<https://en.wikipedia.org/wiki/Shebang_(Unix)>)来告诉操作系统一个文件应该被 Nu 解释。例如，在一个名为 `myscript` 的文件中包含以下内容：

```nu
#!/usr/bin/env nu
"Hello World!"
```

```nu
./myscript
# => Hello World!
```

为了让脚本能够访问标准输入，应该使用 `--stdin` 标志来调用 `nu`：

```nu
#!/usr/bin/env -S nu --stdin
def main [] {
  echo $"stdin: ($in)"
}
```

```nu
echo "Hello World!" | ./myscript
# => stdin: Hello World!
```
