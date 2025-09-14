# 테이블 작업

[[toc]]

## 개요

Nu에서 데이터를 보는 일반적인 방법 중 하나는 테이블을 통해서입니다. Nu는 찾고 있는 것을 편리하게 찾고 필요한 데이터만으로 데이터를 좁힐 수 있도록 테이블로 작업하기 위한 여러 명령과 함께 제공됩니다.

시작하려면 사용할 수 있는 테이블을 가져오겠습니다.

```nu
ls
# => ───┬───────────────┬──────┬─────────┬────────────
# =>  # │ name          │ type │ size    │ modified
# => ───┼───────────────┼──────┼─────────┼────────────
# =>  0 │ files.rs      │ File │  4.6 KB │ 5 days ago
# =>  1 │ lib.rs        │ File │   330 B │ 5 days ago
# =>  2 │ lite_parse.rs │ File │  6.3 KB │ 5 days ago
# =>  3 │ parse.rs      │ File │ 49.8 KB │ 1 day ago
# =>  4 │ path.rs       │ File │  2.1 KB │ 5 days ago
# =>  5 │ shapes.rs     │ File │  4.7 KB │ 5 days ago
# =>  6 │ signature.rs  │ File │  1.2 KB │ 5 days ago
# => ───┴───────────────┴──────┴─────────┴────────────
```

