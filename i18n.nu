
let meta = open 'i18n-meta.json'

def update-i18n-status [] {

    print 'This table holds the overview of the nushell docs writing and translation status. Welcome to participate in the translation of the docs. Please notify me after you finish some translation. Thanks'
    print ''
    print '---'
    print ''

    ls -s book
        | where type == file && name != README.md
        | select name
        | update en {|it| get-cell $it.name en } | default en 'In progress'
        | update de {|it| get-cell $it.name de } | default de '-'
        | update zh-cn {|it| get-cell $it.name zh-cn } | default zh-cn '-'
        | update ja {|it| get-cell $it.name ja } | default ja '-'
        | update es {|it| get-cell $it.name es } | default es '-'
        | update pt-BR {|it| get-cell $it.name pt-BR } | default pt-BR '-'
        | to md --pretty

    print ''
    print 'Possible status values: `-`,`Completed`,`In Progress`,`Being translated by @ABC`'
}

def get-cell [
    name: string
    lng: string
] {
    ($meta | where name == $name | get $lng | get 0)
}

def gen-i18n-meta [] {
    ls -s book
        | where type == file && name != README.md
        | select name
        | update en 'In progress'
        | update de '-'
        | update  zh-cn '-'
        | update ja '-'
        | update es '-'
        | update pt-BR '-'
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

