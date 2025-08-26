# 从 Bash 到 Nu

::: tip
如果你是来自 Windows 上的`Git Bash`用户，那么你习惯的外部命令（例如 `ln`、`grep`、`vi` 等）在`nu`中默认是不可用的（除非你已经在 Windows 路径环境变量中明确包含了它们）。
要使这些命令在`nu`中可用，请在你的`config.nu`中添加以下一行，用`append`或`prepend`。

```nu
$env.Path = ($env.Path | prepend 'C:\Program Files\Git\usr\bin')
```
:::

## 命令等价物：

| Bash                                 | Nu                                                            | 任务                                                              |
| ------------------------------------ | ------------------------------------------------------------- | ----------------------------------------------------------------- |
| `ls`                                 | `ls`                                                          | 列出当前目录中的文件                       |
| `ls <dir>`                           | `ls <dir>`                                                    | 列出给定目录中的文件                       |
| `ls pattern*`                        | `ls pattern*`                                                 | 列出匹配给定模式的文件                     |
| `ls -la`                             | `ls --long --all` or `ls -la`                                 | 列出包含所有可用信息的文件，包括隐藏文件   |
| `ls -d */`                           | `ls \| where type == dir`                                     | 列出目录                                   |
| `find . -name *.rs`                  | `ls **/*.rs`                                                  | 递归地查找匹配给定模式的所有文件           |
| `find . -name Makefile \| xargs vim` | `ls **/Makefile \| get name \| vim ...$in`                    | 将值作为命令参数传递                       |
| `cd <directory>`                     | `cd <directory>`                                              | 切换到给定目录                             |
| `cd`                                 | `cd`                                                          | 切换到用户主目录                           |
| `cd -`                               | `cd -`                                                        | 切换到前一个目录                           |
| `mkdir <path>`                       | `mkdir <path>`                                                | 创建给定的路径                             |
| `mkdir -p <path>`                    | `mkdir <path>`                                                | 创建给定的路径，如果父目录不存在则自动创建 |
| `touch test.txt`                     | `touch test.txt`                                              | 新建文件                                   |
| `> <path>`                           | `out> <path>` or `o> <path>`                                  | 保存命令输出到文件                         |
|                                      | `\| save <path>`                                              | 将命令输出作为结构化数据保存到文件         |
| `>> <path>`                          | `out>> <path>` or `o>> <path>`                                | 追加命令输出到文件                         |
|                                      | `\| save --append <path>`                                     | 将命令输出作为结构化数据追加到文件         |
| `> /dev/null`                        | `\| ignore`                                                   | 丢弃命令输出                               |
| `> /dev/null 2>&1`                   | `out+err>\| ignore` or `o+e>\| ignore`                        | 丢弃命令输出，包括 stderr                  |
| `command 2>&1 \| less`               | `command out+err>\| less` or `command o+e>\| less`            | 将外部命令的 stdout 和 stderr 通过管道传给 less（注意：内部命令的分页输出请使用 [explore](explore.html)） |
| `cmd1 \| tee log.txt \| cmd2`        | `cmd1 \| tee { save log.txt } \| cmd2`                        | 将命令输出 tee 到日志文件                  |
| `command \| head -5`                 | `command \| first 5`                                          | 将内部命令的输出限制为前 5 行（另见 `last` 和 `skip`） |
| `cat <path>`                         | `open --raw <path>`                                           | 显示给定文件的内容                         |
|                                      | `open <path>`                                                 | 将文件作为结构化数据读取                   |
| `mv <source> <dest>`                 | `mv <source> <dest>`                                          | 移动文件到新的位置                         |
| `for f in *.md; do echo $f; done`    | `ls *.md \| each { $in.name }`                                | 遍历列表并返回结果                         |
| `for i in $(seq 1 10); do echo $i; done` | `for i in 1..10 { print $i }`                             | 遍历列表并对结果运行命令                   |
| `cp <source> <dest>`                 | `cp <source> <dest>`                                          | 复制文件到新的位置                         |
| `cp -r <source> <dest>`              | `cp -r <source> <dest>`                                       | 递归地将目录复制到一个新的位置             |
| `rm <path>`                          | `rm <path>`                                                   | 删除给定的文件                             |
|                                      | `rm -t <path>`                                                | 将给定的文件移到系统垃圾箱                 |
| `rm -rf <path>`                      | `rm -r <path>`                                                | 递归地删除给定的路径                       |
| `date -d <date>`                     | `"<date>" \| into datetime -f <format>`                       | 解析日期 ([日期格式文档](https://docs.rs/chrono/0.4.15/chrono/format/strftime/index.html)) |
| `sed`                                | `str replace`                                                 | 查找和替换一个字符串中的模式               |
| `grep <pattern>`                     | `where $it =~ <substring>` or `find <substring>`              | 过滤包含特定字符串的字符串                 |
| `man <command>`                      | `help <command>`                                              | 获得特定命令的帮助信息                     |
|                                      | `help commands`                                               | 列出所有可用的命令                         |
|                                      | `help --find <string>`                                        | 在所有可用的命令中搜索                     |
| `command1 && command2`               | `command1; command2`                                          | 运行一条命令，如果成功的话，再运行第二条   |
| `stat $(which git)`                  | `stat ...(which git).path`                                    | 使用命令输出作为其他命令的参数             |
| `echo /tmp/$RANDOM`                  | `$"/tmp/(random int)"`                                        | 在字符串中使用命令输出                     |
| `cargo b --jobs=$(nproc)`            | `cargo b $"--jobs=(sys cpu \| length)"`                       | 在选项中使用命令输出                       |
| `echo $PATH`                         | `$env.PATH` (非 Windows) or `$env.Path` (Windows)             | 查看当前路径                               |
| `echo $?`                            | `$env.LAST_EXIT_CODE`                                         | 查看最后执行命令的退出状态                 |
| `<update ~/.bashrc>`                 | `vim $nu.config-path`                                         | 永久地更新 PATH                            |
| `export PATH = $PATH:/usr/other/bin` | `$env.PATH = ($env.PATH \| append /usr/other/bin)`            | 临时更新 PATH                              |
| `export`                             | `$env`                                                        | 列出当前的环境变量                         |
| `<update ~/.bashrc>`                 | `vim $nu.config-path`                                         | 永久地更新环境变量                         |
| `FOO=BAR ./bin`                      | `FOO=BAR ./bin`                                               | 临时修改环境变量                           |
| `export FOO=BAR`                     | `$env.FOO = BAR`                                              | 为当前会话设置环境变量                     |
| `echo $FOO`                          | `$env.FOO`                                                    | 使用环境变量                               |
| `echo ${FOO:-fallback}`              | `$env.FOO? \| default "ABC"`                                  | 在未设置变量时使用备用值                   |
| `unset FOO`                          | `hide-env FOO`                                                | 取消对当前会话的环境变量设置               |
| `alias s="git status -sb"`           | `alias s = git status -sb`                                    | 临时定义一个别名                           |
| `type FOO`                           | `which FOO`                                                   | 显示一个命令的信息（内置、别名或可执行）   |
| `<update ~/.bashrc>`                 | `vim $nu.config-path`                                         | 永久添加和编辑别名（新开Shell会话生效）    |
| `bash -c <commands>`                 | `nu -c <commands>`                                            | 运行一组命令                               |
| `bash <script file>`                 | `nu <script file>`                                            | 运行一个脚本文件                           |
| `\`                                  | `( <command> )`                                               | 当命令被 `(` 和 `)` 包裹的时候可以跨多行   |
| `pwd` or `echo $PWD`                 | `pwd` or `$env.PWD`                                           | 显示当前目录                               |
| `read var`                           | `let var = input`                                             | 从用户获取输入                             |
| `read -s secret`                     | `let secret = input -s`                                       | 从用户获取秘密值而不打印按键               |

## 历史替换和默认键绑定：

| Bash                                 | Nu                                                            | 任务                                                              |
| ------------------------------------ | ------------------------------------------------------------- | ----------------------------------------------------------------- |
| `!!`                                 | `!!`                                                          | 插入历史中的最后一条命令行                 |
| `!$`                                 | `!$`                                                          | 插入历史中最后一个以空格分隔的标记         |
| `!<n>` (例如, `!5`)                  | `!<n>`                                                        | 从历史记录的开头插入第 n 条命令            |
|                                      |                                                               | 提示：`history \| enumerate \| last 10` 显示最近的位置 |
| `!<-n>` (例如, `!-5`)                | `!<-n>`                                                       | 从历史记录的末尾插入第 n 条命令            |
| `!<string>` (例如, `!ls`)            | `!<string>`                                                   | 插入以该字符串开头的最近的历史项           |
| <kbd>Ctrl/Cmd</kbd>+<kbd>R</kbd>     | <kbd>Ctrl/Cmd</kbd>+<kbd>R</kbd>                              | 反向历史搜索                               |
| (Emacs 模式) <kbd>Ctrl</kbd>+<kbd>X</kbd><kbd>Ctrl</kbd>+<kbd>E</kbd> | <kbd>Ctrl/Cmd</kbd>+<kbd>O</kbd> | 在 `$env.EDITOR` 定义的编辑器中编辑命令行 |
| (Vi 命令模式) <kbd>V</kbd>       | <kbd>Ctrl/Cmd</kbd>+<kbd>O</kbd>                              | 在 `$env.EDITOR` 定义的编辑器中编辑命令行 |

大多数常见的 Emacs 模式和 Vi 模式键绑定也可用。请参阅 [Reedline 章节](line_editor.html#editing-mode)。

::: tip
在 Bash 中，历史替换在按下 <kbd>Enter</kbd> 执行命令行后立即发生。
然而，Nushell 在按下 <kbd>Enter</kbd> 后*插入*替换到命令行中。
这允许你确认替换，并在需要时在执行前进行额外的编辑。

此行为也扩展到“在编辑器中编辑命令行”。
虽然 Bash 在退出编辑器后立即执行命令，但 Nushell（像其他更现代的 shell，如 Fish 和 Zsh）将编辑器内容插入到命令行中，允许你在提交执行前查看和进行更改。
:::
