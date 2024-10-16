# Introduction

Bonjour, et bienvenue dans le projet Nushell.
L'objectif de ce projet est d'appliquer la philosophie Unix des shells, où les pipelines connectent de simples commandes entre elles, et de l'adapter au style de développement moderne.
Ainsi, plutôt que d'être simplement un shell ou un langage de programmation, Nushell réunit les deux en intégrant un langage de programmation riche et un shell complet dans un seul package.

Nu s'inspire de nombreux domaines familiers : des shells traditionnels comme bash, des shells orientés objets comme PowerShell, des langages à typage graduel comme TypeScript, de la programmation fonctionnelle, de la programmation système, et plus encore. Cependant, plutôt que de chercher à tout faire, Nu concentre son énergie à bien faire certaines choses :

- Être un shell flexible et multiplateforme avec une approche moderne
- Résoudre les problèmes comme un langage de programmation moderne qui travaille avec la structure de vos données
- Fournir des messages d'erreur clairs et un support IDE propre

## Ce livre

Le livre est divisé en chapitres qui sont eux-mêmes subdivisés en sections.
Vous pouvez cliquer sur les en-têtes des chapitres pour obtenir plus d'informations à leur sujet.

- [Installation](/fr/book/installation.md), sans surprise, vous aide à installer Nushell sur votre système.
- [Prise en main](/fr/book/getting_started.md) vous guide dans vos débuts. Il explique également certains des principes de conception où Nushell diffère des shells typiques comme Bash.
- [Fondamentaux de Nu](/book/nu_fundamentals.md) explique les concepts de base du langage Nushell.
- [Programmer en Nu](/book/programming_in_nu.md) explore plus en profondeur les fonctionnalités du langage et montre plusieurs façons d'organiser et structurer votre code.
- [Nu en tant que Shell](/book/nu_as_a_shell.md) se concentre sur les fonctionnalités du shell, notamment la configuration et l'environnement.
- [Passer à Nu](/book/coming_to_nu.md) a pour but d'offrir un démarrage rapide aux utilisateurs venant d'autres shells ou langages.
- [Notes de Conception](/book/design_notes.md) fournit une explication approfondie de certains des choix de conception de Nushell.
- [Avancé (ou pas)](/book/advanced.md) aborde des sujets plus avancés (ils ne sont pas _si_ avancés que ça, n'hésitez pas à les consulter aussi !).

## Les Nombreux Morceaux de Nushell

Le projet Nushell se compose de plusieurs dépôts et sous-projets.
Vous pouvez tous les trouver sous [notre organisation sur GitHub](https://github.com/nushell).

- Le dépôt principal de Nushell se trouve [ici](https://github.com/nushell/nushell). Il est divisé en plusieurs crates qui peuvent être utilisés comme des bibliothèques indépendantes dans votre propre projet, si vous le souhaitez.
- Le dépôt de notre page [nushell.sh](https://www.nushell.sh), y compris ce livre, se trouve [ici](https://github.com/nushell/nushell.github.io).
- Nushell dispose de son propre éditeur de ligne, qui [a son propre dépôt](https://github.com/nushell/reedline)
- [`nu_scripts`](https://github.com/nushell/nu_scripts) est un endroit pour partager des scripts et des modules avec d'autres utilisateurs, en attendant que nous ayons un gestionnaire de packages.
- [Nana](https://github.com/nushell/nana) est un effort expérimental pour explorer une interface utilisateur graphique pour Nushell.
- [Awesome Nu](https://github.com/nushell/awesome-nu) contient une liste d'outils qui fonctionnent avec l'écosystème Nushell : des plugins, des scripts, des extensions pour éditeurs, des intégrations tierces, etc.
- [Nu Showcase](https://github.com/nushell/showcase) est un espace pour partager des travaux autour de Nushell, que ce soit des blogs, des œuvres d'art ou autre chose.
- [Request for Comment (RFC)](https://github.com/nushell/rfcs) sert d'endroit pour proposer et discuter des changements de conception majeurs. Bien qu'il soit actuellement sous-utilisé, nous prévoyons de l'utiliser davantage à mesure que nous nous rapprochons de la version 1.0 et au-delà.

## Contribuer

Nous accueillons volontiers les contributions !
[Comme vous pouvez le voir](#les-nombreux-morceaux-de-nushell), il y a de nombreux endroits où contribuer.
La plupart des dépôts contiennent un fichier `CONTRIBUTING.md` avec des conseils et des détails qui devraient vous aider à démarrer (sinon, réfléchissez à contribuer une correction !).

Nushell lui-même est écrit en [Rust](https://www.rust-lang.org).
Cependant, vous n'avez pas besoin d'être un programmeur en Rust pour aider.
Si vous connaissez un peu le développement web, vous pouvez contribuer à l'amélioration de ce site web ou du projet Nana.
[Les Dataframes](dataframes.md) peuvent bénéficier de votre expertise en traitement de données.

Si vous avez écrit un script sympa, un plugin, ou intégré Nushell quelque part, nous serions heureux de voir votre contribution à `nu_scripts` ou à Awesome Nu.
Découvrir des bugs avec des étapes pour les reproduire et les signaler sur GitHub est également une aide précieuse !
Vous pouvez contribuer à Nushell simplement en utilisant Nushell !

Étant donné que Nushell évolue rapidement, ce livre a constamment besoin d'être mis à jour.
Contribuer à ce livre ne nécessite pas de compétences particulières, à part une familiarité de base avec le Markdown.
En outre, vous pouvez envisager de traduire des parties dans votre langue.

## Communauté

L'endroit principal pour discuter de quoi que ce soit qui concerne Nushell est notre [Discord](https://discord.com/invite/NtAbbGn).
Vous pouvez également nous suivre sur [Twitter](https://twitter.com/nu_shell) pour des news et des mises à jour.
Enfin, vous pouvez utiliser les discussions ou ouvrir des issues sur GitHub.
