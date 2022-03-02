# Eigene Befehle

Die Fähigkeit von Nu, lange Pipelines zu verarbeiten, erlauben es große Kontrolle über Daten und das System zu haben. Das Ganze kommt allerdings zum Preis von viel Tipparbeit. Idealerweise sollte es eine Möglichkeit geben, mühsam gebaute Pipelines zu speichern und wieder und wieder auszuführen.

Hier kommen eigene Befehle ins Spiel.

Eine beispielhafte Definition eines eigenen Befehls sieht wie folgt aus:

```nushell
def greet [name] {
  echo "hello" $name
}
```

In dieser Definition, wird ein Befehl `greet` beschrieben, der einen Parameter `name` konsumiert. Nach diesem Parameter erfolgt die Beschreibung was passiert, wenn der Befehl ausgeführt wird. Wenn der Befehl aufgerufen wird, wird der Wert, der als Parameter `name` übergeben wurde, in die Variable `$name` geschrieben, die im Codeblock verfügbar ist.

Um den obigen Befehl auszuführen wird er wie ein eingebauter Befehl aufgerufen:

```
> greet "world"
```

Wenn das getan wird, wird eine Ausgabe erzeugt, die wie die der eingebauten Befehle aussieht:

```
───┬───────
 0 │ hello 
 1 │ world 
───┴───────
```

## Namen von Befehlen

In Nushell ist ein valider Name eines Befehls ein String aus Zeichen oder ein String in Anführungszeichen. Beispiele hierfür sind: `greet`, `get-size`, `mycommand123`, `"mycommand"`, `😊` und `123`. 

_Hinweis: Es wird empfohlen Worte in Befehlen mit `-` zur besseren Lesbarkeit zu trennen._ Beispiele: `get-size` anstatt `getsize` oder `get_size`.

## Unterbefehle

Es ist auch möglich Unterbefehle zu definieren. Dazu wird der Unterbefehl vom Superbefehl durch ein Leerzeichen getrennt. Wenn beispielsweise der Befehl `str` durch einen Unterbefehl `mycommand` erweitert werden soll, funktioniert das wie folgt:

```nushell
def "str mycommand" [] {
  echo hello
}
```

Jetzt kann der eigene Unterbefehl aufgerufen werden, als ob er ein eingebauter Befehl von `str` wäre:

```
> str mycommand
```

## Typen von Parametern

Wenn eigene Befehle definiert werden, kann optional auch der Typ jedes Parameters angegeben werden. Das obige Beispiel kann beispielsweise wie folgt abgeändert werden:

```nushell
def greet [name: string] {
  echo "hello" $name
}
```

Die Typen der Parameter anzugeben ist optional. Nushell erlaubt es diese wegzulassen und behandelt diese dann als Typ `any`. Es kann also jede Art von Typ verarbeitet werden. Wenn ein Typ angegeben wurde, überprüft Nushell den Typ, wenn die Funktion aufgerufen wird.

Beispielhaft soll nur noch ein `int` als Typ erlaubt sein:

```nushell
def greet [name: int] {
  echo "hello" $name
}

greet world
```

Wenn versucht wird, den oberen Code auszuführen, wird Nu darauf aufmerksam machen, dass die Typen nicht passen und die Ausführung stoppen:

```
error: Type Error
  ┌─ shell:6:7
  │
5 │ greet world
  │       ^^^^^ Expected int, found world
```

Dies kann dabei helfen Nutzer darauf aufmerksam zu machen, welche Art von Typ erlaubt ist.

Die aktuell erlaubten Typen sind (mit Version 0.59.0 und neuer):

 - `any`
 - `block`
 - `cell-path`
 - `duration`
 - `path`
 - `expr`
 - `filesize`
 - `glob`
 - `int`
 - `math`
 - `number`
 - `operator`
 - `range`
 - `cond`
 - `bool`
 - `signature`
 - `string`
 - `variable`

## Flags

Zusätzlich zu den obigen Parametern, können auch namenabhängige Parameter verwendet werden, indem Flags für eigene Befehle definiert werden.

Zum Beispiel:

```nushell
def greet [
  name: string
  --age: int
] {
  echo $name $age
}
```

In der obigen Definition von `greet`, werden ein fester Parameter `name` und eine Flag `age` definiert. Damit ist es möglich, dem Befehl `greet` optional den Parameter `age` zu übergeben.

