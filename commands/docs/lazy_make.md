---
title: lazy make
categories: |
  core
version: 0.81.0
core: |
  Create a lazy record.
usage: |
  Create a lazy record.
---

# <code>{{ $frontmatter.title }}</code> for core

<div class='command-title'>{{ $frontmatter.core }}</div>

## Signature

```> lazy make --columns --get-value```

## Parameters

 -  `--columns {list<string>}`: Closure that gets called when the LazyRecord needs to list the available column names
 -  `--get-value {closure(string)}`: Closure to call when a value needs to be produced on demand

## Notes
Lazy records are special records that only evaluate their values once the property is requested.
        For example, when printing a lazy record, all of its fields will be collected. But when accessing
        a specific property, only it will be evaluated.

        Note that this is unrelated to the lazyframes feature bundled with dataframes.
## Examples

Create a lazy record
```shell
> lazy make --columns ["haskell", "futures", "nushell"] --get-value { |lazything| $lazything + "!" }

```

Test the laziness of lazy records
```shell
> lazy make -c ["hello"] -g { |key| print $"getting ($key)!"; $key | str upcase }

```
