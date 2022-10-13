# Pipelines

One of the core designs of Nu is the pipeline, a design idea that traces its roots back decades to some of the original philosophy behind Unix. Just as Nu extends from the single string data type of Unix, Nu also extends the idea of the pipeline to include more than just text.

## Basics

A pipeline is composed of three parts: the input, the filter, and the output.

```
> open "Cargo.toml" | inc package.version --minor | save "Cargo_new.toml"
```

The first command, `open "Cargo.toml"`, is an input (sometimes also called a "source" or "producer"). This creates or loads data and feeds it into a pipeline. It's from input that pipelines have values to work with. Commands like [`ls`](commands/ls.md) are also inputs, as they take data from the filesystem and send it through the pipelines so that it can be used.

The second command, `inc package.version --minor`, is a filter. Filters take the data they are given and often do something with it. They may change it (as with the [`inc`](commands/inc.md) command in our example), or they may do another operation, like logging, as the values pass through.

The last command, `save "Cargo_new.toml"`, is an output (sometimes called a "sink"). An output takes input from the pipeline and does some final operation on it. In our example, we save what comes through the pipeline to a file as the final step. Other types of output commands may take the values and view them for the user.

The `$in` variable will collect the pipeline into a value for you, allowing you to access the whole stream as a parameter:

```nushell
> echo 1 2 3 | $in.1 * $in.2
6
```

## Multi-line pipelines

If a pipeline is getting a bit long for one line, you can enclose it within `(` and `)` to create a subexpression:

```nushell
(
    "01/22/2021" |
    parse "{month}/{day}/{year}" |
    get year
)
```

Also see [Subexpressions](https://www.nushell.sh/book/variables_and_subexpressions.html#subexpressions)

## Semicolons

Take this example:

```
> line1; line2 | line3
```

Here, semicolons are used in conjunction with pipelines. When a semicolon is used, no output data is produced to be piped. As such, the `$in` variable will not work when used immediately after the semicolon. 

- As there is a semicolon after `line1`, the command will run to completion and get displayed on the screen.
- `line2` | `line3` is a normal pipeline. It runs, and its contents are displayed after `line1`'s contents.

## Working with external commands

Nu commands communicate with each other using the Nu data types (see [types of data](types_of_data.md)), but what about commands outside of Nu? Let's look at some examples of working with external commands:

`internal_command | external_command`

Data will flow from the internal_command to the external_command. This data will get converted to a string, so that they can be sent to the `stdin` of the external_command.

`external_command | internal_command`

Data coming from an external command into Nu will come in as bytes that Nushell will try to automatically convert to UTF-8 text. If successful, a stream of text data will be sent to internal_command. If unsuccessful, a stream of binary data will be sent to internal command. Commands like [`lines`](commands/lines.md) help make it easier to bring in data from external commands, as it gives discrete lines of data to work with.

`external_command_1 | external_command_2`

Nu works with data piped between two external commands in the same way as other shells, like Bash would. The `stdout` of external_command_1 is connected to the `stdin` of external_command_2. This lets data flow naturally between the two commands.

## Behind the scenes

You may have wondered how we see a table if [`ls`](commands/ls.md) is an input and not an output. Nu adds this output for us automatically using another command called [`table`](commands/table.md). The [`table`](commands/table.md) command is appended to any pipeline that doesn't have an output. This allows us to see the result.

In effect, the command:

```
> ls
```

And the pipeline:

```
> ls | table
```

Are one and the same.
