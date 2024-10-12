---
home: true
heroImage: null
heroText: Nushell
tagline: Un nouveau type de shell
actionText: Prise en main →
actionLink: /fr/book/
features:
  - title: Les pipelines pour contrôler n'importe quel OS
    details: Nu fonctionne sur Linux, macOS, BSD, et Windows. Apprennez-le une fois, utilisez le partout après.
  - title: Tout est donnée
    details: Les pipelines Nu utilisent des données structurées, ce qui vous permet de sélectionner, filtrer et trier de la même manière à chaque fois. Arrêtez de parser des chaînes de caractères et commencez à résoudre des problèmes.
  - title: Des plugins puissants
    details: Il est aisé d'étendre Nu en utilisant un système de plugin puissant.
---

<img src="https://www.nushell.sh/frontpage/ls-example.png" alt="Capture montrant l'utilisation de la commande ls" class="hero"/>

### Nu fonctionne avec les données existantes

Nu parle [JSON, YAML, SQLite, Excel, et plus](/book/loading_data.html), prêt à l'emploi. Il est facile d'injecter des données dans un pipeline Nu, qu'elles proviennent d'un fichier, d'une base de donnée, ou d'une API web :

<img src="https://www.nushell.sh/frontpage/fetch-example.png" alt="Capture montrant un fetch avec une API web" class="hero"/>

### Nu a d'excellents messages d'erreur

Nu opère sur des données typées, il détecte donc des bugs que les autres shells ne détectent pas. Et quand les choses plantent, Nu indique éxactement où et pourquoi :

<img src="https://www.nushell.sh/frontpage/miette-example.png" alt="Capture montrant Nu détectant une erreur de type" class="hero"/>

## Obtenir Nu

Nushell est disponible sous forme de [binaires téléchargeables](https://github.com/nushell/nushell/releases), [via votre package manager préféré](https://repology.org/project/nushell/versions), dans [une GitHub Action](https://github.com/marketplace/actions/setup-nu), ou en [code source](https://github.com/nushell/nushell). Lisez [les instructions d'installation détaillées](/fr/book/installation.html) ou lancez-vous directement :

#### macOS / Linux :

##### Homebrew

```shell
$ brew install nushell
```

##### Profil Nix

```shell
$ nix profile install nixpkgs#nushell
```

#### Windows :

```shell
$ winget install nushell
```

Après l'installation, lancez Nu en tapant `nu`.

## Communauté

Rejoingnez-nous [sur Discord](https://discord.gg/NtAbbGn) si vous avez une question à propos de Nu !

Vous pouvez contribuer à améliorer ce site en [nous donnant des retours](https://github.com/nushell/nushell.github.io/issues) ou en [créant une PR](https://github.com/nushell/nushell.github.io/pulls).
