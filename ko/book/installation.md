---
next:
  text: 기본 셸
  link: /book/default_shell.md
---

# Nu 설치

Nu를 설치하고 실행하는 방법은 여러 가지가 있습니다. [릴리스 페이지](https://github.com/nushell/nushell/releases)에서 미리 빌드된 바이너리를 다운로드하거나, [선호하는 패키지 관리자](https://repology.org/project/nushell/versions)를 사용하거나, 소스에서 빌드할 수 있습니다.

기본 누셸 바이너리의 이름은 `nu`(Windows에서는 `nu.exe`)입니다. 설치 후 `nu`를 입력하여 실행할 수 있습니다.

@[code](@snippets/installation/run_nu.sh)

[[toc]]

## 미리 빌드된 바이너리

Nu 바이너리는 [각 GitHub 릴리스](https://github.com/nushell/nushell/releases)와 함께 Linux, macOS 및 Windows용으로 게시됩니다. 바이너리를 다운로드하여 압축을 푼 다음 PATH의 위치에 복사하기만 하면 됩니다.

## 패키지 관리자

Nu는 여러 패키지 관리자를 통해 사용할 수 있습니다.

[![패키징 상태](https://repology.org/badge/vertical-allrepos/nushell.svg)](https://repology.org/project/nushell/versions)

macOS 및 Linux의 경우 [Homebrew](https://brew.sh/)가 널리 사용됩니다(`brew install nushell`).

Windows의 경우:

- [Winget](https://docs.microsoft.com/en-us/windows/package-manager/winget/)

  - 컴퓨터 범위 설치: `winget install nushell --scope machine`
  - 컴퓨터 범위 업그레이드: `winget update nushell`
  - 사용자 범위 설치: `winget install nushell` 또는 `winget install nushell --scope user`
  - 사용자 범위 업그레이드: [winget-cli 문제 #3011](https://github.com/microsoft/winget-cli/issues/3011)로 인해 `winget update nushell`을 실행하면 예기치 않게 최신 버전이 `C:\Program Files\nu`에 설치됩니다. 이 문제를 해결하려면 `winget install nushell`을 다시 실행하여 사용자 범위에 최신 버전을 설치하십시오.

- [Chocolatey](https://chocolatey.org/) (`choco install nushell`)
- [Scoop](https://scoop.sh/) (`scoop install nu`)

Debian 및 Ubuntu의 경우:

```sh
curl -fsSL https://apt.fury.io/nushell/gpg.key | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/fury-nushell.gpg
echo "deb https://apt.fury.io/nushell/ /" | sudo tee /etc/apt/sources.list.d/fury.list
sudo apt update
sudo apt install nushell
```

RedHat/Fedora 및 Rocky Linux의 경우:

```sh
echo "[gemfury-nushell]
name=Gemfury Nushell Repo
baseurl=https://yum.fury.io/nushell/
enabled=1
gpgcheck=0
gpgkey=https://yum.fury.io/nushell/gpg.key" | sudo tee /etc/yum.repos.d/fury-nushell.repo
sudo dnf install -y nushell
```

Alpine Linux의 경우:

```sh
echo "https://alpine.fury.io/nushell/" | tee -a /etc/apk/repositories
apk update
apk add --allow-untrusted nushell
```

크로스 플랫폼 설치:

- [npm](https://www.npmjs.com/) (`npm install -g nushell` 이 방법으로 설치하면 nu 플러그인이 포함되지 않습니다.)

## Docker 컨테이너 이미지

Docker 이미지는 GitHub 컨테이너 레지스트리에서 사용할 수 있습니다. 최신 릴리스용 이미지는 Alpine 및 Debian용으로 정기적으로 빌드됩니다. 다음을 사용하여 대화형 모드에서 이미지를 실행할 수 있습니다.

```nu
docker run -it --rm ghcr.io/nushell/nushell:<version>-<distro>
```

여기서 `<version>`은 실행하려는 누셸 버전이고 `<distro>`는 `alpine` 또는 `bookworm`과 같은 최신 지원 Debian 릴리스입니다.

특정 명령을 실행하려면 다음을 사용하십시오.

```nu
docker run --rm ghcr.io/nushell/nushell:latest-alpine -c "ls /usr/bin | where size > 10KiB"
```

Bash를 사용하여 현재 디렉터리에서 스크립트를 실행하려면 다음을 사용하십시오.

```nu
docker run --rm \
    -v $(pwd):/work \
    ghcr.io/nushell/nushell:latest-alpine \
    "/work/script.nu"
```

## 소스에서 빌드

소스에서 Nu를 빌드할 수도 있습니다. 먼저 Rust 툴체인과 해당 종속성을 설정해야 합니다.

### 컴파일러 스위트 설치

Rust가 제대로 작동하려면 시스템에 호환되는 컴파일러 스위트가 설치되어 있어야 합니다. 권장되는 컴파일러 스위트는 다음과 같습니다.

- Linux: GCC 또는 Clang
- macOS: Clang (Xcode 설치)
- Windows: MSVC ([Visual Studio](https://visualstudio.microsoft.com/vs/community/) 또는 [Visual Studio 빌드 도구](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022) 설치)
  - "C++를 사용한 데스크톱 개발" 워크로드를 설치해야 합니다.
  - 모든 Visual Studio 에디션이 작동합니다(Community는 무료).

### Rust 설치

시스템에 Rust가 아직 없는 경우 [rustup](https://rustup.rs/)을 통해 설치하는 것이 가장 좋습니다. Rustup은 다른 Rust 버전 사용 관리를 포함하여 Rust 설치를 관리하는 방법입니다.

Nu는 현재 **최신 안정(1.66.1 이상)** 버전의 Rust가 필요합니다. 가장 좋은 방법은 `rustup`이 올바른 버전을 찾도록 하는 것입니다. `rustup`을 처음 열면 설치할 Rust 버전을 묻는 메시지가 표시됩니다.

@[code](@snippets/installation/rustup_choose_rust_version.sh)

준비가 되면 1을 누르고 Enter 키를 누릅니다.

`rustup`을 통해 Rust를 설치하지 않으려면 다른 방법(예: Linux 배포판의 패키지에서)으로 설치할 수도 있습니다. 1.66.1 이상 버전의 Rust를 설치해야 합니다.

### 종속성

#### Debian/Ubuntu

"pkg-config", "build-essential" 및 "libssl-dev" 패키지를 설치해야 합니다.

@[code](@snippets/installation/install_pkg_config_libssl_dev.sh)

#### RHEL 기반 배포판

"libxcb", "openssl-devel" 및 "libX11-devel"을 설치해야 합니다.

@[code](@snippets/installation/install_rhel_dependencies.sh)

#### macOS

##### Homebrew

[Homebrew](https://brew.sh/)를 사용하여 "openssl" 및 "cmake"를 다음을 사용하여 설치해야 합니다.

@[code](@snippets/installation/macos_deps.sh)

##### Nix

macOS에서 패키지 관리에 [Nix](https://nixos.org/download/#nix-install-macos)를 사용하는 경우 `openssl`, `cmake`, `pkg-config` 및 `curl` 패키지가 필요합니다. 다음과 같이 설치할 수 있습니다.

- `nix-env --install`(및 기타)을 사용하여 전역적으로.
- `home.nix` 구성에서 [Home Manager](https://github.com/nix-community/home-manager)를 사용하여 로컬로.
- `nix-shell`(및 기타)을 사용하여 일시적으로.

### [crates.io](https://crates.io)에서 Cargo를 사용하여 빌드

누셸 릴리스는 인기 있는 Rust 패키지 레지스트리 [crates.io](https://crates.io/)에 소스로 게시됩니다. 이렇게 하면 `cargo`를 사용하여 최신 Nu 릴리스를 쉽게 빌드하고 설치할 수 있습니다.

```nu
cargo install nu --locked
```

`cargo` 도구는 Nu와 해당 소스 종속성을 다운로드하고 빌드하여 cargo bin 경로에 설치하는 작업을 수행합니다.

`cargo`를 사용할 때 기본 플러그인은 별도로 설치해야 합니다. 지침은 이 책의 [플러그인 설치](./plugins.html#core-plugins) 섹션을 참조하십시오.

### GitHub 저장소에서 빌드

GitHub의 최신 소스에서 Nu를 빌드할 수도 있습니다. 이렇게 하면 최신 기능 및 버그 수정에 즉시 액세스할 수 있습니다. 먼저 저장소를 복제합니다.

@[code](@snippets/installation/git_clone_nu.sh)

거기서 다음을 사용하여 Nu를 빌드하고 실행할 수 있습니다.

@[code](@snippets/installation/build_nu_from_source.sh)

릴리스 모드에서 Nu를 빌드하고 실행할 수도 있으며, 이렇게 하면 더 많은 최적화가 활성화됩니다.

@[code](@snippets/installation/build_nu_from_source_release.sh)

Rust에 익숙한 사람들은 "run"이 기본적으로 빌드를 수행하는데 왜 "build"와 "run" 단계를 모두 수행하는지 궁금해할 수 있습니다. 이것은 Cargo의 새로운 `default-run` 옵션의 단점을 해결하고 모든 플러그인이 빌드되도록 하기 위한 것이지만, 앞으로는 필요하지 않을 수 있습니다.
