# 타사 프롬프트 구성 방법

## 너드 글꼴

너드 글꼴은 필수는 아니지만 추가 글리프와 아이코노그래피를 통해 프롬프트 표현을 개선할 수 있습니다.

> 너드 글꼴은 많은 수의 글리프(아이콘)로 개발자 대상 글꼴을 패치합니다.
> 특히 Font Awesome, Devicons, Octicons 등과 같은 인기 있는 '상징적 글꼴'에서 많은 추가 글리프를 추가합니다.

* [너드 글꼴 웹사이트](https://www.nerdfonts.com)
* [소스 저장소](https://github.com/ryanoasis/nerd-fonts)

## oh-my-posh

[사이트](https://ohmyposh.dev/)

[저장소](https://github.com/JanDeDobbeleer/oh-my-posh)

[oh-my-posh](https://ohmyposh.dev/)를 좋아한다면 몇 단계만 거치면 누셸에서 oh-my-posh를 사용할 수 있습니다. 누셸과 잘 작동합니다. 누셸과 함께 oh-my-posh를 설정하는 방법:

1. [가이드](https://ohmyposh.dev/docs/installation/linux)에 따라 Oh My Posh를 설치하고 oh-my-posh의 테마를 다운로드합니다.
2. [너드 글꼴](https://github.com/ryanoasis/nerd-fonts)을 다운로드하여 설치합니다.
3. .oh-my-posh.nu 파일을 생성합니다. 기본적으로 홈 디렉터리에 생성됩니다. `--config`를 사용하여 테마를 지정할 수 있으며, 그렇지 않으면 oh-my-posh에 기본 테마가 제공됩니다.
4. ~/.config/nushell/config.nu(또는 `$nu.config-path`의 경로 출력)에 추가하여 oh-my-posh 프롬프트를 초기화하여 ~/.oh-my-posh.nu를 소스로 사용합니다.

```nu
# .oh-my-posh.nu 파일 생성
oh-my-posh init nu --config ~/.poshthemes/M365Princess.omp.json

# config.nu 파일에 이 줄을 추가하여 셸 시작 시 oh-my-posh.nu를 초기화합니다.
source ~/.oh-my-posh.nu
```

MacOS 사용자의 경우:

1. `brew`를 사용하여 oh-my-posh를 설치할 수 있습니다. [여기 가이드](https://ohmyposh.dev/docs/installation/macos)를 따르십시오.
2. [너드 글꼴](https://github.com/ryanoasis/nerd-fonts)을 다운로드하여 설치합니다.
3. `$nu.config-path`에서 출력한 파일에 PROMPT_COMMAND를 설정합니다. 다음은 코드 스니펫입니다.

```nu
let posh_dir = (brew --prefix oh-my-posh | str trim)
let posh_theme = $'($posh_dir)/share/oh-my-posh/themes/'
# 테마 이름을 zash/space/robbyrussel/powerline/powerlevel10k_lean/
# material/half-life/lambda 또는 이중 라인 테마: amro/pure/spaceship 등으로 변경합니다.
# 자세한 내용은 [테마 데모](https://ohmyposh.dev/docs/themes)를 참조하십시오.
$env.PROMPT_COMMAND = { || oh-my-posh prompt print primary --config $'($posh_theme)/zash.omp.json' }
# 선택 사항
$env.PROMPT_INDICATOR = $"(ansi y)$> (ansi reset)"
```

## Starship

[사이트](https://starship.rs/)

[저장소](https://github.com/starship/starship)

1. 위의 링크를 따라 Starship을 설치합니다.
2. 기본 설정에 따라 너드 글꼴을 설치합니다.
3. 아래의 구성 예를 사용합니다. `STARSHIP_SHELL` 환경 변수를 설정해야 합니다.

::: tip
Starship을 활성화하는 다른 방법은 [Starship 빠른 설치](https://starship.rs/#nushell) 지침에 설명되어 있습니다.

위의 링크는 Starship과 누셸의 공식 통합이며 수동으로 아무것도 하지 않고 Starship을 실행하는 가장 간단한 방법입니다.

- Starship은 자체 구성/환경 설정 스크립트를 만듭니다.
- `env.nu`에서 만들고 `config.nu`에서 `use`하기만 하면 됩니다.
  :::

다음은 Starship의 구성 섹션 예입니다.

```nu
$env.STARSHIP_SHELL = "nu"

def create_left_prompt [] {
    starship prompt --cmd-duration $env.CMD_DURATION_MS $'--status=($env.LAST_EXIT_CODE)'
}

# nushell 함수를 사용하여 오른쪽 및 왼쪽 프롬프트를 정의합니다.
$env.PROMPT_COMMAND = { || create_left_prompt }
$env.PROMPT_COMMAND_RIGHT = ""

# 프롬프트 표시기는 프롬프트의 상태를 나타내는 환경 변수입니다.
$env.PROMPT_INDICATOR = ""
$env.PROMPT_INDICATOR_VI_INSERT = ": "
$env.PROMPT_INDICATOR_VI_NORMAL = "〉"
$env.PROMPT_MULTILINE_INDICATOR = "::: "
```

이제 Nu를 다시 시작하십시오.

```
nushell on 📙 main is 📦 v0.60.0 via 🦀 v1.59.0
❯
```

## Purs

[저장소](https://github.com/xcambar/purs)
