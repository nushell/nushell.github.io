# Установка в качестве шелла по умолчанию

## Установка Nu в качестве шелла по умолчанию в вашем терминале

|     Терминал     | Платформа    |                                                                                                                                Instructions                                                                                                                                |
| :--------------: | ------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|  GNOME Terminal  | Linux & BSDs |                                     Откройте `Edit > Preferences`. В правой панели выберите `Command`, поставьте галочку на `Run a custom command instead of my shell`, и установите путь к nu в качестве значения `Custom command` .                                      |
|  GNOME Console   | Linux & BSDs |   Введите команду `gsettings set org.gnome.Console shell "['/usr/bin/nu']"` (замените `/usr/bin/nu` на путь к Nu в вашей системе). Вы также можете использовать [dconf Editor](https://apps.gnome.org/DconfEditor/) для изменения переменной `/org/gnome/Console/shell`.   |
|      Kitty       | Linux & BSDs |                                                                  Нажмите `Ctrl`+`Shift`+`F2` для открытия `kitty.conf`. Найдите переменную `shell`, раскомментируйте строку и замените `.` на путь до Nu.                                                                  |
|     Konsole      | Linux & BSDs |                                                                                     Откройте `Settings > Edit Current Profile`. Установите путь до Nu в качестве значения в `Command`.                                                                                     |
|  XFCE Terminal   | Linux & BSDs |                                                         Откройте `Edit > Preferences`. Установите галочку `Run a custom command instead of my shell`, и установите путь к Nu в качестве значения `Custom command`.                                                         |
|   Terminal.app   | macOS        | Откройте `Terminal > Preferences`. Убедитесь, что вы находитесь в вкладке `Profiles`, здесь должна быть вкладка по умолчанию. В первой панели, выберите вкладку `Shell`. Поставьте галочку `Run command`, указайте путь к Nu в окно, и снимите галочку `Run inside shell`. |
|      iTerm2      | macOS        |                                          Откройте `iTerm > Preferences`. Выберите вкладку `Profiles`. В правой панели, под `Command`, измените выпадающий список `Login Shell` на `Custom Shell`, и установите путь к Nu в окне.                                           |
| Windows Terminal | Windows      |                  Нажмите `Ctrl`+`,` для открытия `Settings`. Пройдите в `Add a new profile > New empty profile`. Заполните 'Name' и установите путь до Nu в 'Command line'. Перейдите в `Startup` и выберите Nu как профиль по умолчанию. Нажмите `Save`.                  |

## Установка в качестве "login shell" (Linux, BSD & macOS)

::: Внимание
Nu всё ещё в разработке, и совместимость с POSIX не предполагается.
Имейте в виде, что некоторые программы в вашей системе могут рассчитывать, что ваш шелл по умолчанию совместим с [POSIX](https://en.wikipedia.org/wiki/POSIX)
Нарушение этих ожиданий может привести к неожиданным проблемам.
:::

Для установки "login shell" вам нужно использовать команду [`chsh`](https://linux.die.net/man/1/chsh).
Некоторые дистрибутивы Linux имеют список разрешённых шеллов в `/etc/shells` и ограничивают возможность изменения шелла до тех пор, пока он в нём не появиться.
Вы можете увидеть ошибку, связанную с тем, что вы не обновили файл `shells`:

@[code](@snippets/installation/chsh_invalid_shell_error.sh)

Вы должны добавить Nu в список разрешённых хеллов, добавив путь до `nu` в `shells` файл.
В этом случае вам нужно добавить путь к Nu в список разрешённых шеллов в `/etc/shells`.
Путь до `nu` можно получить с помощью команды `which nu`, обычно это `$HOME/.cargo/bin/nu`.
