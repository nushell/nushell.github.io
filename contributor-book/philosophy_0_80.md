# Nushell design philosophy

## Core philosophy

Nushell is "A shell-first scripting language for working with structured data flowing through pipelines".

Designs should work towards serving this goal. Those that don't should be removed or moved to optional add-ons.

## Core design

### Shell-first

Nushell should work to serve its roll as a shell and a language with a focus on shells. Shell types of activities include, but aren't limited to:

* Running commands
* Redirecting stdout/stdin/stderr
* Unix-only: Properly handling signals
    * Ctrl-C
    * Ctrl-D
    * and others
* Unix-only: Handling background tasks
    * Ctrl-Z
    * Background/foregrounding of tasks

In cases where the user would reasonably have an expectation of the functionality of the shell, we should make every effort to include. If a feature would be a reasonable expectation (say ctrl-z on Unix), then we should have OS-specific functionality for that platform that meets that expectation.

### Scripting language

The intent of Nushell's design is to be a scripting language. Scripting can take many forms, from simple pipelines to large scripts. Nushell should handle these with ease by meeting reasonable expectations in terms of:
- Modularity
- Readability
- Programming language features and convenience\

### Structured data

In Nushell, all data is "structured". For Nushell, this means that values can take shapes beyond just a simple string.

Values in Nushell can be records, lists, tables, binary data, and more. Being able to convert into structured data and work with structured data is fundamental to Nushell.

### Pipelines

Nushell takes the Unix philosophy of pipelines to heart. Commands should be built with the intent of composition. Nushell leverages this composition via the use of pipes (`|`), just like Unix pipelines.

Composing commands, both built-in and user-defined, is a core piece of Nushell. The design of Nushell and its standard library must support both easily composing commands as well as allowing the user to easily create compose-able commands.

## Command signatures and their parts

### Signature

The signature of the command describes the following:

- The name of the command
- The usage information (documentation) for the command
- The name and type of:
    - Named parameters
    - Positional parameters
- The type of:
    - Input
    - Output

### When to use input

Input is intended for one or both of:
- Pipeline composition
- Streams of data

### When to use output

All return values are output.

### When to use positional parameters

Use a positional parameter when:
- A parameter is required

### When to use rest parameters

Use a rest parameter when:
- A command takes some number of additional optional arguments of the same type

### When to use named parameters

Use a named parameter (a flag parameter) when:
- The value you need is optional

### When to use a switch flag

Use a switch flag when:
- You need to allow the user to change the default action of the command

### Comments

Commands should be commented to describe their function and usage. This documentation should also cover parameters and their use.

## Core categories

The core language and standard library needs to cover the following categories to support common use cases for Nushell:

* Filesytem
* Operating system
* Manipulating the environment
* Parsing string data into structure data
* Querying, filtering, and manipulating structured data
* Network connectivity
    * note: Network support is fundamental because with it users can easily acquire and install Nushell extensions
* Basic formats:
    * CSV and JSON support
* Basic date support

The following categories should be moved to plugins:

* Database connectivity
* Dataframe support
* Hash functionality
* Format support
    * Any non-CSV or JSON file format
* Experimental commands
* Binary data functionality
* Random number support
* Math support
* Advanced date support

We should select commands to be in the core categories which meet the common use cases for Nushell. Commands that are in the core categories that are uncommon use cases should move to optional extensions.

## Language design

Rather than describe the whole of the language here, this section describes the changes expected to come as part of 0.80 and how they differ from the 0.60 series.

### More bash-ism

Being a shell-focused language means incorporating more of the expected shell-features into the language. These include:

Redirection (with common variations):
```
cat foo.txt > bar.txt
cat foo.txt >> bar.txt
cat foo.txt 2> bar.txt
```

Bash logic operators:
```
cat foo.txt && cat bar.txt
cat foo.txt || cat bar.txt
```

### Limited mutation

In 0.80, there will be a limited form of mutation that works with the local command.
```
mut x = 100
$x = 200
print $x
```

This will help with some patterns where people wanted to calculate something in a loop but didn't have an easy way to do so previously.

### Splitting closures and blocks

Connected to mutation is the idea that blocks and closures will be separate concepts in 0.80. In the 0.60 series, these were largely both treated on under the same concept as "blocks".

In the future, a block will not be a first-class value. Instead, it will be expected to be run by the command you give it to and not passed into the pipeline. This allows blocks to work with mutable variables.

Closures retain the capabilities of 0.60 and can be used as first-class values, but can't mutate variables.

Block example:
```
for x in 1..100 {
  print $x
}
```

Closure example:
```
ls | each { |x| $x.name + "foo" }
```

### Math without spaces

It will be possible to not require spaces in math. For example, `1+1` instead of requiring `1 + 1`. While a small change, this is part of a set of changes to make the language feel a little less surprising to people coming from other languages.

*JT: Is this more important than having nice looking dates? This doesn't seem to be as important now if we lean into a shell-first focus.*

