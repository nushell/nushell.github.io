# 누셸 코드 테스트

## 어설션 명령

누셸은 표준 라이브러리에 "어설션" 명령 세트를 제공합니다.
`==` 또는 `<=`와 같은 기본 제공 동등성/순서 테스트 또는 더 복잡한 명령을 사용하고 예상 조건이 실패할 때 수동으로 오류를 발생시킬 수 있지만, 표준 라이브러리가 제공하는 것을 사용하는 것이 더 쉽습니다!

다음에서는 `std assert` 모듈이 현재 범위 내에서 가져온 것으로 가정합니다.

```nu
use std/assert
```

모든 어설션의 기초는 `std assert` 명령입니다. 조건이 참이 아니면 오류를 발생시킵니다.

```nu
assert (1 == 2)
```

```
Error:
  × Assertion failed.
   ╭─[entry #13:1:1]
 1 │ assert (1 == 2)
   ·         ───┬──
   ·            ╰── It is not true.
   ╰────
```

선택적으로, 어설션 명령의 의도, 무엇이 잘못되었는지 또는 무엇이 예상되었는지 보여주기 위해 메시지를 설정할 수 있습니다.

```nu
let a = 0
assert ($a == 19) $"The lockout code is wrong, received: ($a)"
```

```
Error:
  × The lockout code is wrong, received: 13
   ╭─[entry #25:1:1]
 1 │ let a = 0
 2 │ assert ($a == 19) $"The lockout code is wrong, received: ($a)"
   ·         ────┬───
   ·             ╰── It is not true.
   ╰────
```

많은 어설션 명령이 있으며, 적절한 연산자와 함께 기본 명령과 똑같이 작동합니다. 추가적인 가치는 더 나은 오류 메시지를 제공하는 능력입니다.

예를 들어, 추가 메시지 없이는 그다지 도움이 되지 않습니다.

```nu
let a = "foo"
let b = "bar"
assert ($b | str contains $a)
```

```
Error:   × Assertion failed.
   ╭─[entry #5:3:8]
 2 │ let b = "bar"
 3 │ assert ($b | str contains $a)
   ·        ───────────┬──────────
   ·                   ╰── It is not true.
   ╰────
```

`assert str contains`를 사용하는 동안:

```nu
let a = "a needle"
let b = "haystack"
assert str contains $b $a
```

```
Error:   × Assertion failed.
   ╭─[entry #7:3:21]
 2 │ let b = "bar"
 3 │ assert str contains $b $a
   ·                     ──┬──
   ·                       ╰─┤ This does not contain 'a needle'.
   ·                         │         value: "haystack"
   ╰────
```

일반적으로 기본 `assert` 명령의 경우 무엇이 잘못되었는지 보여주기 위해 항상 추가 메시지를 제공하는 것이 좋습니다. 기본 제공 어설션 명령을 사용할 수 없는 경우 [`error make`](/commands/docs/error_make.md)에 대한 레이블을 `assert` 명령에 전달하여 사용자 지정 명령을 만들 수 있습니다.

```nu
def "assert even" [number: int] {
    assert ($number mod 2 == 0) --error-label {
        text: $"($number) is not an even number",
        span: (metadata $number).span,
    }
}
```

그러면 다음과 같은 자세한 사용자 지정 오류 메시지가 표시됩니다.

```nu
let $a = 13
assert even $a
```

```
Error:
  × Assertion failed.
   ╭─[entry #37:1:1]
 1 │ assert even $a
   ·             ─┬
   ·              ╰── 13 is not an even number
   ╰────
```

## 테스트 실행

이제 `std assert`에서 명령을 호출하여 테스트를 작성할 수 있으므로, 문제가 있을 때 테스트가 실패하고 모든 것이 올바를 때 통과하는 것을 실행하고 볼 수 있으면 좋을 것입니다 :)

### Nupm 패키지

이 첫 번째 경우, 테스트하려는 코드가 [Nupm] 패키지의 일부라고 가정합니다.

이 경우 다음 단계를 따르는 것만큼 쉽습니다.

- 패키지의 `nupm.nuon` 패키지 파일 옆에 `tests/` 디렉터리 만들기
- `mod.nu` 파일을 추가하여 `tests/` 디렉터리를 유효한 모듈로 만들기
- `tests/` 내에 명령 작성
- `nupm test` 호출

관례는 `tests` 모듈에서 완전히 내보낸 모든 명령이 테스트로 실행된다는 것입니다. 예:

- `tests/mod.nu`의 `export def some-test`가 실행됩니다.
- `tests/mod.nu`의 `def just-an-internal-cmd`는 실행되지 않습니다.
- `tests/spam.nu`의 `export def another-test`는 `tests/mod.nu`에 `export use spam.nu *`와 같은 것이 있는 경우에만 실행됩니다.

### 독립 실행형 테스트

누셸 스크립트 또는 모듈이 [Nupm] 패키지의 일부가 아닌 경우 가장 간단한 방법은 독립 실행형 스크립트로 테스트를 작성한 다음 `Makefile` 또는 CI에서 호출하는 것입니다.

간단한 피보나치 명령이 포함된 간단한 `math.nu` 모듈이 있다고 가정해 보겠습니다.

```nu
# `fib n`은 n번째 피보나치 수입니다.
export def fib [n: int] [ nothing -> int ] {
    if $n == 0 {
        return 0
    } else if $n == 1 {
        return 1
    }

    (fib ($n - 1)) + (fib ($n - 2))
}
```

그런 다음 `tests.nu`라는 테스트 스크립트는 다음과 같을 수 있습니다.

```nu
use math.nu fib
use std/assert

for t in [
    [input, expected];
    [0, 0],
    [1, 1],
    [2, 1],
    [3, 2],
    [4, 3],
    [5, 5],
    [6, 8],
    [7, 13],
] {
    assert equal (fib $t.input) $t.expected
}
```

그리고 `nu tests.nu`로 호출됩니다.

### 기본 테스트 프레임워크

[Nupm] 패키지 없이도 설명적인 이름을 가진 함수로 누셸에서 테스트를 정의하고 동적으로 발견할 수도 있습니다. 다음은 `scope commands`와 생성된 테스트 목록을 실행하기 위해 두 번째 누셸 인스턴스를 사용합니다.

```nu
use std/assert

source fib.nu

def main [] {
    print "Running tests..."

    let test_commands = (
        scope commands
            | where ($it.type == "custom")
                and ($it.name | str starts-with "test ")
                and not ($it.description | str starts-with "ignore")
            | get name
            | each { |test| [$"print 'Running test: ($test)'", $test] } | flatten
            | str join "; "
    )

    nu --commands $"source ($env.CURRENT_FILE); ($test_commands)"
    print "Tests completed successfully"
}

def "test fib" [] {
    for t in [
        [input, expected];
        [0, 0],
        [1, 1],
        [2, 1],
        [3, 2],
        [4, 3],
        [5, 5],
        [6, 8],
        [7, 13]
    ] {
        assert equal (fib $t.input) $t.expected
    }
}

# ignore
def "test show-ignored-test" [] {
    print "This test will not be executed"
}
```

이것은 간단한 예이지만 설정 및 해체 함수와 파일 전체의 테스트 검색을 포함하여 테스트 프레임워크에서 기대할 수 있는 많은 것을 포함하도록 확장될 수 있습니다.

[Nupm]: https://github.com/nushell/nupm
