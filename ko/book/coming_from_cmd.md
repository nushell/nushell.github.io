# CMD.EXE에서 오신 분들을 위해

이 표는 Nu 0.67.0에 대해 마지막으로 업데이트되었습니다.

| CMD.EXE                              | Nu                                                                                  | 작업                                                                  |
| ------------------------------------ | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `ASSOC`                              |                                                                                     | 파일 확장자 연결을 표시하거나 수정합니다.                      |
| `BREAK`                              |                                                                                     | 디버거 중단점을 트리거합니다.                                           |
| `CALL <filename.bat>`                | `<filename.bat>`                                                                    | 배치 프로그램을 실행합니다.                                                   |
|                                      | `nu <filename>`                                                                     | 새 컨텍스트에서 nu 스크립트를 실행합니다.                                    |
|                                      | `source <filename>`                                                                 | 이 컨텍스트에서 nu 스크립트를 실행합니다.                                       |
|                                      | `use <filename>`                                                                    | nu 스크립트를 모듈로 실행합니다.                                           |
| `CD` 또는 `CHDIR`                      | `$env.PWD`                                                                          | 현재 작업 디렉터리를 가져옵니다.                                     |
| `CD <directory>`                     | `cd <directory>`                                                                    | 현재 디렉터리를 변경합니다.                                          |
| `CD /D <drive:directory>`            | `cd <drive:directory>`                                                              | 현재 디렉터리를 변경합니다.                                          |
| `CLS`                                | `clear`                                                                             | 화면을 지웁니다.                                                      |
| `COLOR`                              |                                                                                     | 콘솔 기본 전경/배경색을 설정합니다.                  |
|                                      | `ansi {flags} (code)`                                                               | 색상을 변경하기 위해 ANSI 코드를 출력합니다.                                     |
| `COPY <source> <destination>`        | `cp <source> <destination>`                                                         | 파일을 복사합니다.                                                            |
| `COPY <file1>+<file2> <destination>` | `[<file1>, <file2>] \| each { open --raw } \| str join \| save --raw <destination>` | 여러 파일을 하나로 추가합니다.                                        |
| `DATE /T`                            | `date now`                                                                          | 현재 날짜를 가져옵니다.                                                  |
| `DATE`                               |                                                                                     | 날짜를 설정합니다.                                                          |
| `DEL <file>` 또는 `ERASE <file>`       | `rm <file>`                                                                         | 파일을 삭제합니다.                                                            |
| `DIR`                                | `ls`                                                                                | 현재 디렉터리의 파일을 나열합니다.                                   |
| `ECHO <message>`                     | `print <message>`                                                                   | 지정된 값을 stdout으로 인쇄합니다.                                      |
| `ECHO ON`                            |                                                                                     | 실행된 명령을 stdout으로 에코합니다.                                      |
| `ENDLOCAL`                           | `export-env`                                                                        | 호출자에서 env를 변경합니다.                                              |
| `EXIT`                               | `exit`                                                                              | 프롬프트 또는 스크립트를 닫습니다.                                            |
| `FOR %<var> IN (<set>) DO <command>` | `for $<var> in <set> { <command> }`                                                 | 집합의 각 항목에 대해 명령을 실행합니다.                                  |
| `FTYPE`                              |                                                                                     | 파일 확장자 연결에 사용되는 파일 형식을 표시하거나 수정합니다.   |
| `GOTO`                               |                                                                                     | 레이블로 이동합니다.                                                       |
| `IF ERRORLEVEL <number> <command>`   | `if $env.LAST_EXIT_CODE >= <number> { <command> }`                                  | 마지막 명령이 지정된 오류 코드보다 크거나 같은 경우 명령을 실행합니다. |
| `IF <string> EQU <string> <command>` | `if <string> == <string> { <command> }`                                             | 문자열이 일치하면 명령을 실행합니다.                                        |
| `IF EXIST <filename> <command>`      | `if (<filename> \| path exists) { <command> }`                                      | 파일이 있으면 명령을 실행합니다.                                      |
| `IF DEFINED <variable> <command>`    | `if '$<variable>' in (scope variables).name { <command> }`                          | 변수가 정의된 경우 명령을 실행합니다.                              |
| `MD` 또는 `MKDIR`                      | `mkdir`                                                                             | 디렉터리를 만듭니다.                                                    |
| `MKLINK`                             |                                                                                     | 기호 링크를 만듭니다.                                                 |
| `MOVE`                               | `mv`                                                                                | 파일을 이동합니다.                                                          |
| `PATH`                               | `$env.Path`                                                                         | 현재 경로 변수를 표시합니다.                                     |
| `PATH <path>;%PATH%`                 | `$env.Path = ($env.Path \| append <path>`)                                          | 경로 변수를 편집합니다.                                                |
| `PATH %PATH%;<path>`                 | `$env.Path = ($env.Path \| prepend <path>`)                                         | 경로 변수를 편집합니다.                                                |
| `PAUSE`                              | `input "Press any key to continue . . ."`                                           | 스크립트 실행을 일시 중지합니다.                                                |
| `PROMPT <template>`                  | `$env.PROMPT_COMMAND = { <command> }`                                               | 터미널 프롬프트를 변경합니다.                                            |
| `PUSHD <path>`/`POPD`                | `enter <path>`/`dexit`                                                              | 작업 디렉터리를 일시적으로 변경합니다.                                  |
| `REM`                                | `#`                                                                                 | 주석                                                              |
| `REN` 또는 `RENAME`                    | `mv`                                                                                | 파일 이름을 바꿉니다.                                                          |
| `RD` 또는 `RMDIR`                      | `rm`                                                                                | 디렉터리를 제거합니다.                                                      |
| `SET <var>=<string>`                 | `$env.<var> = <string>`                                                             | 환경 변수를 설정합니다.                                             |
| `SETLOCAL`                           | (기본 동작)                                                                  | 환경 변경을 스크립트로 지역화합니다.                              |
| `START <path>`                       | `start <path>`로 부분적으로 포함됨                                                 | 시스템 구성된 기본 응용 프로그램에서 경로를 엽니다.            |
| `START <internal command>`           |                                                                                     | 지정된 내부 명령을 실행하기 위해 별도의 창을 시작합니다.           |
| `START <batch file>`                 |                                                                                     | 지정된 배치 파일을 실행하기 위해 별도의 창을 시작합니다.                 |
| `TIME /T`                            | `date now \| format date "%H:%M:%S"`                                                | 현재 시간을 가져옵니다.                                                  |
| `TIME`                               |                                                                                     | 현재 시간을 설정합니다.                                                  |
| `TITLE`                              |                                                                                     | cmd.exe 창 이름을 설정합니다.                                           |
| `TYPE`                               | `open --raw`                                                                        | 텍스트 파일의 내용을 표시합니다.                                   |
|                                      | `open`                                                                              | 구조화된 데이터로 파일을 엽니다.                                        |
| `VER`                                |                                                                                     | OS 버전을 표시합니다.                                                |
| `VERIFY`                             |                                                                                     | 파일 쓰기가 발생하는지 확인합니다.                                        |
| `VOL`                                |                                                                                     | 드라이브 정보를 표시합니다.                                                |

## 전달된 CMD.EXE 명령

Nu는 `cmd.exe`를 통해 CMD.EXE의 *일부* 내부 명령을 수락하고 실행합니다.

내부 명령은 다음과 같습니다. `ASSOC`, `CLS`, `ECHO`, `FTYPE`, `MKLINK`, `PAUSE`, `START`, `VER`, `VOL`

이러한 내부 명령은 외부 명령보다 우선합니다.

예를 들어, 현재 작업 디렉터리에 `ver.bat` 파일이 있는 경우 `^ver`를 실행하면 CMD.EXE의 내부 `VER` 명령이 실행되고 `ver.bat` 파일은 실행되지 *않습니다*.

`./ver` 또는 `ver.bat`를 실행하면 로컬 bat 파일이 실행됩니다.

Nushell에는 우선 순위가 있는 자체 [`start` 명령](/commands/docs/start.md)이 있습니다.
외부 명령 구문 `^start`를 사용하여 CMD.EXE의 내부 `START` 명령을 호출할 수 있습니다.
