# Planos de motion — MODUS

Auditoria conduzida com a metodologia `improve-animations` (Emil Kowalski).
Commit de referência: `c5e8624`.

| # | Plano | Severidade | Categoria | Estado |
| --- | --- | --- | --- | --- |
| 001 | Tokens de easing e duração; cortar hovers de 500–700 ms | HIGH | Easing & duração | DONE |
| 002 | Feedback de pressão em todos os elementos pressionáveis | HIGH | Fisicalidade | DONE |
| 003 | Proteger hovers em dispositivos táteis | MEDIUM | Acessibilidade | DONE |
| 004 | Reduced motion deixa de anular todo o feedback | MEDIUM | Acessibilidade | DONE |
| 005 | Molas Apple e transformações aceleradas por hardware | MEDIUM | Performance | DONE |
| 006 | Escala tipográfica com tracking específico por tamanho | MEDIUM | Coesão | DONE |

Ordem de execução: 001 → 002 → 003 → 004 → 005 → 006.
O 001 cria os tokens de que os restantes dependem.
