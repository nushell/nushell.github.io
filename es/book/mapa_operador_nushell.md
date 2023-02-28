# Mapa de operadores en Nushell

La idea detrás de esta tabla is ayudarte a entender como los operadores en Nu se relacionan con operadores de otros lenguajes. Hemos intentado producir un mapa de los operadores y sus equivalentes en otros lenguajes. Contribuciones son bienvenidas.

Nota: esta tabla asume Nu 0.14.1 o posterior.

| Nushell | SQL      | Python             | .Net LINQ (C#)       | PowerShell             | Bash               |
| ------- | -------- | ------------------ | -------------------- | ---------------------- | ------------------ |
| =       | =        | ==                 | ==                   | -eq, -is               | -eq                |
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
| in      | in       | re, in, startswith | Contains, StartsWith | -In                    | case in            |
| not-in  | not in   | not in             | Except               | -NotIn                 |                    |
| and     | and      | and                | &&                   | -And                   | -a, &&             |
| or      | or       | or                 | \|\|                 | -Or                    | -o, \|\|           |
