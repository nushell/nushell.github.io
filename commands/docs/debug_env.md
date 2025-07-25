---
title: debug env
categories: |
  debug
version: 0.106.0
debug: |
  Show environment variables as external commands would get it.
usage: |
  Show environment variables as external commands would get it.
editLink: false
contributors: false
---
<!-- This file is automatically generated. Please edit the command in https://github.com/nushell/nushell instead. -->

# `debug env` for [debug](/commands/categories/debug.md)

<div class='command-title'>Show environment variables as external commands would get it.</div>

## Signature

```> debug env {flags} ```


## Input/output types:

| input   | output |
| ------- | ------ |
| nothing | record |
## Examples

Get PATH variable that externals see
```nu
> debug env | get PATH!

```

Create a .env file
```nu
> debug env | transpose key value | each {$"($in.key)=($in.value | to json)"} | save .env

```
