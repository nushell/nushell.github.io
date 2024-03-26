# Nu 설치하기

Nu를 설치하고 실행하는 방법에는 여러 가지가 있습니다. [릴리즈 페이지](https://github.com/nushell/nushell/releases)에서 미리 컴파일된 바이너리 파일을 다운로드하거나, [패키지 매니저](https://repology.org/project/nushell/versions)를 통해 설치하거나, 또는 소스 파일에서 직접 빌드할 수 있습니다.

Nushell의 주 프로그램명은 `nu`, Windows에서는 `nu.exe`입니다. 설치 후에 `nu`를 명령행에 입력하여 실행할 수 있습니다.

@[code](@snippets/installation/run_nu.sh)

## 바이너리 파일

Linux, macOS, 그리고 Windows에서의 Nu 실행 파일은 [GitHub Release](https://github.com/nushell/nushell/releases)에 포함되어 있습니다.
다운로드하고, 압축을 풀고, PATH에 경로를 추가하면 사용할 수 있습니다.

## 패키지 매니저

Nu는 아래와 같은 패키지 매니저에서 사용 가능합니다.

[![Packaging status](https://repology.org/badge/vertical-allrepos/nushell.svg)](https://repology.org/project/nushell/versions)

macOS와 Linux에서는 [Homebrew](https://brew.sh/)가 가장 많이 사용됩니다. (`brew install nushell`)

Windows에서는 다음과 같은 패키지 매니저를 통해 설치할 수 있습니다.:

- [Winget](https://docs.microsoft.com/en-us/windows/package-manager/winget/) (`winget install nushell`)
- [Chocolatey](https://chocolatey.org/) (`choco install nushell`)
- [Scoop](https://scoop.sh/) (`scoop install nu`)

크로스 플랫폼 설치 방법:

- [npm](https://www.npmjs.com/) (`npm install -g nushell` 이 방법으로는 플러그인들이 설치되지 않는다는 점에 유의하세요)

## 직접 빌드하기

Nu를 직접 빌드하여 사용할 수 잇습니다. 첫 번쨰로, Rust 툴체인과 의존 패키지들을 설치해야 합니다.

### 컴파일러 스위트 설치하기

Rust가 원활하게 작동하게 하기 위해서, 호환되는 컴파일러 스위트를 컴퓨터에 설치해야 합니다. 다음은 권장되는 컴파일러 스위트입니다:

- Linux: GCC 또는 Clang
- macOS: Clang (Xcode를 설치하세요)
- Windows: MSVC ([Visual Studio](https://visualstudio.microsoft.com/vs/community/) 또는 [Visual Studio Build Tools](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022)를 설치하세요)
  - "Desktop development with C++" 워크로드를 설치했는 지 확인하세요.
  - 어떤 Visual Studio 에디션이든 작동합니다. Community 에디션은 무료예요!

### Rust 설치하기

컴퓨터에 Rust가 설치되어 있지 않다면, [rustup](https://rustup.rs/)을 통해 설치하는 것이 가장 좋은 방법입니다. Rustup은 여러 버전의 Rust 패키지들을 통합 관리하는 프로젝트입니다.

Nu는 Rust의 **최신 안정(1.66.1 또는 그 이후) 버전**을 필요로 합니다. `rustup`을 통해 설치 하는 방법이 적당한 버전을 설치하는 데 가장 좋습니다. `rustup`을 처음 실행하면 어떤 버전을 설치할 것인 지 물어볼 것입니다.

@[code](@snippets/installation/rustup_choose_rust_version.sh)

준비가 되면 1을 누른 다음 엔터 키를 누르세요.

`rustup`을 통해 Rust를 설치하고 싶지 않으시다면, 다른 방법(예를 들어 리눅스 배포판 패키지)을 통해서도 설치가 가능합니다. Rust 1.66.1 버전 이후인지만 한 번 더 확인해 주세요.

### 의존성

#### Debian/Ubuntu

"pkg-config"와 "libssl-dev" 패키지를 설치해야 합니다.

@[code](@snippets/installation/install_pkg_config_libssl_dev.sh)

#### RHEL 기반 배포판

"libxcb", "openssl-devel", 그리고 "libX11-devel" 패키지를 설치해야 합니다.

@[code](@snippets/installation/install_rhel_dependencies.sh)

#### macOS

[Homebrew](https://brew.sh/)를 통해 "openssl" 과 "cmake" 패키지를 설치해야 합니다.

@[code](@snippets/installation/macos_deps.sh)

### [crates.io](https://crates.io)를 통해 빌드하기

Nu는 Rust 패키지 레지스트리인 [crates.io](https://crates.io/)를 통해 소스 코드를 릴리즈합니다. `cargo`를 통해 Nu 최신 릴리즈를 쉽게 빌드하고 설치할 수 있습니다.

@[code](@snippets/installation/cargo_install_nu.sh)

이게 다입니다! `cargo`는 소스 코드 의존성을 다운로드하고, 모두 빌드하고, 바이너리 설치 경로에 설치해 줍니다.

[Dataframes](dataframes.md) 지원을 설치하고 싶으시다면, `--features=dataframe` 플래그를 추가하면 됩니다.

@[code](@snippets/installation/cargo_install_nu_more_features.sh)

### GitHub 레포지토리에서 빌드하기

GitHub의 최신 소스 코드에서도 Nu를 빌드할 수 있습니다. 최신 기능과 버그 수정을 즉시 사용할 수 있습니다. 첫 번째로, 레포지토리를 클론하세요.

@[code](@snippets/installation/git_clone_nu.sh)

두 번째로, 다음을 통해 Nu를 빌드하고 실행할 수 있습니다.

@[code](@snippets/installation/build_nu_from_source.sh)

Nu를 더 많은 최적화가 적용되는 릴리즈 모드로 빌드할 수도 있습니다.

@[code](@snippets/installation/build_nu_from_source_release.sh)

Rust에 친숙한 사람들은 "run" 명령이 기본적으로 빌드도 수행하는데도 왜 "build"와 "run"명 령을 따로 실행하는 지 궁금해하실 수도 있습니다. 이것은 Cargo의 새 옵션인 `default-run`의 결점을 피하고, 모든 플러그인이 빌드되었는지 확인하기 위한 과정입니다. 추후에는 이 과정이 필요 없을 수도 있습니다.
