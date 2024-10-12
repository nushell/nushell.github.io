# Penser en Nu

Pour vous aider à comprendre Nushell et à en tirer le meilleur, nous avons écrit cette section sur "penser en Nushell". En apprenant à penser en Nushell et à utiliser les patterns que Nushell propose, vous rencontrerez moins de problèmes au démarrage et vous serez mieux préparé pour réussir.

Alors, que signifie penser en Nushell ? Voici quelques sujets courants qui reviennent chez les nouveaux utilisateurs de Nushell.

## Nushell n'est pas bash

Nushell est à la fois un langage de programmation et un shell. Pour cette raison, Nushell possède sa propre manière de fonctionner avec les fichiers, les dossiers, les sites web, et plus encore. Nous l'avons conçu pour fonctionner en étroite collaboration avec ce que vous connaissez peut-être d'autres shells. Les pipelines fonctionnent en reliant deux commandes ensemble :

```nu
> ls | length
```

Nushell, par exemple, prend également en charge d'autres fonctionnalités courantes comme la récupération du code de sortie des commandes précédemment exécutées.

Bien que Nushell dispose de ces commodités, Nushell n'est pas bash. La manière de travailler avec bash, et le style POSIX en général, ne sont pas pris en charge par Nushell. Par exemple, dans bash, vous pourriez utiliser :

```sh
> echo "hello" > output.txt
```

En Nushell, nous utilisons `>` comme l'opérateur supérieur à. Cela s'accorde mieux avec l'aspect langage de Nushell. Au lieu de cela, vous redirigez vers une commande qui a pour tâche de sauvegarder le contenu :

```nu
> "hello" | save output.txt
```

**Penser en Nushell :** La manière dont Nushell voit les données est que celles-ci circulent à travers le pipeline jusqu'à atteindre l'utilisateur ou être traitées par une commande finale. Vous pouvez simplement taper des données, des chaînes de caractères aux listes et records en style JSON, et les suivre par `|` pour les envoyer dans le pipeline. Nushell utilise des commandes pour effectuer des tâches et produire plus de données. Apprendre ces commandes et savoir quand les utiliser vous aidera à composer de nombreux types de pipelines.

## Pensez à Nushell comme un langage compilé

Une part importante du design de Nushell, et en particulier là où il diffère de nombreux langages dynamiques, est que Nushell convertit les sources que vous lui donnez en quelque chose à exécuter, puis exécute le résultat. Il n'a pas de fonctionnalité `eval` qui vous permet de continuer à injecter de nouvelles sources pendant l'exécution. Cela signifie que les tâches comme l'inclusion de fichiers dans votre projet doivent être des chemins connus, un peu comme les includes dans les langages compilés tels que C++ ou Rust.

Par exemple, ce qui suit n'a pas de sens dans Nushell, et échouera à s'exécuter si on l'exécute en tant que script :

```nu
"def abc [] { 1 + 2 }" | save output.nu
source "output.nu"
abc
```

La commande [`source`](/commands/docs/source.md) va augmenter les sources qui vont être compilées, mais la commande [`save`](/commands/docs/save.md) de la ligne précédente n'aura pas eu la possibilité de s'exécuter. Nushell exécute l'ensemble du bloc comme s'il s'agissait d'un seul fichier, plutôt que d'exécuter ligne par ligne. Dans cet exemple, puisque le fichier output.nu n'est pas créé avant la fin de l'étape de "compilation", il est impossible pour la commande [`source`](/commands/docs/source.md) de lire les définitions depuis ce fichier pendant le parsing.

Un autre problème courant est d'essayer de créer dynamiquement le nom du fichier à inclure :

```nu
> source $"($my_path)/common.nu"
```

Cela ne fonctionne pas si `my_path` est une variable déclarée au runtime avec `let`. Cela nécessiterait que l'évaluateur exécute et évalue la chaîne de caractères, mais malheureusement, Nushell a besoin de cette information au moment de la compilation.

