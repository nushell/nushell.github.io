# Nushell演算子対応表

このテーブルはNuの演算子と他言語の演算子の対応関係を理解するのを助けるためのものです。ここでは全てのNuの演算子とその演算子が他の言語でどう使われているかをマッピングしています。コントリビューション歓迎です。

注: Nuが0.14.1以降であることを想定しています。

| Nushell  | SQL      | Python              | .Net LINQ (C#)       | PowerShell             | Bash               |
| -------- | -------- | --------------------| -------------------- | ---------------------- | ------------------ |
| ==       | =        | ==                  | ==                   | -eq, -is               | -eq                |
| !=       | !=, <>   | !=                  | !=                   | -ne, -isnot            | -ne                |
| <        | <        | <                   | <                    | -lt                    | -lt                |
| <=       | <=       | <=                  | <=                   | -le                    | -le                |
| >        | >        | >                   | >                    | -gt                    | -gt                |
| >=       | >=       | >=                  | >=                   | -ge                    | -ge                |
| =~       | like     | re, in, startswith  | Contains, StartsWith | -like, -contains       | =~                 |
| !~       | not like | not in              | Except               | -notlike, -notcontains | ! "str1" =~ "str2" |
| +        | +        | +                   | +                    | +                      | +                  |
| -        | -        | -                   | -                    | -                      | -                  |
| *        | *        | *                   | *                    | *                      | *                  |
| /        | /        | /                   | /                    | /                      | /                  |
| in       | in       | re, in, startswith  | Contains, StartsWith | -In                    | case in            |
| not-in   | not in   | not in              | Except               | -NotIn                 |                    |
| &&       | and      | and                 | &&                   | -And                   | -a, &&             |
| \|\|     | or       | or                  | \|\|                 | -Or                    | -o, \|\|           |
