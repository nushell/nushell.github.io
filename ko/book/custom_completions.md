# 사용자 지정 완성

사용자 지정 완성을 사용하면 누셸의 두 가지 기능인 사용자 지정 명령과 완성을 함께 사용할 수 있습니다. 이를 통해 위치 매개변수 및 플래그 매개변수에 대한 완성을 처리하는 명령을 만들 수 있습니다. 이러한 사용자 지정 완성은 [사용자 지정 명령](custom_commands.md)과 [알려진 외부 또는 `extern` 명령](externs.md) 모두에 대해 작동합니다.

완성은 두 단계로 정의됩니다.

- 제안할 수 있는 값을 반환하는 완성 명령(일명 완성기) 정의
- `<shape>@<completer>`를 사용하여 다른 명령 인수의 형식 주석(모양)에 완성기를 연결합니다.

다음은 간단한 예입니다.

```nu
# 완성 명령
def animals [] { ["cat", "dog", "eel" ] }
# 완성될 명령
def my-command [animal: string@animals] { print $animal }
my-command
# => cat                 dog                 eel
```

첫 번째 줄은 세 가지 다른 동물의 목록을 반환하는 사용자 지정 명령을 정의합니다. 이것이 완성을 위한 가능한 값입니다.

::: tip
인수에 대한 완성을 억제하려면(예: 모든 정수를 허용할 수 있는 `int`) 빈 목록(`[ ]`)을 반환하는 완성기를 정의하십시오.
:::

두 번째 줄에서 `string@animals`는 누셸에게 두 가지를 알려줍니다. 형식 검사를 위한 인수의 모양과 인수에 대한 가능한 값을 제안할 완성기입니다.

세 번째 줄은 완성의 시연입니다. 사용자 지정 명령 `my-command`의 이름을 입력하고 공백을 입력한 다음 <kbd>Tab</kbd> 키를 누릅니다. 그러면 가능한 완성이 있는 메뉴가 표시됩니다. 사용자 지정 완성은 시스템의 다른 완성처럼 작동하여 `e`를 입력하고 <kbd>Tab</kbd> 키를 눌러 "eel"을 자동으로 완성할 수 있습니다.

