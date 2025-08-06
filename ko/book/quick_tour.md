---
prev:
  text: 시작하기
  link: /book/getting_started.md
---
# 빠른 둘러보기

[[toc]]

## 누셸 명령어 출력 _데이터_

Nu가 무엇을 할 수 있는지 가장 쉽게 보는 방법은 몇 가지 예제로 시작하는 것이므로, 바로 시작하겠습니다.

[`ls`](/commands/docs/ls.md)와 같은 명령을 실행할 때 가장 먼저 눈에 띄는 것은 텍스트 블록이 아닌 구조화된 테이블이 반환된다는 것입니다.

```nu:no-line-numbers
ls
# => ╭────┬─────────────────────┬──────┬───────────┬──────────────╮
# => │  # │        name         │ type │   size    │   modified   │
# => ├────┼─────────────────────┼──────┼───────────┼──────────────┤
# => │  0 │ CITATION.cff        │ file │     812 B │ 2 months ago │
# => │  1 │ CODE_OF_CONDUCT.md  │ file │   3.4 KiB │ 9 months ago │
# => │  2 │ CONTRIBUTING.md     │ file │  11.0 KiB │ 5 months ago │
# => │  3 │ Cargo.lock          │ file │ 194.9 KiB │ 15 hours ago │
# => │  4 │ Cargo.toml          │ file │   9.2 KiB │ 15 hours ago │
# => │  5 │ Cross.toml          │ file │     666 B │ 6 months ago │
# => │  6 │ LICENSE             │ file │   1.1 KiB │ 9 months ago │
# => │  7 │ README.md           │ file │  12.0 KiB │ 15 hours ago │
# => ...
```

이 테이블은 출력을 보기 좋게 서식 지정하는 것 이상의 역할을 합니다. 스프레드시트처럼 데이터를 _대화식으로_ 작업할 수 있습니다.

## 데이터에 대한 작업

다음으로, 이 테이블을 각 파일의 크기별로 정렬해 보겠습니다. 이를 위해 [`ls`](/commands/docs/ls.md)의 출력을 가져와 열의 _값_을 기반으로 테이블을 정렬할 수 있는 명령에 공급합니다.

```nu:no-line-numbers
ls | sort-by size | reverse
# => ╭───┬─────────────────┬──────┬───────────┬──────────────╮
# => │ # │      name       │ type │   size    │   modified   │
# => ├───┼─────────────────┼──────┼───────────┼──────────────┤
# => │ 0 │ Cargo.lock      │ file │ 194.9 KiB │ 15 hours ago │
# => │ 1 │ toolkit.nu      │ file │  20.0 KiB │ 15 hours ago │
# => │ 2 │ README.md       │ file │  12.0 KiB │ 15 hours ago │
# => │ 3 │ CONTRIBUTING.md │ file │  11.0 KiB │ 5 months ago │
# => │ 4 │ ...             │ ...  │ ...       │ ...          │
# => │ 5 │ LICENSE         │ file │   1.1 KiB │ 9 months ago │
# => │ 6 │ CITATION.cff    │ file │     812 B │ 2 months ago │
# => │ 7 │ Cross.toml      │ file │     666 B │ 6 months ago │
# => │ 8 │ typos.toml      │ file │     513 B │ 2 months ago │
# => ╰───┴─────────────────┴──────┴───────────┴──────────────╯
```

[`ls`](/commands/docs/ls.md)에 명령줄 인수나 스위치를 전달하지 않았다는 점에 유의하십시오. 대신 누셸의 기본 제공 [`sort-by`](/commands/docs/sort-by.md) 명령을 사용하여 `ls` 명령의 _출력_을 정렬했습니다. 그런 다음 가장 큰 파일을 맨 위에 표시하기 위해 `sort-by`의 _출력_에 [`reverse`](/commands/docs/reverse.md)를 사용했습니다.

