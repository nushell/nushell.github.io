# 配置

## Nushell 配置与`env.nu`和`config.nu`

Nushell 使用一个配置系统，在启动时加载并运行两个 Nushell 脚本文件：
首先是`env.nu`，然后是`config.nu`。
这些文件的路径可以通过调用`echo $nu.env-path`和`echo $nu.config-path`找到。
`env.nu`是用来定义环境变量的，然后这些环境变量定义将在`config.nu`中可用；
`config.nu`可以用来在全局命名空间中添加定义、别名等等。

_(你可以把 Nushell 的配置加载顺序想象成在启动时执行两行[REPL](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop)：`source /path/to/env.nu`和`source /path/to/config.nu`。因此，用`env.nu`表示环境，用`config.nu`表示其他配置，只是一个约定。)_

当你在没有设置这些文件的情况下启动 Nushell，Nushell 会提示你下载[`default env.nu`](https://github.com/nushell/nushell/blob/main/docs/sample_config/default_env.nu)和[`default config.nu`](https://github.com/nushell/nushell/blob/main/docs/sample_config/default_config.nu)。
你可以通过浏览这些默认文件，了解环境变量的默认值和所有可配置项的列表。

### 配置 `$config`

Nushell 的主要设置是以记录的形式保存在全局的`$config`变量中。这个记录可以用以下方式创建：

```bash
let $config = {
  ...
}
```

你也可以隐藏(shadow)`$config`并更新它：

```bash
let $config = ($config | upsert <field name> <field value>)
```

按照约定，这个变量被定义在`config.nu`文件中。

### 环境

你可以在 Nushell 会话期间使用[`let-env`](/book/commands/let-env.md)在`env.nu`文件中设置环境变量。比如：

```bash
let-env FOO = 'BAR'
```

以下是值得关注的且为 Nushell 所特有的几个相对重要的环境变量：

- `LS_COLORS`: 在`ls`中为每个文件类型设置颜色
- `PROMPT_COMMAND`: 为设置提示而执行的代码（块或字符串）
- `PROMPT_COMMAND_RIGHT`: 为设置正确的提示而执行的代码（块）
- `PROMPT_INDICATOR = "〉"`: 提示后打印的提示符（默认为 ">" 类似的 Unicode 符号）
- `PROMPT_INDICATOR_VI_INSERT = ": "`
- `PROMPT_INDICATOR_VI_NORMAL = "〉 "`
- `PROMPT_MULTILINE_INDICATOR = "::: "`

### 颜色配置部分

你可以在[相关章节](coloring_and_theming.md)中了解更多关于设置颜色和主题的信息。

## 将 Nu 配置为登录 Shell

要把 Nu 作为一个登录 Shell，你需要配置`$env`变量。如此以来，在你将使用 Nu 为登录 shell 时有足够的支持来运行外部命令。

你可以通过在另一个 Shell（如 Bash）中运行 Nu 来建立完整的环境变量集。一旦你进入 Nu，你可以运行这样的命令：

```bash
> env | each { |it| echo $"let-env ($it.name) = '($it.raw)'" } | str collect (char nl)
```

这将打印出[`let-env`](/book/commands/let-env.md)所有行，且包含每个环境变量及其设置。

接下来，在一些发行版上，你还需要确保 Nu 在`/etc/shells`列表中：

```bash
> cat /etc/shells
# /etc/shells: valid login shells
/bin/sh
/bin/dash
/bin/bash
/bin/rbash
/usr/bin/screen
/usr/bin/fish
/home/jonathan/.cargo/bin/nu
```

这样你就可以使用`chsh`命令来将 Nu 设置为你的登录 Shell。在你注销后下次登录时，应该可以看到一个闪亮的 Nu 提示。

### macOS: 保持 `open` 为 `/usr/bin/open`

一些工具（例如 Emacs）依靠`open`命令来打开 Mac 上的文件。
由于 Nushell 有自己的[`open`](/book/commands/open.md)命令，它有不同的语义并隐藏了`/usr/bin/open`，这样某些工具在试图使用它时将出错。
一个解决这个问题的方法是为 Nushell 的`open`定义一个自定义命令，并在你的`config.nu`文件中为系统的`open`创建一个别名，像这样：

```bash
def nuopen [arg, --raw (-r)] { if $raw { open -r $arg } else { open $arg } }
alias open = ^open
```

## 命令提示配置

第三方提示现在有了自己的 [Nushell 书中的章节](3rdpartyprompts.md)。
