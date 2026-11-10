# Product

<!-- impeccable:product-schema 1 -->

> Nota: este registro se redactó a partir del repositorio (HANDOVER.md y código). Los puntos marcados como *(inferido)* no han sido confirmados por el dueño del producto.

## Platform

web

## Users

Aficionados al deporte de habla hispana (el producto y sus fechas usan es-MX) que ven partidos de fútbol, NBA, NFL y MLB y quieren dejar constancia de lo que vieron: calificarlo, opinar y guardarlo. *(inferido)* Lo usan sobre todo durante o justo después de un partido, muchas veces desde el móvil y de noche.

## Product Purpose

RecordR es una bitácora social de partidos: "Letterboxd para deportes". Cada partido real (datos de ESPN) se puede calificar de 1 a 5 estrellas, comentar en un hilo de opiniones con respuestas y likes, y guardar en listas personales. El éxito es que un aficionado vuelva después de cada partido a registrar su veredicto.

## Positioning

El marcador dice quién ganó; RecordR registra qué tan bueno fue el partido según quienes lo vieron. La unidad del producto es el partido, no la noticia ni la apuesta.

## Operating Context

- Partidos en vivo, próximos y finalizados de LaLiga, Premier League, Champions League, Liga MX, Bundesliga, Serie A, Ligue 1, NBA, NFL y MLB.
- Directorio de jugadores por deporte, liga, equipo y posición, con búsqueda global en ESPN.
- Cuenta con correo y contraseña o Google; perfil con avatar.

## Capabilities and Constraints

- Frontend Angular 21 (componentes standalone) con Bootstrap 5 y Bootstrap Icons; backend Node/Express; despliegue manual en Cloudflare Pages.
- Calificación 1–5 por partido, opiniones con respuestas y likes, listas con icono y descripción.
- El backend gratuito tarda hasta ~50 s en despertar en la primera petición: los estados de carga son parte real de la experiencia.
- El perfil muestra todavía datos de ejemplo (reseñas, distribución, logros); no son datos del usuario.
- Sin decidir: cifras de comunidad públicas (usuarios, reseñas totales). No existen como dato verificable.

## Brand Commitments

- Nombre: RecordR. Logotipo en `frontend/public/logo_final.png`.
- Idioma de la interfaz: español.

## Evidence on Hand

- Datos reales: marcadores, escudos, colores de equipo, sedes y titulares de ESPN; fotos y dorsales de jugadores.
- No hay testimonios, cifras de usuarios ni prensa. No deben inventarse.

## Product Principles

1. El partido es el protagonista; la interfaz lo enmarca.
2. Solo datos reales o ejemplos marcados como tales.
3. Calificar debe costar un gesto.
4. La opinión de la grada vale tanto como el marcador.
