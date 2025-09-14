# 오버레이

오버레이는 필요에 따라 활성화 및 비활성화할 수 있는 정의(사용자 지정 명령, 별칭, 환경 변수)의 "계층" 역할을 합니다.
파이썬과 같은 일부 언어에서 볼 수 있는 가상 환경과 유사합니다.

_참고: 오버레이를 이해하려면 오버레이가 모듈 위에 구축되므로 먼저 [모듈](modules.md)을 확인하십시오._

## 기본 사항

먼저, 누셸은 `zero`라는 하나의 기본 오버레이와 함께 제공됩니다.
[`overlay list`](/commands/docs/overlay_list.md) 명령으로 활성 오버레이를 검사할 수 있습니다.
거기에 나열된 기본 오버레이가 표시되어야 합니다.

새 오버레이를 만들려면 먼저 모듈이 필요합니다.

```nu
module spam {
    export def foo [] {
        "foo"
    }

    export alias bar = echo "bar"

    export-env {
        load-env { BAZ: "baz" }
    }
}
```

이 장 전체에서 이 모듈을 사용할 것이므로 `overlay use spam`을 볼 때마다 `spam`이 이 모듈을 참조한다고 가정하십시오.

::: tip
모듈은 [모듈](modules.md)에 설명된 세 가지 방법 중 하나로 만들 수 있습니다.

- "인라인" 모듈(이 예제에서 사용됨)
- 파일
- 디렉터리
:::

오버레이를 만들려면 [`overlay use`](/commands/docs/overlay_use.md)를 호출하십시오.

```nu
overlay use spam

foo
# => foo

bar
# => bar

$env.BAZ
# => baz

overlay list
# => ───┬──────
# =>  0 │ zero
# =>  1 │ spam
# => ───┴──────
```

모듈의 정의를 현재 범위로 가져오고 [`use`](/commands/docs/use.md) 명령과 동일한 방식으로 [`export-env`](/commands/docs/export-env.md) 블록을 평가했습니다([모듈](modules.md#environment-variables) 장 참조).

::: tip
다음 섹션에서는 `>` 프롬프트 앞에 마지막 활성 오버레이의 이름이 붙습니다.
`(spam)> some-command`는 명령을 입력했을 때 `spam` 오버레이가 마지막 활성 오버레이임을 의미합니다.
:::

## 오버레이 제거

더 이상 오버레이 정의가 필요하지 않으면 [`overlay hide`](/commands/docs/overlay_hide.md)를 호출하십시오.

```nu
(spam)> overlay hide spam

(zero)> foo
Error: Can't run executable...

(zero)> overlay list
───┬──────
 0 │ zero
───┴──────
```

오버레이도 범위가 지정됩니다.
추가된 오버레이는 범위가 끝나면 제거됩니다.

```nu
(zero)> do { overlay use spam; foo }  # 오버레이는 블록 내에서만 활성화됩니다.
foo

(zero)> overlay list
───┬──────
 0 │ zero
───┴──────
```

오버레이를 제거하는 마지막 방법은 인수가 없는 [`overlay hide`](/commands/docs/overlay_hide.md)를 호출하는 것입니다. 그러면 마지막 활성 오버레이가 제거됩니다.

## 오버레이는 기록 가능합니다

새로운 정의(명령, 별칭, 환경 변수)는 마지막 활성 오버레이에 기록됩니다.

```nu
(zero)> overlay use spam

(spam)> def eggs [] { "eggs" }
```

이제 `eggs` 명령은 `spam` 오버레이에 속합니다.
오버레이를 제거하면 더 이상 호출할 수 없습니다.

```nu
(spam)> overlay hide spam

(zero)> eggs
Error: Can't run executable...
```

하지만 다시 가져올 수 있습니다!

```nu
(zero)> overlay use spam

(spam)> eggs
eggs
```

오버레이는 추가한 내용을 기억하고 제거하더라도 해당 정보를 저장합니다.
이를 통해 다른 컨텍스트 간에 반복적으로 전환할 수 있습니다.

::: tip
오버레이를 추가한 후 사용자 지정 정의가 추가되지 않도록 하려면
사용자 지정 변경 사항을 기록하는 데만 사용되는 새 빈 오버레이를 만드는 것이 해결책이 될 수 있습니다.

```nu
(zero)> overlay use spam

(spam)> module scratchpad { }

(spam)> overlay use scratchpad

(scratchpad)> def eggs [] { "eggs" }
```

`eggs` 명령은 `spam`을 그대로 유지하면서 `scratchpad`에 추가됩니다.

더 간단하게 만들려면 [`overlay new`](/commands/docs/overlay_new.md) 명령을 사용할 수 있습니다.

```nu
(zero)> overlay use spam

(spam)> overlay new scratchpad

(scratchpad)> def eggs [] { "eggs" }
```

:::

## 접두사가 붙은 오버레이

[`overlay use`](/commands/docs/overlay_use.md) 명령은 모듈에서 모든 명령과 별칭을 가져와 현재 네임스페이스에 직접 넣습니다.
그러나 모듈 이름 뒤에 하위 명령으로 유지하고 싶을 수 있습니다.
이것이 `--prefix`가 하는 일입니다.

```nu
(zero)> module spam {
    export def foo [] { "foo" }
}

(zero)> overlay use --prefix spam

(spam)> spam foo
foo
```

이는 환경 변수에는 적용되지 않습니다.

## 오버레이 이름 바꾸기

`as` 키워드를 사용하여 추가된 오버레이의 이름을 변경할 수 있습니다.

```nu
(zero)> module spam { export def foo [] { "foo" } }

(zero)> overlay use spam as eggs

(eggs)> foo
foo

(eggs)> overlay hide eggs

(zero)>
```

이는 가상 환경의 `activate.nu`와 같이 일반적인 스크립트 이름이 있지만 오버레이에 더 설명적인 이름을 원하는 경우에 유용할 수 있습니다.

## 정의 보존

때로는 오버레이를 제거하고 싶지만 다음 활성 오버레이에서 다시 정의할 필요 없이 추가한 모든 사용자 지정 정의를 유지하고 싶을 수 있습니다.

```nu
(zero)> overlay use spam

(spam)> def eggs [] { "eggs" }

(spam)> overlay hide --keep-custom spam

(zero)> eggs
eggs
```

`--keep-custom` 플래그는 바로 그 역할을 합니다.

`--keep-env` 플래그를 사용하여 오버레이 내에 정의된 환경 변수 목록을 유지하고 나머지는 제거할 수도 있습니다.

```nu
(zero)> module spam {
    export def foo [] { "foo" }
    export-env { $env.FOO = "foo" }
}

(zero)> overlay use spam

(spam)> overlay hide spam --keep-env [ FOO ]

(zero)> foo
Error: Can't run executable...

(zero)> $env.FOO
foo
```

## 오버레이 순서 지정

오버레이는 스택으로 배열됩니다.
여러 오버레이에 `foo`와 같은 동일한 정의가 포함된 경우 마지막 활성 오버레이의 정의가 우선합니다.
오버레이를 스택의 맨 위로 가져오려면 [`overlay use`](/commands/docs/overlay_use.md)를 다시 호출할 수 있습니다.

```nu
(zero)> def foo [] { "foo-in-zero" }

(zero)> overlay use spam

(spam)> foo
foo

(spam)> overlay use zero

(zero)> foo
foo-in-zero

(zero)> overlay list
───┬──────
 0 │ spam
 1 │ zero
───┴──────
```

이제 `zero` 오버레이가 우선합니다.
