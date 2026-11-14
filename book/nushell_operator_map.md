---
next:
  text: Design Notes
  link: /book/design_notes.md
---

# Nushell operator map

The idea behind this table is to help you understand how Nu operators relate to other language operators. We've tried to produce a map of all the nushell operators and what their equivalents are in other languages. Contributions are welcome.

Note: this table was last updated for Nu 0.117.0. Run `help operators` to list every operator.

| Nushell         | SQL             | Python             | .NET LINQ (C#)       | PowerShell         | Bash               |
| --------------- | --------------- | ------------------ | -------------------- | ------------------ | ------------------ |
| ==              | =               | ==                 | ==                   | -eq, -is           | -eq                |
| !=              | !=, <>          | !=                 | !=                   | -ne, -isnot        | -ne                |
| <               | <               | <                  | <                    | -lt                | -lt                |
| <=              | <=              | <=                 | <=                   | -le                | -le                |
| >               | >               | >                  | >                    | -gt                | -gt                |
| >=              | >=              | >=                 | >=                   | -ge                | -ge                |
| older-than      | <               | <                  | <                    | -lt                |                    |
| newer-than      | >               | >                  | >                    | -gt                |                    |
| =~, like        | ~, regexp       | re.search          | Regex.IsMatch        | -match             | =~                 |
| !~, not-like    | !~, not regexp  | not re.search      | !Regex.IsMatch       | -notmatch          | ! "str1" =~ "str2" |
| starts-with     | like 'abc%'     | startswith         | StartsWith           | .StartsWith()      | [[$s == abc\*]]    |
| not-starts-with | not like 'abc%' | not startswith     | !StartsWith          | -not .StartsWith() | [[$s != abc\*]]    |
| ends-with       | like '%abc'     | endswith           | EndsWith             | .EndsWith()        | [[$s == \*abc]]    |
| not-ends-with   | not like '%abc' | not endswith       | !EndsWith            | -not .EndsWith()   | [[$s != \*abc]]    |
| +               | +               | +                  | +                    | +                  | +                  |
| -               | -               | -                  | -                    | -                  | -                  |
| \*              | \*              | \*                 | \*                   | \*                 | \*                 |
| /               | /               | /                  | /                    | /                  | /                  |
| //              |                 | //                 |                      | [Math]::Floor()    |                    |
| mod             | %, mod          | %                  | %                    | %                  | %                  |
| \*\*            | pow             | \*\*               | Power                | Pow                | \*\*               |
| ++              | \|\|, concat    | +                  | Concat               | +                  |                    |
| =               | =               | =                  | =                    | =                  | =                  |
| +=              |                 | +=                 | +=                   | +=                 | +=                 |
| -=              |                 | -=                 | -=                   | -=                 | -=                 |
| \*=             |                 | \*=                | \*=                  | \*=                | \*=                |
| /=              |                 | /=                 | /=                   | /=                 | /=                 |
| ++=             |                 | +=                 | +=                   | +=                 | +=                 |
| in              | in              | re, in, startswith | Contains, StartsWith | -In                | case in            |
| not-in          | not in          | not in             | Except               | -NotIn             |                    |
| has             |                 | in                 | Contains             | -contains          |                    |
| not-has         |                 | not in             |                      | -notcontains       |                    |
| not             | not             | not                | !                    | -not, !            | !                  |
| and             | and             | and                | &&                   | -And, &&           | -a, &&             |
| or              | or              | or                 | \|\|                 | -Or, \|\|          | -o, \|\|           |
| xor             |                 | ^                  | ^                    | -xor               |                    |
| bit-and         | &               | &                  | &                    | -band              | &                  |
| bit-or          | \|              | \|                 | \|                   | -bor               | \|                 |
| bit-xor         | ^, #            | ^                  | ^                    | -bxor              | ^                  |
| bit-shl         | <<              | <<                 | <<                   | -shl               | <<                 |
| bit-shr         | >>              | >>                 | >>                   | -shr               | >>                 |

Nushell's `like` and `not-like` take a regular expression, the same as `=~` and `!~`. SQL's `%` and `_` wildcards have no special meaning in them.
