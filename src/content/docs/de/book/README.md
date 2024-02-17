---
title: Einführung
---

Hallo und herzlich Willkommen beim Nushell Projekt. Das Ziel diese Projekts ist es, die Philosophie von Unix Shells, wo Pipes einfache Befehle miteinander verbinden, mit modernen Ansätzen zu verbinden.

Nu ist von vielen Seiten beeinflusst: traditionelle Shells wie Bash, objektbasierte Shells wie PowerShell, funktionale Programmierung, Systems Programming und viele Weitere. Aber statt die eierlegende Wollmilchsau zu sein, liegt der Fokus von Nu darauf, die angebotenen Funktionen gut zu beherrschen:

- Flexible cross-plattform Shell mit einem modernen Verhalten
- Ausgaben von Kommandozeilenprogrammen mit einer Shell zu verarbeiten, die Struktur von Daten versteht
- Ein Interface besitzen, das den modernen Bedürfnissen gerecht wird

Der einfachste Weg zu verstehen, was Nu alles leisten kann, ist entlang von Beispielen. Los geht's!

Das Erste was auffällt, wenn ein Befehl wie `ls` ausgeführt wird, ist, dass anstatt eines Blocks von Text eine strukturierte Tabelle als Ausgabe erscheint.

@[code](@snippets/introduction/ls_example.sh)

Diese Tabelle ist mehr als nur eine andere Darstellungsform. Wie Tabellen in Spreadsheets erlaubt es diese Tabelle mit den Daten interaktiver zu arbeiten.

Um das zu demonstrieren, wird der Inhalt der Tabelle zunächst nach der Größe sortiert. Um das zu realisieren, wird die Ausgabe von `ls` genommen und in ein Befehl gegeben, der Tabellen auf Basis von Daten in einer Spalte neu anordnen kann.

@[code](@snippets/introduction/ls_sort_by_reverse_example.sh)

Um das Ganze zu realisieren, mussten hierzu nicht Argumente an `ls` übergeben werden. Stattdessen wird der `sort-by` Befehl verwendet, den Nu bereitstellt, um Daten zu sortieren. Damit die größten Dateien oben erscheinen wurde zusätzlich die Option `reverse` angegeben.

Nu stellt sehr viele Befehle bereit, die mit Tabellen arbeiten können. Beispielsweise kann die Ausgabe von `ls` auch derart gefiltert werden, dass nur Datei mit einer Größe von mehr als einem Kilobyte angezeigt werden:

@[code](@snippets/introduction/ls_where_example.sh)

Wie in der Unix-Philosophie, erlauben Befehle, die untereinander Daten austauschen können, viele verschiedene Kombinationen um Aufgaben zu lösen. Wie in folgendem Beispiel:

@[code](@snippets/introduction/ps_example.sh)

Der `ps` Befehl erlaubt es auf Linux-Systemen alle laufenden Prozesse, deren Status und Name abzufragen. Des Weiteren gibt er Informationen zu CPU-Last der einzelnen Prozesse an.

Was macht man, wenn man nur Prozesse sehen möchte, die aktuelle aktiv die CPU nutzen? Wie zuvor beim `ls` Befehl, kann mit der durch `ps` zurückgegebenen Tabelle gearbeitet werden:

@[code](@snippets/introduction/ps_where_example.sh)

Bis jetzt wurden `ls` und `ps` genutzt, um Dateien und Prozesse aufzulisten. Nu besitzt aber noch viele weitere Befehle die nützliche Informationen in Tabellenform ausgeben. Dazu wird nun ein Block auf die Befehle `date` und `sys` geworfen.

Wenn `date now` aufgerufen wird, werden Informationen zum aktuellen Datum und der aktuellen Uhrzeit ausgegeben.

@[code](@snippets/introduction/date_example.sh)

Um das Datum in Tabellenform zu bekommen, kann es zusätzlich in `date to-table` gegeben werden:

@[code](@snippets/introduction/date_table_example.sh)

Der Aufruf von `sys` gibt Informationen zum System aus, auf dem Nu läuft:

@[code](@snippets/introduction/sys_example.sh)

Diese Ausgabe unterscheidet sich nun von den vorherigen. Der `sys` Befehl gibt eine Tabelle zurück, die selbst strukturierte Tabellen in den Zellen enthält anstatt nur einfache Werte. Um auf die Daten zuzugreifen, wird der _get_ Befehl verwendet:

@[code](@snippets/introduction/sys_get_example.sh)

Der `get` Befehl erlaubt es, in die Inhalte einer Tabellenzelle einzutauchen. Hier wird beispielsweise die Spalte "host" näher betrachtet, die Informationen über den Host, auf dem Nu läuft, enthält. Der Name des Betriebssystem (OS), die CPU und mehr. Nun sollen die Namen der Nutzer auf dem System ausgegeben werden:

@[code](@snippets/introduction/sys_get_nested_example.sh)

Aktuelle existiert nur ein Nutzer namens "jt". Wie zu sehen ist, kann ein ganzer Pfad für Spalten angegeben werden - nicht nur der Name der Spalte. Nu wird den Pfad nehmen und durch die entsprechenden Daten in der Tabelle gehen.

Und noch etwas anderes ist anders. Anstatt einer Tabelle mit Daten wurde nur ein einzelnes Element ausgegeben: der String "jt". Nu arbeitet sowohl mit Tabellen voller Daten als auch mit Strings. Strings sind ein wichtiger Bestandteil, um mit Befehlen außerhalb von Nu zu arbeiten.

Nun soll aufgezeigt werden, wie mit Strings außerhalb von Nu gearbeitet wird. Dazu wird das vorige Beispiel erweitert. Die Daten werden an den externen `echo` Befehl weitergegeben (das `^` teilt Nu mit, dass nicht der eingebaute `echo` Befehl verwendet werden soll):

@[code](@snippets/introduction/sys_get_external_echo_example.sh)

Das sieht jetzt genau gleich aus wie die Ausgabe zuvor. Was soll das? Es ist ähnlich aber mit einem entscheidenden Unterschied: `^echo` wurde aufgerufen. Das erlaubt es uns Daten aus Nu heraus an beliebige Befehle außerhalb von Nu zu geben wie `echo` oder `git`.

_Hinweis: Hilfe zu allen in Nu eingebauten Befehlen kann mit dem Befehl `help` angezeigt werden_:

@[code](@snippets/introduction/help_example.sh)
