# Environment

::: warning

Diese Dokumentation ist veraltet. Neuerungen wurde noch nicht nach Deutsch übersetzt. Die [Englische Dokumentation (EN)](/book/environment.md) ist aktuell.

:::

Eine häufige Aufgabe in einer Shell ist die Kontrolle der Umgebung, in der die externen Programme laufen. Dies wird meist automatisch geschehen,
da die Umgebung dem externen programm mitgegeben wird, wenn es gestartet wird. Manchmal jedoch will man eine genauere Kontrolle darüber,
welche Umgebungsvariablen ein Programm sehen kann.

Die aktuellen Umbegungsvariablen werden mit dem `env` Befehl ausgegeben:

```
   #           name                 type                value                 raw
──────────────────────────────────────────────────────────────────────────────────────────
  16   DISPLAY              string               :0                   :0
  17   EDITOR               string               nvim                 nvim
  28   LANG                 string               en_US.UTF-8          en_US.UTF-8
  35   PATH                 list<unknown>        [list 16 items]      /path1:/path2:/...
  36   PROMPT_COMMAND       block                <Block 197>
```

In der Nushell können Umgebungsvariablen jeden Wert jeden Typs annehmen (siehe die`type` Spalte)
Der aktuelle Wert der Umgebungsvariable, den Nushell verwendet, findet sich unter `value`.
Die `$env` Variable kann direkt abgefragt werden, z.B. mit `$env.PATH | length`.
Die letzte Spalte `raw` beinhaltet den Wert, den ein externes Programm erhält (siehe [Environment variable conversions](#environment-variable-conversions))

Die Umgebung wird erstellt durch Nus [Konfigurations-Datei](configuration.md) und von der Umgebung, in der Nu gestartet wurde.

## Setzen von Umgebungsvariablen

Umgebungsvariablen werden als Felder der Variable `$env` gesetzt.

Um die Umgebungsvariable `FOO` zu setzen kann direkt der Wert zu `$env.FOO` zugewiesen werden.

```
$env.FOO = 'BAR'
```

Um zum Beispiel die `PATH` Variable zu ergänzen, wird folgendes eingegeben:

```
$env.PATH = ($env.PATH | prepend '/pfad/der/hinzu/kommt')
```

Mit `prepend` wird der Ordner an den Anfang von PATH gestellt und hat damit die höchste Priorität.
Soll der Pfad ans Ende angehängt werden, so wird `append` verwendet.

### [`load-env`](/commands/docs/load-env.md)

Wenn mehrere Umgebungsvariablen gesetzt werden sollen, so kann `load-env` eine ganze Tabelle mitgegeben werden.
Diese besteht aus name/value Paaren, welche alle auf einmal geladen werden:

```
load-env { "BOB": "FOO", "JAY": "BAR" }
```

### Einmalig verwendete Umgebungsvariablen

Dies sind Variablen, welche nur innerhalb eines Blocks gültig sind.
Siehe [Einmalig verwendete Umgebungsvariablen](environment.md#single-use-environment-variables) für Details.

### Aufruf eines Befehls mit [`def --env`](/commands/docs/def.md)

Siehe [Definiere Umgebung aus eigenen Befehlen](environment.md#defining-environment-from-custom-commands) für Details.

### Exports von Modulen

Siehe [Module (EN)](/book/modules.md) für Details.

## Gültigkeitsbereiche

Wenn eine Umgebungsvariable gesetzt wird, ist sie nur in ihrem Gültigkeitsbereich vorhanden (Im aktuellen Block und dessen Unterblocks)

Hier ein kleines Beispiel um den Gültigkeitsbereich zu demonstrieren:

```
$env.FOO = "BAR"
do {
    $env.FOO = "BAZ"
    $env.FOO == "BAZ"
}
# => true
$env.FOO == "BAR"
# => true
```

## Verzeichnis Wechsel

Etwas was in einer Shell häufig vorkommt ist das wechseln des Verzeichnisses mit dem [`cd`](/commands/docs/cd.md) Befehl.
In der Nushell ist dies identisch mit dem setzen der `PWD` Umgebungsvariablen.
Dies wiederum folgt den gleichen Regeln wie das setzen anderer Umgebungsvariablen (wie z.B. Gültigkeitsbereich)

## Einmalig verwendete Umgebungsvariablen

Eine praktische Möglichkeit eine Umgebungsvariable einmalig zu setzen, ist inspiriert von Bash und anderen Shells:

```
FOO=BAR echo $env.FOO
# => BAR
```

Es kann auch [`with-env`](/commands/docs/with-env.md) verwendet werden um expliziter zu sein:

```
with-env { FOO: BAR } { echo $env.FOO }
# => BAR
```

Der [`with-env`](/commands/docs/with-env.md) Befehl setzt die Umgebungsvariable temporär (hier wird die Variable "FOO" auf den Wert "BAR" gesetzt)

## Permanente Umgebungsvariablen

Umgebungsvariablen können beim Start von Nushell gesetzt werden. Dafür werden sie in der [Nu Konfigurations Datei](configuration.md) gesetzt
und sind dann für die gesamte Laufzeit von Nushell verfügbar.
Zum Beispiel:

```
# In config.nu
$env.FOO = 'BAR'
```

## Definition einer Umgebungsvariablen für selbst definierten Befehl

Aufgrund der Gültigkeitsregeln ist eine Umgebungsvariable, welche innerhalb eines selbstdefinierten Befehls gesetzt ist, auch nur in dessen Block gültig.
Wird sie jedoch mit [`def --env`](/commands/docs/def.md) anstatt [`def`](/commands/docs/def.md) gesetzt, so wird sie beim verlassen des Blocks erhalten bleiben.
(Gilt auch für `export def`, siehe [Modules (EN)](/book/modules.md))

```
def --env foo [] {
    $env.FOO = 'BAR'
}

foo

$env.FOO
# => BAR
```

## Umgebungsvariablen konvertieren

Mit `ENV_CONVERSIONS` kann eine Umgebungsvariable von einem string zu einem Wert konvertiert werden.
Zum Beispiel beinhaltet die [default environment config](https://github.com/nushell/nushell/blob/main/crates/nu-utils/src/sample_config/default_env.nu)
bereits eine Konvertierung der PATH Umgebungsvariablen (sowie der Path Variablen in Windows) von einem String in eine List.

Nachdem beide `env.nu` und `config.nu` geladen wurden, wird jede existierende Umgebungsvariable, die mit `ENV_CONVERSIONS` definiert ist,
gemäss ihrem `from_string` Feld in den Wert des entsprechenden Typs konvertiert.
Externe Programme benötigen Strings als Umgebungsvariable. Deshalb muss jede nicht-string Variable zuerst konvertiert werden.
Die Konvertierung von Wert -> String erfolgt mit `to_string` innerhalb `ENV_CONVERSIONS` und wirdbei jedem externen Befehl ausgeführt.

Zur Illustration hier ein Beispiel.
Diese Zeilen gehören in config.nu:

```
$env.ENV_CONVERSIONS = {
    # ... you might have Path and PATH already there, add:
    FOO : {
        from_string: { |s| $s | split row '-' }
        to_string: { |v| $v | str join '-' }
    }
}
```

In einer Nushell Instanz gilt nun:

```
with-env { FOO : 'a-b-c' } { nu }  # runs Nushell with FOO env. var. set to 'a-b-c'

$env.FOO
# =>   0   a
# =>   1   b
# =>   2   c
```

Wie zu sehen ist `$env.FOO` nun eine Liste in einer neuen Nushell Instanz mit der neuen config.
Die Konvertierung kann auch manuell getestet werden mit:

```
do $env.ENV_CONVERSIONS.FOO.from_string 'a-b-c'
```

Um die Konvertierun list -> string zu testen:

```
nu -c '$env.FOO'
# => a-b-c
```

Weil `nu` selber ein externer Befehl ist, übersetzt Nushell die `[ a b c ]` Liste gemäss `ENV_CONVERSIONS.FOO.to_string` und übergibt sie dem `nu` Prozess.
Werden Befehle mit `nu -c` ausgeführt, so wird das config File nicht geladen. In diesem Fall wird die Konvertierung nicht durchgeführt und `FOO` als Text angezeigt.
So können wir überprüfen, ob die Konvertierung erfolgreich war.

Dieser Schritt kann auch manuell ausgelöst werden mit `do $env.ENV_CONVERSIONS.FOO.to_string [a b c]`

Zurückschauend auf den `env` Befehl, die `raw` Spalte zeigt die Werte, die mit `ENV_CONVERSIONS.<name>.to_string` übersetzt wurden.
Die `value` Spalte zeigt die Werte, die Nushell benutzt (Das Resultat von `ENV_CONVERSIONS.<name>.from_string` wie bei `FOO`)
Wenn der Wert kein String ist und keine `to_string` Konvertierung angewendet wird, wird er nicht an einen externen Befehl weitergeleitet (siehe die `raw` Spalte von `PROMPT_COMMAND`)
Eine Ausnahme ist die `PATH` Variable (`Path` in Windows): Standardmässig wird diese von einem String in eine Liste konvertiert beim Start
und von einer Liste in einen String, wenn externe Befehle gestartet werden.

_(Wichtig! Die Umgebungs-Konvertierung string -> value findet statt **nachdem** env.nu und config.nu ausgewertet wurden.
Alle Umgebungsvariablen in env.nu und config.nu sind immer noch Strings solange sie nicht manuell auf andere Werte gesetzt wurden.)_

## Entfernen von Umgebungsvariablen

Umgebungsvariablen können im aktuellen Gültigkeitsbereich entfernt werden via [`hide`](/commands/docs/hide.md):

```
$env.FOO = 'BAR'
# => ...
hide FOO
```

Dieses Verstecken im Gültigkeitsbereich erlaubt es gleichzeitig temporär eine Variabel zu entfernen ohne dass man die höher gelegene Umgebung modifiziert wird:

```
$env.FOO = 'BAR'
do {
    hide FOO
    # $env.FOO does not exist
  }
$env.FOO
# => BAR
```

Mehr Informationen über Verstecken findet sich im Kapitel [Modules](/book/modules.md)
