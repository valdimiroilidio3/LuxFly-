# 001 — Tokens de easing/duração e corte das durações de hover

- **Status**: DONE
- **Commit**: c5e8624
- **Severidade**: HIGH
- **Categoria**: Easing & duração
- **Âmbito**: globals.css + 11 componentes

## Problema

Vinte e seis `cubic-bezier(0.16,1,0.3,1)` escritos à mão, sem token, e durações
de hover muito acima do orçamento de 300 ms para UI:

```tsx
/* src/components/home/ProjectsSection.tsx:65 — atual */
duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]
/* src/components/site/Navbar.tsx:88 — atual */
transition-colors duration-500
```

Hover é visto dezenas de vezes por dia: a 500–700 ms a interface parece lenta.

## Alvo

Tokens em `@theme`, consumidos em todo o lado:

```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
```

Durações: press 120 ms, hover/cor 180 ms, dropdown 220 ms, sheet 320 ms.
Revelações de scroll (marketing) podem exceder 300 ms.

## Verificação

`npm run build`; em DevTools a 10 % confirmar que o preenchimento do botão
arranca de imediato em vez de deslizar.