::: tip
완성 메뉴가 표시되면 프롬프트가 기본적으로 `|` 문자를 포함하도록 변경됩니다. 프롬프트 마커를 변경하려면 `$env.config.menus` 목록에서 `name` 키가 `completion_menu`인 레코드의 `marker` 값을 수정하십시오. [완성 메뉴 구성](/book/line_editor.md#completion-menu)도 참조하십시오.
:::

::: tip
누셸의 기본 제공 파일 완성으로 대체하려면 제안 목록 대신 `null`을 반환하십시오.
:::

## 사용자 지정 완성 옵션

완성이 필터링되고 정렬되는 방식을 선택하려면 목록 대신 레코드를 반환할 수도 있습니다. 완성 제안 목록은 이 레코드의 `completions` 키 아래에 있어야 합니다. 선택적으로 `options` 키 아래에 다음 선택적 설정을 포함하는 레코드를 가질 수도 있습니다.

- `sort` - 완성을 정렬하지 않으려면 이 값을 `false`로 설정하십시오. 기본적으로 이 값은 `true`이며, 완성은 `$env.config.completions.sort`에 따라 정렬됩니다.
- `case_sensitive` - 사용자 지정 완성을 대소문자를 구분하여 일치시키려면 `true`로, 그렇지 않으면 `false`로 설정하십시오. `$env.config.completions.case_sensitive`를 재정의하는 데 사용됩니다.
- `completion_algorithm` - 입력된 텍스트와 완성이 일치하는 방식을 선택하려면 이 값을 `prefix`, `substring` 또는 `fuzzy`로 설정하십시오. `$env.config.completions.algorithm`을 재정의하는 데 사용됩니다.

다음은 이러한 옵션을 설정하는 방법을 보여주는 예입니다.

```nu
def animals [] {
    {
        options: {
            case_sensitive: false,
            completion_algorithm: substring,
            sort: false,
        },
        completions: [cat, rat, bat]
    }
}
def my-command [animal: string@animals] { print $animal }
```

이제 `A`를 완성하려고 하면 다음과 같은 완성을 얻습니다.

```nu
>| my-command A
cat                 rat                 bat
```

일치를 대소문자를 구분하지 않도록 만들었기 때문에 누셸은 모든 완성 제안에서 하위 문자열 "a"를 찾습니다. 또한 `sort: false`를 설정했기 때문에 완성은 원래 순서대로 유지됩니다. 이는 완성이 이미 텍스트와 관련 없는 특정 순서(예: 날짜순)로 정렬된 경우에 유용합니다.

## 모듈 및 사용자 지정 완성

완성 명령은 직접 호출하기 위한 것이 아니므로 모듈에서 정의하는 것이 일반적입니다.

모듈을 사용하여 위 예제를 확장합니다.

```nu
module commands {
    def animals [] {
        ["cat", "dog", "eel" ]
    }

    export def my-command [animal: string@animals] {
        print $animal
    }
}
```

이 모듈에서는 사용자 지정 명령 `my-command`만 내보냅니다. `animals` 완성은 내보내지 않습니다. 이를 통해 이 모듈의 사용자는 완성 명령 자체에 액세스하지 않고도 명령을 호출하고 사용자 지정 완성 논리를 사용할 수 있습니다. 이렇게 하면 더 깨끗하고 유지 관리하기 쉬운 API가 생성됩니다.

::: tip
완성기는 구문 분석 시 `@`를 사용하여 사용자 지정 명령에 연결됩니다. 즉, 완성 명령에 대한 변경 사항이 적용되려면 공용 사용자 지정 명령도 다시 구문 분석해야 합니다. 모듈을 가져오면 단일 `use` 문으로 이 두 가지 요구 사항을 동시에 충족합니다.
:::

## 컨텍스트 인식 사용자 지정 완성

완성 명령에 컨텍스트를 전달할 수 있습니다. 이는 정확한 완성을 생성하기 위해 이전 인수 또는 플래그를 알아야 하는 상황에서 유용합니다.

이 개념을 이전 예제에 적용합니다.

```nu
module commands {
    def animals [] {
        ["cat", "dog", "eel" ]
    }

    def animal-names [context: string] {
        match ($context | split words | last) {
            cat => ["Missy", "Phoebe"]
            dog => ["Lulu", "Enzo"]
            eel => ["Eww", "Slippy"]
        }
    }

    export def my-command [
        animal: string@animals
        name: string@animal-names
    ] {
        print $"The ($animal) is named ($name)."
    }
}
```

여기서 `animal-names` 명령은 적절한 이름 목록을 반환합니다. `$context`는 지금까지 입력된 명령줄의 값인 문자열입니다.

```nu
>| my-command
cat                 dog                 eel
>| my-command dog
Lulu                Enzo
>my-command dog enzo
The dog is named Enzo
```

두 번째 줄에서 <kbd>tab</kbd> 키를 누르면 인수 `"my-command dog"`가 컨텍스트로 `animal-names` 완성기에 전달됩니다.

::: tip
완성기는 다음을 사용하여 명령줄에서 현재 커서 위치를 얻을 수도 있습니다.

```nu
def completer [context:string, position:int] {}
```

:::

## 사용자 지정 완성 및 [`extern`](/commands/docs/extern.md)

강력한 조합은 [알려진 `extern` 명령](externs.md)에 사용자 지정 완성을 추가하는 것입니다. 이는 사용자 지정 완성을 사용자 지정 명령에 추가하는 것과 동일하게 작동합니다. 사용자 지정 완성을 만들고 `@`를 사용하여 `extern`의 위치 또는 플래그 인수 중 하나의 유형에 연결합니다.

기본 구성의 예제를 자세히 살펴보면 다음과 같은 것을 볼 수 있습니다.

```nu
export extern "git push" [
    remote?: string@"nu-complete git remotes",  # 원격의 이름
    refspec?: string@"nu-complete git branches" # 분기 / refspec
    ...
]
```

사용자 지정 완성은 이 예제에서 이전 예제와 동일한 역할을 합니다. 위 예제는 사용자가 현재 있는 위치에 따라 두 가지 다른 사용자 지정 완성을 호출합니다.

## 사용자 지정 설명 및 스타일

문자열 목록을 반환하는 대신 완성 함수는 `value` 필드와 선택적 `description` 및 `style` 필드가 있는 레코드 목록을 반환할 수도 있습니다. 스타일은 다음 중 하나일 수 있습니다.

- 전경색이 있는 문자열, 16진수 코드 또는 `yellow`와 같은 색상 이름. 유효한 색상 이름 목록은 `ansi --list`를 참조하십시오.
- `fg`(전경색), `bg`(배경색) 및 `attr`(밑줄 및 굵게와 같은 속성) 필드가 있는 레코드. 이 레코드는 `ansi --escape`가 허용하는 것과 동일한 형식입니다. `attr` 필드의 가능한 값 목록은 [`ansi`](/commands/docs/ansi) 명령 참조를 참조하십시오.
- 동일한 레코드이지만 JSON 문자열로 변환되었습니다.

```nu
def my_commits [] {
    [
        { value: "5c2464", description: "Add .gitignore", style: red },
        # "attr: ub" => 밑줄 및 굵게
        { value: "f3a377", description: "Initial commit", style: { fg: green, bg: "#66078c", attr: ub } }
    ]
}
```

::: tip 참고
다음 코드 조각 사용:

```nu
def my-command [commit: string@my_commits] {
    print $commit
}
```

... 완성 메뉴에 다음과 같은 내용이 표시되더라도

```ansi
>_ [36mmy-command[0m <TAB>
[1;31m5c2464[0m  [33mAdd .gitignore[0m
[1;4;48;2;102;7;140;32mf3a377  [0m[33mInitial commit[0m
```

... 명령 인수에는 값(예: "5c2464" 또는 "f3a377")만 사용됩니다!
:::

## 외부 완성

외부 완성기는 누셸 완성기에만 의존하는 대신 통합할 수도 있습니다.

이를 위해 `config.nu`의 `external_completer` 필드를 누셸 완성이 발견되지 않은 경우 평가될 [클로저](types_of_data.md#closures)로 설정하십시오.

```nu
$env.config.completions.external = {
    enable: true
    max_results: 100
    completer: $completer
}
```

[carapace](https://github.com/rsteube/carapace-bin)와 같은 외부 완성기를 실행하도록 클로저를 구성할 수 있습니다.

외부 완성기는 현재 명령을 문자열 목록으로 받아 `value` 및 `description` 키가 있는 레코드 목록을 출력하는 함수이며, 사용자 지정 완성 함수와 같습니다. 클로저가 `null`을 반환하면 파일 완성으로 기본 설정됩니다.

::: tip 참고
이 클로저는 현재 명령을 목록으로 받습니다. 예를 들어 `my-command --arg1 <tab>`을 입력하면 `[my-command --arg1 " "]`를 받습니다.
:::

이 예제는 carapace 외부 완성을 활성화합니다.

```nu
let carapace_completer = {|spans|
    carapace $spans.0 nushell ...$spans | from json
}
```

[더 많은 예는 쿡북에서 찾을 수 있습니다](/cookbook/external_completers.md).
