---
home: true
heroImage: null
heroText: Nushell
tagline: A new type of shell
actionText: Приступим →
actionLink: /book/
features:
  - title: Пайплайны для управления любой ОС
    details: Nu работает на Linux, macOS, BSD, и Windows. Выучите его один раз, используйте его везде.
  - title: Всё есть данные
    details: Пайплайны в Nu используют структурированные данные, поэтому вы можете безопасно отбирать, фильтровать и сортировать их каждый раз одним и тем же способом. Давайте перестанем разбирать строки и начнём решать реальные проблемы.
  - title: Мощная система плагинов
    details: Дополнять Nu можно с помощью мощной системы плагинов.
---

<img src="https://www.nushell.sh/frontpage/ls-example.png" alt="Screenshot showing using the ls command" class="hero"/>

### Nu работает с существующими данными

Nu "говорит" на [JSON, YAML, SQLite, Excel, и др.](/book/loading_data.html) из коробки. Обработать ваши данные в пейплайне очень просто, будь они в файле, базе данных, либо же в API:

<img src="https://www.nushell.sh/frontpage/fetch-example.png" alt="Screenshot showing fetch with a web API" class="hero"/>

### Nu имеет прекрасные сообщения об ошибках

Nu работает с типизированными данными, поэтому отлавливает ошибки, которые не замечают другие оболочки. А когда что-то ломается, Nu точно скажет вам, где и почему:

<img src="https://www.nushell.sh/frontpage/miette-example.png" alt="Screenshot showing Nu catching a type error" class="hero"/>

## Я хочу это!

Nushell можно получить [в виде бинарного файла](https://github.com/nushell/nushell/releases), [с помощью вашего любимого пакетного менеджера](https://repology.org/project/nushell/versions), в [в GitHub Action](https://github.com/marketplace/actions/setup-nu), или в виде [исходного кода](https://github.com/nushell/nushell). См. [подробную инструкцию по установке](/book/installation.html) или начните уже сейчас:

#### macOS / Linux:

##### Homebrew

```shell
$ brew install nushell
```

##### Nix profile

```shell
$ nix profile install nixpkgs#nushell
```

#### Windows:

```shell
$ winget install nushell
```

После установки, запустите Nu с помощью `nu`.

## Сообщество

Присоединяйтесь к нам [в Discord](https://discord.gg/NtAbbGn) если у вас есть любые вопросы о Nu!

Вы можете улучшить этот сайт [предоставив нам обратную связь](https://github.com/nushell/nushell.github.io/issues) или [отправив PR](https://github.com/nushell/nushell.github.io/pulls).
