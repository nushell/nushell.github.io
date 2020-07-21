---
title: from-yaml
layout: command
nu_version: 0.14
---

Parse text as `.yaml/.yml` and create table. Use this when nushell cannot determine the input file extension.

Syntax: `from yaml`

## Examples

```shell
> open command_from-yaml
title: from-yaml
type: command
flags: false
```

```shell
> open command_from-yaml | from yaml
━━━━━━━━━━━┯━━━━━━━━━┯━━━━━━━
 title     │ type    │ flags
───────────┼─────────┼───────
 from-yaml │ command │ No
━━━━━━━━━━━┷━━━━━━━━━┷━━━━━━━

```
