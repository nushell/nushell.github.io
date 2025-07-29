# 데이터 로드

앞서 [`ls`](/commands/docs/ls.md), [`ps`](/commands/docs/ps.md), [`date`](/commands/docs/date.md), [`sys`](/commands/docs/sys.md)와 같은 명령을 사용하여 파일, 프로세스, 시간 및 시스템 자체에 대한 정보를 로드하는 방법을 보았습니다. 각 명령은 탐색할 수 있는 정보 테이블을 제공합니다. 작업할 데이터 테이블을 로드하는 다른 방법도 있습니다.

## 파일 열기

데이터 작업에서 Nu의 가장 강력한 자산 중 하나는 [`open`](/commands/docs/open.md) 명령입니다. 여러 가지 데이터 형식으로 작업할 수 있는 다중 도구입니다. 이것이 무엇을 의미하는지 보려면 json 파일을 열어 보겠습니다.

@[code](@snippets/loading_data/vscode.sh)

[`ls`](/commands/docs/ls.md)와 유사한 방식으로 Nu가 이해하는 파일 형식을 열면 텍스트(또는 바이트 스트림) 이상의 것을 반환합니다. 여기서는 JavaScript 프로젝트의 "package.json" 파일을 엽니다. Nu는 JSON 텍스트를 인식하고 이를 데이터 테이블로 구문 분석할 수 있습니다.

보고 있는 프로젝트의 버전을 확인하려면 [`get`](/commands/docs/get.md) 명령을 사용할 수 있습니다.

```nu
open editors/vscode/package.json | get version
# => 1.0.0
```

Nu는 현재 데이터를 테이블로 직접 로드하기 위해 다음 형식을 지원합니다.

