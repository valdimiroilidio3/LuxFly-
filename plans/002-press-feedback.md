# 002 — Feedback de pressão

- **Status**: DONE
- **Commit**: c5e8624
- **Severidade**: HIGH
- **Categoria**: Fisicalidade & origem

## Problema

`grep -c active:scale src` devolve **0**. Nenhum botão, link-pílula ou cartão
responde ao toque. Apple: o feedback vive no *pointer-down*, não no release.

## Alvo

```css
.pressable { transition: transform 120ms var(--ease-out); }
.pressable:active { transform: scale(0.97); }
```

Aplicar a: CTAs da hero, botões do formulário, pílulas de navegação, linhas de
serviço, cartões de projeto, botões do admin.

## Verificação

Pressionar e manter: o elemento encolhe de imediato; ao soltar volta em 120 ms.
