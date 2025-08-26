# Установка Nu

Существует множество способов чтобы получить Nu и работать. Вы можете скачать предварительно собранный двоичные файлы с нашей [страница релиза](https://github.com/nushell/nushell/releases), [использовать ваш любимый менеджер пакетов](https://repology.org/project/nushell/versions), или собрать из исходника.

Главный двоичный файл Nushell называется `nu` (или `nu.exe` в Windows). После установки, вы можете запустить его, набрав `nu`.

@[code](@snippets/installation/run_nu.sh)

[[toc]]

## Предварительно собранные двоичные файлы

[С каждым релизом на GitHub](https://github.com/nushell/nushell/releases) публикуются двличные файлы Nu для Linux, macOS, и Windows. Просто загрузите, распакуйте двоичный файл, а затем скопируйте путь в ваше переменное окружения PATH.

## Менеджер пакетов

Nu доступен через нескольких пакетных менеджеров:

[![Packaging status](https://repology.org/badge/vertical-allrepos/nushell.svg)](https://repology.org/project/nushell/versions)

Для macOS и Linux, [Homebrew](https://brew.sh/) популярный выбор (`brew install nushell`).

Для Windows:

- [Winget](https://docs.microsoft.com/en-us/windows/package-manager/winget/) (`winget install nushell`)
- [Scoop](https://scoop.sh/) (`scoop install nu`)

Кросс-платформенная установка:

- [npm](https://www.npmjs.com/) (`npm install -g nushell` Примечание. Плагин nu не входить в комплект, если вы устанавливает их таким образом)

## Образ docker контейнера

Docker образ доступен из реестра контейнеров GitHub. Образ последней версии регулярно собирается
для Alpine и Debian. Вы можете запустить образ в интерактивном режиме, используя:

```nu
docker run -it --rm ghcr.io/nushell/nushell:<version>-<distro>
```

Где `<version>` - это версия Nushell, которую вы хотите запустить, а `<distro>` - это `alpine` или последний поддерживаемый выпуск Debian, например `bookworm`.

Чтобы запустить определенную команду, используйте:

```nu
docker run --rm ghcr.io/nushell/nushell:latest-alpine -c "ls /usr/bin | where size > 10KiB"
```

Чтобы запустить скрипт из текущего каталога с помощью Bash, используйте:

```nu
docker run --rm \
    -v $(pwd):/work \
    ghcr.io/nushell/nushell:latest-alpine \
    "/work/script.nu"
```

## Сборка из исходников

Вы можете собрать Nu из исходников. Сначала, вам нужно установить инструментарий Rust и его зависимости.

### Установка набора компиляторов

Чтобы Rust работал правильно, в вашей системе должен быть совместимый набор комиляторов. Вот рекомендуемый набор компиляторов:

- Linux: GCC или Clang
- macOS: Clang (установить Xcode)
- Windows: MSVC (установить [Visual Studio](https://visualstudio.microsoft.com/vs/community/) или [Visual Studio Build Tools](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022))
  - Обязательно установитье "Desktop development with C++"
  - Подойдет любая версия редактора Visual Studio (редакция Community).

### Установка Rust

Если у вас еще не нет Rust в вашей системе, лучший способ установить его через [rustup](https://rustup.rs/). Rustup - это способ управления установками Rust, включая управление использованием различных версий Rust.

В настоящее время Nu требуется **latest stable (1.66.1 or later)** версию Rust. Лучший способ - позволить `rustup` найти правильную для вас верисю. Когда вы впервые откроете `rustup`, он спросит, какую версию Rust вы желаете установить:

@[code](@snippets/installation/rustup_choose_rust_version.sh)

Как только вы будете готовы, нажмите 1, а затем нажмите enter.

Если вы не желаете устанавливать Rust через `rustup`, вы также можете установить you его другими способами (например из пакета дистрибутива Linux). Только убедитесь, что вы установили версию Rust 1.66.1 или последнюю.

### Зависимости

#### Debian/Ubuntu

Вам потребуется установить пакеты "pkg-config", "build-essential" и "libssl-dev":

@[code](@snippets/installation/install_pkg_config_libssl_dev.sh)

#### Дистрибутивы на базе RHEL

Вам потребуется установить "libxcb", "openssl-devel" и "libX11-devel":

@[code](@snippets/installation/install_rhel_dependencies.sh)

#### macOS

##### Homebrew

Используя [Homebrew](https://brew.sh/), вам нужно будет установить "openssl" и "cmake" используя команду:

@[code](@snippets/installation/macos_deps.sh)

##### Nix

Если испольуете [Nix](https://nixos.org/download/#nix-install-macos) для менеджера пакетов на macOS, необходимы пакеты `openssl`, `cmake`, `pkg-config`, и `curl`. Их можно установить:

- Глобально, используя `nix-env --install` (и другие).
- Локально, используя [Home Manager](https://github.com/nix-community/home-manager) в конфигурации `home.nix`.
- Временно, используя `nix-shell` (и другие).

### Сборка из [crates.io](https://crates.io) с помощью Cargo

Релизы Nushell публикуются в виде исходных текстов в популярном реестре пакетов Rust [crates.io](https://crates.io/). Это создает легкость сборки и установки последней версий Nu с помощью `cargo`:

```nu
cargo install nu --locked
```

Инструмент `cargo` выполнит работу по загрузке Nu и его исходных зависимостей, сборке и установке cargo по пути каталога bin.

Примечание что плагины по умолчанию должны быть установлены отдельно при использовании `cargo`. Смотрите раздел [Установка плагинов](./plugins.html#core-plugins) в книге инструкций.

### Сборка из GitHub репозитория

Вы так же можете собрать Nu из последних исходников на GitHub. Это даст вам немедленный доступ к последним функциям и исправлениям. Сначала, склонируйте репозиторий:

@[code](@snippets/installation/git_clone_nu.sh)

После этого мы можем собрать и запустить Nu с помощью:

@[code](@snippets/installation/build_nu_from_source.sh)

Вы также можете собирать и запускать Nu в режиме релиза, что позволяет использовать больше оптимизаций:

@[code](@snippets/installation/build_nu_from_source_release.sh)

Люди, знакомые с Rust, могут удивиться, почему мы выполняем "build", и "run", если "run" по умолчанию выполняет сборку. Это делается для того, чтобы обойти недостаток новой опции `default-run` в Cargo и убедиться, что все плагины собраны, хотя в будущем это может и не понадобиться.
