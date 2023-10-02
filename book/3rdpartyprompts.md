# How to configure 3rd party prompts

## nerdfonts

nerdfonts are not required but they make the presentation much better.

[site](https://www.nerdfonts.com)

[repo](https://github.com/ryanoasis/nerd-fonts)

## oh-my-posh

[site](https://ohmyposh.dev/)

[repo](https://github.com/JanDeDobbeleer/oh-my-posh)

If you like [oh-my-posh](https://ohmyposh.dev/), you can use oh-my-posh with Nushell with a few steps. It works great with Nushell. How to setup oh-my-posh with Nushell:

1. Install Oh My Posh and download oh-my-posh's themes following [guide](https://ohmyposh.dev/docs/installation/linux).
2. Download and install a [nerd font](https://github.com/ryanoasis/nerd-fonts).
3. Generate the .oh-my-posh.nu file. By default it will be generated to your home directory. You can use `--config` to specify a theme, other wise, oh-my-posh comes with a default theme.
4. Initialize oh-my-posh prompt by adding in ~/.config/nushell/config.nu(or the path output by `$nu.config-path`) to source ~/.oh-my-posh.nu.

```nu
# Generate the .oh-my-posh.nu file
> oh-my-posh init nu --config ~/.poshthemes/M365Princess.omp.json

# Initialize oh-my-posh.nu at shell startup by adding this line in your config.nu file
> source ~/.oh-my-posh.nu
```

For MacOS users:

1. You can install oh-my-posh by `brew`, just following the [guide here](https://ohmyposh.dev/docs/installation/macos)
2. Download and install a [nerd font](https://github.com/ryanoasis/nerd-fonts).
3. Set the PROMPT_COMMAND in the file output by `$nu.config-path`, here is a code snippet:

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

[site](https://starship.rs/)

[repo](https://github.com/starship/starship)

1. Follow the links above and install Starship.
2. Install nerdfonts depending on your preferences.
3. Use the config example below. Make sure to set the `STARSHIP_SHELL` environment variable.

Here's an example config section for Starship:

```
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

Now restart Nu.

```
nushell on 📙 main is 📦 v0.60.0 via 🦀 v1.59.0
❯
```

You can learn more about configuring Starship in the [official starship configuration documentation](https://github.com/starship/starship#step-2-setup-your-shell-to-use-starship).

An alternate way to enable Starship is described in the [Starship Quick Install](https://starship.rs/#nushell) instructions.

## Purs

[repo](https://github.com/xcambar/purs)
