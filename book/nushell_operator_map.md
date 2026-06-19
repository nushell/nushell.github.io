---
next:
  text: Design Notes
  link: /book/design_notes.md
---

# Nushell operator map

The idea behind this table is to help you understand how Nu operators relate to other language operators. We've tried to produce a map of all the nushell operators and what their equivalents are in other languages. Contributions are welcome.

Note: this table assumes Nu 0.14.1 or later.

| Nushell | SQL      | Python             | .NET (C#)                     | PowerShell            | Bash               |
| ------- | -------- | ------------------ | ----------------------------- | --------------------- | ------------------ |
| ==      | =        | ==                 | ==                            | -eq                   | -eq                |
| !=      | !=, <>   | !=                 | !=                            | -ne                   | -ne                |
| <       | <        | <                  | <                             | -lt                   | -lt                |
| <=      | <=       | <=                 | <=                            | -le                   | -le                |
| >       | >        | >                  | >                             | -gt                   | -gt                |
| >=      | >=       | >=                 | >=                            | -ge                   | -ge                |
| =~      | like     | re, in, startswith | Regex.IsMatch                 | -cmatch               | =~                 |
| !~      | not like | not in             | !Regex.IsMatch                | -cnotmatch            | ! "str1" =~ "str2" |
| +       | +        | +                  | +                             | +                     | +                  |
| -       | -        | -                  | -                             | -                     | -                  |
| \*      | \*       | \*                 | \*                            | \*                    | \*                 |
| /       | /        | /                  | /                             | /                     | /                  |
| \*\*    | pow      | \*\*               | Math.Pow                      | \[math\]::Pow         | \*\*               |
| in      | in       | re, in, startswith | str.Contains, collection.Any  | str.Contains, -in     | case in            |
| not-in  | not in   | not in             | !str.Contains, collection.Any | !str.Contains, -notin |                    |
| and     | and      | and                | &&                            | -and, &&              | -a, &&             |
| or      | or       | or                 | \|\|                          | -or, \|\|             | -o, \|\|           |
