# 병렬 처리

누셸은 이제 코드를 병렬로 실행하는 초기 지원을 제공합니다. 이를 통해 컴퓨터의 더 많은 하드웨어 리소스를 사용하여 스트림의 요소를 처리할 수 있습니다.

`par-`라는 특징적인 이름으로 이러한 명령을 볼 수 있습니다. 각 명령은 비병렬 버전에 해당하므로 먼저 직렬 스타일로 코드를 쉽게 작성한 다음 몇 가지 추가 문자로 직렬 스크립트를 병렬 스크립트로 쉽게 변환할 수 있습니다.

## par-each

가장 일반적인 병렬 명령은 [`each`](/commands/docs/each.md) 명령의 동반자인 [`par-each`](/commands/docs/par-each.md)입니다.

[`each`](/commands/docs/each.md)와 마찬가지로 [`par-each`](/commands/docs/par-each.md)는 파이프라인에 들어오는 각 요소에 대해 작동하여 각 요소에 대해 블록을 실행합니다. [`each`](/commands/docs/each.md)와 달리 [`par-each`](/commands/docs/par-each.md)는 이러한 작업을 병렬로 수행합니다.

현재 디렉터리의 각 하위 디렉터리에 있는 파일 수를 계산하고 싶다고 가정해 보겠습니다. [`each`](/commands/docs/each.md)를 사용하여 다음과 같이 작성할 수 있습니다.

```nu
ls | where type == dir | each { |row|
    { name: $row.name, len: (ls $row.name | length) }
}
```

각 항목에 대한 레코드를 만들고 디렉터리 이름과 해당 하위 디렉터리의 항목 수로 채웁니다.

컴퓨터에 따라 시간이 다를 수 있습니다. 이 컴퓨터에서는 현재 디렉터리에 대해 21밀리초가 걸렸습니다.

이제 이 작업은 병렬로 실행할 수 있으므로 [`each`](/commands/docs/each.md)를 [`par-each`](/commands/docs/par-each.md)로 변경하여 위를 병렬로 변환해 보겠습니다.

```nu
ls | where type == dir | par-each { |row|
    { name: $row.name, len: (ls $row.name | length) }
}
```

이 컴퓨터에서는 이제 6ms로 실행됩니다. 상당한 차이입니다!

참고: [환경 변수는 범위가 지정되므로](environment.md#scoping) [`par-each`](/commands/docs/par-each.md)를 사용하여 여러 디렉터리에서 병렬로 작업할 수 있습니다([`cd`](/commands/docs/cd.md) 명령 참조).

```nu
ls | where type == dir | par-each { |row|
    { name: $row.name, len: (cd $row.name; ls | length) }
}
```

결과를 보면 실행할 때마다 다른 순서로 돌아오는 것을 알 수 있습니다(시스템의 하드웨어 스레드 수에 따라 다름). 작업이 완료되고 올바른 결과를 얻으면 특정 순서로 결과를 원하면 추가 단계를 추가해야 할 수 있습니다. 예를 들어, 위의 경우 "name" 필드를 기준으로 결과를 정렬할 수 있습니다. 이렇게 하면 스크립트의 [`each`](/commands/docs/each.md) 및 [`par-each`](/commands/docs/par-each.md) 버전 모두 동일한 결과를 제공할 수 있습니다.
