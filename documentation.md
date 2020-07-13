---
title: Documentation
layout: doc
---
We have a few good resources for you to get started with Nu.

At the bottom of this page you can also find quick references to the commands provided by Nu Shell if you need quick support.

# Books

## Nu Book

You can read our [book](https://www.nushell.sh/book) to learn more about the core concepts behind Nu. It covers the basic and contains a lot of examples which will help you to have an easy start.

## Contributor Book

In the [contributors book](https://www.nushell.sh/contributor-book) you can find further information. It attempts to cover the basics of how Nu works internally, to get a solid understanding. You will learn how data is treated, what kind of data types Nu supports and how you can write plugins for it.

## Cookbook

[Nu Cookbook](https://www.nushell.sh/cookbook/) is a collection of examples to help you get the most out of using Nushell. It offers multiple ways of expressing the same pipelines so you can become familiar with all the commands.

## Command Reference

<details><summary>alias - Define a shortcut for another command.</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/alias.md)    
    
Define a shortcut for another command.    
    
Usage:    
  > alias <name> <args> <block> {flags}     
    
Parameters:    
  <name> the name of the alias    
  <args> the arguments to the alias    
  <block> the block to run as the body of the alias    
    
Flags:    
  -h, --help: Display this help message    
  -s, --save: save the alias to your config    
    
Examples:    
  An alias without parameters    
  > alias say-hi [] { echo 'Hello!' }    
    
  An alias with a single parameter    
  > alias l [x] { ls $x }    
    
    
    
</details>    
    
<details><summary>ansi - Output ANSI codes to change color</summary>    
    
    
    
Output ANSI codes to change color    
    
Usage:    
  > ansi <color> {flags}     
    
Parameters:    
  <color> the name of the color to use or 'reset' to reset the color    
    
Flags:    
  -h, --help: Display this help message    
    
Examples:    
  Change color to green    
  > ansi green    
    
  Reset the color    
  > ansi reset    
    
    
    
</details>    
    
<details><summary>append - Append the given row to the table</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/append.md)    
    
Append the given row to the table    
    
Usage:    
  > append <row value> {flags}     
    
Parameters:    
  <row value> the value of the row to append to the table    
    
Flags:    
  -h, --help: Display this help message    
    
Examples:    
  Add something to the end of a list or table    
  > echo [1 2 3] | append 4    
    
    
    
</details>    
    
<details><summary>autoenv - Manage directory specific environments</summary>    
    
    
    
Manage directory specific environments    
    
Usage:    
  > autoenv {flags}     
    
Flags:    
  -h, --help: Display this help message    
    
Examples:    
  Allow .nu-env file in current directory    
  > autoenv trust    
    
    
    
- <details><summary>autoenv trust - Manage directory specific environments</summary>    
    
      
    
  Manage directory specific environments    
      
  Usage:    
    > autoenv {flags}     
      
  Flags:    
    -h, --help: Display this help message    
      
  Examples:    
    Allow .nu-env file in current directory    
    > autoenv trust    
      
      
    
  </details>    
    
- <details><summary>autoenv untrust - Manage directory specific environments</summary>    
    
      
    
  Manage directory specific environments    
      
  Usage:    
    > autoenv {flags}     
      
  Flags:    
    -h, --help: Display this help message    
      
  Examples:    
    Allow .nu-env file in current directory    
    > autoenv trust    
      
      
    
  </details>    
    
</details>    
    
<details><summary>autoview - View the contents of the pipeline as a table or list.</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/autoview.md)    
    
View the contents of the pipeline as a table or list.    
    
Usage:    
  > autoview {flags}     
    
Flags:    
  -h, --help: Display this help message    
    
Examples:    
  Automatically view the results    
  > ls | autoview    
    
  Autoview is also implied. The above can be written as    
  > ls    
    
    
    
</details>    
    
<details><summary>binaryview - Autoview of binary data.</summary>    
    
    
    
Autoview of binary data.    
    
Usage:    
  > binaryview {flags}     
    
Flags:    
  -h, --help: Display this help message    
  -l, --lores: use low resolution output mode    
    
    
    
</details>    
    
<details><summary>build-string - Builds a string from the arguments</summary>    
    
    
    
Builds a string from the arguments    
    
Usage:    
  > build-string  ...args{flags}     
    
Parameters:    
  ...args: all values to form into the string    
    
Flags:    
  -h, --help: Display this help message    
    
Examples:    
  Builds a string from a string and a number, without spaces between them    
  > build-string 'foo' 3    
    
    
    
</details>    
    
<details><summary>cal - Display a calendar.</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/cal.md)    
    
Display a calendar.    
    
Usage:    
  > cal {flags}     
    
Flags:    
  -h, --help: Display this help message    
  -y, --year: Display the year column    
  -q, --quarter: Display the quarter column    
  -m, --month: Display the month column    
  --full-year <integer>: Display a year-long calendar for the specified year    
  --week-start <string>: Display the calendar with the specified day as the first day of the week    
  --month-names: Display the month names instead of integers    
    
Examples:    
  This month's calendar    
  > cal    
    
  The calendar for all of 2012    
  > cal --full-year 2012    
    
  This month's calendar with the week starting on monday    
  > cal --week-start monday    
    
    
    
</details>    
    
<details><summary>calc - Parse a math expression into a number</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/calc.md)    
    
Parse a math expression into a number    
    
Usage:    
  > calc {flags}     
    
Flags:    
  -h, --help: Display this help message    
    
Examples:    
  Calculate math in the pipeline    
  > echo '10 / 4' | calc    
    
    
    
</details>    
    
<details><summary>cd - Change to a new path.</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/cd.md)    
    
Change to a new path.    
    
Usage:    
  > cd (directory) {flags}     
    
Parameters:    
  (directory) the directory to change to    
    
Flags:    
  -h, --help: Display this help message    
    
Examples:    
  Change to a new directory called 'dirname'    
  > cd dirname    
    
  Change to your home directory    
  > cd    
    
  Change to your home directory (alternate version)    
  > cd ~    
    
  Change to the previous directory    
  > cd -    
    
    
    
</details>    
    
<details><summary>char - Output special characters (eg. 'newline')</summary>    
    
    
    
Output special characters (eg. 'newline')    
    
Usage:    
  > ansi <character> {flags}     
    
Parameters:    
  <character> the name of the character to output    
    
Flags:    
  -h, --help: Display this help message    
    
Examples:    
  Output newline    
  > char newline    
    
    
    
</details>    
    
<details><summary>clear - clears the terminal</summary>    
    
    
    
clears the terminal    
    
Usage:    
  > clear {flags}     
    
Flags:    
  -h, --help: Display this help message    
    
Examples:    
  Clear the screen    
  > clear    
    
    
    
</details>    
    
<details><summary>clip - Copy the contents of the pipeline to the copy/paste buffer</summary>    
    
    
    
Copy the contents of the pipeline to the copy/paste buffer    
    
Usage:    
  > clip {flags}     
    
Flags:    
  -h, --help: Display this help message    
    
Examples:    
  Save text to the clipboard    
  > echo 'secret value' | clip    
    
    
    
</details>    
    
<details><summary>compact - Creates a table with non-empty rows</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/compact.md)    
    
Creates a table with non-empty rows    
    
Usage:    
  > compact  ...args{flags}     
    
Parameters:    
  ...args: the columns to compact from the table    
    
Flags:    
  -h, --help: Display this help message    
    
Examples:    
  Filter out all null entries in a list    
  > echo [1 2 $null 3 $null $null] | compact    
    
  Filter out all directory entries having no 'target'    
  > ls -af | compact target    
    
    
    
</details>    
    
<details><summary>config - Configuration management.</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/config.md)    
    
Configuration management.    
    
Usage:    
  > config {flags}     
    
