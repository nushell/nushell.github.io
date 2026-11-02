# 配置

## 快速入门

虽然 Nushell 提供了许多用于管理其启动和配置的选项，但新用户只需几个简单的步骤即可开始：

1. 告诉 Nushell 使用哪个编辑器：

   ```nu
   $env.config.buffer_editor = "<path_to_your_preferred_editor>"
   ```

   例如：

   ```nu
   $env.config.buffer_editor = ["code", "-w"]
   # 或
   $env.config.buffer_editor = "nano"
   # 或
   $env.config.buffer_editor = "hx"
   # 或
   $env.config.buffer_editor = "vi"
   # 带参数
   $env.config.buffer_editor = ["emacsclient", "-s", "light", "-t"]
   # 等等
   ```

2. 使用以下命令编辑 `config.nu`：

   ```nu
   config nu
   ```

   这将在上面定义的编辑器中打开当前的 `config.nu`。

3. 将每次 Nushell 启动时应运行的命令添加到此文件中。一个很好的初始示例可能是上面的 `buffer_editor` 设置。

   你可以使用以下命令找到可用设置的详细列表：

   ```nu
    config nu --doc | nu-highlight | less -R
   ```

4. 保存、退出编辑器，然后启动一个新的 Nushell 会话以加载这些设置。

就是这样！需要时，下面有更多详细信息...

---

[[toc]]

::: tip
要从 Nushell 内部查看此文档的简化版本，请运行：

```nu
config nu --doc | nu-highlight | less -R
```

:::

## 配置概述

Nushell 使用多个可选的配置文件。这些文件按以下顺序加载：

1. 加载的第一个文件是 `env.nu`，历史上用于覆盖环境变量。但是，当前的“最佳实践”建议是使用 `config.nu` 和下面的自动加载目录来设置所有环境变量（和其他配置）。

2. `config.nu` 通常用于覆盖默认的 Nushell 设置、定义（或导入）自定义命令，或运行任何其他启动任务。
3. 加载 `$nu.vendor-autoload-dirs` 中的 `*.nu` 文件。这些目录旨在用于供应商和包管理器的启动文件。
4. 加载 `$nu.user-autoload-dirs` 中的 `*.nu` 文件。这些文件可用于任何启动任务，是模块化配置的好方法。
5. `login.nu` 运行仅在 Nushell 作为登录 shell 运行时才应发生的命令或处理配置。

默认情况下，`env.nu`、`config.nu` 和 `login.nu` 从 `$nu.default-config-dir` 目录中读取。例如：

```nu
$nu.default-config-dir
# macOS
# => /Users/me/Library/Application Support/nushell
# Linux
# => /home/me/.config/nushell
# Windows
# => C:\Users\me\AppData\Roaming\nushell
```

Nushell 首次启动时，将创建配置目录以及一个空的（除了注释）`env.nu` 和 `config.nu`。

::: tip
你可以使用 `config nu` 命令在默认文本编辑器中快速打开 `config.nu`。同样，`config env` 命令将打开 `env.nu`。

这要求你已使用以下任一方式配置了默认编辑器：

- Nushell 的 `$env.config.buffer_editor` 设置
- `$env.VISUAL` 或 `$env.EDITOR` 环境变量

例如，将此行放入你的 `config.nu` 中，以便在 Visual Studio Code 中编辑文件：

```nu
$env.config.buffer_editor = 'code'
```

:::

## `config.nu` 中的常见配置任务：

::: tip
一些用户可能更喜欢一个“单体”配置文件，其中大部分或所有启动任务都在一个地方。`config.nu` 可用于此目的。

其他用户可能更喜欢“模块化”配置，其中每个文件处理一组更小、更集中的任务。自动加载目录中的文件可用于创建此体验。
:::

`config.nu` 通常用于：