::: tip 멋지네요!
정렬 순서를 자세히 비교하면 데이터가 알파벳순으로 정렬되지 않았다는 것을 알 수 있습니다. _숫자_ 값으로도 정렬되지 않았습니다. 대신 `size` 열이 [`filesize` 유형](./types_of_data.md#file-sizes)이므로 누셸은 `1.1 KiB`(키비바이트)가 `812 B`(바이트)보다 크다는 것을 알고 있습니다.
:::

# `where` 명령을 사용하여 데이터 찾기

Nu는 이전 명령의 구조화된 출력에 대해 작동할 수 있는 많은 명령을 제공합니다. 이들은 일반적으로 누셸에서 "필터"로 분류됩니다.

예를 들어, [`where`](/commands/docs/where.md)를 사용하여 테이블의 내용을 필터링하여 10킬로바이트가 넘는 파일만 표시하도록 할 수 있습니다.

```nu
ls | where size > 10kb
# => ╭───┬─────────────────┬──────┬───────────┬───────────────╮
# => │ # │      name       │ type │   size    │   modified    │
# => ├───┼─────────────────┼──────┼───────────┼───────────────┤
# => │ 0 │ CONTRIBUTING.md │ file │  11.0 KiB │ 5 months ago  │
# => │ 1 │ Cargo.lock      │ file │ 194.6 KiB │ 2 minutes ago │
# => │ 2 │ README.md       │ file │  12.0 KiB │ 16 hours ago  │
# => │ 3 │ toolkit.nu      │ file │  20.0 KiB │ 16 hours ago  │
# => ╰───┴─────────────────┴──────┴───────────┴───────────────╯
```

## 디렉터리 이상

물론 이것은 `ls` 명령에만 국한되지 않습니다. 누셸은 각 명령이 한 가지 일을 잘하고 일반적으로 한 명령의 출력이 다른 명령의 입력이 될 것으로 기대할 수 있는 유닉스 철학을 따릅니다. 이를 통해 여러 가지 조합으로 명령을 혼합하고 일치시킬 수 있습니다.

다른 명령을 살펴보겠습니다.

```nu:no-line-numbers
ps
# => ╭───┬──────┬──────┬───────────────┬──────────┬──────┬───────────┬─────────╮
# => │ # │ pid  │ ppid │     name      │  status  │ cpu  │    mem    │ virtual │
# => ├───┼──────┼──────┼───────────────┼──────────┼──────┼───────────┼─────────┤
# => │ 0 │    1 │    0 │ init(void)    │ Sleeping │ 0.00 │   1.2 MiB │ 2.2 MiB │
# => │ 1 │    8 │    1 │ init          │ Sleeping │ 0.00 │ 124.0 KiB │ 2.3 MiB │
# => │ 2 │ 6565 │    1 │ SessionLeader │ Sleeping │ 0.00 │ 108.0 KiB │ 2.2 MiB │
# => │ 3 │ 6566 │ 6565 │ Relay(6567)   │ Sleeping │ 0.00 │ 116.0 KiB │ 2.2 MiB │
# => │ 4 │ 6567 │ 6566 │ nu            │ Running  │ 0.00 │  28.4 MiB │ 1.1 GiB │
# => ╰───┴──────┴──────┴───────────────┴──────────┴──────┴───────────┴─────────╯
```

Linux/Unix `ps` 명령에 익숙할 수 있습니다. 시스템에서 현재 실행 중인 모든 프로세스 목록과 현재 상태를 제공합니다. `ls`와 마찬가지로 누셸은 결과를 구조화된 데이터로 반환하는 크로스 플랫폼 기본 제공 [`ps` 명령](/commands/docs/ps.md)을 제공합니다.

::: note
전통적인 유닉스 `ps`는 기본적으로 현재 프로세스와 해당 부모만 표시합니다. 누셸의 구현은 기본적으로 시스템의 모든 프로세스를 표시합니다.

일반적으로 누셸에서 `ps`를 실행하면 **_내부_**, 크로스 플랫폼 명령을 사용합니다. 그러나 유닉스/리눅스 플랫폼에서는 _캐럿 기호_를 앞에 붙여 **_외부_**, 시스템 종속 버전을 계속 실행할 수 있습니다. 예시:

```nu
^ps aux  # 사용자 중심 형식으로 모든 프로세스가 있는 유닉스 ps 명령 실행
```

자세한 내용은 [외부 시스템 명령 실행](./running_externals.md)을 참조하십시오.
:::

활발하게 실행 중인 프로세스만 표시하려면 어떻게 해야 할까요? 위의 `ls`와 마찬가지로 `ps`가 _출력_하는 테이블로도 작업할 수 있습니다.

```nu
ps | where status == Running
# => ╭───┬──────┬──────┬──────┬─────────┬──────┬──────────┬─────────╮
# => │ # │ pid  │ ppid │ name │ status  │ cpu  │   mem    │ virtual │
# => ├───┼──────┼──────┼──────┼─────────┼──────┼──────────┼─────────┤
# => │ 0 │ 6585 │ 6584 │ nu   │ Running │ 0.00 │ 31.9 MiB │ 1.2 GiB │
# => ╰───┴──────┴──────┴──────┴─────────┴──────┴──────────┴─────────╯
```

::: tip
위에서 `ls` 명령의 `size` 열이 `filesize`였던 것을 기억하십니까? 여기서 `status`는 실제로 문자열이며, (위에서와 같이) `==` 비교를 포함하여 모든 일반적인 문자열 작업 및 명령을 사용할 수 있습니다.

다음을 사용하여 테이블의 열 유형을 검사할 수 있습니다.

```nu
ps | describe
# => table<pid: int, ppid: int, name: string, status: string, cpu: float, mem: filesize, virtual: filesize> (stream)
```

[`describe` 명령](/commands/docs/describe.md)을 사용하여 모든 명령 또는 표현식의 출력 유형을 표시할 수 있습니다.

:::

## 파이프라인의 명령 인수

때로는 명령이 파이프라인 _입력_ 대신 _인수_를 받습니다. 이 시나리오를 위해 누셸은 이전 명령의 출력을 변수 형식으로 사용할 수 있는 [`$in` 변수](./pipelines.md#pipeline-input-and-the-special-in-variable)를 제공합니다. 예시:

```nu:line-numbers
ls
| sort-by size
| reverse
| first
| get name
| cp $in ~
```

::: tip 누셸 디자인 노트
가능한 경우 누셸 명령은 파이프라인 _입력_에 대해 작동하도록 설계되었습니다. 그러나 이 예제의 `cp`와 같이 의미가 다른 두 개 이상의 인수가 있는 일부 명령이 있습니다. 이 경우 `cp`는 _복사_할 경로와 _대상_ 경로를 모두 알아야 합니다. 결과적으로 이 명령은 두 개의 _위치 매개변수_로 더 인체공학적입니다.
:::

::: tip
누셸 명령은 가독성을 위해 여러 줄에 걸쳐 확장될 수 있습니다. 위는 다음과 같습니다.

```nu
ls | sort-by size | reverse | first | get name | cp $in ~
```

참조: [여러 줄 편집](./line_editor.md#multi-line-editing)
:::

처음 세 줄은 위 두 번째 예제에서 사용한 것과 동일한 명령이므로 마지막 세 줄을 살펴보겠습니다.

4. [`first` 명령](/commands/docs/first.md)은 테이블에서 첫 번째 값을 반환합니다. 이 경우 가장 큰 크기의 파일을 의미합니다. 위 두 번째 예제의 디렉터리 목록을 사용하는 경우 `Cargo.lock` 파일입니다. 이 "파일"은 테이블의 [`record`](./types_of_data.md#records)이며 여전히 `name`, `type`, `size` 및 `modified` 열/필드를 포함합니다.
5. `get name`은 이전 명령에서 `name` 필드의 _값_을 반환하므로 `"Cargo.lock"`(문자열)입니다. 이것은 또한 구조화된 데이터를 탐색하고 격리하는 데 사용할 수 있는 [`cell-path`](./types_of_data.md#cell-paths)의 간단한 예입니다.
6. 마지막 줄은 `$in` 변수를 사용하여 5행의 출력을 참조합니다. 결과는 _"'Cargo.lock'을 홈 디렉터리로 복사"_라는 명령입니다.

::: tip
[`get`](/commands/docs/get.md)와 그 대응물인 [`select`](/commands/docs/select.md)는 누셸에서 가장 많이 사용되는 두 가지 필터이지만 처음에는 그 차이점을 발견하기 쉽지 않을 수 있습니다. 더 광범위하게 사용하기 시작할 준비가 되면 [ `get` 및 `select` 사용](./navigating_structured_data.md#using-get-and-select) 가이드를 참조하십시오.
:::

## 도움말 얻기

누셸은 광범위한 셸 내 도움말 시스템을 제공합니다. 예시

```nu
# help <command>
help ls
# 또는
ls --help
# 또한
help operators
help escapes
```

::: tip 멋지네요!
<kbd>F1</kbd> 키를 눌러 도움말 [메뉴](./line_editor.md#menus)에 액세스합니다. 여기서 `ps` 명령을 검색하되 _아직 <kbd>Enter</kbd>를 누르지 마십시오_!

대신 <kbd>아래쪽 화살표</kbd> 키를 누르면 예제 섹션을 스크롤하고 있음을 알 수 있습니다. 예제를 강조 표시한 다음 <kbd>Enter</kbd>를 누르면 예제가 명령줄에 입력되어 실행할 준비가 됩니다!

이것은 광범위한 누셸 명령 세트를 탐색하고 배우는 좋은 방법이 될 수 있습니다.
:::

도움말 시스템에는 "검색" 기능도 있습니다.

```nu
help --find filesize
# 또는
help -f filesize
```

이제는 도움말 시스템 자체가 구조화된 데이터를 기반으로 한다는 사실에 놀라지 않을 수도 있습니다! `help -f filesize`의 출력이 테이블이라는 점에 유의하십시오.

각 명령에 대한 도움말은 다음이 포함된 레코드로 저장됩니다.

- 이름
- 카테고리
- 유형(내장, 플러그인, 사용자 지정)
- 허용하는 매개변수
- 출력뿐만 아니라 허용할 수 있는 데이터 유형을 보여주는 서명
- 그리고 더

다음을 사용하여 _모든_ 명령(외부 명령 제외)을 단일 큰 테이블로 볼 수 있습니다.

```nu
help commands
```

::: tip
위 출력의 `params` 및 `input_output` 열은 _중첩_ 테이블입니다. 누셸은 [임의로 중첩된 데이터 구조](./navigating_structured_data.md#background)를 허용합니다.
:::

## 여기서부터 `explore`하기

`help commands` 출력이 꽤 깁니다. `less`나 `bat`와 같은 페이저로 보낼 수 있지만 누셸에는 스크롤뿐만 아니라 중첩된 데이터로 망원경으로 볼 수 있는 기본 제공 `explore` 명령이 포함되어 있습니다. 시도해 보십시오.

```nu
help commands | explore
```

그런 다음 <kbd>Enter</kbd> 키를 눌러 데이터 자체에 액세스합니다. 화살표 키를 사용하여 `cp` 명령으로 스크롤하고 `params` 열로 이동합니다. <kbd>Enter</kbd>를 다시 눌러 `cp` 명령에서 사용할 수 있는 매개변수의 전체 목록으로 망원경으로 들어갑니다.

::: note
<kbd>Esc</kbd>를 한 번 누르면 스크롤 모드에서 보기로 돌아갑니다. 두 번째 누르면 이전 보기로 돌아갑니다(또는 이미 최상위 보기 수준인 경우 종료).
:::

::: tip
물론 누셸의 _모든_ 구조화된 데이터에서 `explore` 명령을 사용할 수 있습니다. 여기에는 웹 API에서 오는 JSON 데이터, 스프레드시트 또는 CSV 파일, YAML 또는 누셸에서 구조화된 데이터로 나타낼 수 있는 모든 것이 포함될 수 있습니다.

재미로 `$env.config | explore`를 시도해 보십시오!
:::