Flags:    
  -h, --help: Display this help message    
  -l, --load <file path>: load the config from the path given    
  -s, --set <any>: set a value in the config, eg) --set [key value]    
  -i, --set_into <string>: sets a variable from values in the pipeline    
  -g, --get <any>: get a value from the config    
  -r, --remove <any>: remove a value from the config    
  -c, --clear: clear the config    
  -p, --path: return the path to the config file    
    
Examples:    
  See all config values    
  > config    
    
  Set completion_mode to circular    
  > config --set [completion_mode circular]    
    
  Store the contents of the pipeline as a path    
  > echo ['/usr/bin' '/bin'] | config --set_into path    
    
  Get the current startup commands    
  > config --get startup    
    
  Remove the startup commands    
  > config --remove startup    
    
  Clear the config (be careful!)    
  > config --clear    
    
  Get the path to the current config file    
  > config --path    
    
    
    
</details>    
    
<details><summary>count - Show the total number of rows or items.</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/count.md)    
    
Show the total number of rows or items.    
    
Usage:    
  > count {flags}     
    
Flags:    
  -h, --help: Display this help message    
    
Examples:    
  Count the number of entries in a list    
  > echo [1 2 3 4 5] | count    
    
    
    
</details>    
    
<details><summary>cp - Copy files.</summary>    
    
    
    
Copy files.    
    
Usage:    
  > cp <src> <dst> {flags}     
    
Parameters:    
  <src> the place to copy from    
  <dst> the place to copy to    
    
Flags:    
  -h, --help: Display this help message    
  -r, --recursive: copy recursively through subdirectories    
    
Examples:    
  Copy myfile to dir_b    
  > cp myfile dir_b    
    
  Recursively copy dir_a to dir_b    
  > cp -r dir_a dir_b    
    
    
    
</details>    
    
<details><summary>date - Get the current datetime.</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/date.md)    
    
Get the current datetime.    
    
Usage:    
  > date {flags}     
    
Flags:    
  -h, --help: Display this help message    
  -u, --utc: use universal time (UTC)    
  -l, --local: use the local time    
  -f, --format <string>: report datetime in supplied strftime format    
  -r, --raw: print date without tables    
    
Examples:    
  Get the current local time and date    
  > date    
    
  Get the current UTC time and date    
  > date --utc    
    
  Get the current time and date and report it based on format    
  > date --format '%Y-%m-%d %H:%M:%S.%f %z'    
    
  Get the current time and date and report it without a table    
  > date --format '%Y-%m-%d %H:%M:%S.%f %z' --raw    
    
    
    
</details>    
    
<details><summary>debug - Print the Rust debug representation of the values</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/debug.md)    
    
Print the Rust debug representation of the values    
    
Usage:    
  > debug {flags}     
    
Flags:    
  -h, --help: Display this help message    
  -r, --raw: Prints the raw value representation.    
    
    
    
</details>    
    
<details><summary>default - Sets a default row's column if missing.</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/default.md)    
    
Sets a default row's column if missing.    
    
Usage:    
  > default <column name> <column value> {flags}     
    
Parameters:    
  <column name> the name of the column    
  <column value> the value of the column to default    
    
Flags:    
  -h, --help: Display this help message    
    
Examples:    
  Give a default 'target' to all file entries    
  > ls -af | default target 'nothing'    
    
    
    
</details>    
    
<details><summary>describe - Describes the objects in the stream.</summary>    
    
    
    
Describes the objects in the stream.    
    
Usage:    
  > describe {flags}     
    
Flags:    
  -h, --help: Display this help message    
    
    
    
</details>    
    
<details><summary>do - Runs a block, optionally ignoring errors</summary>    
    
    
    
Runs a block, optionally ignoring errors    
    
Usage:    
  > with-env <block> {flags}     
    
Parameters:    
  <block> the block to run     
    
Flags:    
  -h, --help: Display this help message    
  -i, --ignore_errors: ignore errors as the block runs    
    
Examples:    
  Run the block    
  > do { echo hello }    
    
  Run the block and ignore errors    
  > do -i { thisisnotarealcommand }    
    
    
    
</details>    
    
<details><summary>drop - Drop the last number of rows.</summary>    
    
    
    
Drop the last number of rows.    
    
Usage:    
  > drop (rows) {flags}     
    
Parameters:    
  (rows) starting from the back, the number of rows to drop    
    
Flags:    
  -h, --help: Display this help message    
    
Examples:    
  Remove the last item of a list/table    
  > echo [1 2 3] | drop    
    
  Remove the last 2 items of a list/table    
  > echo [1 2 3] | drop 2    
    
    
    
</details>    
    
<details><summary>du - Find disk usage sizes of specified items</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/du.md)    
    
Find disk usage sizes of specified items    
    
Usage:    
  > du (path) {flags}     
    
Parameters:    
  (path) starting directory    
    
Flags:    
  -h, --help: Display this help message    
  -a, --all: Output file sizes as well as directory sizes    
  -r, --deref: Dereference symlinks to their targets for size    
  -x, --exclude <pattern>: Exclude these file names    
  -d, --max-depth <integer>: Directory recursion limit    
  -m, --min-size <integer>: Exclude files below this size    
    
Examples:    
  Disk usage of the current directory    
  > du    
    
    
    
</details>    
    
<details><summary>each - Run a block on each row of the table.</summary>    
    
    
    
Run a block on each row of the table.    
    
Usage:    
  > each <block> {flags}     
    
Parameters:    
  <block> the block to run on each row    
    
Flags:    
  -h, --help: Display this help message    
  -n, --numbered: returned a numbered item ($it.index and $it.item)    
    
Examples:    
  Echo the sum of each row    
  > echo [[1 2] [3 4]] | each { echo $it | math sum }    
    
  Echo the square of each integer    
  > echo [1 2 3] | each { echo $(= $it * $it) }    
    
  Number each item and echo a message    
  > echo ['bob' 'fred'] | each --numbered { echo `{{$it.index}} is {{$it.item}}` }    
    
    
    
</details>    
    
<details><summary>echo - Echo the arguments back to the user.</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/echo.md)    
    
Echo the arguments back to the user.    
    
Usage:    
  > echo  ...args{flags}     
    
Parameters:    
  ...args: the values to echo    
    
Flags:    
  -h, --help: Display this help message    
    
Examples:    
  Put a hello message in the pipeline    
  > echo 'hello'    
    
  Print the value of the special '$nu' variable    
  > echo $nu    
    
    
    
</details>    
    
<details><summary>empty? - Checks emptiness. The last value is the replacement value for any empty column(s) given to check against the table.</summary>    
    
    
    
Checks emptiness. The last value is the replacement value for any empty column(s) given to check against the table.    
    
Usage:    
  > empty?  ...args{flags}     
    
Parameters:    
  ...args: the names of the columns to check emptiness followed by the replacement value.    
    
Flags:    
  -h, --help: Display this help message    
    
    
    
</details>    
    
<details><summary>enter - Create a new shell and begin at this path.    
            
Multiple encodings are supported for reading text files by using    
the '--encoding <encoding>' parameter. Here is an example of a few:    
big5, euc-jp, euc-kr, gbk, iso-8859-1, utf-16, cp1252, latin5    
    
For a more complete list of encodings please refer to the encoding_rs    
documentation link at https://docs.rs/encoding_rs/0.8.23/encoding_rs/#statics</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/enter.md)    
    
Create a new shell and begin at this path.    
            
Multiple encodings are supported for reading text files by using    
the '--encoding <encoding>' parameter. Here is an example of a few:    
big5, euc-jp, euc-kr, gbk, iso-8859-1, utf-16, cp1252, latin5    
    
For a more complete list of encodings please refer to the encoding_rs    
documentation link at https://docs.rs/encoding_rs/0.8.23/encoding_rs/#statics    
    
Usage:    
  > enter <location> {flags}     
    
Parameters:    
  <location> the location to create a new shell from    
    
Flags:    
  -h, --help: Display this help message    
  -e, --encoding <string>: encoding to use to open file    
    
