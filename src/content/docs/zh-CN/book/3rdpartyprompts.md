# 配置第三方提示

## Nerdfonts

Nerdfonts 并不是必需的，但它们能使呈现效果更好。

[网站](https://www.nerdfonts.com)

[仓库](https://github.com/ryanoasis/nerd-fonts)

## oh-my-posh

[网站](https://ohmyposh.dev/)

[仓库](https://github.com/JanDeDobbeleer/oh-my-posh)

如果你喜欢 [oh-my-posh](https://ohmyposh.dev/)，可以通过以下几个步骤在 Nushell 里使用 oh-my-posh，它与 Nushell 一起配合得很好。在 Nushell 里设置 oh-my-posh 的步骤：

1. 安装 Oh My Posh 并按照 [指南](https://ohmyposh.dev/docs/linux#installation)下载 oh-my-posh 的主题。
2. 下载并安装一个 [Nerdfonts 字体](https://github.com/ryanoasis/nerd-fonts)。
3. 在`~/.config/nushell/config.nu`（或由`$nu.config-path`输出的路径）中设置`PROMPT_COMMAND`，将`M365Princess.mp.json`改为你喜欢的任何 [主题](https://ohmyposh.dev/docs/themes)。

```nu
> $env.PROMPT_COMMAND = { oh-my-posh --config ~/.poshthemes/M365Princess.omp.json }
```

MacOS 用户配置步骤：

1. 你可以通过`brew`安装`oh-my-posh`，可以参考这里的 [指南](https://ohmyposh.dev/docs/macos)；
2. 下载并安装一个 [Nerdfonts 字体](https://github.com/ryanoasis/nerd-fonts)；
3. 在`$nu.config-path`输出的文件中设置`PROMPT_COMMAND`，可以参考下面的代码片段：

```nu
let posh_dir = (brew --prefix oh-my-posh | str trim)
let posh_theme = $'($posh_dir)/share/oh-my-posh/themes/'
# Change the theme names to: zash/space/robbyrussel/powerline/powerlevel10k_lean/
# material/half-life/lambda Or double lines theme: amro/pure/spaceship, etc.
# For more [Themes demo](https://ohmyposh.dev/docs/themes)
$env.PROMPT_COMMAND = { oh-my-posh prompt print primary --config $'($posh_theme)/zash.omp.json' }
# Optional
$env.PROMPT_INDICATOR = $"(ansi y)$> (ansi reset)"
```

## Starship

[网站](https://starship.rs/)

[仓库](https://github.com/starship/starship)

1. 参照上面的链接，安装 Starship；
2. 根据你的喜好，安装 nerdfonts；
3. 使用下面的配置示例，请确保设置`STARSHIP_SHELL`环境变量；

下面是一个关于 Starship 的配置示例：

```nu
$env.STARSHIP_SHELL = "nu"

def create_left_prompt [] {
    starship prompt --cmd-duration $env.CMD_DURATION_MS $'--status=($env.LAST_EXIT_CODE)'
}

# Use nushell functions to define your right and left prompt
$env.PROMPT_COMMAND = { create_left_prompt }
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

你可以在 [官方 Starship 配置文档](https://github.com/starship/starship#step-2-setup-your-shell-to-use-starship)中了解更多关于配置 Starship 的信息。

另一种启用 Starship 的方法在 [Starship 快速安装](https://starship.rs/#nushell)说明中有描述。

## Purs

[仓库](https://github.com/xcambar/purs)
