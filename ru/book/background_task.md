# Background tasks with Nu

Currently, Nushell doesn't have built-in background task management feature, but you can make it "support" background task with some tools, here are some examples:

1. Using a third-party task management tools, like [pueue](https://github.com/Nukesor/pueue)
2. Using a terminal multiplexer, like [tmux](https://github.com/tmux/tmux/wiki) or [zellij](https://zellij.dev/)

## Using nu with pueue

The module borrows the power of [pueue](https://github.com/Nukesor/pueue), it is possible to schedule background tasks to pueue, and manage those tasks (such as viewing logs, killing tasks, or getting the running status of all tasks, creating groups, pausing tasks etc etc)

Unlike terminal multiplexer, you don't need to attach to multiple tmux sessions, and get task status easily.

Here we provide a [nushell module](https://github.com/nushell/nu_scripts/tree/main/modules/background_task) that makes working with pueue easier.

Here is a setup example to make Nushell "support" background tasks:

1. Install pueue
2. run `pueued`, you can refer to [start-the-daemon page](https://github.com/Nukesor/pueue/wiki/Get-started#start-the-daemon) for more information.
3. Put the [task.nu](https://github.com/nushell/nu_scripts/blob/main/modules/background_task/task.nu) file under `$env.NU_LIB_DIRS`.
4. Add a line to the `$nu.config-path` file: `use task.nu`
5. Restart Nushell.

Then you will get some commands to schedule background tasks. (e.g: `task spawn`, `task status`, `task log`)

Cons: It spawns a new Nushell interpreter to execute every single task, so it doesn't inherit current scope's variables, custom commands, alias definition.
It only inherits environment variables whose value can be converted to a string.
Therefore, if you want to use custom commands or variables, you have to [`use`](/commands/docs/use.md) or [`def`](/commands/docs/def.md) them within the given block.

## Using nu with terminal multiplexer

You can choose and install a terminal multiplexer and use it.

It allows you to easily switch between multiple programs in one terminal, detach them (they continue to run in the background) and reconnect them to a different terminal. As a result, it is very flexible and usable.
