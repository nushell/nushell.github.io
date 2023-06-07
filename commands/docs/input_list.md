---
title: input list
categories: |
  platform
version: 0.81.0
platform: |
  Interactive list selection.
usage: |
  Interactive list selection.
---

# <code>{{ $frontmatter.title }}</code> for platform

<div class='command-title'>{{ $frontmatter.platform }}</div>

## Signature

```> input list (prompt) --multi --fuzzy```

## Parameters

 -  `prompt`: the prompt to display
 -  `--multi` `(-m)`: Use multiple results, you can press a to toggle all options on/off
 -  `--fuzzy` `(-f)`: Use a fuzzy select.

## Notes
Abort with esc or q.
## Examples

Return a single value from a list
```shell
> [1 2 3 4 5] | input list 'Rate it'

```

Return multiple values from a list
```shell
> [Banana Kiwi Pear Peach Strawberry] | input list -m 'Add fruits to the basket'

```

Return a single record from a table with fuzzy search
```shell
> ls | input list -f 'Select the target'

```
