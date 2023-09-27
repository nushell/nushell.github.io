# Nu als Shell

Die Kapitel [Nu Grundlagen](nu_fundamentals.md) und [Programmieren in Nu](programming_in_nu.md) fokusieren sich vor allem auf den Programmiersprach-Aspekt von Nushell.

Dieses Kapitel wirft ein Licht auf den Nushell Interpreter oder (den Nushell [REPL](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop)).
Einige der Konzepte sind integraler Bestandteilt der Nushell Programmiersprache (so wie Umgebungsvariablen). Während andere ausschliesslich zur Verbesserung des interaktiven Verhaltens beitragen (so wie Hooks) und deshalb z.B. beim Ausführen von Skripten nicht zur Verfügung stehen.

Viele Parameter von Nushell können [konfiguriert](configuration.md) werden.
Die Konfiguration selber ist gespeichert als Umgebungsvariable.
Desweiteren werden in Nushell diverse Konfigurationsdateien beim Start ausgeführt, in denen eigene Befehle oder Aliase etc. definiert werden können.

Ein starkes Merkmal jeder Shell sind ihre [Umgebungsvariablen](environment.md).
In Nushell sind Umgebungsvariablen in Geltungsbereiche unterteilt und können jeden unterstützten Typ annehmen.
Dies bringt einige zusätzliche Design Überlegungen mit sich, welche in den verlinken Kapiteln erklärt werden.

Die anderen Kapitel erklären wie mit [stdout, stderr und exit codes](stdout_stderr_exit_codes.md) gearbeitet werden kann, oder wie ein [Befehl zu einem externer Befehl "escaped"](escaping.md) werden kann.
Sowie wie ein [Drittanbieter Prompt](3rdpartyprompts.md) zur Zusammenarbeit mit Nushell bewegt werden kann.

Ein interessantes Merkmal von Nushell ist [Shell in Shells](shells_in_shells.md) welches erlaubt in mehreren Verzeichnissen gleichzeitig zu arbeiten.

Nushell hat auch seinen eigenen Zeilen Editor [Reedline](line_editor.md).
In Nushells Konfiguration ist es möglich einige Merkmale von Reedline wie Prompt, Tastenkombinationen, History oder Menus einzustellen.

Es ist auch möglich, eigene [Signaturen für externe Befehle](externs.md) zu definieren, was es erlaubt [eigene Vervollständigungen](custom_completions.md) für diese zu erstellen (welche auch für die eigenen Befehle funktionieren).

[Farben und Themen in Nu](coloring_and_theming.md)) geht ins Detail zum Thema, wie Nushells Aussehen konfiguriert werden kann.

Sind einige Befehle geplant , die im Hintergrund ablaufen sollen, so kann darüber in  [Hintergrund Tasks in Nu](background_task.md) nachgelesen werden.

Schliesslich erklärt [Hooks](hooks.md) wie Fragmente von Nushell Code beim Auftreten gewisser Ereignisse ausgeführt werden kann.
