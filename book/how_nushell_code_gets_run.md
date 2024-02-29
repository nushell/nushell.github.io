# How Nushell Code Gets Run

As you probably noticed, Nushell behaves quite differently from other shells and dynamic languages. In [Thinking in Nu](thinking_in_nu.md#think-of-nushell-as-a-compiled-language), we advise you to _think of Nushell as a compiled language_ but we do not give much insight into why. This section hopefully fills the gap.

First, let's give a few example which you might intuitively try but which do not work in Nushell.

1. Sourcing a dynamic path (note that a constant would work, see [parse-time evaluation](#parse-time-evaluation))

```nu
let my_path = 'foo'
source $"($my_path)/common.nu"
```

2. Write to a file and source it in a single script

```nu
"def abc [] { 1 + 2 }" | save output.nu
source "output.nu"
```

3. Change a directory and source a path within (even though the file exists)

```nu
if ('spam/foo.nu' | path exists) {
    cd spam
    source-env foo.nu
}
```

The underlying reason why all of the above examples won't work is a strict separation of **parsing and evaluation** steps by **disallowing eval function**. In the rest of this section, we'll explain in detail what it means, why we're doing it, and what the implications are. The explanation aims to be as simple as possible, but it might help if you've written a program in some language before.

## Parsing and Evaluation

### Interpreted Languages

Let's start with a simple "hello world" Nushell program:

```nu
# hello.nu

print "Hello world!"
```

When you run `nu hello.nu`, Nushell's interpreter directly runs the program and prints the result to the screen. This is similar (on the highest level) to other languages that are typically interpreted, such as Python or Bash. If you write a similar "hello world" program in any of these languages and call `python hello.py` or `bash hello.bash`, the result will be printed to the screen. We can say that interpreters take the program in some representation (e.g., a source code), run it, and give you the result:

```
source code --> interpreting --> result
```

Under the hood, Nushell's interpreter is split into two parts, like this:

```
1. source code --> parsing --> Intermediate Representation (IR)
2. IR --> evaluating --> result
```

First, the source code is analyzed by the parser and converted into an intermediate representation (IR), which in Nushell's case are just some data structures. Then, these data structures are passed to the engine which evaluates them and produces the result. This is nothing unusual. For example, Python's source code is typically converted into [bytecode](https://en.wikipedia.org/wiki/Bytecode) before evaluation.

### Compiled Languages

On the other side are languages that are typically "compiled", such as C, C++, or Rust. Assuming a simple ["hello world"](https://doc.rust-lang.org/stable/book/ch01-02-hello-world.html) in Rust

```rust
// main.rs

fn main() {
    println!("Hello, world!");
}
```

you first need to _compile_ the program into [machine code instructions](https://en.wikipedia.org/wiki/Machine_code) and store the binary file to a disk (`rustc main.rs`). Then, to produce a result, you need to run the binary (`./main`), which passes the instructions to the CPU:

```
1. source code --> compiler --> machine code
2. machine code --> CPU --> result
```

You can see the compile-run sequence is not that much different from the parse-evaluate sequence of an interpreter. You begin with a source code, parse (or compile) it into some IR (or machine code), then evaluate (or run) the IR to get a result. You could think of machine code as just another type of IR and the CPU as its interpreter.

One big difference, however, between interpreted and compiled languages is that interpreted languages typically implement an _eval function_ while compiled languages do not. What does it mean?

### Eval Function

Most languages considered as "dynamic" or "interpreted" have an eval function, for example Python (it has two, [eval](https://docs.python.org/3/library/functions.html#eval) and [exec](https://docs.python.org/3/library/functions.html#exec)) or [Bash](https://linux.die.net/man/1/bash). It is used to take source code and interpret it within a running interpreter. This can get a bit confusing, so let's give a Python example:

```python
# hello_eval.py

print("Hello world!")
eval("print('Hello eval!')")
```

When you run the file (`python hello_eval.py`), you'll see two messages: "Hello world!" and "Hello eval!". Here is what happened:

1. Parse the whole source code
2. Evaluate `print("Hello world!")`
3. To evaluate `eval("print('Hello eval!')")`:
    1. Parse `print('Hello eval!')`
    2. Evaluate `print('Hello eval!')`

Of course, you can have more fun and try `eval("eval(\"print('Hello eval!')\")")` and so on...

You can see the eval function adds a new "meta" layer into the code execution. Instead of parsing the whole source code, then evaluating it, there is an extra parse-eval step during the evaluation. This means that the IR produced by the parser (whatever it is) can be further modified during the evaluation.

We've seen that without `eval`, the difference between compiled and interpreted languages is actually not that big. This is exactly what we mean by [thinking of Nushell as a compiled language](https://www.nushell.sh/book/thinking_in_nu.html#think-of-nushell-as-a-compiled-language): Despite Nushell being an interpreted language, its lack of `eval` gives it characteristics and limitations typical for traditional compiled languages like C or Rust. We'll dig deeper into what it means in the next section.

## Implications

Consider this Python example:

```python
exec("def hello(): print('Hello eval!')")
hello()
```

_Note: We're using `exec` instead of `eval` because it can execute any valid Python code, not just expressions. The principle is similar, though._

What happens:

1. Parse the whole source code
2. To evaluate `exec("def hello(): print('Hello eval!')")`:
   1. Parse `def hello(): print('Hello eval!')`
   2. Evaluate `def hello(): print('Hello eval!')`
3. Evaluate `hello()`

Note, that until step 2.2, the interpreter has no idea a function `hello` exists! This makes static analysis of dynamic languages challenging. In the example, the existence of `hello` function cannot be checked just by parsing (compiling) the source code. You actually need to go and evaluate (run) the code to find out. While in a compiled language, missing function is a guaranteed compile error, in a dynamic interpreted language, it is a runtime error (which can slip unnoticed if the line calling `hello()` is, for example, behind an `if` condition and does not get executed).

In Nushell, there are **exactly two steps**:

1. Parse the whole source code
2. Evaluate the whole source code

This is the complete parse-eval sequence.

Not having `eval`-like functionality prevents `eval`-related bugs from happening. Calling a non-existent function is 100% guaranteed parse-time error in Nushell. Furthermore, after the parse step, we have a deep insight into the program and we're 100% sure it is not going to change during evaluation. This trivially allows for powerful and reliable static analysis and IDE integration which is challenging to achieve with more dynamic languages. In general, you have more peace of mind when scaling Nushell programs to bigger applications.

_Before going into examples, one note about the "dynamic" and "static" terminology. Stuff that happens at runtime (during evaluation, after parsing) is considered "dynamic". Stuff that happens before running (during parsing / compilation) is called "static". Languages that have more stuff (such as `eval`, type checking, etc.) happening at runtime are sometimes called "dynamic". Languages that analyze most of the information (type checking, [data ownership](https://doc.rust-lang.org/stable/book/ch04-00-understanding-ownership.html), etc.) before evaluating the program are sometimes called "static". The whole debate can get quite confusing, but for the purpose of this text, the main difference between a "static" and "dynamic" language is whether it has or has not the eval function._

## Common Mistakes

By insisting on strict parse-evaluation separation, we lose much of a flexibility users expect from dynamic interpreted languages, especially other shells, such as bash, fish, zsh and others. This leads to the examples at the beginning of this page not working. Let's break them down one by one

_Note: The following examples use [`source`](/commands/docs/source.md), but similar conclusions apply to other commands that parse Nushell source code, such as [`use`](/commands/docs/use.md), [`overlay use`](/commands/docs/overlay_use.md), [`hide`](/commands/docs/hide.md), [`register`](/commands/docs/register.md) or [`source-env`](/commands/docs/source-env.md)._

### 1. Sourcing a dynamic path

```nu
let my_path = 'foo'
source $"($my_path)/common.nu"
```

Let's break down what would need to happen for this to work:

1. Parse `let my_path = 'foo'` and `source $"($my_path)/config.nu"`
2. To evaluate `source $"($my_path)/common.nu"`:
   1. Parse `$"($my_path)/common.nu"`
   2. Evaluate `$"($my_path)/common.nu"` to get the file name
   3. Parse the contents of the file
   4. Evaluate the contents of the file

You can see the process is similar to the `eval` functionality we talked about earlier. Nesting parse-evaluation cycles into the evaluation is not allowed in Nushell.

To give another perspective, here is why it is helpful to _think of Nushell as a compiled language_. Instead of

```nu
let my_path = 'foo'
source $"($my_path)/common.nu"
```

imagine it being written in some typical compiled language, such as C++

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

If you've ever written a simple program in any of these languages, you can see these examples do not make a whole lot of sense. You need to have all the source code files ready and available to the compiler beforehand.

### 2. Write to a file and source it in a single script

```nu
"def abc [] { 1 + 2 }" | save output.nu
source "output.nu"
```

Here, the sourced path is static (= known at parse-time) so everything should be fine, right? Well... no. Let's break down the sequence again:

1. Parse the whole source code
   1. Parse `"def abc [] { 1 + 2 }" | save output.nu`
   2. Parse `source "output.nu"` - 1.2.1. Open `output.nu` and parse its contents
2. Evaluate the whole source code
   1. Evaluate `"def abc [] { 1 + 2 }" | save output.nu` to generate `output.nu`
   2. ...wait what???

We're asking Nushell to read `output.nu` before it even exists. All the source code needs to be available to Nushell at parse-time, but `output.nu` is only generated during evaluation. Again, it helps here to _think of Nushell as a compiled language_.

### 3. Change a directory and source a path within

(We assume the `spam/foo.nu` file exists.)

```nu
if ('spam/foo.nu' | path exists) {
    cd spam
    source-env foo.nu
}
```

This one is similar to the previous example. `cd spam` changes the directory _during evaluation_ but [`source-env`](/commands/docs/source-env.md) attempts to open and read `foo.nu` during parsing.

## REPL

[REPL](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop) is what happens when you run `nu` without any file. You launch an interactive prompt. By

```nu
> some code...
```

we denote a REPL entry followed by pressing Enter. For example

```nu
> print "Hello world!"
Hello world!

> ls
# prints files and directories...
```

means the following:

1. Launch `nu`
2. Type `print "Hello world!"`, press Enter
3. Type [`ls`](/commands/docs/ls.md), press Enter

Hopefully, that's clear. Now, when you press Enter, these things happen:

1. Parse the line input
2. Evaluate the line input
3. Merge the environment (such as the current working directory) to the internal Nushell state
4. Wait for another input

In other words, each REPL invocation is its own separate parse-evaluation sequence. By merging the environment back to the Nushell's state, we maintain continuity between the REPL invocations.

To give an example, we showed that

```nu
cd spam
source-env foo.nu
```

does not work because the directory will be changed _after_ [`source-env`](/commands/docs/source-env.md) attempts to read the file. Running these commands as separate REPL entries, however, works:

```nu
> cd spam

> source-env foo.nu
# yay, works!
```

To see why, let's break down what happens in the example:

1. Launch `nu`
2. Parse `cd spam`
3. Evaluate `cd spam`
4. **Merge environment (including the current directory) into the Nushell state**
5. Parse `source-env foo.nu`
6. Evaluate `source-env foo.nu`
7. Merge environment (including the current directory) into the Nushell state

When [`source-env`](/commands/docs/source-env.md) tries to open `foo.nu` during the parsing in step 5., it can do so because the directory change from step 3. was merged into the Nushell state in step 4. and therefore is visible in the following parse-evaluation cycles.

### Parse-time Evaluation

While it is impossible to add parsing into the evaluation, we can add _a little bit_ of evaluation into parsing. This feature has been added [only recently](https://github.com/nushell/nushell/pull/7436) and we're going to expand it as needed.

One pattern that this unlocks is being able to [`source`](/commands/docs/source.md)/[`use`](/commands/docs/use.md)/etc. a path from a "variable". We've seen that

```nu
let some_path = $nu.default-config-dir
source $"($some_path)/common.nu"
```

does not work, but we can do the following:

```nu
const some_path = $nu.default-config-dir
source $"($some_path)/config.nu"
```

We can break down what is happening again:

1. Parse the whole source code
   1. Parse `const some_path = $nu.default-config-dir`
      1. Evaluate\* `$nu.default-config-dir` to `/home/user/.config/nushell` and store it as a `some_path` constant
   2. Parse `source $"($some_path)/config.nu"`
      1. Evaluate\* `$some_path`, see that it is a constant, fetch it
      2. Evaluate\* `$"($some_path)/config.nu"` to `/home/user/.config/nushell/config.nu`
      3. Parse the `/home/user/.config/nushell/config.nu` file
2. Evaluate the whole source code
   1. Evaluate `const some_path = $nu.default-config-dir` (i.e., add the `/home/user/.config/nushell` string to the runtime stack as `some_path` variable)
   2. Evaluate `source $"($some_path)/config.nu"` (i.e., evaluate the contents of `/home/user/.config/nushell/config.nu`)

This still does not violate our rule of not having an eval function, because an eval function adds additional parsing to the evaluation step. With parse-time evaluation we're doing the opposite.

Also, note the \* in steps 1.1.1. and 1.2.1. The evaluation happening during parsing is very restricted and limited to only a small subset of what is normally allowed during a regular evaluation. For example, the following is not allowed:

```nu
const foo_contents = (open foo.nu)
```

By allowing _everything_ during parse-time evaluation, we could set ourselves up to a lot of trouble (think of generating an infinite stream in a subexpression...). Generally, only a simple expressions _without side effects_ are allowed, such as string literals or integers, or composite types of these literals (records, lists, tables).

Compiled ("static") languages also tend to have a way to convey some logic at compile time, be it C's preprocessor, Rust's macros, or [Zig's comptime](https://kristoff.it/blog/what-is-zig-comptime). One reason is performance (if you can do it during compilation, you save the time during runtime) which is not as important for Nushell because we always do both parsing and evaluation, we do not store the parsed result anywhere (yet?). The second reason is similar to Nushell's: Dealing with limitations caused by the absence of the eval function.

## Conclusion

Nushell operates in a scripting language space typically dominated by "dynamic" "interpreted" languages, such as Python, bash, zsh, fish, etc. While Nushell is also "interpreted" in a sense that it runs the code immediately, instead of storing the intermediate representation (IR) to a disk, one feature sets it apart from the pack: It does not have an **eval function**. In other words, Nushell cannot parse code and manipulate its IR during evaluation. This gives Nushell one characteristic typical for "static" "compiled" languages, such as C or Rust: All the source code must be visible to the parser beforehand, just like all the source code must be available to a C or Rust compiler. For example, you cannot [`source`](/commands/docs/source.md) or [`use`](/commands/docs/use.md) a path computed "dynamically" (during evaluation). This is surprising for users of more traditional scripting languages, but it helps to _think of Nushell as a compiled language_.
