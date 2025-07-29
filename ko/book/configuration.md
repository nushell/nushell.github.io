---
prev:
  text: 셸로서의 Nu
  link: /book/nu_as_a_shell.md
---
# 구성

## 빠른 시작

누셸은 시작 및 구성을 관리하기 위한 많은 옵션을 제공하지만, 새로운 사용자는 몇 가지 간단한 단계만으로 시작할 수 있습니다.

1. 누셸에게 사용할 편집기를 알려줍니다.

   ```nu
   $env.config.buffer_editor = <선호하는 편집기 경로>
   ```

   예시:

   ```nu
   $env.config.buffer_editor = "code"
   # 또는
   $env.config.buffer_editor = "nano"
   # 또는
   $env.config.buffer_editor = "hx"
   # 또는
   $env.config.buffer_editor = "vi"
   # 인수가 있는 경우
   $env.config.buffer_editor = ["emacsclient", "-s", "light", "-t"]
   # 등
   ```

2. 다음을 사용하여 `config.nu`를 편집합니다.

   ```nu
   config nu
   ```

   그러면 위에서 정의한 편집기에서 현재 `config.nu`가 열립니다.

3. 누셸이 시작될 때마다 실행되어야 하는 명령을 이 파일에 추가합니다. 좋은 첫 번째 예는 위의 `buffer_editor` 설정일 수 있습니다.

   다음을 사용하여 사용 가능한 설정의 자세한 목록을 찾을 수 있습니다.

   ```nu
    config nu --doc | nu-highlight | less -R
   ```

4. 설정을 저장하고 편집기를 종료한 다음 새 누셸 세션을 시작하여 이러한 설정을 로드합니다.

이것이 전부입니다! 필요할 때 더 자세한 내용은 아래에 있습니다...

---

[[toc]]

::: tip
누셸 내에서 이 문서의 단순화된 버전을 보려면 다음을 실행하십시오.

```nu
config nu --doc | nu-highlight | less -R
```

:::

## 구성 개요

누셸은 여러 개의 선택적 구성 파일을 사용합니다. 이러한 파일은 다음 순서로 로드됩니다.

1. 로드되는 첫 번째 파일은 `env.nu`이며, 역사적으로 환경 변수를 재정의하는 데 사용되었습니다. 그러나 현재 "모범 사례" 권장 사항은 아래의 자동 로드 디렉터리와 `config.nu`를 사용하여 모든 환경 변수(및 기타 구성)를 설정하는 것입니다.

2. `config.nu`는 일반적으로 기본 누셸 설정을 재정의하거나, 사용자 지정 명령을 정의(또는 가져오기)하거나, 다른 시작 작업을 실행하는 데 사용됩니다.
3. `$nu.vendor-autoload-dirs`의 `*.nu` 파일이 로드됩니다. 이러한 디렉터리는 공급업체 및 패키지 관리자의 시작 파일을 위한 것입니다.
4. `$nu.user-autoload-dirs`의 `*.nu` 파일이 로드됩니다. 이러한 파일은 모든 시작 작업에 사용할 수 있으며 구성을 모듈화하는 좋은 방법입니다.
5. `login.nu`는 누셸이 로그인 셸로 실행될 때만 수행되어야 하는 명령을 실행하거나 구성을 처리합니다.

기본적으로 `env.nu`, `config.nu` 및 `login.nu`는 `$nu.default-config-dir` 디렉터리에서 읽습니다. 예시:

```nu
$nu.default-config-dir
# macOS
# => /Users/me/Library/Application Support/nushell
# Linux
# => /home/me/.config/nushell
# Windows
# => C:\Users\me\AppData\Roaming\nushell
```

누셸이 처음 시작되면 구성 디렉터리와 비어 있는(주석 제외) `env.nu` 및 `config.nu`를 생성합니다.

::: tip
`config nu` 명령을 사용하여 기본 텍스트 편집기에서 `config.nu`를 빠르게 열 수 있습니다. 마찬가지로 `config env` 명령은 `env.nu`를 엽니다.

이를 위해서는 다음 중 하나를 사용하여 기본 편집기를 구성해야 합니다.

- 누셸의 `$env.config.buffer_editor` 설정
- `$env.VISUAL` 또는 `$env.EDITOR` 환경 변수

예를 들어, Visual Studio Code에서 파일을 편집하려면 `config.nu`에 다음을 배치하십시오.

```nu
$env.config.buffer_editor = 'code'
```

:::

## `config.nu`의 일반적인 구성 작업:

::: tip
일부 사용자는 한 곳에 대부분 또는 모든 시작 작업이 있는 "모놀리식" 구성 파일을 선호합니다. `config.nu`는 이 목적으로 사용할 수 있습니다.

다른 사용자는 각 파일이 더 작고 집중된 작업 집합을 처리하는 "모듈식" 구성을 선호할 수 있습니다. 자동 로드 디렉터리의 파일은 이러한 경험을 만드는 데 사용할 수 있습니다.
:::

`config.nu`는 일반적으로 다음을 위해 사용됩니다.

