---
prev:
  text: 누셸 시작하기
  link: /book/coming_to_nu.md
---
# Bash에서 오신 분들을 위해

::: tip
Windows에서 `Git Bash`를 사용하는 경우, Windows 경로 환경 변수에서 명시적으로 사용 가능하게 설정하지 않은 이상 `ln`, `grep`, `vi` 등과 같은 외부 명령은 기본적으로 누셸에서 사용할 수 없습니다.
이러한 명령을 누셸에서도 사용할 수 있도록 하려면 `append` 또는 `prepend`를 사용하여 `config.nu`에 다음 줄을 추가하십시오.

```nu
$env.Path = ($env.Path | prepend 'C:\Program Files\Git\usr\bin')
```

:::

## 명령어

| Bash                                 | Nu                                                            | 작업                                                              |
| ------------------------------------ | ------------------------------------------------------------- | ----------------------------------------------------------------- |
| `ls`                                 | `ls`                                                          | 현재 디렉터리의 파일 목록을 표시합니다.                          |
| `ls <dir>`                           | `ls <dir>`                                                    | 지정된 디렉터리의 파일 목록을 표시합니다.                            |
| `ls pattern*`                        | `ls pattern*`                                                 | 지정된 패턴과 일치하는 파일 목록을 표시합니다.                            |
| `ls -la`                             | `ls --long --all` 또는 `ls -la`                                 | 숨겨진 파일을 포함하여 사용 가능한 모든 정보와 함께 파일 목록을 표시합니다. |
| `ls -d */`                           | `ls \| where type == dir`                                     | 디렉터리 목록을 표시합니다.                                                  |
| `find . -name *.rs`                  | `ls **/*.rs`                                                  | 지정된 패턴과 일치하는 모든 파일을 재귀적으로 찾습니다.             |
| `find . -name Makefile \| xargs vim` | `ls **/Makefile \| get name \| vim ...$in`                    | 값을 명령 매개변수로 전달합니다.                                 |
| `cd <directory>`                     | `cd <directory>`                                              | 지정된 디렉터리로 변경합니다.                                     |
| `cd`                                 | `cd`                                                          | 홈 디렉터리로 변경합니다.                                      |
| `cd -`                               | `cd -`                                                        | 이전 디렉터리로 변경합니다.                                  |
| `mkdir <path>`                       | `mkdir <path>`                                                | 지정된 경로를 만듭니다.                                            |
| `mkdir -p <path>`                    | `mkdir <path>`                                                | 필요한 경우 상위 디렉터리를 만들면서 지정된 경로를 만듭니다.             |
| `touch test.txt`                     | `touch test.txt`                                              | 파일을 만듭니다.                                                     |
| `> <path>`                           | `out> <path>` 또는 `o> <path>`                                  | 명령 출력을 파일에 저장합니다.                                     |
|                                      | `\| save <path>`                                              | 명령 출력을 구조화된 데이터로 파일에 저장합니다.                  |
| `>> <path>`                          | `out>> <path>` 또는 `o>> <path>`                                | 명령 출력을 파일에 추가합니다.                                   |
|                                      | `\| save --append <path>`                                     | 명령 출력을 구조화된 데이터로 파일에 추가합니다.                |
| `> /dev/null`                        | `\| ignore`                                                   | 명령 출력을 버립니다.                                            |
| `> /dev/null 2>&1`                   | `out+err>\| ignore` 또는 `o+e>\| ignore`                        | stderr를 포함하여 명령 출력을 버립니다.                          |
| `command 2>&1 \| less`               | `command out+err>\| less` 또는 `command o+e>\| less`            | 외부 명령의 stdout 및 stderr를 less로 파이프합니다. (참고: 내부 명령의 페이징 출력에는 [explore](explore.html)를 사용하십시오.) |
| `cmd1 \| tee log.txt \| cmd2`        | `cmd1 \| tee { save log.txt } \| cmd2`                        | 명령 출력을 로그 파일로 티합니다.                                  |
| `command \| head -5`                 | `command \| first 5`                                          | 내부 명령의 출력을 처음 5개 행으로 제한합니다. (또한 `last` 및 `skip` 참조) |
| `cat <path>`                         | `open --raw <path>`                                           | 지정된 파일의 내용을 표시합니다.                            |
|                                      | `open <path>`                                                 | 구조화된 데이터로 파일을 읽습니다.                                    |
| `mv <source> <dest>`                 | `mv <source> <dest>`                                          | 파일을 새 위치로 이동합니다.                                         |
| `for f in *.md; do echo $f; done`    | `ls *.md \| each { $in.name }`                                | 목록을 반복하고 결과를 반환합니다.                            |
| `for i in $(seq 1 10); do echo $i; done` | `for i in 1..10 { print $i }`                             | 목록을 반복하고 결과에 대해 명령을 실행합니다.                  |
| `cp <source> <dest>`                 | `cp <source> <dest>`                                          | 파일을 새 위치로 복사합니다.                                         |
| `cp -r <source> <dest>`              | `cp -r <source> <dest>`                                       | 디렉터리를 새 위치로 재귀적으로 복사합니다.                     |
| `rm <path>`                          | `rm <path>`                                                   | 지정된 파일을 제거합니다.                                             |
|                                      | `rm -t <path>`                                                | 지정된 파일을 시스템 휴지통으로 이동합니다.                           |
| `rm -rf <path>`                      | `rm -r <path>`                                                | 지정된 경로를 재귀적으로 제거합니다.                                |
| `date -d <date>`                     | `"<date>" \| into datetime -f <format>`                       | 날짜를 구문 분석합니다. ([형식 문서](https://docs.rs/chrono/0.4.15/chrono/format/strftime/index.html)) |
| `sed`                                | `str replace`                                                 | 문자열에서 패턴을 찾아 바꿉니다.                            |
| `grep <pattern>`                     | `where $it =~ <substring>` 또는 `find <substring>`              | 하위 문자열을 포함하는 문자열을 필터링합니다.                         |
| `man <command>`                      | `help <command>`                                              | 지정된 명령에 대한 도움말을 가져옵니다.                                  |
|                                      | `help commands`                                               | 사용 가능한 모든 명령을 나열합니다.                                       |
|                                      | `help --find <string>`                                        | 사용 가능한 모든 명령에서 일치하는 항목을 검색합니다.                        |
| `command1 && command2`               | `command1; command2`                                          | 명령을 실행하고 성공하면 두 번째 명령을 실행합니다.                |
| `stat $(which git)`                  | `stat ...(which git).path`                                    | 명령 출력을 다른 명령의 인수로 사용합니다.                  |
| `echo /tmp/$RANDOM`                  | `$"/tmp/(random int)"`                                        | 문자열에서 명령 출력을 사용합니다.                                    |
| `cargo b --jobs=$(nproc)`            | `cargo b $"--jobs=(sys cpu \| length)"`                       | 옵션에서 명령 출력을 사용합니다.                                   |
| `echo $PATH`                         | `$env.PATH` (비-Windows) 또는 `$env.Path` (Windows)            | 현재 경로를 확인합니다.                                              |
| `echo $?`                            | `$env.LAST_EXIT_CODE`                                         | 마지막으로 실행된 명령의 종료 상태를 확인합니다.                  |
| `<update ~/.bashrc>`                 | `vim $nu.config-path`                                         | PATH를 영구적으로 업데이트합니다.                                           |
| `export PATH = $PATH:/usr/other/bin` | `$env.PATH = ($env.PATH \| append /usr/other/bin)`            | PATH를 일시적으로 업데이트합니다.                                           |
| `export`                             | `$env`                                                        | 현재 환경 변수를 나열합니다.                            |
| `<update ~/.bashrc>`                 | `vim $nu.config-path`                                         | 환경 변수를 영구적으로 업데이트합니다.                          |
| `FOO=BAR ./bin`                      | `FOO=BAR ./bin`                                               | 환경을 일시적으로 업데이트합니다.                                    |
| `export FOO=BAR`                     | `$env.FOO = BAR`                                              | 현재 세션에 대한 환경 변수를 설정합니다.                      |
| `echo $FOO`                          | `$env.FOO`                                                    | 환경 변수를 사용합니다.                                        |
| `echo ${FOO:-fallback}`              | `$env.FOO? \| default "ABC"`                                  | 설정되지 않은 변수 대신 대체 값을 사용합니다.                      |
| `unset FOO`                          | `hide-env FOO`                                                | 현재 세션에 대한 환경 변수를 설정 해제합니다.                    |
| `alias s="git status -sb"`           | `alias s = git status -sb`                                    | 별칭을 일시적으로 정의합니다.                                       |
| `type FOO`                           | `which FOO`                                                   | 명령에 대한 정보(내장, 별칭 또는 실행 파일)를 표시합니다. |
| `<update ~/.bashrc>`                 | `vim $nu.config-path`                                         | 별칭을 영구적으로 추가하고 편집합니다(새 셸의 경우).                   |
| `bash -c <commands>`                 | `nu -c <commands>`                                            | 명령 파이프라인을 실행합니다.                                        |
| `bash <script file>`                 | `nu <script file>`                                            | 스크립트 파일을 실행합니다.                                                 |
| `\`                                  | `( <command> )`                                               | 명령은 `(` 및 `)`로 래핑될 때 여러 줄에 걸쳐 있을 수 있습니다.   |
| `pwd` 또는 `echo $PWD`                 | `pwd` 또는 `$env.PWD`                                           | 현재 디렉터리를 표시합니다.                                     |
| `read var`                           | `let var = input`                                             | 사용자로부터 입력을 받습니다.                                           |
| `read -s secret`                     | `let secret = input -s`                                       | 키 입력을 인쇄하지 않고 사용자로부터 비밀 값을 가져옵니다.      |

## 히스토리 대체 및 기본 키 바인딩

| Bash                                 | Nu                                                            | 작업                                                              |
| ------------------------------------ | ------------------------------------------------------------- | ----------------------------------------------------------------- |
| `!!`                                 | `!!`                                                          | 히스토리에서 마지막 명령줄을 삽입합니다.                              |
| `!$`                                 | `!$`                                                          | 히스토리에서 마지막으로 공간으로 구분된 토큰을 삽입합니다.                |
| `!&lt;n&gt;` (예: `!5`)                  | `!&lt;n&gt;`                                                        | 히스토리 시작부터 &lt;n&gt;번째 명령을 삽입합니다.          |
|                                      |                                                               | 팁: `history \| enumerate \| last 10`을 사용하여 최근 위치를 표시합니다.   |
| `!&lt;-n&gt;` (예: `!-5`)                | `!&lt;-n&gt;`                                                       | 히스토리 끝에서 &lt;n&gt;번째 명령을 삽입합니다.                |
| `!&lt;string&gt;` (예: `!ls`)            | `!&lt;string&gt;`                                                   | 문자열로 시작하는 가장 최근 히스토리 항목을 삽입합니다.   |
| <kbd>Ctrl/Cmd</kbd>+<kbd>R</kbd>     | <kbd>Ctrl/Cmd</kbd>+<kbd>R</kbd>                              | 역방향 히스토리 검색                                            |
| (Emacs 모드) <kbd>Ctrl</kbd>+<kbd>X</kbd><kbd>Ctrl</kbd>+<kbd>E</kbd> | <kbd>Ctrl/Cmd</kbd>+<kbd>O</kbd> | `$env.EDITOR`에 정의된 편집기에서 명령줄을 편집합니다.   |
| (Vi 명령 모드) <kbd>V</kbd>       | <kbd>Ctrl/Cmd</kbd>+<kbd>O</kbd>                              | `$env.EDITOR`에 정의된 편집기에서 명령줄을 편집합니다.       |

가장 일반적인 Emacs 모드 및 Vi 모드 키 바인딩도 사용할 수 있습니다. [Reedline 장](line_editor.html#editing-mode)을 참조하십시오.

::: tip
Bash에서는 <kbd>Enter</kbd>를 눌러 명령줄을 실행하면 즉시 히스토리 대체가 발생합니다.
그러나 누셸은 <kbd>Enter</kbd>를 누른 후 명령줄에 대체를 *삽입*합니다.
이를 통해 대체를 확인하고 필요한 경우 실행 전에 추가 편집을 할 수 있습니다.

이 동작은 "편집기에서 명령줄 편집"에도 적용됩니다. Bash는 편집기를 종료한 후 즉시 명령을 실행하지만 누셸(Fish 및 Zsh와 같은 다른 최신 셸과 마찬가지로)은 편집기 내용을 명령줄에 삽입하여 실행하기 전에 검토하고 변경할 수 있도록 합니다.
:::
