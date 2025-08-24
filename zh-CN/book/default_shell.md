# 默认 Shell

## 在你的终端上将 Nu 设置为默认 shell

|       终端       | 平台         |                                                                                                     说明                                                                                                     |
| :--------------: | ------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|  GNOME Terminal  | Linux & BSDs |                                     打开 `编辑 > 首选项`。在右侧面板中，选择 `命令` 选项卡，勾选 `运行自定义命令以代替我的 shell`，并将 `自定义命令` 设置为 Nu 的路径。                                      |
|  GNOME Console   | Linux & BSDs | 输入命令 `gsettings set org.gnome.Console shell "['/usr/bin/nu']"`（将 `/usr/bin/nu` 替换为 Nu 的路径）。或者，使用 [dconf 编辑器](https://apps.gnome.org/DconfEditor/) 编辑 `/org/gnome/Console/shell` 键。 |
|      Kitty       | Linux & BSDs |                                                     按 `Ctrl`+`Shift`+`F2` 打开 `kitty.conf`。转到 `shell` 变量，取消注释该行并将 `.` 替换为 Nu 的路径。                                                     |
|     Konsole      | Linux & BSDs |                                                                         打开 `设置 > 编辑当前配置文件`。将 `命令` 设置为 Nu 的路径。                                                                         |
|  XFCE Terminal   | Linux & BSDs |                                                      打开 `编辑 > 首选项`。选中 `运行自定义命令以代替我的 shell`，并将 `自定义命令` 设置为 Nu 的路径。                                                       |
|   Terminal.app   | macOS        |            打开 `终端 > 偏好设置`。确保你在 `描述文件` 选项卡上，这应该是默认选项卡。在右侧面板中，选择 `Shell` 选项卡。勾选 `运行命令`，将 Nu 的路径放入文本框中，并取消勾选 `在 shell 内运行`。            |
|      iTerm2      | macOS        |                            打开 `iTerm > 偏好设置`。选择 `描述文件` 选项卡。在右侧面板的 `命令` 下，将下拉菜单从 `登录 Shell` 更改为 `自定义 Shell`，并将 Nu 的路径放入文本框中。                            |
| Windows Terminal | Windows      |                按 `Ctrl`+`,` 打开 `设置`。转到 `添加新的配置文件 > 新建空配置文件`。填写“名称”并在“命令行”文本框中输入 Nu 的路径。转到 `启动` 选项并选择 Nu 作为“默认配置文件”。点击 `保存`。                |

## 将 Nu 设置为登录 shell (Linux, BSD & macOS)

::: warning
Nu 不打算与 POSIX 兼容。
请注意，你系统上的某些程序（或其文档）可能假定你的登录 shell 与 [POSIX](https://en.wikipedia.org/wiki/POSIX) 兼容。
打破该假设可能会导致意外问题。有关更多详细信息，请参阅[配置 - 登录 Shell](./configuration.md#configuring-nu-as-a-login-shell)。
:::

要设置登录 shell，你可以使用 [`chsh`](https://linux.die.net/man/1/chsh) 命令。
一些 Linux 发行版在 `/etc/shells` 中有一个有效 shell 的列表，并且在 Nu 被列入白名单之前将不允许更改 shell。
如果你尚未更新 `shells` 文件，你可能会看到类似下面的错误：

@[code](@snippets/installation/chsh_invalid_shell_error.sh)

你可以通过将你的 Nu 二进制文件附加到 `shells` 文件中，将 Nu 添加到允许的 shell 列表中。
要添加的路径可以通过命令 `which nu` 找到，通常是 `$HOME/.cargo/bin/nu`。
