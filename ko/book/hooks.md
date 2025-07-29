# 후크

후크를 사용하면 미리 정의된 일부 상황에서 코드 조각을 실행할 수 있습니다.
대화형 모드([REPL](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop))에서만 사용할 수 있으며 스크립트(`nu script.nu`) 또는 명령(`nu -c "print foo"`) 인수로 누셸을 실행하면 작동하지 않습니다.

현재 다음 유형의 후크를 지원합니다.

- `pre_prompt`: 프롬프트가 그려지기 전에 트리거됨
- `pre_execution`: 줄 입력이 실행되기 전에 트리거됨
- `env_change`: 환경 변수가 변경될 때 트리거됨
- `display_output`: 출력이 전달되는 블록
- `command_not_found`: 명령을 찾을 수 없을 때 트리거됨

더 명확하게 하기 위해 누셸의 실행 주기를 분석할 수 있습니다.
REPL 모드에서 한 줄을 평가하는 단계는 다음과 같습니다.

1. `pre_prompt` 후크를 확인하고 실행합니다.
1. `env_change` 후크를 확인하고 실행합니다.
1. 프롬프트를 표시하고 사용자 입력을 기다립니다.
1. 사용자가 무언가를 입력하고 "Enter"를 누른 후: `pre_execution` 후크를 확인하고 실행합니다.
1. 사용자 입력을 구문 분석하고 평가합니다.
1. 명령을 찾을 수 없는 경우: `command_not_found` 후크를 실행합니다. 문자열을 반환하면 표시합니다.
1. `display_output`이 정의된 경우 이를 사용하여 명령 출력을 인쇄합니다.
1. 1로 돌아갑니다.

## 기본 후크

후크를 활성화하려면 [구성](configuration.md)에서 정의하십시오.

```nu
$env.config.hooks = {
    pre_prompt: [{ print "pre prompt hook" }]
    pre_execution: [{ print "pre exec hook" }]
    env_change: {
        PWD: [{|before, after| print $"changing directory from ($before) to ($after)" }]
    }
}
```

위 내용을 구성에 넣고 누셸을 실행하고 파일 시스템을 이동해 보십시오.
디렉터리를 변경하면 `PWD` 환경 변수가 변경되고 변경 사항이 각각 `before` 및 `after` 변수에 저장된 이전 값과 현재 값으로 후크를 트리거합니다.

트리거당 단일 후크를 정의하는 대신 순서대로 실행될 **후크 목록**을 정의할 수 있습니다.

```nu
$env.config.hooks = {
    pre_prompt: [
        { print "pre prompt hook" }
        { print "pre prompt hook2" }
    ]
    pre_execution: [
        { print "pre exec hook" }
        { print "pre exec hook2" }
    ]
    env_change: {
        PWD: [
            {|before, after| print $"changing directory from ($before) to ($after)" }
            {|before, after| print $"changing directory from ($before) to ($after) 2" }
        ]
    }
}
```

모든 후크를 바꾸는 대신 기존 구성에 새 후크를 추가할 수 있습니다.

```nu
$env.config.hooks.pre_execution = $env.config.hooks.pre_execution | append { print "pre exec hook3" }
```

## 환경 변경

