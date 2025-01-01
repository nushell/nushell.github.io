
def plugin-paths [ nu_path?: path ] {
    const PLUGINS = [
        nu_plugin_inc,
        nu_plugin_gstat,
        nu_plugin_query,
        nu_plugin_polars,
        nu_plugin_formats,
    ]

    # If no custom path is provided, default to the
    # directory of the currently running nu
    let nu_dir = match $nu_path {
        null => ($nu.current-exe | path dirname)
        _ => ($nu_path | path dirname)
    }

    $PLUGINS | each {|plugin|
        match (sys host | get name) {
            'Windows' => $'($nu_dir | path join $plugin).exe'
            _ => $'($nu_dir | path join $plugin)'
        }
    }
}

# get all command names from a clean scope
def command-names [] {
    let plugins = (plugin-paths)
    nu --no-config-file --plugins ($plugins | to nuon) --commands $'scope commands | select name | to json'
        | from json
}

def html-escape [] {
    to html | parse --regex '<body>(?<html>.*)</body>' | get html.0
}

# remove invalid characters from a path
#
# # Examples
# using the standard library
# ```nushell
# use std.nu
#
# std assert eq ("foo/bar baz/foooo" | safe-path) "foo/bar_baz/foooo"
# std assert eq ("invalid ? path" | safe-path) "invalid__path"
# ```
def safe-path [] {
  $in | str replace --all '\?' '' | str replace --all ' ' '_'
}

# optional helper to run make_docs in a new subshell with core plugins installed
#
# To use:
# `source make_docs`
# `make_docs` or `make_docs path_to_nu`
def make_docs [
    nu_path?: path     # Path to the Nushell executable to use
] {
    let $nu_path = ($nu_path | default $nu.current-exe)
    let plugins = (plugin-paths $nu_path)
    run-external $nu_path "--no-config-file" $"--plugins ($plugins | to nuon)" "make_docs.nu"
}

# generate the YAML frontmatter of a command
#
# # Examples
# - the `bits` command in `commands/docs/bits.md`
# ```yaml
# ---
# title: bits
# categories: |
#   bits
# version: 0.76.1
# bits: |
#   Various commands for working with bits.
# usage: |
#   Various commands for working with bits.
# editLink: false      # turns off the "Edit this page in GitHub for commands"
# contributors: false  # turns off the contributors list since it is not accurate for commands
# ---
# ```
# - the `dfr min` command in `commands/docs/dfr_min.md`
# ```yaml
# ---
# title: dfr min
# categories: |
#   expression
#   lazyframe
# version: 0.76.0
# expression: |
#   Creates a min expression
# lazyframe: |
#   Aggregates columns to their min value
# usage: |
#   Creates a min expression
#   Aggregates columns to their min value
# editLink: false
# contributors: false
# ---
# ```
def command-frontmatter [commands_group, command_name] {
    let commands_list = ($commands_group | get $command_name)

    let category_list = ($commands_list | get category | str join $"(char newline)  " )
    let nu_version = (version).version
    let category_matter = (
        $commands_list
        | get category
        | each { |category|
            let usage = ($commands_list | where category == $category | get description | str join (char newline))
            $'($category | str snake-case): |(char newline)  ($usage)'
        }
        | str join (char newline)
    )
    let indented_usage = (
        $commands_list
        | get description
        | each {|elt| $"  ($elt)"}
        | str join (char newline)
    )

    let feature = if $command_name =~ '^dfr' {
        "dataframe"
    } else {
        "default"
    }

  # This is going in the frontmatter as a multiline YAML string, so indentation matters
$"---
title: ($command_name)
categories: |
  ($category_list)
version: ($nu_version)
($category_matter)
usage: |
($indented_usage)
editLink: false
contributors: false
---"
}