- csv
- eml
- ics
- ini
- json
- [nuon](#nuon)
- ods
- [SQLite 데이터베이스](#sqlite)
- ssv
- toml
- tsv
- url
- vcf
- xlsx / xls
- xml
- yaml / yml

::: tip 알고 계셨나요?
내부적으로 `open`은 범위에서 파일 확장자와 일치하는 `from ...` 하위 명령을 찾습니다.
따라서 자신만의 `from ...` 하위 명령을 만들어 `open`에서 지원하는 파일 형식 집합을 간단히 확장할 수 있습니다.
:::

하지만 이러한 형식이 아닌 텍스트 파일을 로드하면 어떻게 될까요? 시도해 보겠습니다.

```nu
open README.md
```

파일 내용이 표시됩니다.

내부적으로 Nu가 이러한 텍스트 파일에서 보는 것은 하나의 큰 문자열입니다. 다음으로 이러한 문자열을 사용하여 필요한 데이터를 추출하는 방법을 설명합니다.

## NUON

누셸 객체 표기법(NUON)은 자바스크립트 객체 표기법(JSON)이 자바스크립트에 대해 하는 것과 같은 역할을 누셸에 대해 하는 것을 목표로 합니다.
즉, NUON 코드는 일부 데이터 구조를 설명하는 유효한 누셸 코드입니다.
예를 들어, 이것은 유효한 NUON입니다([기본 구성 파일](https://github.com/nushell/nushell/blob/main/crates/nu-utils/src/default_files/default_config.nu)의 예).

```nu
{
  menus: [
    # 기본 누셸 메뉴 구성
    # 소스 매개변수 없음 참고
    {
      name: completion_menu
      only_buffer_difference: false
      marker: "| "
      type: {
          layout: columnar
          columns: 4
          col_width: 20   # 선택적 값. 누락된 경우 모든 화면 너비가 열 너비를 계산하는 데 사용됩니다.
          col_padding: 2
      }
      style: {
          text: green
          selected_text: green_reverse
          description_text: yellow
      }
    }
  ]
}
```

JSON과 매우 유사하다는 것을 알 수 있으며, 맞습니다.
**NUON은 JSON의 상위 집합입니다!**
즉, 모든 JSON 코드는 유효한 NUON 코드이므로 유효한 누셸 코드입니다.
JSON에 비해 NUON은 더 "인간 친화적"입니다.
예를 들어, 주석이 허용되고 쉼표가 필요하지 않습니다.

현재 NUON의 한 가지 제한 사항은 모든 누셸 [데이터 유형](types_of_data.md)을 나타낼 수 없다는 것입니다.
가장 주목할 만한 점은 NUON이 블록의 직렬화를 허용하지 않는다는 것입니다.

## 문자열 처리

Nu 외부에서 들어오는 데이터로 작업할 때 중요한 부분은 Nu가 이해하는 형식이 항상 아니라는 것입니다. 종종 이 데이터는 문자열로 제공됩니다.

다음 데이터 파일이 있다고 상상해 봅시다.

```nu
open people.txt
# => Octavia | Butler | Writer
# => Bob | Ross | Painter
# => Antonio | Vivaldi | Composer
```

원하는 각 데이터 비트는 파이프('|') 기호로 구분되고 각 사람은 별도의 줄에 있습니다. Nu는 기본적으로 파이프로 구분된 파일 형식이 없으므로 직접 구문 분석해야 합니다.

파일을 가져올 때 가장 먼저 해야 할 일은 한 번에 한 줄씩 작업하는 것입니다.

```nu
open people.txt | lines
# => ───┬──────────────────────────────
# =>  0 │ Octavia | Butler | Writer
# =>  1 │ Bob | Ross | Painter
# =>  2 │ Antonio | Vivaldi | Composer
# => ───┴──────────────────────────────
```

목록으로 돌아왔기 때문에 줄 단위로 작업하고 있음을 알 수 있습니다. 다음 단계는 행을 좀 더 유용한 것으로 분할할 수 있는지 확인하는 것입니다. 이를 위해 [`split`](/commands/docs/split.md) 명령을 사용합니다. 이름에서 알 수 있듯이 [`split`](/commands/docs/split.md)는 구분된 문자열을 분할하는 방법을 제공합니다. [`split`](/commands/docs/split.md)의 `column` 하위 명령을 사용하여 내용을 여러 열로 분할합니다. 구분 기호가 무엇인지 알려주면 나머지는 알아서 처리합니다.

```nu
open people.txt | lines | split column "|"
# => ───┬──────────┬───────────┬───────────
# =>  # │ column1  │ column2   │ column3
# => ───┼──────────┼───────────┼───────────
# =>  0 │ Octavia  │  Butler   │  Writer
# =>  1 │ Bob      │  Ross     │  Painter
# =>  2 │ Antonio  │  Vivaldi  │  Composer
# => ───┴──────────┴───────────┴───────────
```

거의 올바르게 보입니다. 추가 공백이 있는 것 같습니다. [`trim`](/commands/docs/str_trim.md)을 사용하여 추가 공백을 제거해 보겠습니다.

```nu
open people.txt | lines | split column "|" | str trim
# => ───┬─────────┬─────────┬──────────
# =>  # │ column1 │ column2 │ column3
# => ───┼─────────┼─────────┼──────────
# =>  0 │ Octavia │ Butler  │ Writer
# =>  1 │ Bob     │ Ross    │ Painter
# =>  2 │ Antonio │ Vivaldi │ Composer
# => ───┴─────────┴─────────┴──────────
```

나쁘지 않습니다. [`split`](/commands/docs/split.md) 명령은 사용할 수 있는 데이터를 제공합니다. 또한 기본 열 이름을 제공합니다.

```nu
open people.txt | lines | split column "|" | str trim | get column1
# => ───┬─────────
# =>  0 │ Octavia
# =>  1 │ Bob
# =>  2 │ Antonio
# => ───┴─────────
```

기본 이름을 사용하는 대신 열 이름을 지정할 수도 있습니다.

```nu
open people.txt | lines | split column "|" first_name last_name job | str trim
# => ───┬────────────┬───────────┬──────────
# =>  # │ first_name │ last_name │ job
# => ───┼────────────┼───────────┼──────────
# =>  0 │ Octavia    │ Butler    │ Writer
# =>  1 │ Bob        │ Ross      │ Painter
# =>  2 │ Antonio    │ Vivaldi   │ Composer
# => ───┴────────────┴───────────┴──────────
```

이제 데이터가 테이블에 있으므로 이전에 테이블에서 사용했던 모든 명령을 사용할 수 있습니다.

```nu
open people.txt | lines | split column "|" first_name last_name job | str trim | sort-by first_name
# => ───┬────────────┬───────────┬──────────
# =>  # │ first_name │ last_name │ job
# => ───┼────────────┼───────────┼──────────
# =>  0 │ Antonio    │ Vivaldi   │ Composer
# =>  1 │ Bob        │ Ross      │ Painter
# =>  2 │ Octavia    │ Butler    │ Writer
# => ───┴────────────┴───────────┴──────────
```

문자열로 작업하는 데 사용할 수 있는 다른 명령이 있습니다.

- [`str`](/commands/docs/str.md)
- [`lines`](/commands/docs/lines.md)

Nu가 이해할 수 있는 구조를 가진 데이터가 있는 경우 호출할 수 있는 도우미 명령 집합도 있습니다. 예를 들어 Rust 잠금 파일을 열어 보겠습니다.

```nu
open Cargo.lock
# => # This file is automatically @generated by Cargo.
# => # It is not intended for manual editing.
# => [[package]]
# => name = "adhoc_derive"
# => version = "0.1.2"
```

"Cargo.lock" 파일은 실제로 .toml 파일이지만 파일 확장자는 .toml이 아닙니다. 괜찮습니다. `toml` 하위 명령을 사용하여 [`from`](/commands/docs/from.md) 명령을 사용할 수 있습니다.

@[code](@snippets/loading_data/cargo-toml.sh)

[`from`](/commands/docs/from.md) 명령은 Nu가 열고 이해할 수 있는 각 구조화된 데이터 텍스트 형식에 대해 지원되는 형식을 하위 명령으로 전달하여 사용할 수 있습니다.

## 원시 모드에서 열기

파일을 열고 즉시 해당 데이터 테이블로 작업할 수 있다는 것은 도움이 되지만 항상 원하는 것은 아닙니다. 기본 텍스트에 액세스하려면 [`open`](/commands/docs/open.md) 명령에 선택적 `--raw` 플래그를 사용할 수 있습니다.

```nu
open Cargo.toml --raw
# => [package]                                                                                        name = "nu"
# => version = "0.1.3"
# => authors = ["Yehuda Katz <wycats@gmail.com>", "Sophia Turner <547158+sophiajt@users.noreply.github.com>"]
# => description = "A shell for the GitHub era"
# => license = "MIT"
```

## SQLite

SQLite 데이터베이스는 파일 확장자에 관계없이 [`open`](/commands/docs/open.md)에 의해 자동으로 감지됩니다. 전체 데이터베이스를 열 수 있습니다.

```nu
open foo.db
```

또는 특정 테이블을 [`get`](/commands/docs/get.md)합니다.

```nu
open foo.db | get some_table
```

또는 원하는 SQL 쿼리를 실행할 수 있습니다.

```nu
open foo.db | query db "select * from some_table"
```

(참고: 일부 이전 버전의 Nu는 `query db` 대신 `into db | query`를 사용합니다.)

## URL 가져오기

파일 시스템에서 파일을 로드하는 것 외에도 [`http get`](/commands/docs/http.md) 명령을 사용하여 URL을 로드할 수도 있습니다. 이렇게 하면 인터넷에서 URL의 내용을 가져와 반환합니다.

@[code](@snippets/loading_data/rust-lang-feed.sh)
