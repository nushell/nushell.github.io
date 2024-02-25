---
title: Введение
---

Здравствуйте, добро пожаловать в проект Nushell.
Цель этого проекта - взять философию оболочек Unix, где простые команды соединяются с помощью конвейеров, и адаптировать ее к современному стилю разработки.
Таким образом, Nushell не является ни оболочкой, ни языком программирования, а соединяет в себе и то, и другое, объединяя в одном пакете богатый язык программирования и полнофункциональную оболочку.

Nu берет пример со многих знакомых мест: традиционные оболочки, такие как bash, объектно-ориентированные оболочки, такие как PowerShell, постепенно типизируемые языки, такие как TypeScript, функциональное программирование, системное программирование и многое другое. Но вместо того, чтобы пытаться быть универсальным специалистом, Nu сосредоточила свою энергию на том, чтобы делать несколько вещей хорошо:

- Быть гибкой кроссплатформенной оболочкой с современным дизайном
- Решение проблем с помощью современного языка программирования, который работает со структурой ваших данных
- Четкие сообщения об ошибках и чистая поддержка IDE

## Эта книга

Книга разделена на главы, которые далее разбиты на разделы.
Вы можете нажать на заголовки глав, чтобы получить более подробную информацию о них.

- [Начало работы](getting_started.md) научит вас, как установить Nushell, и покажет вам, что к чему. В ней также объясняются некоторые принципы проектирования, по которым Nushell отличается от типичных оболочек, таких как bash.
- [Основы Nu](nu_fundamentals.md) объясняет основные понятия языка Nushell.
- [Программирование в Nu](programming_in_nu.md) более глубоко погружает в особенности языка и показывает несколько способов организации и структурирования вашего кода.
- [Nu как оболочка](nu_as_a_shell.md) В центре внимания - возможности оболочки, в первую очередь конфигурация и окружение.
- [Переход в Nu](coming_to_nu.md) предназначен для быстрого старта пользователей, перешедших с других оболочек или языков.
- [Примечания к дизайну](design_notes.md) подробно объясняет некоторые конструктивные решения Nushell.
- [(Не очень) Продвинутый](advanced.md) включает в себя несколько более продвинутых тем (они не такие _уж_ и продвинутые, обязательно ознакомьтесь и с ними!).

## Множество частей Nushell

Проект Nushell состоит из множества различных репозиториев и подпроектов.
Вы можете найти их в разделе [Наша организация на GitHub](https://github.com/nushell).

- Основной репозиторий Nushell можно найти [здесь](https://github.com/nushell/nushell). Он разбит на несколько ящиков, которые при желании можно использовать в качестве независимых библиотек в собственном проекте.
- Репозиторий нашей страницы [nushell.sh](https://www.nushell.sh), включая эту книгу, можно найти [здесь](https://github.com/nushell/nushell.github.io).
- Nushell имеет свой собственный редактор строк, [имеющий свой собственный репозиторий](https://github.com/nushell/reedline)
- [`nu_scripts`](https://github.com/nushell/nu_scripts) это место для обмена скриптами и модулями с другими пользователями, пока у нас не появится какой-нибудь менеджер пакетов.
- [Nana](https://github.com/nushell/nana) это экспериментальная попытка исследовать графический пользовательский интерфейс для Nushell.
- [Awesome Nu](https://github.com/nushell/awesome-nu) содержит список инструментов, которые работают с экосистемой Nushell: плагины, скрипты, расширения редактора, сторонние интеграции и т.д.
- [Nu Showcase](https://github.com/nushell/showcase) это место для обмена работами о Nushell, будь то блоги, иллюстрации или что-то еще.
- [Запрос на комментарии (RFC)](https://github.com/nushell/rfcs) служит местом для предложений и обсуждений серьезных изменений в дизайне. Хотя в настоящее время он недостаточно используется, мы ожидаем увеличения его использования по мере приближения и превышения версии 1.0.

## Вклад

Мы приветствуем вклад в развитие!
[Как видите](#the-many-parts-of-nushell), есть много мест, куда можно внести свой вклад.
Большинство репозиториев содержат файл `CONTRIBUTING.md` с советами и подробностями, которые должны помочь вам начать работу (если нет, подумайте о внесении исправления!).

Сам Nushell написан на языке [Rust](https://www.rust-lang.org).
Однако вам не обязательно быть программистом Rust, чтобы помочь.
Если вы разбираетесь в веб-разработке, вы можете внести свой вклад в улучшение этого сайта или проекта Nana.
[Dataframes](dataframes.md) может использовать ваш опыт обработки данных.

Если вы написали крутой скрипт, плагин или интегрировали Nushell куда-то, мы будем рады вашему вкладу в `nu_scripts` или Awesome Nu.
Обнаружение ошибок с помощью шагов воспроизведения и создание запросов в GitHub об этих ошибках является ценной помощью!
Вы можете внести свой вклад в развитие Nushell, просто используя Nushell!

Поскольку Nushell быстро развивается, эта книга постоянно нуждается в обновлении.
Работа над этой книгой не требует никаких специальных навыков, кроме базового знакомства с Markdown.
Кроме того, вы можете перевести некоторые его части на свой язык.

## Сообщество

Основным местом для обсуждения всего, что связано с Nushell, является наш [Discord](https://discord.com/invite/NtAbbGn).
Вы также можете следить за нашими новостями и обновлениями в [Twitter](https://twitter.com/nu_shell).
Наконец, вы можете воспользоваться обсуждениями на GitHub или создать проблемы на GitHub.