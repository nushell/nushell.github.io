---
title: ansi strip
layout: command
nu_version: 0.32
---

strip ansi escape sequences from string

## Usage

```shell
> ansi strip ...args {flags}
```

## Parameters

- ...args: optionally, remove ansi sequences by column paths

## Flags

- -h, --help: Display this help message

## Examples

strip ansi escape sequences from string

```shell
> echo [(ansi gb) 'hello' (ansi reset)] | str collect | ansi strip
```
