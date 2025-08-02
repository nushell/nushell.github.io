# Reedline, Nu의 줄 편집기

누셸의 줄 편집기 [Reedline](https://github.com/nushell/reedline)은
크로스 플랫폼이며 모듈식이고 유연하도록 설계되었습니다. 줄 편집기는
명령 기록, 유효성 검사, 완성, 힌트,
화면 페인트 등을 제어합니다.

[[toc]]

## 여러 줄 편집

Reedline은 누셸 명령줄이 여러 줄에 걸쳐 확장되도록 허용합니다. 이는 여러 가지 방법으로 수행할 수 있습니다.

1. 괄호로 묶인 표현식이 열려 있을 때 <kbd>Enter</kbd>를 누릅니다.

   예시:

   ```nu
   def my-command [] {
   ```

   여는 괄호 뒤에 <kbd>Enter </kbd>를 누르면 줄 바꿈이 삽입됩니다. 이는 여는 (그리고 유효한) `(` 및 `[` 표현식에서도 발생합니다.

   이는 블록과 클로저(위와 같이)를 만드는 데 일반적으로 사용되지만 목록, 레코드 및 테이블 리터럴에도 사용됩니다.

   ```nu
   let file = {
     name: 'repos.sqlite'
     hash: 'b939a3fa4ca011ca1aa3548420e78cee'
     version: '1.4.2'
   }
   ```

   단일 명령을 여러 줄에 걸쳐 계속하는 데에도 사용할 수 있습니다.

   ::: details 예시

   ```nu
   (
     tar
     -cvz
     -f archive.tgz
     --exclude='*.temp'
     --directory=../project/
     ./
   )
   ```

   :::

2. 후행 파이프 기호(`|`)가 있는 줄 끝에서 <kbd>Enter</kbd>를 누릅니다.

   ```nu
   ls                     |
   where name =~ '^[0-9]' | # 후행 파이프 뒤의 주석은 괜찮습니다.
   get name               |
   mv ...$in ./backups/
   ```

3. <kbd>Alt</kbd>+<kbd>Enter</kbd> 또는 <kbd>Shift</kbd>+<kbd>Enter</kbd>를 사용하여 수동으로 줄 바꿈을 삽입합니다.

   이것은 이전 명령줄의 다소 더 읽기 쉬운 버전을 만드는 데 사용할 수 있습니다.

   ```nu
   ls
   | where name =~ '^[0-9]'  # 숫자로 시작하는 파일
   | get name
   | mv ...$in ./backups/
   ```

   ::: tip
   이러한 키 바인딩 중 하나 또는 둘 다가 터미널 응용 프로그램이나 창 관리자에 의해 가로채일 수 있습니다. 예를 들어 Windows 터미널(및 Windows의 대부분의 다른 터미널 응용 프로그램)은 <kbd>Alt</kbd>+<kbd>Enter</kbd>를 터미널을 전체 화면으로 확장하는 데 할당합니다. 위의 키 바인딩 중 어느 것도 터미널에서 작동하지 않으면 다른 키 바인딩을 다음에 할당할 수 있습니다.

   ```nu
   event: { edit: insertnewline }
   ```

   자세한 내용은 아래 [키 바인딩](#keybindings)을 참조하십시오.

   :::

4. <kbd>Ctrl</kbd>+<kbd>O</kbd>를 누르면 편집기에서 현재 명령줄이 열립니다. 결과 파일을 저장하고 편집기를 종료하면 명령줄이 결과로 업데이트됩니다.

## 편집 모드 설정

Reedline을 사용하면 Vi 및 Emacs의 두 가지 모드를 사용하여 텍스트를 편집할 수 있습니다. 지정하지 않으면 기본 모드는 Emacs입니다. 모드를 변경하려면 `edit_mode` 설정을 사용하십시오.

```nu
$env.config.edit_mode = 'vi'
```

이것은 명령줄에서 변경하거나 `config.nu`에 유지할 수 있습니다.

::: note
Vi는 "일반" 모드와 "삽입" 모드가 있는 "모달" 편집기입니다. 누셸에서 Vi 모드를 사용하기 전에 Vim 또는 Neovim 편집기를 사용하여 이러한 모드에 익숙해지는 것이 좋습니다. 각각에는 모달 편집의 기본 사항(및 그 이상)을 다루는 기본 제공 자습서가 있습니다.
:::

## 기본 키 바인딩

각 편집 모드에는 Vi 및 Emacs 텍스트 편집을 위한 일반적인 키 바인딩이 함께 제공됩니다.

### Emacs 및 Vi 삽입 키 바인딩

이러한 키 바인딩 이벤트는 Emacs 및 Vi 삽입 모드 모두에 적용됩니다.

| 키                                        | 이벤트                               |
| ------------------------------------------ | ----------------------------------- |
| <kbd>Shift</kbd>+<kbd>Enter</kbd>          | 줄 바꿈 삽입                      |
| <kbd>Alt</kbd>+<kbd>Enter</kbd>            | 줄 바꿈 삽입                      |
| <kbd>Backspace</kbd>                       | 백스페이스                           |
| <kbd>End</kbd>                             | 줄 끝으로 이동                 |
| <kbd>End</kbd>                             | 기록 힌트 완성               |
| <kbd>Home</kbd>                            | 줄 시작으로 이동                  |
| <kbd>Ctrl</kbd>+<kbd>C</kbd>               | 현재 줄 취소                 |
| <kbd>Ctrl</kbd>+<kbd>L</kbd>               | 화면 지우기                        |
| <kbd>Ctrl</kbd>+<kbd>R</kbd>               | 기록 검색                      |
| <kbd>Ctrl</kbd>+<kbd>→</kbd> (오른쪽 화살표) | 기록 단어 완성               |
| <kbd>Ctrl</kbd>+<kbd>→</kbd> (오른쪽 화살표) | 단어 오른쪽으로 이동                     |
| <kbd>Ctrl</kbd>+<kbd>←</kbd> (왼쪽 화살표)  | 단어 왼쪽으로 이동                      |
| <kbd>↑</kbd> (위쪽 화살표)                    | 위로 이동                             |
| <kbd>↓</kbd> (아래쪽 화살표)                  | 아래로 이동                           |
| <kbd>←</kbd> (왼쪽 화살표)                  | 왼쪽으로 이동                           |
| <kbd>→</kbd> (오른쪽 화살표)                 | 오른쪽으로 이동                          |
| <kbd>Ctrl</kbd>+<kbd>P</kbd>               | 위로 이동                             |
| <kbd>Ctrl</kbd>+<kbd>N</kbd>               | 아래로 이동                           |
| <kbd>Ctrl</kbd>+<kbd>B</kbd>               | 왼쪽으로 이동                           |
| <kbd>Ctrl</kbd>+<kbd>F</kbd>               | 오른쪽으로 이동                          |
| <kbd>→</kbd> (오른쪽 화살표)                 | 기록 힌트 완성               |
| <kbd>Ctrl</kbd>+<kbd>F</kbd>               | 기록 힌트 완성               |
| <kbd>Alt</kbd>+<kbd>F</kbd>                | 한 단어 기록 힌트 완성      |
| <kbd>Alt</kbd>+<kbd>←</kbd> (왼쪽 화살표)   | 한 단어 기록 힌트 완성 감소 |

### Vi 삽입 키 바인딩

이러한 키 바인딩 이벤트는 Vi 삽입 모드에만 적용됩니다.

| 키            | 이벤트                    |
| -------------- | ------------------------ |
| <kbd>Esc</kbd> | Vi 일반 모드로 전환 |

### Vi 일반 키 바인딩

이러한 키 바인딩 이벤트는 Vi 일반 모드에만 적용됩니다.

| 키                                         | 이벤트               |
| ------------------------------------------- | ------------------- |
| <kbd>Ctrl</kbd>+<kbd>C</kbd>                | 현재 줄 취소 |
| <kbd>Ctrl</kbd>+<kbd>L</kbd>                | 화면 지우기        |
| <kbd>↑</kbd> (위쪽 화살표)                     | 위로 이동             |
| <kbd>↓</kbd> (아래쪽 화살표)                   | 아래로 이동           |
| <kbd>←</kbd> (왼쪽 화살표)                   | 왼쪽으로 이동           |
| <kbd>→</kbd> (오른쪽 화살표)                  | 오른쪽으로 이동          |
| <kbd>Ctrl></kbd>+<kbd>→</kbd> (오른쪽 화살표) | 한 단어 오른쪽으로 이동 |
| <kbd>Ctrl></kbd>+<kbd>←</kbd> (왼쪽 화살표)  | 한 단어 왼쪽으로 이동  |

### Vi 일반 이동

Vi와 마찬가지로 많은 이동 및 동작을 일반 모드에서 선택적 개수와 결합할 수 있습니다. 예를 들어 <kbd>3</kbd><kbd>d</kbd><kbd>w</kbd>는 다음 세 단어를 삭제합니다.

| 키                                    | 이동                                        |
| -------------------------------------- | --------------------------------------------- |
| <kbd>w</kbd>                           | 다음 단어의 시작으로 이동                |
| <kbd>e</kbd>                           | 현재 또는 다음 단어의 끝으로 이동           |
| <kbd>b</kbd>                           | 현재 또는 이전 단어의 시작으로 이동 |
| <kbd>0</kbd>                           | 줄의 시작으로 이동                         |
| <kbd>$</kbd>                           | 줄의 끝으로 이동                           |
| <kbd>h</kbd>                           | 왼쪽으로 이동                                     |
| <kbd>l</kbd>                           | 오른쪽으로 이동                                    |
| <kbd>j</kbd>                           | 아래로 이동                                     |
| <kbd>k</kbd>                           | 위로 이동                                     |
| <kbd>f</kbd>+\<char\>                  | \<char\>로 오른쪽으로 이동                        |
| <kbd>t</kbd>+\<char\>                  | \<char\> 앞까지 오른쪽으로 이동                 |
| <kbd>Shift</kbd>+<kbd>F</kbd>+\<char\> | \<char\>로 왼쪽으로 이동                         |
| <kbd>Shift</kbd>+<kbd>T</kbd>+\<char\> | \<char\> 뒤까지 왼쪽으로 이동                   |

### Vi 일반 동작

이러한 동작은 위 [Vi 일반 이동](#vi-normal-motions)의 많은 동작과 결합할 수 있습니다.

| 키                           | 동작                                             |
| ----------------------------- | -------------------------------------------------- |
| <kbd>d</kbd>                  | 삭제                                             |
| <kbd>Shift</kbd>+<kbd>D</kbd> | 줄 끝까지 삭제                              |
| <kbd>p</kbd>                  | 현재 문자 뒤에 붙여넣기                      |
| <kbd>Shift</kbd>+<kbd>P</kbd> | 현재 문자 앞에 붙여넣기                     |
| <kbd>i</kbd>                  | 현재 문자에서 Vi 삽입 모드(추가) 시작 |
| <kbd>Shift</kbd>+<kbd>I</kbd> | 줄 시작에서 삽입 모드 시작             |
| <kbd>a</kbd>                  | 현재 문자 뒤에 추가                     |
| <kbd>Shift</kbd>+<kbd>A</kbd> | 줄 끝에 추가                              |
| <kbd>0</kbd>                  | 줄 시작으로 이동                              |
| <kbd>^</kbd>                  | 줄 시작으로 이동                              |
| <kbd>$</kbd>                  | 줄 끝으로 이동                                |
| <kbd>c</kbd>                  | 변경                                             |
| <kbd>r</kbd>                  | 바꾸기                                            |
| <kbd>s</kbd>                  | 문자 대체                            |
| <kbd>x</kbd>                  | 문자 삭제                                   |
| <kbd>u</kbd>                  | 실행 취소                                               |

## 명령 기록

앞서 언급했듯이 Reedline은 편집되고 누셸로 전송되는 모든 명령을 관리하고 저장합니다. Reedline이 저장해야 하는 최대 레코드 수를 구성하려면 구성 파일에서 이 값을 조정해야 합니다.

```nu
$env.config.history.max_size = 1000
```

## 프롬프트 사용자 지정

Reedline 프롬프트는 여러 환경 변수를 사용하여 구성됩니다. 자세한 내용은 [프롬프트 구성](./configuration.md#prompt-configuration)을 참조하십시오.

## 키 바인딩

Reedline 키 바인딩은 특정 키 조합으로 트리거될 수 있는 이벤트 체인을 빌드할 수 있는 강력한 구성 요소입니다.

예를 들어, 완성 메뉴를 `Ctrl + t` 키 바인딩(기본값은 `tab`)에 매핑하고 싶다고 가정해 보겠습니다. 구성 파일에 다음 항목을 추가할 수 있습니다.

```nu
$env.config.keybindings ++= [{
    name: completion_menu
    modifier: control
    keycode: char_t
    mode: emacs
    event: { send: menu name: completion_menu }
}]
```

이 새 `config.nu`를 로드하면 새 키 바인딩(`Ctrl + t`)이 완성 명령을 엽니다.

각 키 바인딩에는 다음 요소가 필요합니다.

- name: `$config.keybindings`에서 쉽게 참조할 수 있도록 키 바인딩의 고유한 이름
- modifier: 키 바인딩의 키 수정자. 옵션은 다음과 같습니다.
  - none
  - control
  - alt
  - shift
  - shift_alt
  - alt_shift
  - control_alt
  - alt_control
  - control_shift
  - shift_control
  - control_alt_shift
  - control_shift_alt
- keycode: 누를 키를 나타냅니다.
- mode: emacs, vi_insert, vi_normal (단일 문자열 또는 목록. 예:
  [`vi_insert` `vi_normal`])
- event: 키 바인딩에서 보낼 이벤트 유형.
  옵션은 다음과 같습니다.
  - send
  - edit
  - until

::: tip
사용 가능한 모든 수정자, 키 코드 및 이벤트는
[`keybindings list`](/commands/docs/keybindings_list.md) 명령으로 찾을 수 있습니다.
:::

::: tip
`vi_insert` 모드에 추가된 키 바인딩은
줄 편집기가 삽입 모드일 때(텍스트를 쓸 수 있을 때) 사용할 수 있으며, `vi_normal` 모드로 표시된 키 바인딩은 일반 모드일 때(커서가 h, j, k 또는 l을 사용하여 이동할 때) 사용할 수 있습니다.
:::

키 바인딩 항목의 이벤트 섹션은 수행할 작업이 정의되는 곳입니다. 이 필드에서는 레코드 또는 레코드 목록을 사용할 수 있습니다. 다음과 같습니다.

```nu
  ...
  event: { send: Enter }
  ...
```

또는

```nu
  ...
  event: [
    { edit: Clear }
    { send: Enter }
  ]
  ...
```

이 페이지에 표시된 첫 번째 키 바인딩 예제는 첫 번째 경우를 따릅니다. 단일 이벤트가 엔진으로 전송됩니다.

다음 키 바인딩은 엔진으로 전송되는 일련의 이벤트의 예입니다. 먼저 프롬프트를 지우고 문자열을 삽입한 다음 해당 값을 입력합니다.

```nu
$env.config.keybindings ++= [{
    name: change_dir_with_fzf
    modifier: CONTROL
    keycode: Char_t
    mode: emacs
    event: [
        { edit: Clear }
        {
          edit: InsertString,
          value: "cd (ls | where type == dir | each { |row| $row.name} | str join (char nl) | fzf | decode utf-8 | str trim)"
        }
        { send: Enter }
    ]
}]
```

이전 키 바인딩의 한 가지 단점은 삽입된 텍스트가 유효성 검사기에 의해 처리되고 기록에 저장되어 키 바인딩이 약간 느려지고 동일한 명령으로 명령 기록을 채우게 된다는 것입니다. 이러한 이유로 `executehostcommand` 유형의 이벤트가 있습니다. 다음 예제는 이전 예제와 동일한 작업을 더 간단한 방법으로 수행하며 엔진에 단일 이벤트를 보냅니다.

```nu
$env.config.keybindings ++= [{
    name: change_dir_with_fzf
    modifier: CONTROL
    keycode: Char_y
    mode: emacs
    event: {
        send: executehostcommand,
        cmd: "cd (ls | where type == dir | each { |row| $row.name} | str join (char nl) | fzf | decode utf-8 | str trim)"
    }
}]
```

계속하기 전에 편집 및 전송에 대한 구문이 변경된다는 점에 유의해야 하므로 조금 더 설명하는 것이 중요합니다. `send`는 엔진에서 처리할 수 있는 모든 `Reedline` 이벤트이고 `edit`는 엔진에서 처리할 수 있는 모든 `EditCommands`입니다.

### 전송 유형

`send`에 사용할 수 있는 모든 옵션을 찾으려면 다음을 사용할 수 있습니다.

```nu
keybindings list | where type == events
```

그리고 `send` 이벤트의 구문은 다음과 같습니다.

```nu
    ...
      event: { send: <목록의 이벤트 이름> }
    ...
```

::: tip
이벤트 이름을 대문자로 쓸 수 있습니다.
키 바인딩 파서는 대소문자를 구분하지 않습니다.
:::

이 규칙에는 두 가지 예외가 있습니다. `Menu` 및 `ExecuteHostCommand`입니다.
이 두 이벤트에는 완료되기 위해 추가 필드가 필요합니다. `Menu`에는 활성화할 메뉴 이름(completion_menu 또는 history_menu)이 필요합니다.

```nu
    ...
      event: {
        send: menu
        name: completion_menu
      }
    ...
```

그리고 `ExecuteHostCommand`에는 엔진으로 전송될 유효한 명령이 필요합니다.

```nu
    ...
      event: {
        send: executehostcommand
        cmd: "cd ~"
      }
    ...
```

이벤트 목록에 `Edit([])`, `Multiple([])` 및 `UntilFound([])`도 표시된다는 점은 언급할 가치가 있습니다. 이러한 옵션은 키 바인딩 정의를 기반으로 구성되므로 파서에서 사용할 수 없습니다. 예를 들어, `Multiple([])` 이벤트는 키 바인딩의 이벤트에 레코드 목록을 정의할 때 생성됩니다. `Edit([])` 이벤트는 언급된 `edit` 유형과 동일합니다. 그리고 `UntilFound([])` 이벤트는 나중에 언급될 `until` 유형과 동일합니다.

### 편집 유형

`edit` 유형은 `Edit([])` 이벤트의 단순화입니다. `event` 유형은 키 바인딩에 대한 복잡한 편집 이벤트를 정의하는 것을 단순화합니다. 사용 가능한 옵션을 나열하려면 다음 명령을 사용할 수 있습니다.

```nu
keybindings list | where type == edits
```

`edit`의 일반적인 구문은 다음과 같습니다.

```nu
    ...
      event: { edit: <목록의 편집 이름> }
    ...
```

`()`가 있는 목록의 편집에 대한 구문은 약간 변경됩니다.
이러한 편집에는 완전히 정의되기 위해 추가 값이 필요하기 때문입니다. 예를 들어, 프롬프트가 있는 위치에 문자열을 삽입하려면 다음을 사용해야 합니다.

```nu
    ...
      event: {
        edit: insertstring
        value: "MY NEW STRING"
      }
    ...
```

또는 첫 번째 `S`까지 오른쪽으로 이동하려면

```nu
    ...
      event: {
        edit: moverightuntil
        value: "S"
      }
    ...
```

보시다시피 이 두 가지 유형을 사용하면 필요한 모든 유형의 키 바인딩을 구성할 수 있습니다.

### until 유형

이 키 바인딩 둘러보기를 완료하려면 이벤트에 대한 `until` 유형을 논의해야 합니다.
지금까지 보았듯이 단일 이벤트 또는 이벤트 목록을 보낼 수 있습니다. 그리고 우리가 보았듯이 이벤트 목록이 전송되면 각 이벤트가 처리됩니다.

그러나 동일한 키 바인딩에 다른 이벤트를 할당하려는 경우가 있을 수 있습니다. 이것은 누셸 메뉴에서 특히 유용합니다. 예를 들어, `Ctrl + t`로 완성 메뉴를 활성화하고 싶지만 동일한 키 바인딩을 사용하여 메뉴에서 다음 요소로 이동하고 싶다고 가정해 보겠습니다.

이러한 경우 `until` 키워드가 있습니다. until 이벤트 내에 나열된 이벤트는 하나가 성공하자마자 이벤트 처리가 중지된다는 차이점과 함께 하나씩 처리됩니다.

다음 키 바인딩은 이 경우를 나타냅니다.

```nu
$env.config.keybindings ++= [{
    name: completion_menu
    modifier: control
    keycode: char_t
    mode: emacs
    event: {
        until: [
          { send: menu name: completion_menu }
          { send: menunext }
        ]
    }
}]
```

이전 키 바인딩은 먼저 완성 메뉴를 열려고 시도합니다. 메뉴가 활성화되지 않은 경우 메뉴를 활성화하고 성공 신호를 보냅니다. 키 바인딩을 다시 누르면 활성 메뉴가 있으므로 다음으로 보낼 이벤트는 MenuNext이며, 이는 선택기를 메뉴의 다음 요소로 이동한다는 의미입니다.

보시다시피 `until` 키워드를 사용하면 동일한 키 바인딩에 대해 두 가지 이벤트를 정의할 수 있습니다. 이 글을 쓰는 시점에서 메뉴 이벤트만 이러한 유형의 계층화를 허용합니다. 다른 비 메뉴 이벤트 유형은 항상 성공 값을 반환하므로 `until` 이벤트는 명령에 도달하자마자 중지됩니다.

예를 들어, 다음 키 바인딩은 해당 이벤트가 항상 성공하기 때문에 항상 `down`을 보냅니다.

```nu
$env.config.keybindings ++= [{
    name: completion_menu
    modifier: control
    keycode: char_t
    mode: emacs
    event: {
        until: [
            { send: down }
            { send: menu name: completion_menu }
            { send: menunext }
        ]
    }
}]
```

### 기본 키 바인딩 제거

특정 기본 키 바인딩을 다른 작업으로 바꾸지 않고 제거하려면 `event: null`을 설정할 수 있습니다.

예: 모든 편집 모드에서 `Ctrl + l`로 화면 지우기를 비활성화하려면

```nu
$env.config.keybindings ++= [{
    modifier: control
    keycode: char_l
    mode: [emacs, vi_normal, vi_insert]
    event: null
}]
```

### 키 바인딩 문제 해결

터미널 환경이 항상 예상대로 키 조합을 누셸에 전파하지 않을 수 있습니다. [`keybindings listen`](/commands/docs/keybindings_listen.md) 명령을 사용하여 특정 키 누름이 실제로 누셸에서 수신되는지 여부와 방법을 확인할 수 있습니다.

## 메뉴

Reedline 덕분에 누셸에는 일상적인 셸 스크립팅에 도움이 되는 메뉴가 있습니다. 다음은 누셸을 사용할 때 항상 사용할 수 있는 기본 메뉴입니다.

### 메뉴 키 바인딩

메뉴가 활성화되면 일부 키 바인딩은 위에서 설명한 키 바인딩 [`until` 지정자](#until-type)에 따라 변경됩니다. 메뉴의 일반적인 키 바인딩은 다음과 같습니다.

| 키                             | 이벤트                |
| ------------------------------- | -------------------- |
| <kbd>Tab</kbd>                  | 다음 항목 선택     |
| <kbd>Shift</kbd>+<kbd>Tab</kbd> | 이전 항목 선택 |
| <kbd>Enter</kbd>                | 선택 수락     |
| <kbd>↑</kbd> (위쪽 화살표)         | 메뉴 위로 이동         |
| <kbd>↓</kbd> (아래쪽 화살표)       | 메뉴 아래로 이동       |
| <kbd>←</kbd> (왼쪽 화살표)       | 메뉴 왼쪽으로 이동       |
| <kbd>→</kbd> (오른쪽 화살표)      | 메뉴 오른쪽으로 이동      |
| <kbd>Ctrl</kbd>+<kbd>P</kbd>    | 메뉴 위로 이동         |
| <kbd>Ctrl</kbd>+<kbd>N</kbd>    | 메뉴 아래로 이동       |
| <kbd>Ctrl</kbd>+<kbd>B</kbd>    | 메뉴 왼쪽으로 이동       |
| <kbd>Ctrl</kbd>+<kbd>F</kbd>    | 메뉴 오른쪽으로 이동      |

::: note
메뉴 방향 동작은 메뉴 유형(아래 참조)에 따라 다릅니다. 예를 들어
`description` 메뉴에서 "위"와 "아래"는 "추가" 목록에 적용되지만
`list` 메뉴에서는 방향이 선택에 적용됩니다.
:::

### 도움말 메뉴

도움말 메뉴는 누셸로의 전환을 용이하게 하기 위해 있습니다.
멋진 파이프라인을 구성하고 있는데 문자열을 반전시키는 내부 명령을 잊어버렸다고 가정해 보겠습니다.
파이프를 삭제하는 대신 `F1`로 도움말 메뉴를 활성화할 수 있습니다.
활성화되면 찾고 있는 명령에 대한 키워드를 입력하면 메뉴에
입력과 일치하는 명령이 표시됩니다.
일치는 명령 이름 또는 명령 설명에서 수행됩니다.

메뉴를 탐색하려면 `tab`을 사용하여 다음 요소를 선택하고,
왼쪽 또는 오른쪽을 눌러 설명을 스크롤하고,
사용 가능한 명령 예제를 줄에 붙여넣을 수도 있습니다.

도움말 메뉴는 다음 매개변수를 수정하여 구성할 수 있습니다.

```nu
$env.config.menus ++= [{
    name: help_menu
    only_buffer_difference: true # 검색은 메뉴 활성화 후 작성된 텍스트에서 수행됩니다.
    marker: "? "                 # 메뉴가 활성화될 때 나타나는 표시기
    type: {
        layout: description      # 메뉴 유형
        columns: 4               # 옵션이 표시되는 열 수
        col_width: 20            # 선택적 값. 누락된 경우 모든 화면 너비가 열 너비를 계산하는 데 사용됩니다.
        col_padding: 2           # 열 사이의 패딩
        selection_rows: 4        # 찾은 옵션을 표시할 수 있는 행 수
        description_rows: 10     # 명령 설명을 표시할 수 있는 행 수
    }
    style: {
        text: green                   # 텍스트 스타일
        selected_text: green_reverse  # 선택된 옵션의 텍스트 스타일
        description_text: yellow      # 설명의 텍스트 스타일
    }
}]
```

### 완성 메뉴

완성 메뉴는 프롬프트의 상태에 따라 제안을 제시하는 컨텍스트에 민감한 메뉴입니다. 이러한 제안은 경로 제안에서 명령 대안에 이르기까지 다양할 수 있습니다. 명령을 작성하는 동안 메뉴를 활성화하여 내부 명령에 사용할 수 있는 플래그를 볼 수 있습니다. 또한 외부 명령에 대한 사용자 지정 완성을 정의한 경우 메뉴에도 표시됩니다.

완성 메뉴는 기본적으로 `tab`을 눌러 액세스하며 구성 개체에서 다음 값을 수정하여 구성할 수 있습니다.

```nu
$env.config.menus ++= [{
    name: completion_menu
    only_buffer_difference: false # 검색은 메뉴 활성화 후 작성된 텍스트에서 수행됩니다.
    marker: "| "                  # 메뉴가 활성화될 때 나타나는 표시기
    type: {
        layout: columnar          # 메뉴 유형
        columns: 4                # 옵션이 표시되는 열 수
        col_width: 20             # 선택적 값. 누락된 경우 모든 화면 너비가 열 너비를 계산하는 데 사용됩니다.
        col_padding: 2            # 열 사이의 패딩
    }
    style: {
        text: green                   # 텍스트 스타일
        selected_text: green_reverse  # 선택된 옵션의 텍스트 스타일
        description_text: yellow      # 설명의 텍스트 스타일
    }
}]
```

이러한 매개변수를 수정하여 메뉴 레이아웃을 원하는 대로 사용자 지정할 수 있습니다.

### 기록 메뉴

기록 메뉴는 편집기 기록에 액세스하는 편리한 방법입니다. 메뉴를 활성화하면(기본값 `Ctrl+r`) 명령 기록이 역순으로 표시되므로 이전 명령을 매우 쉽게 선택할 수 있습니다.

기록 메뉴는 구성 개체에서 다음 값을 수정하여 구성할 수 있습니다.

```nu
$env.config.menus ++= [{
    name: history_menu
    only_buffer_difference: true # 검색은 메뉴 활성화 후 작성된 텍스트에서 수행됩니다.
    marker: "? "                 # 메뉴가 활성화될 때 나타나는 표시기
    type: {
        layout: list             # 메뉴 유형
        page_size: 10            # 메뉴 활성화 시 표시될 항목 수
    }
    style: {
        text: green                   # 텍스트 스타일
        selected_text: green_reverse  # 선택된 옵션의 텍스트 스타일
        description_text: yellow      # 설명의 텍스트 스타일
    }
}]
```

기록 메뉴가 활성화되면 기록에서 `page_size` 레코드를 가져와 메뉴에 표시합니다. 터미널에 공간이 있으면 `Ctrl+x`를 다시 누르면 메뉴가 동일한 수의 레코드를 가져와 현재 페이지에 추가합니다. 가져온 모든 레코드를 표시할 수 없는 경우 메뉴는 새 페이지를 만듭니다. 페이지는 `Ctrl+z`를 눌러 이전 페이지로 이동하거나 `Ctrl+x`를 눌러 다음 페이지로 이동하여 탐색할 수 있습니다.

#### 기록 검색

기록에서 검색하려면 찾고 있는 명령에 대한 키워드를 입력하기 시작할 수 있습니다. 메뉴가 활성화되면 입력한 모든 내용이 기록에서 선택한 명령으로 바뀝니다. 예를 들어, 이미 다음을 입력했다고 가정해 보겠습니다.

```nu
let a = ()
```

커서를 `()` 안에 놓고 메뉴를 활성화할 수 있습니다. 키워드를 입력하여 기록을 필터링하고 항목을 선택하자마자 입력한 단어가 바뀝니다.

```nu
let a = (ls | where size > 10MiB)
```

#### 메뉴 빠른 선택

메뉴의 또 다른 멋진 기능은 메뉴에서 무언가를 빠르게 선택하는 기능입니다. 메뉴를 활성화했고 다음과 같이 보인다고 가정해 보겠습니다.

```nu
>
0: ls | where size > 10MiB
1: ls | where size > 20MiB
2: ls | where size > 30MiB
3: ls | where size > 40MiB
```

아래로 눌러 네 번째 항목을 선택하는 대신 `!3`을 입력하고 Enter 키를 누를 수 있습니다. 이렇게 하면 선택한 텍스트가 프롬프트 위치에 삽입되어 메뉴를 아래로 스크롤하는 시간을 절약할 수 있습니다.

기록 검색과 빠른 선택을 함께 사용할 수 있습니다. 메뉴를 활성화하고 빠른 검색을 수행한 다음 빠른 선택 문자를 사용하여 빠른 선택을 수행할 수 있습니다.

### 사용자 정의 메뉴

기본 메뉴가 충분하지 않고 자신만의 메뉴를 만들어야 하는 경우 누셸이 도움을 줄 수 있습니다.

요구 사항을 충족하는 새 메뉴를 추가하려면 기본 레이아웃 중 하나를 템플릿으로 사용할 수 있습니다. 누셸에서 사용할 수 있는 템플릿은 열 형식, 목록 또는 설명입니다.

열 형식 메뉴는 열에 표시된 텍스트 크기에 따라 열 번호를 조정하여 데이터를 열 형식으로 표시합니다.

목록 유형의 메뉴는 항상 제안을 목록으로 표시하여 `!`와 숫자 조합을 사용하여 값을 선택할 수 있는 옵션을 제공합니다.

설명 유형은 버퍼에 삽입될 수 있는 추가 정보와 함께 일부 값에 대한 설명을 표시할 수 있는 더 많은 공간을 제공합니다.

세션 중에 생성된 모든 변수를 표시하는 메뉴를 만들고 싶다고 가정해 보겠습니다. 이를 `vars_menu`라고 부르겠습니다. 이 메뉴는 목록 레이아웃(`layout: list`)을 사용합니다. 값을 검색하려면 메뉴가 활성화된 후에 작성된 것만 사용하고 싶습니다(`only_buffer_difference: true`).

이를 염두에두고 원하는 메뉴는 다음과 같습니다.

```nu
$env.config.menus ++= [{
    name: vars_menu
    only_buffer_difference: true
    marker: "# "
    type: {
        layout: list
        page_size: 10
    }
    style: {
        text: green
        selected_text: green_reverse
        description_text: yellow
    }
    source: { |buffer, position|
        scope variables
        | where name =~ $buffer
        | sort-by name
        | each { |row| {value: $row.name description: $row.type} }
    }
}]
```

보시다시피 새 메뉴는 이전에 설명한 `history_menu`와 동일합니다. 유일한 큰 차이점은 [`source`](/commands/docs/source.md)라는 새 필드입니다. [`source`](/commands/docs/source.md) 필드는 메뉴에 표시하려는 값의 누셸 정의입니다. 이 메뉴에서는 `scope variables`에서 데이터를 추출하고 이를 사용하여 메뉴를 채우는 데 사용할 레코드를 만들고 있습니다.

레코드에 필요한 구조는 다음과 같습니다.

```nu
{
  value:       # 버퍼에 삽입될 값
  description: # 선택 사항. 선택한 값과 함께 표시될 설명
  span: {      # 선택 사항. 문자열의 어느 부분이 값으로 대체될지를 나타내는 범위
    start:
    end:
  }
  extra: [string] # 선택 사항. 선택한 값과 함께 표시될 문자열 목록입니다. 설명 메뉴에서만 작동합니다.
}
```

메뉴에 무언가를 표시하려면 결과 레코드에 적어도 `value` 필드가 있어야 합니다.

메뉴를 대화형으로 만들려면 블록에서 `$buffer` 및 `$position`이라는 두 변수를 사용할 수 있습니다. `$buffer`에는 `only_buffer_difference` 옵션이 true일 때 메뉴에서 캡처한 값이 포함되며, `$buffer`는 메뉴가 활성화된 후 작성된 텍스트입니다. `only_buffer_difference`가 false이면 `$buffer`는 줄의 모든 문자열입니다. `$position` 변수는 메뉴에 대한 아이디어를 기반으로 대체 범위를 만드는 데 사용할 수 있습니다. `$position`의 값은 `only_buffer_difference`가 true인지 false인지에 따라 변경됩니다. true이면 `$position`은 메뉴가 활성화된 후 텍스트가 삽입된 문자열의 시작 위치입니다. 값이 false이면 `$position`은 실제 커서 위치를 나타냅니다.

이 정보를 사용하여 필요한 정보를 표시하고 필요한 위치에 해당 값을 바꾸도록 메뉴를 디자인할 수 있습니다. 메뉴를 가지고 놀기 위해 추가로 필요한 유일한 것은 새로운 메뉴를 활성화할 키 바인딩을 정의하는 것입니다.

### 메뉴 키 바인딩

두 메뉴가 활성화되는 기본 방법을 변경하려면 새 키 바인딩을 정의하여 변경할 수 있습니다. 예를 들어 다음 두 키 바인딩은 각각 완성 및 기록 메뉴를 `Ctrl+t` 및 `Ctrl+y`에 할당합니다.

```nu
$env.config.keybindings ++= [
    {
        name: completion_menu
        modifier: control
        keycode: char_t
        mode: [vi_insert vi_normal]
        event: {
            until: [
                { send: menu name: completion_menu }
                { send: menupagenext }
            ]
        }
    }
    {
        name: history_menu
        modifier: control
        keycode: char_y
        mode: [vi_insert vi_normal]
        event: {
            until: [
                { send: menu name: history_menu }
                { send: menupagenext }
            ]
        }
    }
]
```
