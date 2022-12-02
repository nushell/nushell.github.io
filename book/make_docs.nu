let vers = (version).version

let book_exists = ('book' | path exists)
if $book_exists == false {
  print (error make {
    msg: "please run this script from the root of the website repo",
  })
  exit --now
}

# Clean all commands and regenerate the docs
do -i { rm book/commands/*.md }

let commands = ($nu.scope.commands | where is_custom == false && is_extern == false | sort-by category)
let cmds_group = ($commands | group-by name)

for command in $commands {
  let safe_name = ($command.name | str replace '\?' '' | str replace ' ' '_')
  let doc_path = (['.', 'book', 'commands', $'($safe_name).md'] | path join)

  # this is going in the frontmatter as a multiline YAML string, so indentation matters
  let indented_usage = ($cmds_group | get $command.name | get usage | each {|it| $"  ($it)"} | str join (char nl))
  let category_matter = ($cmds_group | get $command.name | get category | each { |cat|
    let usage = ($cmds_group | get $command.name | where category == $cat | get usage | str join (char nl))
    $'($cat | str snake-case): |
  ($usage)'
  } | str join (char nl))
  let category_list = "  " + ($cmds_group | get $command.name | get category | str join "\n  " )

  let top = $"---
title: ($command.name)
categories: |
($category_list)
version: ($vers)
($category_matter)
usage: |
($indented_usage)
---
"
  $top | save -f --raw $doc_path
}

$commands | each { |command|
  let safe_name = ($command.name | str replace '\?' '' | str replace ' ' '_')
  let doc = get-doc $command
  let doc_path = (['.', 'book', 'commands', $'($safe_name).md'] | path join)

  if ($doc_path | path exists) {
    $doc | save --raw --append $doc_path
  } else {
    $doc | save -f --raw $doc_path
  }
  $doc_path
} | length | $"($in) commands written"

def get-doc [command] {
  let top = $"
# <code>{{ $frontmatter.title }}</code> for ($command.category)

<div class='command-title'>{{ $frontmatter.($command.category | str snake-case) }}</div>

"
  let no_sig = ($command | get signatures | is-empty)
  let sig = if $no_sig { '' } else {
    let columns = ($command.signatures | columns)
    ($command.signatures | get $columns.0 | each { |param|

      if $param.parameter_type == "positional" {
        $"('(')($param.parameter_name)(')')"
      } else if $param.parameter_type == "switch" {
        $"--($param.parameter_name)"
      } else if $param.parameter_type == "named" {
        $"--($param.parameter_name)"
      } else if $param.parameter_type == "rest" {
        $"...($param.parameter_name)"
      }
    } | str join " ")
  }

  let signatures = $"## Signature(char nl)(char nl)```> ($command.name) ($sig)```(char nl)(char nl)"

  let params = if $no_sig { '' } else {
    let columns = ($command.signatures | columns)
    ($command.signatures | get $columns.0 | each { |param|
      if $param.parameter_type == "positional" {
        $" -  `($param.parameter_name)`: ($param.description)"
      } else if $param.parameter_type == "switch" {
        $" -  `--($param.parameter_name)`: ($param.description)"
      } else if $param.parameter_type == "named" {
        $" -  `--($param.parameter_name) {($param.syntax_shape)}`: ($param.description)"
      } else if $param.parameter_type == "rest" {
        $" -  `...($param.parameter_name)`: ($param.description)"
      }
    } | str join (char nl))
  }

  let parameters = if not $no_sig {
    $"## Parameters(char nl)(char nl)($params)(char nl)(char nl)"
  } else {
    ""
  }

  let extra_usage = if $command.extra_usage == "" { "" } else {
    # It's a little ugly to encode the extra usage in a code block,
    # but otherwise Vuepress's Markdown engine makes everything go haywire
    # (the `ansi` command is a good example).
    # TODO: find a better way to display plain text with minimal formatting
    $"## Notes
```text
($command.extra_usage)
```
"
  }

  let examples = if ($command.examples | length) > 0 {
    let example_top = $"## Examples(char nl)(char nl)"

    let $examples = ($command.examples | each { |example|
$"($example.description)
```shell
> ($example.example)
```

"
    } | str join)

    $example_top + $examples
  } else { "" }

  let doc = (
    ($top + $signatures + $parameters + $extra_usage + $examples ) |
    lines |
    each {|it| ($it | str trim -r) } |
    str join (char nl)
  )
  $doc
}
