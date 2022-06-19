# 从 Bash 到 Nu

如果你是来自 Windows 上的`Git Bash`用户，那么你习惯的外部命令（bash、grep 等）在`nu`中默认是不可用的（除非你在 Windows 路径环境变量中明确包含了它们）。
要使这些命令在`nu`中可用，请在你的`config.nu`中添加以下一行，用`append`或`prepend`。

```bash
let-env Path = ($env.Path | prepend 'C:\Program Files\Git\usr\bin')
```

注意：本表针对 Nu 0.60.0 或更高版本。

| Bash                                 | Nu                                               | Task                                       |
| ------------------------------------ | ------------------------------------------------ | ------------------------------------------ |
| `ls`                                 | `ls`                                             | 列出当前目录中的文件                       |
| `ls <dir>`                           | `ls <dir>`                                       | 列出给定目录中的文件                       |
| `ls pattern*`                        | `ls pattern*`                                    | 列出匹配给定模式的文件                     |
| `ls -la`                             | `ls --long --all` or `ls -la`                    | 列出包含所有可用信息的文件，包括隐藏文件   |
| `ls -d */`                           | `ls \| where type == dir`                        | 列出目录                                   |
| `find . -name *.rs`                  | `ls **/*.rs`                                     | 递归地查找匹配给定模式的所有文件           |
| `find . -name Makefile \| xargs vim` | `ls \*\*/Makefile \| get name \| vim $in`        | 将值作为命令参数传递                       |
| `cd <directory>`                     | `cd <directory>`                                 | 切换到给定目录                             |
| `cd`                                 | `cd`                                             | 切换到用户主目录                           |
| `cd -`                               | `cd -`                                           | 切换到前一个目录                           |
| `mkdir <path>`                       | `mkdir <path>`                                   | 创建给定的路径                             |
| `mkdir -p <path>`                    | `mkdir <path>`                                   | 创建给定的路径，如果父目录不存在则自动创建 |
| `touch test.txt`                     | `touch test.txt`                                 | 新建文件                                   |
| `> <path>`                           | `\| save --raw <path>`                           | 保存字符串到给定文件                       |
| `>> <path>`                          | `\| save --raw --append <path>`                  | 追加字符串到给定文件                       |
| `cat <path>`                         | `open --raw <path>`                              | 显示给定文件的内容                         |
|                                      | `open <path>`                                    | 将文件作为结构化数据读取                   |
| `mv <source> <dest>`                 | `mv <source> <dest>`                             | 移动文件到新的位置                         |
| `cp <source> <dest>`                 | `cp <source> <dest>`                             | 复制文件到新的位置                         |
| `cp -r <source> <dest>`              | `cp -r <source> <dest>`                          | 递归地将目录复制到一个新的位置             |
| `rm <path>`                          | `rm <path>`                                      | 删除给定的文件                             |
|                                      | `rm -t <path>`                                   | 将给定的文件移到系统垃圾箱                 |
| `rm -rf <path>`                      | `rm -r <path>`                                   | 递归地删除给定的路径                       |
| `date -d <date>`                     | `"<date>" \| into datetime -f <format>`          | 解析日期 ([日期格式文档](https://docs.rs/chrono/0.4.15/chrono/format/strftime/index.html)) |
| `sed`                                | `str replace`                                    | 查找和替换一个字符串中的模式               |
| `grep <pattern>`                     | `where $it =~ <substring>` or `find <substring>` | 过滤包含特定字符串的字符串                 |
| `man <command>`                      | `help <command>`                                 | 获得特定命令的帮助信息                     |
|                                      | `help commands`                                  | 列出所有可用的命令                         |
|                                      | `help --find <string>`                           | 在所有可用的命令中搜索                     |
| `command1 && command2`               | `command1; command2`                             | 运行一条命令，如果成功的话，再运行第二条   |
| `stat $(which git)`                  | `stat (which git).path`                          | 使用命令输出作为其他命令的参数             |
| `echo $PATH`                         | `echo $env.PATH`                                 | 查看当前路径                               |
| `<update ~/.bashrc>`                 | `vim $nu.config-path`                            | 永久地更新 PATH                            |
| `export PATH = $PATH:/usr/other/bin` | `let-env PATH = ($env.PATH \| append /usr/other/bin)` | 临时更新 PATH                          |
| `export`                             | `echo $env`                                      | 列出当前的环境变量                         |
| `<update ~/.bashrc>`                 | `vim $nu.config-path`                            | 永久地更新环境变量                         |
| `FOO=BAR ./bin`                      | `FOO=BAR ./bin`                                  | 临时修改环境变量                           |
| `export FOO=BAR`                     | `let-env FOO = BAR`                              | 为当前会话设置环境变量                     |
| `echo $FOO`                          | `echo $env.FOO`                                  | 使用环境变量                               |
| `unset FOO`                          | `hide FOO`                                       | 取消对当前会话的环境变量设置               |
| `alias s="git status -sb"`           | `alias s = git status -sb`                       | 临时定义一个别名                           |
| `type FOO`                           | `which FOO`                                      | 显示一个命令的信息（内置、别名或可执行）   |
| `<update ~/.bashrc>`                 | `vim $nu.config-path`                            | 永久添加和编辑别名（新开Shell会话生效）    |
| `bash -c <commands>`                 | `nu -c <commands>`                               | 运行一组命令（需要0.9.1或更高版本）        |
| `bash <script file>`                 | `nu <script file>`                               | 运行一个脚本文件（需要0.9.1或更高版本）    |
| `\`                                  | `( <command> )`                                  | 当命令被 `(` 和 `)` 包裹的时候可以跨多行   |
| `pwd`                                | `$env.PWD`                                       | 显示当前目录                               |
