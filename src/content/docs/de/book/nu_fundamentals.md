---
title: Nu Grundlagen
---

In diesem Kapitel sind die Grundlagen der Nushell Programmiersprache erklärt.
Damit sollte es möglich sein, einfache Nushell Programme zu schreiben.

Nushell hat ein umfangreiches Typen System.
Es sind gebräuchliche Typen wie Text oder einfache Zahlen jedoch auch weniger geräuchliche wie Zellpfade zu finden.
Ausserdem ist eines der Hauptmerkmale von Nushell die Idee von _strukturierten Daten_, was bedeutet, dass Typen zusammengefasst werden können in: Listen, Records oder Tabellen.
Im Gegensatz zum traditionellen Unix Ansatz, in dem alle Befehle über Klartext kommunizieren, kommuniziert Nushell über diese Datentypen.
Dies ist alles erklärt in [Datentypen](types_of_data.md).

[Laden von Daten](loading_data.md) erklärt, wie gebräuchliche Datenformate in _strukturierte Daten_ gelesen werden, wie JSON. Dies beinhaltet auch das eigene Datenformat "NUON".

Wie bei Unix Shells, können in Nushell Befehle in [Pipelines](pipelines.md) zusammengeführt werden, um Daten in einem Strom zu modifizieren.

Einige Datentypen haben interessante Eigenschaften, die ein eigenes Kapitel verdienen: [Text](working_with_strings.md), [Listen](working_with_lists.md), and [Tabellen](working_with_tables.md).
Diese Kapitel zeigen ausserdem auch gängige Operationen wie Texte zusammensetzen oder ändern von Einträgen in einer Liste .

Schliesslich listet (Command Reference)(/commands/) alle eingebauten Befehle mit einer kurzen Beschreibung auf.
Eine Information, welche ebenso aus Nushell heraus erreicht werden kann mittels dem [`help`](/commands/docs/help.md) Befehl.
