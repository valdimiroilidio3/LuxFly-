# 006 — Tracking específico por tamanho

- **Status**: DONE
- **Commit**: c5e8624
- **Severidade**: MEDIUM
- **Categoria**: Coesão

## Problema

`letter-spacing` fixo por classe (`-0.055em` em toda a `.display`), aplicado dos
40 px aos 220 px. Em tamanhos pequenos fecha demais; em display ainda abre.

## Alvo

Escala com tracking por patamar (`-0.045em` em títulos médios, `-0.075em` em
display, `0` no corpo, `+0.18em` nos eyebrows) e leading inverso ao tamanho.
