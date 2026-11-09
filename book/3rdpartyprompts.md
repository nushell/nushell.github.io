# How to Configure 3rd Party Prompts

## Nerd Fonts

Nerd Fonts are not required, but they can improve the prompt presentation through additional glyphs and iconography.

> Nerd Fonts patches developer targeted fonts with a high number of glyphs (icons).
> Specifically to add a high number of extra glyphs from popular ‘iconic fonts’ such as Font Awesome, Devicons, Octicons, and others.

- [Nerd Fonts website](https://www.nerdfonts.com)
- [Source Repository](https://github.com/ryanoasis/nerd-fonts)

## oh-my-posh

[site](https://ohmyposh.dev/)

[repo](https://github.com/JanDeDobbeleer/oh-my-posh)

If you like [oh-my-posh](https://ohmyposh.dev/), you can use oh-my-posh with Nushell with a few steps. It works great with Nushell. How to setup oh-my-posh with Nushell:

1. Install Oh My Posh and download oh-my-posh's themes following [guide](https://ohmyposh.dev/docs/installation/linux).
2. Download and install a [nerd font](https://github.com/ryanoasis/nerd-fonts).
3. Add `oh-my-posh init nu` to the end of your config.nu (the path output by `$nu.config-path`). You can use `--config` to specify a theme, otherwise, oh-my-posh comes with a default theme.

```nu
# Initialize oh-my-posh at shell startup by adding this line at the end of your config.nu file
oh-my-posh init nu --config ~/.poshthemes/M365Princess.omp.json
```

Each time Nushell starts, this writes oh-my-posh's initialization script (`oh-my-posh.nu`) into a Nushell [vendor autoload directory](configuration.md#configuration-overview), which Nushell loads after `config.nu` (and `login.nu`).

For MacOS users:

1. You can install oh-my-posh using `brew`, just following the [guide here](https://ohmyposh.dev/docs/installation/macos)
2. Download and install a [nerd font](https://github.com/ryanoasis/nerd-fonts).
3. Set the PROMPT_COMMAND in the file output by `$nu.config-path`, here is a code snippet:

```nu
let posh_dir = (brew --prefix oh-my-posh | str trim)
let posh_theme = $'($posh_dir)/share/oh-my-posh/themes/'
# Change the theme names to: zash/space/robbyrussell/powerline/powerlevel10k_lean/
# material/half-life/lambda Or double lines theme: amro/pure/spaceship, etc.
# For more [Themes demo](https://ohmyposh.dev/docs/themes)
$env.PROMPT_COMMAND = { || oh-my-posh print primary --config $'($posh_theme)/zash.omp.json' }
# Optional
$env.PROMPT_INDICATOR = $"(ansi y)$> (ansi reset)"
```

## Starship

[site](https://starship.rs/)

[repo](https://github.com/starship/starship)

1. Follow the links above and install Starship.
2. Install nerdfonts depending on your preferences.
3. Use the config example below. Make sure to set the `STARSHIP_SHELL` environment variable.

::: tip
An alternate way to enable Starship is described in the [Starship Quick Install](https://starship.rs/#nushell) instructions.

The link above is the official integration of Starship and Nushell and is the simplest way to get
Starship running without doing anything manual:

- Starship will create its own configuration / environment setup script
- you simply have to save it into a Nushell vendor autoload directory from your `config.nu`, and Nushell loads it automatically:

```nu
mkdir ($nu.data-dir | path join "vendor/autoload")
starship init nu | save -f ($nu.data-dir | path join "vendor/autoload/starship.nu")
```

:::

Here's an example config section for Starship:

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

Now restart Nu.

```
nushell on 📙 main is 📦 v0.116.0 via 🦀 v1.96.1
❯
```
if you have the experimental [jobs](/commands/docs/job.html) feature you can also have starship display the currently active job
```nu
def create_left_prompt [] {
    starship prompt --cmd-duration $env.CMD_DURATION_MS $'--status=($env.LAST_EXIT_CODE)' $'--jobs=(job list | length)'
}
```
## Purs

[repo](https://github.com/xcambar/purs)
