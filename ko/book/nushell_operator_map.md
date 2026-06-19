---
next:
  text: 디자인 노트
  link: /ko/book/design_notes.md
---

# 누셸 연산자 맵

이 표의 목적은 Nu 연산자가 다른 언어 연산자와 어떻게 관련되는지 이해하는 데 도움을 주는 것입니다. 모든 누셸 연산자와 다른 언어에서의 해당 연산자를 매핑하려고 노력했습니다. 기여를 환영합니다.

참고: 이 표는 Nu 0.14.1 이상을 가정합니다.

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