Examples:    
  Enter a path as a new shell    
  > enter ../projectB    
    
  Enter a file as a new shell    
  > enter package.json    
    
  Enters file with iso-8859-1 encoding    
  > enter file.csv --encoding iso-8859-1    
    
    
    
</details>    
    
<details><summary>every - Show (or skip) every n-th row, starting from the first one.</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/every.md)    
    
Show (or skip) every n-th row, starting from the first one.    
    
Usage:    
  > every <stride> {flags}     
    
Parameters:    
  <stride> how many rows to skip between (and including) each row returned    
    
Flags:    
  -h, --help: Display this help message    
  -s, --skip: skip the rows that would be returned, instead of selecting them    
    
Examples:    
  Get every second row    
  > echo [1 2 3 4 5] | every 2    
    
  Skip every second row    
  > echo [1 2 3 4 5] | every 2 --skip    
    
    
    
</details>    
    
<details><summary>exit - Exit the current shell (or all shells)</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/exit.md)    
    
Exit the current shell (or all shells)    
    
Usage:    
  > exit {flags}     
    
Flags:    
  -h, --help: Display this help message    
  -n, --now: exit out of the shell immediately    
    
Examples:    
  Exit the current shell    
  > exit    
    
  Exit all shells (exiting Nu)    
  > exit --now    
    
    
    
</details>    
    
<details><summary>fetch - Load from a URL into a cell, convert to table if possible (avoid by appending '--raw')</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/fetch.md)    
    
Load from a URL into a cell, convert to table if possible (avoid by appending '--raw')    
    
Usage:    
  > fetch <URL> {flags}     
    
Parameters:    
  <URL> the URL to fetch the contents from    
    
Flags:    
  -h, --help: Display this help message    
  -u, --user <any>: the username when authenticating    
  -p, --password <any>: the password when authenticating    
  -r, --raw: fetch contents as text rather than a table    
    
    
    
</details>    
    
<details><summary>first - Show only the first number of rows.</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/first.md)    
    
Show only the first number of rows.    
    
Usage:    
  > first (rows) {flags}     
    
Parameters:    
  (rows) starting from the front, the number of rows to return    
    
Flags:    
  -h, --help: Display this help message    
    
Examples:    
  Return the first item of a list/table    
  > echo [1 2 3] | first    
    
  Return the first 2 items of a list/table    
  > echo [1 2 3] | first 2    
    
    
    
</details>    
    
<details><summary>format - Format columns into a string using a simple pattern.</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/format.md)    
    
Format columns into a string using a simple pattern.    
    
Usage:    
  > format <pattern> {flags}     
    
Parameters:    
  <pattern> the pattern to output. Eg) "{foo}: {bar}"    
    
Flags:    
  -h, --help: Display this help message    
    
Examples:    
  Print filenames with their sizes    
  > ls | format '{name}: {size}'    
    
    
    
</details>    
    
<details><summary>from - Parse content (string or binary) as a table (input format based on subcommand, like csv, ini, json, toml)</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/from.md)    
    
Parse content (string or binary) as a table (input format based on subcommand, like csv, ini, json, toml)    
    
Usage:    
  > from {flags}     
    
Flags:    
  -h, --help: Display this help message    
    
    
    
