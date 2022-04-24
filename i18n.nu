
let META_FILE = 'i18n-meta.json'
if ($META_FILE | path exists) == false {
    echo '[]' | save -r $META_FILE
}
let meta = open $META_FILE

# Check if a git repo has the specified ref: could be a branch or tag, etc.
def 'has-ref' [
  ref: string   # The git ref to check
] {
  let parse = (git rev-parse --verify -q $ref)
  if ($parse | empty?) { false } else { true }
}

# Update issue contents for https://github.com/nushell/nushell.github.io/issues/261
def update-i18n-status [] {

    print "The following table holds the overview of the Nushell docs’ writing and translation status. Welcome to participate in the translation of the docs. And please update the `i18n-meta.json` file after you have finished writing or translating the doc. Thanks"
    print $'(char nl)---(char nl)'

    ls -s book/*.md
        | where type == file
        | select name
        | upsert en {|it| get-cell $it.name en }
        | upsert zh-CN {|it| get-cell $it.name zh-CN }
        | upsert de {|it| get-cell $it.name de }
        | upsert tr {|it| get-cell $it.name tr }
        | upsert ja {|it| get-cell $it.name ja }
        | upsert es {|it| get-cell $it.name es }
        | upsert pt-BR {|it| get-cell $it.name pt-BR }
        | to md --pretty

    print $'(char nl)Possible status values: `-`,`Completed`,`In Progress`,`Being translated by @ABC`, `commit_id@author` or simply a COMMIT ID indicate your translation end to.(char nl)'
}

def get-cell [
    name: string
    lng: string
] {
    let match = ($meta | where name == $name)
    let cellDefault = if ($lng == 'en') { 'In progress' } else { '-' }
    # For newly added docs
    if ($match | length) == 0 {
        $cellDefault

    } else {    # For existing docs
        let val = ($match | get $lng | get 0)
        if ($val | empty?) {
            $cellDefault
        # Handle data like: "c13a71d11@hustcer"
        } else if ($val | str contains '@') {
            let commit = ($val | split row '@')
            let id = ($commit | get 0)
            if ($commit | length) > 1 && (has-ref $id) {
                $'Translate to ($id) by @($commit | get 1)'
            } else {
                $val
            }
        } else if (has-ref $val) {
            $'Translate to ($val)'
        } else {
            $val
        }
    }
}

# Generate or update meta data for docs' translation status
def gen-i18n-meta [] {
    ls -s book/*.md
        | where type == file
        | select name
        | upsert en {|it| get-cell $it.name en }
        | upsert zh-CN {|it| get-cell $it.name zh-CN }
        | upsert de {|it| get-cell $it.name de }
        | upsert tr {|it| get-cell $it.name tr }
        | upsert ja {|it| get-cell $it.name ja }
        | upsert es {|it| get-cell $it.name es }
        | upsert pt-BR {|it| get-cell $it.name pt-BR }
        | to json -i 2
        | save -r $META_FILE
}

def has-change [
    name: string,       # The doc file name to check
    commit: string,     # The ending commit id
] {
    let diff = (git diff $commit $'book/($name)' | str trim)
    if ($diff | empty?) { $'(ansi g)No(ansi reset)' } else { $'(ansi r)Yes(ansi reset)' }
}

def check-outdated-translation [
    lng: string     # The locale to check outdated
] {
    let columns = { 'zh-cn': 'zh-CN', 'pt-br': 'pt-BR' }
    let locale = if ($lng in $columns) { $columns | get $lng } else { $lng }
    open $META_FILE | select name $locale | insert outdated { |it|
        let val = ($it | get $locale)
        if ($val | empty?) || $val == '-' {
            '-'
        # Handle data like: "c13a71d11@hustcer"
        } else if ($val | str contains '@') {
            let commit = ($val | split row '@')
            let id = ($commit | get 0)
            if ($commit | length) > 1 && (has-ref $id) {
                has-change $it.name $id
            } else {
                'N/A'
            }
        } else if (has-ref $val) {
            has-change $it.name $val
        } else {
            'N/A'
        }
    } | sort-by outdated name
}

# Use `nu ./i18n.nu outdated zh-CN` to check outdated translations for zh-CN
# Some helper commands for i18n related tasks
def main [
    task: string    # Avaliable task: `gen`, `update`, `outdated`
    lng?: string    # The locale to check outdated: zh-CN, de, etc.
] {
    let locales = ['zh-cn', 'de', 'tr', 'ja', 'es', 'pt-br']

    if $task == 'gen' {
        gen-i18n-meta
    } else if $task == 'update' {
        update-i18n-status
    } else if $task == 'outdated' {
        if ($lng | empty?) {
            $'(ansi r)A locale code required, available locales: ($locales), Please try again!(ansi reset)(char nl)'
            exit --now
        }
        let available = ($lng | str downcase) in $locales
        if (not $available) {
            $'(ansi r)Unsupported locale, available locales: ($locales), Please try again!(ansi reset)(char nl)'
            exit --now
        }
        check-outdated-translation $lng
    }
}

