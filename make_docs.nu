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

# NOTE: You should have nushell source code directory sit along with the docs' directory to make it work
# Get commands in `extra` crate by parsing the source code
def get-extra-cmds [] {
    if ('../nushell/crates/nu-cmd-extra/src' | path exists) {
        cd ..
        glob nushell/crates/nu-cmd-extra/src/**/*.rs
            | each { $in | open -r | parse -r 'fn name\(&self\) -> &str \{[\r|\n]\s+\"(?P<name>.+)\"[\r|\n]\s+\}' }
            | flatten
            | get name
    } else {
        []
    }
}

let extra_cmds = get-extra-cmds

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
            let usage = ($commands_list | where category == $category | get usage | str join (char newline))
            $'($category | str snake-case): |(char newline)  ($usage)'
        }
        | str join (char newline)
    )
    let indented_usage = (
        $commands_list
        | get usage
        | each {|it| $"  ($it)"}
        | str join (char newline)
    )

  # This is going in the frontmatter as a multiline YAML string, so indentation matters
$"---
title: ($command_name)
categories: |
  ($category_list)
version: ($nu_version)
($category_matter)
usage: |
($indented_usage)
---"
}


# generate the whole command documentation
#
# TODO: be more detailed here
def command-doc [command] {
    let top = $"
# <code>{{ $frontmatter.title }}</code> for ($command.category)

<div class='command-title'>{{ $frontmatter.($command.category | str snake-case) }}</div>

"

    let param_type = ['switch', 'named', 'rest', 'positional']
    let columns = ($command.signatures | columns)
    let no_sig = ($command | get signatures | is-empty)
    let no_param = if $no_sig { true } else {
        $command.signatures | get $columns.0 | where parameter_type in $param_type | is-empty
    }
    let sig = if $no_sig { '' } else {
        ($command.signatures | get $columns.0 | each { |param|
            if $param.parameter_type == "positional" {
                $"('(')($param.parameter_name)(')')"
            } else if $param.parameter_type == "switch" {
                $"--($param.parameter_name)"
            } else if $param.parameter_type == "named" {
                $"--($param.parameter_name)"
            } else if $param.parameter_type == "rest" {
                $"...rest"
            }
        } | str join " ")
    }

  let signatures = $"## Signature

```> ($command.name) ($sig)```

"

    let params = if $no_param { '' } else {
        ($command.signatures | get $columns.0 | each { |param|
            if $param.parameter_type == "positional" {
                $" -  `($param.parameter_name)`: ($param.description)"
            } else if $param.parameter_type == "switch" {
                $" -  `--($param.parameter_name)` `\(-($param.short_flag)\)`: ($param.description)"
            } else if $param.parameter_type == "named" {
                $" -  `--($param.parameter_name) {($param.syntax_shape)}`: ($param.description)"
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

    let ex = $command.extra_usage

    # Certain commands' extra_usage is wrapped in code block markup to prevent their code from
    # being interpreted as markdown. This is strictly hard-coded for now.
    let extra_usage = if $ex == "" {
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
```shell
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
    let type_mapping = {is_builtin: 'Builtin', is_plugin: 'Plugin', is_custom: 'Custom'}
    let sub_commands = if $one_word_cmd and ($sub_commands | length) > 0 {
        let commands = $sub_commands
            | select name usage is_builtin is_plugin is_custom
            | upsert type {|it| $type_mapping | columns | each {|t| if ($it | get $t) { $type_mapping | get $t } } | str join ',' }
            | update name { $"[`($in)`]\(/commands/docs/($in | safe-path).md\)" }
            | select name type usage
            | to md --pretty
        ['', '## Subcommands:', '', $commands, ''] | str join (char newline)
    } else { '' }

    let tips = if $command.name =~ '^dfr' {
        $'(char nl)**Tips:** Dataframe commands were not shipped in the official binaries by default, you have to build it with `--features=dataframe` flag(char nl)'
    } else if $command.name in $extra_cmds {
        $'(char nl)**Tips:** Command `($command.name)` was not included in the official binaries by default, you have to build it with `--features=extra` flag(char nl)'
    } else { '' }

    let doc = (
        ($top + $signatures + $parameters + $in_out + $examples + $extra_usage + $sub_commands + $tips)
        | lines
        | each {|it| ($it | str trim -r) }
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
    let doc = (
        $commands_group
        | get $command_name
        | each { |command| command-doc $command }
        | str join
    )

    [$frontmatter $doc] | str join "\n" | save --raw --force $doc_path
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
# and contains all the categories given by `$nu.scope.commands.category | uniq`
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

$"# ($category | str title-case)

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
   <td><a :href="command.path">{{ command.title }}</a></td>
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
        | where is_custom == false and is_extern == false
        | sort-by category
    )
    let commands_group = ($commands | group-by name)
    let unique_commands = ($commands_group | columns)
    let unique_categories = ($commands | get category | uniq)

    let number_generated_commands = (
        $unique_commands
        | each { |command_name|
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
