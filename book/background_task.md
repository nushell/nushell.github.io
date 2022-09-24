# Background task in Nu

Currently Nushell doesn't have built-in background task management feature, but you can make it "support" background task with some tools, here are some example:

1. using a third-party task management tools, like [pueue](https://github.com/Nukesor/pueue)
2. using a terminal multiplexer, like [tmux](https://github.com/tmux/tmux/wiki) or [zellij](https://zellij.dev/)

## Using nu with pueue
Borrows the power of [pueue](https://github.com/Nukesor/pueue), it is possible to schedule background tasks to pueue, and manage those tasks (such as viewing logs, killing tasks, or getting the running status of all tasks)

Unlike terminal multiplexer, you don't need to attach to multiple tmux sessions, and get task status easily.

Here we provide a [nushell module](https://github.com/nushell/nu_scripts/tree/main/background_task) to work with pueue easiler.

Here is a setup example to make nushell "support" background task:
1. install pueue
2. run `pueued` with default config, you can refer to [start-the-daemon page](https://github.com/Nukesor/pueue/wiki/Get-started#start-the-daemon) for more information.
3. put the [job.nu](https://github.com/nushell/nu_scripts/blob/main/background_task/job.nu) file under `$env.NU_LIB_DIRS`.
4. add a line to the `$nu.config-path` file: `use job.nu`
5. restart nu.

Then you will get some commands to schedule background tasks. (e.g: `job spawn`, `job status`, `job log`)

Cons note: It spawned a fresh nushell to execute the given command, so it doesn't inherit current scope's variables, custom commands, alias definition, except env variables which can convert value to string.  Therefore, if you want to use custom commands or variables, you have to `use` or `define` them within the given block.

## Using nu with terminal multiplexer
You can choose and install a terminal multiplexer and use it.

It allows you to easily switch between multiple programs in one terminal, detach them (they continue to run in the background) and reconnect them to a different terminal.  As a result, it is very flexible and usable.