- <details><summary>from bson - Parse content (string or binary) as a table (input format based on subcommand, like csv, ini, json, toml)</summary>    
    
      
    
  Parse content (string or binary) as a table (input format based on subcommand, like csv, ini, json, toml)    
      
  Usage:    
    > from {flags}     
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
- <details><summary>from csv - Parse content (string or binary) as a table (input format based on subcommand, like csv, ini, json, toml)</summary>    
    
  [Detailed Doc for from csv](https://github.com/nushell/nushell/blob/main/docs/commands/from-csv.md)    
    
  Parse content (string or binary) as a table (input format based on subcommand, like csv, ini, json, toml)    
      
  Usage:    
    > from {flags}     
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
- <details><summary>from db - Parse content (string or binary) as a table (input format based on subcommand, like csv, ini, json, toml)</summary>    
    
      
    
  Parse content (string or binary) as a table (input format based on subcommand, like csv, ini, json, toml)    
      
  Usage:    
    > from {flags}     
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
- <details><summary>from eml - Parse content (string or binary) as a table (input format based on subcommand, like csv, ini, json, toml)</summary>    
    
      
    
  Parse content (string or binary) as a table (input format based on subcommand, like csv, ini, json, toml)    
      
  Usage:    
    > from {flags}     
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
- <details><summary>from ics - Parse content (string or binary) as a table (input format based on subcommand, like csv, ini, json, toml)</summary>    
    
  [Detailed Doc for from ics](https://github.com/nushell/nushell/blob/main/docs/commands/from-ics.md)    
    
  Parse content (string or binary) as a table (input format based on subcommand, like csv, ini, json, toml)    
      
  Usage:    
    > from {flags}     
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
- <details><summary>from ini - Parse content (string or binary) as a table (input format based on subcommand, like csv, ini, json, toml)</summary>    
    
  [Detailed Doc for from ini](https://github.com/nushell/nushell/blob/main/docs/commands/from-ini.md)    
    
  Parse content (string or binary) as a table (input format based on subcommand, like csv, ini, json, toml)    
      
  Usage:    
    > from {flags}     
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
- <details><summary>from json - Parse content (string or binary) as a table (input format based on subcommand, like csv, ini, json, toml)</summary>    
    
  [Detailed Doc for from json](https://github.com/nushell/nushell/blob/main/docs/commands/from-json.md)    
    
  Parse content (string or binary) as a table (input format based on subcommand, like csv, ini, json, toml)    
      
  Usage:    
    > from {flags}     
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
- <details><summary>from ods - Parse content (string or binary) as a table (input format based on subcommand, like csv, ini, json, toml)</summary>    
    
  [Detailed Doc for from ods](https://github.com/nushell/nushell/blob/main/docs/commands/from-ods.md)    
    
  Parse content (string or binary) as a table (input format based on subcommand, like csv, ini, json, toml)    
      
  Usage:    
    > from {flags}     
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
- <details><summary>from sqlite - Parse content (string or binary) as a table (input format based on subcommand, like csv, ini, json, toml)</summary>    
    
      
    
  Parse content (string or binary) as a table (input format based on subcommand, like csv, ini, json, toml)    
      
  Usage:    
    > from {flags}     
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
- <details><summary>from ssv - Parse content (string or binary) as a table (input format based on subcommand, like csv, ini, json, toml)</summary>    
    
      
    
  Parse content (string or binary) as a table (input format based on subcommand, like csv, ini, json, toml)    
      
  Usage:    
    > from {flags}     
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
- <details><summary>from toml - Parse content (string or binary) as a table (input format based on subcommand, like csv, ini, json, toml)</summary>    
    
  [Detailed Doc for from toml](https://github.com/nushell/nushell/blob/main/docs/commands/from-toml.md)    
    
  Parse content (string or binary) as a table (input format based on subcommand, like csv, ini, json, toml)    
      
  Usage:    
    > from {flags}     
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
- <details><summary>from tsv - Parse content (string or binary) as a table (input format based on subcommand, like csv, ini, json, toml)</summary>    
    
  [Detailed Doc for from tsv](https://github.com/nushell/nushell/blob/main/docs/commands/from-tsv.md)    
    
  Parse content (string or binary) as a table (input format based on subcommand, like csv, ini, json, toml)    
      
  Usage:    
    > from {flags}     
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
- <details><summary>from url - Parse content (string or binary) as a table (input format based on subcommand, like csv, ini, json, toml)</summary>    
    
  [Detailed Doc for from url](https://github.com/nushell/nushell/blob/main/docs/commands/from-url.md)    
    
  Parse content (string or binary) as a table (input format based on subcommand, like csv, ini, json, toml)    
      
  Usage:    
    > from {flags}     
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
- <details><summary>from vcf - Parse content (string or binary) as a table (input format based on subcommand, like csv, ini, json, toml)</summary>    
    
  [Detailed Doc for from vcf](https://github.com/nushell/nushell/blob/main/docs/commands/from-vcf.md)    
    
  Parse content (string or binary) as a table (input format based on subcommand, like csv, ini, json, toml)    
      
  Usage:    
    > from {flags}     
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
- <details><summary>from xlsx - Parse content (string or binary) as a table (input format based on subcommand, like csv, ini, json, toml)</summary>    
    
  [Detailed Doc for from xlsx](https://github.com/nushell/nushell/blob/main/docs/commands/from-xlsx.md)    
    
  Parse content (string or binary) as a table (input format based on subcommand, like csv, ini, json, toml)    
      
  Usage:    
    > from {flags}     
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
- <details><summary>from xml - Parse content (string or binary) as a table (input format based on subcommand, like csv, ini, json, toml)</summary>    
    
  [Detailed Doc for from xml](https://github.com/nushell/nushell/blob/main/docs/commands/from-xml.md)    
    
  Parse content (string or binary) as a table (input format based on subcommand, like csv, ini, json, toml)    
      
  Usage:    
    > from {flags}     
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
- <details><summary>from yaml - Parse content (string or binary) as a table (input format based on subcommand, like csv, ini, json, toml)</summary>    
    
  [Detailed Doc for from yaml](https://github.com/nushell/nushell/blob/main/docs/commands/from-yaml.md)    
    
  Parse content (string or binary) as a table (input format based on subcommand, like csv, ini, json, toml)    
      
  Usage:    
    > from {flags}     
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
- <details><summary>from yml - Parse content (string or binary) as a table (input format based on subcommand, like csv, ini, json, toml)</summary>    
    
      
    
  Parse content (string or binary) as a table (input format based on subcommand, like csv, ini, json, toml)    
      
  Usage:    
    > from {flags}     
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
</details>    
    
<details><summary>get - Open given cells as text.</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/get.md)    
    
Open given cells as text.    
    
Usage:    
  > get  ...args{flags}     
    
Parameters:    
  ...args: optionally return additional data by path    
    
Flags:    
  -h, --help: Display this help message    
    
Examples:    
  Extract the name of files as a list    
  > ls | get name    
    
  Extract the cpu list from the sys information    
  > sys | get cpu    
    
    
    
</details>    
    
<details><summary>group-by - Creates a new table with the data from the table rows grouped by the column given.</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/group-by.md)    
    
Creates a new table with the data from the table rows grouped by the column given.    
    
Usage:    
  > group-by (column_name) {flags}     
    
Parameters:    
  (column_name) the name of the column to group by    
    
Flags:    
  -h, --help: Display this help message    
    
Examples:    
  Group items by type    
  > ls | group-by type    
    
  Group items by their value    
  > echo [1 3 1 3 2 1 1] | group-by    
    
    
    
- <details><summary>group-by date - Creates a new table with the data from the table rows grouped by the column given.</summary>    
    
      
    
  Creates a new table with the data from the table rows grouped by the column given.    
      
  Usage:    
    > group-by (column_name) {flags}     
      
  Parameters:    
    (column_name) the name of the column to group by    
      
  Flags:    
    -h, --help: Display this help message    
      
  Examples:    
    Group items by type    
    > ls | group-by type    
      
    Group items by their value    
    > echo [1 3 1 3 2 1 1] | group-by    
      
      
    
  </details>    
    
</details>    
    
<details><summary>headers - Use the first row of the table as column names</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/headers.md)    
    
Use the first row of the table as column names    
    
Usage:    
  > headers {flags}     
    
Flags:    
  -h, --help: Display this help message    
    
Examples:    
  Create headers for a raw string    
  > echo "a b c|1 2 3" | split row "|" | split column " " | headers    
    
    
    
</details>    
    
<details><summary>help - Display help information about commands.</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/help.md)    
    
Display help information about commands.    
    
Usage:    
  > help  ...args{flags}     
    
Parameters:    
  ...args: the name of command to get help on    
    
Flags:    
  -h, --help: Display this help message    
    
    
    
</details>    
    
<details><summary>histogram - Creates a new table with a histogram based on the column name passed in.</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/histogram.md)    
    
Creates a new table with a histogram based on the column name passed in.    
    
Usage:    
  > histogram <column_name>  ...args{flags}     
    
Parameters:    
  <column_name> the name of the column to graph by    
  ...args: column name to give the histogram's frequency column    
    
Flags:    
  -h, --help: Display this help message    
    
Examples:    
  Get a histogram for the types of files    
  > ls | histogram type    
    
  Get a histogram for the types of files, with frequency column named count    
  > ls | histogram type count    
    
  Get a histogram for a list of numbers    
  > echo [1 2 3 1 1 1 2 2 1 1] | histogram    
    
    
    
</details>    
    
<details><summary>history - Display command history.</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/history.md)    
    
Display command history.    
    
Usage:    
  > history {flags}     
    
Flags:    
  -h, --help: Display this help message    
    
    
    
</details>    
    
<details><summary>if - Filter table to match the condition.</summary>    
    
    
    
Filter table to match the condition.    
    
Usage:    
  > if <condition> <then_case> <else_case> {flags}     
    
Parameters:    
  <condition> the condition that must match    
  <then_case> block to run if condition is true    
  <else_case> block to run if condition is false    
    
Flags:    
  -h, --help: Display this help message    
    
Examples:    
  Run a block if a condition is true    
  > echo 10 | if $it > 5 { echo 'greater than 5' } { echo 'less than or equal to 5' }    
    
  Run a block if a condition is false    
  > echo 1 | if $it > 5 { echo 'greater than 5' } { echo 'less than or equal to 5' }    
    
    
    
</details>    
    
<details><summary>inc - Increment a value or version. Optionally use the column of a table.</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/inc.md)    
    
Increment a value or version. Optionally use the column of a table.    
    
Usage:    
  > inc  ...args{flags}     
    
Parameters:    
  ...args: the column(s) to update    
    
Flags:    
  -h, --help: Display this help message    
  -M, --major: increment the major version (eg 1.2.1 -> 2.0.0)    
  -m, --minor: increment the minor version (eg 1.2.1 -> 1.3.0)    
  -p, --patch: increment the patch version (eg 1.2.1 -> 1.2.2)    
    
    
    
</details>    
    
<details><summary>insert - Insert a new column with a given value.</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/insert.md)    
    
Insert a new column with a given value.    
    
Usage:    
  > insert <column> <value> {flags}     
    
Parameters:    
  <column> the column name to insert    
  <value> the value to give the cell(s)    
    
Flags:    
  -h, --help: Display this help message    
    
    
    
</details>    
    
<details><summary>keep - Keep the number of rows only</summary>    
    
    
    
Keep the number of rows only    
    
Usage:    
  > keep (rows) {flags}     
    
Parameters:    
  (rows) starting from the front, the number of rows to keep    
    
Flags:    
  -h, --help: Display this help message    
    
Examples:    
  Keep the first row    
  > echo [1 2 3] | keep    
    
  Keep the first four rows    
  > echo [1 2 3 4 5] | keep 4    
    
    
    
</details>    
    
<details><summary>keep-until - Keeps rows until the condition matches.</summary>    
    
    
    
Keeps rows until the condition matches.    
    
Usage:    
  > keep-until <condition> {flags}     
    
Parameters:    
  <condition> the condition that must be met to stop keeping rows    
    
Flags:    
  -h, --help: Display this help message    
    
    
    
</details>    
    
<details><summary>keep-while - Keeps rows while the condition matches.</summary>    
    
    
    
Keeps rows while the condition matches.    
    
Usage:    
  > keep-while <condition> {flags}     
    
Parameters:    
  <condition> the condition that must be met to keep rows    
    
Flags:    
  -h, --help: Display this help message    
    
    
    
</details>    
    
<details><summary>kill - Kill a process using the process id.</summary>    
    
    
    
Kill a process using the process id.    
    
Usage:    
  > kill <pid>  ...args{flags}     
    
Parameters:    
  <pid> process id of process that is to be killed    
  ...args: rest of processes to kill    
    
Flags:    
  -h, --help: Display this help message    
  -f, --force: forcefully kill the process    
  -q, --quiet: won't print anything to the console    
    
Examples:    
  Kill the pid using the most memory    
  > ps | sort-by mem | last | kill $it.pid    
    
  Force kill a given pid    
  > kill --force 12345    
    
    
    
</details>    
    
<details><summary>last - Show only the last number of rows.</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/last.md)    
    
Show only the last number of rows.    
    
Usage:    
  > last (rows) {flags}     
    
Parameters:    
  (rows) starting from the back, the number of rows to return    
    
Flags:    
  -h, --help: Display this help message    
    
Examples:    
  Get the last row    
  > echo [1 2 3] | last    
    
  Get the last three rows    
  > echo [1 2 3 4 5] | last 3    
    
    
    
</details>    
    
<details><summary>lines - Split single string into rows, one per line.</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/lines.md)    
    
Split single string into rows, one per line.    
    
Usage:    
  > lines {flags}     
    
Flags:    
  -h, --help: Display this help message    
    
Examples:    
  Split multi-line string into lines    
  > ^echo "two\nlines" | lines    
    
    
    
</details>    
    
<details><summary>ls - View the contents of the current or given path.</summary>    
    
    
    
View the contents of the current or given path.    
    
Usage:    
  > ls (path) {flags}     
    
Parameters:    
  (path) a path to get the directory contents from    
    
Flags:    
  -h, --help: Display this help message    
  -a, --all: also show hidden files    
  -f, --full: list all available columns for each entry    
  -s, --short-names: only print the file names and not the path    
  -w, --with-symlink-targets: display the paths to the target files that symlinks point to    
  -d, --du: display the apparent directory size in place of the directory metadata size    
    
Examples:    
  List all files in the current directory    
  > ls    
    
  List all files in a subdirectory    
  > ls subdir    
    
  List all rust files    
  > ls *.rs    
    
    
    
</details>    
    
<details><summary>match - filter rows by regex</summary>    
    
    
    
filter rows by regex    
    
Usage:    
  > match <member> <regex> {flags}     
    
Parameters:    
  <member> the column name to match    
  <regex> the regex to match with    
    
Flags:    
  -h, --help: Display this help message    
    
    
    
</details>    
    
<details><summary>math - Use mathematical functions as aggregate functions on a list of numbers or tables</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/math.md)    
    
Use mathematical functions as aggregate functions on a list of numbers or tables    
    
Usage:    
  > math {flags}     
    
Flags:    
  -h, --help: Display this help message    
    
    
    
- <details><summary>math avg - Use mathematical functions as aggregate functions on a list of numbers or tables</summary>    
    
      
    
  Use mathematical functions as aggregate functions on a list of numbers or tables    
      
  Usage:    
    > math {flags}     
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
- <details><summary>math max - Use mathematical functions as aggregate functions on a list of numbers or tables</summary>    
    
      
    
  Use mathematical functions as aggregate functions on a list of numbers or tables    
      
  Usage:    
    > math {flags}     
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
- <details><summary>math median - Use mathematical functions as aggregate functions on a list of numbers or tables</summary>    
    
      
    
  Use mathematical functions as aggregate functions on a list of numbers or tables    
      
  Usage:    
    > math {flags}     
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
- <details><summary>math min - Use mathematical functions as aggregate functions on a list of numbers or tables</summary>    
    
      
    
  Use mathematical functions as aggregate functions on a list of numbers or tables    
      
  Usage:    
    > math {flags}     
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
- <details><summary>math mode - Use mathematical functions as aggregate functions on a list of numbers or tables</summary>    
    
      
    
  Use mathematical functions as aggregate functions on a list of numbers or tables    
      
  Usage:    
    > math {flags}     
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
- <details><summary>math sum - Use mathematical functions as aggregate functions on a list of numbers or tables</summary>    
    
      
    
  Use mathematical functions as aggregate functions on a list of numbers or tables    
      
  Usage:    
    > math {flags}     
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
</details>    
    
<details><summary>merge - Merge a table.</summary>    
    
    
    
Merge a table.    
    
Usage:    
  > merge <block> {flags}     
    
Parameters:    
  <block> the block to run and merge into the table    
    
Flags:    
  -h, --help: Display this help message    
    
Examples:    
  Merge a 1-based index column with some ls output    
  > ls | select name | keep 3 | merge { echo [1 2 3] | wrap index }    
    
    
    
</details>    
    
<details><summary>mkdir - Make directories, creates intermediary directories as required.</summary>    
    
    
    
Make directories, creates intermediary directories as required.    
    
Usage:    
  > mkdir  ...args{flags}     
    
Parameters:    
  ...args: the name(s) of the path(s) to create    
    
Flags:    
  -h, --help: Display this help message    
  -s, --show-created-paths: show the path(s) created.    
    
Examples:    
  Make a directory named foo    
  > mkdir foo    
    
    
    
</details>    
    
<details><summary>move - moves across desired subcommand.</summary>    
    
    
    
moves across desired subcommand.    
    
Usage:    
  > move {flags}     
    
Flags:    
  -h, --help: Display this help message    
    
    
    
- <details><summary>move column - moves across desired subcommand.</summary>    
    
      
    
  moves across desired subcommand.    
      
  Usage:    
    > move {flags}     
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
</details>    
    
<details><summary>mv - Move files or directories.</summary>    
    
    
    
Move files or directories.    
    
Usage:    
  > mv <source> <destination> {flags}     
    
Parameters:    
  <source> the location to move files/directories from    
  <destination> the location to move files/directories to    
    
Flags:    
  -h, --help: Display this help message    
    
Examples:    
  Rename a file    
  > mv before.txt after.txt    
    
  Move a file into a directory    
  > mv test.txt my/subdirectory    
    
  Move many files into a directory    
  > mv *.txt my/subdirectory    
    
    
    
</details>    
    
<details><summary>n - Go to next shell.</summary>    
    
    
    
Go to next shell.    
    
Usage:    
  > n {flags}     
    
Flags:    
  -h, --help: Display this help message    
    
    
    
</details>    
    
<details><summary>nth - Return only the selected rows</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/nth.md)    
    
