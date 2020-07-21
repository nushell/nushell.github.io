---
title: Aliases
description: Shorthands for long pipelines
---

Nu's ability to compose long pipelines allow you a lot of control over your data and system, but it comes at the price of a lot of typing. Ideally, you'd be able to save your well-crafted pipelines to use again and again.

This is where aliases come in.

An alias allows you to create a short name for a block of commands.  When the alias is run, it's like you typed that block of commands out.

Example:

```
> alias ls-names [] { ls | select name }
> ls-names
────┬────────────────────
 #  │ name 
────┼────────────────────
  0 │ 404.html 
  1 │ CONTRIBUTING.md 
  2 │ Gemfile 
  3 │ Gemfile.lock 
  4 │ LICENSE 
```

## Parameters

Aliases can also take optional parameters that are passed to the block.  Each of these becomes a new variable in the block.

```
> alias e [msg] { echo $msg }
> e "hello world"
hello world
```

You can have an arbitrary number of these arguments.  When the user doesn't provide a value, the variable in the block will evaluate to Nothing and be removed.

## Persisting

By default, aliases only apply to the current session. That can be useful for a temporary helper or testing a new alias, but for aliases to be really useful, they need to be persisted. To do so, call the alias with the `--save` flag (or the `-s` shorthand). For example:

```
alias e --save [msg] { echo $msg }
```

Aliases are stored in the startup config, which you can look at with `config --get startup`. If you get an error, the `startup` config doesn't yet exist.

You can also edit alises directly in the config.toml file, for example using `vi`:

```
config --path | vi $it
```