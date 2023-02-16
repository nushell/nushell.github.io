# 脚本

在 Nushell 中，你可以用 Nushell 语言编写和运行脚本。要运行一个脚本，你可以把它作为一个参数传递给`nu`命令行程序：

```bash
> nu myscript.nu
```

这将在一个新的 Nu 实例中运行脚本直至完成。你也可以使用[`source`](/commands/commands/source.md)在 Nu 的 **当前** 实例中运行脚本：

```bash
> source myscript.nu
```

我们来看一个脚本文件的例子吧：

```bash
# myscript.nu
def greet [name] {
  echo "hello" $name
}

greet "world"
```

脚本文件包含了自定义命令的定义以及主脚本本身，它将在自定义命令定义后运行。

在上面的例子中，首先`greet`是由 Nushell 解释器定义的，这使得我们之后可以调用这个定义，我们可以把上面的内容写成：

```bash
greet "world"

def greet [name] {
  echo "hello" $name
}
```

Nushell 并不要求定义必须放在脚本中调用该定义之前，你可以把定义放在你觉得舒服的地方。

## 脚本是如何被处理的

在一个脚本中定义总是先运行，这样我们就可以在脚本中调用定义。

在定义运行之后, 我们从脚本文件的顶部开始, 一个接一个地运行每一组命令。

## 脚本行

为了更好地理解 Nushell 是如何看待代码行的, 我们来看一个脚本的例子：

```bash
a
b; c | d
```

当这个脚本运行时，Nushell 将首先运行`a`命令至完成并查看其结果。接下来，Nushell 将按照["组"部分](types_of_data.html#组)中的规则运行`b; c | d`。

## 参数化脚本

脚本文件可以选择性地包含一个特殊的 "main" 命令。`main`将在任何其他 Nu 代码之后运行，主要用于向脚本添加参数。你可以在脚本名称后面传递参数（`nu <script name> <script args>`）。比如：

```bash
# myscript.nu

def main [x: int] {
  $x + 10
}
```

```
> nu myscript.nu 100
110
```

## Shebangs (`#!`)

在 Linux 和 macOS 上，你可以选择使用 [Shebang](<https://en.wikipedia.org/wiki/Shebang_(Unix)>)来告诉操作系统一个文件应该被 `Nu` 解释。例如，在一个名为 `myscript` 的文件中包含以下内容：

```bash
#!/usr/bin/env nu
echo "Hello World!"
```

此时你可以直接运行该脚本(注意：前面并没有加`nu`)：

```bash
> ./myscript
Hello World!
```
