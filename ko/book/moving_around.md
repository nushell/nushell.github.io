# 시스템 이동

셸의 특징은 파일 시스템을 탐색하고 상호 작용하는 기능입니다. 물론 누셸도 예외는 아닙니다. 다음은 파일 시스템과 상호 작용할 때 사용할 수 있는 몇 가지 일반적인 명령입니다.

## 디렉터리 내용 보기

```nu
ls
```

빠른 둘러보기에서 보았듯이 [`ls`](/commands/docs/ls.md) 명령은 디렉터리의 내용을 반환합니다. 누셸의 `ls`는 내용을 [테이블](types_of_data.html#tables)로 반환합니다.

[`ls`](/commands/docs/ls.md) 명령은 보고 싶은 것을 변경하기 위해 선택적 인수를 받기도 합니다. 예를 들어, ".md"로 끝나는 파일을 나열할 수 있습니다.

```nu
ls *.md
# => ╭───┬────────────────────┬──────┬──────────┬──────────────╮
# => │ # │        name        │ type │   size   │   modified   │
# => ├───┼────────────────────┼──────┼──────────┼──────────────┤
# => │ 0 │ CODE_OF_CONDUCT.md │ file │  3.4 KiB │ 9 months ago │
# => │ 1 │ CONTRIBUTING.md    │ file │ 11.0 KiB │ 5 months ago │
# => │ 2 │ README.md          │ file │ 12.0 KiB │ 6 days ago   │
# => │ 3 │ SECURITY.md        │ file │  2.6 KiB │ 2 months ago │
# => ╰───┴────────────────────┴──────┴──────────┴──────────────╯
```

## Glob 패턴 (와일드카드)

위 선택적 인수 `*.md`의 별표(`*`)는 와일드카드 또는 glob라고도 합니다. 무엇이든 일치시킬 수 있습니다. 이 glob `*.md`를 _"'.md'로 끝나는 모든 파일 이름과 일치"_라고 읽을 수 있습니다.

가장 일반적인 glob는 모든 경로와 일치하는 `*`입니다. 더 자주 `*.bak` 및 `temp*`와 같은 다른 패턴의 일부로 이 패턴을 볼 수 있습니다.

누셸은 다른 디렉터리 내에 중첩된 경로를 순회하는 이중 `*`도 지원합니다. 예를 들어, `ls **/*`는 현재 디렉터리 아래에 중첩된 모든 숨겨지지 않은 경로를 나열합니다.

```nu
ls **/*.md
# => ╭───┬───────────────────────────────┬──────┬──────────┬──────────────╮
# => │ # │             name              │ type │   size   │   modified   │
# => ├───┼───────────────────────────────┼──────┼──────────┼──────────────┤
# => │ 0 │ CODE_OF_CONDUCT.md            │ file │  3.4 KiB │ 5 months ago │
# => │ 1 │ CONTRIBUTING.md               │ file │ 11.0 KiB │ a month ago  │
# => │ 2 │ README.md                     │ file │ 12.0 KiB │ a month ago  │
# => │ 3 │ SECURITY.md                   │ file │  2.6 KiB │ 5 hours ago  │
# => │ 4 │ benches/README.md             │ file │    249 B │ 2 months ago │
# => │ 5 │ crates/README.md              │ file │    795 B │ 5 months ago │
# => │ 6 │ crates/nu-cli/README.md       │ file │    388 B │ 5 hours ago  │
# => │ 7 │ crates/nu-cmd-base/README.md  │ file │    262 B │ 5 hours ago  │
# => │ 8 │ crates/nu-cmd-extra/README.md │ file │    669 B │ 2 months ago │
# => │ 9 │ crates/nu-cmd-lang/README.md  │ file │  1.5 KiB │ a month ago  │
# => ╰───┴───────────────────────────────┴──────┴──────────┴──────────────╯
```

여기서는 ".md"로 끝나는 모든 파일을 찾고 있습니다. 이중 별표는 _"여기서부터 시작하는 모든 디렉터리에서"_를 추가로 지정합니다.

누셸의 glob 구문은 `*`뿐만 아니라 [`?`로 단일 문자 일치 및 `[...]`로 문자 그룹 일치](https://docs.rs/nu-glob/latest/nu_glob/struct.Pattern.html)도 지원합니다.

`*`, `?` 및 `[]` 패턴을 이스케이프하는 것은 작은따옴표, 큰따옴표 또는
[원시 문자열](working_with_strings.md#raw-strings)로 묶어서 작동합니다. 예를 들어, `[slug]`라는 디렉터리의 내용을 표시하려면 `ls "[slug]"` 또는 `ls '[slug]'`를 사용하십시오.

그러나 _백틱_으로 묶인 문자열은 glob를 이스케이프하지 않습니다. 예를 들어 다음 시나리오를 비교해 보십시오.

1. 따옴표 없음: Glob 패턴

   glob 문자가 있는 따옴표 없는 [일반 단어 문자열](working_with_strings.html#bare-word-strings)은 glob 패턴으로 해석되므로 다음은 현재 디렉터리에서 파일 이름의 일부로 `myfile`을 포함하는 모든 파일을 제거합니다.

   ```nu
   rm *myfile*
   ```

2. 따옴표: 별표가 있는 문자열 리터럴

   작은따옴표나 큰따옴표로 묶거나 [원시 문자열](working_with_strings.html#raw-strings)을 사용할 때 리터럴, 이스케이프된 별표(또는 기타 glob 문자)가 있는 _문자열_이 명령에 전달됩니다. 결과는 glob가 아닙니다. 다음 명령은 문자 그대로 `*myfile*`(별표 포함)라는 이름의 파일만 제거합니다. 이름에 `myfile`이 있는 다른 파일은 영향을 받지 않습니다.

   ```nu
   rm "*myfile*"
   ```

3. 백틱으로 묶음: Glob 패턴

   [백틱으로 묶인 문자열](working_with_strings.html#backtick-quoted-strings) 내의 별표(및 기타 glob 패턴)는 glob 패턴으로 해석됩니다. 이것은 위의 #1의 일반 단어 문자열 예제와 동일한 동작입니다.

   다음은 해당 첫 번째 예제와 마찬가지로 현재 디렉터리에서 파일 이름의 일부로 `myfile`을 포함하는 모든 파일을 제거합니다.

   ```nu
   rm `*myfile*`
   ```

::: tip
누셸에는 더 복잡한 glob 시나리오를 지원하는 전용 [`glob` 명령](https://www.nushell.sh/commands/docs/glob.html)도 포함되어 있습니다.
:::

### 문자열을 Glob로 변환

위의 따옴표 기법은 glob 리터럴을 구성할 때 유용하지만 프로그래밍 방식으로 glob를 구성해야 할 수도 있습니다. 이 목적을 위해 사용할 수 있는 몇 가지 기법이 있습니다.

1. `into glob`

   [`into glob` 명령](/commands/docs/into_glob.html)을 사용하여 문자열(및 기타 유형)을 glob로 변환할 수 있습니다. 예시:

   ```nu
   # YYYY-mm 형식으로 현재 월을 포함하는 파일 찾기
   let current_month = (date now | format date '%Y-%m')
   let glob_pattern = ($"*($current_month)*" | into glob)
   ls $glob_pattern
   ```

2. [`glob` 명령](/commands/docs/glob.html)과 결합된 스프레드 연산자:

   [`glob` 명령](/commands/docs/glob.html)(참고: `into glob`와 동일하지 않음)은 glob 패턴과 일치하는 파일 이름의 [`list`](types_of_data.html#lists)를 생성합니다. 이 목록은 [스프레드 연산자](operators.html#spread-operator)를 사용하여 확장하고 파일 시스템 명령에 전달할 수 있습니다.

   ```nu
   # YYYY-mm 형식으로 현재 월을 포함하는 파일 찾기
   let current_month = (date now | format date '%Y-%m')
   ls ...(glob $"*($current_month)*")
   ```

3. 주석을 통해 `glob` 유형 강제:

   ```nu
   # YYYY-mm 형식으로 현재 월을 포함하는 파일 찾기
   let current_month = (date now | format date '%Y-%m')
   let glob_pattern: glob = ($"*($current_month)*")
   ls $glob_pattern
   ```

## 디렉터리 만들기

대부분의 다른 셸과 마찬가지로 [`mkdir` 명령](/commands/docs/mkdir.md)은 새 디렉터리를 만드는 데 사용됩니다. 한 가지 미묘한 차이점은 누셸의 내부 `mkdir` 명령이 기본적으로 Unix/Linux `mkdir -p`처럼 작동한다는 것입니다.

- 여러 디렉터리 수준을 자동으로 만듭니다. 예시:

  ```nu
  mkdir modules/my/new_module
  ```

  이렇게 하면 현재 존재하지 않더라도 세 개의 디렉터리가 모두 생성됩니다. Linux/Unix에서는 `mkdir -p`가 필요합니다.

- 디렉터리가 이미 있는 경우 오류가 발생하지 않습니다. 예시:

  ```nu
  mkdir modules/my/new_module
  mkdir modules/my/new_module
  # => 오류 없음
  ```

  ::: tip
  누셸에 올 때 흔히 저지르는 실수는 네이티브 Linux/Unix 버전처럼 `mkdir -p <directory>`를 사용하려고 시도하는 것입니다. 그러나 이렇게 하면 누셸에서 `알 수 없는 플래그` 오류가 발생합니다.

  동일한 효과를 얻으려면 `-p` 없이 명령을 반복하기만 하면 됩니다.
  :::

## 현재 디렉터리 변경

```nu
cd cookbook
```

현재 디렉터리에서 새 디렉터리로 변경하려면 [`cd`](/commands/docs/cd.md) 명령을 사용하십시오.

[`cd`](/commands/docs/cd.md)가 생략되고 경로 자체만 지정된 경우에도 현재 작업 디렉터리를 변경할 수 있습니다.

```nu
cookbook/
```

다른 셸과 마찬가지로 디렉터리 이름을 사용하거나 디렉터리 위로 이동하려면 `..` 바로 가기를 사용할 수 있습니다.

추가 디렉터리 수준으로 이동하려면 추가 점을 추가할 수도 있습니다.

```nu
# 부모 디렉터리로 변경
cd ..
# 또는
..
# 두 수준 위로 이동(부모의 부모)
cd ...
# 또는
...
# 세 수준 위로 이동(부모의 부모의 부모)
cd ....
# 등
```

::: tip
여러 점 바로 가기는 내부 누셸 [파일 시스템 명령](/commands/categories/filesystem.html)과 외부 명령 모두에서 사용할 수 있습니다. 예를 들어 Linux/Unix 시스템에서 `^stat ....`를 실행하면 경로가 `../../..`로 확장되는 것을 볼 수 있습니다.
:::

상대 디렉터리 수준을 디렉터리 이름과 결합할 수도 있습니다.

```nu
cd ../sibling
```

::: tip 중요 팁
[`cd`](/commands/docs/cd.md)로 디렉터리를 변경하면 `PWD` 환경 변수가 변경됩니다. 즉, 디렉터리 변경은 현재 범위(예: 블록 또는 클로저)에 유지됩니다. 블록을 종료하면 이전 디렉터리로 돌아갑니다. 이에 대한 자세한 내용은 [환경](./environment.md) 장에서 확인할 수 있습니다.
:::

## 파일 시스템 명령

Nu는 또한 다음과 같은 크로스 플랫폼에서 작동하는 몇 가지 기본 [파일 시스템 명령](/commands/categories/filesystem.html)을 제공합니다.

- [`mv`](/commands/docs/mv.md) 파일 또는 디렉터리를 새 위치로 이름 바꾸거나 이동합니다.
- [`cp`](/commands/docs/cp.md) 항목을 새 위치로 복사합니다.
- [`rm`](/commands/docs/rm.md) 파일 시스템에서 항목을 제거합니다.

::: tip 참고
Bash 및 기타 많은 셸에서 대부분의 파일 시스템 명령(`cd` 제외)은 실제로 시스템의 별도 바이너리입니다. 예를 들어 Linux 시스템에서 `cp`는 `/usr/bin/cp` 바이너리입니다. 누셸에서 이러한 명령은 기본 제공됩니다. 여기에는 몇 가지 장점이 있습니다.

- 바이너리 버전을 사용할 수 없는 플랫폼(예: Windows)에서 일관되게 작동합니다. 이를 통해 크로스 플랫폼 스크립트, 모듈 및 사용자 지정 명령을 만들 수 있습니다.
- 누셸과 더 긴밀하게 통합되어 누셸 유형 및 기타 구문을 이해할 수 있습니다.
- [빠른 둘러보기](quick_tour.html)에서 언급했듯이 누셸 도움말 시스템에 문서화되어 있습니다. `help <command>` 또는 `<command> --help`를 실행하면 명령에 대한 누셸 설명서가 표시됩니다.

누셸 기본 제공 버전을 사용하는 것이 일반적으로 권장되지만 Linux 바이너리에 액세스할 수 있습니다. 자세한 내용은 [시스템 명령 실행](./running_externals.md)을 참조하십시오.

[end of ko/book/moving_around.md]
