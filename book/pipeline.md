# Pipelines

One of the core designs of Nu is the pipeline, a design idea that traces its roots back decades to some of the original philosophy behind Unix. Just as Nu extends from the single string data type of Unix, Nu also extends the idea of the pipeline to include more than just text.

## Basics

A pipeline is composed of three parts: the input, the filter, and the output.

```
> open "Cargo.toml" | inc package.version | save "Cargo_new.toml"
```

The first command, `open "Cargo.toml"`, is an input (sometimes also called a "source" or "producer"). This creates or loads data and feeds it into a pipeline. It's from input that pipelines have values to work with.  Commands like `ls` are also inputs, as they take data from the filesystem and send it through the pipelines so that it can be used.

The second command, `inc package.version`, is a filter. Filters take the data they are given and often do something with it. They may change it (as with the `inc` command in our example), or they may do another operation, like logging, as the values pass through.

The last command, `save "Cargo_new.toml"`, is an output (sometimes called a "sink"). An output takes input from the pipeline and does some final operation on it. In our example, we save what comes through the pipeline to a file as the final step. Other types of output commands may take the values and view them for the user.

## Multi-line pipelines

If a pipeline is getting a bit long for one line, you can enclose it within `(` and `)` to create a subexpression:

```
(
    "01/22/2021" |
    parse "{month}/{day}/{year}" |
    get year
)
``` 

Also see [Subexpressions](https://www.nushell.sh/book/variables_and_subexpressions.html#subexpressions)

## Working with external commands

Nu commands communicate with each other using the Nu data types (see [types of data](types_of_data.md)), but what about commands outside of Nu?  Let's look at some examples of working with external commands:

`internal_command | external_command`

Data will flow from the internal_command to the external_command. This data is expected to be strings, so that they can be sent to the `stdin` of the external_command.

`external_command | internal_command`

Data coming from an external command into Nu will collect into a single string, and then will be passed into internal_command. Commands like `lines` help make it easier to bring in data from external commands in such a way that it's easier to work with.

`external_command_1 | external_command_2`

Nu works with data piped between two external commands in the same way as other shells, like Bash would. The `stdout` of external_command_1 is connected to the `stdin` of external_command_2. This lets data flow naturally between the two commands.

## Behind the scenes

You may have wondered how we see a table if `ls` is an input and not an output. Nu adds this output for us automatically using another command called `autoview`. The `autoview` command is appended to any pipeline that doesn't have an output allowing us to see the result.

In effect, the command:

```
> ls
```

And the pipeline:

```
> ls | autoview
```

Are one and the same.
