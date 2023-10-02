# Instalando Nu

Atualmente, as melhores maneiras de instalar o Nu são a partir do [crates.io](https://crates.io), fazer o download dos binários da nossa [página de releases](https://github.com/nushell/nushell/releases), fazer o build a partir dos fontes ou baixar um container pronto com o Docker.

## Binários

Você pode baixar o Nu da [página de releases](https://github.com/nushell/nushell/releases). Alternativamente, se você usa o [Homebrew](https://brew.sh/) para macOS, pode instalar o binário executando o comando `brew install nushell`.

## Preparando

Antes de instalar o Nu, precisamos nos certificar de que nosso sistema tem os requisitos necessários. Atualmente, isso significa ter certeza de que temos tanto o conjunto de ferramentas do Rust como as dependências locais instaladas.

### Instalando o Rust

Se ainda não tivermos o Rust instalado no sistema, a melhor maneira de instalar é via [rustup](https://rustup.rs/). Rustup é uma maneira de gerenciar instalações, inclusive de versões diferentes de Rust.

O Nu atualmente requer a versão **nightly** do Rust. Quando você abrir o "rustup" pela primeira vez, ele vai perguntar qual versão do Rust você quer instalar:

```nu
Current installation options:

   default host triple: x86_64-unknown-linux-gnu
     default toolchain: stable
  modify PATH variable: yes

1) Proceed with installation (default)
2) Customize installation
3) Cancel installation
```

Selecione a opção #2 para customizar a instalação.

```nu
Default host triple?
```

Aperte enter aqui para selecionar o default.

```nu
Default toolchain? (stable/beta/nightly/none)
```

Certifique-se de digitar "nightly" aqui e pressionar enter. Isso vai levar à configuração seguinte:

```nu
Modify PATH variable? (y/n)
```

Você pode opcionalmente atualizar o seu _path_. Normalmente é uma boa ideia, pois torna os passos seguintes mais fáceis.

```nu
Current installation options:

   default host triple: x86_64-unknown-linux-gnu
     default toolchain: nightly
  modify PATH variable: yes

1) Proceed with installation (default)
2) Customize installation
3) Cancel installation
```

Você pode ver que o toolchain agora mudou para a versão nightly. Se isso parece um pouco arriscado, não se preocupe. O compilador do Rust passa por uma bateria completa de testes. O compilador nightly é praticamente tão confiável quanto a versão estável.

Quando estiver pronto, pressione 1 e enter. Depois desse ponto, podemos seguir as instruções que o "rustup" nos der e teremos um compilador Rust funcionando no nosso sistema.

Se você preferir não instalar o Rust via "rustup", você pode também instalar por outros métodos (por exemplo, a partir de um pacote em uma distribuição Linux). Apenas se certifique de instalar uma versão nightly recente.

## Dependências

### Debian/Ubuntu

Você vai precisar instalar os pacotes "pkg-config" e "libssl-dev":

```bash
apt install pkg-config libssl-dev
```

Usuários Linux que quiserem usar as funcionalidades opcionais `rawkey` ou `clipboard` precisarão instalar os pacotes "libx11-dev" and "libxcb-composite0-dev":

```bash
apt install libxcb-composite0-dev libx11-dev
```

### macOS

Ao usar o [Homebrew](https://brew.sh/), você precisará instalar o "openssl" e o "cmake" usando:

```bash
brew install openssl cmake
```

## Instalando a partir do [crates.io](https://crates.io)

Quando tivermos todas as dependências de que o Nu precisa, podemos instalá-lo usando o comando `cargo`, que vem junto com o compilador Rust.

```nu
> cargo install nu
```

Pronto! A ferramenta cargo fará o download do Nu e das dependências do fonte, o build e a instalação no caminho bin do cargo, de forma que possamos rodá-lo.

Se quiser instalar todas as funcionalidades, inclusive algumas opcionais divertidas, você pode usar:

```nu
> cargo install nu --features=stable
```

Para esse comando funcionar, certifique-se de ter todas as dependências (mostradas acima) instaladas no seu sistema.

Uma vez instalado, podemos rodar o Nu usando o comando `nu`:

```bash
$ nu
/home/jonathan/Source>
```

## Fazendo o Build a partir dos fontes

Também podemos fazer o build do código fonte diretamente do GitHub. Isso nos dá acesso imediato às últimas funcionalidades e correções do Nu.

```nu
> git clone https://github.com/nushell/nushell.git
```

O Git vai clonar o repositório principal do nushell e daí podemos fazer o build e rodar o Nu:

```bash
> cd nushell
nushell> cargo build --workspace --features=stable; cargo run --features=stable
```

Você também pode fazer o build e rodar o Nu em modo release:

```bash
nushell> cargo build --release --workspace --features=stable; cargo run --release --features=stable
```

Pessoas mais acostumadas com Rust podem se perguntar por que fazemos tanto o "build" como o "run" se o "run" já faz o build por padrão. Isso serve para contornar uma falha da nova opção `default-run` no Cargo e assegurar que será feito o build de todos os plugins, embora possa não ser necessário no futuro.

## Configurando como login shell

**!!! Nushell ainda está em desenvovlimento e pode não estar estável para uso diário. !!!**

Você pode definir o seu login shell usando o comando [`chsh`](https://linux.die.net/man/1/chsh).

Algumas distribuições Linux possuem uma lista de shells válidos em `/etc/shells` e não permitirão modificar o shell até que o Nu esteja nessa lista branca. Você pode ver um erro similar ao mostrado abaixo se não tiver atualizado seu arquivo `shells`.

```bash
chsh: /home/username/.cargo/bin/nu is an invalid shell
```

Você pode adicionar o Nu à lista de shell permitidos acrescentando o binário do Nu ao arquivo `shells`. O caminho a ser adicionado pode ser encontrado com o comando `which nu` e geralmente é `$HOME/.cargo/bin/nu`.
