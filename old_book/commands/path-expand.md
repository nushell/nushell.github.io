---
title: path expand
layout: command
nu_version: 0.32
---

Expand a path to its absolute form

## Usage

```shell
> path expand ...args {flags}
```

## Parameters

- ...args: Optionally operate by column path

## Flags

- -h, --help: Display this help message

## Examples

Expand relative directories

```shell
> echo '/home/joe/foo/../bar' | path expand
```