Cependant, si `my_path` est une [constante](/book/variables#constant-variables), cela fonctionnera, car la chaîne de caractères peut être évaluée au moment de la compilation :

```nu
> const my_path = ([$nu.home-path nushell] | path join)
> source $"($my_path)/common.nu" # sources /home/user/nushell/common.nu
```

**Penser en Nushell :** Nushell est conçu pour utiliser une unique étape de compilation pour toutes les sources que vous lui envoyez, et cela est distinct de l'évaluation. Cela permettra un support solide pour les IDEs, des messages d'erreur précis, un langage plus facile à utiliser pour les outils tiers, et à l'avenir, même des possibilités plus sophistiquées comme la possibilité de compiler Nushell directement en un fichier binaire.

Pour des explications plus approfondies, consultez [Comment le code Nushell est executé](/book/how_nushell_code_gets_run.md).

## Les variables sont immuables par défaut

Une autre surprise fréquente pour les personnes venant d'autres langages est que les variables de Nushell sont immuables par défaut. En arrivant sur Nushell, vous voudrez passer un peu de temps à vous familiariser avec le travail dans un style plus fonctionnel, car cela a tendance à aider à écrire de code qui fonctionne mieux avec des variables immuables.

**Penser en Nushell :** Si vous êtes habitué à utiliser des variables mutables pour différentes tâches, il vous faudra du temps pour apprendre comment faire chaque tâche dans un style plus fonctionnel. Nushell dispose d'un ensemble de fonctionnalités intégrées pour aider avec bon nombre de ces patterns, et les apprendre vous aidera à écrire du code dans un style plus Nushell.
L'avantage supplémentaire d'accélérer vos scripts en exécutant des parties de votre code en parallèle est un bonus appréciable.

Consultez [Variables Immuables](/book/variables.html#immutable-variables) et [Choisir entre variables mutables et immuables](/book/variables.html#choosing-between-mutable-and-immutable-variables) pour plus d'informations.

## L'environnement de Nushell est scopé

Nushell s'inspire de nombreux principes des langages compilés. L'un de ces principes est que les langages devraient éviter l'état global mutable. Les shells utilisent souvent la mutation globale pour mettre à jour l'environnement, mais Nushell évite cette approche.

Dans Nushell, les blocs contrôlent leur propre environnement. Les modifications apportées à l'environnement sont limitées au bloc où elles se produisent.

En pratique, cela vous permet d'écrire du code concis pour travailler avec des sous-répertoires. Par exemple, si vous vouliez compiler chaque sous-projet dans le répertoire courant, vous pourriez exécuter :

```nu
> ls | each { |row|
    cd $row.name
    make
}
```

La commande [`cd`](/commands/docs/cd.md) modifie les variables d'environnement `PWD`, et ce changement ne sort pas du bloc, ce qui permet à chaque itération de commencer à partir du répertoire courant et d'entrer dans le sous-répertoire suivant.

Le fait d'avoir l'environnement scopé de cette manière rend les commandes plus prévisibles, plus faciles à lire, et, le moment venu, plus faciles à déboguer. Nushell propose également des commandes utilitaires comme [`def --env`](/commands/docs/def.md) ou [`load-env`](/commands/docs/load-env.md), qui sont des moyens pratiques pour effectuer des groupes de mises à jour de l'environnement.

Il y a une exception ici, [`def --env`](/commands/docs/def.md) vous permet de créer une commande qui participe à l'environnement de l'appelant.

**Penser en Nushell :** La bonne pratique de codage consistant à éviter les variables globales mutables s'étend à l'environnement. L'utilisation des commandes utilitaires intégrées vous permettra de travailler plus facilement avec l'environnement dans Nushell. Profiter du fait que les environnements sont encapsulés dans les blocs peut également vous aider à écrire des scripts plus concis et à interagir avec des commandes externes sans ajouter des éléments dans un environnement global dont vous n'avez pas besoin.
