# How to configure 3rd party prompts

## nerdfonts

nerdfonts are not required but they make the presentation much better.

[site](https://www.nerdfonts.com)

[repo](https://github.com/ryanoasis/nerd-fonts)

## oh-my-posh

[site](https://ohmyposh.dev/)

[repo](https://github.com/JanDeDobbeleer/oh-my-posh)

If you like [oh-my-posh](https://ohmyposh.dev/), you can use oh-my-posh with Nushell with a few steps. It works great with Nushell. How to setup oh-my-posh with Nushell:

1. Install Oh My Posh and download oh-my-posh's themes following [guide](https://ohmyposh.dev/docs/linux#installation).
2. Download and install a [nerd font](https://github.com/ryanoasis/nerd-fonts).
3. Set the PROMPT_COMMAND in ~/.config/nushell/config.nu(or the path output by `$nu.config-path`), change `M365Princess.omp.json` to whatever you like [Themes demo](https://ohmyposh.dev/docs/themes).

```shell
> let-env PROMPT_COMMAND = { oh-my-posh --config ~/.poshthemes/M365Princess.omp.json }
```

For MacOS users:

1. You can install oh-my-posh by `brew`, just following the [guide here](https://ohmyposh.dev/docs/macos)
2. Download and install a [nerd font](https://github.com/ryanoasis/nerd-fonts).
3. Set the PROMPT_COMMAND in the file output by `$nu.config-path`, here is a code snippet:

```shell
let posh-dir = (brew --prefix oh-my-posh | str trim)
let posh-theme = $'($posh-dir)/share/oh-my-posh/themes/'
# Change the theme names to: zash/space/robbyrussel/powerline/powerlevel10k_lean/
# material/half-life/lambda Or double lines theme: amro/pure/spaceship, etc.
# For more [Themes demo](https://ohmyposh.dev/docs/themes)
let-env PROMPT_COMMAND = { oh-my-posh prompt print primary --config $'($posh-theme)/zash.omp.json' }
# Optional
let-env PROMPT_INDICATOR = $"(ansi y)$> (ansi reset)"
```

## Starship

[site](https://starship.rs/)

[repo](https://github.com/starship/starship)

1. Follow the links above and install starship.
2. Install nerdfonts depending on your preferences.
3. Set the starship shell environment variable to `nu` by running this command `let-env STARSHIP_SHELL = "nu"`
4. Set the starship session key environment variable by running this command `let-env STARSHIP_SESSION_KEY = (random chars -l 16)`
5. If you want the default ticking clock with date & time on the right prompt, execute this command `hide PROMPT_COMMAND_RIGHT`
6. If you don't want the default indicator, you can run this command `let-env PROMPT_INDICATOR = " "`
7. Set starship as your left prompt with this command `let-env PROMPT_COMMAND = { starship prompt --cmd-duration $env.CMD_DURATION_MS $'--status=($env.LAST_EXIT_CODE)' | str trim }`. Note that you may not have to use `str trim` in the Nushell prompt if you disable starship's default newline setting with this entry in the starship.toml file `add_newline = false`. There have been reports that this might not play nice with Nushell prompts. We're still testing.
8. Since Nushell supports a right prompt you can also play around with starship's ability to set a right prompt. Setting the right prompt in Nushell is identical to setting the left prompt however you use `PROMPT_COMMAND_RIGHT`.

## Purs

[repo](https://github.com/xcambar/purs)
