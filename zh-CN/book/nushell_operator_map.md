# Nushell 运算符对照

这个表格的目的是帮助你理解 Nu 的运算符与其他语言的运算符之间的关系。我们试图绘制一张包含所有 Nushell 运算符及其在其他语言中对应写法的对照表。欢迎参与贡献。

注意：此表最后更新于 Nu 0.116.0。
运行 `help operators` 可以列出每一个运算符。

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
