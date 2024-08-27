# The script is for updating the table with `polars` commands on the 'dataframes.md` page.

# 1. Gets a table with the current list of `polars` commands.
# 2. Joins the table with the currently specified values in the `Nushell Equivalent` column of the markdown table in `dataframes.md`.

let path = '../book/dataframes.md'
let chapter = open $path
let book_table_str = $chapter
    | lines
    | skip until {|line| $line starts-with '| Command Name '}
    | take until {|line| $line starts-with '## Future'}

let book_table = $book_table_str
    | parse '| {command_name} | {applies_to} | {description} | {nushell_equivalent} |'
    | skip 2 # skip header and delimiter lines
    | str trim command_name nushell_equivalent
    | rename name
    | select name nushell_equivalent

let updated_table = help commands
    | where name =~ 'polars'
    | where name != 'polars'
    | update input_output {|i| $i.input_output.input | str join ', '}
    | select name input_output usage
    | join --left $book_table name
    | rename "Command Name" "Applies To" Description "Nushell Equivalent"
    | to md --pretty
    | str replace -ar "(( |-){47} \\|\n)" " \|\n"
    | $'($in)(char nl)'

$chapter 
| str replace ($book_table_str | str join (char nl)) $updated_table 
| save -f $path
