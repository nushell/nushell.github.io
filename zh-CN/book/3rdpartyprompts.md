# 如何配置第三方提示

## Nerd Fonts

Nerd Fonts 并非必需，但它们可以通过额外的字形和图标来改善提示符的显示效果。

> Nerd Fonts 为面向开发人员的字体提供了大量的字形（图标）。
> 特别是，它从流行的“图标字体”（如 Font Awesome、Devicons、Octicons 等）中添加了大量额外的字形。

- [Nerd Fonts 网站](https://www.nerdfonts.com)
- [源仓库](https://github.com/ryanoasis/nerd-fonts)

## oh-my-posh

[网站](https://ohmyposh.dev/)

[仓库](https://github.com/JanDeDobbeleer/oh-my-posh)

如果你喜欢 [oh-my-posh](https://ohmyposh.dev/)，可以通过以下几个步骤在 Nushell 里使用 oh-my-posh，它与 Nushell 一起配合得很好。在 Nushell 里设置 oh-my-posh 的步骤：

1. 按照[指南](https://ohmyposh.dev/docs/installation/linux)安装 Oh My Posh。
2. 下载并安装一个 [nerd font](https://github.com/ryanoasis/nerd-fonts)。
3. 生成 `.oh-my-posh.nu` 文件。默认情况下，它将生成到你的主目录。你可以使用 `--config` 来指定一个主题，否则，oh-my-posh 会使用一个默认主题。
4. 通过在 `~/.config/nushell/config.nu`（或由 `$nu.config-path` 输出的路径）中添加 `source ~/.oh-my-posh.nu` 来初始化 oh-my-posh 提示符。

```nu
# 生成 .oh-my-posh.nu 文件
oh-my-posh init nu --config ~/.poshthemes/M365Princess.omp.json

# 在你的 config.nu 文件中添加此行，以便在 shell 启动时初始化 oh-my-posh.nu
source ~/.oh-my-posh.nu
```

MacOS 用户配置步骤：

1. 你可以通过`brew`安装`oh-my-posh`，可以参考这里的 [指南](https://ohmyposh.dev/docs/installation/macos)；
2. 下载并安装一个 [nerd font](https://github.com/ryanoasis/nerd-fonts)；
3. 在`$nu.config-path`输出的文件中设置`PROMPT_COMMAND`，可以参考下面的代码片段：

```nu
let posh_dir = (brew --prefix oh-my-posh | str trim)
let posh_theme = $'($posh_dir)/share/oh-my-posh/themes/'
# Change the theme names to: zash/space/robbyrussel/powerline/powerlevel10k_lean/
# material/half-life/lambda Or double lines theme: amro/pure/spaceship, etc.
# For more [Themes demo](https://ohmyposh.dev/docs/themes)
$env.PROMPT_COMMAND = { || oh-my-posh prompt print primary --config $'($posh_theme)/zash.omp.json' }
# Optional
$env.PROMPT_INDICATOR = $"(ansi y)$> (ansi reset)"
```

## Starship

[网站](https://starship.rs/)

[仓库](https://github.com/starship/starship)

1. 参照上面的链接，安装 Starship。
2. 根据你的喜好，安装 nerdfonts。
3. 使用下面的配置示例，请确保设置`STARSHIP_SHELL`环境变量。

::: tip
另一种启用 Starship 的方法在 [Starship 快速安装](https://starship.rs/#nushell)说明中有描述。

以上链接是 Starship 和 Nushell 的官方集成，也是让 Starship 运行起来的最简单方法，无需任何手动操作：

- Starship 将创建自己的配置/环境设置脚本
- 你只需在 `env.nu` 中创建它，并在 `config.nu` 中 `use` 它

:::

下面是一个关于 Starship 的配置示例：

```nu
$env.STARSHIP_SHELL = "nu"

def create_left_prompt [] {
    starship prompt --cmd-duration $env.CMD_DURATION_MS $'--status=($env.LAST_EXIT_CODE)'
}

# Use nushell functions to define your right and left prompt
$env.PROMPT_COMMAND = { || create_left_prompt }
$env.PROMPT_COMMAND_RIGHT = ""

# The prompt indicators are environmental variables that represent
# the state of the prompt
$env.PROMPT_INDICATOR = ""
$env.PROMPT_INDICATOR_VI_INSERT = ": "
$env.PROMPT_INDICATOR_VI_NORMAL = "〉"
$env.PROMPT_MULTILINE_INDICATOR = "::: "
```

然后重启 Nushell：

```
nushell on 📙 main is 📦 v0.60.0 via 🦀 v1.59.0
❯
```

## Purs

[仓库](https://github.com/xcambar/purs)
