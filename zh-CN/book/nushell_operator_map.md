# Nushell 运算符

这个表格的目的是帮助你了解 Nu 运算符与其他语言运算符的关系。我们试图制作一张包含所有 Nushell 运算符的表，以及它们在其他语言中的对应关系。欢迎大家参与贡献。

注意：此表针对 Nu 0.14.1 或更高版本。

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
