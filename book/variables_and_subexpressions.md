# Variables and Subexpressions

There are two types of evaluation expressions in Nushell: variables and subexpressions. You know that you're looking at an evaluation expression because it begins with a dollar sign (`$`). This indicates that when Nushell gets the value in this position, it will need to run an evaluation step to process the expression and then use the resulting value. Both evaluation expression forms support a simple form and a 'path' form for working with more complex data.

## Variables

The simpler of the two evaluation expressions is the variable. During evaluation, a variable is replaced by its value.

If we create a variable, we can print its contents by using `$` to refer to it:

```
> let my-value = 4
> echo $my-value
4
```
Variables in Nushell are immutable, that means that you can not change its value after declaration.
They can be shadowed in nested block, that results in:

```
> let my-value = 4
> do { let my-value = 5; echo $my-value }
5
> echo $my-value
4
```

## Variable paths

A variable path works by reaching inside of the contents of a variable, navigating columns inside of it, to reach a final value. Let's say instead of `4`, we had assigned a table value:

```
> let my-value = [[name]; [testuser]]
```

We can use a variable path to evaluate the variable `$my-value` and get the value from the `name` column in a single step:

```
> echo $my-value.name
testuser
```

## Subexpressions

You can always evaluate a subexpression and use its result by wrapping the expression with parentheses `()`. Note that previous versions of Nushell (prior to 0.32) used `$()`.

The parentheses contain a pipeline that will run to completion, and the resulting value will then be used. For example, `(ls)` would run the [`ls`](commands/ls.md) command and give back the resulting table and `(git branch --show-current)` runs the external git command and returns a string with the name of the current branch. You can also use parentheses to run math expressions like `(2 + 3)`.

Subexpressions can also be pipelines and not just single commands. If we wanted to get a list of filenames larger than ten kilobytes, we can use an subexpression to run a pipeline and assign this to a variable:

```
> let names-of-big-files = (ls | where size > 10kb)
> echo $names-of-big-files
───┬────────────┬──────┬──────────┬──────────────
 # │    name    │ type │   size   │   modified   
───┼────────────┼──────┼──────────┼──────────────
 0 │ Cargo.lock │ File │ 155.3 KB │ 17 hours ago 
 1 │ README.md  │ File │  15.9 KB │ 17 hours ago 
───┴────────────┴──────┴──────────┴──────────────
```

## Subexpressions and paths

Subexpressions also support paths. For example, let's say we wanted to get a list of the filenames in the current directory. One way to do this is to use a pipeline:

```
> ls | get name
```

We can do a very similar action in a single step using a subexpression path:

```
> echo (ls).name
```

It depends on the needs of the code and your particular style which form works best for you.

## Short-hand subexpressions (row conditions)

Nushell supports accessing columns in a subexpression using a simple short-hand. You may have already used this functionality before. If, for example, we wanted to only see rows from [`ls`](commands/ls.md) where the entry is at least ten kilobytes we can write:

```
> ls | where size > 10kb
```

The `where size > 10kb` is a command with two parts: the command name [`where`](commands/where.md) and the short-hand expression `size > 10kb`. We say short-hand because `size` here is the shortened version of writing `$it.size`. This could also be written in any of the following ways:

```
> ls | where $it.size > 10kb
> ls | where ($it.size > 10kb)
> ls | where {|$it| $it.size > 10kb }
```

For short-hand syntax to work, the column name must appear on the left-hand side of the operation (like `size` in `size > 10kb`).