Return only the selected rows    
    
Usage:    
  > nth <row number>  ...args{flags}     
    
Parameters:    
  <row number> the number of the row to return    
  ...args: Optionally return more rows    
    
Flags:    
  -h, --help: Display this help message    
    
Examples:    
  Get the second row    
  > echo [first second third] | nth 1    
    
  Get the first and third rows    
  > echo [first second third] | nth 0 2    
    
    
    
</details>    
    
<details><summary>open - Load a file into a cell, convert to table if possible (avoid by appending '--raw').    
            
Multiple encodings are supported for reading text files by using    
the '--encoding <encoding>' parameter. Here is an example of a few:    
big5, euc-jp, euc-kr, gbk, iso-8859-1, utf-16, cp1252, latin5    
    
For a more complete list of encodings please refer to the encoding_rs    
documentation link at https://docs.rs/encoding_rs/0.8.23/encoding_rs/#statics</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/open.md)    
    
Load a file into a cell, convert to table if possible (avoid by appending '--raw').    
            
Multiple encodings are supported for reading text files by using    
the '--encoding <encoding>' parameter. Here is an example of a few:    
big5, euc-jp, euc-kr, gbk, iso-8859-1, utf-16, cp1252, latin5    
    
For a more complete list of encodings please refer to the encoding_rs    
documentation link at https://docs.rs/encoding_rs/0.8.23/encoding_rs/#statics    
    
Usage:    
  > open <path> {flags}     
    
Parameters:    
  <path> the file path to load values from    
    
