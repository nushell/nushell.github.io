---
home: true
heroImage: null
heroText: Nushell
tagline: 새로운 타입의 셸
actionText: 시작하기 →
actionLink: /ko-KR/book/
features:
  - title: 어떤 운영체제든 제어하기 위한 파이프라인
    details: Nu는 Linux, macOS, BSD, 그리고 Windows에서 동작합니다. 한 번 배우고, 어디서든 사용하세요.
  - title: 모든 것은 데이터입니다
    details: Nu 파이프라인은 언제나 안전하게 선택하고, 필터링하고, 정렬할 수 있는 구조화된 데이터를 사용합니다. 문자열 파싱은 그만두고 문제를 해결하세요.
  - title: 강력한 플러그인
    details: 강력한 플러그인으로 Nu를 쉽게 확장할 수 있습니다.
---

<img src="https://www.nushell.sh/frontpage/ls-example.png" alt="Screenshot showing using the ls command" class="hero"/>

### Nu는 기존의 데이터를 사용할 수 있습니다

Nu는 [JSON, YAML, SQLite, Excel 등](/book/loading_data.html)의 데이터 포맷을 지원합니다. 데이터들이 파일, 데이터베이스, 웹 API 어디에 있든지 쉽게 Nu 파이프라인에 가져올 수 있습니다.

<img src="https://www.nushell.sh/frontpage/fetch-example.png" alt="Screenshot showing fetch with a web API" class="hero"/>

### Nu의 에러 메시지는 알아보기 쉽습니다

Nu에는 데이터 타입이 있기 때문에, 타입이 없는 다른 셸들이 잡지 못하는 버그들을 감지할 수 있습니다. 또한 만약에 오류가 발생한다면, Nu는 정확히 어디서, 왜 오류가 발생했는지 알려줍니다.

<img src="https://www.nushell.sh/frontpage/miette-example.png" alt="Screenshot showing Nu catching a type error" class="hero"/>

## Nu 사용하기

Nushell은 [실행 파일](https://github.com/nushell/nushell/releases)로, [패키지 매니저](https://repology.org/project/nushell/versions)를 통해, [GitHub Action](https://github.com/marketplace/actions/setup-nu)에서, 또는 [소스코드](https://github.com/nushell/nushell)로 사용할 수 있습니다. 자세한 사항은 [설치 매뉴얼](/book/installation.html) 에서 확인해 주세요.

#### macOS / Linux:

##### Homebrew

```shell
$ brew install nushell
```

##### Nix profile

```shell
$ nix profile install nixpkgs#nushell
```

#### Windows:

```shell
$ winget install nushell
```

설치 후에는 `nu` 커맨드로 Nu를 실행해 주세요.

## 커뮤니티

Nu에 대한 질문 사항이 있으시면 [디스코드](https://discord.gg/NtAbbGn)에 문의해 주세요!

[피드백](https://github.com/nushell/nushell.github.io/issues) 이나 [PR](https://github.com/nushell/nushell.github.io/pulls)을 통해 이 사이트를 개선시킬 수 있습니다.
