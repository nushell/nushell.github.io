# Thinking in Nu

Nushell is different! It's common (and expected!) for new users to have some existing "habits" or mental models coming from other shells or languages.

The most common questions from new users typically fall into one of the following topics:

[[toc]]

## Nushell isn't Bash

### It can sometimes look like Bash

Nushell is both a programming language and a shell. Because of this, it has its own way of working with files, directories, websites, and more. You'll find that some features in Nushell work similar to those you're familiar with in other shells. For instance, pipelines work by combining two (or more) commands together, just like in other shells.

For example, the following commandline works the same in both Bash and Nushell on Unix/Linux platforms:

```nu
curl -s https://api.github.com/repos/nushell/nushell/contributors | jq '.[].login'
# => returns contributors to Nushell, ordered by number of contributions
```

Nushell has many other similarities with Bash (and other shells) and many commands in common.

::: tip
Bash is primarily a command interpreter which runs external commands. Nushell provides many of these as cross-platform, built-in commands.

While the above commandline works in both shells, in Nushell there's just no need to use the `curl` and `jq` commands. Instead, Nushell has a built-in [`http get` command](/commands/docs/http_get.md) and handles JSON data natively. For example:

```nu
http get https://api.github.com/repos/nushell/nushell/contributors | select login contributions
```

:::

::: warning Thinking in Nushell
Nushell borrows concepts from many shells and languages. You'll likely find many of Nushell's features familiar.
:::

### But it's not Bash

Because of this, however, it's sometimes easy to forget that some Bash (and POSIX in general) style constructs just won't work in Nushell. For instance, in Bash, it would be normal to write:

```sh
# Redirect using >
echo "hello" > output.txt
# But compare (greater-than) using the test command
test 4 -gt 7
echo $?
# => 1
```

In Nushell, however, the `>` is used as the greater-than operator for comparisons. This is more in line with modern programming expectations.

```nu
4 > 10
# => false
```

Since `>` is an operator, redirection to a file in Nushell is handled through a pipeline command that is dedicated to saving content - [`save`](/commands/docs/save.md):

```nu
"hello" | save output.txt
```

::: warning Thinking in Nushell
We've put together a list of common Bash'isms and how to accomplish those tasks in Nushell in the [Coming from Bash](./coming_from_bash.md) Chapter.
:::

## Implicit Return

Users coming from other shells will likely be very familiar with the `echo` command. Nushell's
[`echo`](/commands/docs/echo.md) might appear the same at first, but it is _very_ different.

First, notice how the following output _looks_ the same in both Bash and Nushell (and even PowerShell and Fish):

```nu
echo "Hello, World"
# => Hello, World
```

But while the other shells are sending `Hello, World` straight to _standard output_, Nushell's `echo` is
simply _returning a value_. Nushell then _renders_ the return value of a command, or more technically, an _expression_.

More importantly, Nushell _implicitly returns_ the value of an expression. This is similar to PowerShell or Rust in many respects.

