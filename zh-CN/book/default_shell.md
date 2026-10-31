# 默认 Shell

## 在你的终端上将 Nu 设置为默认 shell

|       终端       | 平台         |                                                                                                        说明                                                                                                        |
| :--------------: | ------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|  GNOME Terminal  | Linux & BSDs |                               打开 `Edit > Preferences`。在右侧面板中选择 `Command` 选项卡，勾选 `Run a custom command instead of my shell`，并把 `Custom command` 设为 Nu 的路径。                                |
|  GNOME Console   | Linux & BSDs | 输入命令 `gsettings set org.gnome.Console shell "['/usr/bin/nu']"`（把 `/usr/bin/nu` 替换为 Nu 的路径）。同样地，也可以用 [dconf Editor](https://apps.gnome.org/DconfEditor/) 编辑 `/org/gnome/Console/shell` 键。 |
|      Kitty       | Linux & BSDs |                                                       按 `Ctrl`+`Shift`+`F2` 打开 `kitty.conf`。找到 `shell` 变量，取消该行的注释并把 `.` 替换为 Nu 的路径。                                                       |
|     Konsole      | Linux & BSDs |                                                                       打开 `Settings > Edit Current Profile`。把 `Command` 设为 Nu 的路径。                                                                        |
|  XFCE Terminal   | Linux & BSDs |                                                 打开 `Edit > Preferences`。勾选 `Run a custom command instead of my shell`，并把 `Custom command` 设为 Nu 的路径。                                                 |
|     Ghostty      | Linux, macOS |                                                            打开配置文件（macOS 上按 `Cmd`+`,`，Linux 上按 `Ctrl`+`,`）。设置 `command = /path/to/nu`。                                                             |
|   Terminal.app   | macOS        |         打开 `Terminal > Preferences`。确保你位于 `Profiles` 选项卡（它应该是默认选项卡）。在右侧面板中选择 `Shell` 选项卡。勾选 `Run command`，在文本框中填入 Nu 的路径，并取消勾选 `Run inside shell`。          |
|      iTerm2      | macOS        |                            打开 `iTerm > Preferences`。选择 `Profiles` 选项卡。在右侧面板的 `Command` 下，把下拉菜单从 `Login Shell` 改为 `Custom Shell`，并在文本框中填入 Nu 的路径。                             |
| Windows Terminal | Windows      |      按 `Ctrl`+`,` 打开 `Settings`。转到 `Add a new profile > New empty profile`。填写 'Name'，并在 'Command line' 文本框中输入 Nu 的路径。转到 `Startup` 选项并选择 Nu 作为 'Default profile'。点击 `Save`。      |

## 将 Nu 设置为登录 shell（Linux、BSD 与 macOS）

::: warning
Nu 并不打算与 POSIX 兼容。
请注意，你系统上的某些程序（或其文档）可能假定你的登录 shell 与 [POSIX](https://en.wikipedia.org/wiki/POSIX) 兼容。
打破该假设可能会导致意外问题。更多细节请参见[配置 - 登录 Shell](./configuration.md#将-nu-配置为登录-shell)。
:::

要设置登录 shell，你可以使用 [`chsh`](https://linux.die.net/man/1/chsh) 命令。
一些 Linux 发行版在 `/etc/shells` 中维护了一份有效 shell 的列表，并且在 Nu 被加入白名单之前不允许更改 shell。
如果你尚未更新 `shells` 文件，你可能会看到类似下面的错误：

@[code](@snippets/installation/chsh_invalid_shell_error.sh)

你可以通过把 Nu 的二进制文件路径追加到 `shells` 文件来把 Nu 加入允许的 shell 列表。
要添加的路径可以用 `which nu` 命令找到，通常是 `$HOME/.cargo/bin/nu`。

## 将 Nu 用作 `ComSpec`（Windows）

通过“shell”运行命令的 Windows 程序会读取 `ComSpec` 环境变量，它通常指向 `cmd.exe`，并以 `<ComSpec> /c <command line>` 的形式启动它。为此，Nushell 在 Windows 上接受 `/c`（或 `/C`）：其后的整条命令行都会作为 Nushell 代码运行，并保留原始的引号。在其他平台上，`/c` 只是一个普通的路径。

::: warning
使用 `ComSpec` 的程序通常发送的是为 `cmd.exe` 编写的命令。当 `ComSpec` 指向 `nu.exe` 时，这些命令会作为 Nushell 代码运行，可能会失败或表现出不同的行为。
:::
