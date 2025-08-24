---
title: 设置
---

# 设置

为了充分利用 nu，重要的是设置你的路径和环境以便于访问。
还有其他方法可以查看这些值和变量，但是设置你的 nu 配置将使这变得容易得多，因为这些具有跨平台支持。

---

### 配置你的路径和其他环境变量

在你的 `env.nu` 中，你可以设置你的环境。

要配置环境变量，你使用 `$env` 变量：

```nu
$env.TITLE = 'Nu Test'
$env.VALUE = 123
```

要向 `PATH` 环境变量添加路径，你可以追加它们：

```nu
$env.PATH ++= ['~/.local/bin']
```

因为你可以追加路径列表，所以你可以一次追加多个。你也可以使用子命令来在线构造路径。

```nu
$env.PATH ++= [ '~/.local/bin', ($env.CARGO_HOME | path join "bin") ]
```

因为 PATH 顺序很重要，你可能希望 _前置_ 你的路径，这样它们优先于具有相同名称的其他可执行文件：

```
use std/util "path add"
path add '~/.local/bin'
```

更多信息，请参阅关于 [环境变量](/zh-CN/book/environment.html#setting-environment-variables) 和 [PATH 配置](/zh-CN/book/configuration.html#path-configuration) 的文档。

### 如何列出你的环境变量

```nu
$env
# => ─────────────────────────────────┬────────────────────────────────────────────
# =>  ALLUSERSPROFILE                 │ C:\ProgramData
# =>  CARGO_PKG_AUTHORS               │ The Nu Project Contributors
# =>  CARGO_PKG_DESCRIPTION           │ A new type of shell
# =>  CARGO_PKG_HOMEPAGE              │ https://www.nushell.sh
# =>  CARGO_PKG_LICENSE               │ MIT
# =>  CARGO_PKG_LICENSE_FILE          │
# =>  CARGO_PKG_NAME                  │ nu
# =>  CARGO_PKG_REPOSITORY            │ https://github.com/nushell/nushell
# =>  CARGO_PKG_VERSION               │ 0.59.0
# =>  CARGO_PKG_VERSION_MAJOR         │ 0
```

让我们练习一下，使用 `vim`（或你选择的编辑器）在我们的 `env.nu` 文件中设置 `$EDITOR`

```nu
vim $nu.env-path
```

注意：如果你从未使用过 `vim` 并且想要退出，输入 `:q!` 将在不保存的情况下关闭。

转到文件末尾并添加

```nu
$env.EDITOR = 'vim'
```

或 `emacs`、`vscode` 或任何你喜欢的编辑器。不要忘记程序需要在 `PATH` 上可访问
并在 linux/mac 上使用 `exec nu` 重新加载你的配置，或在 windows 上重新启动你的 nushell。

你现在应该能够轻松地运行 `config nu` 或 `config env` 并编辑这些文件。

---

### 如何获取单个环境变量的值

```nu
$env.APPDATA
```

---

### 使用钩子通过环境变量导出状态

像 starship 这样的附加工具会在每个提示出现时与 nushell 一起运行。
特别是 [`starship`](https://starship.rs) 会用自己的提示替换默认提示。
为了最大兼容性，`starship` 二进制文件将在每次提示渲染时运行
并且是绝对无状态的。
然而，Nushell 在单个实例中是非常有状态的。

[钩子](../book/hooks) 允许注册自定义回调函数。
在这种情况下，`pre_prompt` 钩子非常有用。
有了它，我们可以将状态信息导出为环境变量，例如，当前激活了哪些 [覆层](https://www.nushell.sh/book/overlays.html)。

```nu
# 使用覆层列表设置 NU_OVERLAYS，对 starship 提示有用
$env.config.hooks.pre_prompt = ($env.config.hooks.pre_prompt | append {||
  let overlays = overlay list | slice 1..
  if not ($overlays | is-empty) {
    $env.NU_OVERLAYS = $overlays | str join ", "
  } else {
    $env.NU_OVERLAYS = null
  }
})
```

现在在 `starship` 中，我们可以使用这个环境变量来显示哪些模块是活动的。

```toml
[env_var.NU_OVERLAYS]
symbol = '📌 '
format = 'with [$symbol($env_value )]($style)'
style = 'red'
```
