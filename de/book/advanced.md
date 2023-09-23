# (Nicht nur für) Fortgeschrittene

Der Titel "Fortgeschritten" mag abschrecken und zum Überspringen des Kapitels animieren, doch tatsächlich sind einige der interessantesten und mächtigsten Merkmale hier zu finden.

Abgesehen von den eingebauten Befehlen, besitzt Nushell einen [Standard ibliothek](standard_library.md).

Nushell arbeitet mit _strukturierten Daten_.
Nushell ist eine "Daten orientierte" Shell und Programmiersprache.
Diese Daten zentrierte Sicht zeigt sich auch in [Polars](https://github.com/pola-rs/polars), dem eingebauten vollständigen Datenpaket Verarbeiter.
Im Kapitel [Dataframes documentation](dataframes.md) wird erklärt, wie grosse Datenmengen effizient in Nushell verarbeitet werden können.

Werte in Nusehll enthalten einige [Metadaten](metadata.md).
Diese können verwendet werden, um z.B. [eigene Fehlermedlungen](creating_errors.md) erstellen zu können.

Dank Nushells strikten Gültigkeits Regeln, ist es sehr einfach durch Sammlungen [parall zu iterieren](parallelism.md), was mit wenig Aufwand lange laufende Skripte verschnellern kann.

Mit dem [`explore`](/commands/docs/explore.md) Befehl können Daten [interaktiv erkundet](explore.md) werden.

Schliesslich kann Nushell mit [Plugins](plugins.md) erweitert werden.
Ein Plugin kann fast alles sein, solange es mit Nushell in einem Protokoll kommuniziert, welches diese versteht.
