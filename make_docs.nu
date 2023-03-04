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

    [$frontmatter $doc] | str join | save --raw --force $doc_path
    $doc_path
}


def command-frontmatter [commands_group, command_name] {
  let commands_list = ($commands_group | get $command_name)

  let category_list = "  " + ($commands_list | get category | str join $"(char newline)  " )
  let nu_version = (version).version
  let category_matter = ($commands_list | get category | each { |category|
    let usage = ($commands_list | where category == $category | get usage | str join (char newline))
    $'($category | str snake-case): |(char newline)  ($usage)'
  } | str join (char newline))
  let indented_usage = ($commands_list | get usage | each {|it| $"  ($it)"} | str join (char newline))

  # This is going in the frontmatter as a multiline YAML string, so indentation matters
  $"---
title: ($command_name)
categories: |
($category_list)
version: ($nu_version)
($category_matter)
usage: |
($indented_usage)
---
"
}


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

  let signatures = $"## Signature(char newline)(char newline)```> ($command.name) ($sig)```(char newline)(char newline)"

  let params = if $no_param {
    ''
    } else {
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

  let parameters = if $no_param { "" } else { $"## Parameters(char newline)(char newline)($params)(char newline)(char newline)" }

  let ex = $command.extra_usage
  # Certain commands' extra_usage is wrapped in code block markup to prevent their code from
  # being interpreted as markdown. This is strictly hard-coded for now.
  let extra_usage = if $ex == "" {
    ""
  } else if $command.name in ['def-env' 'export def-env' 'as-date' 'as-datetime' ansi] {
    $"## Notes(char newline)```text(char newline)($ex)(char newline)```(char newline)"
  } else {
    $"## Notes(char newline)($ex)(char newline)"
  }

  let examples = if ($command.examples | length) > 0 {
    let example_top = $"## Examples(char newline)(char newline)"

    let $examples = ($command.examples | each { |example|
$"($example.description)
```shell
> ($example.example)
```

"
    } | str join)

    $example_top + $examples
  } else {
    ""
  }

  let doc = (
    ($top + $signatures + $parameters + $extra_usage + $examples ) |
    lines |
    each {|it| ($it | str trim -r) } |
    str join (char newline)
  )
  $doc
}

def generate-category-sidebar [unique_categories] {
  let sidebar_path = (['.', '.vuepress', 'configs', "sidebar", "command_categories.ts"] | path join)
  let list_content = (
    $unique_categories
      | each { safe-path }
      | each { |category| $"  '/commands/categories/($category).md',"}
      | str join (char newline)
  )
  $"export const commandCategories = [
($list_content)
];
" | save --raw --force $sidebar_path
}


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
" | save --raw --force $doc_path
  $doc_path
}

def safe-path [] {
  $in | str replace --all '\?' '' | str replace --all ' ' '_'
}


def main [] {
    # Old commands are currently not deleted because some of them
    # are platform-specific (currently `exec`, `registry query`), and a single run of this script will not regenerate
    # all of them.
    #do -i { rm commands/docs/*.md }

    let commands = (
        $nu.scope.commands
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