::: tip 테이블 표시 방법 변경
Nu는 기본적으로 모든 테이블의 구조를 확장하려고 합니다. `display_output` 후크를 변경하여 이 동작을 변경할 수 있습니다.
자세한 내용은 [후크](/book/hooks.md#changing-how-output-is-displayed)를 참조하십시오.
:::

## 데이터 정렬

[`sort-by`](/commands/docs/sort-by.md) 명령을 호출하고 정렬에 사용할 열을 알려주어 테이블을 정렬할 수 있습니다. 파일 크기별로 테이블을 정렬하고 싶다고 가정해 보겠습니다.

```nu
ls | sort-by size
# => ───┬───────────────┬──────┬─────────┬────────────
# =>  # │ name          │ type │ size    │ modified
# => ───┼───────────────┼──────┼─────────┼────────────
# =>  0 │ lib.rs        │ File │   330 B │ 5 days ago
# =>  1 │ signature.rs  │ File │  1.2 KB │ 5 days ago
# =>  2 │ path.rs       │ File │  2.1 KB │ 5 days ago
# =>  3 │ files.rs      │ File │  4.6 KB │ 5 days ago
# =>  4 │ shapes.rs     │ File │  4.7 KB │ 5 days ago
# =>  5 │ lite_parse.rs │ File │  6.3 KB │ 5 days ago
# =>  6 │ parse.rs      │ File │ 49.8 KB │ 1 day ago
# => ───┴───────────────┴──────┴─────────┴────────────
```

비교할 수 있는 모든 열로 테이블을 정렬할 수 있습니다. 예를 들어, 위를 "name", "accessed" 또는 "modified" 열을 사용하여 정렬할 수도 있습니다.

정렬에 대한 자세한 내용은 [정렬](/book/sorting.md)을 참조하십시오.

## 원하는 데이터 선택

::: tip 참고
다음은 기본 개요입니다. 이 주제에 대한 자세한 내용은 [구조화된 데이터 탐색 및 액세스](/book/navigating_structured_data.md) 장을 참조하십시오.
:::

특정 열 또는 특정 행을 선택하여 테이블에서 데이터를 선택할 수 있습니다. 사용할 테이블에서 몇 개의 열을 [`select`](/commands/docs/select.md)해 보겠습니다.

```nu
ls | select name size
# => ───┬───────────────┬─────────
# =>  # │ name          │ size
# => ───┼───────────────┼─────────
# =>  0 │ files.rs      │  4.6 KB
# =>  1 │ lib.rs        │   330 B
# =>  2 │ lite_parse.rs │  6.3 KB
# =>  3 │ parse.rs      │ 49.8 KB
# =>  4 │ path.rs       │  2.1 KB
# =>  5 │ shapes.rs     │  4.7 KB
# =>  6 │ signature.rs  │  1.2 KB
# => ───┴───────────────┴─────────
```

이렇게 하면 필요한 것에 더 집중된 테이블을 만드는 데 도움이 됩니다. 다음으로, 이 디렉터리에서 가장 작은 5개의 파일만 보고 싶다고 가정해 보겠습니다.

```nu
ls | sort-by size | first 5
# => ───┬──────────────┬──────┬────────┬────────────
# =>  # │ name         │ type │ size   │ modified
# => ───┼──────────────┼──────┼────────┼────────────
# =>  0 │ lib.rs       │ File │  330 B │ 5 days ago
# =>  1 │ signature.rs │ File │ 1.2 KB │ 5 days ago
# =>  2 │ path.rs      │ File │ 2.1 KB │ 5 days ago
# =>  3 │ files.rs     │ File │ 4.6 KB │ 5 days ago
# =>  4 │ shapes.rs    │ File │ 4.7 KB │ 5 days ago
# => ───┴──────────────┴──────┴────────┴────────────
```

먼저 테이블을 크기별로 정렬하여 가장 작은 파일을 찾은 다음 `first 5`를 사용하여 테이블의 처음 5개 행을 반환하는 것을 알 수 있습니다.

원하지 않는 행을 [`skip`](/commands/docs/skip.md)할 수도 있습니다. 위에서 반환한 5개 행 중 처음 두 개를 건너뛰겠습니다.

```nu
ls | sort-by size | first 5 | skip 2
# => ───┬───────────┬──────┬────────┬────────────
# =>  # │ name      │ type │ size   │ modified
# => ───┼───────────┼──────┼────────┼────────────
# =>  0 │ path.rs   │ File │ 2.1 KB │ 5 days ago
# =>  1 │ files.rs  │ File │ 4.6 KB │ 5 days ago
# =>  2 │ shapes.rs │ File │ 4.7 KB │ 5 days ago
# => ───┴───────────┴──────┴────────┴────────────
```

우리가 관심 있는 세 개의 행으로 좁혔습니다.

데이터를 선택하는 몇 가지 다른 명령을 살펴보겠습니다. 테이블의 행이 왜 숫자인지 궁금했을 수 있습니다. 이것은 단일 행에 액세스하는 편리한 방법으로 작동합니다. 파일 이름으로 테이블을 정렬한 다음 [`select`](/commands/docs/select.md) 명령을 사용하여 행 번호로 행 중 하나를 선택해 보겠습니다.

```nu
ls | sort-by name
# => ───┬───────────────┬──────┬─────────┬────────────
# =>  # │ name          │ type │ size    │ modified
# => ───┼───────────────┼──────┼─────────┼────────────
# =>  0 │ files.rs      │ File │  4.6 KB │ 5 days ago
# =>  1 │ lib.rs        │ File │   330 B │ 5 days ago
# =>  2 │ lite_parse.rs │ File │  6.3 KB │ 5 days ago
# =>  3 │ parse.rs      │ File │ 49.8 KB │ 1 day ago
# =>  4 │ path.rs       │ File │  2.1 KB │ 5 days ago
# =>  5 │ shapes.rs     │ File │  4.7 KB │ 5 days ago
# =>  6 │ signature.rs  │ File │  1.2 KB │ 5 days ago
# => ───┴───────────────┴──────┴─────────┴────────────

ls | sort-by name | select 5
# => ───┬───────────────┬──────┬─────────┬────────────
# =>  # │ name          │ type │ size    │ modified
# => ───┼───────────────┼──────┼─────────┼────────────
# =>  0 │ shapes.rs     │ File │  4.7 KB │ 5 days ago
# => ───┴───────────────┴──────┴─────────┴────────────
```

## 테이블에서 데이터 가져오기

지금까지 필요한 것만으로 테이블을 잘라내어 테이블로 작업했습니다. 때로는 한 단계 더 나아가 전체 열을 가져오는 대신 셀 자체의 값만 보고 싶을 수 있습니다. 예를 들어, 파일 이름 목록만 가져오고 싶다고 가정해 보겠습니다. 이를 위해 [`get`](/commands/docs/get.md) 명령을 사용합니다.

```nu
ls | get name
# => ───┬───────────────
# =>  0 │ files.rs
# =>  1 │ lib.rs
# =>  2 │ lite_parse.rs
# =>  3 │ parse.rs
# =>  4 │ path.rs
# =>  5 │ shapes.rs
# =>  6 │ signature.rs
# => ───┴───────────────
```

이제 각 파일 이름에 대한 값을 얻었습니다.

이것은 이전에 본 [`select`](/commands/docs/select.md) 명령과 비슷해 보일 수 있으므로 두 가지를 비교하기 위해 여기에도 배치해 보겠습니다.

```nu
ls | select name
# => ───┬───────────────
# =>  # │ name
# => ───┼───────────────
# =>  0 │ files.rs
# =>  1 │ lib.rs
# =>  2 │ lite_parse.rs
# =>  3 │ parse.rs
# =>  4 │ path.rs
# =>  5 │ shapes.rs
# =>  6 │ signature.rs
# => ───┴───────────────
```

이것들은 매우 비슷해 보입니다! 이 두 명령의 차이점을 명확히 하기 위해 설명해 보겠습니다.

- [`select`](/commands/docs/select.md) - 지정된 열만 포함하는 새 테이블을 만듭니다.
- [`get`](/commands/docs/get.md) - 지정된 열 내부의 값을 목록으로 반환합니다.

:::tip
`select` 및 `get`에 제공된 인수는 Nu의 쿼리 언어의 기본 부분인 [셀 경로](/book/types_of_data.html#cell-paths)입니다. 셀 경로 및 기타 탐색 주제에 대한 자세한 내용은 다음 장인 [구조화된 데이터 탐색 및 액세스](/book/navigating_structured_data.md)를 참조하십시오.
:::

## 테이블의 데이터 변경

테이블에서 데이터를 선택하는 것 외에도 테이블에 있는 내용을 업데이트할 수도 있습니다. 테이블을 결합하거나, 새 열을 추가하거나, 셀의 내용을 편집하고 싶을 수 있습니다. Nu에서는 제자리에서 편집하는 대신 이 섹션의 각 명령이 파이프라인에서 새 테이블을 반환합니다.

### 테이블 연결

[`append`](/commands/docs/append.md)를 사용하여 테이블을 연결할 수 있습니다.

```nu
let first = [[a b]; [1 2]]
let second = [[a b]; [3 4]]
$first | append $second
# => ───┬───┬───
# =>  # │ a │ b
# => ───┼───┼───
# =>  0 │ 1 │ 2
# =>  1 │ 3 │ 4
# => ───┴───┴───
```

열 이름이 동일하지 않으면 필요에 따라 추가 열과 값이 생성됩니다.

```nu
let first = [[a b]; [1 2]]
let second = [[a b]; [3 4]]
let third = [[a c]; [3 4]]
$first | append $second | append $third
# => ───┬───┬────┬────
# =>  # │ a │ b  │ c
# => ───┼───┼────┼────
# =>  0 │ 1 │  2 │ ❎
# =>  1 │ 3 │  4 │ ❎
# =>  2 │ 3 │ ❎ │  4
# => ───┴───┴────┴────
```

`++` 연산자를 `append`의 인라인 대체로 사용할 수도 있습니다.

```nu
$first ++ $second ++ $third
# => ───┬───┬────┬────
# =>  # │ a │ b  │ c
# => ───┼───┼────┼────
# =>  0 │ 1 │  2 │ ❎
# =>  1 │ 3 │  4 │ ❎
# =>  2 │ 3 │ ❎ │  4
# => ───┴───┴────┴────
```

### 테이블 병합

[`merge`](/commands/docs/merge.md) 명령을 사용하여 두 개 이상의 테이블을 함께 병합할 수 있습니다.

```nu
let first = [[a b]; [1 2]]
let second = [[c d]; [3 4]]
$first | merge $second
# => ───┬───┬───┬───┬───
# =>  # │ a │ b │ c │ d
# => ───┼───┼───┼───┼───
# =>  0 │ 1 │ 2 │ 3 │ 4
# => ───┴───┴───┴───┴───
```

세 번째 테이블을 추가해 보겠습니다.

```nu
let third = [[e f]; [5 6]]
```

다음과 같이 세 테이블을 모두 함께 결합할 수 있습니다.

```nu
$first | merge $second  | merge $third
# => ───┬───┬───┬───┬───┬───┬───
# =>  # │ a │ b │ c │ d │ e │ f
# => ───┼───┼───┼───┼───┼───┼───
# =>  0 │ 1 │ 2 │ 3 │ 4 │ 5 │ 6
# => ───┴───┴───┴───┴───┴───┴───
```

또는 [`reduce`](/commands/docs/reduce.md) 명령을 사용하여 모든 테이블을 동적으로 병합할 수 있습니다.

```nu
[$first $second $third] | reduce {|elt, acc| $acc | merge $elt }
# => ───┬───┬───┬───┬───┬───┬───
# =>  # │ a │ b │ c │ d │ e │ f
# => ───┼───┼───┼───┼───┼───┼───
# =>  0 │ 1 │ 2 │ 3 │ 4 │ 5 │ 6
# => ───┴───┴───┴───┴───┴───┴───
```

### 새 열 추가

[`insert`](/commands/docs/insert.md) 명령을 사용하여 테이블에 새 열을 추가할 수 있습니다. 예를 살펴보겠습니다.

```nu
open rustfmt.toml
# => ─────────┬──────
# =>  edition │ 2018
# => ─────────┴──────
```

값이 2021인 "next_edition"이라는 열을 추가해 보겠습니다.

```nu
open rustfmt.toml | insert next_edition 2021
# => ──────────────┬──────
# =>  edition      │ 2018
# =>  next_edition │ 2021
# => ──────────────┴──────
```

이 시각적 표현은 약간 혼란스러울 수 있습니다. 왜냐하면 우리가 방금 한 일이 행을 추가한 것처럼 보이기 때문입니다. 이 경우 행에는 숫자가 있고 열에는 이름이 있다는 것을 기억하십시오. 그래도 혼란스럽다면 한 행을 더 추가하면 테이블이 예상대로 렌더링됩니다.

```nu
open rustfmt.toml | insert next_edition 2021 | append {edition: 2021 next_edition: 2024}
# => ───┬─────────┬──────────────
# =>  # │ edition │ next_edition
# => ───┼─────────┼──────────────
# =>  0 │    2018 │         2021
# =>  1 │    2021 │         2024
# => ───┴─────────┴──────────────
```

원본 파일을 열면 내용이 그대로 유지되는 것을 알 수 있습니다.

```nu
open rustfmt.toml
# => ─────────┬──────
# =>  edition │ 2018
# => ─────────┴──────
```

Nu의 변경 사항은 영구적인 변경을 유발하려고 시도하는 대신 값 자체에 대해 작동하는 기능적 변경입니다. 이를 통해 선택한 경우 원하는 변경 사항으로 결과를 쓸 준비가 될 때까지 파이프라인에서 다양한 유형의 작업을 수행할 수 있습니다. 여기서는 [`save`](/commands/docs/save.md) 명령을 사용하여 결과를 쓸 수 있습니다.

```nu
open rustfmt.toml | insert next_edition 2021 | save rustfmt2.toml
open rustfmt2.toml
# => ──────────────┬──────
# =>  edition      │ 2018
# =>  next_edition │ 2021
# => ──────────────┴──────
```

### 열 업데이트

[`insert`](/commands/docs/insert.md) 명령과 유사한 방식으로 [`update`](/commands/docs/update.md) 명령을 사용하여 열의 내용을 새 값으로 변경할 수도 있습니다. 작동하는 모습을 보려면 동일한 파일을 열어 보겠습니다.

```nu
open rustfmt.toml
# => ─────────┬──────
# =>  edition │ 2018
# => ─────────┴──────
```

그리고 이제 지원하려는 다음 버전을 가리키도록 버전을 업데이트해 보겠습니다.

```nu
open rustfmt.toml | update edition 2021
# => ─────────┬──────
# =>  edition │ 2021
# => ─────────┴──────
```

열이 이미 존재하는지 여부에 따라 [`upsert`](/commands/docs/upsert.md) 명령을 사용하여 삽입하거나 업데이트할 수도 있습니다.

### 열 이동

[`move`](/commands/docs/move.md)를 사용하여 테이블의 열을 이동할 수 있습니다. 예를 들어, [`ls`](/commands/docs/ls.md)에서 "name" 열을 "size" 열 뒤로 이동하려면 다음과 같이 할 수 있습니다.

```nu
ls | move name --after size
# => ╭────┬──────┬─────────┬───────────────────┬──────────────╮
# => │ #  │ type │  size   │       name        │   modified   │
# => ├────┼──────┼─────────┼───────────────────┼──────────────┤
# => │  0 │ dir  │   256 B │ Applications      │ 3 days ago   │
# => │  1 │ dir  │   256 B │ Data              │ 2 weeks ago  │
# => │  2 │ dir  │   448 B │ Desktop           │ 2 hours ago  │
# => │  3 │ dir  │   192 B │ Disks             │ a week ago   │
# => │  4 │ dir  │   416 B │ Documents         │ 4 days ago   │
# => ...
```

### 열 이름 바꾸기

rename 명령을 통해 테이블의 열 이름을 [`rename`](/commands/docs/rename.md)할 수도 있습니다. [`ls`](/commands/docs/ls.md)를 실행하고 열 이름을 바꾸려면 다음 예제를 사용할 수 있습니다.

```nu
ls | rename filename filetype filesize date
# => ╭────┬───────────────────┬──────────┬──────────┬──────────────╮
# => │ #  │     filename      │ filetype │ filesize │     date     │
# => ├────┼───────────────────┼──────────┼──────────┼──────────────┤
# => │  0 │ Applications      │ dir      │    256 B │ 3 days ago   │
# => │  1 │ Data              │ dir      │    256 B │ 2 weeks ago  │
# => │  2 │ Desktop           │ dir      │    448 B │ 2 hours ago  │
# => │  3 │ Disks             │ dir      │    192 B │ a week ago   │
# => │  4 │ Documents         │ dir      │    416 B │ 4 days ago   │
# => ...
```

### 열 거부/삭제

reject 명령을 통해 테이블의 열을 [`reject`](/commands/docs/reject.md)할 수도 있습니다. [`ls`](/commands/docs/ls.md)를 실행하고 열을 삭제하려면 다음 예제를 사용할 수 있습니다.

```nu
ls -l / | reject readonly num_links inode created accessed modified
# => ╭────┬────────┬─────────┬─────────┬───────────┬──────┬───────┬────────╮
# => │  # │  name  │  type   │ target  │   mode    │ uid  │ group │  size  │
# => ├────┼────────┼─────────┼─────────┼───────────┼──────┼───────┼────────┤
# => │  0 │ /bin   │ symlink │ usr/bin │ rwxrwxrwx │ root │ root  │    7 B │
# => │  1 │ /boot  │ dir     │         │ rwxr-xr-x │ root │ root  │ 1.0 KB │
# => │  2 │ /dev   │ dir     │         │ rwxr-xr-x │ root │ root  │ 4.1 KB │
# => │  3 │ /etc   │ dir     │         │ rwxr-xr-x │ root │ root  │ 3.6 KB │
# => │  4 │ /home  │ dir     │         │ rwxr-xr-x │ root │ root  │   12 B │
# => │  5 │ /lib   │ symlink │ usr/lib │ rwxrwxrwx │ root │ root  │    7 B │
# => │  6 │ /lib64 │ symlink │ usr/lib │ rwxrwxrwx │ root │ root  │    7 B │
# => │  7 │ /mnt   │ dir     │         │ rwxr-xr-x │ root │ root  │    0 B │
# => ...
```

### # 인덱스 열

모든 테이블은 기본적으로 `#` 헤더가 있는 열로 시작한다는 것을 알 수 있습니다. 이 열은 두 가지 모드 중 하나로 작동할 수 있습니다.

1. 내부 #

   - 기본 모드
   - 누셸은 0부터 시작하는 연속적인 인덱스를 제공합니다.
   - 항상 셀 경로 행 번호에 해당하며, `select 0`은 목록의 첫 번째 항목을 반환하고 `select <n-1>`은 n번째 항목을 반환합니다.
   - 내부 표현의 표시일 뿐입니다. 즉, 열 이름으로 액세스할 수 없습니다. 예를 들어 `get index`는 작동하지 않으며 `get #`도 작동하지 않습니다.

1. "인덱스"로 이름이 바뀐 #

   - "index"라는 이름의 열이 직접 또는 다른 명령의 부작용으로 생성되면 이 `index` 열이 테이블 디스플레이에서 `#` 열을 대신합니다. 테이블 출력에서 열 헤더는 여전히 `#`이지만 열의 _이름_은 이제 `index`입니다.

     예시:

     ```nu
     ls | each { insert index { 1000 }} | first 5
     # => ╭──────┬─────────────────┬──────┬─────────┬──────────────╮
     # => │    # │      name       │ type │  size   │   modified   │
     # => ├──────┼─────────────────┼──────┼─────────┼──────────────┤
     # => │ 1000 │ CNAME           │ file │    15 B │ 9 months ago │
     # => │ 1000 │ CONTRIBUTING.md │ file │ 4.3 KiB │ 9 hours ago  │
     # => │ 1000 │ LICENSE         │ file │ 1.0 KiB │ 9 months ago │
     # => │ 1000 │ README.md       │ file │ 2.2 KiB │ 3 weeks ago  │
     # => │ 1000 │ assets          │ dir  │ 4.0 KiB │ 9 months ago │
     # => ╰──────┴─────────────────┴──────┴─────────┴──────────────╯
     ```

     - 테이블의 각 행에 `index` 키가 추가되면 `select` 및 `get`을 통해 액세스할 수 있습니다.

     ```nu
     ls | each { insert index { 1000 }} | first 5 | select index name
     # => ╭──────┬─────────────────╮
     # => │    # │      name       │
     # => ├──────┼─────────────────┤
     # => │ 1000 │ CNAME           │
     # => │ 1000 │ CONTRIBUTING.md │
     # => │ 1000 │ LICENSE         │
     # => │ 1000 │ README.md       │
     # => │ 1000 │ assets          │
     # => ╰──────┴─────────────────╯
     ```

     - 반면에 일부 행에 `index` 키가 있고 다른 행에는 없는 경우 결과는 더 이상 테이블이 아닙니다. 다른 레코드 유형으로 인해 `list<any>`입니다.

       ```nu
       ls | upsert 3.index { "--->" } | first 5
       # => ╭──────┬─────────────────┬──────┬─────────┬──────────────╮
       # => │    # │      name       │ type │  size   │   modified   │
       # => ├──────┼─────────────────┼──────┼─────────┼──────────────┤
       # => │    0 │ CNAME           │ file │    15 B │ 9 months ago │
       # => │    1 │ CONTRIBUTING.md │ file │ 4.3 KiB │ 9 hours ago  │
       # => │    2 │ LICENSE         │ file │ 1.0 KiB │ 9 months ago │
       # => │ ---> │ README.md       │ file │ 2.2 KiB │ 3 weeks ago  │
       # => │    4 │ assets          │ dir  │ 4.0 KiB │ 9 months ago │
       # => ╰──────┴─────────────────┴──────┴─────────┴──────────────╯

       ls | upsert 3.index { "--->" } | first 5 | describe
       # => list<any> (stream)

       ls | upsert 3.index { "--->" } | select index name
       # Error: cannot find column 'index'

       ls | upsert 3.index { "--->" } | select index? name | first 5
       # => ╭──────┬─────────────────╮
       # => │    # │      name       │
       # => ├──────┼─────────────────┤
       # => │      │ CNAME           │
       # => │      │ CONTRIBUTING.md │
       # => │      │ LICENSE         │
       # => │ ---> │ README.md       │
       # => │      │ assets          │
       # => ╰──────┴─────────────────╯
       ```

   - 위 예제에서 보여주듯이 `index` 키가 없는 테이블의 모든 행(레코드)은 내부 표현을 계속 표시합니다.

#### 추가 인덱스 예제

##### #을 인덱스로 변환

내부 `#`을 모든 행의 인덱스로 변환하고 원래 번호 매기기를 유지하는 유용한 패턴은 다음과 같습니다.

```nu
ls | enumerate | flatten
```

결과는 동일하게 _보이지만_ `index`는 이제 내부 셀 경로와 분리됩니다. 예시:

```nu
ls | enumerate | flatten | sort-by modified | first 5
# => ╭────┬──────────────┬──────┬─────────┬──────────────╮
# => │  # │     name     │ type │  size   │   modified   │
# => ├────┼──────────────┼──────┼─────────┼──────────────┤
# => │  0 │ CNAME        │ file │    15 B │ 9 months ago │
# => │  2 │ LICENSE      │ file │ 1.0 KiB │ 9 months ago │
# => │  4 │ assets       │ dir  │ 4.0 KiB │ 9 months ago │
# => │ 17 │ lefthook.yml │ file │ 1.1 KiB │ 9 months ago │
# => │ 24 │ snippets     │ dir  │ 4.0 KiB │ 9 months ago │
# => ╰────┴──────────────┴──────┴─────────┴──────────────╯

ls | enumerate | flatten | sort-by modified | select 4
# => ╭────┬──────────┬──────┬─────────┬──────────────╮
# => │  # │   name   │ type │  size   │   modified   │
# => ├────┼──────────┼──────┼─────────┼──────────────┤
# => │ 24 │ snippets │ dir  │ 4.0 KiB │ 9 months ago │
# => ╰────┴──────────┴──────┴─────────┴──────────────╯
```

`sort-by modified`는 이제 나머지 열과 함께 `index`도 정렬합니다.

##### 행 헤더 추가

```nu
let table = [
[additions   deletions   delta ];
[       10          20     -10 ]
[       15           5      10 ]
[        8           6       2 ]]

let totals_row = ($table | math sum | insert index {"Totals"})
$table | append $totals_row
# => ╭────────┬───────────┬───────────┬───────╮
# => │      # │ additions │ deletions │ delta │
# => ├────────┼───────────┼───────────┼───────┤
# => │      0 │        10 │        20 │   -10 │
# => │      1 │        15 │         5 │    10 │
# => │      2 │         8 │         6 │     2 │
# => │ Totals │        33 │        31 │     2 │
# => ╰────────┴───────────┴───────────┴───────╯
```

### `table` 명령

[`table`](/commands/docs/table.md) 명령은 구조화된 데이터를 _렌더링_하는 데 사용됩니다. 여기에는 다음이 포함됩니다.

- 테이블
- 목록
- 레코드
- 범위

초기 가정과는 달리 이러한 유형을 렌더링한 결과는 `string`입니다. 예시:

```nu
[ Nagasaki Ghent Cambridge Izmir Graz Lubango ] | table | describe
# => string (stream)
```

다른 데이터 유형은 `table` 명령을 통해 변경되지 않고 전달됩니다.

인수가 없는 경우 `table` 명령에서 렌더링된 출력은 렌더링되지 않은 형식과 동일하게 _표시_되는 경우가 많습니다. 예시:

```nu
[ Nagasaki Ghent Cambridge Izmir Graz Lubango ]
# => ╭───┬───────────╮
# => │ 0 │ Nagasaki  │
# => │ 1 │ Ghent     │
# => │ 2 │ Cambridge │
# => │ 3 │ Izmir     │
# => │ 4 │ Graz      │
# => │ 5 │ Lubango   │
# => ╰───┴───────────╯
[ Nagasaki Ghent Cambridge Izmir Graz Lubango ] | table
# => ╭───┬───────────╮
# => │ 0 │ Nagasaki  │
# => │ 1 │ Ghent     │
# => │ 2 │ Cambridge │
# => │ 3 │ Izmir     │
# => │ 4 │ Graz      │
# => │ 5 │ Lubango   │
# => ╰───┴───────────╯
```

이것은 구조화된 데이터의 렌더링된 뷰를 문자열로 저장해야 할 때 유용할 수 있습니다. 예를 들어, 테이블에서 모든 ANSI 서식(색상)을 제거하려면:

```nu
ls | table | ansi strip
```

`table` 명령에는 테이블 렌더링을 _변경_하기 위한 여러 옵션도 있습니다. 예:

- `-e`를 사용하여 렌더링할 때 일반적으로 축소되는 데이터를 확장합니다. `scope modules | table`과 `scope modules | table -e`를 비교하십시오.
- `-i false`를 사용하여 `index`/`#` 열을 숨깁니다.
- `-a 5`를 사용하여 테이블을 처음 5개 항목과 마지막 5개 항목으로 축약합니다.
- 그리고 더
