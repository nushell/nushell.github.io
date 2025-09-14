# `explore`

Explore는 테이블 구조화된 데이터에 대한 `less`와 같은 테이블 페이저입니다.

## 서명

`> explore --head --index --reverse --peek`

### 매개변수

- `--head {bool}`: 열 머리글 표시 또는 숨기기(기본값 true)
- `--index, -i`: 목록을 볼 때 행 인덱스 표시
- `--tail, -t`: 뷰포트를 아래로 스크롤하여 시작
- `--peek, -p`: 종료 시 커서가 있던 셀의 값을 출력합니다.

## 시작하기

```nu
ls | explore -i
```

![explore-ls-png](https://user-images.githubusercontent.com/20165848/207849604-421312e3-537f-4b2e-b83e-f1f83f2a79d5.png)

[`explore`](/commands/docs/explore.md)의 핵심은 `:table`입니다(위 스크린샷에서 볼 수 있음).

`<Left>`, `<Right>`, `<Up>`, `<Down>` _화살표 키_를 통해 상호 작용할 수 있습니다. 또한 `Vim` 키 바인딩 `<h>`, `<j>`, `<k>`, `<l>`, `<Ctrl-f>` 및 `<Ctrl-b>`를 지원하며, `Emacs` 키 바인딩 `<Ctrl-v>`, `<Alt-v>`, `<Ctrl-p>` 및 `<Ctrl-n>`을 지원합니다.

커서 모드로 들어가서 기본 값을 검사할 수 있습니다. `<i>` 또는 `<Enter>`를 눌러 그렇게 할 수 있습니다.
그런 다음 _화살표 키_를 사용하여 필요한 셀을 선택할 수 있습니다.
그리고 기본 구조를 볼 수 있습니다.

`:help`를 통해 다양한 측면에 대한 자세한 정보를 얻을 수 있습니다.

## 명령

[`explore`](/commands/docs/explore.md)에는 사용할 수 있는 기본 제공 명령 목록이 있습니다. 명령은 `<:>`를 누른 다음 명령 이름을 눌러 실행됩니다.

명령의 전체 목록을 보려면 `:help`를 입력할 수 있습니다.

## 구성

구성을 통해 많은 것(스타일 및 색상 포함)을 구성할 수 있습니다.
[`default-config.nu`](https://github.com/nushell/nushell/blob/main/crates/nu-utils/src/default_files/default_config.nu)에서 예제 구성을 찾을 수 있습니다.

## 예제

### 값 엿보기

```nu
$nu | explore --peek
```

![explore-peek-gif](https://user-images.githubusercontent.com/20165848/207854897-35cb7b1d-7f7d-4ae2-9ec8-df19ac04ac99.gif)

### `:try` 명령

`nu`를 사용하여 데이터를 탐색하는 데 사용할 수 있는 대화형 환경이 있습니다.

![explore-try-gif](https://user-images.githubusercontent.com/20165848/208159049-0954c327-9cdf-4cb3-a6e9-e3ba86fde55c.gif)

#### `$nu`로 선택한 값 유지

`--peek`과 결합할 수 있음을 기억하십시오.

![explore-try-nu-gif](https://user-images.githubusercontent.com/20165848/208161203-96b51209-726d-449a-959a-48b205c6f55a.gif)