Flags:    
  -h, --help: Display this help message    
  -r, --raw: load content as a string instead of a table    
  -e, --encoding <string>: encoding to use to open file    
    
Examples:    
  Opens "users.csv" and creates a table from the data    
  > open users.csv    
    
  Opens file with iso-8859-1 encoding    
  > open file.csv --encoding iso-8859-1 | from csv    
    
    
    
</details>    
    
<details><summary>p - Go to previous shell.</summary>    
    
    
    
Go to previous shell.    
    
Usage:    
  > p {flags}     
    
Flags:    
  -h, --help: Display this help message    
    
    
    
</details>    
    
<details><summary>parse - Parse columns from string data using a simple pattern.</summary>    
    
    
    
Parse columns from string data using a simple pattern.    
    
Usage:    
  > parse <pattern> {flags}     
    
Parameters:    
  <pattern> the pattern to match. Eg) "{foo}: {bar}"    
    
Flags:    
  -h, --help: Display this help message    
  -r, --regex: use full regex syntax for patterns    
    
    
    
</details>    
    
<details><summary>pivot - Pivots the table contents so rows become columns and columns become rows.</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/pivot.md)    
    
Pivots the table contents so rows become columns and columns become rows.    
    
Usage:    
  > pivot  ...args{flags}     
    
Parameters:    
  ...args: the names to give columns once pivoted    
    
Flags:    
  -h, --help: Display this help message    
  -r, --header-row: treat the first row as column names    
  -i, --ignore-titles: don't pivot the column names into values    
    
    
    
</details>    
    
<details><summary>post - Post content to a url and retrieve data as a table if possible.</summary>    
    
    
    
Post content to a url and retrieve data as a table if possible.    
    
Usage:    
  > post <path> <body> {flags}     
    
Parameters:    
  <path> the URL to post to    
  <body> the contents of the post body    
    
Flags:    
  -h, --help: Display this help message    
  -u, --user <any>: the username when authenticating    
  -p, --password <any>: the password when authenticating    
  -t, --content-type <any>: the MIME type of content to post    
  -l, --content-length <any>: the length of the content being posted    
  -r, --raw: return values as a string instead of a table    
    
    
    
</details>    
    
<details><summary>prepend - Prepend the given row to the front of the table</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/prepend.md)    
    
Prepend the given row to the front of the table    
    
Usage:    
  > prepend <row value> {flags}     
    
Parameters:    
  <row value> the value of the row to prepend to the table    
    
Flags:    
  -h, --help: Display this help message    
    
Examples:    
  Add something to the beginning of a list or table    
  > echo [2 3 4] | prepend 1    
    
    
    
</details>    
    
<details><summary>ps - View information about system processes.</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/ps.md)    
    
View information about system processes.    
    
Usage:    
  > ps {flags}     
    
Flags:    
  -h, --help: Display this help message    
  -f, --full: list all available columns for each entry    
    
    
    
</details>    
    
<details><summary>pwd - Output the current working directory.</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/pwd.md)    
    
Output the current working directory.    
    
Usage:    
  > pwd {flags}     
    
Flags:    
  -h, --help: Display this help message    
    
Examples:    
  Print the current working directory    
  > pwd    
    
    
    
</details>    
    
<details><summary>random - Generate random values</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/random.md)    
    
Generate random values    
    
Usage:    
  > random {flags}     
    
Flags:    
  -h, --help: Display this help message    
    
    
    
- <details><summary>random bool - Generate random values</summary>    
    
      
    
  Generate random values    
      
  Usage:    
    > random {flags}     
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
- <details><summary>random dice - Generate random values</summary>    
    
      
    
  Generate random values    
      
  Usage:    
    > random {flags}     
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
- <details><summary>random uuid - Generate random values</summary>    
    
      
    
  Generate random values    
      
  Usage:    
    > random {flags}     
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
</details>    
    
<details><summary>range - Return only the selected rows</summary>    
    
    
    
Return only the selected rows    
    
Usage:    
  > range <rows > {flags}     
    
Parameters:    
  <rows > range of rows to return: Eg) 4..7 (=> from 4 to 7)    
    
Flags:    
  -h, --help: Display this help message    
    
    
    
</details>    
    
<details><summary>reject - Remove the given columns from the table.</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/reject.md)    
    
Remove the given columns from the table.    
    
Usage:    
  > reject  ...args{flags}     
    
Parameters:    
  ...args: the names of columns to remove    
    
Flags:    
  -h, --help: Display this help message    
    
Examples:    
  Lists the files in a directory without showing the modified column    
  > ls | reject modified    
    
    
    
</details>    
    
<details><summary>rename - Creates a new table with columns renamed.</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/rename.md)    
    
Creates a new table with columns renamed.    
    
Usage:    
  > rename <column_name>  ...args{flags}     
    
Parameters:    
  <column_name> the new name for the first column    
  ...args: the new name for additional columns    
    
Flags:    
  -h, --help: Display this help message    
    
Examples:    
  Rename a column    
  > echo "{a: 1, b: 2, c: 3}" | from json | rename my_column    
    
  Rename many columns    
  > echo "{a: 1, b: 2, c: 3}" | from json | rename spam eggs cars    
    
    
    
</details>    
    
<details><summary>reverse - Reverses the table.</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/reverse.md)    
    
Reverses the table.    
    
Usage:    
  > reverse {flags}     
    
Flags:    
  -h, --help: Display this help message    
    
Examples:    
  Sort list of numbers in descending file size    
  > echo [3 1 2 19 0] | reverse    
    
    
    
</details>    
    
<details><summary>rm - Remove file(s)</summary>    
    
    
    
Remove file(s)    
    
Usage:    
  > rm  ...args{flags}     
    
Parameters:    
  ...args: the file path(s) to remove    
    
Flags:    
  -h, --help: Display this help message    
  -t, --trash: use the platform's recycle bin instead of permanently deleting    
  -p, --permanent: don't use recycle bin, delete permanently    
  -r, --recursive: delete subdirectories recursively    
    
Examples:    
  Delete or move a file to the system trash (depending on 'rm_always_trash' config option)    
  > rm file.txt    
    
  Move a file to the system trash    
  > rm --trash file.txt    
    
  Delete a file permanently    
  > rm --permanent file.txt    
    
    
    
</details>    
    
<details><summary>run_external - </summary>    
    
    
    
    
    
Usage:    
  > run_external  ...args{flags}     
    
Parameters:    
  ...args: external command arguments    
    
Flags:    
  -h, --help: Display this help message    
    
    
    
</details>    
    
<details><summary>save - Save the contents of the pipeline to a file.</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/save.md)    
    
Save the contents of the pipeline to a file.    
    
Usage:    
  > save (path) {flags}     
    
Parameters:    
  (path) the path to save contents to    
    
Flags:    
  -h, --help: Display this help message    
  -r, --raw: treat values as-is rather than auto-converting based on file extension    
    
    
    
</details>    
    
<details><summary>select - Down-select table to only these columns.</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/select.md)    
    
Down-select table to only these columns.    
    
Usage:    
  > select  ...args{flags}     
    
Parameters:    
  ...args: the columns to select from the table    
    
Flags:    
  -h, --help: Display this help message    
    
Examples:    
  Select just the name column    
  > ls | select name    
    
  Select the name and size columns    
  > ls | select name size    
    
    
    
</details>    
    
<details><summary>shells - Display the list of current shells.</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/shells.md)    
    
Display the list of current shells.    
    
Usage:    
  > shells {flags}     
    
Flags:    
  -h, --help: Display this help message    
    
    
    
</details>    
    
<details><summary>shuffle - Shuffle rows randomly.</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/shuffle.md)    
    
Shuffle rows randomly.    
    
Usage:    
  > shuffle {flags}     
    
Flags:    
  -h, --help: Display this help message    
    
    
    
</details>    
    
<details><summary>size - Gather word count statistics on the text.</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/size.md)    
    
Gather word count statistics on the text.    
    
