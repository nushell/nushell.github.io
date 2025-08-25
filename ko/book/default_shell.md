---
prev:
  text: Nu 설치
  link: /book/installation.md
next:
  text: 시작하기
  link: /book/getting_started.md
---
# 기본 셸

## 터미널에서 Nu를 기본 셸로 설정하기

|     터미널     | 플랫폼     |                                                                                                                 지침                                                                                                                 |
| :--------------: | ------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|  GNOME 터미널  | Linux 및 BSD |                                  `편집 > 기본 설정`을 엽니다. 오른쪽 패널에서 `명령` 탭을 선택하고 `내 셸 대신 사용자 지정 명령 실행`을 선택한 다음 `사용자 지정 명령`을 Nu 경로로 설정합니다.                                  |
|  GNOME 콘솔   | Linux 및 BSD |  `gsettings set org.gnome.Console shell "['/usr/bin/nu']"` 명령을 입력합니다(`/usr/bin/nu`를 Nu 경로로 바꿉니다). 또는 [dconf 편집기](https://apps.gnome.org/DconfEditor/)를 사용하여 `/org/gnome/Console/shell` 키를 편집합니다.   |
|      Kitty       | Linux 및 BSD |                                                     `Ctrl`+`Shift`+`F2`를 눌러 `kitty.conf`를 엽니다. `shell` 변수로 이동하여 줄의 주석을 해제하고 `.`을 Nu 경로로 바꿉니다.                                                      |
|     Konsole      | Linux 및 BSD |                                                                                   `설정 > 현재 프로필 편집`을 엽니다. `명령`을 Nu 경로로 설정합니다.                                                                                   |
|  XFCE 터미널   | Linux 및 BSD |                                                           `편집 > 기본 설정`을 엽니다. `내 셸 대신 사용자 지정 명령 실행`을 확인하고 `사용자 지정 명령`을 Nu 경로로 설정합니다.                                                           |
|   Terminal.app   | macOS        | `터미널 > 기본 설정`을 엽니다. 기본 탭이어야 하는 `프로필` 탭에 있는지 확인합니다. 오른쪽 패널에서 `셸` 탭을 선택합니다. `명령 실행`을 선택하고 텍스트 상자에 Nu 경로를 입력한 다음 `셸 내부에서 실행`을 선택 취소합니다. |
|      iTerm2      | macOS        |                       `iTerm > 기본 설정`을 엽니다. `프로필` 탭을 선택합니다. 오른쪽 패널의 `명령` 아래에서 드롭다운을 `로그인 셸`에서 `사용자 지정 셸`로 변경하고 텍스트 상자에 Nu 경로를 입력합니다.                       |
| Windows 터미널 | Windows      |    `Ctrl`+`,`를 눌러 `설정`을 엽니다. `새 프로필 추가 > 새 빈 프로필`로 이동합니다. '이름'을 입력하고 '명령줄' 텍스트 상자에 Nu 경로를 입력합니다. `시작` 옵션으로 이동하여 Nu를 '기본 프로필'로 선택합니다. `저장`을 누릅니다.     |

## Nu를 로그인 셸로 설정하기 (Linux, BSD 및 macOS)

::: warning
Nu는 POSIX 호환을 의도하지 않았습니다.
시스템의 일부 프로그램(또는 해당 설명서)이 로그인 셸이 [POSIX](https://en.wikipedia.org/wiki/POSIX) 호환이라고 가정할 수 있다는 점에 유의하십시오.
이 가정을 깨면 예기치 않은 문제가 발생할 수 있습니다. 자세한 내용은 [구성 - 로그인 셸](./configuration.md#configuring-nu-as-a-login-shell)을 참조하십시오.
:::

로그인 셸을 설정하려면 [`chsh`](https://linux.die.net/man/1/chsh) 명령을 사용할 수 있습니다.
일부 Linux 배포판에는 `/etc/shells`에 유효한 셸 목록이 있으며 Nu가 화이트리스트에 포함될 때까지 셸 변경을 허용하지 않습니다.
`shells` 파일을 업데이트하지 않은 경우 아래와 유사한 오류가 표시될 수 있습니다.

@[code](@snippets/installation/chsh_invalid_shell_error.sh)

Nu 바이너리를 `shells` 파일에 추가하여 허용된 셸 목록에 Nu를 추가할 수 있습니다.
추가할 경로는 `which nu` 명령으로 찾을 수 있으며 일반적으로 `$HOME/.cargo/bin/nu`입니다.
