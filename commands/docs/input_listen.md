---
title: input listen
categories: |
  platform
version: 0.83.0
platform: |
  Listen for user interface event
usage: |
  Listen for user interface event
---

# <code>{{ $frontmatter.title }}</code> for platform

<div class='command-title'>{{ $frontmatter.platform }}</div>

## Signature

```> input listen --types --raw```

## Parameters

 -  `--types {list<string>}`: Listen for event of specified types only (can be one of: focus, key, mouse, paste, resize)
 -  `--raw` `(-r)`: Add raw_code field with numeric value of keycode and raw_flags with bit mask flags

## Notes
There are 5 different type of events: focus, key, mouse, paste, resize. Each will produce a
corresponding record, distinguished by type field:
    { type: focus event: (gained|lost) }
    { type: key key_type: <key_type> code: <string> modifiers: [ <modifier> ... ] }
    { type: mouse col: <int> row: <int> kind: <string> modifiers: [ <modifier> ... ] }
    { type: paste content: <string> }
    { type: resize col: <int> row: <int> }
There are 6 <modifier> variants: shift, control, alt, super, hyper, meta.
There are 4 <key_type> variants:
    f - f1, f2, f3 ... keys
    char - alphanumeric and special symbols (a, A, 1, $ ...)
    media - dedicated media keys (play, pause, tracknext ...)
    other - keys not falling under previous categories (up, down, backspace, enter ...)