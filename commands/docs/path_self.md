---
title: path self
categories: |
  path
version: 0.106.0
path: |
  Get the absolute path of the script or module containing this command at parse time.
usage: |
  Get the absolute path of the script or module containing this command at parse time.
editLink: false
contributors: false
---
<!-- This file is automatically generated. Please edit the command in https://github.com/nushell/nushell instead. -->

# `path self` for [path](/commands/categories/path.md)

<div class='command-title'>Get the absolute path of the script or module containing this command at parse time.</div>

## Signature

```> path self {flags} (path)```

## Parameters

 -  `path`: Path to get instead of the current file.


## Input/output types:

| input   | output |
| ------- | ------ |
| nothing | string |
## Examples

Get the path of the current file
```nu
> const current_file = path self

```

Get the path of the directory containing the current file
```nu
> const current_file = path self .

```

Get the absolute form of a path relative to the current file
```nu
> const current_file = path self ../foo

```