# generate the whole command documentation
#
# TODO: be more detailed here
def command-doc [command] {
    let top = $"
# `($command.name)` for [($command.category)]\(/commands/categories/($command.category).md\)

<div class='command-title'>($command.description | html-escape)</div>

"

    let columns = ($command.signatures | columns)
    let no_sig = ($command | get signatures | is-empty)
    let sig = if $no_sig { '' } else {
        ($command.signatures | get $columns.0 | each { |param|
            if $param.parameter_type == "positional" {
                $"('(')($param.parameter_name)(')')"
            } else if $param.parameter_type == "rest" {
                $"...rest"
            }
        } | str join " ")
    }

    let signatures = $"## Signature

```> ($command.name) {flags} ($sig)```

"
    let flag_types = ['named', 'switch']
    let no_flags = if $no_sig { true } else {
        $command.signatures | get $columns.0 | where parameter_type in $flag_types | is-empty
    }

    let flags = if $no_flags { '' } else {
        ($command.signatures | get $columns.0 | each { |param|
            let start = $' -  `--($param.parameter_name)'
            let end = $'`: ($param.description)'
            let short_flag = (if ($param.short_flag | is-empty) {''} else {$', -($param.short_flag)'})
            if $param.parameter_type == 'switch' {
                $'($start)($short_flag)($end)'
            } else if $param.parameter_type == 'named' {
                $'($start)($short_flag) {($param.syntax_shape)}($end)'
	    }
        } | str join (char newline))
    }

    let flags = if $no_flags { "" } else {
$"## Flags

($flags)

"
    }

    let param_types = ['rest', 'positional']
    let no_param = if $no_sig { true } else {
        $command.signatures | get $columns.0 | where parameter_type in $param_types | is-empty
    }

    let params = if $no_param { '' } else {
        ($command.signatures | get $columns.0 | each { |param|
            if $param.parameter_type == "positional" {
                $" -  `($param.parameter_name)`: ($param.description)"
            } else if $param.parameter_type == "rest" {
                $" -  `...rest`: ($param.description)"
            }
        } | str join (char newline))
    }

    let parameters = if $no_param { "" } else {
$"## Parameters

($params)

"
    }

    let ex = $command.extra_description

    # Certain commands' extra_description is wrapped in code block markup to prevent their code from
    # being interpreted as markdown. This is strictly hard-coded for now.
    let extra_description = if $ex == "" {
        ""
    } else if $command.name in ['def-env' 'export def-env' 'as-date' 'as-datetime' ansi] {
$"## Notes
```text
($ex)
```
"
    } else {
$"## Notes
($ex)
"
    }

    let sigs = scope commands | where name == $command.name | select signatures | get 0 | get signatures | values
    mut input_output = []
    for s in $sigs {
        let input = $s | where parameter_type == 'input' | get 0 | get syntax_shape
        let output = $s | where parameter_type == 'output' | get 0 | get syntax_shape
        # FIXME: Parentheses are required here to mutate $input_output, otherwise it won't work, maybe a bug?
        $input_output = ($input_output | append [[input output]; [$input $output]])
    }
    let in_out = if ($input_output | length) > 0 {
        let markdown = ($input_output | sort-by input | to md --pretty | str replace -a '<' '\<' | str replace -a '>' '\>')
        ['', '## Input/output types:', '', $markdown, ''] | str join (char newline)
    } else { '' }

    let examples = if ($command.examples | length) > 0 {
        let example_top = $"## Examples(char newline)(char newline)"

        let $examples = (
            $command.examples
            | each { |example|
                let result = (do -i { $example.result | try { table --expand } catch { $in } } )
$"($example.description)
```nu
> ($example.example)
($result | if ($result | describe) == "string" { ansi strip } else { $in })
```

"
            } | str join
        )

        $example_top + $examples
    } else {
        ""
    }

    # Typically a root command that has sub commands should be one word command
    let one_word_cmd = ($command.name | split row ' ' | length) == 1
    let sub_commands = if $one_word_cmd { scope commands | where name =~ $'^($command.name) ' } else { [] }
    let sub_commands = if $one_word_cmd and ($sub_commands | length) > 0 {
        let commands = $sub_commands
            | select name description type
            | update name {|row| $"[`($row.name)`]\(/commands/docs/($row.name | safe-path).md\)" }
            | upsert description {|row| $row.description | str replace -a '<' '\<' | str replace -a '>' '\>' }
            | to md --pretty
        ['', '## Subcommands:', '', $commands, ''] | str join (char newline)
    } else { '' }

    let plugin_commands = (plugin list | flatten)
    let plugin_warning = if ($command.name in $plugin_commands.commands) {
        let plugin = ($plugin_commands | where commands == $command.name | first)
        [ $"::: warning This command requires a plugin"
          $"The `($command.name)` command resides in the `($plugin.name)` plugin."
          $"To use this command, you must install and register `($plugin.filename | path basename)`."
          "See the [Plugins]\(/book/plugins.html) chapter in the book for more information."
          ":::"
          ""
          ""
        ] | to text
    } else {
        ''
    }

    let doc = (
        ($top + $plugin_warning + $signatures + $flags + $parameters + $in_out + $examples + $extra_description + $sub_commands)
        | lines
        | each {|line| ($line | str trim -r) }
        | str join (char newline)
    )

    $doc
}