후크의 한 가지 특징은 환경을 보존한다는 것입니다.
후크 **블록** 내에 정의된 환경 변수는 [`def --env`](environment.md#defining-environment-from-custom-commands)와 유사한 방식으로 보존됩니다.
다음 예제로 테스트할 수 있습니다.

```nu
$env.config = ($env.config | upsert hooks {
    pre_prompt: { $env.SPAM = "eggs" }
})

$env.SPAM
# => eggs
```

후크 블록은 그렇지 않으면 일반적인 범위 지정 규칙을 따릅니다. 즉, 블록 내에 정의된 명령, 별칭 등은 블록이 끝나면 버려집니다.

## `pre_execution` 후크

`pre_execution` 후크는 [`commandline` 명령](/commands/docs/commandline.md)을 통해 실행될 명령을 검사할 수 있습니다.

예를 들어, 실행 중인 명령을 인쇄하려면:

```nu
$env.config = (
    $env.config
    | upsert hooks.pre_execution [ {||
        $env.repl_commandline = (commandline)
        print $"Command: ($env.repl_commandline)"
    } ]
)

print (1 + 3)
# => Command: print (1 + 3)
# => 4
```

## 조건부 후크

하고 싶은 유혹을 받을 수 있는 한 가지는 디렉터리에 들어갈 때마다 환경을 활성화하는 것입니다.

```nu
$env.config = ($env.config | upsert hooks {
    env_change: {
        PWD: [
            {|before, after|
                if $after == /some/path/to/directory {
                    load-env { SPAM: eggs }
                }
            }
        ]
    }
})
```

환경이 [`if`](/commands/docs/if.md) 블록 내에서만 활성화되기 때문에 이것은 작동하지 않습니다.
이 경우 `load-env (if $after == ... { ... } else { {} })`로 쉽게 다시 작성할 수 있지만 이 패턴은 상당히 일반적이며 나중에 모든 경우가 이와 같이 다시 작성될 수 없다는 것을 알게 될 것입니다.

위 문제를 해결하기 위해 후크를 정의하는 또 다른 방법인 **레코드**를 소개합니다.

```nu
$env.config = ($env.config | upsert hooks {
    env_change: {
        PWD: [
            {
                condition: {|before, after| $after == /some/path/to/directory }
                code: {|before, after| load-env { SPAM: eggs } }
            }
        ]
    }
})
```

후크가 트리거되면 `condition` 블록을 평가합니다.
`true`를 반환하면 `code` 블록이 평가됩니다.
`false`를 반환하면 아무 일도 일어나지 않습니다.
다른 것을 반환하면 오류가 발생합니다.
`condition` 필드는 후크가 항상 평가되도록 완전히 생략할 수도 있습니다.

`pre_prompt` 및 `pre_execution` 후크 유형도 조건부 후크를 지원하지만 `before` 및 `after` 매개변수는 허용하지 않습니다.

## 문자열로서의 후크

지금까지 후크는 환경만 보존하고 다른 것은 보존하지 않는 블록으로 정의되었습니다.
명령이나 별칭을 정의할 수 있도록 `code` 필드를 **문자열**로 정의할 수 있습니다.
REPL에 문자열을 입력하고 Enter 키를 누른 것처럼 생각할 수 있습니다.
따라서 이전 섹션의 후크는 다음과 같이 작성할 수도 있습니다.

```nu
$env.config = ($env.config | upsert hooks {
    pre_prompt: '$env.SPAM = "eggs"'
})

$env.SPAM
# => eggs
```

이 기능은 예를 들어 현재 디렉터리를 기반으로 정의를 조건부로 가져오는 데 사용할 수 있습니다.

```nu
$env.config = ($env.config | upsert hooks {
    env_change: {
        PWD: [
            {
                condition: {|_, after| $after == /some/path/to/directory }
                code: 'def foo [] { print "foo" }'
            }
            {
                condition: {|before, _| $before == /some/path/to/directory }
                code: 'hide foo'
            }
        ]
    }
})
```

후크를 문자열로 정의할 때 `$before` 및 `$after` 변수는 이전 예제와 유사하게 각각 이전 및 현재 환경 변수 값으로 설정됩니다.

```nu
$env.config = ($env.config | upsert hooks {
    env_change: {
        PWD: {
            code: 'print $"changing directory from ($before) to ($after)"'
        }
    }
}
```

## 예제

### 기존 구성에 단일 후크 추가

PWD 환경 변경 후크에 대한 예:

```nu
$env.config = ($env.config | upsert hooks.env_change.PWD {|config|
    let val = ($config | get -o hooks.env_change.PWD)

    if $val == null {
        $val | append {|before, after| print $"changing directory from ($before) to ($after)" }
    } else {
        [
            {|before, after| print $"changing directory from ($before) to ($after)" }
        ]
    }
})
```

### 디렉터리 진입 시 환경 자동 활성화

이것은 디렉터리에서 `test-env.nu`를 찾습니다.

```nu
$env.config = ($env.config | upsert hooks.env_change.PWD {
    [
        {
            condition: {|_, after|
                ($after == '/path/to/target/dir'
                    and ($after | path join test-env.nu | path exists))
            }
            code: "overlay use test-env.nu"
        }
        {
            condition: {|before, after|
                ('/path/to/target/dir' not-in $after
                    and '/path/to/target/dir' in ($before | default "")
                    and 'test-env' in (overlay list))
            }
            code: "overlay hide test-env --keep-env [ PWD ]"
        }
    ]
})
```

### 명령 출력 필터링 또는 전환

`display_output` 후크를 사용하여 명령 출력을 리디렉션할 수 있습니다.
모든 값 유형에서 작동하는 블록을 정의해야 합니다.
외부 명령의 출력은 `display_output`을 통해 필터링되지 않습니다.

이 후크는 출력을 별도의 창에 표시할 수 있으며,
아마도 풍부한 HTML 텍스트로 표시될 수 있습니다. 다음은 그렇게 하는 방법에 대한 기본 아이디어입니다.

```nu
$env.config = ($env.config | upsert hooks {
    display_output: { to html --partial --no-color | save --raw /tmp/nu-output.html }
})
```

웹 브라우저에서 `file:///tmp/nu-output.html`을 열어 결과를 볼 수 있습니다.
물론 파일이 변경될 때 자동으로 다시 로드되는 브라우저를 사용하지 않는 한 이것은 그다지 편리하지 않습니다.
[`save`](/commands/docs/save.md) 명령 대신 일반적으로 HTML 출력을 원하는 창으로 보내도록 사용자 지정합니다.

### 출력 표시 방법 변경

`display_output` 후크를 사용하여 출력이 표시되는 기본 동작을 변경할 수 있습니다.
다음은 터미널이 충분히 넓으면 테이블을 1계층 깊이로 표시하고 그렇지 않으면 축소하는 기본 표시 동작을 변경하는 예입니다.

```nu
$env.config = ($env.config | upsert hooks {
    display_output: {if (term size).columns >= 100 { table -ed 1 } else { table }}
})
```

### _Arch Linux_의 `command_not_found` 후크

다음 후크는 `pkgfile` 명령을 사용하여 _Arch Linux_에서 명령이 속한 패키지를 찾습니다.

```nu
$env.config = {
    ...other config...

    hooks: {
        ...other hooks...

        command_not_found: {
            |cmd_name| (
                try {
                    let pkgs = (pkgfile --binaries --verbose $cmd_name)
                    if ($pkgs | is-empty) {
                        return null
                    }
                    (
                        $"(ansi $env.config.color_config.shape_external)($cmd_name)(ansi reset) " +
                        $"may be found in the following packages:\n($pkgs)"
                    )
                }
            )
        }
    }
}
```

### _NixOS_의 `command_not_found` 후크

NixOS에는 `command-not-found` 명령이 함께 제공됩니다. 우리는 그것을 누셸 후크에 연결하기만 하면 됩니다.

```nu
$env.config.hooks.command_not_found = {
  |command_name|
  print (command-not-found $command_name | str trim)
}
```

### _Windows_의 `command_not_found` 후크

다음 후크는 `ftype` 명령을 사용하여 `alias`에 대해 사용자에게 관련이 있을 수 있는 _Windows_의 프로그램 경로를 찾습니다.

```nu
$env.config = {
    ...other config...

    hooks: {
        ...other hooks...

        command_not_found: {
            |cmd_name| (
                try {
                    let attrs = (
                        ftype | find $cmd_name | to text | lines | reduce -f [] { |line, acc|
                            $line | parse "{type}={path}" | append $acc
                        } | group-by path | transpose key value | each { |row|
                            { path: $row.key, types: ($row.value | get type | str join ", ") }
                        }
                    )
                    let len = ($attrs | length)

                    if $len == 0 {
                        return null
                    } else {
                        return ($attrs | table --collapse)
                    }
                }
            )
        }
    }
}
```
