# 从 CMD.EXE 到 Nu

此表最后更新于 Nu 0.67.0。

| CMD.EXE                              | Nu                                                                                  | 任务                                                 |
| ------------------------------------ | ----------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `ASSOC`                              |                                                                                     | 显示或修改文件扩展名关联                             |
| `BREAK`                              |                                                                                     | 触发调试器断点                                       |
| `CALL <filename.bat>`                | `<filename.bat>`                                                                    | 运行批处理程序                                       |
|                                      | `nu <filename>`                                                                     | 在新上下文中运行 nu 脚本                             |
|                                      | `source <filename>`                                                                 | 在此上下文中运行 nu 脚本                             |
|                                      | `use <filename>`                                                                    | 将 nu 脚本作为模块运行                               |
| `CD` or `CHDIR`                      | `$env.PWD`                                                                          | 获取当前工作目录                                     |
| `CD <directory>`                     | `cd <directory>`                                                                    | 更改当前目录                                         |
| `CD /D <drive:directory>`            | `cd <drive:directory>`                                                              | 更改当前目录                                         |
| `CLS`                                | `clear`                                                                             | 清除屏幕                                             |
| `COLOR`                              |                                                                                     | 设置控制台默认前景色/背景色                          |
|                                      | `ansi {flags} (code)`                                                               | 输出 ANSI 代码以更改颜色                             |
| `COPY <source> <destination>`        | `cp <source> <destination>`                                                         | 复制文件                                             |
| `COPY <file1>+<file2> <destination>` | `[<file1>, <file2>] \| each { open --raw } \| str join \| save --raw <destination>` | 将多个文件追加到一个文件中                           |
| `DATE /T`                            | `date now`                                                                          | 获取当前日期                                         |
| `DATE`                               |                                                                                     | 设置日期                                             |
| `DEL <file>` or `ERASE <file>`       | `rm <file>`                                                                         | 删除文件                                             |
| `DIR`                                | `ls`                                                                                | 列出当前目录中的文件                                 |
| `ECHO <message>`                     | `print <message>`                                                                   | 将给定值打印到标准输出                               |
| `ECHO ON`                            |                                                                                     | 将执行的命令回显到标准输出                           |
| `ENDLOCAL`                           | `export-env`                                                                        | 在调用者中更改环境                                   |
| `EXIT`                               | `exit`                                                                              | 关闭提示符或脚本                                     |
| `FOR %<var> IN (<set>) DO <command>` | `for $<var> in <set> { <command> }`                                                 | 为集合中的每个项目运行命令                           |
| `FTYPE`                              |                                                                                     | 显示或修改文件扩展名关联中使用的文件类型             |
| `GOTO`                               |                                                                                     | 跳转到标签                                           |
| `IF ERRORLEVEL <number> <command>`   | `if $env.LAST_EXIT_CODE >= <number> { <command> }`                                  | 如果最后一个命令返回的错误代码 >= 指定值，则运行命令 |
| `IF <string> EQU <string> <command>` | `if <string> == <string> { <command> }`                                             | 如果字符串匹配，则运行命令                           |
| `IF EXIST <filename> <command>`      | `if (<filename> \| path exists) { <command> }`                                      | 如果文件存在，则运行命令                             |
| `IF DEFINED <variable> <command>`    | `if '$<variable>' in (scope variables).name { <command> }`                          | 如果定义了变量，则运行命令                           |
| `MD` or `MKDIR`                      | `mkdir`                                                                             | 创建目录                                             |
| `MKLINK`                             |                                                                                     | 创建符号链接                                         |
| `MOVE`                               | `mv`                                                                                | 移动文件                                             |
| `PATH`                               | `$env.Path`                                                                         | 显示当前路径变量                                     |
| `PATH <path>;%PATH%`                 | `$env.Path = ($env.Path \| append <path>`)                                          | 编辑路径变量                                         |
| `PATH %PATH%;<path>`                 | `$env.Path = ($env.Path \| prepend <path>`)                                         | 编辑路径变量                                         |
| `PAUSE`                              | `input "Press any key to continue . . ."`                                           | 暂停脚本执行                                         |
| `PROMPT <template>`                  | `$env.PROMPT_COMMAND = { <command> }`                                               | 更改终端提示符                                       |
| `PUSHD <path>`/`POPD`                | `enter <path>`/`dexit`                                                              | 临时更改工作目录                                     |
| `REM`                                | `#`                                                                                 | 注释                                                 |
| `REN` or `RENAME`                    | `mv`                                                                                | 重命名文件                                           |
| `RD` or `RMDIR`                      | `rm`                                                                                | 删除目录                                             |
| `SET <var>=<string>`                 | `$env.<var> = <string>`                                                             | 设置环境变量                                         |
| `SETLOCAL`                           | (默认行为)                                                                          | 将环境更改本地化到脚本                               |
| `START <path>`                       | 部分由 `start <path>` 覆盖                                                          | 在系统配置的默认应用程序中打开路径                   |
| `START <internal command>`           |                                                                                     | 启动一个单独的窗口来运行指定的内部命令               |
| `START <batch file>`                 |                                                                                     | 启动一个单独的窗口来运行指定的批处理文件             |
| `TIME /T`                            | `date now \| format date "%H:%M:%S"`                                                | 获取当前时间                                         |
| `TIME`                               |                                                                                     | 设置当前时间                                         |
| `TITLE`                              |                                                                                     | 设置 cmd.exe 窗口名称                                |
| `TYPE`                               | `open --raw`                                                                        | 显示文本文件的内容                                   |
|                                      | `open`                                                                              | 将文件作为结构化数据打开                             |
| `VER`                                |                                                                                     | 显示操作系统版本                                     |
| `VERIFY`                             |                                                                                     | 验证文件写入是否发生                                 |
| `VOL`                                |                                                                                     | 显示驱动器信息                                       |

## 转发的 CMD.EXE 命令

Nu 通过 `cmd.exe` 接受并运行*一些* CMD.EXE 的内部命令。

内部命令是：`ASSOC`、`CLS`、`ECHO`、`FTYPE`、`MKLINK`、`PAUSE`、`START`、`VER`、`VOL`

这些内部命令优先于外部命令。

例如，在当前工作目录中有一个 `ver.bat` 文件，执行 `^ver` 会执行 CMD.EXE 的内部 `VER` 命令，而*不是* `ver.bat` 文件。

但是，执行 `./ver` 或 `ver.bat` *将*执行本地的 bat 文件。

请注意 Nushell有自己的[`start`命令](/zh-CN/commands/docs/start.md)且优先级更高。
你可以使用外部命令语法 `^start` 调用 CMD.EXE 的内部 `START` 命令。
