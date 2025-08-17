# 运行系统(外部)命令

Nu提供了一组可以在不同操作系统上使用的命令("内部"命令)，这种一致性在创建跨平台代码时很有帮助。但有时，你可能想运行一个与Nu内部命令同名的外部命令。例如，要运行外部的[`ls`](/zh-CN/commands/docs/ls.md)或[`date`](/zh-CN/commands/docs/date.md)命令，可以在前面加上脱字符(^)。使用脱字符前缀会调用用户`PATH`中找到的外部命令(例如`/bin/ls`)，而不是Nu内部的[`ls`](/zh-CN/commands/docs/ls.md)命令。

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

## Windows额外说明

在Windows上运行外部命令时，
Nushell会将一些`CMD.EXE`内部命令转发给cmd，而不是尝试运行外部命令。
[从CMD.EXE迁移](coming_from_cmd.md)包含了这些命令的列表并更详细地描述了这种行为。
