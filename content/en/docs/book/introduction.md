---
title: Introduction
description: Getting started with Nu
---

Hello, and welcome to the Nushell project. The goal of this project is to take the Unix philosophy of shells, where pipes connect simple commands together, and bring it to the modern style of development.

Nu takes cues from a lot of familiar territory: traditional shells like bash, advanced shells like PowerShell, functional programming, systems programming, and more. But rather than trying to be the jack of all trades, Nu focuses its energy on doing a few things well:

* Create a flexible cross-platform shell with a modern feel
* Allow you to mix and match commandline applications with a shell that understands the structure of your data
* Have the level of UX polish that modern CLI apps provide

The easiest way to see what Nu can do is to start with some examples, so let's dive in.

The first thing you'll notice when you run a command like `ls` is that instead of a block of text coming back, you get a structured table.

```
> ls
────┬────────────────────┬──────┬────────┬────────────
 #  │ name               │ type │ size   │ modified
────┼────────────────────┼──────┼────────┼────────────
  0 │ 404.html           │ File │  429 B │ 3 days ago
  1 │ CONTRIBUTING.md    │ File │  955 B │ 8 mins ago
  2 │ Gemfile            │ File │ 1.1 KB │ 3 days ago
  3 │ Gemfile.lock       │ File │ 6.9 KB │ 3 days ago
  4 │ LICENSE            │ File │ 1.1 KB │ 3 days ago
  5 │ README.md          │ File │  213 B │ 3 days ago
...
```

The table is more than just showing the directory in a different way. Just like tables in a spreadsheet, this table allows us to work with the data more interactively.

The first thing we'll do is to sort our table by the size. To do this, we'll take the output from `ls` and feed it into a command that can sort tables based on the contents of a column.

```
> ls | sort-by size | reverse
────┬────────────────────┬──────┬────────┬────────────
 #  │ name               │ type │ size   │ modified
────┼────────────────────┼──────┼────────┼────────────
  0 │ Gemfile.lock       │ File │ 6.9 KB │ 3 days ago
  1 │ SUMMARY.md         │ File │ 3.7 KB │ 3 days ago
  2 │ Gemfile            │ File │ 1.1 KB │ 3 days ago
  3 │ LICENSE            │ File │ 1.1 KB │ 3 days ago
  4 │ CONTRIBUTING.md    │ File │  955 B │ 9 mins ago
  5 │ books.md           │ File │  687 B │ 3 days ago
...
```

You can see that to make this work we didn't pass commandline arguments to `ls`. Instead, we used the `sort-by` command that Nu provides to do the sorting of the output of the `ls` command. To see the biggest files on top, we also used `reverse`.

Nu provides many commands that can work on tables. For example, we could filter the contents of the `ls` table so that it only shows files over 1 kilobyte:

```
> ls | where size > 1kb
───┬──────────────┬──────┬────────┬────────────
 # │ name         │ type │ size   │ modified
───┼──────────────┼──────┼────────┼────────────
 0 │ Gemfile      │ File │ 1.1 KB │ 3 days ago
 1 │ Gemfile.lock │ File │ 6.9 KB │ 3 days ago
 2 │ LICENSE      │ File │ 1.1 KB │ 3 days ago
 3 │ SUMMARY.md   │ File │ 3.7 KB │ 3 days ago
───┴──────────────┴──────┴────────┴────────────
```

Just as in the Unix philosophy, being able to have commands talk to each other gives us ways to mix-and-match in many different combinations. Let's look at a different command:

```
> ps
─────┬───────┬──────────────────┬─────────┬─────────┬──────────┬─────────
 #   │ pid   │ name             │ status  │ cpu     │ mem      │ virtual
─────┼───────┼──────────────────┼─────────┼─────────┼──────────┼─────────
   0 │ 33155 │ nu_plugin_core_p │ Running │  3.8496 │   1.8 MB │  4.4 GB
   1 │ 32841 │ mdworker_shared  │ Running │  0.0000 │  19.3 MB │  4.4 GB
   2 │ 32829 │ CoreServicesUIAg │ Running │  0.0000 │  16.1 MB │  4.5 GB
   3 │ 32828 │ mdworker_shared  │ Running │  0.0000 │  23.0 MB │  4.4 GB
```

