# Pipelines

One of the core designs of Nu is the pipeline, a design idea that traces its roots back decades to some of the original philosophy behind Unix. Just as Nu extends from the single string data type of Unix, Nu also extends the idea of the pipeline to include more than just text.

## Basics

A pipeline is composed of three parts: the input, the filter, and the output.

```nu
> open "Cargo.toml" | inc package.version --minor | save "Cargo_new.toml"
```

The first command, `open "Cargo.toml"`, is an input (sometimes also called a "source" or "producer"). This creates or loads data and feeds it into a pipeline. It's from input that pipelines have values to work with. Commands like [`ls`](/commands/docs/ls.md) are also inputs, as they take data from the filesystem and send it through the pipelines so that it can be used.

The second command, `inc package.version --minor`, is a filter. Filters take the data they are given and often do something with it. They may change it (as with the [`inc`](/commands/docs/inc.md) command in our example), or they may do another operation, like logging, as the values pass through.

The last command, `save "Cargo_new.toml"`, is an output (sometimes called a "sink"). An output takes input from the pipeline and does some final operation on it. In our example, we save what comes through the pipeline to a file as the final step. Other types of output commands may take the values and view them for the user.

The `$in` variable will collect the pipeline into a value for you, allowing you to access the whole stream as a parameter:

```nu
> [1 2 3] | $in.1 * $in.2
6
```

## Multi-line pipelines

If a pipeline is getting a bit long for one line, you can enclose it within parentheses `()`:

```nu
let year = (
    "01/22/2021" |
    parse "{month}/{day}/{year}" |
    get year
)
```

## Semicolons

Take this example:

```nu
> line1; line2 | line3
```

Here, semicolons are used in conjunction with pipelines. When a semicolon is used, no output data is produced to be piped. As such, the `$in` variable will not work when used immediately after the semicolon.

- As there is a semicolon after `line1`, the command will run to completion and get displayed on the screen.
- `line2` | `line3` is a normal pipeline. It runs, and its contents are displayed after `line1`'s contents.

## Pipeline input and the special `$in` variable

Much of Nu's composability comes from the special `$in` variable, which holds the current pipeline input.

`$in` is particular useful when used in:

- Command or external parameters
- Filters
- Custom command definitions or scripts that accept pipeline input

### `$in` as a command argument or as part of an expression

Compare the following two command-lines that create a directory with tomorrow's date as part of the name. The following are equivalent:

Using subexpressions:

```nushell
mkdir $'((date now) + 1day | format date '%F') Report'
```

or using pipelines:

```nushell
date now                    # 1: today
| $in + 1day                # 2: tomorrow
| format date '%F'          # 3: Format as YYYY-MM-DD
| $'($in) Report'           # 4: Format the directory name
| mkdir $in                 # 5: Create the directory
```

While the second form may be overly verbose for this contrived example, you'll notice several advantages:

- It can be composed step-by-step with a simple <kbd>↑</kbd> (up arrow) to repeat the previous command and add the next stage of the pipeline.
- It's arguably more readable.
- Each step can, if needed, be commented.
- Each step in the pipeline can be [`inspect`ed for debugging](/commands/docs/inspect.html).

Let's examine the contents of `$in` on each line of the above example:

- On line 2, `$in` refers to the results of line 1's `date now` (a datetime value).
- On line 4, `$in` refers to tomorrow's formatted date from line 3 and is used in an interpolated string
- On line 5, `$in` refers to the results of line 4's interpolated string, e.g. '2024-05-14 Report'

### Pipeline input in filter closures

Certain [filter commands](/commands/categories/filters.html) may modify the pipeline input to their closure in order to provide more convenient access to the expected context. For example:

```nushell
1..10 | each {$in * 2}
```

Rather than referring to the entire range of 10 digits, the `each` filter modifies `$in` to refer to the value of the _current iteration_.

In most filters, the pipeline input and its resulting `$in` will be the same as the closure parameter. For the `each` filter, the following example is equivalent to the one above:

```nushell
1..10 | each {|value| $value * 2}
```

However, some filters will assign an even more convenient value to their closures' input. The `update` filter is one example. The pipeline input to the `update` command's closure (as well as `$in`) refers to the _column_ being updated, while the closure parameter refers to the entire record. As a result, the following two examples are also equivalent:

```nushell
ls | update name {|file| $file.name | str upcase}
ls | update name {str upcase}
```

With most filters, the second version would refer to the entire `file` record (with `name`, `type`, `size`, and `modified` columns). However, with `update`, it refers specifically to the contents of the _column_ being updated, in this case `name`.

### Pipeline input in custom command definitions and scripts

