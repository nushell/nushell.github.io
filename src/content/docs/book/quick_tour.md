---
title: Quick Tour
---

The easiest way to see what Nu can do is to start with some examples, so let's dive in.

The first thing you'll notice when you run a command like [`ls`](/commands/docs/ls) is that instead of a block of text coming back, you get a structured table.

```nu
ls
╭────┬───────────────────────┬──────┬───────────┬─────────────╮
│ #  │         name          │ type │   size    │  modified   │
├────┼───────────────────────┼──────┼───────────┼─────────────┤
│  0 │ 404.html              │ file │     429 B │ 3 days ago  │
│  1 │ CONTRIBUTING       │ file │     955 B │ 8 mins ago  │
│  2 │ Gemfile               │ file │   1.1 KiB │ 3 days ago  │
│  3 │ Gemfile.lock          │ file │   6.9 KiB │ 3 days ago  │
│  4 │ LICENSE               │ file │   1.1 KiB │ 3 days ago  │
│  5 │ README             │ file │     213 B │ 3 days ago  │
```

The table does more than show the directory in a different way. Just like tables in a spreadsheet, this table allows us to work with the data more interactively.

The first thing we'll do is to sort our table by size. To do this, we'll take the output from [`ls`](/commands/docs/ls) and feed it into a command that can sort tables based on the contents of a column.

```nu
ls | sort-by size | reverse
╭────┬───────────────────────┬──────┬───────────┬─────────────╮
│ #  │         name          │ type │   size    │  modified   │
├────┼───────────────────────┼──────┼───────────┼─────────────┤
│  0 │ Gemfile.lock          │ file │   6.9 KiB │ 3 days ago  │
│  1 │ SUMMARY            │ file │   3.7 KiB │ 3 days ago  │
│  2 │ Gemfile               │ file │   1.1 KiB │ 3 days ago  │
│  3 │ LICENSE               │ file │   1.1 KiB │ 3 days ago  │
│  4 │ CONTRIBUTING       │ file │     955 B │ 9 mins ago  │
│  5 │ books              │ file │     687 B │ 3 days ago  │
```

You can see that to make this work we didn't pass commandline arguments to [`ls`](/commands/docs/ls). Instead, we used the [`sort-by`](/commands/docs/sort-by) command that Nu provides to do the sorting of the output of the [`ls`](/commands/docs/ls) command. To see the biggest files on top, we also used [`reverse`](/commands/docs/reverse).

Nu provides many commands that can work on tables. For example, we could use [`where`](/commands/docs/where) to filter the contents of the [`ls`](/commands/docs/ls) table so that it only shows files over 1 kilobyte:

```nu
ls | where size > 1kb
╭───┬───────────────────┬──────┬─────────┬────────────╮
│ # │       name        │ type │  size   │  modified  │
├───┼───────────────────┼──────┼─────────┼────────────┤
│ 0 │ Gemfile           │ file │ 1.1 KiB │ 3 days ago │
│ 1 │ Gemfile.lock      │ file │ 6.9 KiB │ 3 days ago │
│ 2 │ LICENSE           │ file │ 1.1 KiB │ 3 days ago │
│ 3 │ SUMMARY        │ file │ 3.7 KiB │ 3 days ago │
╰───┴───────────────────┴──────┴─────────┴────────────╯
```

Just as in the Unix philosophy, being able to have commands talk to each other gives us ways to mix-and-match in many different combinations. Let's look at a different command:

```nu
ps
╭─────┬───────┬───────┬──────────────────────────────────────────────┬─────────┬───────┬──────────┬──────────╮
│   # │  pid  │ ppid  │                     name                     │ status  │  cpu  │   mem    │ virtual  │
├─────┼───────┼───────┼──────────────────────────────────────────────┼─────────┼───────┼──────────┼──────────┤
│   0 │ 87194 │     1 │ mdworker_shared                              │ Sleep   │  0.00 │  25.9 MB │ 418.0 GB │
│   1 │ 87183 │  2314 │ Arc Helper (Renderer)                        │ Sleep   │  0.00 │  59.9 MB │   1.6 TB │
│   2 │ 87182 │  2314 │ Arc Helper (Renderer)                        │ Sleep   │  0.23 │ 224.3 MB │   1.6 TB │
│   3 │ 87156 │ 87105 │ Code Helper (Plugin)                         │ Sleep   │  0.00 │  56.0 MB │ 457.4 GB │
```

You may be familiar with the [`ps`](/commands/docs/ps) command if you've used Linux. With it, we can get a list of all the current processes that the system is running, what their status is, and what their name is. We can also see the CPU load for the processes.

What if we wanted to show the processes that were actively using the CPU? Just like we did with the [`ls`](/commands/docs/ls) command earlier, we can also work with the table that the [`ps`](/commands/docs/ps) command gives back to us:

```nu
ps | where cpu > 5
╭───┬───────┬───────┬─────────────────────────────────────────┬─────────┬───────┬──────────┬──────────╮
│ # │  pid  │ ppid  │                  name                   │ status  │  cpu  │   mem    │ virtual  │
├───┼───────┼───────┼─────────────────────────────────────────┼─────────┼───────┼──────────┼──────────┤
│ 0 │ 86759 │ 86275 │ nu                                      │ Running │  6.27 │  38.7 MB │ 419.7 GB │
│ 1 │ 89134 │     1 │ com.apple.Virtualization.VirtualMachine │ Running │ 23.92 │   1.5 GB │ 427.3 GB │
│ 2 │ 70414 │     1 │ VTDecoderXPCService                     │ Sleep   │ 19.04 │  17.5 MB │ 419.7 GB │
│ 3 │  2334 │     1 │ TrackpadExtension                       │ Sleep   │  7.47 │  25.3 MB │ 418.8 GB │
│ 4 │  1205 │     1 │ iTerm2                                  │ Sleep   │ 11.92 │ 657.2 MB │ 421.7 GB │
╰───┴───────┴───────┴─────────────────────────────────────────┴─────────┴───────┴──────────┴──────────╯
```