::: tip
An expression can be more than just a pipeline. Even custom commands (similar to functions in many languages, but we'll cover them more in depth in a [later chapter](./custom_commands.md)) automatically, implicitly _return_ the last value. There's no need for an `echo` or even a [`return` command](/commands/docs/return.md) to return a value - It just _happens_.
:::

In other words, the string _"Hello, World"_ and the output value from `echo "Hello, World"` are equivalent:

```nu
"Hello, World" == (echo "Hello, World")
# => true
```

Here's another example with a custom command definition:

```nu
def latest-file [] {
    ls | sort-by modified | last
}
```

The _output_ of that pipeline (its _"value"_) becomes the _return value_ of the `latest-file` custom command.

::: warning Thinking in Nushell
Most anywhere you might write `echo <something>`, in Nushell, you can just write `<something>` instead.
:::

## Single Return Value per Expression

It's important to understand that an expression can only return a single value. If there are multiple subexpressions inside an expression, only the **_last_** value is returned.

A common mistake is to write a custom command definition like this:

```nu:line-numbers
def latest-file [] {
    echo "Returning the last file"
    ls | sort-by modified | last
}

latest-file
```

New users might expect:

- Line 2 to output _"Returning the last file"_
- Line 3 to return/output the file

However, remember that `echo` **_returns a value_**. Since only the last value is returned, the Line 2 _value_ is discarded. Only the file will be returned by line 3.

To make sure the first line is _displayed_, use the [`print` command](/commands/docs/print.md):

```nu
def latest-file [] {
    print "Returning last file"
    ls | sort-by modified | last
}
```

Also compare:

```nu
40; 50; 60
```

::: tip
A semicolon is the same as a newline in a Nushell expression. The above is the same as a file or multi-line command:

```nu
40
50
60
```

or

```nu
echo 40
echo 50
echo 60
```

See Also: [Multi-line Editing](./line_editor.md#multi-line-editing)
:::

In all of the above:

- The first value is evaluated as the integer 40 but is not returned
- The second value is evaluated as the integer 50 but is not returned
- The third value is evaluated as the integer 60, and since it is the last
  value, it is is returned and displayed (rendered).

::: warning Thinking in Nushell
When debugging unexpected results, be on the lookout for:

- Subexpressions (e.g., commands or pipelines) that ...
- ... output a (non-`null`) value ...
- ... where that value isn't returned from the parent expression.

These can be likely sources of issues in your code.
:::

## Every Command Returns a Value

Some languages have the concept of "statements" which don't return values. Nushell does not.

In Nushell, **_every command returns a value_**, even if that value is `null` (the `nothing` type). Consider the following multiline expression:

```nu:line-numbers
let p = 7
print $p
$p * 6
```

1. Line 1: The integer 7 is assigned to `$p`, but the return value of the
   [`let` command](/commands/docs/let.md) itself is `null`. However, because it is not the last
   value in the expression, it is not displayed.
2. Line 2: The return value of the `print` command itself is `null`, but the `print` command
   forces its argument (`$p`, which is 7) to be _displayed_. As with Line 1, the `null` return value
   is discarded since this isn't the last value in the expression.
3. Line 3: Evaluates to the integer value 42. As the last value in the expression, this is the return
   result, and is also displayed (rendered).

::: warning Thinking in Nushell
Becoming familiar with the output types of common commands will help you understand how
to combine simple commands together to achieve complex results.

`help <command>` will show the signature, including the output type(s), for each command in Nushell.
:::

## Think of Nushell as a Compiled Language

In Nushell, there are exactly two, separate, high-level stages when running code:

1. _Stage 1 (Parser):_ Parse the **_entire_** source code
2. _Stage 2 (Engine):_ Evaluate the **_entire_** source code

It can be useful to think of Nushell's parsing stage as _compilation_ in [static](./how_nushell_code_gets_run.md#dynamic-vs-static-languages) languages like Rust or C++. By this, we mean that all of the code that will be evaluated in Stage 2 must be **_known and available_** during the parsing stage.

::: important
However, this also means that Nushell cannot currently support an `eval` construct as with _dynamic_ languages such as Bash or Python.
:::

### Features Built on Static Parsing

On the other hand, the **_static_** results of Parsing are key to many features of Nushell its REPL, such as:

- Accurate and expressive error messages
- Semantic analysis for earlier and robust detection of error conditions
- IDE integration
- The type system
- The module system
- Completions
- Custom command argument parsing
- Syntax highlighting
- Real-time error highlighting
- Profiling and debugging commands
- (Future) Formatting
- (Future) Saving IR (Intermediate Representation) "compiled" results for faster execution

### Limitations

The static nature of Nushell often leads to confusion for users coming to Nushell from languages where an `eval` is available.

Consider a simple two-line file:

```text
<line1 code>
<line2 code>
```

1. Parsing:
   1. Line 1 is parsed
   2. Line 2 is parsed
2. If parsing was successful, then Evaluation:
   1. Line 1 is evaluated
   2. Line 2 is evaluated

This helps demonstrate why the following examples cannot run as a single expression (e.g., a script) in Nushell:

::: note
The following examples use the [`source` command](/commands/docs/source.md), but similar conclusions apply to other commands that parse Nushell source code, such as [`use`](/commands/docs/use.md), [`overlay use`](/commands/docs/overlay_use.md), [`hide`](/commands/docs/hide.md) or [`source-env`](/commands/docs/source-env.md).

:::

#### Example: Dynamically Generating Source

Consider this scenario:

```nu
"print Hello" | save output.nu
source output.nu
# => Error: nu::parser::sourced_file_not_found
# =>
# =>   × File not found
# =>    ╭─[entry #5:2:8]
# =>  1 │ "print Hello" | save output.nu
# =>  2 │ source output.nu
# =>    ·        ────┬────
# =>    ·            ╰── File not found: output.nu
# =>    ╰────
# =>   help: sourced files need to be available before your script is run
```

This is problematic because:

1. Line 1 is parsed but not evaluated. In other words, `output.nu` is not created during the parsing stage, but only during evaluation.
2. Line 2 is parsed. Because `source` is a parser-keyword, resolution of the sourced file is attempted during Parsing (Stage 1). But `output.nu` doesn't even exist yet! If it _does_ exist, then it's probably not even the correct file! This results in the error.

::: note
Typing these as two _separate_ lines in the **_REPL_** will work since the first line will be parsed and evaluated, then the second line will be parsed and evaluated.

The limitation only occurs when both are parsed _together_ as a single expression, which could be part of a script, block, closure, or other expression.

See the [REPL](./how_nushell_code_gets_run.md#the-nushell-repl) section in _"How Nushell Code Gets Run"_ for more explanation.
:::

#### Example: Dynamically Creating a Filename to be Sourced

Another common scenario when coming from another shell might be attempting to dynamically create a filename that will be sourced:

```nu
let my_path = "~/nushell-files"
source $"($my_path)/common.nu"
# => Error:
# =>   × Error: nu::shell::not_a_constant
# =>   │
# =>   │   × Not a constant.
# =>   │    ╭─[entry #6:2:11]
# =>   │  1 │ let my_path = "~/nushell-files"
# =>   │  2 │ source $"($my_path)/common.nu"
# =>   │    ·           ────┬───
# =>   │    ·               ╰── Value is not a parse-time constant
# =>   │    ╰────
# =>   │   help: Only a subset of expressions are allowed constants during parsing. Try using the 'const' command or typing the value literally.
# =>   │
# =>    ╭─[entry #6:2:8]
# =>  1 │ let my_path = "~/nushell-files"
# =>  2 │ source $"($my_path)/common.nu"
# =>    ·        ───────────┬───────────
# =>    ·                   ╰── Encountered error during parse-time evaluation
# =>    ╰────
```

Because the `let` assignment is not resolved until evaluation, the parser-keyword `source` will fail during parsing if passed a variable.

::: details Comparing Rust and C++
Imagine that the code above was written in a typical compiled language such as C++:

```cpp
#include <string>

std::string my_path("foo");
#include <my_path + "/common.h">
```

or Rust

```rust
let my_path = "foo";
use format!("{}::common", my_path);
```

If you've ever written a simple program in any of these languages, you can see these examples aren't valid in those languages. Like Nushell, compiled languages require that all of the source code files are ready and available to the compiler beforehand.

:::

::: tip See Also
As noted in the error message, however, this can work if `my_path` can be defined as a [constant](/book/variables#constant-variables) since constants can be (and are) resolved during parsing.

```nu
const my_path = "~/nushell-files"
source $"($my_path)/common.nu"
```

See [Parse-time Constant Evaluation](./how_nushell_code_gets_run.md#parse-time-constant-evaluation) for more details.
:::

#### Example: Change to a different directory (`cd`) and `source` a file

Here's one more — Change to a different directory and then attempt to `source` a file in that directory.

```nu:line-numbers
if ('spam/foo.nu' | path exists) {
    cd spam
    source-env foo.nu
}
```

Based on what we've covered about Nushell's Parse/Eval stages, see if you can spot the problem with that example.

::: details Solution

In line 3, during Parsing, the `source-env` attempts to parse `foo.nu`. However, `cd` doesn't occur until Evaluation. This results in a parse-time error, since the file is not found in the _current_ directory.

To resolve this, of course, simply use the full-path to the file to be sourced.

```nu
    source-env spam/foo.nu
```

:::

### Summary

::: important
For a more in-depth explanation of this section, see [How Nushell Code Gets Run](how_nushell_code_gets_run.md).
:::

::: warning Thinking in Nushell
Nushell is designed to use a single Parsing stage for each expression or file. This Parsing stage occurs before and is separate from Evaluation. While this enables many of Nushell's features, it also means that users need to understand the limitations it creates.
:::

## Variables are Immutable by Default

Another common surprise when coming from other languages is that Nushell variables are immutable by default. While Nushell has optional mutable variables, many of Nushell's commands are based on a functional-style of programming which requires immutability.

Immutable variables are also key to Nushell's [`par-each` command](/commands/docs/par-each.md), which allows you to operate on multiple values in parallel using threads.

See [Immutable Variables](variables.html#immutable-variables) and [Choosing between mutable and immutable variables](variables.html#choosing-between-mutable-and-immutable-variables) for more information.

::: warning Thinking in Nushell
If you're used to relying on mutable variables, it may take some time to relearn how to code in a more functional style. Nushell has many functional features and commands that operate on and with immutable variables. Learning them will help you write code in a more Nushell-idiomatic style.

A nice bonus is the performance increase you can realize by running parts of your code in parallel with `par-each`.
:::

## Nushell's Environment is Scoped

Nushell takes multiple design cues from compiled languages. One such cue is that languages should avoid global mutable state. Shells have commonly used global mutation to update the environment, but Nushell attempts to steer clear of this approach.

In Nushell, blocks control their own environment. Changes to the environment are scoped to the block where they occur.

In practice, this lets you write (as just one example) more concise code for working with subdirectories. Here's an example that builds each sub-project in the current directory:

```nu
ls | each { |row|
  cd $row.name
  make
}
```

The [`cd`](/commands/docs/cd.md) command changes the `PWD` environment variables, but this variable change does not survive past the end of the block. This allows each iteration to start from the current directory and then enter the next subdirectory.

Having a scoped environment makes commands more predictable, easier to read, and when the time comes, easier to debug. It's also another feature that is key to the `par-each` command we discussed above.

Nushell also provides helper commands like [`load-env`](/commands/docs/load-env.md) as a convenient way of loading multiple updates to the environment at once.

::: tip See Also
[Environment - Scoping](./environment.md#scoping)
:::

::: note
[`def --env`](/commands/docs/def.md) is an exception to this rule. It allows you to create a command that changes the parent's environment.
:::

::: warning Thinking in Nushell
Use scoped-environment to write more concise scripts and prevent unnecessary or unwanted global environment mutation.
:::
