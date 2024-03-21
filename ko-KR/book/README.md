# 소개

Nushell 프로젝트에 오신 것을 환영합니다.
이 프로젝트의 목표는 파이프로 단순한 명령들을 연결하는 유닉스 셸 철학에 현대적인 개발 스타일을 가져오는 것이 목표입니다.
따라서, 셸이나 프로그래밍 언어로서 따로 존재하는 것보다, Nushell은 하나의 패키지에 프로그래밍 언어와 셸을 모두 포함함으로써 두 역할을 모두 수행합니다.

Nu는 bash을 비록한 전통적인 셸, Powershell 같은 오브젝트 기반 셸, TypeScript 같은 "gradually-typed" 언어, 함수형 프로그래밍, 시스템 프로그래밍 등의 많은 익숙한 영역에서 영향을 받았습니다.
하지만 Nu는 잡다하게 다재다능하기보다는, 다음과 같은 것에 집중합니다.

- 현대적인 느낌의 유연한 크로스 플랫폼 셸이 되기
- 데이터 구조를 활용하는 현대적인 프로그래밍 언어처럼 문제를 해결하기
- 깔끔한 IDE 지원과 명료한 에러 메시지 제공하기

## This Book

이 책은 여러 챕터와 섹션으로 구성되었습니다.
챕터 헤더를 클릭하여 자세한 정보를 확인하세요.

- [시작하기](getting_started.md) Nushell을 설치하는 방법을 알려줍니다. 또한 Nushell이 bash와 같은 다른 셸들과 차별화되는 디자인 원리에 대해서도 설명합니다.
- [Nu 기초](nu_fundamentals.md) Nushell 언어의 기본 개념에 대해 설명합니다.
- [Nu로 프로그래밍하기](programming_in_nu.md) 언어의 기능에 대해 조금 더 깊게 살펴보고 코드를 구조화하는 여러 가지 방법에 대해 알아봅니다.
- [셸로서의 Nu](nu_as_a_shell.md) 환경 설정 등 셸로서의 기능에 초점을 맞춥니다.
- [Nu로 전환하기](coming_to_nu.md) 다른 셸이나 언어에서의 빠른 전환을 위한 방법들에 대해 설명합니다.
- [디자인 노트](design_notes.md) Nushell의 디자인에 관한 선택에 대한 깊이 있는 설명을 제공합니다.
- [(살짝) 더 깊게](advanced.md) 조금 더 심화된 주제들(그렇게 심오하진 않으니, 한번 읽어 보세요!)을 포함합니다.

## Nushell의 구성

Nushell 프로젝트는 여러 개의 다른 레포지토리와 하위 프로젝트들로 구성되어 있습니다.
[Nushell GitHub organization](https://github.com/nushell)에서 모두 확인할 수 있습니다.

- 메인 Nushell 레포지토리는 [여기](https://github.com/nushell/nushell)에 있습니다. 복수의 create들로 나누어져 있으며, 당신의 프로젝트에 별개의 라이브러리들로서 사용될 수 있습니다.
- 이 책을 포함한 [nushell.sh](https://www.nushell.sh) 페이지의 레포지토리는, [여기](https://github.com/nushell/nushell.github.io)에 있습니다.
- Nushell은 자체 개발한 [라인 에디터 라이브러리](https://github.com/nushell/reedline)가 있습니다.
- [`nu_scripts`](https://github.com/nushell/nu_scripts) 레포지토리는 패키지 매니저 를 갖추기 전에 다른 사용자들과 스크립트 또는 모듈을 공유할 수 있는 곳입니다.
- [Nana](https://github.com/nushell/nana)는 Nushell에서 그래픽 사용자 인터페이스를 실험하기 위한 레포지토리입니다.
- [Awesome Nu](https://github.com/nushell/awesome-nu) 레포지토리에는 Nushell 생태계와 호환되는 플러그인, 스크립트, 편집기 확장, 서드파티 통합 확장 프로그램들의 리스트가 있습니다.
- [Nu Showcase](https://github.com/nushell/showcase)는 Nushell에 관련한 블로그 게시물, 아트워크 등의 작업물들을 공유하는 곳입니다.
- [Request for Comment (RFC)](https://github.com/nushell/rfcs)는 주요한 설계 변경점들을 제안하고 토론할 수 있는 곳입니다. 현재 사용률이 저조하나 점점 사용하는 사람들이 많아지기를 희망하고 있습니다.

## 기여하기

우리는 기여를 환영합니다!
[보시다시피](#the-many-parts-of-nushell), 여러분이 기여를 할 수 있는 곳이 많습니다.
대부분의 레포지토리들에는 기여를 시작하기 위한 팁들과 세부 사항들이 포함된 `CONTRIBUTING.md` 파일이 있습니다. (만약 없다면, 수정해주시길 바라요!).

Nushell은 [Rust](https://www.rust-lang.org) 프로그래밍 언어로 작성되어 있습니다.
그러나 굳이 Rust를 할 줄 알아야 도움을 주실 수 있는 것은 아닙니다.
웹 개발에 대해 조금 알고 계시다면, 이 웹사이트나 Nana 프로젝트에 도움을 주실 수 있습니다.
또한 [Dataframes](dataframes.md)에서는 당신의 데이터 처리 능력을 활용하실 수 있습니다.

멋진 스크립트나 플러그인, 또는 통합 확장 등을 작성하셨다면, `nu_scripts` 또는 Awesome Nu에 기여해 주세요.
발견한 버그와 함께 재현 방법을 GitHub issue에 올려 주시는 것도 매우 유용한 도움이 됩니다!
Nushell을 사용하는 것만으로도 도움을 주실 수 있어요!

Nushell은 빠르게 발전하고 있습니다. 따라서 이 책도 업데이트에 대한 꾸준한 노력이 필요합니다.
이 책에 기여하는 것은 Markdown의 기본적인 사용법 외에 다른 어떤 특별한 능력도 필요하지 않습니다.
나아가, 이 책의 여러 부분들을 당신의 언어로 번역할 수도 있습니다.

## 커뮤니티

Nushell에 관한 사항들은 주로 [디스코드](https://discord.com/invite/NtAbbGn)에서 논의됩니다.
[X](https://twitter.com/nu_shell)계정을 팔로유하여 업데이트나 뉴스를 받을 수도 있습니다.
마지막으로, GitHub discussions나 GitHub issues를 사용하는 방법도 있어요!
