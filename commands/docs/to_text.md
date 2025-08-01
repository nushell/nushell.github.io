---
title: to text
categories: |
  formats
version: 0.106.0
formats: |
  Converts data into simple text.
usage: |
  Converts data into simple text.
editLink: false
contributors: false
---
<!-- This file is automatically generated. Please edit the command in https://github.com/nushell/nushell instead. -->

# `to text` for [formats](/commands/categories/formats.md)

<div class='command-title'>Converts data into simple text.</div>

## Signature

```> to text {flags} ```

## Flags

 -  `--no-newline, -n`: Do not append a newline to the end of the text
 -  `--serialize, -s`: serialize nushell types that cannot be deserialized


## Input/output types:

| input | output |
| ----- | ------ |
| any   | string |
## Examples

Outputs data as simple text with a trailing newline
```nu
> [1] | to text
1

```

Outputs data as simple text without a trailing newline
```nu
> [1] | to text --no-newline
1
```

Outputs external data as simple text
```nu
> git help -a | lines | find -r '^ ' | to text

```

Outputs records as simple text
```nu
> ls | to text

```
