# 스크립트

누셸에서는 누셸 언어로 스크립트를 작성하고 실행할 수 있습니다. 스크립트를 실행하려면 `nu` 명령줄 응용 프로그램에 인수로 전달할 수 있습니다.

```nu
nu myscript.nu
```

이렇게 하면 새 Nu 인스턴스에서 스크립트가 완료될 때까지 실행됩니다. [`source`](/commands/docs/source.md)를 사용하여 _현재_ Nu 인스턴스 내에서 스크립트를 실행할 수도 있습니다.

```nu
source myscript.nu
```

예제 스크립트 파일을 살펴보겠습니다.

```nu
# myscript.nu
def greet [name] {
  ["hello" $name]
}

greet "world"
```

스크립트 파일은 사용자 지정 명령에 대한 정의와 사용자 지정 명령이 정의된 후 실행될 주 스크립트 자체를 정의합니다.

위 예제에서 `greet`는 먼저 누셸 인터프리터에 의해 정의됩니다. 이를 통해 나중에 이 정의를 호출할 수 있습니다. 위를 다음과 같이 작성할 수도 있습니다.

```nu
greet "world"

def greet [name] {
  ["hello" $name]
}
```

정의가 정의를 호출하는 스크립트 부분보다 먼저 와야 한다는 요구 사항은 없으므로 편안하게 느끼는 곳에 배치할 수 있습니다.

## 스크립트 처리 방법

스크립트에서 정의는 먼저 실행됩니다. 이를 통해 스크립트의 호출을 사용하여 정의를 호출할 수 있습니다.

정의가 실행된 후 스크립트 파일의 맨 위에서 시작하여 각 명령 그룹을 차례로 실행합니다.

## 스크립트 줄

누셸이 코드 줄을 어떻게 보는지 더 잘 이해하기 위해 예제 스크립트를 살펴보겠습니다.

```nu
a
b; c | d
```

이 스크립트가 실행되면 누셸은 먼저 `a` 명령을 완료될 때까지 실행하고 그 결과를 봅니다. 다음으로 누셸은 ["세미콜론" 섹션](pipelines.html#semicolons)의 규칙에 따라 `b; c | d`를 실행합니다.

## 스크립트 매개변수화

스크립트 파일에는 선택적으로 특수 "main" 명령이 포함될 수 있습니다. `main`은 다른 Nu 코드가 실행된 후에 실행되며 주로 스크립트에서 위치 매개변수 및 플래그를 허용하는 데 사용됩니다. 스크립트 이름 뒤에 스크립트에 인수를 전달할 수 있습니다(`nu <script name> <script args>`).

예시:

```nu
# myscript.nu
def main [x: int] {
  $x + 10
}
```

```nu
nu myscript.nu 100
# => 110
```

## 인수 유형 해석

기본적으로 스크립트에 제공된 인수는 `Type::Any` 유형으로 해석됩니다. 즉, 특정 데이터 유형에 국한되지 않고 스크립트 실행 중에 사용 가능한 데이터 유형 중 하나에 맞는 것으로 동적으로 해석될 수 있습니다.

이전 예제에서 `main [x: int]`는 인수 x가 정수 데이터 유형을 가져야 함을 나타냅니다. 그러나 인수가 명시적으로 유형이 지정되지 않은 경우 명백한 데이터 유형에 따라 구문 분석됩니다.

예시:

```nu
# implicit_type.nu
def main [x] {
  $"Hello ($x | describe) ($x)"
}

# explicit_type.nu
def main [x: string] {
  $"Hello ($x | describe) ($x)"
}
```

```nu
nu implicit_type.nu +1
# => Hello int 1

nu explicit_type.nu +1
# => Hello string +1
```

## 하위 명령

스크립트에는 예를 들어 `run` 또는 `build`와 같은 여러 [하위 명령](custom_commands.html#subcommands)이 있을 수 있습니다.

```nu
# myscript.nu
def "main run" [] {
    print "running"
}

def "main build" [] {
    print "building"
}

def main [] {
    print "hello from myscript!"
}
```

그런 다음 호출할 때 스크립트의 하위 명령을 실행할 수 있습니다.

```nu
nu myscript.nu
# => hello from myscript!
nu myscript.nu build
# => building
nu myscript.nu run
# => running
```

[모듈과 달리](modules.html#main), `main`은 표시되기 위해 내보낼 필요가 _없습니다_. 위 예제에서 `main` 명령은 `export def`가 아니지만 `nu myscript.nu`를 실행할 때 여전히 실행되었습니다. `myscript.nu`를 스크립트로 실행하는 대신 `use myscript.nu`를 실행하여 myscript를 모듈로 사용했다면 `myscript`가 내보내지지 않았기 때문에 `myscript` 명령을 실행하려고 해도 작동하지 않습니다.

`main`의 하위 명령이 올바르게 노출되려면 `main` 명령을 정의해야 한다는 점에 유의하는 것이 중요합니다. 예를 들어, `run` 및 `build` 하위 명령만 정의했다면 스크립트를 실행할 때 액세스할 수 없습니다.

```nu
# myscript.nu
def "main run" [] {
    print "running"
}

def "main build" [] {
    print "building"
}
```

```nu
nu myscript.nu build
nu myscript.nu run
```

이것은 현재 스크립트가 처리되는 방식의 한계입니다. 스크립트에 하위 명령만 있는 경우 빈 `main`을 추가하여 다음과 같이 하위 명령을 노출할 수 있습니다.

```nu
def main [] {}
```

## Shebangs (`#!`)

Linux 및 macOS에서는 선택적으로 [shebang](<https://en.wikipedia.org/wiki/Shebang_(Unix)>)을 사용하여 OS에 파일이 Nu에 의해 해석되어야 함을 알릴 수 있습니다. 예를 들어, `myscript`라는 파일에 다음 내용이 있는 경우:

```nu
#!/usr/bin/env nu
"Hello World!"
```

```nu
./myscript
# => Hello World!
```

스크립트가 표준 입력에 액세스하려면 `nu`를 `--stdin` 플래그와 함께 호출해야 합니다.

```nu
#!/usr/bin/env -S nu --stdin
def main [] {
  echo $"stdin: ($in)"
}
```

```nu
echo "Hello World!" | ./myscript
# => stdin: Hello World!
```