- 为 Nushell 和其他应用程序[设置环境变量](#设置环境变量)
- 在 [`$env.config`](#env-config-记录中的-nushell-设置) 中设置 Nushell 设置
- 加载模块或源文件，以便其命令随时可用
- 在启动时运行任何其他应用程序或命令

## 设置环境变量

::: tip 另请参阅
[环境](./environment.md)章节涵盖了有关如何设置和访问环境变量的其他信息。
:::

### 路径配置

与大多数 shell 一样，Nushell 搜索名为 `PATH`（或其变体）的环境变量。

:::tip
与某些 shell 不同，Nushell 尝试对环境变量“不区分大小写”。`Path`、`path`、`PATH`，甚至 `pAtH` 都是同一环境变量的允许变体。有关详细信息，请参阅[环境 - 大小写敏感性](./environment.md#大小写敏感性)。
:::

当 Nushell 启动时，它通常继承 `PATH` 作为一个字符串。但是，Nushell 会自动将其转换为 Nushell 列表以便于访问。这意味着你可以使用例如以下方式*追加*到路径：

```nu
$env.path ++= ["~/.local/bin"]
```

标准库还包括一个辅助命令。默认的 `path add` 行为是*前置*一个目录，使其比路径的其余部分具有更高的优先级。例如，可以将以下内容添加到你的启动配置中：

```nu
use std/util "path add"
path add "~/.local/bin"
path add ($nu.home-dir | path join ".cargo" "bin")
```

::: tip
请注意上面示例中 `path join` 的使用。此命令正确连接两个路径组件，无论路径分隔符是否存在。有关此类别中的更多命令，请参阅 `help path`。
:::

### 提示符配置

Nushell 提供了许多提示符配置选项。默认情况下，Nushell 包括：

- 一个包含当前目录的提示符，如果它在主目录下（或其子目录），则使用 `~` 缩写。
- 一个紧接在提示符右侧的提示指示符。在正常编辑模式下，默认为 `> `，在 Vi 插入模式下为 `: `。请注意字符后的额外空格，以提供命令与提示符之间的分隔。
- 一个带有日期和时间的右提示符
- 一个在当前命令行跨越多行时显示的指示符 - 默认为 `::: `

控制这些提示符组件的环境变量是：

- `$env.PROMPT_COMMAND`: 提示符本身
- `$env.PROMPT_COMMAND_RIGHT`: 可以出现在终端右侧的提示符
- `$env.PROMPT_INDICATOR`: Emacs 模式指示符
- `$env.PROMPT_INDICATOR_VI_NORMAL`: Vi-normal 模式指示符
- `$env.PROMPT_INDICATOR_VI_INSERT`: Vi-insert 模式指示符
- `$env.PROMPT_MULTILINE_INDICATOR`: 多行指示符

这些变量中的每一个都接受以下任一值：

- 一个字符串，在这种情况下，组件将静态显示为该字符串。
- 一个闭包（无参数），在这种情况下，组件将根据闭包的代码动态显示。
- `null`，在这种情况下，组件将恢复为其内部默认值。

::: tip
例如，要禁用右提示符，请将以下内容添加到你的启动配置中：

```nu
$env.PROMPT_COMMAND_RIGHT = ""
# 或
$env.PROMPT_COMMAND_RIGHT = {||}
```

:::

#### 瞬态提示符

Nushell 还支持瞬态提示符，它允许在执行命令行*后*显示不同的提示符。这在几种情况下很有用：

- 使用多行提示符时，瞬态提示符可以是更精简的版本。
- 删除瞬态多行指示符和右提示符可以简化从终端的复制。

与上面的普通提示符命令一样，每个瞬态提示符都可以接受一个（静态）字符串、一个（动态）闭包或一个 `null` 以使用 Nushell 内部默认值。

控制瞬态提示符组件的环境变量是：

- `$env.TRANSIENT_PROMPT_COMMAND`: 执行命令行后的提示符本身
- `$env.TRANSIENT_PROMPT_COMMAND_RIGHT`: 可以出现在终端右侧的提示符
- `$env.TRANSIENT_PROMPT_INDICATOR`: Emacs 模式指示符
- `$env.TRANSIENT_PROMPT_INDICATOR_VI_NORMAL`: Vi-normal 模式指示符
- `$env.TRANSIENT_PROMPT_INDICATOR_VI_INSERT`: Vi-insert 模式指示符
- `$env.TRANSIENT_PROMPT_MULTILINE_INDICATOR`: 多行指示符

::: tip
Nushell 将 `TRANSIENT_PROMPT_COMMAND_RIGHT` 和 `TRANSIENT_PROMPT_MULTILINE_INDICATOR` 设置为空字符串 (`""`)，以便在输入上一个命令后它们都消失。这简化了从终端的复制和粘贴。

要禁用此功能并始终显示这些项目，请设置：

```nu
$env.TRANSIENT_PROMPT_COMMAND_RIGHT = null
$env.TRANSIENT_PROMPT_MULTILINE_INDICATOR = null
```

:::

#### 缓慢的提示符段

一个运行时间较长的提示符闭包（例如调用 `git` 的闭包）会拖慢每一次提示符的显示。
这时可以让闭包启动一个[后台任务](./background_jobs.md)并立即返回。任务完成后，
它会调用 [`commandline set-prompt`](/commands/docs/commandline_set-prompt.md) 来补上缺失的部分，
而不会干扰正在编辑的行。例如，要在右侧提示符中显示当前的 Git 分支：

```nu
$env.PROMPT_COMMAND_RIGHT = {
    job spawn {
        let branch = (git branch --show-current | complete | get stdout | str trim)
        commandline set-prompt --right $"(ansi yellow)($branch)(ansi reset)"
    }

    ""  # 在后台任务填充之前，右侧不显示任何内容
}
```

`commandline set-prompt` 默认设置左侧提示符。使用 `--right`、`--indicator`、`--vi-insert`、`--vi-normal` 或 `--multiline` 可以设置其他提示符组件。新文本会一直保留到下一次绘制提示符为止。

由提示符闭包，或由 `pre_prompt` / `env_change` [钩子](./hooks.md) 启动的任务，可能在提示符绘制之前就完成（例如 `git` 响应很快时）。此时它的 `commandline set-prompt` 仍会显示在那一次提示符上。当钩子或提示符闭包直接调用 `commandline set-prompt` 时也是如此：推送的文本会替换提示符变量为该段提供的内容。

### ENV_CONVERSIONS

某些变量，例如包含多个路径的变量，通常在其他 shell 中存储为以冒号分隔的字符串。Nushell 可以自动将这些转换为更方便的 Nushell 列表。`ENV_CONVERSIONS` 变量指定了环境变量如何：

- 从字符串转换为值（from_string）。这在 `$env.ENV_CONVERSIONS` 被赋值时立即发生，针对那一刻存在的每个已列出的变量（例如从父进程继承来的那个）。
- 在运行外部命令时从值转换回字符串 (to_string)

`ENV_CONVERSIONS` 是一个记录，其中：

- 每个键是要转换的环境变量
- 每个值是另一个包含以下内容的记录：
  ```nu
  {
    from_string: <closure>
    to_string: <closure>
  }
  ```

::: tip
如上所述，操作系统路径变量由 Nushell 自动转换。因此，它可以在你的启动配置中作为列表处理，而无需出现在 `ENV_CONVERSIONS` 中。其他以冒号分隔的路径，如 `XDG_DATA_DIRS`，则不会自动转换。
:::

要添加其他转换，请使用 [`merge`](/commands/docs/merge.md) 将其合并到 `$env.ENV_CONVERSIONS` 记录中。例如，要为 `XDG_DATA_DIRS` 变量添加转换：

```nu
$env.ENV_CONVERSIONS = $env.ENV_CONVERSIONS | merge {
    "XDG_DATA_DIRS": {
        from_string: {|s| $s | split row (char esep) | path expand --no-symlink }
        to_string: {|v| $v | path expand --no-symlink | str join (char esep) }
    }
}
```

### `LS_COLORS`

与许多类似 `ls` 的实用程序一样，Nushell 的目录列表利用 `LS_COLORS` 环境变量来定义应用于某些文件类型和模式的样式/颜色。

## `$env.config` 记录中的 Nushell 设置

### 在 `$env.config` 记录中更改设置

更改 Nushell 行为的主要机制是 `$env.config` 记录。虽然此记录作为环境变量访问，但与大多数其他变量不同，它：

- 不会从父进程继承。相反，它由 Nushell 本身用某些默认值填充。
- 不会导出到由 Nushell 启动的子进程。

要检查 `$env.config` 中的当前设置，只需键入变量名：

```nu
$env.config
```

::: tip
由于 Nushell 提供了如此多的自定义选项，最好将其发送到分页器，例如：

```nu
$env.config | table -e | less -R
# 或者，如果安装了 bat：
$env.config | table -e | bat -p
```

:::

可以使用以下命令在 Nushell 中查看每个设置的缩写文档：

```nu
config nu --doc | nu-highlight | bat
# 或
config nu --doc | nu-highlight | less -R
```

一些较新添加的设置包括：

- `error_style`：`"fancy"`（默认值）、`"plain"`、`"short"` 用于简洁的单行错误消息，或 `"nested"` 将相关错误嵌套显示在主要错误之下。`error_lines` 设置错误位置周围显示的源代码行数（默认为 `1`）。
- `auto_cd_implicit`：当为 `true` 时，只输入子目录的名称（例如 `src`）就会进入该目录。默认情况下，自动切换目录需要 `./src` 这样的路径。
- `history.path`：历史文件的自定义位置，或设为 `null` 来禁用历史记录。`history.ignore_space_prefixed`（默认为 `true`）可以让以空格开头的命令不进入历史记录。
- `completions.cache_size`：要记住多少个 Tab 补全前缀（默认为 `100`；`0` 表示禁用缓存）。`completions.persistent_menus`：当为 `true` 时，补全和历史菜单在你编辑命令行时保持打开。

为避免覆盖现有设置，最好只为所需的配置键分配更新的值，而不是整个 `config` 记录。换句话说：

::: warning 错误

```nu
$env.config = {
  show_banner: false
}
```

这将重置任何*其他*已更改的设置，因为整个记录将被覆盖。
:::

::: tip 正确

```nu
$env.config.show_banner = false
```

这*仅*更改 `show_banner` 键/值对，使所有其他键保持其现有值。
:::

某些键本身也是记录。覆盖这些记录是可以的，但最佳实践是在这样做时设置所有值。例如：

```nu
# In config.nu
$env.config.history = {
  file_format: sqlite
  max_size: 1_000_000
  sync_on_enter: true
  isolation: true
}
```

::: note
history 的 `file_format`、`max_size`、`isolation` 和 `path` 设置在 REPL 启动时读取一次。请在 `config.nu` 中设置它们；之后（例如在提示符下）修改它们会触发 `nu::shell::config_option_locked_after_startup` 错误。
:::

### 删除欢迎消息

:::note
本节直接从横幅消息链接，因此它重复了上面的一些信息。
:::

要删除每次 Nushell 启动时显示的欢迎消息：

1. 键入 `config nu` 来编辑你的配置文件。
2. 如果你收到有关未定义编辑器的错误：

   ```nu
   $env.config.buffer_editor = "<path to your preferred editor>"
   # 例如：
   $env.config.buffer_editor = "code"
   $env.config.buffer_editor = "vi"
   # 或带编辑器参数：
   $env.config.buffer_editor = ["emacsclient", "-s", "light", "-t"]
   ```

   然后重复步骤 1。

3. 将以下行添加到文件末尾：

   ```nu
   $env.config.show_banner = false
   ```

4. 保存并退出你的编辑器。
5. 重新启动 Nushell 以测试更改。

## 其他启动配置

### 更改默认目录

::: warning 重要
如下所述，本节中的变量必须在 Nushell 启动**之前**设置。
:::

一些控制 Nushell 启动文件位置的变量必须在 Nushell 加载**之前**设置。这通常由父进程完成，例如：

- 运行 Nushell 的终端应用程序

- 操作系统或窗口管理器。当将 Nushell 作为登录 shell 运行时，这可能是唯一可用的机制。

  例如，在 Windows 上，你可以通过控制面板设置环境变量。选择开始菜单并搜索*“环境变量”*。

  在使用 PAM 的 Linux 系统上，可以使用 `/etc/environment`（以及其他系统特定的机制）。

- 父 shell。例如，在运行 `nu` 之前从 `bash` 导出值。

### 启动变量

影响 Nushell 文件位置的变量是：

- `$env.XDG_CONFIG_HOME`: 如果设置了此环境变量，它将用于更改 Nushell 搜索其配置文件（如 `env.nu`、`config.nu`、`login.nu` 和 `<config>/autoload` 目录）的目录。历史记录和插件文件默认也存储在此目录中。

  Nushell 启动后，此值存储在 `$nu.default-config-dir` 常量中。请参阅下面的[使用常量](#使用常量)。

  启动 `nu` 时也可以通过 `--config-home <path>` 标志选择配置目录，它优先于 `XDG_CONFIG_HOME`。与 `XDG_CONFIG_HOME` 不同，传给 `--config-home` 的路径就是 Nushell 配置目录本身（不会再附加 `nushell` 子目录），而相对路径是相对于当前目录解析的。

- `$env.XDG_DATA_HOME`: 如果设置了此环境变量，Nushell 会将 `$nu.data-dir` 常量设置为 `($env.XDG_DATA_HOME)/nushell`。`data-dir` 用于多个启动任务：

  - `($nu.data-dir)/completions` 被添加到 `const` 变量 [`$NU_LIB_DIRS`](./special_variables.md#nu-lib-dirs) 以及 `$env.NU_LIB_DIRS`（后者以相同的默认列表起始）。常量是配置搜索路径的首选方式；参见下文的 [`NU_LIB_DIRS` 常量](#nu-lib-dirs-常量)。
  - `($nu.data-dir)/vendor/autoload` 被添加到 `$nu.vendor-autoload-dirs` 中，位于系统供应商目录（例如来自 `XDG_DATA_DIRS` 的那些）之后。此目录中的文件将在其他供应商自动加载目录之后读取，从而覆盖其任何设置。

  请注意，由 `$nu.data-dir` 表示的目录及其任何子目录默认情况下都不会创建。这些目录的创建和使用由用户决定。

- `$env.XDG_DATA_DIRS` _（仅限 Unix 平台）_：如果设置了此环境变量，它将用于填充 `$nu.vendor-autoload-dirs` 目录。遵循 XDG 约定（靠前的条目优先级更高），这些目录以**相反顺序**处理：`XDG_DATA_DIRS` 中的第一个目录最后读取，从而能够覆盖其他目录中的定义。

::: warning
`XDG_*` 变量**不是** Nushell 特定的，不应设置为仅包含 Nushell 文件的目录。相反，应将环境变量设置为包含 `nushell` 目录的*上级*目录。

例如，如果你将 `$env.XDG_CONFIG_HOME` 设置为：

```
/users/username/dotfiles/nushell
```

... Nushell 将在 `/Users/username/dotfiles/nushell/nushell` 中查找配置文件。正确的设置应该是：

```
/users/username/dotfiles
```

另请记住，如果系统已经设置了 `XDG` 变量，那么这些目录中可能已经有正在使用的文件。更改位置可能需要你将其他应用程序的文件移动到新目录。
:::

::: tip
你可以使用以下方法在“全新”环境中轻松测试配置更改。以下内容在 Nushell 内部运行，但可以适应其他 shell：

```nu
# 创建一个空的临时目录
let temp_home = (mktemp -d)
# 将配置路径设置为此目录
$env.XDG_CONFIG_HOME = $temp_home
# 将数据目录设置为此目录
$env.XDG_DATA_HOME = $temp_home
# 替换默认的 XDG_DATA_DIRS 供应商自动加载目录（仅限 Unix）
$env.XDG_DATA_DIRS = $temp_home
# 在此环境中运行 Nushell
nu

# 编辑配置
config nu
# 退出子 shell
exit
# 运行临时配置
nu
```

测试完配置后：

```nu
# 如果需要，删除临时配置目录
rm -r $temp_home
```

**重要提示：** 然后退出父 shell，以免 `XDG` 更改意外传播到其他进程。
:::

### 使用常量

一些重要的命令，如 `source` 和 `use`，有助于定义自定义命令（和其他定义），它们是解析时关键字。除其他外，这意味着所有参数必须在解析时已知。

换句话说， **_解析时关键字不允许使用变量参数_** 。

但是，Nushell 创建了一些方便的*常量*，可用于帮助识别常见的文件位置。例如，你可以使用以下命令从默认配置目录中加载文件：

```nu
source ($nu.default-config-dir | path join "myfile.nu")
```

因为常量值在解析时已知，所以它可以与 `source` 和 `use` 等解析时关键字一起使用。

:::tip 另请参阅
有关此过程的更多详细信息，请参阅[解析时常量求值](./how_nushell_code_gets_run.md#解析时常量求值)。
:::

#### `$nu` 常量

要查看内置 Nushell 常量的列表，请使用 `$nu`（包括美元符号）检查记录常量。

#### `NU_LIB_DIRS` 常量

`NU_LIB_DIRS` _常量_ 列出了 `source`、`use` 和 `overlay use` 搜索文件的目录。默认情况下，它包含配置目录下的 `scripts` 目录和 `$nu.data-dir` 下的 `completions` 目录。`$env.NU_LIB_DIRS` 环境变量以相同的列表起始且仍受支持，但常量是配置搜索路径的首选方式，因为与 `$env.NU_LIB_DIRS` 不同，它可以在 `config.nu` 中定义*和*使用。例如：

```nu
# 定义模块和源搜索路径
const NU_LIB_DIRS = [
  '~/myscripts'
]
# 从 ~/myscripts 目录加载 myscript.nu
source myscript.nu
```

如果同时定义了变量 `$env.NU_LIB_DIRS` 和常量 `NU_LIB_DIRS`，则将搜索两组路径。常量 `NU_LIB_DIRS` 将*首先*被搜索并具有优先权。如果在这些目录中找到匹配名称的文件，搜索将停止。否则，它将继续进入 `$env.NU_LIB_DIRS` 搜索路径。

#### `NU_PLUGIN_DIRS` 常量

`const NU_PLUGIN_DIRS` 对插件搜索路径的作用方式相同。

以下 `NU_PLUGIN_DIRS` 配置将允许从以下位置加载插件：

- `nu` 可执行文件所在的目录。这通常是发布包中插件所在的位置。
- `$nu.data-dir` 中以正在运行的 Nushell 版本命名的目录（例如 `0.116.0`）。
- 包含你的 `config.nu`（`$nu.config-path`）的目录中的 `plugins` 目录。

```nu
const NU_PLUGIN_DIRS = [
  ($nu.current-exe | path dirname)
  ($nu.data-dir | path join 'plugins' | path join (version).version)
  ($nu.config-path | path dirname | path join 'plugins')
]
```

### 颜色、主题和语法高亮

你可以在[相关章节](coloring_and_theming.md)中了解有关设置颜色和主题的更多信息。

### 将 Nu 配置为登录 Shell

登录 shell 通常负责设置某些将由子 shell 和其他进程继承的环境变量。将 Nushell 设置为用户的默认登录 shell 时，你需要确保 `login.nu` 处理此任务。

许多应用程序会假定 POSIX 或 PowerShell 登录 shell，并提供修改由 POSIX 登录 shell 加载的系统或用户 `profile`（或 PowerShell 系统上的 `.ps1` 文件）的说明。

正如你现在可能已经注意到的，Nushell 不是 POSIX shell，也不是 PowerShell，它无法处理为这些 shell 编写的配置文件。你需要改为在 `login.nu` 中设置这些值。

要查找可能需要通过 `login.nu` 设置的环境变量，请通过从你以前的登录 shell 中运行 `nu` 来检查从登录 shell 继承的环境。运行：

```nu
$env | reject config | transpose key val | each {|r| echo $"$env.($r.key) = '($r.val)'"} | str join (char nl)
```

查找第三方应用程序可能需要的任何值，并将这些值复制到你的 `login.nu` 中。其中许多值将不需要。例如，`PS1` 设置是 POSIX shell 中的当前提示符，在 Nushell 中将无用。

准备好后，将 Nushell 添加到你的 `/etc/shells` (Unix) 并 `chsh`，如[安装章节](./default_shell.md)中所述。

### macOS: 保持 `/usr/bin/open` 为 `open`

某些工具（如 Emacs）依赖于 [`open`](/commands/docs/open.md) 命令在 Mac 上打开文件。

由于 Nushell 有自己的 [`open`](/commands/docs/open.md) 命令，其含义不同，它会遮蔽（覆盖）`/usr/bin/open`，因此这些工具在尝试使用该命令时会产生错误。

解决此问题的一种方法是为 Nushell 的 [`open`](/commands/docs/open.md) 定义一个自定义命令，并在你的 `config.nu` 文件中为系统的 [`open`](/commands/docs/open.md) 创建一个别名，如下所示：

```nu
alias nu-open = open
alias open = ^open
```

将此行放入你的 `config.nu` 中以使其永久生效。

`^` 符号告诉 Nushell 将以下命令作为*外部*命令运行，而不是作为 Nushell 内置命令。运行这些命令后，`nu-open` 将是 Nushell *内部*版本，而 `open` 别名将调用 Mac 的外部 `open`。你也可以使用 `%` 符号来访问内置命令，例如 `%open`，即使别名遮蔽了它。

有关更多信息，请参阅[运行系统（外部）命令](./running_externals.md)。

## 详细的配置启动过程

本节包含有关如何使用不同的配置（和标志）选项来更改 Nushell 启动行为的更详细描述。

### 启动阶段

以下阶段及其步骤*可能*在启动期间发生，具体取决于传递给 `nu` 的标志。有关每个标志如何影响该过程，请参阅紧随此表之后的[标志行为](#标志行为)：

| 步骤 | 阶段                        | Nushell 操作                                                                                                                                                                                                                                                                                            |
| ---- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0.   | (杂项)                      | 通过其内部 Rust 实现设置内部默认值。实际上，这可能要到“首次使用”该设置或变量时才会发生，但对于控制 Nushell 行为的大多数（但不是所有）设置和变量，通常都会有一个 Rust 默认值。这些默认值随后可以被以下步骤取代。                                                                                         |
| 1.   | (主要)                      | 处理命令行参数，例如 `--plugin-config <file>`、`--plugins <list>`、`--experimental-options <list>` 等。完整列表参见 `nu --help`。                                                                                                                                                                       |
| 2.   | (主要)                      | 获取配置目录。这取决于操作系统（参见 [dirs::config_dir](https://docs.rs/dirs/latest/dirs/fn.config_dir.html)），但可以在所有平台上使用 `XDG_CONFIG_HOME` 覆盖（如[上文](#更改默认目录)所述），或使用 `--config-home <path>` 标志。                                                                      |
| 3.   | (主要)                      | 获取 `env.nu` 和 `config.nu` 的路径。默认情况下，它们位于配置目录中，但可以使用 `--env-config <path>` 和 `--config <path>` 标志覆盖其中一个或两者。数据目录、自动加载目录和插件注册表文件也在此时确定。                                                                                                 |
| 4.   | (主要)                      | 创建初始的 `$env.NU_PLUGIN_DIRS` 变量。默认情况下，它是一个空列表。                                                                                                                                                                                                                                     |
| 5.   | (主要)                      | 创建初始的 `$NU_PLUGIN_DIRS` 常量。默认情况下，它包括（1）配置目录下的 `plugins` 目录，以及（2）当前运行的 `nu`/`nu.exe` 所在的目录。                                                                                                                                                                   |
| 6.   | (主要)                      | 初始化内存中的 SQLite 数据库。这使得 `stor` 系列命令可以在随后的配置文件中使用。                                                                                                                                                                                                                        |
| 7.   | (主要)                      | 从内部默认值加载初始的 `$env.config` 值，并将 `$env.ENV_CONVERSIONS` 设置为空记录。                                                                                                                                                                                                                     |
| 8.   | (主要)                      | 从调用进程继承其初始环境。它们最初会被转换为 Nushell 字符串，但稍后可以使用 `ENV_CONVERSIONS`（见上文）转换为其他结构。                                                                                                                                                                                 |
| 9.   | (主要)                      | 将搜索路径（`PATH`，Windows 上为 `Path`）从继承的 `string` 转换为 Nushell `list`。                                                                                                                                                                                                                      |
| 10.  | (主要)                      | 创建初始的 `$env.NU_LIB_DIRS` 变量和 `$NU_LIB_DIRS` 常量，两者使用相同的列表：（1）继承的 `NU_LIB_DIRS` 环境变量中的任何目录，（2）使用 `--include-path (-I)` 标志给出的任何目录，然后（3）配置目录下的 `scripts` 目录，以及（4）数据目录（`$nu.data-dir`）下的 `completions`。这些目录默认不会被创建。 |
| 11.  | (stdlib)                    | 将[标准库](./standard_library.md)和 `std-rfc` 加载到虚拟文件系统中。此时它不会被解析或求值。                                                                                                                                                                                                            |
| 12.  | (stdlib)                    | 解析并求值 `std/prelude`，这将 `banner` 和 `pwd` 命令带入作用域。                                                                                                                                                                                                                                       |
| 13.  | (主要)                      | 生成初始的 [`$nu` 记录常量](#使用常量)，以便可以在以下配置文件中使用 `$nu.default-config-dir` 等项。                                                                                                                                                                                                    |
| 14.  | (主要)                      | 加载使用 `--plugins` 标志指定的任何插件。                                                                                                                                                                                                                                                               |
| 15.  | (repl)                      | 设置几个仅在 REPL 中生效的默认环境变量（与提示符相关的以及 `SHLVL`）。请注意，使用闭包的与提示符相关的变量在 `default_env.nu` 中设置。                                                                                                                                                                  |
| 16.  | (配置文件) (插件)           | 处理用户的 `plugin.msgpackz`（位于配置目录中）中的签名，以便可以在以下配置文件中使用已添加的插件。                                                                                                                                                                                                      |
| 17.  | (配置文件)                  | 如果这是 Nushell 首次启动，则创建配置目录。“首次启动”取决于配置目录是否存在。                                                                                                                                                                                                                           |
| 18.  | (配置文件)                  | 同样，如果这是 Nushell 首次启动，则在该目录中创建一个基本上为空的（除了一些注释）`env.nu` 和 `config.nu`。                                                                                                                                                                                              |
| 19.  | (配置文件) (default_env.nu) | 从内部 `default_env.nu` 加载默认环境变量。可以使用以下命令查看此文件：`config env --default \| nu-highlight \| less -R`。                                                                                                                                                                               |
| 20.  | (配置文件) (env.nu)         | 加载（解析并求值）用户的 `env.nu`（其路径已在上面确定）。                                                                                                                                                                                                                                               |
| 21.  | (配置文件) (config.nu)      | 加载内部的 `default_config.nu`，它本质上是空的，因为所有 `$env.config` 设置的默认值现在都内置于 Nushell 中（步骤 7）。可以使用以下命令查看此文件：`config nu --default \| nu-highlight \| less -R`。                                                                                                    |
| 22.  | (配置文件) (config.nu)      | 加载（解析并求值）用户的 `config.nu`（其路径已在上面确定）。                                                                                                                                                                                                                                            |
| 23.  | (配置文件) (login)          | 当 Nushell 作为登录 shell 运行时，加载用户的 `login.nu`。                                                                                                                                                                                                                                               |
| 24.  | (配置文件)                  | 循环遍历供应商自动加载目录并加载找到的任何 `.nu` 文件。目录按 `$nu.vendor-autoload-dirs` 中的顺序处理，这些目录中的文件按字母顺序处理。                                                                                                                                                                 |
| 25.  | (配置文件)                  | 循环遍历用户自动加载目录并加载找到的任何 `.nu` 文件。目录按 `$nu.user-autoload-dirs` 中的顺序处理，这些目录中的文件按字母顺序处理。                                                                                                                                                                     |
| 26.  | (repl)                      | 运行使用 `--execute (-e)` 标志给出的命令（如果有）。                                                                                                                                                                                                                                                    |
| 27.  | (repl)                      | 设置行编辑器和命令历史。从此时起，`history.file_format`、`history.max_size`、`history.isolation` 和 `history.path` 设置不能再更改。                                                                                                                                                                     |
| 28.  | (repl) 和 (stdlib)          | 如果已配置，则显示欢迎横幅。                                                                                                                                                                                                                                                                            |
| 29.  | (repl)                      | 运行 `env_change` 和 `pre_prompt` [钩子](./hooks.md)并渲染提示符。此时 `$nu.startup-time` 是最终值，如果已配置，则显示横幅中的启动时间行。                                                                                                                                                              |
| 30.  | (repl)                      | Nushell 进入正常的命令行（REPL）。                                                                                                                                                                                                                                                                      |

### 标志行为

| 模式         | 命令/标志                                  | 行为                                                                                                                                                                                                                                                      |
| ------------ | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 普通 Shell   | `nu` (无标志)                              | 除标记为 **_(login)_** 的所有启动步骤都会发生。                                                                                                                                                                                                           |
| 登录 Shell   | `nu --login/-l`                            | 所有启动步骤都会发生。                                                                                                                                                                                                                                    |
| 命令字符串   | `nu --commands <command-string>` (或 `-c`) | 除标记为 **_(config files)_** 或 **_(repl)_** 的所有启动阶段都会发生。但是，不过，**_(default_env.nu)_** 和 **_(plugin)_** 会发生，因此可以在命令字符串中使用插件。若加上 `--login/-l`，**_(env.nu)_**、**_(config.nu)_** 和 **_(login)_** 步骤也会发生。 |
| 脚本文件     | `nu <script_file>`                         | 与命令字符串相同。                                                                                                                                                                                                                                        |
| 无配置       | `nu -n`                                    | 无论其他标志如何，**_(config files)_** 阶段都**不会**发生。                                                                                                                                                                                               |
| 无标准库     | `nu --no-std-lib`                          | 无论其他标志如何，标记为 **_(stdlib)_** 的步骤都**不会**发生。                                                                                                                                                                                            |
| 强制配置文件 | `nu --config <file>`                       | 强制上面标记为 **_(config.nu)_** 的步骤使用提供的配置 `<file>` 运行，除非还指定了 `-n`                                                                                                                                                                    |
| 强制环境文件 | `nu --env-config <file>`                   | 强制上面标记为 **_(default_env.nu)_** 和 **_(env.nu)_** 的步骤使用指定的环境 `<file>` 运行，除非还指定了 `-n`                                                                                                                                             |

### 场景

- `nu`:

  - ✅ 使标准库可用
  - ✅ 如果存在于配置目录中，则读取用户的 `plugin.msgpackz` 文件
  - ✅ 在内部加载 `default_env.nu` 文件
  - ✅ 如果存在于配置目录中，则加载用户的 `env.nu` 文件
  - ✅ 在内部加载 `default_config.nu` 文件
  - ✅ 如果存在于配置目录中，则加载用户的 `config.nu` 文件
  - ❌ 不读取个人 `login.nu` 文件
  - ✅ 加载 `vendor-autoload-dirs` 中的文件
  - ✅ 加载 `user-autoload-dirs` 中的文件
  - ✅ 进入 REPL

- `nu -c "ls"`:

  - ✅ 使标准库可用
  - ✅ 如果存在于配置目录中，则读取用户的 `plugin.msgpackz` 文件
  - ✅ 在内部加载 `default_env.nu` 文件
  - ❌ 不加载用户的 `env.nu`
  - ❌ 不读取内部 `default_config.nu` 文件
  - ❌ 不读取用户的 `config.nu` 文件
  - ❌ 不读取用户的 `login.nu` 文件
  - ✅ 运行 `ls` 命令并退出
  - ❌ 不进入 REPL
  - ❌ 不加载 `vendor-autoload-dirs` 中的文件
  - ❌ 不加载 `user-autoload-dirs` 中的文件

- `nu -l -c "ls"`:

  - ✅ 使标准库可用
  - ✅ 如果存在于配置目录中，则读取用户的 `plugin.msgpackz` 文件
  - ✅ 在内部加载 `default_env.nu` 文件
  - ✅ 如果存在于配置目录中，则加载用户的 `env.nu` 文件
  - ✅ 在内部加载 `default_config.nu` 文件
  - ✅ 如果存在于配置目录中，则加载用户的 `config.nu` 文件
  - ✅ 如果存在于配置目录中，则加载用户的 `login.nu` 文件
  - ✅ 运行 `ls` 命令并退出
  - ❌ 不进入 REPL
  - ❌ 不加载 `vendor-autoload-dirs` 中的文件
  - ❌ 不加载 `user-autoload-dirs` 中的文件

- `nu -l -c "ls" --config foo_config.nu`

  - 与上面相同，但会读取名为 `foo_config.nu` 的备用配置文件，而非用户的 `config.nu`。像这样的相对路径是相对于**当前目录**解析的，而不是配置目录

- `nu -n -l -c "ls"`:

  - ✅ 使标准库可用
  - ❌ 不读取用户的 `plugin.msgpackz`
  - ❌ 不读取内部 `default_env.nu`
  - ❌ 不加载用户的 `env.nu`
  - ❌ 不读取内部 `default_config.nu` 文件
  - ❌ 不读取用户的 `config.nu` 文件
  - ❌ 不读取用户的 `login.nu` 文件
  - ✅ 运行 `ls` 命令并退出
  - ❌ 不进入 REPL
  - ❌ 不加载 `vendor-autoload-dirs` 中的文件
  - ❌ 不加载 `user-autoload-dirs` 中的文件

- `nu test.nu`:

  - ✅ 使标准库可用
  - ✅ 如果存在于配置目录中，则读取用户的 `plugin.msgpackz` 文件
  - ✅ 在内部加载 `default_env.nu` 文件
  - ❌ 不加载用户的 `env.nu`
  - ❌ 不读取内部 `default_config.nu` 文件
  - ❌ 不读取用户的 `config.nu` 文件
  - ❌ 不读取用户的 `login.nu` 文件
  - ✅ 作为脚本运行 `test.nu` 文件
  - ❌ 不进入 REPL
  - ❌ 不加载 `vendor-autoload-dirs` 中的文件
  - ❌ 不加载 `user-autoload-dirs` 中的文件

- `nu --config foo_config.nu test.nu`

  - ✅ 使标准库可用
  - ✅ 如果存在于配置目录中，则读取用户的 `plugin.msgpackz` 文件
  - ✅ 在内部加载 `default_env.nu` 文件
  - ❌ 不加载用户的 `env.nu`（未指定 `--env-config`）
  - ✅ 在内部加载 `default_config.nu` 文件。请注意，`default_config.nu` 总是在用户配置之前处理
  - ✅ 加载当前目录中的 `foo_config.nu`，而不是用户的 `config.nu`
  - ❌ 不读取用户的 `login.nu` 文件
  - ✅ 作为脚本运行 `test.nu` 文件
  - ❌ 不进入 REPL
  - ❌ 不加载 `vendor-autoload-dirs` 中的文件
  - ❌ 不加载 `user-autoload-dirs` 中的文件

- `nu -n --no-std-lib` (最快的 REPL 启动):

  - ❌ 不使标准库可用
  - ❌ 不读取用户的 `plugin.msgpackz`
  - ❌ 不读取内部 `default_env.nu`
  - ❌ 不加载用户的 `env.nu`
  - ❌ 不读取内部 `default_config.nu` 文件
  - ❌ 不读取用户的 `config.nu` 文件
  - ❌ 不读取用户的 `login.nu` 文件
  - ❌ 不加载 `vendor-autoload-dirs` 中的文件
  - ❌ 不加载 `user-autoload-dirs` 中的文件
  - ✅ 进入 REPL

- `nu -n --no-std-lib -c "ls"` (最快的命令字符串调用):

  - ❌ 不使标准库可用
  - ❌ 不读取用户的 `plugin.msgpackz`
  - ❌ 不读取内部 `default_env.nu`
  - ❌ 不加载用户的 `env.nu`
  - ❌ 不读取内部 `default_config.nu` 文件
  - ❌ 不读取用户的 `config.nu` 文件
  - ❌ 不读取用户的 `login.nu` 文件
  - ✅ 运行 `ls` 命令并退出
  - ❌ 不进入 REPL
  - ❌ 不加载 `vendor-autoload-dirs` 中的文件
  - ❌ 不加载 `user-autoload-dirs` 中的文件
