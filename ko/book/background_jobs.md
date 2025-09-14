---
next:
  text: 누셸 시작하기
  link: /ko/book/coming_to_nu.md
---

# 백그라운드 작업

누셸은 현재 스레드 기반 백그라운드 작업에 대한 실험적 지원을 제공합니다.

## 작업 생성

작업은 클로저를 수신하고 백그라운드 스레드에서 실행을 시작하는 [`job spawn`](/commands/docs/job_spawn.md)을 사용하여 생성할 수 있으며, 생성된 작업에 대한 고유한 정수 ID를 반환합니다.

```nu
'나는' | save status.txt

job spawn { sleep 10sec; ' 필연적이다' | save --append status.txt }
# => 1

open status.txt
# => 나는

# 10초 기다림
sleep 10sec

open status.txt
# => 나는 필연적이다
```

## 작업 나열 및 종료

활성 작업은 현재 실행 중인 작업의 정보가 포함된 테이블을 반환하는 [`job list`](/commands/docs/job_list.md) 명령으로 쿼리할 수 있습니다.
작업은 작업의 스레드를 중단하고 작업의 모든 자식 프로세스를 종료하는 [`job kill`](/commands/docs/job_kill.md) 명령을 사용하여 종료/중단할 수도 있습니다.

```nu
let id = job spawn { sleep 1day }

job list
# => ┏━━━┳━━━━┳━━━━━━━━┳━━━━━━━━━━━━━━━━┓
# => ┃ # ┃ id ┃  type  ┃      pids      ┃
# => ┣━━━╋━━━━╋━━━━━━━━╋━━━━━━━━━━━━━━━━┫
# => ┃ 0 ┃  1 ┃ thread ┃ [list 0 items] ┃
# => ┗━━━┻━━━━┻━━━━━━━━┻━━━━━━━━━━━━━━━━┛

job kill $id

job list
# => ╭────────────╮
# => │ empty list │
# => ╰────────────╯
```

## 작업 일시 중단

Linux 및 macOS와 같은 Unix 대상에서 누셸은 <kbd>Ctrl</kbd>+<kbd>Z</kbd>를 사용하여 외부 명령을 일시 중단하는 것도 지원합니다. 실행 중인 프로세스가 일시 중단되면 "정지된" 백그라운드 작업으로 전환됩니다.

```nu
long_running_process # 이것은 실행을 시작한 다음 Ctrl+Z를 누릅니다.
# => 작업 1이 정지되었습니다.

job list
# => ┏━━━┳━━━━┳━━━━━━━━┳━━━━━━━━━━━━━━━━┓
# => ┃ # ┃ id ┃  type  ┃      pids      ┃
# => ┣━━━╋━━━━╋━━━━━━━━╋━━━━━━━━━━━━━━━━┫
# => ┃ 0 ┃  1 ┃ frozen ┃ [list 1 items] ┃
# => ┗━━━┻━━━━┻━━━━━━━━┻━━━━━━━━━━━━━━━━┛
```

정지된 작업은 [`job unfreeze`](/commands/docs/job_unfreeze.md) 명령으로 포그라운드로 다시 가져올 수 있습니다.

```nu
job unfreeze
# 프로세스가 중지된 위치로 다시 가져옵니다.
```

::: tip 팁
다른 Unix 셸에 익숙한 사람들을 위해 `fg` 명령의 동작을 에뮬레이트하는 별칭을 만들 수 있습니다.

```nu
alias fg = job unfreeze
```

:::

기본적으로 `job unfreeze`는 가장 최근에 정지된 작업을 정지 해제합니다. 그러나 정지 해제할 특정 작업의 ID를 지정할 수도 있습니다.

```nu
vim
# => 작업 1이 정지되었습니다.

long_running_process
# => 작업 2가 정지되었습니다.

job unfreeze 1
# vim으로 돌아왔습니다.
```

## 종료 동작

다른 많은 셸과 달리 누셸 작업은 별도의 프로세스가 아니며 대신 백그라운드 스레드로 구현됩니다.

이것의 중요한 부작용은 셸 프로세스가 종료되면 모든 백그라운드 작업이 종료된다는 것입니다.
이러한 이유로 누셸에는 셸이 종료될 때 작업이 종료되는 것을 방지하는 UNIX와 유사한 `disown` 명령이 없습니다.
이를 고려하여 향후 독립적인 백그라운드 프로세스를 생성하기 위한 `job dispatch` 구현 계획이 있습니다(진행 상황은 [#15201](https://github.com/nushell/nushell/issues/15193?issue=nushell%7Cnushell%7C15201) 참조).

또한 사용자가 대화형 누셸 세션을 실행하고 백그라운드 작업이 실행되는 동안 [`exit`](/commands/docs/exit.md)를 실행하면 셸은 사용자에게 `exit`를 확인하라는 메시지를 표시하기 전에 이에 대해 경고합니다.
