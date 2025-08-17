# 后台任务

Nushell 目前对基于线程的后台任务有实验性支持。

## 生成任务

任务可以使用 [`job spawn`](/zh-CN/commands/docs/job_spawn.md) 生成，它接收一个闭包并在后台线程中开始执行，返回一个生成的任务的唯一整数 ID：

```nu
'i am' | save status.txt

job spawn { sleep 10sec; ' inevitable' | save --append status.txt }
# => 1

open status.txt
# => i am

# 等待 10 秒
sleep 10sec

open status.txt
# => i am inevitable
```

## 列出和终止任务

可以使用 [`job list`](/zh-CN/commands/docs/job_list.md) 命令查询活动任务，该命令返回一个包含当前正在执行的任务信息的表格。
也可以使用 [`job kill`](/zh-CN/commands/docs/job_kill.md) 命令终止/中断任务，该命令会中断任务的线程并杀死任务的所有子进程：

```nu
let id = job spawn { sleep 1day }

job list
# => ┏━━━┳━━━━┳━━━━━━━━┳━━━━━━━━━━━━━━━━┓
# => ┃ # ┃ id ┃  type  ┃      pids      ┃
# => ┣━━━╋━━━━╋━━━━━━━━╋━━━━━━━━━━━━━━━━┫
# => ┃ 0 ┃  1 ┃ thread ┃ [list 0 items] ┃
# => ┗━━━┻━━━━┻━━━━━━━━┻━━━━━━━━━━━━━━━━┛

job kill $id

job list
# => ╭────────────╮
# => │ empty list │
# => ╰────────────╯
```

## 任务挂起

在 Unix 目标（如 Linux 和 macOS）上，Nushell 还支持使用 <kbd>Ctrl</kbd>+<kbd>Z</kbd> 挂起外部命令。当一个正在运行的进程被挂起时，它会变成一个“冻结”的后台任务：

```nu
long_running_process # 这开始运行，然后按下 Ctrl+Z
# => Job 1 is frozen

job list
# => ┏━━━┳━━━━┳━━━━━━━━┳━━━━━━━━━━━━━━━━┓
# => ┃ # ┃ id ┃  type  ┃      pids      ┃
# => ┣━━━╋━━━━╋━━━━━━━━╋━━━━━━━━━━━━━━━━┫
# => ┃ 0 ┃  1 ┃ frozen ┃ [list 1 items] ┃
# => ┗━━━┻━━━━┻━━━━━━━━┻━━━━━━━━━━━━━━━━┛
```

可以使用 [`job unfreeze`](/zh-CN/commands/docs/job_unfreeze.md) 命令将冻结的任务带回前台：

```nu
job unfreeze
# 进程从停止的地方恢复
```

::: tip 提示
对于熟悉其他 Unix shell 的人，你可以创建一个别名来模拟 `fg` 命令的行为：

```nu
alias fg = job unfreeze
```

:::

默认情况下，`job unfreeze` 将解冻最近冻结的任务。但是，你也可以指定要解冻的特定任务的 ID：

```nu
vim
# => Job 1 is frozen

long_running_process
# => Job 2 is frozen

job unfreeze 1
# 我们回到了 vim
```

## 任务间通信

可以使用 `job send <id>` 向任务发送数据，任务可以使用 `job recv` 接收数据：

```nu
let jobId = job spawn {
    job recv | save sent.txt
}

'hello from the main thread' | job send $jobId

sleep 1sec

open sent.txt
# => hello from the main thread
```

主线程的任务 ID 为 0，因此你也可以反向发送数据：

```nu
job spawn {
    sleep 1sec
    'Hello from a background job' | job send 0
}

job recv
# => Hello from a background job
```

## 退出行为

与许多其他 shell 不同，Nushell 任务**不是**独立的进程，
而是作为后台线程实现的。

一个重要的副作用是，一旦 shell 进程退出，所有后台任务都将终止。
因此，Nushell 没有类似 UNIX 的 `disown` 命令来防止任务在 shell 退出后终止。
为了解决这个问题，未来计划实现 `job dispatch`，
用于生成独立的后台进程（有关进展，请参阅 [#15201](https://github.com/nushell/nushell/issues/15193?issue=nushell%7Cnushell%7C15201)）。

此外，如果用户正在运行交互式 Nushell 会话并在有后台任务运行时运行
[`exit`](/zh-CN/commands/docs/exit.md)，
shell 会在提示用户确认 `exit` 之前警告他们。
