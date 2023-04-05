---
title: do
categories: |
  core
version: 0.78.0
core: |
  Run a closure, providing it with the pipeline input.
usage: |
  Run a closure, providing it with the pipeline input.
---

# <code>{{ $frontmatter.title }}</code> for core

<div class='command-title'>{{ $frontmatter.core }}</div>

## Signature

```> do (closure) ...rest --ignore-errors --ignore-shell-errors --ignore-program-errors --capture-errors```

## Parameters

 -  `closure`: the closure to run
 -  `...rest`: the parameter(s) for the closure
 -  `--ignore-errors` `(-i)`: ignore errors as the closure runs
 -  `--ignore-shell-errors` `(-s)`: ignore shell errors as the closure runs
 -  `--ignore-program-errors` `(-p)`: ignore external program errors as the closure runs
 -  `--capture-errors` `(-c)`: catch errors as the closure runs, and return them

## Examples

Run the closure
```shell
> do { echo hello }
hello
```

Run a stored first-class closure
```shell
> let text = "I am enclosed"; let hello = {|| echo $text}; do $hello
I am enclosed
```

Run the closure and ignore both shell and external program errors
```shell
> do -i { thisisnotarealcommand }

```

Run the closure and ignore shell errors
```shell
> do -s { thisisnotarealcommand }

```

Run the closure and ignore external program errors
```shell
> do -p { nu -c 'exit 1' }; echo "I'll still run"

```

Abort the pipeline if a program returns a non-zero exit code
```shell
> do -c { nu -c 'exit 1' } | myscarycommand

```

Run the closure, with a positional parameter
```shell
> do {|x| 100 + $x } 77
177
```

Run the closure, with input
```shell
> 77 | do {|x| 100 + $in }

```
