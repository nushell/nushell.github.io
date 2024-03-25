---
title: Parser and other editor tools
---

# Parser and other editor tools

Hi! There is a lot of space to grow in this area, and the development is
somewhat spaced in time, so I (@AucaCoyan) decided to make a document explaning
the framework, conventions and other required knowledge to help others and
myself with this section.

## Parser

The most important piece of this chapter is the parser. The parser is the bridge
between the `*.nu` text files and the internal representation of object in
nushell. Almost everything in this chapter interacts or is affected by the
parser.

### Current status

The current production parser is not bad at all, but it has certain areas that
some improvement that could be greately appreciated. Sophia [started a new parser](https://github.com/sophiajt/new-nu-parser/)
and it's still on the works. The central idea of this new parser is that it
will have multiple passes over the text, improving the typing structures by
a lot.

## Formatter

We have [`nufmt`](https://github.com/nushell/nufmt), but is a little stagnated
because it will probably need some rework after the new parser is landed. The
current issue is a bug reading stdin from the cmdline. Ask @AucaCoyan anything!

## LSPs

LSP stands for Language Server Protocol, a [Microsoft document](https://microsoft.github.io/language-server-protocol/)
to establish communication between text editors and parsers and other tools.

We currently have 2 of them, one for VS Code and one for other terminal editors

### VSCode

This has [it's own extension](https://github.com/nushell/vscode-nushell-lang/)
and it's the most advanced LSP. It was the first to appear it is bootstraped
from a prototype of Microsoft. It's written in Typescript and interacts with
`nu` in the command line to have:

- hover
- go to definition
- auto-completions

### nu-lsp

This is a newer LSP that we would like to have as the long term for every editor
. It's written in rust and it's on the `nushell/nushell` repo, in the
[`crates/nu-lsp`](https://github.com/nushell/nushell/tree/main/crates/nu-lsp)
folder. Interacts via stdin and stdout and it is useful for vim,
neovim, helix and other text editors. Sadly, it doesn't have the same level of
features of VSCode-nushell-lang, that's why we still can't replace it.

## Tree-sitter

We have another grammar: [tree-sitter nushell](https://github.com/nushell/tree-sitter-nu) this is useful for terminal text editors (nvim, helix, etc). VS Code doesn't have support for tree-sitter and its grammar [is written in tmLanguage](https://github.com/nushell/vscode-nushell-lang/blob/main/syntaxes/nushell.tmLanguage.json)
It has the following goals:

- Ability to serve as a parser for a repl
- Ability to work in editors that support tree-sitter (hx, nvim, others)
- Ability to work in rust
- Fast
- Ability to be utilized for syntax highlighting

## I dont know a thing about all this, can you give me a hint where to learn?

Sure!

- Adrian Hesketh gives an excellent talk about [how LSP works](https://youtu.be/EkK8Jxjj95s?si=KT3YdfV5LebbTzXp)
- TeeJ explains [tree-sitter in a 15 min video](https://www.youtube.com/watch?v=09-9LltqWLY)
- about the formatter:
  - Bob Nystrom worked with the dart formatter and [wrote a precious blog post](https://journal.stuffwithstuff.com/2015/09/08/the-hardest-program-ive-ever-written/) about his journey. The hackernews
    [post is also useful](https://news.ycombinator.com/item?id=22706242) for the
    comments!
  - and a [short overall view](https://blog.vjeux.com/2017/javascript/anatomy-of-a-javascript-pretty-printer.html)
    of how `prettier` works
