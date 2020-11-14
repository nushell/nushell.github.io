---
title: Filosofia
---

# Filosofia

## Valores Fundamentales

El valor central de Nu es que trabajar en un shell debe ser divertido. Para esto, creemos que:

- Una shell moderna debe ser diseñada para usabilidad y ergonomía. **Por encima de todo, Nu debería ser divertido de usar.**
- Debería proporcionar buenos mensajes informativos de errores cuando un comando no finalizará correctamente. Esto es de vital importancia. Un shell divertido da mensajes de errores **claros y procesables**
- Debe construirse en torno al uso casual, ya que esta es la mayoría del uso en una shell, incluso para usuarios con experiencia. Construyendo una shell que sea **divertido para uso casual se traduce a una shell divertida para todos**.
- Nu soporta experimentación y **crecer ideas de experimentos a programas**. La habilidad de evolucionar ideas desde líneas simples, scripts, y posteriormente a programas es un papel clave que se desempeña en una shell. Para respaldar esto, Nu se basa en la idea de comandos componibles que funcionan en un conjutos compartido de tipos de datos.

## No metas

- *Rendimiento óptimo*. Si bien nos preocupa rendimiento, el enfoque en el rendimiento debe estar al servicio de hacer que Nu sea más usable y agradable de usar. El mejor rendimiento en micro-puntos de referencia no es un objetivo.
- *Estricto*. Queremos ayudar a los usuarios a escribir buenos scripts, pero centrándonos en que dichos scripts sean correctos con buenos errores y buena documentación.
- *Cumplimiento-POSIX*. Nu se optimiza intencionalmente para una experiencia placentera en vez de igualar cómo programas de línea de comandos funcionan de una manera POSIX-compliant. Es importante poder interoperar entre comandos de Nu y comandos externos, pero mantener compatibilidad estricta no es una meta. 
- *Adhesión de paradigma*. Nu mira el espacio de shells flexiblemente, y presta buenas ideas de programación funcional, programación de sistemas, orientación a objetos, y más donde sea posible. Seguir algun paradigma en particular de manera rígida no sirve para los objetivos del proyecto Nu.

## Diseño Básico

El diseño central de Nu es el modelo de datos. Comandos siguen en gran medida en el servicio para facilitar la creación de datos, trabajar con datos, y ver datos. Una de las piezas visibles de este trabajo es la canalización a través de la tubería, que se basa en gran medida en las ideas originales de Unix de conectar comandos simples en comandos más complejos. Nu toma esta filosofía de Unix y la extiende desde solo cádenas de texto al más amplio conjuntos de datos que es más común en lenguajes modernos de programación.

