# 나만의 오류 만들기

[메타데이터](metadata.md) 정보를 사용하여 자신만의 사용자 지정 오류 메시지를 만들 수 있습니다. 오류 메시지는 여러 부분으로 구성됩니다.

- 오류 제목
- 레이블 텍스트와 밑줄을 칠 범위를 모두 포함하는 오류 메시지 레이블

[`error make`](/commands/docs/error_make.md) 명령을 사용하여 자신만의 오류 메시지를 만들 수 있습니다. 예를 들어 `my-command`라는 자신만의 명령이 있고 전달된 매개변수에 문제가 있다는 오류를 호출자에게 다시 보내고 싶다고 가정해 보겠습니다.

먼저 인수가 어디에서 오는지에 대한 범위를 가져올 수 있습니다.

```nu
let span = (metadata $x).span;
```

다음으로 [`error make`](/commands/docs/error_make.md) 명령을 사용하여 오류를 만들 수 있습니다. 이 명령은 만들 오류를 설명하는 레코드를 받습니다.

```nu
error make {msg: "this is fishy", label: {text: "fish right here", span: $span } }
```

사용자 지정 명령과 함께 사용하면 다음과 같이 보일 수 있습니다.

```nu
def my-command [x] {
    let span = (metadata $x).span;
    error make {
        msg: "this is fishy",
        label: {
            text: "fish right here",
            span: $span
        }
    }
}
```

값으로 호출하면 이제 오류 메시지가 반환되는 것을 볼 수 있습니다.

```nu
my-command 100
# => Error:
# =>   × this is fishy
# =>    ╭─[entry #5:1:1]
# =>  1 │ my-command 100
# =>    ·            ─┬─
# =>    ·             ╰── fish right here
# =>    ╰────
```
