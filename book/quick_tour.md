# Quick Tour

[[toc]]

## Nushell Commands Output _Data_

The easiest way to see what Nu can do is to start with some examples, so let's dive in.

The first thing you'll notice when you run a command like [`ls`](/commands/docs/ls.md) is that instead of a block of text coming back, you get a structured table.

```nu:no-line-numbers
ls
# => ╭────┬─────────────────────┬──────┬───────────┬──────────────╮
# => │  # │        name         │ type │   size    │   modified   │
# => ├────┼─────────────────────┼──────┼───────────┼──────────────┤
# => │  0 │ CITATION.cff        │ file │     812 B │ 2 months ago │
# => │  1 │ CODE_OF_CONDUCT.md  │ file │   3.4 KiB │ 9 months ago │
# => │  2 │ CONTRIBUTING.md     │ file │  11.0 KiB │ 5 months ago │
# => │  3 │ Cargo.lock          │ file │ 194.9 KiB │ 15 hours ago │
# => │  4 │ Cargo.toml          │ file │   9.2 KiB │ 15 hours ago │
# => │  5 │ Cross.toml          │ file │     666 B │ 6 months ago │
# => │  6 │ LICENSE             │ file │   1.1 KiB │ 9 months ago │
# => │  7 │ README.md           │ file │  12.0 KiB │ 15 hours ago │
# => ...
```

This table does more than just format the output nicely. Like a spreadsheet, it allows us to work with the data _interactively_.

## Acting on Data

Next, let's sort this table by each file's size. To do this, we'll take the output from [`ls`](/commands/docs/ls.md) and feed it into a command that can sort tables based on the _values_ in a column.

```nu:no-line-numbers
ls | sort-by size | reverse
# => ╭───┬─────────────────┬──────┬───────────┬──────────────╮
# => │ # │      name       │ type │   size    │   modified   │
# => ├───┼─────────────────┼──────┼───────────┼──────────────┤
# => │ 0 │ Cargo.lock      │ file │ 194.9 KiB │ 15 hours ago │
# => │ 1 │ toolkit.nu      │ file │  20.0 KiB │ 15 hours ago │
# => │ 2 │ README.md       │ file │  12.0 KiB │ 15 hours ago │
# => │ 3 │ CONTRIBUTING.md │ file │  11.0 KiB │ 5 months ago │
# => │ 4 │ ...             │ ...  │ ...       │ ...          │
# => │ 5 │ LICENSE         │ file │   1.1 KiB │ 9 months ago │
# => │ 6 │ CITATION.cff    │ file │     812 B │ 2 months ago │
# => │ 7 │ Cross.toml      │ file │     666 B │ 6 months ago │
# => │ 8 │ typos.toml      │ file │     513 B │ 2 months ago │
# => ╰───┴─────────────────┴──────┴───────────┴──────────────╯
```

Notice that we didn't pass commandline arguments or switches to [`ls`](/commands/docs/ls.md). Instead, we used Nushell's built-in [`sort-by`](/commands/docs/sort-by.md) command to sort the _output_ of the `ls` command. Then, to see the largest files on top, we used [`reverse`](/commands/docs/reverse.md) on the _output_ of `sort-by`.

