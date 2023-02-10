# Denken in Nushell

Um Nushell besser zu verstehen und das Beste aus ihr herauszuholen, ist dieses Kapitel "Denken in Nushell" zusammengestellt worden.
Denken in Nushell und Verstehen ihres zugrundeliegenden Modells, hilft beim Einstieg und auf dem Weg zum Erfolg.

Was bedeutet denn nun Denken in Nushell? Hier einige Themen, die für neue Benutzer besonders von Interesse sind.

## Nushell ist nicht bash

Nushell ist sowohl eine Programmiersprache, als auch eine Shell. Deswegen hat sie ihre eigene Art mit Dateien, Verzeichnissen, Webseite und mehr umzugehen.
Einiges ist jedoch so modelliert, wie es auch von anderen Shells her bekannt ist. Zum Beispiel Pipelines verbinden zwei Befehle:

```
> ls | length
```

Nushell hat auch andere Fähigkeiten, wie, aufnehmen des exit codes eines zuvor ausgeführten Befehls.
Trotz dieser Vorzüge ist Nushell nicht Bash. In einer Bash, oder bei POSIX kompatiblen Shells ganz generell, verwendet man z.B.:

```
> echo "hello" > output.txt
```

In Nushell is das `>` ein grösser-als Operator, was eher dem Programmiersprachen Aspekt von Nushell entspricht.
Stattdessen wird eine Pipe zu einem Befehl geführt, der die Aufgabe des Speicherns übernimmt:

```
> echo "hello" | save output.txt
```

**Denken in Nushell:** In Nushell werden die Daten durch die Pipeline weitergereicht, bis sie den Benutzer oder einen abschliessenden Befehl erreichen.
Nushell verwendet Befehle, die die Arbeit machen. Diese Befehle zu lernen und wann anzuwenden, hilft beim Zusammenstellen vieler verschiedenster Pipelines.

## Nushell wie eine compilierte Programmiersprache verstehen

Ein wichtiger Teil der in Nushell anders ist als in vielen dynamischen Sprachen, ist dass Nushell den Quellcode zuerst komplett interpretiert,
bevor er ausgeführt wird. Es gibt kein `eval` Feature, das es erlauben würde, kontinuierlich neuen Code während der Ausführung hinzu zu fügen.
Das heisst alle Befehle, aber auch Dateien müssen bekannte Pfade sein, ähnlich wie bei includes in kompilierten Sprachen wie C++ oder Rust.

Zum Beispiel macht folgendes in Nushell keinen Sinn und wird einen Fehler erzeugen:

```
echo "def abc [] { 1 + 2 }" | save output.nu
source "output.nu"
abc
```

Der `source` Befehl will das output Skript ausführen, aber der `save` Befehl müsste dafür bereits ausgeführt worden sein.
Nushell führt den ganzen Block aus, als wäre es eine Datei, anstatt Zeile für Zeile. Da die output.nu erst erstellt werden muss,
bevor sie ausgeführt werden kann, können die drei Zeilen nicht im voraus `kompiliert` werden.

Ein anderes Problem ist, einen Dateinamen dynamisch erzeugen zu wollen um ihn auszuführen:

```
> source $"($my_path)/common.nu"
```

Dies würde voraussetzen, dass Nushell die Eingabe auswerten kann um sie dann auszuführen, jedoch wird diese Information zur Kompilierzeit benötigt.

**Denken in Nushell** Nushell kompiliert also jede Eingabe zuerst, bevor sie ausgewertet wird.
Dies erlaubt starke Integration in eine IDE, akurate Fehlermeldungen, einen einfacheren Umgang mit der Sprache für externe Tools
und in der Zukunft so originelle Ausgaben wie die Möglichkeit, Nushell Skripte direkt zu binär Dateien zu kompilieren.

## Variablen sind unveränderbar

Eine andere Überraschung für Benutzer aus anderen Sprachen ist, dass in Nushell Variablen unveränderbar sind.
(Einige haben bereits angefangen sie Konstanten zu nennen, um diesem Umstand gerechter zu werden)
Es macht sicher Sinn, sich mit der Funktionalen Programmierung auseinander zu setzen, wenn man mit Nushell arbeiten will,
da dies am besten funktioniert, wenn man mit unveränderlichen Variablen arbeitet.

Was ist denn der Grund warum Nushell unveränderliche Variablen verwendet? Zu Beginn der Entwicklung von Nushell wurde entschieden, auf einen Daten fokusierten,
funktionalen Stil zu setzen. Erst kürzlich wurde eine Funktionalität zu Nushell hinzugefügt, die den Vorteil dieser frühen Experimente zeigt: Parallelität
Beim Wechsel von [`each`](/book/commands/each.md) zu [`par-each`](/book/commands/par-each.md) in jedem Nushell Skript, ist es nun mögliche jeden Block Code parallel auszuführen.
Dies ist möglich, weil Nushells Design stark auf Unveränderbarkeit, Kompositionen und Pipelining.

