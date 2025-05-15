# How Nushell Code Gets Run

In [Thinking in Nu](./thinking_in_nu.md#think-of-nushell-as-a-compiled-language), we encouraged you to _"Think of Nushell as a compiled language"_ due to the way in which Nushell code is processed. We also covered several code examples that won't work in Nushell due that process.

The underlying reason for this is a strict separation of the **_parsing and evaluation_** stages that **_disallows `eval`-like functionality_**. In this section, we'll explain in detail what this means, why we're doing it, and what the implications are. The explanation aims to be as simple as possible, but it might help if you've programmed in another language before.

[[toc]]

## Interpreted vs. Compiled Languages

### Interpreted Languages

Nushell, Python, and Bash (and many others) are _"interpreted"_ languages.

Let's start with a simple "Hello, World!" Nushell program:

```nu
# hello.nu

print "Hello, World!"
```

Of course, this runs as expected using `nu hello.nu`. A similar program written in Python or Bash would look (and behave) nearly the same.

In _"interpreted languages"_ code usually gets handled something like this:

```text
Source Code → Interpreter → Result
```

Nushell follows this pattern, and its "Interpreter" is split into two parts:

1. `Source Code → Parser → Intermediate Representation (IR)`
2. `IR → Evaluation Engine → Result`

First, the source code is analyzed by the Parser and converted into an intermediate representation (IR), which in Nushell's case is just a collection of data structures. Then, these data structures are passed to the Engine for evaluation and output of the results.

This, as well, is common in interpreted languages. For example, Python's source code is typically [converted into bytecode](https://github.com/python/cpython/blob/main/InternalDocs/interpreter.md) before evaluation.

### Compiled Languages

On the other side are languages that are typically "compiled", such as C, C++, or Rust. For example, here's a simple _"Hello, World!"_ in Rust:

```rust
// main.rs

fn main() {
    println!("Hello, World!");
}
```

To "run" this code, it must be:

1. Compiled into [machine code instructions](https://en.wikipedia.org/wiki/Machine_code)
2. The compilation results stored as a binary file on the disk

The first two steps are handled with `rustc main.rs`.

3. Then, to produce a result, you need to run the binary (`./main`), which passes the instructions to the CPU

So:

1. `Source Code ⇒ Compiler ⇒ Machine Code`
2. `Machine Code ⇒ CPU ⇒ Result`

::: important
You can see that the compile-run sequence is not much different from the parse-evaluate sequence of an interpreter. You begin with source code, parse (or compile) it into some state (e.g., bytecode, IR, machine code), then evaluate (or run) the IR to get a result. You could think of machine code as just another type of IR and the CPU as its interpreter.

One big difference, however, between interpreted and compiled languages is that interpreted languages typically implement an _`eval` function_ while compiled languages do not. What does this mean?
:::

## Dynamic vs. Static Languages

::: tip Terminology
In general, the difference between a dynamic and static language is how much of the source code is resolved during Compilation (or Parsing) vs. Evaluation/Runtime:

- _"Static"_ languages perform more code analysis (e.g., type-checking, [data ownership](https://doc.rust-lang.org/stable/book/ch04-00-understanding-ownership.html)) during Compilation/Parsing.

- _"Dynamic"_ languages perform more code analysis, including `eval` of additional code, during Evaluation/Runtime.

For the purposes of this discussion, the primary difference between a static and dynamic language is whether or not it has an `eval` function.

:::

### Eval Function

Most dynamic, interpreted languages have an `eval` function. For example, [Python `eval`](https://docs.python.org/3/library/functions.html#eval) (also, [Python `exec`](https://docs.python.org/3/library/functions.html#exec)) or [Bash `eval`](https://linux.die.net/man/1/bash).

The argument to an `eval` is _"source code inside of source code"_, typically conditionally or dynamically computed. This means that, when an interpreted language encounters an `eval` in source code during Parse/Eval, it typically interrupts the normal Evaluation process to start a new Parse/Eval on the source code argument to the `eval`.

Here's a simple Python `eval` example to demonstrate this (potentially confusing!) concept:

```python:line-numbers
# hello_eval.py

print("Hello, World!")
eval("print('Hello, Eval!')")
```

When you run the file (`python hello_eval.py`), you'll see two messages: _"Hello, World!"_ and _"Hello, Eval!"_. Here is what happens:

1. The entire program is Parsed
2. (Line 3) `print("Hello, World!")` is Evaluated
3. (Line 4) In order to evaluate `eval("print('Hello, Eval!')")`:
   1. `print('Hello, Eval!')` is Parsed
   2. `print('Hello, Eval!')` is Evaluated

::: tip More fun
Consider `eval("eval(\"print('Hello, Eval!')\")")` and so on!
:::

Notice how the use of `eval` here adds a new "meta" step into the execution process. Instead of a single Parse/Eval, the `eval` creates additional, "recursive" Parse/Eval steps instead. This means that the bytecode produced by the Python interpreter can be further modified during the evaluation.

Nushell does not allow this.

As mentioned above, without an `eval` function to modify the bytecode during the interpretation process, there's very little difference (at a high level) between the Parse/Eval process of an interpreted language and that of the Compile/Run in compiled languages like C++ and Rust.

::: tip Takeaway
This is why we recommend that you _"think of Nushell as a compiled language"_. Despite being an interpreted language, its lack of `eval` gives it some of the characteristic benefits as well as limitations common in traditional static, compiled languages.
:::

We'll dig deeper into what it means in the next section.

## Implications

Consider this Python example:

```python:line-numbers
exec("def hello(): print('Hello eval!')")
hello()
```

::: note
We're using `exec` in this example instead of `eval` because it can execute any valid Python code rather than being limited to `eval` expressions. The principle is similar in both cases, though.
:::

During interpretation:

1. The entire program is Parsed
2. In order to Evaluate Line 1:
   1. `def hello(): print('Hello eval!')` is Parsed
   2. `def hello(): print('Hello eval!')` is Evaluated
3. (Line 2) `hello()` is evaluated.

Note, that until step 2.2, the interpreter has no idea that a function `hello` even exists! This makes [static analysis](https://en.wikipedia.org/wiki/Static_program_analysis) of dynamic languages challenging. In this example, the existence of the `hello` function cannot be checked just by parsing (compiling) the source code. The interpreter must evaluate (run) the code to discover it.

- In a static, compiled language, a missing function is guaranteed to be caught at compile-time.
- In a dynamic, interpreted language, however, it becomes a _possible_ runtime error. If the `eval`-defined function is conditionally called, the error may not be discovered until that condition is met in production.

::: important
In Nushell, there are **exactly two steps**:

1. Parse the entire source code
2. Evaluate the entire source code

This is the complete Parse/Eval sequence.
:::

::: tip Takeaway
By not allowing `eval`-like functionality, Nushell prevents these types of `eval`-related bugs. Calling a non-existent definition is guaranteed to be caught at parse-time in Nushell.

Furthermore, after parsing completes, we can be certain the bytecode (IR) won't change during evaluation. This gives us a deep insight into the resulting bytecode (IR), allowing for powerful and reliable static analysis and IDE integration which can be challenging to achieve with more dynamic languages.

In general, you have more peace of mind that errors will be caught earlier when scaling Nushell programs.
:::

## The Nushell REPL

As with most any shell, Nushell has a _"Read→Eval→Print Loop"_ ([REPL](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop)) that is started when you run `nu` without any file. This is often thought of, but isn't quite the same, as the _"commandline"_.

::: tip Note
In this section, the `> ` character at the beginning of a line in a code-block is used to represent the commandline **_prompt_**. For instance:

```nu
> some code...
```

Code after the prompt in the following examples is executed by pressing the <kbd>Enter</kbd> key. For example:

```nu
> print "Hello world!"
# => Hello world!

> ls
# => prints files and directories...
```

The above means:

- From inside Nushell (launched with `nu`):
  1. Type `print "Hello world!"`
  1. Press <kbd>Enter</kbd>
  1. Nushell will display the result
  1. Type `ls`
  1. Press <kbd>Enter</kbd>
  1. Nushell will display the result

:::

When you press <kbd>Enter</kbd> after typing a commandline, Nushell:

1. **_(Read):_** Reads the commandline input
1. **_(Evaluate):_** Parses the commandline input
1. **_(Evaluate):_** Evaluates the commandline input
1. **_(Evaluate):_** Merges the environment (such as the current working directory) to the internal Nushell state
1. **_(Print):_** Displays the results (if non-`null`)
1. **_(Loop):_** Waits for another input

In other words, each REPL invocation is its own separate parse-evaluation sequence. By merging the environment back to the Nushell's state, we maintain continuity between the REPL invocations.

Compare a simplified version of the [`cd` example](./thinking_in_nu.md#example-change-to-a-different-directory-cd-and-source-a-file) from _"Thinking in Nu"_:

```nu
cd spam
source-env foo.nu
```

There we saw that this cannot work (as a script or other single expression) because the directory will be changed _after_ the parse-time [`source-env` keyword](/commands/docs/source-env.md) attempts to read the file.

Running these commands as separate REPL entries, however, works:

```nu
> cd spam
> source-env foo.nu
# Yay, works!
```

To see why, let's break down what happens in the example:

1. Read the `cd spam` commandline.
2. Parse the `cd spam` commandline.
3. Evaluate the `cd spam` commandline.
4. Merge environment (including the current directory) into the Nushell state.
5. Read and Parse `source-env foo.nu`.
6. Evaluate `source-env foo.nu`.
7. Merge environment (including any changes from `foo.nu`) into the Nushell state.

When `source-env` tries to open `foo.nu` during the parsing in Step 5, it can do so because the directory change from Step 3 was merged into the Nushell state during Step 4. As a result, it's visible in the following Parse/Eval cycles.

### Multiline REPL Commandlines

Keep in mind that this only works for **_separate_** commandlines.

In Nushell, it's possible to group multiple commands into one commandline using:

- A semicolon:

  ```nu
  cd spam; source-env foo.nu
  ```

- A newline:

  ```
  > cd span
    source-env foo.nu
  ```

  Notice there is no "prompt" before the second line. This type of multiline commandline is usually created with a [keybinding](./line_editor.md#keybindings) to insert a Newline when <kbd>Alt</kbd>+<kbd>Enter</kbd> or <kbd>Shift</kbd>+ <kbd>Enter</kbd> is pressed.

These two examples behave exactly the same in the Nushell REPL. The entire commandline (both statements) are processed a single Read→Eval→Print Loop. As such, they will fail the same way that the earlier script-example did.

::: tip
Multiline commandlines are very useful in Nushell, but watch out for any out-of-order Parser-keywords.
:::

## Parse-time Constant Evaluation

While it is impossible to add parsing into the evaluation stage and yet still maintain our static-language benefits, we can safely add _a little bit_ of evaluation into parsing.

::: tip Terminology
In the text below, we use the term _"constant"_ to refer to:

- A `const` definition
- The result of any command that outputs a constant value when provide constant inputs.
  :::

By their nature, **_constants_** and constant values are known at Parse-time. This, of course, is in sharp contrast to _variable_ declarations and values.

As a result, we can utilize constants as safe, known arguments to parse-time keywords like [`source`](/commands/docs/source.md), [`use`](/commands/docs/use.md), and related commands.

Consider [this example](./thinking_in_nu.md#example-dynamically-creating-a-filename-to-be-sourced) from _"Thinking in Nu"_:

```nu
let my_path = "~/nushell-files"
source $"($my_path)/common.nu"
```

As noted there, we **_can_**, however, do the following instead:

```nu:line-numbers
const my_path = "~/nushell-files"
source $"($my_path)/common.nu"
```

Let's analyze the Parse/Eval process for this version:

1. The entire program is Parsed into IR.

   1. Line 1: The `const` definition is parsed. Because it is a constant assignment (and `const` is also a parser-keyword), that assignment can also be Evaluated at this stage. Its name and value are stored by the Parser.
   2. Line 2: The `source` command is parsed. Because `source` is also a parser-keyword, it is Evaluated at this stage. In this example, however, it can be **_successfully_** parsed since its argument is **_known_** and can be retrieved at this point.
   3. The source-code of `~/nushell-files/common.nu` is parsed. If it is invalid, then an error will be generated, otherwise the IR results will be included in evaluation in the next stage.

2. The entire IR is Evaluated:
   1. Line 1: The `const` definition is Evaluated. The variable is added to the runtime stack.
   2. Line 2: The IR result from parsing `~/nushell-files/common.nu` is Evaluated.

::: important

- An `eval` adds additional parsing during evaluation
- Parse-time constants do the opposite, adding additional evaluation to the parser.
  :::

Also keep in mind that the evaluation allowed during parsing is **_very restricted_**. It is limited to only a small subset of what is allowed during a regular evaluation.

For example, the following is not allowed:

```nu
const foo_contents = (open foo.nu)
```

Put differently, only a small subset of commands and expressions can generate a constant value. For a command to be allowed:

- It must be designed to output a constant value
- All of its inputs must also be constant values, literals, or composite types (e.g., records, lists, tables) of literals.

In general, the commands and resulting expressions will be fairly simple and **_without side effects_**. Otherwise, the parser could all-too-easily enter an unrecoverable state. Imagine, for instance, attempting to assign an infinite stream to a constant. The Parse stage would never complete!

::: tip
You can see which Nushell commands can return constant values using:

```nu
help commands | where is_const
```

:::

For example, the `path join` command can output a constant value. Nushell also defines several useful paths in the `$nu` constant record. These can be combined to create useful parse-time constant evaluations like:

```nu
const my_startup_modules =  $nu.default-config-dir | path join "my-mods"
use $"($my_startup_modules)/my-utils.nu"
```

::: note Additional Notes
Compiled ("static") languages also tend to have a way to convey some logic at compile time. For instance:

- C's preprocessor
- Rust macros
- [Zig's comptime](https://kristoff.it/blog/what-is-zig-comptime), which was an inspiration for Nushell's parse-time constant evaluation.

There are two reasons for this:

1. _Increasing Runtime Performance:_ Logic in the compilation stage doesn't need to be repeated during runtime.

   This isn't currently applicable to Nushell, since the parsed results (IR) are not stored beyond Evaluation. However, this has certainly been considered as a possible future feature.

2. As with Nushell's parse-time constant evaluations, these features help (safely) work around limitations caused by the absence of an `eval` function.
   :::

## Conclusion

Nushell operates in a scripting language space typically dominated by _"dynamic"_, _"interpreted"_ languages, such as Python, Bash, Zsh, Fish, and many others. Nushell is also _"interpreted"_ since code is run immediately (without a separate, manual compilation).

However, is not _"dynamic"_ in that it does not have an `eval` construct. In this respect, it shares more in common with _"static"_, compiled languages like Rust or Zig.

This lack of `eval` is often surprising to many new users and is why it can be helpful to think of Nushell as a compiled, and static, language.
