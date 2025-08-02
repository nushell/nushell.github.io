---
next:
  text: Nu로 프로그래밍하기
  link: /book/programming_in_nu.md
---
# 특수 변수

누셸은 여러 특수 변수와 상수를 사용 가능하게 하고 사용합니다. 이들 중 다수는 이 책의 다른 곳에서 언급되거나 문서화되어 있지만, 이 페이지는 참조를 위해 _모든_ 변수를 포함해야 합니다.

[[toc]]

## `$nu`

`$nu` 상수는 여러 유용한 값을 포함하는 레코드입니다.

- `default-config-dir`: 구성 파일이 저장되고 읽히는 디렉터리.
- `config-path`: 주 누셸 구성 파일의 경로, 일반적으로 구성 디렉터리의 `config.nu`입니다.
- `env-path`: 선택적 환경 구성 파일, 일반적으로 구성 디렉터리의 `env.nu`입니다.
- `history-path`: 명령 기록을 저장하는 텍스트 또는 SQLite 파일.
- `loginshell-path`: 로그인 셸에 대해 실행되는 선택적 구성 파일, 일반적으로 구성 디렉터리의 `login.nu`입니다.
- `plugin-path`: 플러그인 레지스트리 파일, 일반적으로 구성 디렉터리의 `plugin.msgpackz`입니다.
- `home-path`: 약어 `~`를 사용하여 액세스할 수 있는 사용자의 홈 디렉터리.
- `data-dir`: 시작 시 로드되는 `./vendor/autoload` 디렉터리 및 기타 사용자 데이터를 포함하는 누셸의 데이터 디렉터리.
- `cache-dir`: 필수적이지 않은(캐시된) 데이터용 디렉터리.
- `vendor-autoload-dirs`: 시작 시 자동으로 로드될 구성 파일을 타사 응용 프로그램이 설치해야 하는 디렉터리 목록입니다.
- `user-autoload-dirs`: 사용자가 시작 시 자동으로 로드될 추가 구성 파일을 만들 수 있는 디렉터리 목록입니다.
- `temp-path`: 사용자가 쓸 수 있어야 하는 임시 파일 경로.
- `pid`: 현재 실행 중인 누셸 프로세스의 PID.
- `os-info`: 호스트 운영 체제에 대한 정보.
- `startup-time`: 누셸이 시작되고 모든 구성 파일을 처리하는 데 걸린 시간(기간).
- `is-interactive`: 누셸이 대화형 셸로 시작되었는지(`true`) 또는 스크립트나 명령 문자열을 실행 중인지 여부를 나타내는 부울입니다. 예시:

  ```nu
  $nu.is-interactive
  # => true
  nu -c "$nu.is-interactive"
  # => false

  # --interactive(-i)로 대화형 강제 실행
  nu -i -c "$nu.is-interactive"
  # => true
  ```

  참고: 대화형 셸로 시작하면 시작 구성 파일이 처리됩니다. 비대화형 셸로 시작하면 플래그를 통해 명시적으로 호출되지 않는 한 구성 파일이 읽히지 않습니다.

- `is-login`: 누셸이 로그인 셸로 시작되었는지 여부를 나타냅니다.
- `history-enabled`: `nu --no-history`를 통해 기록을 비활성화할 수 있으며, 이 경우 이 상수는 `false`가 됩니다.
- `current-exe`: 현재 실행 중인 `nu` 바이너리의 전체 경로입니다. 바이너리가 있는 디렉터리를 확인하기 위해 `path dirname`(상수)과 결합할 수 있습니다.

## `$env`

`$env`는 현재 환경 변수를 포함하는 특수 가변 변수입니다. 모든 프로세스와 마찬가지로 초기 환경은 `nu`를 시작한 부모 프로세스에서 상속됩니다.

누셸이 특정 목적으로 사용하는 몇 가지 환경 변수도 있습니다.

### `$env.CMD_DURATION_MS`

이전 명령이 실행되는 데 걸린 시간(밀리초).

### `$env.config`

`$env.config`는 누셸에서 사용되는 주 구성 레코드입니다. 설정은 `config nu --doc`에 문서화되어 있습니다.

### `$env.CURRENT_FILE`

스크립트, 모듈 또는 소싱된 파일 내에서 이 변수는 정규화된 파일 이름을 보유합니다. 이 정보는 [`path self`](/commands/docs/path_self.md) 명령을 통해 상수로도 사용할 수 있습니다.

### `$env.ENV_CONVERSIONS`

