---
next:
  text: Coming to Nu
  link: /book/coming_to_nu.md
---
# Background Jobs

Nushell currently has experimental support for thread-based background jobs.

## Spawning Jobs

Jobs can be can be spawned using [`job spawn`](/commands/docs/job_spawn.md), which receives a closure and starts its execution in a background thread, returning
an unique integer id for the spawned job:

```nu
'i am' | save status.txt

job spawn { sleep 10sec; ' inevitable' | save --append status.txt }
# => 1

open status.txt
# => i am

# wait for 10 seconds
sleep 10sec

open status.txt
# => i am inevitable
```

## Listing and Killing jobs

Active jobs can be queried with the [`job list`](/commands/docs/job_list.md) command, which returns a table with the information of the jobs which are currently executing.
Jobs can also be killed/interrupted by using the [`job kill`](/commands/docs/job_kill.md) command, which interrupts the job's thread and kills all of the job's child processes:

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

## Job suspension

On Unix targets, such as Linux and macOS, Nushell also supports suspending external commands using <kbd>Ctrl</kbd>+<kbd>Z</kbd>. When a running process is suspended, it is turned into a "frozen" background job:

```nu
long_running_process # this starts running, then Ctrl+Z is pressed
# => Job 1 is frozen

job list
# => ┏━━━┳━━━━┳━━━━━━━━┳━━━━━━━━━━━━━━━━┓
# => ┃ # ┃ id ┃  type  ┃      pids      ┃
# => ┣━━━╋━━━━╋━━━━━━━━╋━━━━━━━━━━━━━━━━┫
# => ┃ 0 ┃  1 ┃ frozen ┃ [list 1 items] ┃
# => ┗━━━┻━━━━┻━━━━━━━━┻━━━━━━━━━━━━━━━━┛
```

A frozen job can be brought back into foreground with the [`job unfreeze`](/commands/docs/job_unfreeze.md) command:

```nu
job unfreeze
# process is brought back where it stopped
```

::: tip Tip
For those familiar with other Unix shells, you can create an alias to emulate the behavior of the `fg` command:

```nu
alias fg = job unfreeze
```

:::

By default, `job unfreeze` will unfreeze the most recently frozen job. However, you can also specify the id of a specific job to unfreeze:

```nu
vim
# => Job 1 is frozen

long_running_process
# => Job 2 is frozen

job unfreeze 1
# we're back in vim
```

## Communicating between jobs

Data can be sent to a job using `job send <id>`, and the job can receive it using `job recv`:

```nu
let jobId = job spawn {
    job recv | save sent.txt
}

'hello from the main thread' | job send $jobId

sleep 1sec

open sent.txt
# => hello from the main thread
```

The main thread has a job ID of 0, so you can also send data in the other direction:

```nu
job spawn {
    sleep 1sec
    'Hello from a background job' | job send 0
}

job recv
# => Hello from a background job
```

## Exit Behavior

Unlike many other shells, Nushell jobs are **not** separate processes,
and are instead implemented as background threads.

An important side effect of this, is that all background jobs will terminate once the shell
process exits.
For this reason, Nushell has no UNIX-like `disown` command to prevent jobs from terminating once the shell exits.
To account for that, there are plans for a `job dispatch` implementation in the future,
for spawning independent background processes (see [#15201](https://github.com/nushell/nushell/issues/15193?issue=nushell%7Cnushell%7C15201) for progress).

Additionally, if the user is running an interactive Nushell session and runs
[`exit`](/commands/docs/exit.md) while there are background jobs running,
the shell will warn about them before prompting the user to confirm `exit`.
