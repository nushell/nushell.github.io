---
title: Native Shell Programs
---

# Native Shell Programs

Nu allows you to access native shell programs by escaping the program name with `^`.

`sc` is a Windows CMD program that is used for communicating with the Service Control Manager

```shell
> ^sc queryex eventlog | lines | str trim | parse "{key}: {value}"
```

Output

```
───┬────────────────────┬────────────
 # │        key         │   value
───┼────────────────────┼────────────
 0 │ SERVICE_NAME       │ eventlog
 1 │ TYPE               │ 30  WIN32
 2 │ STATE              │ 4  RUNNING
 3 │ WIN32_EXIT_CODE    │ 0  (0x0)
 4 │ SERVICE_EXIT_CODE  │ 0  (0x0)
 5 │ CHECKPOINT         │ 0x0
 6 │ WAIT_HINT          │ 0x0
 7 │ PID                │ 3452
───┴────────────────────┴────────────
```