::: tip Cool!
If you compare the sort order closely, you might realize that the data isn't sorted alphabetically. It's not even sorted by the _numerical_ values. Instead, since the `size` column is a [`filesize` type](./types_of_data.md#file-sizes), Nushell knows that `1.1 KiB` (kibibytes) is larger than `812 B` (bytes).
:::

# Finding Data Using the `where` Command

Nu provides many commands that can operate on the structured output of the previous command. These are usually categorized as "Filters" in Nushell.

For example, we can use [`where`](/commands/docs/where.md) to filter the contents of the table so that it only shows files over 10 kilobytes:

```nu
ls | where size > 10kb
# => ╭───┬─────────────────┬──────┬───────────┬───────────────╮
# => │ # │      name       │ type │   size    │   modified    │
# => ├───┼─────────────────┼──────┼───────────┼───────────────┤
# => │ 0 │ CONTRIBUTING.md │ file │  11.0 KiB │ 5 months ago  │
# => │ 1 │ Cargo.lock      │ file │ 194.6 KiB │ 2 minutes ago │
# => │ 2 │ README.md       │ file │  12.0 KiB │ 16 hours ago  │
# => │ 3 │ toolkit.nu      │ file │  20.0 KiB │ 16 hours ago  │
# => ╰───┴─────────────────┴──────┴───────────┴───────────────╯
```

## More Than Just Directories

Of course, this isn't limited to the `ls` command. Nushell follows the Unix philosophy where each command does one thing well and you can typically expect the output of one command to become the input of another. This allows us to mix-and-match commands in many different combinations.

Let's look at a different command:

```nu:no-line-numbers
ps
# => ╭───┬──────┬──────┬───────────────┬──────────┬──────┬───────────┬─────────╮
# => │ # │ pid  │ ppid │     name      │  status  │ cpu  │    mem    │ virtual │
# => ├───┼──────┼──────┼───────────────┼──────────┼──────┼───────────┼─────────┤
# => │ 0 │    1 │    0 │ init(void)    │ Sleeping │ 0.00 │   1.2 MiB │ 2.2 MiB │
# => │ 1 │    8 │    1 │ init          │ Sleeping │ 0.00 │ 124.0 KiB │ 2.3 MiB │
# => │ 2 │ 6565 │    1 │ SessionLeader │ Sleeping │ 0.00 │ 108.0 KiB │ 2.2 MiB │
# => │ 3 │ 6566 │ 6565 │ Relay(6567)   │ Sleeping │ 0.00 │ 116.0 KiB │ 2.2 MiB │
# => │ 4 │ 6567 │ 6566 │ nu            │ Running  │ 0.00 │  28.4 MiB │ 1.1 GiB │
# => ╰───┴──────┴──────┴───────────────┴──────────┴──────┴───────────┴─────────╯
```

You may be familiar with the Linux/Unix `ps` command. It provides a list of all of the current processes running in the system along with their current status. As with `ls`, Nushell provides a cross-platform, built-in [`ps` command](/commands/docs/ps.md) that returns its results as structured data.

::: note
The traditional Unix `ps` only shows the current process and its parents by default. Nushell's implementation shows all of the processes on the system by default.

Normally, running `ps` in Nushell uses its **_internal_**, cross-platform command. However, it is still possible to run the **_external_**, system-dependent version on Unix/Linux platforms by prefacing it with the _caret sigil_. For example:

```nu
^ps aux  # run the Unix ps command with all processes in user-oriented form
```

See [Running External System Commands](./running_externals.md) for more details.
:::

What if we wanted to just show the processes that are actively running? As with `ls` above, we can also work with the table that `ps` _outputs_:

```nu
ps | where status == Running
# => ╭───┬──────┬──────┬──────┬─────────┬──────┬──────────┬─────────╮
# => │ # │ pid  │ ppid │ name │ status  │ cpu  │   mem    │ virtual │
# => ├───┼──────┼──────┼──────┼─────────┼──────┼──────────┼─────────┤
# => │ 0 │ 6585 │ 6584 │ nu   │ Running │ 0.00 │ 31.9 MiB │ 1.2 GiB │
# => ╰───┴──────┴──────┴──────┴─────────┴──────┴──────────┴─────────╯
```

::: tip
Remember above, where the `size` column from the `ls` command was a `filesize`? Here, `status` is really just a string, and you can use all the normal string operations and commands with it, including (as above) the `==` comparison.

You can examine the types for the table's columns using:

```nu
ps | describe
# => table<pid: int, ppid: int, name: string, status: string, cpu: float, mem: filesize, virtual: filesize> (stream)
```

The [`describe` command](/commands/docs/describe.md) can be used to display the output type of any command or expression.

:::

## Command Arguments in a Pipeline

Sometimes, a command takes an _argument_ instead of pipeline _input_. For this scenario, Nushell provides the [`$in` variable](./pipelines.md#pipeline-input-and-the-special-in-variable) that let's you use the previous command's output in variable-form. For example:

```nu:line-numbers
ls
| sort-by size
| reverse
| first
| get name
| cp $in ~
```

::: tip Nushell Design Note
Whenever possible, Nushell commands are designed to act on pipeline _input_. However, some commands, like `cp` in this example, have two (or more)
arguments with different meanings. In this case, `cp` needs to know both the path to _copy_ as well as the _target_ path. As a result, this command is
more ergonomic with two _positional parameters_.
:::

::: tip
Nushell commands can extend across multiple lines for readability. The above is the same as:

```nu
ls | sort-by size | reverse | first | get name | cp $in ~
```

See Also: [Multi-line Editing](./line_editor.md#multi-line-editing)
:::

The first three lines are the same commands we used in the second example above, so let's examine the last three:

4. The [`first` command](/commands/docs/first.md) simply returns the first value from the table. In this case, that means the file with the largest size. That's the `Cargo.lock` file if using the directory listing from the second example above. This "file" is a [`record`](./types_of_data.md#records) from the table which still contains its `name`, `type`, `size`, and `modified` columns/fields.
5. `get name` returns the _value_ of the `name` field from the previous command, so `"Cargo.lock"` (a string). This is also a simple example of a [`cell-path`](./types_of_data.md#cell-paths) that can be used to navigate and isolate structured data.
6. The last line uses the `$in` variable to reference the output of line 5. The result is a command that says _"Copy 'Cargo.lock' to the home directory"_

::: tip
[`get`](/commands/docs/get.md) and its counterpart [`select`](/commands/docs/select.md) are two of the most used filters in Nushell, but it might not be easy to
spot the difference between them at first glance. When you're ready to start using them more extensively, see [Using `get` and `select`](./navigating_structured_data.md#using-get-and-select) for a guide.
:::

## Getting Help

Nushell provides an extensive, in-shell Help system. For example

```nu
# help <command>
help ls
# Or
ls --help
# Also
help operators
help escapes
```

::: tip Cool!
Press the <kbd>F1</kbd> key to access the Help [menu](./line_editor.md#menus). Search for the `ps` command here, but _don't press <kbd>Enter</kbd> just yet_!

Instead, press the <kbd>Down Arrow</kbd> key, and notice that you are scrolling through the Examples section. Highlight an example, _then_ press <kbd>Enter</kbd> and
the example will be entered at the commandline, ready to run!

This can be a great way to explore and learn about the extensive set of Nushell commands.
:::

The Help system also has a "search" feature:

```nu
help --find filesize
# or
help -f filesize
```

It may not surprise you by now that the Help system itself is based on structured data! Notice that the output of `help -f filesize` is a table.

The Help for each command is stored as a record with the:

- Name
- Category
- Type (built-in, plugin, custom)
- Parameters it accepts
- Signatures showing what types of data it can accept as well as output
- And more

You can view _all_ commands (other than externals) as a single large table using:

```nu
help commands
```

::: tip
Notice that the `params` and `input_output` columns of the output above are _nested_ tables. Nushell allows [arbitrarily nested data structures](./navigating_structured_data.md#background).
:::

## `explore`'ing from Here

That `help commands` output is quite long. You could send it to a pager like `less` or `bat`, but Nushell includes a built-in `explore` command that lets you not only scroll, but also telescope-in to nested data. Try:

```nu
help commands | explore
```

Then press the <kbd>Enter</kbd> key to access the data itself. Use the arrow keys to scroll to the `cp` command, and over to the `params` column. Hit <kbd>Enter</kbd> again to
telescope in to the complete list of parameters available to the `cp` command.

::: note
Pressing <kbd>Esc</kbd> one time returns from Scroll-mode to the View; Pressing it a second time returns to the previous view (or exits, if already at the top view level).
:::

::: tip
You can, of course, use the `explore` command on _any_ structured data in Nushell. This might include JSON data coming from a Web API, a spreadsheet or CSV file, YAML, or anything that can be represented as structured data in Nushell.

Try `$env.config | explore` for fun!
:::