사용자가 특정 환경 변수를 누셸 유형으로 변환하는 방법을 지정할 수 있습니다. [ENV_CONVERSIONS](./configuration.md#env-conversions)를 참조하십시오.

### `$env.FILE_PWD`

스크립트, 모듈 또는 소싱된 파일 내에서 이 변수는 파일이 있는 디렉터리의 정규화된 이름을 보유합니다. 이 값은 다음을 통해 상수로도 사용할 수 있습니다.

```nu
path self | path dirname
```

### `$env.LAST_EXIT_CODE`

마지막 명령의 종료 코드, 일반적으로 외부 명령에 사용됩니다. POSIX의 `$?`와 동일합니다. 이 정보는 외부 명령에 대한 `try` 표현식의 `catch` 블록에서도 사용할 수 있습니다. 예시:

```nu
^ls file-that-does-not-exist e> /dev/null
$env.LAST_EXIT_CODE
# => 2

# 또는
try {
  ^ls file-that-does-not-exist e> /dev/null
} catch {|e|
  print $e.exit_code
}
# => 2
```

### `$env.NU_LIB_DIRS`

`source`, `use` 또는 `overlay use` 명령을 사용할 때 검색할 디렉터리 목록입니다. 참조:

- 아래 `$NU_LIB_DIRS` 상수
- [모듈 경로](./modules/using_modules.md#module-path)
- [구성 - `$NU_LIB_DIRS`](./configuration.md#nu-lib-dirs-constant)

### `$env.NU_LOG_LEVEL`

[표준 라이브러리](/book/standard_library.md)는 `std/log`에서 로깅을 제공합니다. `NU_LOG_LEVEL` 환경 변수는 사용자 지정 명령, 모듈 및 스크립트에 사용되는 로그 수준을 정의하는 데 사용됩니다.

```nu
nu -c '1 | print; use std/log; log debug 1111; 9 | print'
# => 1
# => 9

nu -c '1 | print; use std/log; NU_LOG_LEVEL=debug log debug 1111; 9 | print'
# => 1
# => 2025-07-12T21:27:30.080|DBG|1111
# => 9

nu -c '1 | print; use std/log; $env.NU_LOG_LEVEL = "debug"; log debug 1111; 9 | print'
# => 1
# => 2025-07-12T21:27:57.888|DBG|1111
# => 9
```

`$env.NU_LOG_LEVEL`은 기본 제공 네이티브 Rust 누셸 명령의 로그 수준을 설정하는 `nu --log-level`과 다릅니다. 사용자 지정 명령 및 스크립트에서 사용되는 `std/log` 로깅에 영향을 미치지 않습니다.

```nu
nu --log-level 'debug' -c '1 | print; use std/log; log debug 1111; 9 | print'
# => … 훨씬 더 많은 로그 메시지, 누셸 명령 Rust 소스 파일에 대한 참조 포함
#      그리고 우리 자신의 `log debug` 메시지 없이
# => 1
# => 9
# => …
```

### `$env.NU_PLUGIN_DIRS`

`plugin add`로 플러그인을 등록할 때 검색할 디렉터리 목록입니다. 참조:

- [플러그인 검색 경로](./plugins.md#plugin-search-path)

### `$env.NU_VERSION`

현재 누셸 버전입니다. `(version).version`과 동일하지만 환경 변수이므로 자식 프로세스로 내보내지고 읽을 수 있습니다.

### `$env.PATH`

다른 응용 프로그램을 실행하기 위한 검색 경로입니다. 처음에는 부모 프로세스에서 문자열로 상속되지만 쉽게 액세스할 수 있도록 시작 시 누셸 `list`로 변환됩니다.

자식 프로세스를 실행하기 전에 문자열로 다시 변환됩니다.

### `$env.PROCESS_PATH`

_스크립트를 실행할 때_ 이 변수는 스크립트의 이름과 상대 경로를 나타냅니다. 위의 두 변수와 달리 파일을 소싱하거나 모듈을 가져올 때는 존재하지 않습니다.

참고: 또한 위의 두 변수와 달리 파일을 _호출_하는 데 사용된 정확한 경로(심볼릭 링크 포함)가 반환됩니다.

### `$env.PROMPT_*` 및 `$env.TRANSIENT_PROMPT_*`

각 명령줄에 나타나는 누셸 프롬프트를 구성하는 데 사용할 수 있는 여러 변수가 있습니다. 참조:

- [구성 - 프롬프트 구성](./configuration.md#prompt-configuration)
- `config nu --doc`

### `$env.SHLVL`

`SHLVL`은 새 하위 셸에 들어갈 때 대부분의 셸에서 증가합니다. 중첩된 셸 수를 확인하는 데 사용할 수 있습니다. 예를 들어, `$env.SHLVL == 2`이면 `exit`를 입력하면 부모 셸로 돌아가야 합니다.

### `$env.XDG_CONFIG_HOME`

선택적으로 `$nu.default-config-dir` 위치를 재정의하는 데 사용할 수 있습니다. [구성 - 시작 변수](./configuration.md#startup-variables)를 참조하십시오.

### `$env.XDG_DATA_DIR`

선택적으로 `$nu.data-dir` 위치를 재정의하는 데 사용할 수 있습니다. [구성 - 시작 변수](./configuration.md#startup-variables)를 참조하십시오.

## `$in`

`$in` 변수는 표현식에 대한 파이프라인 입력을 나타냅니다. [파이프라인 - 특수 `$in` 변수](./pipelines.md#pipeline-input-and-the-special-in-variable)를 참조하십시오.

## `$it`

`$it`은 `where` "행 조건"에서만 사용할 수 있는 특수 변수입니다. 필드 액세스를 단순화하는 편리한 약어입니다. 자세한 내용은 `help where` 또는 [where](/commands/docs/where.md)를 참조하십시오.

## `$NU_LIB_DIRS`

`$env.NU_LIB_DIRS`의 상수 버전 - `source`, `use` 또는 `overlay use` 명령을 사용할 때 검색할 디렉터리 목록입니다. 참조:

- [모듈 경로](./modules/using_modules.md#module-path)
- [구성 - `$NU_LIB_DIRS`](./configuration.md#nu-lib-dirs-constant)

## `$NU_PLUGIN_DIRS`

`$env.NU_PLUGIN_DIRS`의 상수 버전 - `plugin add`로 플러그인을 등록할 때 검색할 디렉터리 목록입니다. 참조:

- [플러그인 검색 경로](./plugins.md#plugin-search-path)
