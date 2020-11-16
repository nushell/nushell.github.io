---
title: Setup
---

# Setup

To get the most out of nu,
it is important to setup your path and env for easy access.
There are other ways to view these values and variables,
however setting up your nu configuration will make it much easier as these are supported cross-platform.

--- 

### Configure your path

`config set path $nu.path`

Output

```
━━━━━━━━━━━━━━━━━━
 path
──────────────────
 [table: 91 rows]
━━━━━━━━━━━━━━━━━━
```

---

### Configure your environment variables

`config set env $nu.env`

Output

```
━━━━━━━━━━━━━━━━━━┯━━━━━━━━━━━━━━━━
 path             │ env
──────────────────┼────────────────
 [table: 91 rows] │ [table: 1 row]
━━━━━━━━━━━━━━━━━━┷━━━━━━━━━━━━━━━━
```

---

### How to list your paths

`echo $nu.path` 

or 

`config | get path`

Output

```
━━━━┯━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 #  │ <value>
────┼──────────────────────────────────────────────────────────────────────
  0 │ C:\Program Files (x86)\Microsoft SQL Server\140\Tools\Binn\
  1 │ C:\Program Files\Microsoft SQL Server\140\Tools\Binn\
  2 │ C:\Program Files\Microsoft SQL Server\140\DTS\Binn\
  3 │ C:\Program Files (x86)\Microsoft SQL Server\150\DTS\Binn\
  4 │ C:\Program Files\erl10.3\bin
  5 │ C:\Program Files (x86)\Elixir\bin
  4 │ C:\Program Files\MongoDB\Server\4.0\bin
  5 │ C:\Users\nu_shell\.cargo\bin
  6 │ C:\Program Files\PostgreSQL\9.6\bin
  7 │ C:\Program Files\PostgreSQL\9.6\lib
  8 │ C:\WINDOWS\system32\WindowsPowerShell\v1.0\
  9 │ C:\Program Files (x86)\NVIDIA Corporation\PhysX\Common
 10 │ C:\Program Files\Common Files\Microsoft Shared\Windows Live
 11 │ C:\Program Files (x86)\Common Files\Microsoft Shared\Windows Live
 12 │ C:\Windows\system32
 13 │ C:\Windows
 14 │ C:\Windows\System32\Wbem
 15 │ C:\Windows\System32\WindowsPowerShell\v1.0\
━━━━┷━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### How to list your environment variables

`echo $nu.env | pivot` 

or 

`config | get env | pivot`

Output

```
━━━━┯━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┯━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 #  │ Column0                         │ Column1
────┼─────────────────────────────────┼──────────────────────────────────────────────────────────
  0 │ =::                             │ ::\
  1 │ ALLUSERSPROFILE                 │ C:\ProgramData
  2 │ APPDATA                         │ C:\Users\nu_shell\AppData\Roaming
  3 │ CLASSPATH                       │ .;C:\Program Files (x86)\Java\jre6\lib\ext\QTJava.zip
  4 │ COLUMNS                         │ 80
  5 │ COMPUTERNAME                    │ nu_shell
  6 │ ChocolateyInstall               │ C:\ProgramData\chocolatey
  7 │ ChocolateyLastPathUpdate        │ Sun Oct  8 16:37:30 2017
━━━━┷━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### How to get a single environment variable's value

`config | get env.APPDATA` 

or 

`config | get env | select APPDATA`

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 APPDATA
───────────────────────────────────
 C:\Users\nu_shell\AppData\Roaming
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
