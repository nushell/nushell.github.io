---
title: Philosophy
---

# Philosophy

## Core Values

Nu's core value is that working in a shell should be fun. To support this, we believe that:

- A modern shell should be designed for usability and ergonomics. **Above all else, Nu should be fun to use.**
- It should provide great informative errors messages when a command will not succeed correctly. This is critically important. A fun shell gives **clear, actionable errors**.
- It should be built around supporting casual use, as this is the majority of use in a shell, even by experienced users. Building a shell that is **fun for casual use makes a fun shell for everyone**.
- Nu supports experimentation and **growing ideas from experiments to programs**. The ability to evolve ideas to one-liners, scripts, and then to programs is a key role a shell plays. To support this, Nu builds on the idea of composable commands that work on a shared set of datatypes.

## Non-goals

- *Optimal performance*. While we care about performance, the focus on performance should be in service of making Nu more usable and enjoyable to use. Best performance on micro-benchmarks is a non-goal.
- *Strictness*. We want to help users write good scripts, but we should focus on helping them write correct scripts with good errors and good documentation.
- *POSIX-compliance*. Nu intentionally optimizes for a pleasant experience over matching how commandline programs work in a POSIX-compliant way. It's important to be able to interop between Nu commands and external commands, but maintaining strict compatibility is a non-goal. 
- *Paradigm adherence*. Nu looks at the shell space flexibly, and borrows good ideas where possible from functional programming, systems programming, OOP, and more. Following any particular paradigm rigidly does not serve the goals of the Nu project.

## Basic Design

The core of the Nu design is the data model. Commands largely follow in service of making it easy to create data, to work with data, and to view data. One of the visible pieces of this work is the pipeline, which borrows heavily from the original Unix ideas of connecting simple programs together into more complex commands. Nu takes this Unix philosophy and extends it from only strings to the wider data set that is more common in modern programming languages.