- 누셸 및 기타 응용 프로그램에 대한 [환경 변수 설정](#set-environment-variables)
- [`$env.config`](#nushell-settings-in-the-envconfig-record)에서 누셸 설정
- 모듈 또는 소스 파일을 로드하여 해당 명령을 쉽게 사용할 수 있도록 함
- 시작 시 다른 응용 프로그램이나 명령 실행

## 환경 변수 설정

::: tip 참조
[환경](./environment.md) 장에서는 환경 변수를 설정하고 액세스하는 방법에 대한 추가 정보를 다룹니다.
:::

### 경로 구성

대부분의 셸과 마찬가지로 누셸은 `PATH`(또는 변형)라는 환경 변수를 검색합니다.

:::tip
일부 셸과 달리 누셸은 환경 변수에 대해 "대소문자를 구분하지 않으려고" 합니다. `Path`, `path`, `PATH` 및 `pAtH`는 모두 동일한 환경 변수의 허용되는 변형입니다. 자세한 내용은 [환경 - 대소문자 구분](./environment.md#case-sensitivity)을 참조하십시오.
:::

누셸이 시작되면 일반적으로 `PATH`를 문자열로 상속합니다. 그러나 누셸은 쉽게 액세스할 수 있도록 이를 자동으로 누셸 목록으로 변환합니다. 즉, 예를 들어 다음을 사용하여 경로에 _추가_할 수 있습니다.

```nu
$env.path ++= ["~/.local/bin"]
```

표준 라이브러리에는 도우미 명령도 포함되어 있습니다. 기본 `path add` 동작은 경로의 나머지 부분보다 우선 순위가 높도록 디렉터리를 _앞에 추가_하는 것입니다. 예를 들어, 다음을 시작 구성에 추가할 수 있습니다.

```nu
use std/util "path add"
path add "~/.local/bin"
path add ($env.CARGO_HOME | path join "bin")
```

::: tip
위 예제에서 `path join`의 사용에 주목하십시오. 이 명령은 경로 구분 기호의 존재 여부에 관계없이 두 경로 구성 요소를 올바르게 결합합니다. 이 범주의 더 많은 명령은 `help path`를 참조하십시오.
:::

### 프롬프트 구성

누셸은 여러 프롬프트 구성 옵션을 제공합니다. 기본적으로 누셸에는 다음이 포함됩니다.

- 홈 디렉터리인 경우(또는 그 아래에 있는 경우) `~`를 사용하여 축약된 현재 디렉터리를 포함하는 프롬프트.
- 프롬프트 바로 오른쪽에 나타나는 프롬프트 표시기. 일반 편집 모드에서는 기본적으로 `> `이 되고, Vi 삽입 모드에서는 `: `가 됩니다. 명령과 프롬프트를 구분하기 위해 문자 뒤에 추가 공백을 참고하십시오.
- 날짜와 시간이 있는 오른쪽 프롬프트
- 현재 명령줄이 여러 줄에 걸쳐 있을 때 표시되는 표시기 - 기본적으로 `::: `

이러한 프롬프트 구성 요소를 제어하는 환경 변수는 다음과 같습니다.

- `$env.PROMPT_COMMAND`: 프롬프트 자체
- `$env.PROMPT_COMMAND_RIGHT`: 터미널 오른쪽에 나타날 수 있는 프롬프트
- `$env.PROMPT_INDICATOR`: Emacs 모드 표시기
- `$env.PROMPT_INDICATOR_VI_NORMAL`: Vi-normal 모드 표시기
- `$env.PROMPT_INDICATOR_VI_INSERT`: Vi-insert 모드 표시기
- `$env.PROMPT_MULTILINE_INDICATOR`: 여러 줄 표시기

이러한 각 변수는 다음 중 하나를 허용합니다.

- 문자열, 이 경우 구성 요소는 해당 문자열로 정적으로 표시됩니다.
- 클로저(매개변수 없음), 이 경우 구성 요소는 클로저의 코드를 기반으로 동적으로 표시됩니다.
- `null`, 이 경우 구성 요소는 내부 기본값으로 되돌아갑니다.

::: tip
예를 들어 오른쪽 프롬프트를 비활성화하려면 시작 구성에 다음을 추가하십시오.

```nu
$env.PROMPT_COMMAND_RIGHT = ""
# 또는
$env.PROMPT_COMMAND_RIGHT = {||}
```

:::

#### 임시 프롬프트

누셸은 또한 명령줄이 실행된 _후에_ 다른 프롬프트를 표시할 수 있는 임시 프롬프트를 지원합니다. 이는 여러 상황에서 유용할 수 있습니다.

- 여러 줄 프롬프트를 사용하는 경우 임시 프롬프트는 더 압축된 버전일 수 있습니다.
- 임시 여러 줄 표시기와 오른쪽 프롬프트를 제거하면 터미널에서 복사하는 것이 간단해질 수 있습니다.

위의 일반 프롬프트 명령과 마찬가지로 각 임시 프롬프트는 (정적) 문자열, (동적) 클로저 또는 누셸 내부 기본값을 사용하기 위한 `null`을 허용할 수 있습니다.

임시 프롬프트 구성 요소를 제어하는 환경 변수는 다음과 같습니다.

- `$env.TRANSIENT_PROMPT_COMMAND`: 명령줄이 실행된 후의 프롬프트 자체
- `$env.TRANSIENT_PROMPT_COMMAND_RIGHT`: 터미널 오른쪽에 나타날 수 있는 프롬프트
- `$env.TRANSIENT_PROMPT_INDICATOR`: Emacs 모드 표시기
- `$env.TRANSIENT_PROMPT_INDICATOR_VI_NORMAL`: Vi-normal 모드 표시기
- `$env.TRANSIENT_PROMPT_INDICATOR_VI_INSERT`: Vi-insert 모드 표시기
- `$env.TRANSIENT_PROMPT_MULTILINE_INDICATOR`: 여러 줄 표시기

::: tip
누셸은 `TRANSIENT_PROMPT_COMMAND_RIGHT` 및 `TRANSIENT_PROMPT_MULTILINE_INDICATOR`를 빈 문자열(`""`)로 설정하여 이전 명령이 입력된 후 각 항목이 사라지도록 합니다. 이렇게 하면 터미널에서 복사 및 붙여넣기가 간단해집니다.

이 기능을 비활성화하고 항상 해당 항목을 표시하려면 다음을 설정하십시오.

```nu
$env.TRANSIENT_PROMPT_COMMAND_RIGHT = null
$env.TRANSIENT_PROMPT_MULTILINE_INDICATOR = null
```

:::

### ENV_CONVERSIONS

여러 경로를 포함하는 변수와 같은 특정 변수는 종종 다른 셸에서 콜론으로 구분된 문자열로 저장됩니다. 누셸은 이를 자동으로 더 편리한 누셸 목록으로 변환할 수 있습니다. ENV_CONVERSIONS 변수는 환경 변수가 다음과 같이 변환되는 방법을 지정합니다.

- 누셸 시작 시 문자열에서 값으로 변환(from_string)
- 외부 명령을 실행할 때 값에서 문자열로 다시 변환(to_string)

`ENV_CONVERSIONS`는 레코드이며, 여기서:

- 각 키는 변환할 환경 변수입니다.
- 각 값은 다음을 포함하는 또 다른 레코드입니다.
  ```nu
  {
    from_string: <클로저>
    to_string: <클로저>
  }
  ```

::: tip
위에서 언급했듯이 OS 경로 변수는 누셸에 의해 자동으로 변환됩니다. 결과적으로 `ENV_CONVERSIONS`에 있을 필요 없이 시작 구성 내에서 목록으로 처리될 수 있습니다. `XDG_DATA_DIRS`와 같은 다른 콜론으로 구분된 경로는 자동으로 변환되지 않습니다.
:::

추가 변환을 추가하려면 `$env.ENV_CONVERSIONS` 레코드에 [`merge`](/commands/docs/merge.md)하십시오. 예를 들어, `XDG_DATA_DIRS` 변수에 대한 변환을 추가하려면 다음을 수행하십시오.

```nu
$env.ENV_CONVERSIONS = $env.ENV_CONVERSIONS | merge {
    "XDG_DATA_DIRS": {
        from_string: {|s| $s | split row (char esep) | path expand --no-symlink }
        to_string: {|v| $v | path expand --no-symlink | str join (char esep) }
    }
}
```

### `LS_COLORS`

많은 `ls`와 유사한 유틸리티와 마찬가지로 누셸의 디렉터리 목록은 특정 파일 형식 및 패턴에 적용할 스타일/색상을 정의하기 위해 `LS_COLORS` 환경 변수를 사용합니다.

## `$env.config` 레코드의 누셸 설정

### `$env.config` 레코드의 설정 변경

누셸의 동작을 변경하는 주요 메커니즘은 `$env.config` 레코드입니다. 이 레코드는 환경 변수로 액세스되지만 대부분의 다른 변수와 달리 다음과 같습니다.

- 부모 프로세스에서 상속되지 않습니다. 대신 특정 기본값으로 누셸 자체에서 채워집니다.
- 누셸에서 시작된 자식 프로세스로 내보내지지 않습니다.

`$env.config`의 현재 설정을 검사하려면 변수 이름을 입력하기만 하면 됩니다.

```nu
$env.config
```

::: tip
누셸은 많은 사용자 지정 옵션을 제공하므로 다음과 같은 페이저로 보내는 것이 더 좋을 수 있습니다.

```nu
$env.config | table -e | less -R
# 또는 bat가 설치된 경우:
$env.config | table -e | bat -p
```

:::

각 설정을 설명하는 부록이 곧 제공될 예정입니다. 그 동안 각 설정에 대한 약식 문서는 누셸 내에서 다음을 사용하여 볼 수 있습니다.

```nu
config nu --doc | nu-highlight | bat
# 또는
config nu --doc | nu-highlight | less -R
```

기존 설정을 덮어쓰지 않으려면 전체 `config` 레코드가 아닌 원하는 구성 키에 업데이트된 값을 할당하는 것이 가장 좋습니다. 즉:

::: warning 잘못됨

```nu
$env.config = {
  show_banner: false
}
```

이렇게 하면 전체 레코드가 덮어쓰여지므로 변경된 _다른_ 설정이 재설정됩니다.
:::

::: tip 올바름

```nu
$env.config.show_banner = false
```

이렇게 하면 `show_banner` 키/값 쌍만 변경되고 다른 모든 키는 기존 값을 유지합니다.
:::

특정 키는 자체적으로 레코드이기도 합니다. 이러한 레코드를 덮어쓰는 것은 괜찮지만 그렇게 할 때 모든 값을 설정하는 것이 모범 사례입니다. 예를 들어:

```nu
$env.config.history = {
  file_format: sqlite
  max_size: 1_000_000
  sync_on_enter: true
  isolation: true
}
```

### 환영 메시지 제거

:::note
이 섹션은 배너 메시지에서 직접 연결되므로 위의 일부 정보가 반복됩니다.
:::

누셸이 시작될 때마다 표시되는 환영 메시지를 제거하려면:

1. `config nu`를 입력하여 구성 파일을 편집합니다.
2. 편집기가 정의되지 않았다는 오류가 발생하면:

   ```nu
   $env.config.buffer_editor = <선호하는 편집기 경로>
   # 예:
   $env.config.buffer_editor = "code"
   $env.config.buffer_editor = "vi"
   # 또는 편집기 인수가 있는 경우:
   $env.config.buffer_editor = ["emacsclient", "-s", "light", "-t"]
   ```

   그런 다음 1단계를 반복합니다.

3. 파일 끝에 다음 줄을 추가합니다.

   ```nu
   $env.config.show_banner = false
   ```

4. 편집기를 저장하고 종료합니다.
5. 누셸을 다시 시작하여 변경 사항을 테스트합니다.

## 추가 시작 구성

### 기본 디렉터리 변경

::: warning 중요
아래에서 설명하는 것처럼 이 섹션의 변수는 누셸이 시작되기 **전에** 설정해야 합니다.
:::

누셸 시작 파일 위치를 제어하는 일부 변수는 누셸이 로드되기 **전에** 설정해야 합니다. 이는 종종 다음과 같은 부모 프로세스에 의해 수행됩니다.

- 누셸이 실행되는 터미널 응용 프로그램

- 운영 체제 또는 창 관리자. 누셸을 로그인 셸로 실행할 때 이것이 유일하게 사용할 수 있는 메커니즘일 것입니다.

  예를 들어, Windows에서는 제어판을 통해 환경 변수를 설정할 수 있습니다. 시작 메뉴를 선택하고 _"환경 변수"_를 검색하십시오.

  PAM을 사용하는 Linux 시스템에서는 `/etc/environment`(및 기타 시스템별 메커니즘)를 사용할 수 있습니다.

- 부모 셸. 예를 들어 `nu`를 실행하기 전에 `bash`에서 값을 내보냅니다.

### 시작 변수

누셸 파일 위치에 영향을 미치는 변수는 다음과 같습니다.

- `$env.XDG_CONFIG_HOME`: 이 환경 변수가 설정되면 누셸이 `env.nu`, `config.nu`, `login.nu` 및 `<config>/autoload` 디렉터리와 같은 구성 파일을 검색하는 디렉터리를 변경하는 데 사용됩니다. 기록 및 플러그인 파일도 기본적으로 이 디렉터리에 저장됩니다.

  누셸이 시작되면 이 값은 `$nu.default-config-dir` 상수에 저장됩니다. 아래의 [상수 사용](#using-constants)을 참조하십시오.

- `$env.XDG_DATA_HOME`: 이 환경 변수가 설정되면 누셸은 `$nu.data-dir` 상수를 이 값으로 설정합니다. `data-dir`은 여러 시작 작업에서 사용됩니다.

  - `($nu.data-dir)/completions`가 `$env.NU_LIB_DIRS` 검색 경로에 추가됩니다.
  - `($nu.data-dir)/vendor/autoload`가 `nu.vendor-autoload-dirs`의 마지막 경로로 추가됩니다. 이 디렉터리의 파일은 다른 공급업체 자동 로드 디렉터리 다음에 읽혀서 해당 설정을 재정의합니다.

  `$nu.data-dir`으로 표시되는 디렉터리나 하위 디렉터리는 기본적으로 생성되지 않습니다. 이러한 디렉터리의 생성 및 사용은 사용자에게 달려 있습니다.

- `$env.XDG_DATA_DIRS` _(Unix 플랫폼만)_: 이 환경 변수가 설정되면 나열된 순서대로 `$nu.vendor-auto-load` 디렉터리를 채우는 데 사용됩니다. 목록의 첫 번째 디렉터리가 먼저 처리되므로 마지막으로 읽은 디렉터리가 이전 정의를 재정의할 수 있습니다.

::: warning
`XDG_*` 변수는 누셸 전용이 **아니며** 누셸 파일만 있는 디렉터리로 설정해서는 안 됩니다. 대신 `nushell` 디렉터리가 있는 디렉터리 _위의_ 디렉터리로 환경 변수를 설정하십시오.

예를 들어 `$env.XDG_CONFIG_HOME`을 다음으로 설정하면:

```
/users/username/dotfiles/nushell
```

... 누셸은 `/Users/username/dotfiles/nushell/nushell`에서 구성 파일을 찾습니다. 올바른 설정은 다음과 같습니다.

```
/users/username/dotfiles
```

또한 시스템이 이미 `XDG` 변수를 설정한 경우 해당 디렉터리에 이미 사용 중인 파일이 있을 수 있다는 점을 명심하십시오. 위치를 변경하면 다른 응용 프로그램의 파일을 새 디렉터리로 이동해야 할 수 있습니다.
:::

::: tip
다음 레시피를 사용하여 "새로운" 환경에서 구성 변경 사항을 쉽게 테스트할 수 있습니다. 다음은 누셸 내에서 실행되지만 다른 셸에도 적용할 수 있습니다.

```nu
# 빈 임시 디렉터리 만들기
let temp_home = (mktemp -d)
# 구성 경로를 이 디렉터리로 설정
$env.XDG_CONFIG_HOME = $temp_home
# 데이터 디렉터리를 이 디렉터리로 설정
$env.XDG_DATA_HOME = $temp_home
# 다른 잠재적인 자동 로드 디렉터리 제거
$env.XDG_DATA_HOME = ""
# 이 환경에서 누셸 실행
nu

# 구성 편집
config nu
# 하위 셸 종료
exit
# 임시 구성 실행
nu
```

구성 테스트가 끝나면:

```nu
# 원하는 경우 임시 구성 디렉터리 제거
rm $temp_home
```

**중요:** 그런 다음 `XDG` 변경 사항이 다른 프로세스로 우발적으로 전파되지 않도록 부모 셸을 종료합니다.
:::

### 상수 사용

`source` 및 `use`와 같이 사용자 지정 명령(및 기타 정의)을 정의하는 데 도움이 되는 일부 중요한 명령은 구문 분석 시간 키워드입니다. 무엇보다도 이는 모든 인수가 구문 분석 시간에 알려져야 함을 의미합니다.

즉, **_변수 인수는 구문 분석기 키워드에 허용되지 않습니다_**.

그러나 누셸은 일반적인 파일 위치를 식별하는 데 도움이 되는 몇 가지 편의 _상수_를 만듭니다. 예를 들어 다음을 사용하여 기본 구성 디렉터리에서 파일을 소싱할 수 있습니다.

```nu
source ($nu.default-config-dir | path join "myfile.nu")
```

상수 값은 구문 분석 시간에 알려져 있으므로 `source` 및 `use`와 같은 구문 분석 시간 키워드와 함께 사용할 수 있습니다.

:::tip 참조
이 프로세스에 대한 자세한 내용은 [구문 분석 시간 상수 평가](./how_nushell_code_gets_run.md#parse-time-constant-evaluation)를 참조하십시오.
:::

#### `$nu` 상수

기본 제공 누셸 상수 목록을 보려면 `$nu`(달러 기호 포함)를 사용하여 레코드 상수를 검사하십시오.

#### `NU_LIB_DIRS` 상수

누셸은 위에서 언급한 `$env.NU_LIB_DIRS` 변수처럼 작동할 수 있는 `NU_LIB_DIRS` _상수_를 사용할 수도 있습니다. 그러나 `$env.NU_LIB_DIRS`와 달리 `config.nu`에서 정의하고 사용할 수 있습니다. 예를 들어:

```nu
# 모듈 및 소스 검색 경로 정의
const NU_LIB_DIRS = [
  '~/myscripts'
]
# ~/myscripts 디렉터리에서 myscript.nu 로드
source myscript.nu
```

변수 `$env.NU_LIB_DIRS`와 상수 `NU_LIB_DIRS`가 모두 정의된 경우 두 경로 집합이 모두 검색됩니다. 상수 `NU_LIB_DIRS`가 _먼저_ 검색되고 우선 순위를 갖습니다. 해당 디렉터리 중 하나에서 이름과 일치하는 파일이 발견되면 검색이 중지됩니다. 그렇지 않으면 `$env.NU_LIB_DIRS` 검색 경로로 계속됩니다.

#### `NU_PLUGIN_DIRS` 상수

`const NU_PLUGIN_DIRS`는 플러그인 검색 경로에 대해 동일한 방식으로 작동합니다.

다음 `NU_PLUGIN_DIRS` 구성을 사용하면 다음에서 플러그인을 로드할 수 있습니다.

- `nu` 실행 파일이 있는 디렉터리. 이것은 일반적으로 릴리스 패키지에 플러그인이 있는 위치입니다.
- 실행 중인 누셸 버전의 이름을 딴 `$nu.data-dirs`의 디렉터리(예: `0.100.0`).
- `$nu.config-path`의 `plugins` 디렉터리.

```nu
const NU_PLUGIN_DIRS = [
  ($nu.current-exe | path dirname)
  ($nu.data-dir | path join 'plugins' | path join (version).version)
  ($nu.config-path | path dirname | path join 'plugins')
]
```

### 색상, 테마 및 구문 강조 표시

[관련 장](coloring_and_theming.md)에서 색상 및 테마 설정에 대해 자세히 알아볼 수 있습니다.

### Nu를 로그인 셸로 구성하기

로그인 셸은 종종 하위 셸 및 기타 프로세스에 의해 상속될 특정 환경 변수를 설정하는 역할을 합니다. 누셸을 사용자의 기본 로그인 셸로 설정할 때 `login.nu`가 이 작업을 처리하는지 확인해야 합니다.

많은 응용 프로그램은 POSIX 또는 PowerShell 로그인 셸을 가정하고 POSIX 로그인 셸(또는 PowerShell 시스템의 `.ps1` 파일)에서 로드되는 시스템 또는 사용자 `profile`을 수정하기 위한 지침을 제공합니다.

지금까지 눈치채셨겠지만, 누셸은 POSIX 셸도 아니고 PowerShell도 아니므로 이러한 셸용으로 작성된 프로필을 처리할 수 없습니다. 대신 `login.nu`에서 이러한 값을 설정해야 합니다.

`login.nu`를 통해 설정해야 할 수 있는 환경 변수를 찾으려면 이전 로그인 셸 내에서 `nu`를 실행하여 로그인 셸에서 상속된 환경을 검사하십시오. 다음을 실행하십시오.

```nu
$env | reject config | transpose key val | each {|r| echo $"$env.($r.key) = '($r.val)'"} | str join (char nl)
```

타사 응용 프로그램에 필요할 수 있는 값을 찾아 `login.nu`에 복사하십시오. 이러한 값 중 상당수는 필요하지 않습니다. 예를 들어, `PS1` 설정은 POSIX 셸의 현재 프롬프트이며 누셸에서는 유용하지 않습니다.

준비가 되면 [설치 장](./default_shell.md)에서 설명한 대로 누셸을 `/etc/shells`(Unix)에 추가하고 `chsh`하십시오.

### macOS: `/usr/bin/open`을 `open`으로 유지하기

Emacs와 같은 일부 도구는 Mac에서 파일을 열기 위해 [`open`](/commands/docs/open.md) 명령에 의존합니다.

누셸에는 `/usr/bin/open`을 가리는(재정의하는) 다른 의미를 가진 자체 [`open`](/commands/docs/open.md) 명령이 있으므로 이러한 도구는 명령을 사용하려고 할 때 오류를 생성합니다.

이 문제를 해결하는 한 가지 방법은 누셸의 [`open`](/commands/docs/open.md)에 대한 사용자 지정 명령을 정의하고 `config.nu` 파일에서 시스템의 [`open`](/commands/docs/open.md)에 대한 별칭을 만드는 것입니다.

```nu
alias nu-open = open
alias open = ^open
```

영구적으로 만들려면 `config.nu`에 이것을 넣으십시오.

`^` 기호는 누셸에게 다음 명령을 누셸 내장이 아닌 _외부_ 명령으로 실행하도록 지시합니다. 이러한 명령을 실행한 후 `nu-open`은 누셸 _내부_ 버전이 되고 `open` 별칭은 Mac 외부 `open`을 대신 호출합니다.

자세한 내용은 [시스템(외부) 명령 실행](./running_externals.md)을 참조하십시오.

## 자세한 구성 시작 프로세스

이 섹션에는 다른 구성(및 플래그) 옵션을 사용하여 누셸의 시작 동작을 변경하는 방법에 대한 자세한 설명이 포함되어 있습니다.

### 시작 단계

`nu`에 전달된 플래그에 따라 다음 단계와 해당 단계가 시작 중에 발생할 _수_ 있습니다. 각 플래그가 프로세스에 미치는 영향은 이 표 바로 다음에 나오는 [플래그 동작](#flag-behavior)을 참조하십시오.

| 단계 | 단계                           | 누셸 작업                                                                                                                                                                                                                                                                                                                                  |
| ---- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0.   | (기타)                          | 내부 Rust 구현을 통해 내부 기본값을 설정합니다. 실제로 이는 설정 또는 변수의 "첫 사용"까지 발생하지 않을 수 있지만, 누셸의 동작을 제어하는 대부분(전부는 아님)의 설정 및 변수에 대한 Rust 기본값이 일반적으로 있습니다. 이러한 기본값은 아래 단계로 대체될 수 있습니다.                                            |
| 1.   | (주요)                          | 호출 프로세스에서 초기 환경을 상속합니다. 처음에는 누셸 문자열로 변환되지만 나중에 `ENV_CONVERSIONS`(아래 참조)를 사용하여 다른 구조로 변환할 수 있습니다.                                                                                                                                                                           |
| 2.   | (주요)                          | 구성 디렉터리를 가져옵니다. 이는 OS에 따라 다르지만( [dirs::config_dir](https://docs.rs/dirs/latest/dirs/fn.config_dir.html) 참조), 위에서 설명한 대로 모든 플랫폼에서 `XDG_CONFIG_HOME`을 사용하여 재정의할 수 있습니다.                                                                                                                      |
| 3.   | (주요)                          | 초기 `$env.NU_LIB_DIRS` 변수를 만듭니다. 기본적으로 빈 목록입니다.                                                                                                                                                                                                                                                                                              |
| 4.   | (주요)                          | 초기 `$NU_LIB_DIRS` 변수를 만듭니다. 기본적으로 (1) 구성 디렉터리 아래의 `scripts` 디렉터리와 (2) 기본 데이터 디렉터리( `$env.XDG_DATA_HOME` 또는 [dirs 크레이트에서 제공하는 기본값](https://docs.rs/dirs/latest/dirs/fn.data_dir.html)) 아래의 `nushell/completions`를 포함합니다. 이러한 디렉터리는 기본적으로 생성되지 않습니다. |
| 5.   | (주요)                          | 초기 `$env.NU_PLUGIN_DIRS` 변수를 만듭니다. 기본적으로 빈 목록입니다.                                                                                                                                                                                                                                                                                           |
| 6.   | (주요)                          | 초기 `$NU_PLUGIN_DIRS` 변수를 만듭니다. 기본적으로 (1) 구성 디렉터리 아래의 `plugins` 디렉터리와 (2) 현재 실행 중인 `nu`/`nu.exe`가 있는 디렉터리를 포함합니다.                                                                                                                                                       |
| 7.   | (주요)                          | 인메모리 SQLite 데이터베이스를 초기화합니다. 이렇게 하면 다음 구성 파일에서 `stor` 계열 명령을 사용할 수 있습니다.                                                                                                                                                                                                                                          |
| 8.   | (주요)                          | `--plugin-config <file>`, `--plugins <list>` 등과 같은 명령줄 인수를 처리합니다. 전체 목록은 `nu --help`를 참조하십시오.                                                                                                                                                                                                                                         |
| 9.   | (주요)                          | `env.nu` 및 `config.nu`의 경로를 가져옵니다. 기본적으로 구성 디렉터리에 있지만 `--env-config <path>` 및 `--config <path>` 플래그를 사용하여 둘 중 하나 또는 둘 다를 재정의할 수 있습니다.                                                                                                                                                                            |
| 10.  | (주요)                          | `--include-path (-I)` 플래그가 사용된 경우 위에서 얻은 기본 `$env.NU_LIB_DIRS`를 재정의합니다.                                                                                                                                                                                                                                                               |
| 11.  | (주요)                          | 내부 기본값에서 초기 `$env.config` 값을 로드합니다.                                                                                                                                                                                                                                                                                                             |
| 12.  | (주요)                          | 상속된 `string`에서 검색 경로를 누셸 `list`로 변환합니다.                                                                                                                                                                                                                                                                                                      |
| 13.  | (stdlib)                        | [표준 라이브러리](./standard_library.md) 및 `std-rfc`를 가상 파일 시스템에 로드합니다. 이 시점에서 구문 분석되거나 평가되지 않습니다.                                                                                                                                                                                                                                    |
| 14.  | (stdlib)                        | `std/prelude`를 구문 분석하고 평가하여 `banner` 및 `pwd` 명령을 범위로 가져옵니다.                                                                                                                                                                                                                                                                                   |
| 15.  | (주요)                          | `$nu.default-config-dir`과 같은 항목을 다음 구성 파일에서 사용할 수 있도록 초기 [`$nu` 레코드 상수](#using-constants)를 생성합니다.                                                                                                                                                                                                                      |
| 16.  | (주요)                          | `--plugin` 플래그를 사용하여 지정된 모든 플러그인을 로드합니다.                                                                                                                                                                                                                                                                                |
| 17.  | (repl)                          | REPL에만 적용되는 여러 기본 환경 변수(프롬프트 관련 및 `SHLVL`)를 설정합니다. 클로저를 사용하는 프롬프트 관련 변수는 `default_env.nu`에 설정됩니다.                                                                                                                                                                                            |
| 18.  | (구성 파일) (플러그인)         | 다음 구성 파일에서 추가된 플러그인을 사용할 수 있도록 사용자 `plugin.msgpackz`(구성 디렉터리에 있음)의 서명을 처리합니다.                                                                                                                                                                                                             |
| 19.  | (구성 파일)                  | 누셸이 처음 시작된 경우 구성 디렉터리를 만듭니다. "첫 시작"은 구성 디렉터리의 존재 여부로 결정됩니다.                                                                                                                                                                                           |
| 20.  | (구성 파일)                  | 또한 누셸이 처음 시작된 경우 해당 디렉터리에 거의 비어 있는(몇 가지 주석 제외) `env.nu` 및 `config .nu`를 만듭니다.                                                                                                                                                                                                                     |
| 21.  | (구성 파일) (default_env.nu) | 내부 `default_env.nu`에서 기본 환경 변수를 로드합니다. 이 파일은 `config env --default \| nu-highlight \| less -R`로 볼 수 있습니다.                                                                                                                                                                                                                    |
| 22.  | (구성 파일) (env.nu)         | `PATH` 변수를 목록으로 변환하여 다음 단계에서 더 쉽게 액세스할 수 있도록 합니다.                                                                                                                                                                                                                                                                              |
| 23.  | (구성 파일) (env.nu)         | 사용자 `env.nu`(위에서 결정된 경로)를 로드(구문 분석 및 평가)합니다.                                                                                                                                                                                                                                                                                     |
| 24.  | (구성 파일) (config.nu)      | 내부 `default_config.nu`에서 최소 `$env.config` 레코드를 로드합니다. 이 파일은 `config nu --default \| nu-highlight \| less -R`로 볼 수 있습니다. `default_config.nu`에 정의되지 않은 대부분의 값은 내부 기본값을 사용하여 `$env.config`에 자동으로 채워집니다.                                                                        |
| 25.  | (구성 파일) (config.nu)      | 사용자 `config.nu`(위에서 결정된 경로)를 로드(구문 분석 및 평가)합니다.                                                                                                                                                                                                                                                                                  |
| 26.  | (구성 파일) (로그인)          | 누셸이 로그인 셸로 실행될 때 사용자 `login.nu`를 로드합니다.                                                                                                                                                                                                                                                                                                         |
| 27.  | (구성 파일)                  | 공급업체 자동 로드 디렉터리를 반복하고 발견된 `.nu` 파일을 로드합니다. 디렉터리는 `$nu.vendor-autoload-dirs`에서 찾은 순서대로 처리되고 해당 디렉터리의 파일은 알파벳순으로 처리됩니다.                                                                                                                                             |
| 28.  | (구성 파일)                  | 사용자 자동 로드 디렉터리를 반복하고 발견된 `.nu` 파일을 로드합니다. 디렉터리는 `$nu.user-autoload-dirs`에서 찾은 순서대로 처리되고 해당 디렉터리의 파일은 알파벳순으로 처리됩니다.                                                                                                                                                 |
| 29.  | (repl) 및 (stdlib)             | 구성된 경우 배너를 표시합니다.                                                                                                                                                                                                                                                                                                                                                |
| 29.  | (repl)                          | 누셸이 일반 명령줄(REPL)로 들어갑니다.                                                                                                                                                                                                                                                                                                                                  |

### 플래그 동작

| 모드                | 명령/플래그                              | 동작                                                                                                                                                                                                                                                                                     |
| ------------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 일반 셸        | `nu` (플래그 없음)                            | **_(로그인)_**으로 표시된 단계를 **_제외하고_** 모든 시작 단계가 발생합니다.                                                                                                                                                                                                                         |
| 로그인 셸         | `nu --login/-l`                            | 모든 시작 단계가 발생합니다.                                                                                                                                                                                                                                                                      |
| 명령 문자열      | `nu --commands <command-string>` (또는 `-c`) | **_(구성 파일)_** 또는 **_(repl)_**로 표시된 단계를 **_제외하고_** 모든 시작 단계가 발생합니다. 그러나 **_(default_env)_** 및 **_(플러그인)_**은 발생합니다. 첫 번째는 거기에서 정의된 경로 `ENV_CONVERSIONS`가 발생할 수 있도록 합니다. 두 번째는 명령 문자열에서 플러그인을 사용할 수 있도록 합니다. |
| 스크립트 파일         | `nu <script_file>`                         | 명령 문자열과 동일합니다.                                                                                                                                                                                                                                                                 |
| 구성 없음           | `nu -n`                                    | 다른 플래그에 관계없이 **_(구성 파일)_** 단계가 발생하지 **_않습니다_**.                                                                                                                                                                                                                   |
| 표준 라이브러리 없음 | `nu --no-std-lib`                          | 다른 플래그에 관계없이 **_(stdlib)_**로 표시된 단계가 발생하지 **_않습니다_**.                                                                                                                                                                                                             |
| 구성 파일 강제   | `nu --config <file>`                       | `-n`이 지정되지 않은 경우 위에서 **_(config.nu)_**로 표시된 단계가 제공된 구성 `<file>`으로 실행되도록 강제합니다.                                                                                                                                                                    |
| env 파일 강제      | `nu --env-config <file>`                   | `-n`이 지정되지 않은 경우 위에서 **_(default_env.nu)_** 및 **_(env.nu)_**로 표시된 단계가 지정된 env `<file>`으로 실행되도록 강제합니다.                                                                                                                                              |

### 시나리오

- `nu`:

  - ✅ 표준 라이브러리를 사용할 수 있도록 합니다.
  - ✅ 구성 디렉터리에 있는 경우 사용자 `plugin.msgpackz` 파일을 읽습니다.
  - ✅ 내부적으로 `default_env.nu` 파일을 소싱합니다.
  - ✅ 구성 디렉터리에 있는 경우 사용자 `env.nu` 파일을 소싱합니다.
  - ✅ 내부적으로 `default_config.nu` 파일을 소싱합니다.
  - ✅ 구성 디렉터리에 있는 경우 사용자 `config.nu` 파일을 소싱합니다.
  - ❌ `개인 login.nu` 파일을 읽지 않습니다.
  - ✅ REPL에 들어갑니다.

- `nu -c "ls"`:

  - ✅ 표준 라이브러리를 사용할 수 있도록 합니다.
  - ✅ 구성 디렉터리에 있는 경우 사용자 `plugin.msgpackz` 파일을 읽습니다.
  - ✅ 내부적으로 `default_env.nu` 파일을 소싱합니다.
  - ❌ 사용자 `env.nu`를 소싱하지 않습니다.
  - ❌ 내부 `default_config.nu` 파일을 읽지 않습니다.
  - ❌ 사용자 `config.nu` 파일을 읽지 않습니다.
  - ❌ 사용자 `login.nu` 파일을 읽지 않습니다.
  - ✅ `ls` 명령을 실행하고 종료합니다.
  - ❌ REPL에 들어가지 않습니다.

- `nu -l -c "ls"`:

  - ✅ 표준 라이브러리를 사용할 수 있도록 합니다.
  - ✅ 구성 디렉터리에 있는 경우 사용자 `plugin.msgpackz` 파일을 읽습니다.
  - ✅ 내부적으로 `default_env.nu` 파일을 소싱합니다.
  - ✅ 구성 디렉터리에 있는 경우 사용자 `env.nu` 파일을 소싱합니다.
  - ✅ 내부적으로 `default_config.nu` 파일을 소싱합니다.
  - ✅ 구성 디렉터리에 있는 경우 사용자 `config.nu` 파일을 소싱합니다.
  - ✅ 구성 디렉터리에 있는 경우 사용자 `login.nu` 파일을 소싱합니다.
  - ✅ `ls` 명령을 실행하고 종료합니다.
  - ❌ REPL에 들어가지 않습니다.

- `nu -l -c "ls" --config foo_config.nu`

  - 위와 동일하지만 구성 디렉터리에서 `foo_config.nu`라는 대체 구성 파일을 읽습니다.

- `nu -n -l -c "ls"`:

  - ✅ 표준 라이브러리를 사용할 수 있도록 합니다.
  - ❌ 사용자 `plugin.msgpackz`를 읽지 않습니다.
  - ❌ 내부 `default_env.nu`를 읽지 않습니다.
  - ❌ 사용자 `env.nu`를 소싱하지 않습니다.
  - ❌ 내부 `default_config.nu` 파일을 읽지 않습니다.
  - ❌ 사용자 `config.nu` 파일을 읽지 않습니다.
  - ❌ 사용자 `login.nu` 파일을 읽지 않습니다.
  - ✅ `ls` 명령을 실행하고 종료합니다.
  - ❌ REPL에 들어가지 않습니다.

- `nu test.nu`:

  - ✅ 표준 라이브러리를 사용할 수 있도록 합니다.
  - ✅ 구성 디렉터리에 있는 경우 사용자 `plugin.msgpackz` 파일을 읽습니다.
  - ✅ 내부적으로 `default_env.nu` 파일을 소싱합니다.
  - ❌ 사용자 `env.nu`를 소싱하지 않습니다.
  - ❌ 내부 `default_config.nu` 파일을 읽지 않습니다.
  - ❌ 사용자 `config.nu` 파일을 읽지 않습니다.
  - ❌ 사용자 `login.nu` 파일을 읽지 않습니다.
  - ✅ `test.nu` 파일을 스크립트로 실행합니다.
  - ❌ REPL에 들어가지 않습니다.

- `nu --config foo_config.nu test.nu`

  - ✅ 표준 라이브러리를 사용할 수 있도록 합니다.
  - ✅ 구성 디렉터리에 있는 경우 사용자 `plugin.msgpackz` 파일을 읽습니다.
  - ✅ 내부적으로 `default_env.nu` 파일을 소싱합니다.
  - ❌ 사용자 `env.nu`를 소싱하지 않습니다(`--env-config`가 지정되지 않았습니다).
  - ✅ 내부적으로 `default_config.nu` 파일을 소싱합니다. `default_config.nu`는 항상 사용자 구성 전에 처리됩니다.
  - ✅ 구성 디렉터리에 있는 경우 사용자 `config.nu` 파일을 소싱합니다.
  - ❌ 사용자 `login.nu` 파일을 읽지 않습니다.
  - ✅ `test.nu` 파일을 스크립트로 실행합니다.
  - ❌ REPL에 들어가지 않습니다.

- `nu -n --no-std-lib` (가장 빠른 REPL 시작):

  - ❌ 표준 라이브러리를 사용할 수 없도록 합니다.
  - ❌ 사용자 `plugin.msgpackz`를 읽지 않습니다.
  - ❌ 내부 `default_env.nu`를 읽지 않습니다.
  - ❌ 사용자 `env.nu`를 소싱하지 않습니다.
  - ❌ 내부 `default_config.nu` 파일을 읽지 않습니다.
  - ❌ 사용자 `config.nu` 파일을 읽지 않습니다.
  - ❌ 사용자 `login.nu` 파일을 읽지 않습니다.
  - ✅ REPL에 들어갑니다.

- `nu -n --no-std-lib -c "ls"` (가장 빠른 명령 문자열 호출):

  - ❌ 표준 라이브러리를 사용할 수 없도록 합니다.
  - ❌ 사용자 `plugin.msgpackz`를 읽지 않습니다.
  - ❌ 내부 `default_env.nu`를 읽지 않습니다.
  - ❌ 사용자 `env.nu`를 소싱하지 않습니다.
  - ❌ 내부 `default_config.nu` 파일을 읽지 않습니다.
  - ❌ 사용자 `config.nu` 파일을 읽지 않습니다.
  - ❌ 사용자 `login.nu` 파일을 읽지 않습니다.
  - ✅ `ls` 명령을 실행하고 종료합니다.
  - ❌ REPL에 들어가지 않습니다.
