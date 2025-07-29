# 플러그인

Nu는 플러그인을 사용하여 확장할 수 있습니다. 플러그인은 Nu 자체와 별도로 추가할 수 있다는 이점과 함께 Nu의 기본 제공 명령과 매우 유사하게 작동합니다.

::: warning 중요
플러그인은 `nu-plugin` 프로토콜을 사용하여 누셸과 통신합니다. 이 프로토콜은 버전이 지정되어 있으며 플러그인은 누셸에서 제공하는 것과 동일한 `nu-plugin` 버전을 사용해야 합니다.

누셸을 업데이트할 때 등록한 모든 플러그인도 업데이트해야 합니다.
:::

[[toc]]

## 개요

- 플러그인을 사용하려면 다음을 수행해야 합니다.

  - 설치됨
  - 추가됨
  - 가져옴

플러그인에는 두 가지 유형이 있습니다.

- "코어 플러그인"은 공식적으로 유지 관리되며 일반적으로 누셸 실행 파일과 동일한 디렉터리에 누셸과 함께 설치됩니다.
- 타사 플러그인도 여러 소스에서 사용할 수 있습니다.

`$NU_LIB_DIRS` 상수 또는 `$env.NU_LIB_DIRS` 환경 변수를 사용하여 플러그인의 검색 경로를 설정할 수 있습니다.

### 코어 플러그인 빠른 시작

Polars 플러그인을 사용하려면:

1. 대부분의 패키지 관리자는 누셸과 함께 코어 플러그인을 자동으로 설치합니다. 그러나 주목할 만한 예외는 `cargo`입니다. `cargo`를 사용하여 누셸을 설치한 경우 아래 [코어 플러그인 설치](#core-plugins)를 참조하십시오.

2. (권장) 누셸 및 해당 플러그인이 설치된 디렉터리를 포함하도록 플러그인 검색 경로를 설정합니다. 코어 플러그인이 누셸 바이너리와 동일한 디렉터리에 설치되어 있다고 가정하면 시작 구성에 다음을 추가할 수 있습니다.

   ```nu
   const NU_PLUGIN_DIRS = [
     ($nu.current-exe | path dirname)
     ...$NU_PLUGIN_DIRS
   ]
   ```

3. 플러그인 레지스트리에 플러그인을 추가합니다. 이 작업은 한 번만 수행하면 됩니다. 이름은 확장자를 포함하여 플러그인 _파일_의 이름입니다.

   ```nu
   # Unix/Linux 플랫폼에서:
   plugin add nu_plugin_polars
   # 또는 Windows에서
   plugin add nu_plugin_polars.exe

   plugin list # 레지스트리에 추가되었는지 확인
   ```

   또는 2단계에서 바이너리 디렉터리를 플러그인 경로에 추가하지 않은 경우에도 절대 경로를 사용할 수 있습니다.

   ```nu
   plugin add ~/.local/share/rust/cargo/bin/nu_plugin_polars
   ```

4. 플러그인을 가져오거나(즉시 사용하려면) 누셸을 다시 시작합니다. 레지스트리의 모든 플러그인은 누셸이 시작될 때 자동으로 가져옵니다.

   ```nu
   # 선행 `nu_plugin`이나 확장자가 없는 플러그인 이름
   use polars
   ```

5. 플러그인이 작동하는지 확인합니다.

   ```nu
   ls | polars into-df | describe
   # => NuDataFrame
   ```

## 플러그인 설치

### 코어 플러그인

누셸은 다음을 포함하는 공식적으로 유지 관리되는 플러그인 세트와 함께 제공됩니다.

- `polars`: [Polars 라이브러리](https://github.com/pola-rs/polars)를 통해 데이터프레임을 사용하여 매우 빠른 열 작업을 수행합니다. 자세한 내용은 [데이터프레임 장](dataframes.html)을 참조하십시오.
- `formats`: EML, ICS, INI, plist 및 VCF와 같은 여러 추가 데이터 형식 지원.
- `gstat`: Git 저장소의 상태에 대한 정보를 누셸 구조화된 데이터로 반환합니다.
- `query`: SQL, XML, JSON, HTML(선택기 통해) 및 웹 페이지 메타데이터 쿼리 지원.
- `inc`: 값 또는 버전(예: semver)을 증가시킵니다. 이 플러그인은 최종 사용자 플러그인과 플러그인을 만드는 방법에 대한 간단한 개발자 예제 역할을 합니다.

누셸은 또한 플러그인 개발자를 위한 예제 또는 도구 역할을 하는 여러 플러그인과 함께 제공됩니다. 여기에는 `nu_plugin_example`, `nu_plugin_custom_values` 및 `nu_plugin_stress_internals`가 포함됩니다.

코어 플러그인은 일반적으로 누셸 릴리스와 함께 배포되며 누셸 실행 파일과 동일한 디렉터리에 이미 설치되어 있어야 합니다. 시스템에서 이 경우 코어 플러그인은 올바른 `nu-plugin` 프로토콜 버전을 사용해야 합니다. 패키지 관리 시스템이 별도로 설치하는 경우 누셸 자체가 업데이트될 때마다 코어 플러그인도 업데이트해야 합니다.

::: tip Cargo를 사용하여 설치
예를 들어 `cargo install nu --locked`를 사용하여 crates.io에서 직접 누셸을 설치하거나 업그레이드할 때 해당 버전에 대한 해당 코어 플러그인도 `cargo install nu_plugin_<plugin_name> --locked`를 사용하여 설치하거나 업데이트할 수 있습니다.

모든 기본(비개발자) 플러그인을 설치하려면 누셸 내에서 다음을 실행하십시오.

```nu
[ nu_plugin_inc
  nu_plugin_polars
  nu_plugin_gstat
  nu_plugin_formats
  nu_plugin_query
] | each { cargo install $in --locked } | ignore
```

:::

### 타사 플러그인

crates.io, 온라인 Git 저장소, [`awesome-nu`](https://github.com/nushell/awesome-nu/blob/main/plugin_details.md) 및 기타 소스에서 타사 플러그인을 찾을 수 있습니다. 시스템에서 실행하는 모든 타사 코드와 마찬가지로 해당 소스를 신뢰하는지 확인하십시오.

시스템에 타사 플러그인을 설치하려면 먼저 플러그인이 시스템과 동일한 버전의 Nu를 사용하는지 확인해야 합니다.

- `version` 명령으로 누셸 버전을 확인합니다.
- `Cargo.toml` 파일을 확인하여 플러그인에 필요한 버전을 확인합니다.

crates.io에서 이름으로 플러그인을 설치하려면 다음을 실행하십시오.

```nu
cargo install nu_plugin_<plugin_name> --locked
```

저장소(예: GitHub)에서 설치할 때 복제된 저장소 내에서 다음을 실행하십시오.

```nu
cargo install --path . --locked
```

이렇게 하면 플러그인을 추가하는 데 사용할 수 있는 바이너리 파일이 생성됩니다.

::: tip Cargo 설치 위치
기본적으로 `cargo install`로 설치된 바이너리는 홈 디렉터리의 `.cargo/bin`에 있습니다.
그러나 시스템 구성 방식에 따라 변경될 수 있습니다.
:::

## 플러그인 등록

플러그인 레지스트리 파일에 플러그인을 추가하려면 [`plugin add`](/commands/docs/plugin_add.md) 명령을 호출하여 Nu에 해당 위치를 알려줍니다.

::: tip 참고
플러그인 파일 이름은 `nu_plugin_`으로 시작해야 합니다. Nu는 이 파일 이름 접두사를 사용하여 플러그인을 식별합니다.
:::

- Linux 및 macOS:

  ```nu
  plugin add ./my_plugins/nu_plugin_cool
  ```

- Windows:

  ```nu
  plugin add .\my_plugins\nu_plugin_cool.exe
  ```

[`plugin add`](/commands/docs/plugin_add.md)를 호출하면 Nu는 다음을 수행합니다.

- 플러그인 바이너리를 실행합니다.
- 호환성을 보장하고 지원하는 모든 명령 목록을 얻기 위해 [플러그인 프로토콜](/contributor-book/plugin_protocol_reference.md)을 통해 통신합니다.
- 이 플러그인 정보는 캐시 역할을 하는 플러그인 레지스트리 파일(`$nu.plugin-path`)에 저장됩니다.

### 플러그인 가져오기

레지스트리에 추가되면 다음에 `nu`가 시작될 때 플러그인이 가져와져 해당 세션에서 사용할 수 있습니다.

`plugin use`를 호출하여 현재 세션에서 플러그인을 즉시 가져오거나 다시 로드할 수도 있습니다. 이 경우 `nu_plugin` 접두사 없이 플러그인 이름(파일 이름이 아님)이 사용됩니다.

```nu
plugin use cool
```

구성 파일에 `plugin use` 문을 추가할 필요는 없습니다. 이전에 등록된 모든 플러그인은 시작 시 자동으로 로드됩니다.

::: tip 참고
`plugin use`는 파서 키워드이므로 스크립트를 평가할 때 먼저 평가됩니다. 즉, REPL에서 별도의 줄에 `plugin add`와 `plugin use`를 실행할 수 있지만 단일 스크립트에서는 이 작업을 수행할 수 없습니다. 캐시 파일을 준비하지 않고 특정 플러그인 또는 플러그인 세트로 `nu`를 실행해야 하는 경우 `--plugins` 옵션을 `nu`에 플러그인 실행 파일 목록과 함께 전달할 수 있습니다.

```nu
nu --plugins '[./my_plugins/nu_plugin_cool]'
```

:::

### 플러그인 검색 경로

누셸에는 플러그인의 검색 경로를 설정하는 데 사용할 수 있는 두 개의 `list` 변수가 포함되어 있습니다. 이것은 `plugin add`로 플러그인을 등록할 때만 적용되지만, 플러그인을 자주 추가하고 제거하는 경우 좋은 지름길이 될 수 있습니다.

- `const NU_PLUGIN_DIRS`: 설정 시 즉시 적용되는 상수입니다. 그러나 상수이므로 특정 명령만 사용할 수 있습니다. 예를 들어, 위 [빠른 시작](#core-plugin-quickstart)에서 볼 수 있듯이 업데이트할 수 있습니다.
- `$env.NU_PLUGIN_DIRS`: 변경 가능하고 목록을 업데이트하는 모든 명령을 허용하는 환경 변수입니다. 그러나 변경 사항은 _다음_ 표현식이 구문 분석될 때까지 적용되지 않습니다.

### 플러그인 업데이트

플러그인을 업데이트할 때 플러그인에서 새 서명을 로드하고 Nu가 플러그인 파일(`$nu.plugin-path`)에 다시 쓰도록 허용하기 위해 위와 같이 `plugin add`를 다시 실행하는 것이 중요합니다. 그런 다음 `plugin use`를 사용하여 현재 세션 내에서 업데이트된 서명을 얻을 수 있습니다.

## 플러그인 관리

설치된 플러그인은 [`plugin list`](/commands/docs/plugin_list.md)를 사용하여 표시됩니다.

```nu
plugin list
# =>
╭───┬─────────┬────────────┬─────────┬───────────────────────┬───────┬───────────────────────────────╮
│ # │  name   │ is_running │   pid   │       filename        │ shell │           commands            │
├───┼─────────┼────────────┼─────────┼───────────────────────┼───────┼───────────────────────────────┤
│ 0 │ gstat   │ true       │ 1389890 │ .../nu_plugin_gstat   │       │ ╭───┬───────╮                 │
│   │         │            │         │                       │       │ │ 0 │ gstat │                 │
│   │         │            │         │                       │       │ ╰───┴───────╯                 │
│ 1 │ inc     │ false      │         │ .../nu_plugin_inc     │       │ ╭───┬─────╮                   │
│   │         │            │         │                       │       │ │ 0 │ inc │                   │
│   │         │            │         │                       │       │ ╰───┴─────╯                   │
│ 2 │ example │ false      │         │ .../nu_plugin_example │       │ ╭───┬───────────────────────╮ │
│   │         │            │         │                       │       │ │ 0 │ nu-example-1          │ │
│   │         │            │         │                       │       │ │ 1 │ nu-example-2          │ │
│   │         │            │         │                       │       │ │ 2 │ nu-example-3          │ │
│   │         │            │         │                       │       │ │ 3 │ nu-example-config     │ │
│   │         │            │         │                       │       │ │ 4 │ nu-example-disable-gc │ │
│   │         │            │         │                       │       │ ╰───┴───────────────────────╯ │
╰───┴─────────┴────────────┴─────────┴───────────────────────┴───────┴───────────────────────────────╯
```

설치된 플러그인의 모든 명령은 현재 범위에서 사용할 수 있습니다.

```nu
scope commands | where type == "plugin"
```

### 플러그인 수명 주기

플러그인은 사용 중인 동안 계속 실행되며, 비활성 상태가 일정 기간 지속되면 기본적으로 자동으로 중지됩니다. 이 동작은 [플러그인 가비지 수집기](#plugin-garbage-collector)에 의해 관리됩니다. 플러그인을 수동으로 중지하려면 해당 이름으로 `plugin stop`을 호출하십시오.

예를 들어, 해당 플러그인에서 `gstat` 명령을 실행한 다음 `is_running` 상태를 확인하십시오.

```nu
gstat
# => gstat 출력
plugin list | where name == gstat | select name is_running
# =>
╭───┬───────┬────────────╮
│ # │ name  │ is_running │
├───┼───────┼────────────┤
│ 0 │ gstat │ true       │
╰───┴───────┴────────────╯
```

이제 플러그인을 수동으로 중지하면 더 이상 실행되지 않는 것을 볼 수 있습니다.

```nu
plugin stop gstat
plugin list | where name == gstat | select name is_running
# =>
╭───┬───────┬────────────╮
│ # │ name  │ is_running │
├───┼───────┼────────────┤
│ 0 │ gstat │ false      │
╰───┴───────┴────────────╯
```

### 플러그인 가비지 수집기

위에서 언급했듯이 Nu에는 일정 기간(기본적으로 10초) 동안 활발하게 사용되지 않는 플러그인을 자동으로 중지하는 플러그인 가비지 수집기가 함께 제공됩니다. 이 동작은 완전히 구성할 수 있습니다.

```nu
$env.config.plugin_gc = {
    # 달리 지정되지 않은 플러그인에 대한 설정:
    default: {
        enabled: true # 플러그인을 자동으로 중지하지 않으려면 false로 설정
        stop_after: 10sec # 플러그인이 비활성화된 후 중지하기 전에 대기할 시간
    }
    # 플러그인 이름별로 특정 플러그인에 대한 설정
    # (`plugin list`에서 보는 것):
    plugins: {
        gstat: {
            stop_after: 1min
        }
        inc: {
            stop_after: 0sec # 가능한 한 빨리 중지
        }
        example: {
            enabled: false # 자동으로 중지하지 않음
        }
    }
}
```

플러그인이 활성 상태로 간주되는 시기에 대한 정보는 [기여자 책의 관련 섹션](/contributor-book/plugins.html#plugin-garbage-collection)을 참조하십시오.

## 플러그인 제거

플러그인을 제거하려면 `plugin rm <plugin_name>`을 호출하십시오. 이것은 파일 이름이 아닌 플러그인 이름입니다. 예를 들어, 이전에 `~/.cargo/bin/nu_plugin_gstat` 플러그인을 추가했다면 이름은 `gstat`입니다. 제거하려면:

```nu
plugin rm gstat
```

`plugin list`를 실행하여 플러그인 이름을 확인할 수 있습니다.

`plugin rm`을 실행하면 다음에 누셸이 시작될 때 로드되지 않도록 레지스트리에서 플러그인이 제거됩니다. 그러나 플러그인에서 만든 모든 명령은 현재 누셸 세션이 끝날 때까지 범위에 남아 있습니다.

## 플러그인 개발자용

Nu 플러그인은 실행 파일입니다. Nu는 필요에 따라 실행하고 [stdin 및 stdout](https://en.wikipedia.org/wiki/Standard_streams) 또는 [로컬 소켓](https://en.wikipedia.org/wiki/Inter-process_communication)을 통해 통신합니다. Nu 플러그인은 [JSON](https://www.json.org/) 또는 [MessagePack](https://msgpack.org/)을 통신 인코딩으로 사용할 수 있습니다.

### 예제

Nu의 기본 저장소에는 플러그인 프로토콜이 작동하는 방식을 배우는 데 유용한 예제 플러그인이 포함되어 있습니다.

- [Rust](https://github.com/nushell/nushell/tree/main/crates/nu_plugin_example)
- [Python](https://github.com/nushell/nushell/blob/main/crates/nu_plugin_python)

### 디버깅

플러그인을 디버깅하는 가장 간단한 방법은 stderr에 인쇄하는 것입니다. 플러그인의 표준 오류 스트림은 Nu를 통해 리디렉션되어 사용자에게 표시됩니다.

#### 추적

Nu 플러그인 프로토콜 메시지 스트림은 [trace_nu_plugin](https://crates.io/crates/trace_nu_plugin/)을 사용하여 진단 목적으로 캡처할 수 있습니다.

::: warning
추적 래퍼로 플러그인이 설치되어 있는 동안 추적 출력이 누적됩니다. 큰 파일이 가능합니다. 추적이 끝나면 `plugin rm`으로 플러그인을 제거하고 추적 래퍼 없이 다시 설치해야 합니다.\*\*
:::

### 개발자 도움말

Nu의 플러그인 문서는 진행 중입니다. 확실하지 않은 점이 있으면 [Nu Discord](https://discord.gg/NtAbbGn)의 #plugins 채널에서 질문하는 것이 좋습니다!

### 자세한 내용

[기여자 책의 플러그인 장](/contributor-book/plugins.md)에서는 소프트웨어 개발자 관점에서 플러그인이 작동하는 방식의 복잡성에 대해 자세히 설명합니다.
