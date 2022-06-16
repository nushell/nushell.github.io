let vers = (version).version

let book_exists = ('book' | path exists)
if $book_exists == false {
    print (error make {
        msg: "please run this script from the root of the website repo",
    })
    exit --now
}

for command in ($nu.scope.commands | where is_custom == false && is_extern == false | sort-by category) {
    # this is going in the frontmatter as a multiline YAML string, so indentation matters
    let indented_usage = ($command.usage | lines | each {|it| $"  ($it)"} | str collect (char nl))

    let top = $"---
title: ($command.command)
version: ($vers)
usage: |
($indented_usage)
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter\() { return usePageFrontmatter\().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

"
    let sig = ($command.signature | each { |param|
        if $param.parameter_type == "positional" {
            $"('(')($param.parameter_name)(')')"
        } else if $param.parameter_type == "switch" {
            $"--($param.parameter_name)"
        } else if $param.parameter_type == "named" {
            $"--($param.parameter_name)"
        } else if $param.parameter_type == "rest" {
            $"...($param.parameter_name)"
        }
    } | str collect " ")

    let signature = $"## Signature(char nl)(char nl)```> ($command.command) ($sig)```(char nl)(char nl)"

    let params = ($command.signature | each { |param|
        if $param.parameter_type == "positional" {
            $" -  `($param.parameter_name)`: ($param.description)"
        } else if $param.parameter_type == "switch" {
            $" -  `--($param.parameter_name)`: ($param.description)"
        } else if $param.parameter_type == "named" {
            $" -  `--($param.parameter_name) {($param.syntax_shape)}`: ($param.description)"
        } else if $param.parameter_type == "rest" {
            $" -  `...($param.parameter_name)`: ($param.description)"
        }
    } | str collect (char nl))

    let parameters = if ($command.signature | length) > 0 {
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
        } | str collect)

        $example_top + $examples
    } else { "" }

    let doc = (
            ($top + $signature + $parameters + $extra_usage + $examples ) |
            lines |
            each {|it| ($it | str trim -r) } |
            str collect (char nl)
        )

    let safe_name = ($command.command | str replace '\?' '' | str replace ' ' '_')
    let safe_name = if ($command.category =~ 'frame') { $'_($safe_name)' } else { $safe_name }
    $doc | save --raw $"./book/commands/($safe_name).md"
    $"./book/commands/($safe_name).md"
} | length | $"($in) commands written"
