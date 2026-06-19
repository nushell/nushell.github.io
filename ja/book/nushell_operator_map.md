# Nushell 演算子対応表

このテーブルは Nu の演算子と他言語の演算子の対応関係を理解するのを助けるためのものです。ここでは全ての Nu の演算子とその演算子が他の言語でどう使われているかをマッピングしています。コントリビューション歓迎です。

注: Nu が 0.14.1 以降であることを想定しています。

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