Usage:    
  > size {flags}     
    
Flags:    
  -h, --help: Display this help message    
    
Examples:    
  Count the number of words in a string    
  > echo "There are seven words in this sentence" | size    
    
    
    
</details>    
    
<details><summary>skip - Skip some number of rows.</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/skip.md)    
    
Skip some number of rows.    
    
Usage:    
  > skip (rows) {flags}     
    
Parameters:    
  (rows) how many rows to skip    
    
Flags:    
  -h, --help: Display this help message    
    
Examples:    
  Skip the first 5 rows    
  > echo [1 2 3 4 5 6 7] | skip 5    
    
    
    
</details>    
    
<details><summary>skip-until - Skips rows until the condition matches.</summary>    
    
    
    
Skips rows until the condition matches.    
    
Usage:    
  > skip-until <condition> {flags}     
    
Parameters:    
  <condition> the condition that must be met to stop skipping    
    
Flags:    
  -h, --help: Display this help message    
    
    
    
</details>    
    
<details><summary>skip-while - Skips rows while the condition matches.</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/skip-while.md)    
    
Skips rows while the condition matches.    
    
Usage:    
  > skip-while <condition> {flags}     
    
Parameters:    
  <condition> the condition that must be met to continue skipping    
    
Flags:    
  -h, --help: Display this help message    
    
    
    
</details>    
    
<details><summary>sort-by - Sort by the given columns, in increasing order.</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/sort-by.md)    
    
Sort by the given columns, in increasing order.    
    
Usage:    
  > sort-by  ...args{flags}     
    
Parameters:    
  ...args: the column(s) to sort by    
    
Flags:    
  -h, --help: Display this help message    
    
Examples:    
  Sort list by increasing value    
  > echo [4 2 3 1] | sort-by    
    
  Sort output by increasing file size    
  > ls | sort-by size    
    
  Sort output by type, and then by file size for each type    
  > ls | sort-by type size    
    
    
    
</details>    
    
<details><summary>split - split contents across desired subcommand (like row, column) via the separator.</summary>    
    
    
    
split contents across desired subcommand (like row, column) via the separator.    
    
Usage:    
  > split {flags}     
    
Flags:    
  -h, --help: Display this help message    
    
    
    
- <details><summary>split chars - split contents across desired subcommand (like row, column) via the separator.</summary>    
    
      
    
  split contents across desired subcommand (like row, column) via the separator.    
      
  Usage:    
    > split {flags}     
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
- <details><summary>split column - split contents across desired subcommand (like row, column) via the separator.</summary>    
    
  [Detailed Doc for split column](https://github.com/nushell/nushell/blob/main/docs/commands/split-column.md)    
    
  split contents across desired subcommand (like row, column) via the separator.    
      
  Usage:    
    > split {flags}     
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
- <details><summary>split row - split contents across desired subcommand (like row, column) via the separator.</summary>    
    
  [Detailed Doc for split row](https://github.com/nushell/nushell/blob/main/docs/commands/split-row.md)    
    
  split contents across desired subcommand (like row, column) via the separator.    
      
  Usage:    
    > split {flags}     
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
</details>    
    
<details><summary>split-by - Creates a new table with the data from the inner tables split by the column given.</summary>    
    
    
    
Creates a new table with the data from the inner tables split by the column given.    
    
Usage:    
  > split-by (column_name) {flags}     
    
Parameters:    
  (column_name) the name of the column within the nested table to split by    
    
Flags:    
  -h, --help: Display this help message    
    
    
    
</details>    
    
<details><summary>start - Opens each file/directory/URL using the default application</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/start.md)    
    
Opens each file/directory/URL using the default application    
    
Usage:    
  > start  ...args{flags}     
    
Parameters:    
  ...args: files/urls/directories to open    
    
Flags:    
  -h, --help: Display this help message    
  -a, --application <string>: Specifies the application used for opening the files/directories/urls    
    
    
    
</details>    
    
<details><summary>str - Apply string function.</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/str.md)    
    
Apply string function.    
    
Usage:    
  > str  ...args{flags}     
    
Parameters:    
  ...args: optionally convert by column paths    
    
Flags:    
  -h, --help: Display this help message    
    
    
    
- <details><summary>str capitalize - Apply string function.</summary>    
    
      
    
  Apply string function.    
      
  Usage:    
    > str  ...args{flags}     
      
  Parameters:    
    ...args: optionally convert by column paths    
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
- <details><summary>str collect - Apply string function.</summary>    
    
      
    
  Apply string function.    
      
  Usage:    
    > str  ...args{flags}     
      
  Parameters:    
    ...args: optionally convert by column paths    
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
- <details><summary>str downcase - Apply string function.</summary>    
    
      
    
  Apply string function.    
      
  Usage:    
    > str  ...args{flags}     
      
  Parameters:    
    ...args: optionally convert by column paths    
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
- <details><summary>str find-replace - Apply string function.</summary>    
    
      
    
  Apply string function.    
      
  Usage:    
    > str  ...args{flags}     
      
  Parameters:    
    ...args: optionally convert by column paths    
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
- <details><summary>str length - Apply string function.</summary>    
    
      
    
  Apply string function.    
      
  Usage:    
    > str  ...args{flags}     
      
  Parameters:    
    ...args: optionally convert by column paths    
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
- <details><summary>str set - Apply string function.</summary>    
    
      
    
  Apply string function.    
      
  Usage:    
    > str  ...args{flags}     
      
  Parameters:    
    ...args: optionally convert by column paths    
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
- <details><summary>str substring - Apply string function.</summary>    
    
      
    
  Apply string function.    
      
  Usage:    
    > str  ...args{flags}     
      
  Parameters:    
    ...args: optionally convert by column paths    
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
- <details><summary>str to-datetime - Apply string function.</summary>    
    
      
    
  Apply string function.    
      
  Usage:    
    > str  ...args{flags}     
      
  Parameters:    
    ...args: optionally convert by column paths    
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
- <details><summary>str to-decimal - Apply string function.</summary>    
    
      
    
  Apply string function.    
      
  Usage:    
    > str  ...args{flags}     
      
  Parameters:    
    ...args: optionally convert by column paths    
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
- <details><summary>str to-int - Apply string function.</summary>    
    
      
    
  Apply string function.    
      
  Usage:    
    > str  ...args{flags}     
      
  Parameters:    
    ...args: optionally convert by column paths    
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
- <details><summary>str trim - Apply string function.</summary>    
    
      
    
  Apply string function.    
      
  Usage:    
    > str  ...args{flags}     
      
  Parameters:    
    ...args: optionally convert by column paths    
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
- <details><summary>str upcase - Apply string function.</summary>    
    
      
    
  Apply string function.    
      
  Usage:    
    > str  ...args{flags}     
      
  Parameters:    
    ...args: optionally convert by column paths    
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
</details>    
    
<details><summary>sys - View information about the current system.</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/sys.md)    
    
View information about the current system.    
    
Usage:    
  > sys {flags}     
    
Flags:    
  -h, --help: Display this help message    
    
    
    
</details>    
    
<details><summary>table - View the contents of the pipeline as a table.</summary>    
    
    
    
View the contents of the pipeline as a table.    
    
Usage:    
  > table {flags}     
    
Flags:    
  -h, --help: Display this help message    
  -n, --start_number <number>: row number to start viewing from    
    
    
    
</details>    
    
<details><summary>tags - Read the tags (metadata) for values.</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/tags.md)    
    
Read the tags (metadata) for values.    
    
Usage:    
  > tags {flags}     
    
Flags:    
  -h, --help: Display this help message    
    
    
    
</details>    
    
<details><summary>textview - Autoview of text data.</summary>    
    
    
    
Autoview of text data.    
    
Usage:    
  > textview {flags}     
    
Flags:    
  -h, --help: Display this help message    
    
    
    
</details>    
    
<details><summary>to - Convert table into an output format (based on subcommand, like csv, html, json, yaml).</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/to.md)    
    