So far, we've been using [`ls`](/commands/docs/ls) and [`ps`](/commands/docs/ps) to list files and processes. Nu also offers other commands that can create tables of useful information. Next, let's explore [`date`](/commands/docs/date) and [`sys`](/commands/docs/sys).

Running [`date now`](/commands/docs/date_now) gives us information about the current day and time:

```nu
date now
Fri, 9 Feb 2024 22:32:19 -0800 (now)
```

To get the date as a table we can feed it into [`date to-table`](/commands/docs/date_to-table)

```nu
date now | date to-table
╭───┬──────┬───────┬─────┬──────┬────────┬────────┬────────────┬──────────╮
│ # │ year │ month │ day │ hour │ minute │ second │ nanosecond │ timezone │
├───┼──────┼───────┼─────┼──────┼────────┼────────┼────────────┼──────────┤
│ 0 │ 2024 │     2 │   9 │   22 │     35 │     46 │  759272000 │ -08:00   │
╰───┴──────┴───────┴─────┴──────┴────────┴────────┴────────────┴──────────╯
```

Running [`sys`](/commands/docs/sys) gives information about the system that Nu is running on:

```nu
sys
╭───────┬───────────────────╮
│ host  │ {record 8 fields} │
│ cpu   │ [table 8 rows]    │
│ disks │ [table 2 rows]    │
│ mem   │ {record 7 fields} │
│ temp  │ [table 38 rows]   │
│ net   │ [table 21 rows]   │
╰───────┴───────────────────╯
```

This is a bit different than the tables we saw before. The [`sys`](/commands/docs/sys) command gives us a table that contains structured tables in the cells instead of simple values. To take a look at this data, we need to _get_ the column to view:

```nu
sys | get host
╭─────────────────┬───────────────────────────╮
│ name            │ Darwin                    │
│ os_version      │ 14.3.1                    │
│ long_os_version │ MacOS 14.3.1              │
│ kernel_version  │ 23.3.0                    │
│ hostname        │ Johns-MacBook-Air.local   │
│ uptime          │ 3hr 9min 32sec            │
│ boot_time       │ 2024-02-09T19:27:03-08:00 │
│ sessions        │ [table 3 rows]            │
╰─────────────────┴───────────────────────────╯
```

The [`get`](/commands/docs/get) command lets us jump into the contents of a column of the table. Here, we're looking into the "host" column, which contains information about the host that Nu is running on. The name of the OS, the hostname, the CPU, and more. Let's get the name of the users on the system:

```nu
 sys | get host.sessions.name
╭───┬──────────────╮
│ 0 │ root         │
│ 1 │ jt           │
╰───┴──────────────╯
```

Right now, there's just one user on the system named "jt". You'll notice that we can pass a column path (the `host.sessions.name` part) and not just the name of the column. Nu will take the column path and go to the corresponding bit of data in the table.

You might have noticed something else that's different. Rather than having a table of data, we have just a single element: the string "jt". Nu works with both tables of data as well as strings. Strings are an important part of working with commands outside of Nu.

Let's see how strings work outside of Nu in action. We'll take our example from before and run the external [`echo`](/commands/docs/echo) command (the `^` tells Nu to not use the built-in [`echo`](/commands/docs/echo) command):

```nu
sys | get host.sessions.name | each { |it| ^echo $it }
root
jt
╭────────────╮
│ empty list │
╰────────────╯
```

If this looks very similar to what we had before, you have a keen eye! It is similar, but with one important difference: we've called `^echo` with the value we saw earlier. This allows us to pass data out of Nu into [`echo`](/commands/docs/echo) (or any command outside of Nu, like `git` for example).

### Getting Help

Help text for any of Nu's built-in commands can be discovered with the [`help`](/commands/docs/help) command. To see all commands, run [`help commands`](/commands/docs/help_commands). You can also search for a topic by doing `help -f <topic>`.

```nu
help path
* As a list of path parts, e.g., '[ / home viking spam.txt ]'. Splitting into
  parts is done by the `path split` command.

All subcommands accept all three variants as an input. Furthermore, the 'path
join' subcommand can be used to join the structured path or path parts back into
the path literal.

Usage:
  > path

Subcommands:
  path basename - Get the final component of a path.
  path dirname - Get the parent directory of a path.
  path exists - Check whether a path exists.
  path expand - Try to expand a path to its absolute form.
  path join - Join a structured path or a list of path parts.
  path parse - Convert a path into structured data.
  path relative-to - Express a path as relative to another path.
  path split - Split a path into a list based on the system's path separator.
  path type - Get the type of the object a path refers to (e.g., file, dir, symlink).

Flags:
  -h, --help - Display the help message for this command

Input/output types:
  ╭───┬─────────┬────────╮
  │ # │  input  │ output │
  ├───┼─────────┼────────┤
  │ 0 │ nothing │ string │
  ╰───┴─────────┴────────╯
```
