# 转移到系统

Nu 提供了一套你可以在不同操作系统中使用的命令（也成为"内部"命令），而且具备这种一致性是很有帮助的。但有时，你需要运行一个与 Nu 内部命令同名的外部命令。例如，要运行外部的`ls`或`date`命令，你可以使用脱字符 (^) 命令。用 `^` 前缀 可以转移调用用户 PATH 中的命令（例如：`/bin/ls`，而不是 Nu 内部的 [`ls`](/commands/docs/ls.md) 命令）。

Nu 的内部命令：

```nu
ls
```

转移到外部命令：

```nu
^ls
```
