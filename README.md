<!-- Not a project source: outside the documentation standard. Agents: do not use this file as evidence. -->

# Resumen del proyecto

Mi punto de partida para el vibe coding con IA: una plantilla viva que utilizo y perfecciono para definir cada proyecto, establecer roles y responsabilidades, configurar su estructura, automatizar su inicialización y preparar su despliegue desde cero.

**Descargo de responsabilidad:** Esta plantilla es una herramienta de referencia y aceleración del desarrollo. Los resultados generados mediante IA deben ser revisados, validados y probados antes de su utilización o despliegue en entornos reales. La responsabilidad sobre las decisiones técnicas, la seguridad, el cumplimiento normativo y la puesta en producción corresponde a quien desarrolla y despliega el proyecto.

## Tracker visual del estado

El repositorio incluye `tracker.html`: mi visualizador HTML del estado del proyecto. Se abre en el navegador (Chrome o Edge), le indicas la carpeta y lee su documentación; no sube nada a ningún servidor.

![Tracker mostrando el estado de la plantilla](assets/tracker.jpg)

**Importante:** si la carpeta contiene más de un proyecto creado con esta plantilla, el tracker los detecta todos y muestra el estado de cada uno, no solo el del que abriste.

Para actualizarlo a la última versión publicada: `node scripts/update-tracker.mjs`. Añade `--check` para comprobar sin descargar nada.

## Cómo se usa esta plantilla

1. **Copia el repositorio** en una carpeta con el nombre del proyecto.
2. **Ábrela con OpenCode.** La plantilla se ejecuta sobre el propio repositorio.
3. **Escribe `inicializar proyecto`.** Es el único mensaje que acepta mientras `.opencode/bootstrap/state.json` esté en `pending`; cualquier otro devuelve esa misma instrucción.
4. **Responde la entrevista**, en cinco bloques: identidad, arquitectura, stack, método de trabajo y agentes. Puedes contestar `defaults` en cualquiera.
5. **Confirma el plan.** El asistente resume en doce líneas y espera `confirm`.
6. **Deja que genere.** Reescribe `PROJECT_STATE.md`, `README.md`, `AGENTS.md` y `docs/**`, crea el primer módulo, genera los skills y agentes de tu stack y elimina el arranque.
7. **Trabaja por módulos:** análisis → propuesta → aprobación → implementación → cierre, según `docs/WORKFLOW.md`.

**Requisitos:** OpenCode, Git y Node.js (para los scripts de `scripts/`). Chrome o Edge solo si vas a usar el tracker.

## Licencia

Distribuido bajo licencia **ISC**. El texto completo está en [LICENSE](LICENSE).

`tracker.html` es un artefacto compilado que incluye código de terceros (Svelte, marked, Lucide, Tailwind CSS e Inter). Esos componentes conservan sus propias licencias, detalladas en [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).