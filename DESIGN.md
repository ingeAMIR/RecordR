# RecordR · Sistema de diseño

Dirección: **álbum de estampas**. Cada partido es una estampa y cada jugador un cromo; la interfaz es la hoja del álbum donde se pegan. Todo el sistema vive en `frontend/src/styles.scss` (tokens y clases globales) y en el SCSS de cada componente.

## Principios

- La estampa es el protagonista. El resto (navegación, filtros, formularios) es papel y tinta: plano, sin adornos.
- Solo datos reales. Colores de equipo, escudos, marcadores y fotos vienen de ESPN; no se inventan cifras ni reseñas.
- El 3D pertenece al objeto físico: inclinar, voltear y apilar estampas. Nada de 3D decorativo en fondos.
- Rojo significa en vivo. Verde significa acción. No se usan para otra cosa.

## Color

| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| `--bg` | `#ece5d5` | `#14161b` | Hoja del álbum |
| `--bg-2` | `#e1d9c5` | `#1c1f26` | Superficie secundaria |
| `--fg` | `#17140f` | `#efe9dc` | Texto |
| `--fg-2` | `#5a5344` | `#aaa392` | Texto secundario |
| `--accent` | `#0a6b35` | `#4fd487` | Acción principal, pestaña activa |
| `--live` | `#c02a15` | `#ff7253` | Solo partidos en vivo |
| `--danger` | `#a3200f` | `#ff8a70` | Errores |
| `--rule` / `--rule-2` | tinta 16 % / 44 % | papel 14 % / 42 % | Líneas y bordes |

Las estampas usan la clase `.paper`, que fija los tokens claros: una estampa siempre es papel claro, también en tema oscuro. El tema sigue `prefers-color-scheme`.

Dentro de la estampa, el fondo es una diagonal con los dos colores reales de los equipos y los escudos van en círculos blancos.

## Tipografía

Una sola familia: **Archivo Variable** (`@fontsource-variable/archivo`).

- Titulares (`.display`, `--xl` / `--l` / `--m`): mayúsculas, `font-stretch` 62–70 %, peso 850–900, interlineado apretado.
- Texto: ancho normal, peso 400–700, `1rem / 1.5`. Números tabulares en toda la app.
- `.lede` para la entradilla, `.small` y `.muted` para apoyo.

## Forma y profundidad

- Radio de estampa `--r-card: 14px`; controles `--r-ctl: 10px`.
- Sombras `--shadow` y `--shadow-lift`: cortas y duras, como papel sobre mesa. Sin desenfoques ni cristal.
- Huecos vacíos y estados de carga: `.slot` (borde discontinuo, como el hueco del álbum).
- Lámina holográfica solo para partidos terminados con nota ≥ 4,5.

## Movimiento y 3D

- `appTilt` (`directives/tilt.directive.ts`): inclina la estampa siguiendo el puntero y mueve el brillo (`.estampa__glare`). `[tiltMax]` limita el ángulo.
- `.flip`: la estampa se voltea para calificar por el reverso.
- Mazo apilado en la portada; `<app-match-card [deep]>` separa capas en Z.
- Transiciones de vista del router: la estampa viaja de la lista al detalle (`VtService.nameFor(id)`).
- Curva `--ease`. Con `prefers-reduced-motion: reduce` la inclinación no se activa y las animaciones se reducen.

## Componentes globales

`.wrap`, `.page`, `.btn` (`--primary`, `--ink`, `--line`, `--sm`, `--lg`, `--block`), `.icon-btn`, `.field` + `.field__label`, `.input`, `.select`, `.textarea`, `.note` (`--error`, `--ok`), `.tabs` / `.tab`, `.pills` / `.pill`, `.stars`, `.star-input`, `.rating-num`, `.estampa`, `.grid-estampas`, `.slot`, `.sheet` + `.sheet-backdrop`, `.link`.

Iconos: `bootstrap-icons` (solo la fuente de iconos; el CSS de Bootstrap ya no se carga).

## Lo que no se hace

Texto con degradado, paneles de cristal, etiquetas pequeñas sobre los títulos, rejillas de tarjetas idénticas con icono, tarjetas dentro de tarjetas, emojis como iconos, cifras de relleno, `alert()` para mensajes (se usan `.note` en línea).
