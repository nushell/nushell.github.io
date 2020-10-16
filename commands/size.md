---
title: size
layout: command
nu_version: 0.20.0
---

This commands gives word count statistics on any text.

## Examples

```shell
> open lalala.txt | size
━━━━━━━┯━━━━━━━┯━━━━━━━┯━━━━━━━━━━━━
 lines │ words │ chars │ bytes
───────┼───────┼───────┼────────────
     4 │    10 │    72 │         72
━━━━━━━┷━━━━━━━┷━━━━━━━┷━━━━━━━━━━━━
```

```shell
> open the_mysterious_affair_at_styles.txt | size
━━━━━━━┯━━━━━━━┯━━━━━━━━┯━━━━━━━━━━━━
 lines │ words │ chars  │ bytes
───────┼───────┼────────┼────────────
  8935 │ 62352 │ 349459 │     361771
━━━━━━━┷━━━━━━━┷━━━━━━━━┷━━━━━━━━━━━━
```
