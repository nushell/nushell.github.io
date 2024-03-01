# Moving around your system

Early shells allow you to move around your filesystem and run commands, and modern shells like Nu allow you to do the same. Let's take a look at some of the common commands you might use when interacting with your system.

## Viewing directory contents

@[code](@snippets/moving_around/ls_example.sh)

As we've seen in other chapters, [`ls`](/commands/docs/ls.md) is a command for viewing the contents of a path. Nu will return the contents as a table that we can use.

The [`ls`](/commands/docs/ls.md) command also takes an optional argument, to change what you'd like to view. For example, we can list the files that end in ".md"

@[code](@snippets/moving_around/ls_shallow_glob_example.sh)

## Glob patterns (wildcards)

The asterisk (\*) in the above optional argument "\*.md" is sometimes called a wildcard or a glob. It lets us match anything. You could read the glob "\*.md" as "match any filename, so long as it ends with '.md' "

The most general glob is `*`, which will match all paths. More often, you'll see this pattern used as part of another pattern, for example `*.bak` and `temp*`.

In Nushell, we also support double `*` to talk about traversing deeper paths that are nested inside of other directories. For example, `ls **/*` will list all the non-hidden paths nested under the current directory.

@[code](@snippets/moving_around/ls_deep_glob_example.sh)

Here, we're looking for any file that ends with ".md", and the two asterisks further say "in any directory starting from here".

In other shells (like bash), glob expansion happens in the shell and the invoked program (`ls` in the example above) receives a list of matched files. In Nushell however, the string you enter is passed "as is" to the command, and some commands (like `ls`, `mv`, `cp` and `rm`) interpret their input string as a glob pattern. For example the [`ls` command's help page](https://www.nushell.sh/commands/docs/ls.html) shows that it takes the parameter: `pattern: the glob pattern to use (optional)`.

Globbing syntax in these commands not only supports `*`, but also matching [single characters with `?` and character groups with `[...]`](https://docs.rs/nu-glob/latest/nu_glob/struct.Pattern.html). Note that this is a more limited syntax than what the dedicated [`glob` Nushell command](https://www.nushell.sh/commands/docs/glob.html) supports.

Escaping `*`, `?`, `[]` works by quoting them with single quotes or double quotes.  To show the contents of a directory named `[slug]`, use `ls "[slug]"` or `ls '[slug]'`.
Note that backtick quote doesn't escape glob, for example: <code>cp `test dir/*`</code> will copy all files inside `test dir` to current direcroty.

If you pass a variable to a command that support globbing like this: `let f = "a[bc]d.txt"; rm $f`.  It won't expand the glob pattern, only a file named `a[bc]d.txt` will be removed.  Normally it's what you want, but if you want to expand the glob pattern, there are 3 ways to achieve it:

1. using spread operator along with `glob` command: `let f = "a[bc]d.txt"; rm ...(glob $f)`. This way is recommended because it's expressed most explicitly, but it doesn't work with `ls` and `du` command, for the case, you can
2. using `into glob` command: `let f = "a[bc]d.txt"; ls ($f | into glob)`.  It's useful for `ls` and `du` commands.
3. annotate variable with `glob` type: `let f: glob = "a[bc]d.txt"; rm $f`. It's simple to write, but doesn't work with external command like `^rm $f`.

## Changing the current directory

@[code](@snippets/moving_around/cd_example.sh)

To change from the current directory to a new one, we use the [`cd`](/commands/docs/cd.md) command. Just as in other shells, we can use either the name of the directory, or if we want to go up a directory we can use the `..` shortcut.

Changing the current working directory can also be done if [`cd`](/commands/docs/cd.md) is omitted and a path by itself is given:

@[code](@snippets/moving_around/cd_without_command_example.sh)

**Note:** changing the directory with [`cd`](/commands/docs/cd.md) changes the `PWD` environment variable. This means that a change of a directory is kept to the current block. Once you exit the block, you'll return to the previous directory. You can learn more about working with this in the [environment chapter](./environment.md).

## Filesystem commands

Nu also provides some basic filesystem commands that work cross-platform.

We can move an item from one place to another using the [`mv`](/commands/docs/mv.md) command:

@[code](@snippets/moving_around/mv_example.sh)

We can copy an item from one location to another with the [`cp`](/commands/docs/cp.md) command:

@[code](@snippets/moving_around/cp_example.sh)

We can remove an item with the [`rm`](/commands/docs/rm.md) command:

@[code](@snippets/moving_around/rm_example.sh)

The three commands also can use the glob capabilities we saw earlier with [`ls`](/commands/docs/ls.md).

Finally, we can create a new directory using the [`mkdir`](/commands/docs/mkdir.md) command:

@[code](@snippets/moving_around/mkdir_example.sh)
