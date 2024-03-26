# 기본 셸로 설정하기

## Nu를 터미널 기본 셸로 설정하기

|      터미널      | 플랫폼       |                                                                                                                                       방법                                                                                                                                       |
| :--------------: | ------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|  GNOME Terminal  | Linux & BSDs |                                              `Edit > Preferences`을 열고 우측의 패널에서 `Command` 탭을 선택한 후, `Run a custom command instead of my shell`을 체크하고, Nu 프로그램의 경로를 `Custom command` 필드에 입력하세요.                                               |
|  GNOME Console   | Linux & BSDs |             `gsettings set org.gnome.Console shell "['/usr/bin/nu']"` 명령어(`/usr/bin/nu`를 Nu 프로그램의 경로로 대치하세요)를 실행하세요. [dconf Editor](https://apps.gnome.org/DconfEditor/)를 사용하여 `/org/gnome/Console/shell` 키를 수정하는 방법도 있습니다.             |
|      Kitty       | Linux & BSDs |                                                                  `Ctrl`+`Shift`+`F2` 키를 눌러 `kitty.conf` 파일을 여세요. `shell` 변수가 있는 줄의 주석 처리를 해제하고, `.`을 Nu 프로그램 경로로 수정하세요.                                                                   |
|     Konsole      | Linux & BSDs |                                                                                               `Settings > Edit Current Profile`를 열고, `Command`를 Nu 프로그램 경로로 설정하세요.                                                                                               |
|  XFCE Terminal   | Linux & BSDs |                                                                 `Edit > Preferences`를 열고, `Run a custom command instead of my shell`을 체크한 다음, `Custom command` 필드를 Nu 프로그램의 경로로 설정하세요.                                                                  |
|   Terminal.app   | macOS        |                                     `Terminal > Preferences`를 열고, `Profiles` 탭을 선택하세요. 우특의 패널에서 `Shell` 탭을 선택한 후, `Run command`를 체크하세요. 텍스트 박스에 Nu 경로를 입력할 후 `Run inside shell`를 체크 해제하세요.                                     |
|      iTerm2      | macOS        |                                          `iTerm > Preferences`를 열고, `Profiles` 탭을 선택하세요. 우측 패널의 `Command` 아레에서 `Login Shell` 드롭다운 메뉴를 `Custom Shell`로 변경한 후 텍스트 박스에 Nu 프로그램 경로를 입력하세요.                                          |
| Windows Terminal | Windows      | `Ctrl`+`,` 키를 눌러 `Settings`를 열고, `Add a new profile > New empty profile`을 클릭하세요. 'Name' 항목을 채우고 'Command line' 텍스트 박스에 Nu 프로그램 경로를 입력하세요. `Startup` 옵션에서 Nu가 설정된 프로파일을 'Default profile'로 설정한 후 `Save` 버튼을 클릭하세요. |

## Nu를 로그인 셸로 설정하기 (Linux, BSD & macOS)

::: 경고
Nu는 아직 개발 중이며, [POSIX](https://en.wikipedia.org/wiki/POSIX)를 준수하지 않습니다.
일부 프로그램은 로그인 셸이 POSIX를 준수하는 것을 가정하여 작성되었다는 것에 유의하세요.
로그인 셸이 POSIX를 준수하지 않으면 의도치 않은 문제가 발생할 수 있습니다.
:::

[`chsh`](https://linux.die.net/man/1/chsh) 커맨드를 통하여 로그인 셸을 변경할 수 있습니다.
어떤 리눅스 배포판들은 유효한 셸들의 위치가 `/etc/shell`에 나열되어 있어, Nu가 이 리스트에 포함되어 있지 않으면 셸을 변경하는 것을 거부할 수도 있습니다.
`shells` 파일을 업데이트하지 않고 변경하면 아래와 같은 메시지가 표시될 수 있습니다.

@[code](@snippets/installation/chsh_invalid_shell_error.sh)

`shells` 파일에 Nu 실행 파일의 위치를 추가하여 이 문제를 해결할 수 있습니다.
추가할 파일 경로는 `which nu` 커맨드를 통해 확인할 수 있으며, 보통은 `$HOME/.cargo/bin/nu`입니다.
