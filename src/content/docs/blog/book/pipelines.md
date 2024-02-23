---
title: Pipelines
---

One of the core designs of Nu is the pipeline, a design idea that traces its roots back decades to some of the original philosophy behind Unix. Just as Nu extends from the single string data type of Unix, Nu also extends the idea of the pipeline to include more than just text.

## Basics

A pipeline is composed of three parts: the input, the filter, and the output.

```nu
open "Cargo.toml" | inc package.version --minor | save "Cargo_new.toml"
```

The first command, `open "Cargo.toml"`, is an input (sometimes also called a "source" or "producer"). This creates or loads data and feeds it into a pipeline. It's from input that pipelines have values to work with. Commands like [`ls`](/commands/docs/ls) are also inputs, as they take data from the filesystem and send it through the pipelines so that it can be used.

The second command, `inc package.version --minor`, is a filter. Filters take the data they are given and often do something with it. They may change it (as with the [`inc`](/commands/docs/inc) command in our example), or they may do another operation, like logging, as the values pass through.

The last command, `save "Cargo_new.toml"`, is an output (sometimes called a "sink"). An output takes input from the pipeline and does some final operation on it. In our example, we save what comes through the pipeline to a file as the final step. Other types of output commands may take the values and view them for the user.

The `$in` variable will collect the pipeline into a value for you, allowing you to access the whole stream as a parameter:

```nu
[1 2 3] | $in.1 * $in.2
# 6
```

## Multi-line pipelines

If a pipeline is getting a bit long for one line, you can enclose it within `(` and `)` to create a subexpression:

```nu
(
    "01/22/2021" |
    parse "{month}/{day}/{year}" |
    get year
)
```

Also see [Subexpressions](https://www.nushell.sh/book/variables_and_subexpressions#subexpressions)

## Semicolons

Take this example:

```nu
line1; line2 | line3
```

Here, semicolons are used in conjunction with pipelines. When a semicolon is used, no output data is produced to be piped. As such, the `$in` variable will not work when used immediately after the semicolon.

- As there is a semicolon after `line1`, the command will run to completion and get displayed on the screen.
- `line2` | `line3` is a normal pipeline. It runs, and its contents are displayed after `line1`'s contents.

## Working with external commands

Nu commands communicate with each other using the Nu data types (see [types of data](types_of_data)), but what about commands outside of Nu? Let's look at some examples of working with external commands:

`internal_command | external_command`

Data will flow from the internal_command to the external_command. This data will get converted to a string, so that they can be sent to the `stdin` of the external_command.

`external_command | internal_command`

Data coming from an external command into Nu will come in as bytes that Nushell will try to automatically convert to UTF-8 text. If successful, a stream of text data will be sent to internal_command. If unsuccessful, a stream of binary data will be sent to internal command. Commands like [`lines`](/commands/docs/lines) help make it easier to bring in data from external commands, as it gives discrete lines of data to work with.

`external_command_1 | external_command_2`

Nu works with data piped between two external commands in the same way as other shells, like Bash would. The `stdout` of external_command_1 is connected to the `stdin` of external_command_2. This lets data flow naturally between the two commands.

## Behind the scenes

You may have wondered how we see a table if [`ls`](/commands/docs/ls) is an input and not an output. Nu adds this output for us automatically using another command called [`table`](/commands/docs/table). The [`table`](/commands/docs/table) command is appended to any pipeline that doesn't have an output. This allows us to see the result.

In effect, the command:

```nu
ls
```

And the pipeline:

```nu
ls | table
```

Are one and the same.

> :::note
> the sentence _are one and the same_ above only applies for the graphical output in the shell,
> it does not mean the two data structures are them same
>
> ```nu
> (ls) == (ls | table)
> # false
> ```
>
> `ls | table` is not even structured data!
> :::

## Output result to external commands

Sometimes you want to output Nushell structured data to an external command for further processing. However, Nushell's default formatting options for structured data may not be what you want.
For example, you want to find a file named "tutor" under "/usr/share/vim/runtime" and check its ownership

```nu
ls /usr/share/nvim/runtime/
╭────┬───────────────────────────────────────┬──────┬─────────┬───────────────╮
│  # │                 name                  │ type │  size   │   modified    │
├────┼───────────────────────────────────────┼──────┼─────────┼───────────────┤
│  0 │ /usr/share/nvim/runtime/autoload      │ dir  │  4.1 KB │ 2 days ago    │
..........
..........
..........

│ 31 │ /usr/share/nvim/runtime/tools         │ dir  │  4.1 KB │ 2 days ago    │
│ 32 │ /usr/share/nvim/runtime/tutor         │ dir  │  4.1 KB │ 2 days ago    │
├────┼───────────────────────────────────────┼──────┼─────────┼───────────────┤
│  # │                 name                  │ type │  size   │   modified    │
╰────┴───────────────────────────────────────┴──────┴─────────┴───────────────╯
```

You decided to use `grep` and [pipe](https://www.nushell.sh/book/pipelines) the result to external `^ls`

```nu
ls /usr/share/nvim/runtime/ | get name | ^grep tutor | ^ls -la $in
ls: cannot access ''$'\342\224\202'' 32 '$'\342\224\202'' /usr/share/nvim/runtime/tutor        '$'\342\224\202\n': No such file or directory
```

What's wrong? Nushell renders lists and tables (by adding a border with characters like `╭`,`─`,`┬`,`╮`) before piping them as text to external commands. If that's not the behavior you want, you must explicitly convert the data to a string before piping it to an external. For example, you can do so with [`to text`](/commands/docs/to_text):

```nu
ls /usr/share/nvim/runtime/ | get name | to text | ^grep tutor | tr -d '\n' | ^ls -la $in
total 24
drwxr-xr-x@  5 pengs  admin   160 14 Nov 13:12 .
drwxr-xr-x@  4 pengs  admin   128 14 Nov 13:42 en
-rw-r--r--@  1 pengs  admin  5514 14 Nov 13:42 tutor.tutor
-rw-r--r--@  1 pengs  admin  1191 14 Nov 13:42 tutor.tutor.json
```

(Actually, for this simple usage you can just use [`find`](/commands/docs/find))

```nu
ls /usr/share/nvim/runtime/ | get name | find tutor | ^ls -al $in
```

## Command Output in Nushell

Unlike external commands, Nushell commands are akin to functions. Most Nushell commands do not print anything to `stdout` and instead just return data.

```nu
do { ls; ls; ls; "What?!" }
```

This means that the above code will not display the files under the current directory three times.
In fact, running this in the shell will only display `"What?!"` because that is the value returned by the `do` command in this example. However, using the system `^ls` command instead of `ls` would indeed print the directory thrice because `^ls` does print its result once it runs.

Knowing when data is displayed is important when using configuration variables that affect the display output of commands such as `table`.

```nu
do { $env.config.table.mode = none; ls }
```

For instance, the above example sets the `$env.config.table.mode` configuration variable to `none`, which causes the `table` command to render data without additional borders. However, as it was shown earlier, the command is effectively equivalent to

```nu
do { $env.config.table.mode = none; ls } | table
```

Because Nushell `$env` variables are [scoped](https://www.nushell.sh/book/environment#scoping), this means that the `table` command in the example is not affected by the
environment modification inside the `do` block and the data will not be shown with the applied configuration.

When displaying data early is desired, it is possible to explicitly apply `| table` inside the scope, or use the `print` command.

```nu
do { $env.config.table.mode = none; ls | table }
do { $env.config.table.mode = none; print (ls) }
```
