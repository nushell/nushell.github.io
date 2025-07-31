# 별칭

누셸의 별칭은 외부 및 내부 명령 모두의 명령 호출을 간단하게 대체하는 방법을 제공합니다. 이를 통해 기본 인수를 포함하여 긴 명령에 대한 약식 이름을 만들 수 있습니다.

예를 들어, `ls -l`로 확장되는 `ll`이라는 별칭을 만들어 보겠습니다.

```nu
alias ll = ls -l
```

이제 이 별칭을 호출할 수 있습니다.

```nu
ll
```

이렇게 하면 `ls -l`을 입력한 것과 같습니다. 또한 플래그나 위치 매개변수를 전달할 수도 있습니다. 예를 들어 다음과 같이 작성할 수도 있습니다.

```nu
ll -a
```

그러면 `ls -l -a`를 입력한 것과 같습니다.

## 로드된 모든 별칭 나열

사용 가능한 별칭은 `scope aliases` 및 `help aliases`에서 볼 수 있습니다.

## 영구화

별칭을 영구적으로 만들려면 `config nu`를 실행하여 편집기를 열고 별칭을 삽입한 다음 누셸을 다시 시작하여 _config.nu_ 파일에 추가해야 합니다.
예: 위의 `ll` 별칭을 사용하여 _config.nu_의 아무 곳에나 `alias ll = ls -l`을 추가할 수 있습니다.

```nu
$env.config = {
    # 주 구성
}

alias ll = ls -l

# 일부 다른 구성 및 스크립트 로드
```

## 별칭에서 파이핑

`alias uuidgen = uuidgen | tr A-F a-f`(Mac에서 uuidgen이 Linux처럼 동작하도록 만들기 위해)는 작동하지 않습니다.
해결책은 `^`를 통해 시스템 프로그램 `uuidgen`을 호출하는 매개변수 없는 명령을 정의하는 것입니다.

```nu
def uuidgen [] { ^uuidgen | tr A-F a-f }
```

자세한 내용은 이 책의 [사용자 지정 명령](custom_commands.md) 섹션을 참조하십시오.

또는 누셸 내부 명령을 사용한 더 관용적인 예

```nu
def lsg [] { ls | sort-by type name -i | grid -c | str trim }
```

나열된 모든 파일과 폴더를 그리드에 표시합니다.

## 별칭을 사용하여 기존 명령 바꾸기

::: warning 주의!
명령을 바꿀 때는 먼저 명령을 "백업"하고 재귀 오류를 피하는 것이 가장 좋습니다.
:::

`ls`와 같은 명령을 백업하는 방법:

```nu
alias core-ls = ls    # ls에 대한 새 별칭 core-ls를 만듭니다.
```

이제 nu-프로그래밍에서 `core-ls`를 `ls`로 사용할 수 있습니다. `core-ls`를 사용하는 방법은 아래에서 자세히 설명합니다.

`def`와 달리 별칭은 위치에 따라 다르기 때문에 별칭을 사용해야 합니다. 따라서 이전 명령을 다시 정의하기 전에 먼저 별칭으로 "백업"해야 합니다.
명령을 백업하지 않고 `def`를 사용하여 명령을 바꾸면 재귀 오류가 발생합니다.

```nu
def ls [] { ls }; ls    # 이렇게 하지 마십시오! 재귀 오류가 발생합니다.

#출력:
#오류: nu::shell::recursion_limit_reached
#
#  × 재귀 제한(50)에 도달했습니다.
#     ╭─[C:\Users\zolodev\AppData\Roaming\nushell\config.nu:807:1]
# 807 │
# 808 │ def ls [] { ls }; ls
#     ·           ───┬──
#     ·              ╰── 너무 많이 자신을 호출했습니다.
#     ╰────
```

기존 명령을 바꾸는 권장 방법은 명령을 섀도잉하는 것입니다.
다음은 `ls` 명령을 섀도잉하는 예입니다.

```nu
# 내장 ls 명령을 ls-builtins로 별칭 지정
alias ls-builtin = ls

# 디렉터리에 있는 항목의 파일 이름, 크기 및 수정 시간을 나열합니다.
def ls [
    --all (-a),         # 숨겨진 파일 표시
    --long (-l),        # 각 항목에 대해 사용 가능한 모든 열 가져오기(느림, 열은 플랫폼에 따라 다름)
    --short-names (-s), # 경로가 아닌 파일 이름만 인쇄
    --full-paths (-f),  # 경로를 절대 경로로 표시
    --du (-d),          # 디렉터리 메타데이터 크기 대신 명백한 디렉터리 크기("디스크 사용량") 표시
    --directory (-D),   # 내용 대신 지정된 디렉터리 자체를 나열
    --mime-type (-m),   # 'file' 대신 유형 열에 MIME 유형 표시(파일 이름만 기반으로 함, 파일 내용은 검사하지 않음)
    --threads (-t),     # 여러 스레드를 사용하여 내용 나열. 출력은 비결정적입니다.
    ...pattern: glob,   # 사용할 전역 패턴.
]: [ nothing -> table ] {
    let pattern = if ($pattern | is-empty) { [ '.' ] } else { $pattern }
    (ls-builtin
        --all=$all
        --long=$long
        --short-names=$short_names
        --full-paths=$full_paths
        --du=$du
        --directory=$directory
        --mime-type=$mime_type
        --threads=$threads
        ...$pattern
    ) | sort-by type name -i
}
```
