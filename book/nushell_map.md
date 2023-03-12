# Nu map from other shells and domain specific languages

The idea behind this table is to help you understand how Nu builtins and plugins relate to other known shells and domain specific languages. We've tried to produce a map of relevant Nu commands and what their equivalents are in other languages. Contributions are welcome.

Note: this table assumes Nu 0.43 or later.


| Nushell                | SQL                           | .Net LINQ (C#)                                       | PowerShell (without external modules)      | Bash                                            |
| ---------------------- | ----------------------------- | ---------------------------------------------------- | ------------------------------------------ | ----------------------------------------------- |
| alias                  |                               |                                                      | alias                                      | alias                                           |
| append                 |                               | Append                                               | -Append                                    |                                                 |
| math avg               | avg                           | Average                                              | Measure-Object, measure                    |                                                 |
| calc, `<math expression>` | math operators             | Aggregate, Average, Count, Max, Min, Sum             |                                            | bc                                              |
| cd                     |                               |                                                      | Set-Location, cd                           | cd                                              |
| clear                  |                               |                                                      | Clear-Host                                 | clear                                           |
| config                 |                               |                                                      | $Profile                                   | vi .bashrc, .profile                            |
| cp                     |                               |                                                      | Copy-Item, cp, copy                        | cp                                              |
| date                   | NOW() / getdate()             | DateTime class                                       | Get-Date                                   | date                                            |
| du                     |                               |                                                      |                                            | du                                              |
| each                   | cursor                        |                                                      | ForEach-Object, foreach, for               |                                                 |
| exit                   |                               |                                                      | exit                                       | exit                                            |
| http                   |                               | HttpClient,WebClient, HttpWebRequest/Response        | Invoke-WebRequest                          | wget                                            |
| first                  | top, limit                    | First, FirstOrDefault                                | Select-Object -First                       | head                                            |
| format                 |                               | String.Format                                        | String.Format                              |                                                 |
| from                   | import flatfile, openjson, cast(variable as xml) |                                   | Import/ConvertFrom-{Csv,Xml,Html,Json}     |                                                 |
| get                    |                               | Select                                               | (cmd).column                               |                                                 |
| group-by               | group by                      | GroupBy, group                                       | Group-Object, group                        |                                                 |
| help                   | sp_help                       |                                                      | Get-Help, help, man                        | man                                             |
| history                |                               |                                                      | Get-History, history                       | history                                         |
| is-empty               | is null                       | String.InNullOrEmpty                                 | String.InNullOrEmpty                       |                                                 |
| kill                   |                               |                                                      | Stop-Process, kill                         | kill                                            |
| last                   |                               | Last, LastOrDefault                                  | Select-Object -Last                        | tail                                            |
| length                 | count                         | Count                                                | Measure-Object, measure                    | wc                                              |
| lines                  |                               |                                                      | File.ReadAllLines                          |                                                 |
| ls                     |                               |                                                      | Get-ChildItem, dir, ls                     | ls                                              |
| mkdir                  |                               |                                                      | mkdir, md                                  | mkdir                                           |
| mv                     |                               |                                                      | Move-Item, mv, move, mi                    | mv                                              |
| nth                    | limit x offset y, rownumber = | ElementAt                                            | [x], indexing operator, ElementAt          |                                                 |
| open                   |                               |                                                      | Get-Content, gc, cat, type                 | cat                                             |
| print                  | print, union all              |                                                      | Write-Output, write                        | echo                                            |
| transpose              | pivot                         |                                                      |                                            |                                                 |
| ps                     |                               |                                                      | Get-Process, ps, gps                       | ps                                              |
| pwd                    |                               |                                                      | Get-Location, pwd                          | pwd                                             |
| range                  |                               | Range                                                | 1..10, 'a'..'f'                            |                                                 |
| reduce                 |                               | Aggregate                                            |                                            |                                                 |
| rename                 |                               |                                                      | Rename-Item, ren, rni                      | mv                                              |
| reverse                |                               | Reverse                                              | [Array]::Reverse($var)                     |                                                 |
| rm                     |                               |                                                      | Remove-Item, del, erase, rd, ri, rm, rmdir | rm                                              |
| save                   |                               |                                                      | Write-Output, Out-File                     | > foo.txt                                       |
| select                 | select                        | Select                                               | Select-Object, select                      |                                                 |
| shuffle                |                               | Random                                               | Sort-Object {Get-Random}                   |                                                 |
| size                   |                               |                                                      | Measure-Object, measure                    | wc                                              |
| skip                   | where row_number()            | Skip                                                 | Select-Object -Skip                        |                                                 |
| skip until             |                               | SkipWhile                                            |                                            |                                                 |
| skip while             |                               | SkipWhile                                            |                                            |                                                 |
| sort-by                | order by                      | OrderBy, OrderByDescending, ThenBy, ThenByDescending | Sort-Object, sort                          |                                                 |
| split-by               |                               | Split                                                | Split                                      |                                                 |
| str                    | string functions              | String class                                         | String class                               |                                                 |
| str join               | concat_ws                     | Join                                                 | Join-String                                |                                                 |
| str trim               | rtrim, ltrim                  | Trim, TrimStart, TrimEnd                             | Trim                                       |                                                 |
| sum                    | sum                           | Sum                                                  | Measure-Object, measure                    |                                                 |
| sys                    |                               |                                                      | Get-ComputerInfo                           | uname, lshw, lsblk, lscpu, lsusb, hdparam, free |
| table                  |                               |                                                      | Format-Table, ft, Format-List, fl          |                                                 |
| take                   | top, limit                    | Take                                                 | Select-Object -First                       | head                                            |
| take until             |                               | TakeWhile                                            |                                            |                                                 |
| take while             |                               | TakeWhile                                            |                                            |                                                 |
| to                     |                               |                                                      | Export/ConvertTo-{Csv,Xml,Html,Json}       |                                                 |
| touch                  |                               |                                                      | Set-Content                                | touch                                           |
| uniq                   | distinct                      | Distinct                                             | Get-Unique, gu                             | uniq                                            |
| upsert                 | As                            |                                                      |                                            |                                                 |
| version                | select @@version              |                                                      | $PSVersionTable                            |                                                 |
| with-env               |                               |                                                      | $env:FOO = 'bar'                           | export foo = "bar"                              |
| where                  | where                         | Where                                                | Where-Object, where, "?" operator          |                                                 |
| which                  |                               |                                                      |                                            | which                                           |