Das obige Beispiel kann wie folgt aufgerufen werden:

```
> greet world --age 10
```

Oder:

```
> greet --age 10 world
```

Oder gleich ganz ohne Flag:

```
> greet world
```

Flags können auch so definiert werden, dass es eine Kurzform gibt. Das erlaubt es sowohl eine kurze als auch eine einfach lesbare lange Flag für die selbe Aufgabe zu haben.

Das Beispiel wird hier, um eine Kurzform für die Flag `age` erweitert:

```nushell
def greet [
  name: string
  --age (-a): int
] {
  echo $name $age
}
```

*Hinweis:* Flags sind benannt nach der langen Form des Namens. Im obigen Beispiel erfolgt der Zugriff immer über `$age` und nicht über `$a`.

Nun kann diese neue Version von `greet` wie folgt aufgerufen werden:

```
> greet -a 10 hello
```


## Dokumentation für den eigenen Befehl

Um Nutzern eines eigenen Befehls zu helfen, können diese und ihre Parameter mit zusätzlichen Beschreibungen versehen werden.

Es wird weiterhin das obige Beispiel verwendet:

```nushell
def greet [
  name: string
  --age (-a): int
] {
  echo $name $age
}
```

Wenn der Befehl definiert ist kann `help greet` aufgerufen werden, um Informationen zum Befehl zu erhalten:

```
Usage:
  > greet <name> {flags} 

Parameters:
  <name> 

Flags:
  -h, --help: Display this help message
  -a, --age <integer>  
```

Wie zu sehen ist, werden der Parameter und die Flag, die definiert wurden, aufgelistet. Zusätzlich gibt es noch die Flag `-h`, die jeder Befehl hat.

Um diese Hilfe zu verbessern, können Beschreibungen zur Definition hinzugefügt werden:

```nushell
# A greeting command that can greet the caller
def greet [
  name: string      # The name of the person to greet
  --age (-a): int   # The age of the person
] {
  echo $name $age
}
```

Diese Kommentare, die zur Definition und den Parametern hinzugefügt wurden, werden sichtbar, wenn die Hilfe zum Befehl aufgerufen wird.

Wenn jetzt `help greet` ausgeführt wird, wird ein hilfreicherer Text angezeigt:

```
A greeting command that can greet the caller

Usage:
  > greet <name> {flags} 

Parameters:
  <name> The name of the person to greet

Flags:
  -h, --help: Display this help message
  -a, --age <integer>: The age of the person
```

## Ausgabe

Eigene Befehle streamen ihre Ausgabe gleich wie eingebaute Befehle. Beispielsweise soll die folgende Pipeline umgebaut werden:

```nushell
> ls | get name
```

`ls` soll jetzt in einen neuen, eigenen Befehl verschoben werden:

```nushell
def my-ls [] { ls }
```

Die Ausgabe dieses Befehls, kann identisch zur Ausgabe von `ls` verwendet werden.

```
> my-ls | get name
───┬───────────────────────
 0 │ myscript.nu           
 1 │ myscript2.nu          
 2 │ welcome_to_nushell.md 
───┴───────────────────────
```

Das erlaubt es sehr einfach eigene Befehle zu definieren und deren Ausgabe zu verwenden. Ein Hinweis: Es werden keine return Statements wie in anderen Sprachen verwendet. Stattdessen werden in Nushell Pipelines gebaut, die ihre Ausgabe zur verbundenen Pipeline streamen.

## Eingabe 

Eigene Befehle können, wie andere Befehle, auch Eingaben verarbeiten. Diese Eingabe wird durch die Pipeline an den Codeblock des eigenen Befehls übergeben.

Hier soll nun beispielhaft ein eigener echo-Befehl definiert werden, der eine weitere Zeile nach jeder Zeile der Eingabe ausgibt:

```nushell
def my-echo [] {
  each {
    echo $it "--"
  }
}
```

Wenn dieser neue Befehl nun in einer Pipeline aufgerufen wird, sieht die Ausgabe wie folgt aus:

```
> echo foo bar | my-echo
───┬─────
 0 │ foo 
 1 │ --  
 2 │ bar 
 3 │ --  
───┴─────
```

## Persistenz

Um Informationen darüber zu erhalten, wie eigene Befehle bei jedem Start von Nushell verfügbar bleiben, sei auf das [Konfigurationskapitel](configuration.md#startup-befehle) verwiesen.
