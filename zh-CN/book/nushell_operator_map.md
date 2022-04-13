# Nushell 运算符

这个表格的目的是帮助你了解 Nu 运算符与其他语言运算符的关系。我们试图制作一张包含所有 Nushell 运算符的表，以及它们在其他语言中的对应关系。欢迎大家参与贡献。

注意：此表针对 Nu 0.14.1 或更高版本。

| Nushell | SQL      | Python             | .NET LINQ (C#)       | PowerShell             | Bash               |
| ------- | -------- | ------------------ | -------------------- | ---------------------- | ------------------ |
| ==      | =        | ==                 | ==                   | -eq, -is               | -eq                |
| !=      | !=, <>   | !=                 | !=                   | -ne, -isnot            | -ne                |
| <       | <        | <                  | <                    | -lt                    | -lt                |
| <=      | <=       | <=                 | <=                   | -le                    | -le                |
| >       | >        | >                  | >                    | -gt                    | -gt                |
| >=      | >=       | >=                 | >=                   | -ge                    | -ge                |
| =~      | like     | re, in, startswith | Contains, StartsWith | -like, -contains       | =~                 |
| !~      | not like | not in             | Except               | -notlike, -notcontains | ! "str1" =~ "str2" |
| +       | +        | +                  | +                    | +                      | +                  |
| -       | -        | -                  | -                    | -                      | -                  |
| \*      | \*       | \*                 | \*                   | \*                     | \*                 |
| /       | /        | /                  | /                    | /                      | /                  |
| \*\*    | pow      | \*\*               | Power                | Pow                    | \*\*               |
| in      | in       | re, in, startswith | Contains, StartsWith | -In                    | case in            |
| not-in  | not in   | not in             | Except               | -NotIn                 |                    |
| &&      | and      | and                | &&                   | -And, &&               | -a, &&             |
| \|\|    | or       | or                 | \|\|                 | -Or, \|\|              | -o, \|\|           |
