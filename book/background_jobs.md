---
next:
  text: Coming to Nu
  link: /book/coming_to_nu.md
---

# Background Jobs

Nushell currently has experimental support for thread-based background jobs. The subcommands of [`job`](/commands/docs/job.md) start, list, and control them. `job` on its own only prints its help, which lists those subcommands.

## Spawning Jobs

Jobs can be spawned using [`job spawn`](/commands/docs/job_spawn.md), which receives a closure and starts its execution in a background thread, returning
a unique integer id for the spawned job:

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

The closure runs on a copy of the caller's variables and environment, so a change it makes, such as setting `$env.FOO`, doesn't come back. Whatever the closure returns is thrown away, and so is the output of the external commands it runs. Only [`print`](/commands/docs/print.md) reaches the terminal. If the closure fails, Nushell prints the error, unless the job was killed or the [`display_errors`](./config_reference.md#display-errors) settings hide it. A job can spawn jobs of its own.

Spawn a job with `--auto-kill` (`-k`) when it is fine to stop it without notice, such as a file watcher. [Exit Behavior](#exit-behavior) explains how `exit` treats such a job.

## Listing and Killing jobs

Active jobs can be queried with the [`job list`](/commands/docs/job_list.md) command, which returns a table with the information of the jobs which are currently executing.
Jobs can also be killed/interrupted by using the [`job kill`](/commands/docs/job_kill.md) command, which interrupts the job's thread and kills all of the job's child processes:

```nu
let id = job spawn { sleep 1day }

job list
# => ╭───┬────┬────────┬────────────────┬───────────╮
# => │ # │ id │  type  │      pids      │ auto_kill │
# => ├───┼────┼────────┼────────────────┼───────────┤
# => │ 0 │  2 │ thread │ [list 0 items] │ false     │
# => ╰───┴────┴────────┴────────────────┴───────────╯

job kill $id

job list
# => ╭────────────╮
# => │ empty list │
# => ╰────────────╯
```

The `auto_kill` column says whether the job was spawned with `--auto-kill`.

## Describing jobs

To make jobs easier to tell apart, you can give a job a description when you spawn it with `job spawn --description`, or change it later with [`job describe`](/commands/docs/job_describe.md). The description is shown in an additional `description` column of `job list`:

```nu
let id = job spawn --description "long nap" { sleep 1day }
job describe $id "longer nap"

job list
# => ╭───┬────┬────────┬────────────────┬───────────┬─────────────╮
# => │ # │ id │  type  │      pids      │ auto_kill │ description │
# => ├───┼────┼────────┼────────────────┼───────────┼─────────────┤
# => │ 0 │  3 │ thread │ [list 0 items] │ false     │ longer nap  │
# => ╰───┴────┴────────┴────────────────┴───────────┴─────────────╯

job kill $id
```

To remove a description, pass `null`, as in `job describe $id null`.

## Job suspension

On Unix targets, such as Linux and macOS, Nushell also supports suspending external commands using <kbd>Ctrl</kbd>+<kbd>Z</kbd>. When a running process is suspended, it is turned into a "frozen" background job:

```nu
^sleep 100 # this starts running, then Ctrl+Z is pressed
# => Job 4 is frozen

job list
# => ╭───┬────┬────────┬──────────────┬───────────┬─────────────╮
# => │ # │ id │  type  │     pids     │ auto_kill │ description │
# => ├───┼────┼────────┼──────────────┼───────────┼─────────────┤
# => │ 0 │  4 │ frozen │ ╭───┬──────╮ │ false     │ sleep       │
# => │   │    │        │ │ 0 │ 6337 │ │           │             │
# => │   │    │        │ ╰───┴──────╯ │           │             │
# => ╰───┴────┴────────┴──────────────┴───────────┴─────────────╯
```

A frozen job is automatically described with the name of the suspended program.

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
# => Job 5 is frozen

^sleep 100
# => Job 6 is frozen

job unfreeze 5
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

Inside a job, [`job id`](/commands/docs/job_id.md) returns that job's own ID. Outside any job, it returns `0`, the ID of the main thread. A job spawned from another job gets an ID of its own. When several jobs report back to the same receiver, `job id` lets each message say which job sent it:

```nu
for n in 1..3 {
    job spawn { {job: (job id), result: ($n * 10)} | job send 0 }
}
1..3 | each { job recv } | sort-by job
# => ╭───┬─────┬────────╮
# => │ # │ job │ result │
# => ├───┼─────┼────────┤
# => │ 0 │   1 │     10 │
# => │ 1 │   2 │     20 │
# => │ 2 │   3 │     30 │
# => ╰───┴─────┴────────╯
```

The IDs depend on how many jobs the session has started before.

Messages can carry a numeric tag with `job send --tag`. `job recv --tag` then only receives messages with that tag, leaving others in the mailbox, and `job recv --timeout` stops waiting after the given duration:

```nu
'low priority' | job send 0 --tag 2
'urgent' | job send 0 --tag 1

job recv --tag 1
# => urgent
job recv --timeout 0sec
# => low priority
```

[`job send`](/commands/docs/job_send.md) never waits for the receiver. The message goes straight into the mailbox. Sending to a job that doesn't exist is an error, such as `Job 99 not found`.

Without `--timeout`, [`job recv`](/commands/docs/job_recv.md) waits until a matching message arrives, and <kbd>Ctrl</kbd>+<kbd>C</kbd> interrupts the wait. When the timeout runs out first, it fails with `nu::shell::job::recv_timeout`. A timeout of `0sec` succeeds only when a matching message is already in the mailbox. Inside [`par-each`](/commands/docs/par-each.md), only one thread at a time can wait in `job recv`. The other threads wait for their turn in no particular order, whatever their timeouts.

To discard messages without reading them, use [`job flush`](/commands/docs/job_flush.md), which clears the whole mailbox of the current job, or only the messages with a given tag when used with `--tag`. A message that arrives while `job flush` runs may be discarded too.

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
the shell doesn't exit, and it doesn't ask for confirmation either. It prints a
`nu::shell::background_jobs_running` warning with the number of running jobs, frozen jobs included,
and returns to the prompt. Running `exit` again as the next command kills the jobs and exits; if you run any other command first, the next `exit` warns again.
Jobs started with `job spawn --auto-kill` don't count toward the warning and are killed
on exit without one. A frozen job counts even when its external command was suspended
inside an auto-kill job.

Pressing <kbd>Ctrl</kbd>+<kbd>C</kbd> at the REPL interrupts only the command running in the foreground.
Background jobs and frozen jobs keep running.

When Nushell runs a script or a command given with `nu -c`, it stops any jobs that are still running,
along with their child processes, before it exits. This also happens when the script was interrupted
with <kbd>Ctrl</kbd>+<kbd>C</kbd> and the interruption was caught.

A [`try`](./control_flow.md#try) block catches an interrupt like any other error, as
[Interrupting with Ctrl+C](./stdout_stderr_exit_codes.md#interrupting-with-ctrl-c) describes.

Calling `exit` inside a job's closure ends that job, not the shell.
