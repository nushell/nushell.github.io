# Coming from PowerShell

::: tip
PowerShell pipelines pass rich **.NET objects**, which allow property access like `$process.Name` or piping objects directly into cmdlets that understand them.

Nushell pipelines, by contrast, pass **structured data** such as tables, lists, and values.  
This means:

- No `.PropertyName` access  
- Use `get column`, `select`, `$it.column`, or table operations instead  
- Commands always receive predictable structured input, not strings or .NET types
:::


## Command Equivalents:

| PowerShell                                                        | Nu                                            | Task                                                              |
|-------------------------------------------------------------------|-----------------------------------------------|-------------------------------------------------------------------|
| `Get-ChildItem`                                                   | `ls`                                          | List files in current directory                                   |
| `Get-ChildItem <dir>`                                             | `ls <dir>`                                    | List files in given directory                                     |
| `Get-ChildItem pattern*`                                          | `ls pattern*`                                 | Pattern-match files                                               |
| `Get-ChildItem -Force -File -Hidden`                              | `ls --long --all` or `ls -la`                 | Detailed listing including hidden files                           |
| `Get-ChildItem \| Where-Object { $_.PSIsContainer }`              | `ls \| where type == dir`                     | List directories only                                             |
| `Get-ChildItem -Recurse -Filter *.rs`                             | `ls **/*.rs`                                  | Recursive search for files                                        |
| `Get-ChildItem -Recurse Makefile \| Select-Object -Expand Name`   | `ls **/Makefile \| get name \| vim ...$in`    | Pass matched paths to command                                     |
| `Set-Location <dir>`                                              | `cd <dir>`                                    | Change directory                                                  |
| `Set-Location`                                                    | `cd`                                          | Go to home directory                                              |
| `Set-Location -`                                                  | `cd -`                                        | Go to previous directory                                          |
| `New-Item -ItemType Directory <path>`                             | `mkdir <path>`                                | Create a directory                                                |
| `New-Item test.txt`                                               | `touch test.txt`                              | Create a file                                                     |
| `command \| Out-File <path>`                                      | `out> <path>` or `o> <path>`                  | Save output to file (raw)                                         |
| `command \| Set-Content <path>`                                   | `\| save <path>`                              | Save output to file (structured)                                  |
| `command \| Out-File -Append <path>`                              | `out>> <path>` or `o>> <path>`                | Append output to file                                             |
|                                                                   | `\| save --append <path>`                     | Append structured output                                          |
| `command \| Out-Null`                                             | `\| ignore`                                   | Discard output                                                    |
| `cmd1 \| Tee-Object -FilePath log.txt \| cmd2`                    | `cmd1 \| tee { save log.txt } \| cmd2`        | Tee output to file                                                |
| `command \| Select-Object -First 5`                               | `command \| first 5`                          | Limit output to first N rows                                      |
| `Get-Content <path>`                                              | `open --raw <path>`                           | Display file contents                                             |
| `Move-Item <source> <dest>`                                       | `mv <source> <dest>`                          | Move file                                                         |
| `Get-ChildItem *.md \| ForEach-Object { $_.Name }`                | `ls *.md \| each { $in.name }`                | Iterate list values                                               |
| `foreach ($i in 1..10) { $i }`                                    | `for i in 1..10 { print $i }`                 | Loop over range                                                   |
| `Copy-Item <source> <dest>`                                       | `cp <source> <dest>`                          | Copy file                                                         |
| `Copy-Item -Recurse <source> <dest>`                              | `cp -r <source> <dest>`                       | Copy directory recursively                                        |
| `Remove-Item <path>`                                              | `rm <path>`                                   | Remove file                                                       |
|                                                                   | `rm -t <path>`                                | Move file to trash                                                |
| `Remove-Item -Recurse -Force <path>`                              | `rm -r <path>`                                | Remove directory recursively                                      |
| `Get-Date "<date>"`                                               | `"<date>" \| into datetime -f <format>`       | Parse date                                                        |
| `"<str>" -replace 'a','b'`                                        | `str replace "a" "b"`                         | Replace substrings                                                |
| `Select-String <pattern>`                                         | `where $it =~ <pattern>` or `find <pattern>`  | Search text                                                       |
| `Get-Help <command>`                                              | `help <command>`                              | Get command help                                                  |
| `Get-Command`                                                     | `help commands`                               | List all commands                                                 |
| `Get-Command "*<string>*"`                                        | `help --find <string>`                        | Search commands                                                   |
| `command1; if ($?) { command2 }`                                  | `command1; command2`                          | Run second command only if first succeeds                         |
| `/tmp/$((Get-Random))`                                            | `$"/tmp/(random int)"`                        | String interpolation                                              |
| `$env:Path`                                                       | `$env.PATH` or `$env.Path`                    | Show PATH                                                         |
| `$LASTEXITCODE`                                                   | `$env.LAST_EXIT_CODE`                         | Exit code of last external command                                |
| `$env:PATH += ":/usr/bin"`                                        | `$env.PATH = ($env.PATH \| append /usr/bin)`  | Update PATH (temporary)                                           |
| `Get-ChildItem Env:`                                              | `$env`                                        | List environment variables                                        |
| `$env:FOO`                                                        | `$env.FOO`                                    | Access environment variable                                       |
| `Remove-Item Env:FOO`                                             | `hide-env FOO`                                | Unset environment variable                                        |
| `Set-Alias s "git status -sb"`                                    | `alias s = git status -sb`                    | Temporary alias                                                   |
| `Get-Command FOO`                                                 | `which FOO`                                   | Inspect command / alias / binary                                  |
| `powershell -Command "<commands>"`                                | `nu -c <commands>`                            | Run inline pipeline                                               |
| `.\script.ps1`                                                    | `nu <script file>`                            | Run script file                                                   |
| `Get-Location` or `$PWD`                                          | `pwd` or `$env.PWD`                           | Show current directory                                            |
| `Read-Host`                                                       | `let var = input`                             | Read user input                                                   |
| `Read-Host -AsSecureString`                                       | `let secret = input -s`                       | Read secret input                                                 |