See: [Custom Commands -> Pipeline Input](custom_commands.html#pipeline-input)

### When does `$in` change (and when can it be reused)?

- **_Rule 1:_** When used in the first position of a pipeline in a closure or block, `$in` refers to the pipeline (or filter) input to the closure/block.

  Example:

  ```nushell
  def echo_me [] {
    print $in
  }

  > true | echo_me
  true
  ```

  - **_Rule 1.5:_** This is true throughout the current scope. Even on subsequent lines in a closure or block, `$in` is the same value when used in the first position of _any pipeline_ inside that scope.

    Example:

    ```nu
    [ a b c ] | each {
        print $in
        print $in
        $in
    }
    ```

    All three of the `$in` values are the same on each iteration, so this outputs:

    ```nu
    a
    a
    b
    b
    c
    c
    ╭───┬───╮
    │ 0 │ a │
    │ 1 │ b │
    │ 2 │ c │
    ╰───┴───╯
    ```

* **_Rule 2:_** When used anywhere else in a pipeline (other than the first position), `$in` refers to the previous expression's result:

  Example:

  ```nushell
  > 4               # Pipeline input
    | $in * $in     # $in is 4 in this expression
    | $in / 2       # $in is now 16 in this expression
    | $in           # $in is now 8

  8
  ```

  - **_Rule 2.5:_** Inside a closure or block, Rule 2 usage occurs inside a new scope (a sub-expression) where that "new" `$in` value is valid. This means that Rule 1 and Rule 2 usage can coexist in the same closure or block.

    Example:

    ```nushell
    4 | do {
      print $in            # closure-scope $in is 4

      let p = (            # explicit sub-expression, but one will be created regardless
        $in * $in          # initial-pipeline position $in is still 4 here
        | $in / 2          # $in is now 16
      )                    # $p is the result, 8 - Sub-expression scope ends

      print $in            # At the closure-scope, the "original" $in is still 4
      print $p
    }
    ```

    So the output from the 3 `print` statements is:

    ```nu
    4
    4
    8
    ```

    Again, this would hold true even if the command above used the more compact, implicit sub-expression form:

    Example:

    ```nushell
    4 | do {
      print $in                       # closure-scope $in is 4
      let p = $in * $in | $in / 2     # Implicit let sub-expression
      print $in                       # At the closure-scope, $in is still 4
      print $p
    }

    4
    4
    8
    ```

* **_Rule 3:_** When used with no input, `$in` is null.

  Example:

  ```nushell
  > # Input
  > 1 | do { $in | describe }
  int
  > "Hello, Nushell" | do { in | describe }
  string
  > {||} | do { $in | describe }
  closure

  > # No input
  > do { $in | describe }
  nothing
  ```

* **_Rule 4:_** In a multi-statement line separated by semicolons, `$in` cannot be used to capture the results of the previous _statement_.

  This is the same as having no-input:

  ```nushell
  > ls / | get name; $in | describe
  nothing
  ```

  Instead, simply continue the pipeline:

  ```nushell
  > ls / | get name | $in | describe
  list<string>
  ```

### Best practice for `$in` in multiline code

While `$in` can be reused as demonstrated above, assigning its value to another variable in the first line of your closure/block will often aid in readability and debugging.

Example:

```nushell
def "date info" [] {
  let day = $in
  print ($day | format date '%v')
  print $'... was a ($day | format date '%A')'
  print $'... was day ($day | format date '%j') of the year'
}

> '2000-01-01' | date info
 1-Jan-2000
... was a Saturday
... was day 001 of the year
```

### Collectability of `$in`

Currently, the use of `$in` on a stream in a pipeline results in a "collected" value, meaning the pipeline "waits" on the stream to complete before handling `$in` with the full results. However, this behavior is not guaranteed in future releases. To ensure that a stream is collected into a single variable, use the [`collect` command](/commands/docs/collect.html).

Likewise, avoid using `$in` when normal pipeline input will suffice, as internally `$in` forces a conversion from `PipelineData` to `Value` and _may_ result in decreased performance and/or increased memory usage.

## Working with external commands

Nu commands communicate with each other using the Nu data types (see [types of data](types_of_data.md)), but what about commands outside of Nu? Let's look at some examples of working with external commands:

`internal_command | external_command`

Data will flow from the internal_command to the external_command. This data will get converted to a string, so that they can be sent to the `stdin` of the external_command.

`external_command | internal_command`

Data coming from an external command into Nu will come in as bytes that Nushell will try to automatically convert to UTF-8 text. If successful, a stream of text data will be sent to internal_command. If unsuccessful, a stream of binary data will be sent to internal command. Commands like [`lines`](/commands/docs/lines.md) help make it easier to bring in data from external commands, as it gives discrete lines of data to work with.

`external_command_1 | external_command_2`

Nu works with data piped between two external commands in the same way as other shells, like Bash would. The `stdout` of external_command_1 is connected to the `stdin` of external_command_2. This lets data flow naturally between the two commands.

### Notes on errors when piping commands

Sometimes, it might be unclear as to why you cannot pipe to a command.

For example, PowerShell users may be used to piping the output of any internal PowerShell command directly to another, e.g.:

`echo 1 | sleep`

(Where for PowerShell, `echo` is an alias to `Write-Output` and `sleep` is to `Start-Sleep`.)

However, it might be surprising that for some commands, the same in Nushell errors:

```nu
> echo 1sec | sleep
Error: nu::parser::missing_positional

  × Missing required positional argument.
   ╭─[entry #53:1:1]
 1 │ echo 1sec | sleep
   ╰────
  help: Usage: sleep <duration> ...(rest) . Use `--help` for more information.
```

While there is no steadfast rule, Nu generally tries to copy established conventions,
or do what 'feels right'. And with `sleep`, this is actually the same behaviour as Bash.

Many commands do have piped input/output however, and if it's ever unclear,
you can see what you can give to a command by invoking `help <command name>`:

```nu
> help sleep
Delay for a specified amount of time.

Search terms: delay, wait, timer

Usage:
  > sleep <duration> ...(rest)

Flags:
  -h, --help - Display the help message for this command

Parameters:
  duration <duration>: Time to sleep.
  ...rest <duration>: Additional time.

Input/output types:
  ╭───┬─────────┬─────────╮
  │ # │  input  │ output  │
  ├───┼─────────┼─────────┤
  │ 0 │ nothing │ nothing │
  ╰───┴─────────┴─────────╯
```

In this case, sleep takes `nothing` and instead expects an argument.

So, we can supply the output of the `echo` command as an argument to it:
`echo 1sec | sleep $in` or `sleep (echo 1sec)`

## Behind the scenes

You may have wondered how we see a table if [`ls`](/commands/docs/ls.md) is an input and not an output. Nu adds this output for us automatically using another command called [`table`](/commands/docs/table.md). The [`table`](/commands/docs/table.md) command is appended to any pipeline that doesn't have an output. This allows us to see the result.

In effect, the command:

```nu
> ls
```

And the pipeline:

```nu
> ls | table
```

Are one and the same.

> **Note**
> the sentence _are one and the same_ above only applies for the graphical output in the shell,
> it does not mean the two data structures are them same
>
> ```nushell
> > (ls) == (ls | table)
> false
> ```
>
> `ls | table` is not even structured data!

## Output result to external commands

Sometimes you want to output Nushell structured data to an external command for further processing. However, Nushell's default formatting options for structured data may not be what you want.
For example, you want to find a file named "tutor" under "/usr/share/vim/runtime" and check its ownership

```nu
> ls /usr/share/nvim/runtime/
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

You decided to use `grep` and [pipe](https://www.nushell.sh/book/pipelines.html) the result to external `^ls`

```nu
> ls /usr/share/nvim/runtime/ | get name | ^grep tutor | ^ls -la $in
ls: cannot access ''$'\342\224\202'' 32 '$'\342\224\202'' /usr/share/nvim/runtime/tutor        '$'\342\224\202\n': No such file or directory
```

What's wrong? Nushell renders lists and tables (by adding a border with characters like `╭`,`─`,`┬`,`╮`) before piping them as text to external commands. If that's not the behavior you want, you must explicitly convert the data to a string before piping it to an external. For example, you can do so with [`to text`](/commands/docs/to_text.md):

```nu
> ls /usr/share/nvim/runtime/ | get name | to text | ^grep tutor | tr -d '\n' | ^ls -la $in
total 24
drwxr-xr-x@  5 pengs  admin   160 14 Nov 13:12 .
drwxr-xr-x@  4 pengs  admin   128 14 Nov 13:42 en
-rw-r--r--@  1 pengs  admin  5514 14 Nov 13:42 tutor.tutor
-rw-r--r--@  1 pengs  admin  1191 14 Nov 13:42 tutor.tutor.json
```

(Actually, for this simple usage you can just use [`find`](/commands/docs/find.md))

```nu
> ls /usr/share/nvim/runtime/ | get name | find tutor | ^ls -al $in
```

## Command Output in Nushell

Unlike external commands, Nushell commands are akin to functions. Most Nushell commands do not print anything to `stdout` and instead just return data.

```nu
> do { ls; ls; ls; "What?!" }
```

This means that the above code will not display the files under the current directory three times.
In fact, running this in the shell will only display `"What?!"` because that is the value returned by the `do` command in this example. However, using the system `^ls` command instead of `ls` would indeed print the directory thrice because `^ls` does print its result once it runs.

Knowing when data is displayed is important when using configuration variables that affect the display output of commands such as `table`.

```nu
> do { $env.config.table.mode = none; ls }
```

For instance, the above example sets the `$env.config.table.mode` configuration variable to `none`, which causes the `table` command to render data without additional borders. However, as it was shown earlier, the command is effectively equivalent to

```nu
> do { $env.config.table.mode = none; ls } | table
```

Because Nushell `$env` variables are [scoped](https://www.nushell.sh/book/environment.html#scoping), this means that the `table` command in the example is not affected by the
environment modification inside the `do` block and the data will not be shown with the applied configuration.

When displaying data early is desired, it is possible to explicitly apply `| table` inside the scope, or use the `print` command.

```nu
> do { $env.config.table.mode = none; ls | table }
> do { $env.config.table.mode = none; print (ls) }
```