Convert table into an output format (based on subcommand, like csv, html, json, yaml).    
    
Usage:    
  > to {flags}     
    
Flags:    
  -h, --help: Display this help message    
    
    
    
- <details><summary>to bson - Convert table into an output format (based on subcommand, like csv, html, json, yaml).</summary>    
    
      
    
  Convert table into an output format (based on subcommand, like csv, html, json, yaml).    
      
  Usage:    
    > to {flags}     
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
- <details><summary>to csv - Convert table into an output format (based on subcommand, like csv, html, json, yaml).</summary>    
    
  [Detailed Doc for to csv](https://github.com/nushell/nushell/blob/main/docs/commands/to-csv.md)    
    
  Convert table into an output format (based on subcommand, like csv, html, json, yaml).    
      
  Usage:    
    > to {flags}     
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
- <details><summary>to db - Convert table into an output format (based on subcommand, like csv, html, json, yaml).</summary>    
    
      
    
  Convert table into an output format (based on subcommand, like csv, html, json, yaml).    
      
  Usage:    
    > to {flags}     
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
- <details><summary>to html - Convert table into an output format (based on subcommand, like csv, html, json, yaml).</summary>    
    
      
    
  Convert table into an output format (based on subcommand, like csv, html, json, yaml).    
      
  Usage:    
    > to {flags}     
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
- <details><summary>to json - Convert table into an output format (based on subcommand, like csv, html, json, yaml).</summary>    
    
  [Detailed Doc for to json](https://github.com/nushell/nushell/blob/main/docs/commands/to-json.md)    
    
  Convert table into an output format (based on subcommand, like csv, html, json, yaml).    
      
  Usage:    
    > to {flags}     
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
- <details><summary>to md - Convert table into an output format (based on subcommand, like csv, html, json, yaml).</summary>    
    
      
    
  Convert table into an output format (based on subcommand, like csv, html, json, yaml).    
      
  Usage:    
    > to {flags}     
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
- <details><summary>to sqlite - Convert table into an output format (based on subcommand, like csv, html, json, yaml).</summary>    
    
      
    
  Convert table into an output format (based on subcommand, like csv, html, json, yaml).    
      
  Usage:    
    > to {flags}     
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
- <details><summary>to toml - Convert table into an output format (based on subcommand, like csv, html, json, yaml).</summary>    
    
  [Detailed Doc for to toml](https://github.com/nushell/nushell/blob/main/docs/commands/to-toml.md)    
    
  Convert table into an output format (based on subcommand, like csv, html, json, yaml).    
      
  Usage:    
    > to {flags}     
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
- <details><summary>to tsv - Convert table into an output format (based on subcommand, like csv, html, json, yaml).</summary>    
    
  [Detailed Doc for to tsv](https://github.com/nushell/nushell/blob/main/docs/commands/to-tsv.md)    
    
  Convert table into an output format (based on subcommand, like csv, html, json, yaml).    
      
  Usage:    
    > to {flags}     
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
- <details><summary>to url - Convert table into an output format (based on subcommand, like csv, html, json, yaml).</summary>    
    
  [Detailed Doc for to url](https://github.com/nushell/nushell/blob/main/docs/commands/to-url.md)    
    
  Convert table into an output format (based on subcommand, like csv, html, json, yaml).    
      
  Usage:    
    > to {flags}     
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
- <details><summary>to yaml - Convert table into an output format (based on subcommand, like csv, html, json, yaml).</summary>    
    
  [Detailed Doc for to yaml](https://github.com/nushell/nushell/blob/main/docs/commands/to-yaml.md)    
    
  Convert table into an output format (based on subcommand, like csv, html, json, yaml).    
      
  Usage:    
    > to {flags}     
      
  Flags:    
    -h, --help: Display this help message    
      
      
    
  </details>    
    
</details>    
    
<details><summary>touch - creates a file</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/touch.md)    
    
creates a file    
    
Usage:    
  > touch <filename> {flags}     
    
Parameters:    
  <filename> the path of the file you want to create    
    
Flags:    
  -h, --help: Display this help message    
    
Examples:    
  Creates "fixture.json"    
  > touch fixture.json    
    
    
    
</details>    
    
<details><summary>tree - View the contents of the pipeline as a tree.</summary>    
    
    
    
View the contents of the pipeline as a tree.    
    
Usage:    
  > tree {flags}     
    
Flags:    
  -h, --help: Display this help message    
    
    
    
</details>    
    
<details><summary>trim - Trim leading and following whitespace from text data.</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/trim.md)    
    
Trim leading and following whitespace from text data.    
    
Usage:    
  > trim {flags}     
    
Flags:    
  -h, --help: Display this help message    
    
Examples:    
  Trims surrounding whitespace and outputs "Hello world"    
  > echo "    Hello world" | trim    
    
    
    
</details>    
    
<details><summary>uniq - Return the unique rows</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/uniq.md)    
    
Return the unique rows    
    
Usage:    
  > uniq {flags}     
    
Flags:    
  -h, --help: Display this help message    
  -c, --count: Count the unique rows    
    
    
    
</details>    
    
<details><summary>update - Update an existing column to have a new value.</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/update.md)    
    
Update an existing column to have a new value.    
    
Usage:    
  > update <field> <replacement value> {flags}     
    
Parameters:    
  <field> the name of the column to update    
  <replacement value> the new value to give the cell(s)    
    
Flags:    
  -h, --help: Display this help message    
    
    
    
</details>    
    
<details><summary>version - Display Nu version</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/version.md)    
    
Display Nu version    
    
Usage:    
  > version {flags}     
    
Flags:    
  -h, --help: Display this help message    
    
Examples:    
  Display Nu version    
  > version    
    
    
    
</details>    
    
<details><summary>where - Filter table to match the condition.</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/where.md)    
    
Filter table to match the condition.    
    
Usage:    
  > where <condition> {flags}     
    
Parameters:    
  <condition> the condition that must match    
    
Flags:    
  -h, --help: Display this help message    
    
Examples:    
  List all files in the current directory with sizes greater than 2kb    
  > ls | where size > 2kb    
    
  List only the files in the current directory    
  > ls | where type == File    
    
  List all files with names that contain "Car"    
  > ls | where name =~ "Car"    
    
  List all files that were modified in the last two months    
  > ls | where modified <= 2M    
    
    
    
</details>    
    
<details><summary>which - Finds a program file.</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/which.md)    
    
Finds a program file.    
    
Usage:    
  > which <application> {flags}     
    
Parameters:    
  <application> application    
    
Flags:    
  -h, --help: Display this help message    
  -a, --all: list all executables    
    
    
    
</details>    
    
<details><summary>with-env - Runs a block with an environment set. Eg) with-env [NAME 'foo'] { echo $nu.env.NAME }</summary>    
    
    
    
Runs a block with an environment set. Eg) with-env [NAME 'foo'] { echo $nu.env.NAME }    
    
Usage:    
  > with-env <variable> <block> {flags}     
    
Parameters:    
  <variable> the environment variable to temporarily set    
  <block> the block to run once the variable is set    
    
Flags:    
  -h, --help: Display this help message    
    
Examples:    
  Set the MYENV environment variable    
  > with-env [MYENV "my env value"] { echo $nu.env.MYENV }    
    
    
    
</details>    
    
<details><summary>wrap - Wraps the given data in a table.</summary>    
    
[Detailed doc](https://github.com/nushell/nushell/blob/main/docs/commands/wrap.md)    
    
Wraps the given data in a table.    
    
Usage:    
  > wrap (column) {flags}     
    
Parameters:    
  (column) the name of the new column    
    
Flags:    
  -h, --help: Display this help message    
    
Examples:    
  Wrap a list into a table with the default column name    
  > echo [1 2 3] | wrap    
    
  Wrap a list into a table with a given column name    
  > echo [1 2 3] | wrap MyColumn    
    
    
    
</details>    
    
