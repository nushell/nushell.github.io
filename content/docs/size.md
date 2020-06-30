---
title: size
layout: command
nu_version: 0.14
---

This commands gives word count statistics on any text.

## Examples

```shell
> open lalala.txt | size
━━━━━━━┯━━━━━━━┯━━━━━━━┯━━━━━━━━━━━━
 lines │ words │ chars │ max length
───────┼───────┼───────┼────────────
     4 │    10 │    72 │         72
━━━━━━━┷━━━━━━━┷━━━━━━━┷━━━━━━━━━━━━
> open the_mysterious_affair_at_styles.txt | size
━━━━━━━┯━━━━━━━┯━━━━━━━━┯━━━━━━━━━━━━
 lines │ words │ chars  │ max length
───────┼───────┼────────┼────────────
  8935 │ 62352 │ 349459 │     361771
━━━━━━━┷━━━━━━━┷━━━━━━━━┷━━━━━━━━━━━━
```
