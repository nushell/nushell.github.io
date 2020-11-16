# 环境

Shell 中的一项常见任务是控制外部应用程序将使用的环境。 通常，环境打包并在启动时将其提供给外部应用的操作会自动完成。 但有时我们希望对应用程序得到的环境变量进行更精确的控制。

你可以通过回显 `$nu.env` 的值来查看当前将会被传递给应用的环境变量。

```
> echo $nu.env
──────────────────────────┬──────────────────────────────
 COLORTERM                │ truecolor 
 DBUS_SESSION_BUS_ADDRESS │ unix:path=/run/user/1000/bus 
 DESKTOP_SESSION          │ gnome 
 DISPLAY                  │ :1 
```

环境可以通过 Nu 的配置文件或者启动 Nu 时的环境来创建。你可以使用 [配置](configuration.md) 章节中所列出的技术永久地更新环境。

你同样可以在运行一个命令或管道时临时性地更新环境。

```
> with-env [FOO BAR] { echo $nu.env.FOO }
BAR
```

`with-env` 命令将会临时地将环境变量设为给定的值（在此，变量 "FOO" 将被设为 "BAR"）。一旦设置完成，则块将会在新的环境变量集中运行。

受 Bash 和其他 Shell 的启发，一个常用的简写也是可行的。你可以将上面的例子写为：

```
> FOO=BAR echo $nu.env.FOO
BAR
```
