---
title: Filosofia
---

# Filosofia

## Principais Valores

O principal valor do Nu é que trabalhar em um shell deve ser divertido. Para apoiar isso, nós acreditamos que:

- Um shell moderno deve ser projetado para ter usabilidade e ergonomia. **Acima de tudo, Nu deve ser divertido de usar.**
- Deve oferecer mensagens de erro informativas quando um comando não executar corretamente. Isso é criticamente importante. Um shell divertido fornece **erros claros e acionáveis.**
- Deve ser feito visando o uso casual, visto que essa é a forma mais utilziada de um shell, até mesmo por usuários experientes. Construir um shell que é **divertido para o uso casual torna um shell divertido para todo mundo**.
- Nu oferece experimentação e **ideias desenvolvidas de experimentos para programas**. A habilidade de evoluir ideias em uma linha, scripts, e então para programas é um papel fundamental feito por um shell. Para oferecer isso, Nu parte do princípio de comandos compostos que funcionam em um conjunto de tipos de dados compartilhados.

## Não objetivos

- _Performance ótima_. Apesar de nos preocuparmos com performance, o foco em performance deve ser no serviço de fazer o Nu mais utilizável e prazeroso de se utilizar. Melhor performance em micro-benchmarks não é um objetivo.
- _Rigor_. Nós queremos ajudar usuários a escrever bons scripts, mas devemos focar em ajudá-los a escrever scripts corretos com bons erros e boa documentação.
- _Conformidade com POSIX_. Nu otimiza intencionalmente para uma experiência agradável em comparação com a forma como os programas de linha de comando funcionam de uma forma compatível com POSIX. É importante ser capaz de interoperar entre comandos Nu e comandos externos, mas manter uma compatibilidade estrita não é um objetivo
- _Aderência de paradigma_. Nu observa o espaço de flexibilidade dos shells, e quando possível busca ideias de programação funcional, programação de sistemas, POO, e mais. Seguir qualquer paradigma de forma rígida não é um dos objetivos do projeto Nu.

## Design Básico

O princípio do design de Nu é o modelo de dados. Em grande parte, os comandos seguem em serviço para facilitar a criação de dados, o trabalho com dados e a exibição de dados. Uma das peças visíveis desse trabalho é o pipeline, que se baseia fortemente nas ideias originais do Unix de conectar programas juntos em comandos complexos. Nu usa essa filosofia do Unix e a extende de apenas strings para mais tipos de dados que são comuns em linguagens de programação modernas.
