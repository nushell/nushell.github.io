
let META_FILE = 'i18n-meta.json'
if ($META_FILE | path exists) == false {
    echo '[]' | save -r $META_FILE
}
let meta = open $META_FILE

# Update issue contents for https://github.com/nushell/nushell.github.io/issues/261
def update-i18n-status [] {

    print "The following table holds the overview of the Nushell docs’ writing and translation status. Welcome to participate in the translation of the docs. And please update the `i18n-meta.json` file after you have finished writing or translating the doc. Thanks"
    print $'(char nl)---(char nl)'

    ls -s book/*.md
        | where type == file && name != README.md
        | select name
        | upsert en {|it| get-cell $it.name en }
        | upsert de {|it| get-cell $it.name de }
        | upsert zh-cn {|it| get-cell $it.name zh-cn }
        | upsert ja {|it| get-cell $it.name ja }
        | upsert es {|it| get-cell $it.name es }
        | upsert pt-BR {|it| get-cell $it.name pt-BR }
        | to md --pretty

    print $'(char nl)Possible status values: `-`,`Completed`,`In Progress`,`Being translated by @ABC`(char nl)'
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
        if ($val | empty?) { $cellDefault } else { $val }
    }
}

# Generate or update meta data for docs' translation status
def gen-i18n-meta [] {
    ls -s book/*.md
        | where type == file && name != README.md
        | select name
        | upsert en {|it| get-cell $it.name en }
        | upsert de {|it| get-cell $it.name de }
        | upsert zh-cn {|it| get-cell $it.name zh-cn }
        | upsert ja {|it| get-cell $it.name ja }
        | upsert es {|it| get-cell $it.name es }
        | upsert pt-BR {|it| get-cell $it.name pt-BR }
        | to json -i 2
        | save -r i18n-meta.json
}

def main [
    task: string    # Avaliable task: `gen`, `update`
] {
    if $task == 'gen' {
        gen-i18n-meta
    } else if $task == 'update' {
        update-i18n-status
    }
}

