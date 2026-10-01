# 005 — Molas Apple e transformações aceleradas

- **Status**: DONE
- **Commit**: c5e8624
- **Severidade**: MEDIUM
- **Categoria**: Performance / interruptibilidade

## Problema

Tudo o que é interativo usa tweens de duração fixa. As shorthands `x`/`y`/
`scale` do Motion correm na main thread e perdem frames sob carga.

## Alvo

- Interações dirigidas pelo utilizador (menu móvel, botão magnético, cursor)
  passam a molas: `{ type: "spring", bounce: 0, duration: 0.4 }` por omissão;
  `bounce: 0.2` apenas onde houve momento (arrasto/flick).
- Menu móvel: arrastar para fechar com projeção de momento
  `project(v) = (v/1000) * 0.998 / (1 - 0.998)` e handoff de velocidade.
