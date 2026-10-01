# 004 — Reduced motion deixa de anular tudo

- **Status**: DONE
- **Commit**: c5e8624
- **Severidade**: MEDIUM
- **Categoria**: Acessibilidade

## Problema

```css
/* src/app/globals.css — atual */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { transition-duration: 0.001ms !important; }
}
```

Reduced motion significa movimento mais suave, **não zero feedback**. A regra
atual elimina também transições de cor e opacidade, que ajudam a compreensão.

## Alvo

Anular apenas movimento (`translate`, `scale`, `rotate`) e manter
`opacity`/`color`/`background-color` a 200 ms. Acrescentar suporte a
`prefers-reduced-transparency` (cartão de orçamento e navbar passam a opacos).
