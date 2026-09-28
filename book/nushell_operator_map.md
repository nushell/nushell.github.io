---
next:
  text: Design Notes
  link: /book/design_notes.md
---

# Nushell operator map

The idea behind this table is to help you understand how Nu operators relate to other language operators. We've tried to produce a map of all the nushell operators and what their equivalents are in other languages. Contributions are welcome.

Note: this table was last updated for Nu 0.116.0. Run `help operators` to list every operator.

| Nushell      | SQL          | Python             | .NET LINQ (C#)       | PowerShell             | Bash               |
| ------------ | ------------ | ------------------ | -------------------- | ---------------------- | ------------------ |
| ==           | =            | ==                 | ==                   | -eq, -is               | -eq                |
| !=           | !=, <>       | !=                 | !=                   | -ne, -isnot            | -ne                |
| <            | <            | <                  | <                    | -lt                    | -lt                |
| <=           | <=           | <=                 | <=                   | -le                    | -le                |
| >            | >            | >                  | >                    | -gt                    | -gt                |
| >=           | >=           | >=                 | >=                   | -ge                    | -ge                |
| =~, like     | like         | re, in, startswith | Contains, StartsWith | -like, -contains       | =~                 |
| !~, not-like | not like     | not in             | Except               | -notlike, -notcontains | ! "str1" =~ "str2" |
| starts-with  | like 'abc%'  | startswith         | StartsWith           | .StartsWith()          | [[$s == abc\*]]    |
| ends-with    | like '%abc'  | endswith           | EndsWith             | .EndsWith()            | [[$s == \*abc]]    |
| +            | +            | +                  | +                    | +                      | +                  |
| -            | -            | -                  | -                    | -                      | -                  |
| \*           | \*           | \*                 | \*                   | \*                     | \*                 |
| /            | /            | /                  | /                    | /                      | /                  |
| //           |              | //                 |                      | [Math]::Floor()        |                    |
| mod          | %, mod       | %                  | %                    | %                      | %                  |
| \*\*         | pow          | \*\*               | Power                | Pow                    | \*\*               |
| ++           | \|\|, concat | +                  | Concat               | +                      |                    |
| in           | in           | re, in, startswith | Contains, StartsWith | -In                    | case in            |
| not-in       | not in       | not in             | Except               | -NotIn                 |                    |
| has          |              | in                 | Contains             | -contains              |                    |
| not-has      |              | not in             |                      | -notcontains           |                    |
| not          | not          | not                | !                    | -not, !                | !                  |
| and          | and          | and                | &&                   | -And, &&               | -a, &&             |
| or           | or           | or                 | \|\|                 | -Or, \|\|              | -o, \|\|           |
| xor          |              | ^                  | ^                    | -xor                   |                    |
| bit-and      | &            | &                  | &                    | -band                  | &                  |
| bit-or       | \|           | \|                 | \|                   | -bor                   | \|                 |
| bit-xor      | ^, #         | ^                  | ^                    | -bxor                  | ^                  |
| bit-shl      | <<           | <<                 | <<                   | -shl                   | <<                 |
| bit-shr      | >>           | >>                 | >>                   | -shr                   | >>                 |