You may be familiar with the `ps` command if you've used Linux. With it, we can get a list of all the current processes that the system is running, what their status is, and what their name is. We can also see the CPU load for the process.

What if we wanted to show the processes that were actively using the CPU? Just like we did with the `ls` command earlier, we can also work with the table that the `ps` command gives back to us:

```
> ps | where cpu > 10
───┬──────┬──────────────────┬─────────┬────────┬──────────┬─────────
 # │ pid  │ name             │ status  │ cpu    │ mem      │ virtual
───┼──────┼──────────────────┼─────────┼────────┼──────────┼─────────
 0 │ 3971 │ Google Chrome He │ Running │ 5.1263 │  99.4 MB │  5.5 GB
 1 │  360 │ iTerm2           │ Running │ 6.6635 │ 218.6 MB │  6.0 GB
───┴──────┴──────────────────┴─────────┴────────┴──────────┴─────────
```

So far, we've seen using `ls` and `ps` to list files and processes. Nu also offers other commands that can create tables of useful information. Next, let's explore `date` and `sys`.

Running `date` gives us information about the current day and time:

```
> date
──────────┬────────
 year     │ 2020
 month    │ 5
 day      │ 5
 hour     │ 21
 minute   │ 13
 second   │ 17
 timezone │ +02:00
──────────┴────────
```

Running `sys` gives information about the system that Nu is running on:

```
> sys
─────────┬─────────────────────────────────────────
 host    │ [row 7 columns]
 cpu     │ [row cores current ghz max ghz min ghz]
 disks   │ [table 2 rows]
 mem     │ [row free swap free swap total total]
 net     │ [table 11 rows]
 battery │ [table 1 rows]
─────────┴─────────────────────────────────────────
```

This is a bit different than the tables we saw before. The `sys` command gives us a table that contains structured tables in the cells instead of simple values. To take a look at this data, we need to select the column to view:

```
> sys | get host
──────────┬─────────────────────────────────────────────
 name     │ Linux
 release  │ 5.3.0-1019-azure
 version  │ #20-Ubuntu SMP Fri Mar 27 23:54:23 UTC 2020
 hostname │ lifeless
 arch     │ x86_64
 uptime   │ 8:03:47:32
 sessions │ [table 2 rows]
──────────┴─────────────────────────────────────────────
```

The `get` command lets us jump into the contents of a column of the table. Here, we're looking into the "host" column, which contains information about the host that Nu is running on. The name of the OS, the hostname, the CPU, and more. Let's get the name of the users on the system:

```
> sys | get host.sessions
───┬─────────
 # │ <value>
───┼─────────
 0 │ jonathan
───┴─────────
```

Right now, there's just one user on the system named "jonathan". You'll notice that we can pass a path (the `host.sessions` part) and not just the name of the column. Nu will take the path and go to the corresponding bit of data in the table.

You might have noticed something else that's different. Rather than having a table of data, we have just a single element: the string "jonathan". Nu works with both tables of data as well as strings. Strings are an important part of working with commands outside of Nu.

Let's see how strings work outside of Nu in action. We'll take our example from before and run the external `echo` command (the `^` tells nu to not use the built-in `echo` command):

```
> sys | get host.sessions | ^echo $it
jonathan
```

If this looks very similar to what we had before, you have a keen eye! It is similar, but with one important difference: we've called `^echo` with the value we saw earlier. This allows us to pass data out of Nu into `echo` (or any command outside of Nu, like `git` for example).

*Note: help text for any of Nu's builtin commands can be discovered with the `help` command*:

```
> help config
Configuration management.

Usage:
  > config {flags}

flags:
  -h, --help: Display this help message
  -l, --load <file path>: load the config from the path give
  -s, --set <any>: set a value in the config, eg) --set [key value]
  -i, --set_into <string>: sets a variable from values in the pipeline
  -g, --get <any>: get a value from the config
  -r, --remove <any>: remove a value from the config
  -c, --clear: clear the config
  -p, --path: return the path to the config file
```
