# 003 — Hovers protegidos em touch

- **Status**: DONE
- **Commit**: c5e8624
- **Severidade**: MEDIUM
- **Categoria**: Acessibilidade

## Problema

14 efeitos de movimento em hover (`group-hover:scale`, `group-hover:translate`)
sem `@media (hover: hover)`. Em touch o tap dispara hover e o estado fica preso.

## Alvo

Variante Tailwind personalizada e uso de `hoverable:` nos movimentos:

```css
@custom-variant hoverable (@media (hover: hover) and (pointer: fine));
```

Transições de cor podem permanecer; movimento (scale/translate) é protegido.
