# 从 PowerShell 到 Nu

::: tip
PowerShell 管道传递的是丰富的 **.NET 对象**，支持通过 `$process.Name` 等语法直接访问属性，或者直接将对象通过管道传递给支持该对象的 cmdlet。

相比之下，Nushell 管道传递的是表格、列表和值等**结构化数据**。  
这意味着：

- 不支持 `.PropertyName` 语法访问属性
- 改用 `get column`、`select`、`$it.column` 或表格操作
- 命令始终接收可预测的结构化输入，而非字符串或 .NET 类型
  :::

## 等价命令参考：

| PowerShell                                                      | Nu                                           | 任务                               |
| --------------------------------------------------------------- | -------------------------------------------- | ---------------------------------- |
| `Get-ChildItem`                                                 | `ls`                                         | 列出当前目录中的文件               |
| `Get-ChildItem <dir>`                                           | `ls <dir>`                                   | 列出指定目录中的文件               |
| `Get-ChildItem pattern*`                                        | `ls pattern*`                                | 模式匹配文件                       |
| `Get-ChildItem -Force -File -Hidden`                            | `ls --long --all` 或 `ls -la`                | 详细列出文件（包含隐藏文件）       |
| `Get-ChildItem \| Where-Object { $_.PSIsContainer }`            | `ls \| where type == dir`                    | 仅列出目录                         |
| `Get-ChildItem -Recurse -Filter *.rs`                           | `ls **/*.rs`                                 | 递归搜索文件                       |
| `Get-ChildItem -Recurse Makefile \| Select-Object -Expand Name` | `ls **/Makefile \| get name \| vim ...$in`   | 将匹配的文件路径传递给命令         |
| `Set-Location <dir>`                                            | `cd <dir>`                                   | 切换目录                           |
| `Set-Location`                                                  | `cd`                                         | 返回主目录                         |
| `Set-Location -`                                                | `cd -`                                       | 返回上一个目录                     |
| `New-Item -ItemType Directory <path>`                           | `mkdir <path>`                               | 创建目录                           |
| `New-Item test.txt`                                             | `touch test.txt`                             | 创建文件                           |
| `command \| Out-File <path>`                                    | `out> <path>` 或 `o> <path>`                 | 保存输出到文件（原始文本）         |
| `command \| Set-Content <path>`                                 | `\| save <path>`                             | 保存输出到文件（结构化）           |
| `command \| Out-File -Append <path>`                            | `out>> <path>` 或 `o>> <path>`               | 追加输出到文件                     |
|                                                                 | `\| save --append <path>`                    | 追加结构化输出                     |
| `command \| Out-Null`                                           | `\| ignore`                                  | 丢弃输出                           |
| `cmd1 \| Tee-Object -FilePath log.txt \| cmd2`                  | `cmd1 \| tee { save log.txt } \| cmd2`       | 将输出同时保存到文件               |
| `command \| Select-Object -First 5`                             | `command \| first 5`                         | 限制输出前 N 行                    |
| `Get-Content <path>`                                            | `open --raw <path>`                          | 显示文件内容                       |
| `Move-Item <source> <dest>`                                     | `mv <source> <dest>`                         | 移动文件                           |
| `Get-ChildItem *.md \| ForEach-Object { $_.Name }`              | `ls *.md \| each { $in.name }`               | 遍历列表值                         |
| `foreach ($i in 1..10) { $i }`                                  | `for i in 1..10 { print $i }`                | 遍历指定范围                       |
| `Copy-Item <source> <dest>`                                     | `cp <source> <dest>`                         | 复制文件                           |
| `Copy-Item -Recurse <source> <dest>`                            | `cp -r <source> <dest>`                      | 递归复制目录                       |
| `Remove-Item <path>`                                            | `rm <path>`                                  | 删除文件                           |
|                                                                 | `rm -t <path>`                               | 将文件移至回收站                   |
| `Remove-Item -Recurse -Force <path>`                            | `rm -r <path>`                               | 递归删除目录                       |
| `Get-Date "<date>"`                                             | `"<date>" \| into datetime -f <format>`      | 解析日期                           |
| `"<str>" -replace 'a','b'`                                      | `str replace "a" "b"`                        | 替换子字符串                       |
| `Select-String <pattern>`                                       | `where $it =~ <pattern>` 或 `find <pattern>` | 搜索文本                           |
| `Get-Help <command>`                                            | `help <command>`                             | 查看命令帮助                       |
| `Get-Command`                                                   | `help commands`                              | 列出所有命令                       |
| `Get-Command "*<string>*"`                                      | `help --find <string>`                       | 搜索命令                           |
| `command1; if ($?) { command2 }`                                | `command1; command2`                         | 仅在第一个命令成功时运行第二个命令 |
| `/tmp/$((Get-Random))`                                          | `$"/tmp/(random int)"`                       | 字符串插值                         |
| `$env:Path`                                                     | `$env.PATH` 或 `$env.Path`                   | 显示 PATH                          |
| `$LASTEXITCODE`                                                 | `$env.LAST_EXIT_CODE`                        | 上一个外部命令的退出码             |
| `$env:PATH += ":/usr/bin"`                                      | `$env.PATH = ($env.PATH \| append /usr/bin)` | 更新 PATH（临时生效）              |
| `Get-ChildItem Env:`                                            | `$env`                                       | 列出环境变量                       |
| `$env:FOO`                                                      | `$env.FOO`                                   | 访问环境变量                       |
| `Remove-Item Env:FOO`                                           | `hide-env FOO`                               | 取消设置环境变量                   |
| `Set-Alias s "git status -sb"`                                  | `alias s = git status -sb`                   | 临时别名                           |
| `Get-Command FOO`                                               | `which FOO`                                  | 检查命令 / 别名 / 二进制文件       |
| `powershell -Command "<commands>"`                              | `nu -c <commands>`                           | 运行内联管道                       |
| `.\script.ps1`                                                  | `nu <script file>`                           | 运行脚本文件                       |
| `Get-Location` 或 `$PWD`                                        | `pwd` 或 `$env.PWD`                          | 显示当前工作目录                   |
| `Read-Host`                                                     | `let var = input`                            | 读取用户输入                       |
| `Read-Host -AsSecureString`                                     | `let secret = input -s`                      | 读取私密输入                       |

## 按 ESC 键清空命令行缓冲区

在旧版本的 PowerShell 中，支持通过按 ESC 键清空命令行缓冲区。

虽然 Nu 默认并未提供完全一致的按键行为，但你可以在 `config.nu` 中添加快捷键绑定以实现类似的功能：

```nu
$env.config.keybindings ++= [{
    name: 'esc_clear'
    modifier: 'None'
    keycode: 'Esc'
    mode: ['Emacs', 'Vi_Normal']
    event: {edit: 'Clear'}
}]
```
