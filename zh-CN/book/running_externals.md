# 运行系统(外部)命令

Nu提供了一组可以在不同操作系统上使用的命令("内部"命令)，这种一致性在创建跨平台代码时很有帮助。但有时，你可能想运行一个与Nu内部命令同名的外部命令。例如，要运行外部的[`ls`](/commands/docs/ls.md)或[`date`](/commands/docs/date.md)命令，可以在前面加上脱字符号（^）。使用脱字符号前缀会调用用户`PATH`中找到的外部命令(例如`/bin/ls`)，而不是Nu内部的[`ls`](/commands/docs/ls.md)命令。

Nu内部命令:

```nu
ls
```

外部命令(通常是`/usr/bin/ls`):

```nu
^ls
```

::: note
在Windows上，`ls`默认是PowerShell的 _别名_，因此`^ls`不会找到匹配的系统 _命令_。
:::

## 用 `%` 运行内置命令

百分号（`%`）符号的作用与脱字符号相反：它总是运行 Nushell 的内置命令，即使存在同名的自定义命令或别名把它遮蔽了：

```nu
def echo [...args] { "custom echo" }
echo hello
# => custom echo
%echo hello
# => hello
```

`%` 调用只会解析到内置命令。它仍然能找到被 [`hide`](/commands/docs/hide.md) 隐藏的内置命令，并且绝不会回退到外部命令或自定义命令。如果没有同名的内置命令，Nushell 会报错：

```nu
%lss
# => Error: nu::parser::error
# =>
# =>   × percent sigil requires a built-in command
# =>    ╭─[repl_entry #1:1:2]
# =>  1 │ %lss
# =>    ·  ─┬─
# =>    ·   ╰── unknown built-in command
# =>    ╰────
# =>   help: remove `%` to use normal resolution, or use `^` to run an external command explicitly
```

与 `^` 一样，`%` 符号也接受存放在变量里的命令名，例如 `%$cmd`。

## 传递参数

外部参数由 Nushell 语法分隔，而不是由带引号的字符串里的空格分隔。给字符串加引号可以把其中的空格保留在同一个参数内：

```nu
git commit -m "Update external command documentation"
```

Nushell 不会自动把列表转换为外部参数，直接传入列表会产生错误。请使用展开运算符（`...`）把列表的每个元素作为独立参数传入：

```nu
let paths = ["file one.txt" "file two.txt"]
git add ...$paths
```

这里 `git` 会收到两个路径参数，每个路径中的空格仍然是该参数的一部分。更多示例和完整的展开规则，请参阅[命令调用中的展开运算符](operators.md#在命令调用中)。

脱字符号也可以运行名称或路径存放在变量中的可执行文件：

```nu
let program = "git"
^$program status
```

关于支持的字符串形式，请参阅[字符串作为外部命令](working_with_strings.md#字符串作为外部命令)。[`extern` 声明](externs.md)可以为已知的外部命令添加类型检查和补全，其 [`@structured`](externs.md#结构化输出) 属性还能把命令的输出转换为数据。调用它时同样遵循这里描述的参数规则。

## Windows 额外说明

在Windows上运行外部命令时，
Nushell会将一些`CMD.EXE`内部命令转发给cmd，而不是尝试运行外部命令。
[从CMD.EXE迁移](coming_from_cmd.md)包含了这些命令的列表并更详细地描述了这种行为。
