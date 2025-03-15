# Установка Nu

Есть несколько способов установить Nu. Вы можете скачать предварительно собранные бинарники из [release page](https://github.com/nushell/nushell/releases), [использовать пакетный менеджер](https://repology.org/project/nushell/versions), или собрать его самостоятельно.

Исполняемый файл Nushell называется `nu` (или `nu.exe` в Windows). После установки вы можете запустить его, написав в консоли `nu`.

@[code](@snippets/installation/run_nu.sh)

## Предварительно собранные бинарники

Бинарники Nu существуют под Linux, macOS, и Windows [на странице релизов](https://github.com/nushell/nushell/releases). Просто скачайте их, распакуйте и добавьте путь до них в PATH

## Пакетные менеджеры

Nu доступен в нескольких пакетных менеджерах:

[![Packaging status](https://repology.org/badge/vertical-allrepos/nushell.svg)](https://repology.org/project/nushell/versions)

Для macOS и Linux - [Homebrew](https://brew.sh/) является самым популярным выбором (`brew install nushell`).

Для Windows:

- [Winget](https://docs.microsoft.com/en-us/windows/package-manager/winget/) (`winget install nushell`)
- [Chocolatey](https://chocolatey.org/) (`choco install nushell`)
- [Scoop](https://scoop.sh/) (`scoop install nu`)

Кроссплатформенная установка:

- [npm](https://www.npmjs.com/) (`npm install -g nushell` Учитывайте, что стандартные плагины не включены в сборку, если вы устанавливаете через `npm`.)

## Сборка из исходного кода

Вы также можете собрать Nu самостоятельно

### Установка зависимостей компилятора

Для компиляции программ на языке Rust, вам необходимо установить зависимости сборки

- Linux: GCC или Clang
- macOS: Clang (просто установите Xcode)
- Windows: MSVC (просто установите [Visual Studio](https://visualstudio.microsoft.com/vs/community/) или же [Visual Studio Build Tools](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022))
  - Убедитесь, что вы установили компонент "Desktop development with C++"
  - Любая версия Visual Studio будет работать (Community - бесплатная)

### Установка Rust

Если у вас не установлен Rust, то лучшим способом установить его является [rustup](https://rustup.rs/). Rustup - это инструмент для управления установленными версиями компилятора Rust и его инструментов.

Для Nu необходима **последняя стабильная (1.66.1 или новее)** версия Rust. Лучший способ - позволить `rustup` установить версию за вас. Когда вы в первый раз запустите `rustup` она спросит какую версию вы хотите установить:

@[code](@snippets/installation/rustup_choose_rust_version.sh)

Нажмите 1 и Enter.

Если вы по какой-то причине не хотите устанавливать Rust через `rustup`, вы можете сделать это другими методами (например в виде пакета в Linux). Главное убедиться, что у вас установлена версия Rust 1.66.1 или новее.

### Зависимости

#### Debian/Ubuntu

Вы должны установить "pkg-config", "build-essential" и "libssl-dev":

@[code](@snippets/installation/install_pkg_config_libssl_dev.sh)

#### Дистрибутивы основанные на RHEL

Вы должны установить "libxcb", "openssl-devel" и "libX11-devel":

@[code](@snippets/installation/install_rhel_dependencies.sh)

#### macOS

Используя [Homebrew](https://brew.sh/), вы должны установить "openssl" и "cmake":

@[code](@snippets/installation/macos_deps.sh)

### Сборка через [crates.io](https://crates.io)

Релизы Nu публикуются на [crates.io](https://crates.io/). Это делает установку простой и удобной с помощью `cargo`:

@[code](@snippets/installation/cargo_install_nu.sh)

Это всё! `cargo` скачает исходный код Nu, соберет его и установит его в `~/.cargo/bin`.

### Сборки из репозитория GitHub

Вы так-же можете собрать Nu напрямую из его репозитория на GitHub. Это даст вам доступ к новым функциям, как и баг-фиксам. Для начала склонируйте репозиторий:

@[code](@snippets/installation/git_clone_nu.sh)

Теперь можно собрать и запустить Nu с помощью:

@[code](@snippets/installation/build_nu_from_source.sh)

Вы также можете собрать Nu в режиме резлизной сборки, что увеличит его производительность:

@[code](@snippets/installation/build_nu_from_source_release.sh)

Люди знакомые с раст могут удивиться, что мы делаем `build` и `run`, если `run` сделает `build` по умолчанию. Это делается для того, чтобы обойти проблему новой опции `default-run` в Cargo и чтобы все плагины были собраны вместе с `nu`.