Nur weil in Nushell die Variablen unveränderbar sind bedeutet jedoch nicht, dass sich nicht verändern kann. Nushell macht starken Gebraucht der "Shadowing" Technik.
Shadowing oder "Beschattung" bedeutet, eine neue Variable erstellen, mit dem gleichen Namen einer zuvor deklarierten Variablen.
Zum Beispiel wenn eine Variable `$x` in den Gültigkeitsbereich geholt wird, und eine neue `$x` um 1 grösser definiert werden soll:

```
let x = $x + 1
```

Dieses neue `x` ist sichtbar für allen Code, der nach dieser Zeile folgt. Vorsichtiges Verwenden von Beschattung, kann die Benutzung von Variablen vereinfachen,
auch wenn es keine Voraussetzung ist.

Schleifenzähler sind ein anderes häufiges Muster für veränderliche Variablen und sind in die meisten iterativen Befehle eingebaut.
Zum Beispiel kann sowohl jedes Element wie auch dessen Index mit dem `-n` Flag von [`each`](/book/commands/each.md) erreicht werden:

```
> ls | enumerate | each { |it| $"Number ($it.index) is size ($it.item.size)" }
```

Mit dem [`reduce`](/book/commands/reduce.md) kann eine ähnliche Funktionalität erreicht werden wie man es von Variablen in Schleifen kennt.
Zum Beispiel, wenn der längste Text in einer Liste von Texten gesucht wird:

```
> [one, two, three, four, five, six] | reduce {|curr, max|
    if ($curr | str length) > ($max | str length) {
        $curr
    } else {
        $max
    }
}
```

**Denken in Nushell** wer sich veränderbare Variablen gewohnt ist, braucht eine gewisse Zeit, um sich einen mehr Funktionalen Stil anzugewöhnen.
Nushell hat einige eingebaute Fähigkeiten um mit diesem Modell umzugehen. Diese zu kennen hilft um Code im Nushell Stil zu schreiben.
Dass damit Teile des Codes parallel ausgeführt werden können ist ein toller Mehrwert.

## Nushells Umgebung hat Gültigkeitsbereiche

Nushell verwendet verschiedene Ansätze aus kompilierten Sprachen. Eine dieser Ansätze ist, dass globale veränderliche Zustände vermieden werden sollten.
Traditionell haben Shells global veränderbare Variablen verwendet, um die Umgebung zu kontrollieren. Nushell steuert hier in eine andere Richtung.

In Nushell kontrollieren Blöcke die Umgebung. Änderungen an der Umgebung gelten nur für den Block in der sie stattfinden.

In der Praxis ist damit präziserer Code möglich, um zum Beispiel mit Unterverzeichnissen zu arbeiten. Wie hier, wenn jedes Sub-Projekt des aktuellen Verzeichnisses
erstellt werden soll:

```
> ls | each { |it|
    cd $it.name
    make
}
```

Der `cd` Befehl wechselt die `PWD` Umgebungsvariable, was wiederum nur für den aktuellen Block gilt.
Jede Iteration startet deshalb wieder im gleichen Start-Verzeichnis.

Mit diesen Gültigkeitsbereichen, lassen sich besser vorhersehbare Befehle schreiben, welche einfacher zu lesen sind. Es erleichtert ebenfalls die Fehlersuche.
Nushell stellt auch Hilfsbefehle zur Verfügung wie [`def-env`](/book/commands/def-env.md), [`load-env`](/book/commands/load-env.md)), als einfachen Weg ganze Stapel von Umgebungsupdates durch zu führen.

`*` - Es gibt hier eine Ausnahme. [`def-env`](/book/commands/def-env.md) erlaubt es einem Befehl an der Umgebung teilzuhaben, von der aus er aufgerufen wurde.

**Denken in Nushell** - Das bewährte Verfahren keine globalen veränderlichen Variablen zu benutzen, erweitert sich in Nushell auf die Umgebung.
Die eingebauten Hilfs-Befehle helfen dabei, einfacher mit der Umgebung zu arbeiten.
Die Vorteile zu nutzen, dass die Umgebung so eingechränkt ist auf Blöcke, kann helfen präzisere Skripte zu schreiben, die mit externen Befehlen arbeiten,
ohne globale Umgebungsvariablen benutzen zu müssen.
