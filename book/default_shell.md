# Default Shell

## Setting Nu as default shell on your terminal

|     Terminal     | Platform     |                                                                                                                 Instructions                                                                                                                 |
| :--------------: | ------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|  GNOME Terminal  | Linux & BSDs |                                  Open `Edit > Preferences`. In the right-hand panel, select the `Command` tab, tick `Run a custom command instead of my shell`, and set `Custom command` to the path to Nu.                                  |
|  GNOME Console   | Linux & BSDs |  Type the command `gsettings set org.gnome.Console shell "['/usr/bin/nu']"` (replace `/usr/bin/nu` with the path to Nu). Equivalently, use [dconf Editor](https://apps.gnome.org/DconfEditor/) to edit the `/org/gnome/Console/shell` key.   |
|      Kitty       | Linux & BSDs |                                                     Press `Ctrl`+`Shift`+`F2` to open `kitty.conf`. Go to `shell` variable, uncomment the line and replace the `.` with the path to Nu.                                                      |
|     Konsole      | Linux & BSDs |                                                                                   Open `Settings > Edit Current Profile`. Set `Command` to the path to Nu.                                                                                   |
|  XFCE Terminal   | Linux & BSDs |                                                           Open `Edit > Preferences`. Check `Run a custom command instead of my shell`, and set `Custom command` to the path to Nu.                                                           |
|   Terminal.app   | macOS        | Open `Terminal > Preferences`. Ensure you are on the `Profiles` tab, which should be the default tab. In the right-hand panel, select the `Shell` tab. Tick `Run command`, put the path to Nu in the textbox, and untick `Run inside shell`. |
|      iTerm2      | macOS        |                       Open `iTerm > Preferences`. Select the `Profiles` tab. In the right-hand panel under `Command`, change the dropdown from `Login Shell` to `Custom Shell`, and put the path to Nu in the textbox.                       |
| Windows Terminal | Windows      |    Press `Ctrl`+`,` to open `Settings`. Go to `Add a new profile > New empty profile`. Fill in the 'Name' and enter path to Nu in the 'Command line' textbox. Go to `Startup` option and select Nu as the 'Default profile'. Hit `Save`.     |

## Setting Nu as login shell (Linux, BSD & macOS)

::: warning
Nu is still in development and is not intended to be POSIX compliant.
Be aware that some programs on your system might assume that your login shell is [POSIX](https://en.wikipedia.org/wiki/POSIX) compatible.
Breaking that assumption can lead to unexpected issues.
:::

To set the login shell you can use the [`chsh`](https://linux.die.net/man/1/chsh) command.
Some Linux distributions have a list of valid shells located in `/etc/shells` and will disallow changing the shell until Nu is in the whitelist.
You may see an error similar to the one below if you haven't updated the `shells` file:

@[code](@snippets/installation/chsh_invalid_shell_error.sh)

You can add Nu to the list of allowed shells by appending your Nu binary to the `shells` file.
The path to add can be found with the command `which nu`, usually it is `$HOME/.cargo/bin/nu`.
