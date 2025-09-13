---
prev:
  text: 모범 사례
  link: /ko/book/style_guide.md
next:
  text: 구성
  link: /ko/book/configuration.md
---

# 셸로서의 Nu

[Nu 기본 사항](nu_fundamentals.md) 및 [Nu 프로그래밍](programming_in_nu.md) 장에서는 주로 누셸의 언어 측면에 중점을 두었습니다.
이 장에서는 누셸 인터프리터(누셸 [REPL](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop))와 관련된 누셸의 부분에 대해 설명합니다.
일부 개념은 누셸 프로그래밍 언어의 일부(예: 환경 변수)인 반면, 다른 개념은 순전히 대화형 경험을 향상시키기 위해 구현되었으므로(예: 후크) 스크립트를 실행할 때와 같이 존재하지 않습니다.

누셸의 많은 매개변수는 [구성](configuration.md)할 수 있습니다.
구성 자체는 환경 변수로 저장됩니다.
또한 누셸에는 시작 시 실행되는 여러 다른 구성 파일이 있으며 여기에 사용자 지정 명령, 별칭 등을 넣을 수 있습니다.

모든 셸의 큰 특징은 [환경 변수](environment.md)입니다.
누셸에서 환경 변수는 범위가 지정되며 누셸에서 지원하는 모든 유형을 가질 수 있습니다.
이로 인해 몇 가지 추가 설계 고려 사항이 있으므로 자세한 내용은 링크된 섹션을 참조하십시오.

다른 섹션에서는 [stdout, stderr 및 종료 코드](stdout_stderr_exit_codes.md)를 사용하는 방법, [동일한 이름의 기본 제공 기능이 있는 경우 외부 명령을 실행하는 방법](./running_externals.md), [타사 프롬프트를 구성하여](3rdpartyprompts.md) 누셸과 함께 작동하는 방법을 설명합니다.

누셸의 흥미로운 기능은 여러 디렉터리에서 동시에 작업할 수 있는 [디렉터리 스택](directory_stack.md)입니다.

누셸에는 자체 줄 편집기 [Reedline](line_editor.md)도 있습니다.
누셸의 구성을 사용하여 프롬프트, 키 바인딩, 기록 또는 메뉴와 같은 Reedline 기능 중 일부를 구성할 수 있습니다.

[외부 명령에 대한 사용자 지정 서명을 정의](externs.md)할 수도 있으며, 이를 통해 [사용자 지정 완성](custom_completions.md)을 정의할 수 있습니다(사용자 지정 완성은 누셸 사용자 지정 명령에도 작동함).

[Nu의 색상 지정 및 테마](coloring_and_theming.md)에서는 누셸의 모양을 구성하는 방법에 대해 자세히 설명합니다.

백그라운드에서 실행할 일부 명령을 예약하려면 [백그라운드 작업](background_jobs.md)에서 따라야 할 간단한 지침을 제공합니다.

마지막으로 [후크](hooks.md)를 사용하면 특정 이벤트에서 실행할 누셸 코드 조각을 삽입할 수 있습니다.