# generate the full documentation page of a given command
#
# this command will
# 1. compute the frontmatter of the command, i.e. the YAML header
# 2. compute the actual content of the documentation
# 3. concatenate them
# 4. save that to `commands/docs/<command>.md`
#
# # Examples
# - the `bits` command at https://nushell.sh/commands/docs/bits.html
# - the `bits and` subcommand at https://nushell.sh/commands/docs/bits_and.html
def generate-command [commands_group command_name] {
    let safe_name = ($command_name | safe-path)
    let doc_path = (['.', 'commands', 'docs', $'($safe_name).md'] | path join)

    let frontmatter = (command-frontmatter $commands_group $command_name)
    let note = "<!-- This file is automatically generated. Please edit the command in https://github.com/nushell/nushell instead. -->"
    let doc = (
        $commands_group
        | get $command_name
        | each { |command| command-doc $command }
        | str join
    )

    [$frontmatter $note $doc] | str join "\n" | save --raw --force $doc_path
    $doc_path
}


# generate the list of all categories in a TS file used by `vuepress`
#
# this will modify `.vuepress/configs/sidebar/command_categories.ts`
#
# # Example
# the sidebar file has following format
# ```typescript
# export const commandCategories = [
#   '/commands/categories/<categ_1>.md',
#   '/commands/categories/<categ_2>.md',
#   ...
# ];
# ```
# and contains all the categories given by `scope commands | get category | uniq`
#
# this file is responsible for the sidebar containing the categories that one can see in
#
#    https://nushell.sh/commands/
def generate-category-sidebar [unique_categories] {
    let sidebar_path = (['.', '.vuepress', 'configs', "sidebar", "command_categories.ts"] | path join)
    let list_content = (
      $unique_categories
        | each { || safe-path }
        | each { |category| $"  '/commands/categories/($category).md',"}
        | str join (char newline)
    )

$"export const commandCategories = [
($list_content)
];"
    | save --raw --force $sidebar_path
}


# generate one category file in `commands/categories/`
#
# # Example
# for the `bits` category, that might look, once rendered, like
#
#    https://nushell.sh/commands/categories/bits.html
def generate-category [category] {
    let safe_name = ($category | safe-path)
    let doc_path = (['.', 'commands', 'categories', $'($safe_name).md'] | path join)

$"---
editLink: false
contributors: false
---

# ($category | str title-case)

<script>
  import pages from '@temp/pages'
  export default {
    computed: {
      commands\(\) {
        return pages
          .filter\(p => p.path.includes\('/commands/docs/'\)\)
          .filter\(p => p.frontmatter.categories.includes\('($category)'\)\)
          .sort\(\(a,b\) => \(a.title > b.title\) ? 1 : \(\(b.title > a.title\) ? -1 : 0\)\);
      }
    }
  }
</script>

<table>
  <tr>
    <th>Command</th>
    <th>Description</th>
  </tr>
  <tr v-for=\"command in commands\">
   <td><a :href=\"$withBase\(command.path\)\">{{ command.title }}</a></td>
   <td style=\"white-space: pre-wrap;\">{{ command.frontmatter.usage }}</td>
  </tr>
</table>
"
    | save --raw --force $doc_path

    $doc_path
}


def main [] {
    # Old commands are currently not deleted because some of them
    # are platform-specific (currently `exec`, `registry query`), and a single run of this script will not regenerate
    # all of them.
    #do -i { rm commands/docs/*.md }

    let commands = (
        scope commands
        | join (command-names) name
        | sort-by category
    )
    let commands_group = ($commands | group-by name)
    let unique_commands = ($commands_group | columns)
    let unique_categories = ($commands | get category | uniq)

    let number_generated_commands = (
        $unique_commands
        | par-each { |command_name|
            generate-command $commands_group $command_name
        }
        | length
    )
    print $"($number_generated_commands) commands written"

    generate-category-sidebar $unique_categories

    let number_generated_categories = (
        $unique_categories
        | each { |category|
            generate-category $category
        }
        | length
    )
    print $"($number_generated_categories) categories written"
}
