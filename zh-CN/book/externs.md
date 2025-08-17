# 外部命令

使用外部命令（又名二进制文件或应用程序）是任何 shell 的一个基本功能。Nushell 允许自定义命令利用其许多功能，例如：

- 解析时类型检查
- 自动补全
- 语法高亮

对这些功能的支持是使用 `extern` 关键字提供的，它允许为外部命令定义一个完整的签名。

下面是 `ssh` 命令的一个简短例子：

```nu
module "ssh extern" {
  def complete_none [] { [] }

  def complete_ssh_identity [] {
    ls ~/.ssh/id_*
    | where {|f|
        ($f.name | path parse | get extension) != "pub"
      }
    | get name
  }

  export extern ssh [
    destination?: string@complete_none  # 目标主机
    -p: int                             # 目标端口
    -i: string@complete_ssh_identity    # 身份文件
  ]
}
use "ssh extern" ssh
```

你会注意到这里的语法与定义自定义命令时的 `def` 关键字的语法相似。你可以描述标志、位置参数、类型、补全器等等。

这个实现：

- 将提供 `-p` 和 `-i`（带描述）作为 `ssh -` 的可能补全。
- 将执行解析时类型检查。试图为端口号使用非 `int` 将导致错误（和错误条件的语法高亮）。
- 将根据参数的形状提供解析时语法高亮。
- 将提供 `~/.ssh` 中的任何私钥文件作为 `-i`（身份）选项的补全值。
- 将不为目标主机提供补全。如果没有返回空列表的补全器，Nushell 将尝试使用默认的“文件”补全器。

  有关从 SSH 配置文件中检索主机的实现，请参阅 [Nu_scripts 仓库](https://github.com/nushell/nu_scripts/blob/main/custom-completions/ssh/ssh-completions.nu)。

::: tip 提示
用于参数文档目的的 Nushell 注释，如果与参数在同一行，则需要在 `#` 井号之前加一个空格。
:::

## 格式说明符

位置参数可以用 `?` 设为可选（如上所示）。剩余的（`rest`）参数可以在参数名称前用 `...` 来匹配。例如：

```nu
export extern "git add" [
  ...pathspecs: path
  # …
]
```

## 局限性

目前的`extern`语法有一些限制。在 Nushell 中，标志和位置参数是非常灵活的：标志可以在位置参数之前, 也可以与位置参数混合, 还可以跟随位置参数。许多外部命令没有这种灵活性。目前还没有一种方法来确保标志和位置参数的特定顺序与外部命令所要求的风格保持一致。

第二个限制是，有些外部命令要求使用`=`来传递标志和值。在 Nushell 中，`=`是一种方便的可选默认参数语法，目前还没有办法按要求使用它。

此外，通过脱字符号（例如 `^ssh`）调用的外部命令不会被 `extern` 识别。

最后，一些外部命令支持使用单个前导连字符的 `-long` 参数。Nushell `extern` 语法尚不能表示这些参数。
