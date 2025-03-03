# Background Jobs

## Spawning Jobs

Nushell currently presents experimental support for thread-based background jobs.

Jobs can be can be spawned using [`job spawn`](/commands/docs/job_spawn.md), which receives a closure and starts its execution in a background thread, returning
an unique integer id for such job:

```nu
"i am" | save status.txt

job spawn { sleep 10sec; 'inevitable' | save --append status.txt }
## => 1

open status.txt
## => i am

# wait for 10 seconds
sleep 10sec

open status.txt
## => i am inevitable
```

::: tip Note
Unlike many other shells, Nushell jobs are **not** separate processes, and are instead implemented
as background threads. An important side effect of that, is that all background jobs terminate once the shell process exits.
:::

## Listing and Killing jobs

Active jobs can be queried with the [`job list`](/commands/docs/job_list.md) command, which returns a table with the information of the jobs which are currently executing.
Jobs can also be kiled/interrupted by using the [`job kill`](/commands/docs/job_kill.md) command, which interrupts the job's thread and kills all of the job's child processes:

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

## Unix Ctrl-Z

In unix targets (namely Linux and MacOS), Nushell's background job support also integrates with the Ctrl-Z feature
of terminals (more specifically, the `SIGTSTP` signal), which allows users to suspend foreground processes into background jobs.
When a running process is suspended, it is turned into a background job of type `frozen`. A frozen job can be reanimated into foreground with the
[`job unfreeze`](/commands/docs/job_unfreeze.md) command.

```
long_running_process
# (Ctrl-Z is pressed)

job list
# => ┏━━━┳━━━━┳━━━━━━━━┳━━━━━━━━━━━━━━━━┓
# => ┃ # ┃ id ┃  type  ┃      pids      ┃
# => ┣━━━╋━━━━╋━━━━━━━━╋━━━━━━━━━━━━━━━━┫
# => ┃ 0 ┃  1 ┃ frozen ┃ [list 0 items] ┃
# => ┗━━━┻━━━━┻━━━━━━━━┻━━━━━━━━━━━━━━━━┛

job unfreeze 1
# (process is brought back where it stopped)
```

If no job id is provided to `job unfreeze`, it will unfreeze the job id of the most recently frozen job.
Therefore, one can use `alias fg = job unfreeze` to achieve a behavior similar to the one of existing unix shells.
