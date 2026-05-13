# 📋 RecordR — Handover Document
**Fecha:** 2026-05-13  
**Proyecto:** RecordR — Red social deportiva (estilo Letterboxd para deportes)  
**Repo:** https://github.com/ingeAMIR/RecordR  
**Estado:** En producción · Desarrollo activo

---

## 1. Stack Tecnológico Final

### Frontend
| Tecnología | Versión |
|---|---|
| Angular | 21.x (standalone components) |
| @angular/build | application builder (Vite-based) |
| RxJS | ~7.8.0 |
| Bootstrap | 5.x (via SCSS) |
| Bootstrap Icons | 1.x |
| TypeScript | 5.x |
| Node.js (build) | 22.x (nvm) |

### Backend
| Tecnología | Versión |
|---|---|
| Node.js | 22.x |
| Express | ^4.19.2 |
| mysql2 | ^3.9.7 |
| bcrypt | ^5.1.1 |
| jsonwebtoken | ^9.0.2 |
| multer | ^2.1.1 |
| dotenv | ^16.4.5 |

### Base de Datos
| Tecnología | Detalle |
|---|---|
| TiDB Cloud Serverless | MySQL 8.5.3 compatible |
| Región | AWS us-east-1 (N. Virginia) |
| Cluster | `recorder-db` |
| Database | `recorder` |

### APIs Externas
| API | Uso | Auth |
|---|---|---|
| ESPN API (site.api.espn.com) | Partidos, calendarios, búsqueda | Pública, sin key |
| API-Football (v3.football.api-sports.io) | Fotos de jugadores soccer | API Key (100 req/día free) |
| TheSportsDB (v1/json/3) | Fotos backup jugadores | Free tier, sin key |
| Wikipedia REST API | Fotos backup jugadores | Pública, sin key |

---

## 2. Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────┐
│                    USUARIO / BROWSER                    │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS
┌──────────────────────▼──────────────────────────────────┐
│          Cloudflare Pages (recordr.pages.dev)           │
│    Angular 21 SPA · dist/frontend/browser               │
│    _redirects: /* → /index.html 200                     │
└──────────────────────┬──────────────────────────────────┘
         ┌─────────────┼────────────────────┐
         │             │                    │
         ▼             ▼                    ▼
  /api/auth/*    /api/opinions/*      /api/ratings/*
  /api/lists/*   /api/activity        /api/espn/*
         │             │
┌────────▼─────────────▼──────────────────────────────────┐
│         Render Free (recordr-api.onrender.com)          │
│         Node.js / Express · server.js                   │
│                                                         │
│  Rutas públicas:   GET /api/opinions/:matchId           │
│                    GET /api/ratings/:matchId            │
│                    GET /api/activity                    │
│                    POST /api/auth/login|register        │
│                    GET /espn/* (proxy ESPN)             │
│                    GET /thesportsdb/* (proxy TDB)       │
│                                                         │
│  Rutas protegidas (requireAuth JWT middleware):         │
│                    POST /api/opinions                   │
│                    PUT /api/opinions/:id/like           │
│                    PUT /api/auth/profile/:id            │
│                    POST/DELETE /api/ratings             │
│                    GET/POST/DELETE /api/lists/*         │
└──────────────────────┬──────────────────────────────────┘
                       │ mysql2 + SSL
┌──────────────────────▼──────────────────────────────────┐
│       TiDB Cloud Serverless (AWS us-east-1)             │
│       gateway01.us-east-1.prod.aws.tidbcloud.com:4000   │
│       Database: recorder                                │
│       Tablas: users, matches, reviews, picks,           │
│               match_opinions, opinion_likes,            │
│               match_ratings, user_lists, list_items     │
└─────────────────────────────────────────────────────────┘

DATOS ESTÁTICOS (sin API en runtime):
  /data/players.json  →  8,010 jugadores pre-generados
  Contenido: Fútbol (6 ligas), NBA, NFL, MLB
  Fotos soccer: ~90% (vía API-Football y Wikipedia)
  Fotos NBA/NFL/MLB: 100% (ESPN CDN)
  Regenerar con: node scripts/generate-players.js
                 node scripts/generate-soccer-photos.js API_KEY
```

### Flujo de datos de jugadores
```
scripts/generate-players.js        →  ESPN API (directo, Node.js)
scripts/generate-soccer-photos.js  →  API-Football /players/squads
scripts/enrich-photos.js           →  Wikipedia API (fallback)
                                   →  frontend/public/data/players.json
                                   →  Build Angular → incluido en bundle
```

### Proxy y Rendimiento (ESPN)
- **CORS:** El backend actúa como proxy para endpoints de ESPN que bloquean CORS desde el browser (rosters de soccer).
- **Caché de Partidos:** Para evitar lentitud extrema al navegar, el frontend implementa una caché en memoria en `EspnService` usando RxJS `shareReplay(1)`. Las más de 30 peticiones HTTP a ESPN se guardan durante 5 minutos, haciendo la navegación instantánea después del primer load.

---

## 3. Estado del Despliegue

### Producción
| Servicio | Plataforma | URL | Plan |
|---|---|---|---|
| Frontend | Cloudflare Pages | https://recordr.pages.dev | Free (ilimitado) |
| Backend | Render | https://recordr-api.onrender.com | Free (duerme 15min sin tráfico) |
| Base de datos | TiDB Cloud | gateway01.us-east-1.prod.aws.tidbcloud.com:4000 | Starter (gratis, 5GB) |

### Comportamiento del plan Free de Render
- El backend "duerme" tras 15 minutos de inactividad
- El primer request tarda ~50 segundos en despertar (esto puede causar que la carga inicial de conversaciones en un partido parezca lenta, pero luego es instantánea).
- Con usuarios activos no duerme.

### CI/CD
**No hay pipeline automático integrado con GitHub todavía para Pages.** El deploy sigue siendo manual mediante Wrangler:

```bash
# 1. Build frontend
cd frontend && npm run build

# 2. Push a GitHub
git add -A
git commit -m "descripción"
git push

# 3. Deploy manual a Cloudflare Pages
cd frontend
npx wrangler pages deploy dist/frontend/browser \
  --project-name=recordr \
  --branch=main \
  --commit-dirty=true

# 4. Render redeploya automáticamente con cada push a main
```

---

## 4. Bóveda de Secretos y Configuración

### backend/.env (producción en Render)
```env
# ── Base de Datos TiDB Cloud ──────────────────────────────
DB_HOST=gateway01.us-east-1.prod.aws.tidbcloud.com
DB_PORT=4000
DB_USER=LcuDVrZhQGDu4iV.root
DB_PASSWORD=D78vhPUlmoEB7ZY5
DB_NAME=recorder

# ── App ───────────────────────────────────────────────────
NODE_ENV=production
PORT=3000
JWT_SECRET=recordr_secret_2026_xK9mP

# ── APIs Externas ─────────────────────────────────────────
API_FOOTBALL_KEY=25999792cebaba43e105fc133cc96fcc
# ESPN → pública, sin key
# TheSportsDB → free tier /3/, sin key
# Wikipedia → pública, sin key
```

### frontend/src/environments/environment.prod.ts (Cloudflare Pages)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://recordr-api.onrender.com', // Corregido: recordr, no recorder
};
```

---

## 5. Funcionalidades Implementadas (100% operativas)

### Autenticación
- [x] Registro con email + contraseña (bcrypt)
- [x] Login con JWT y Google OAuth (Natívo)
- [x] Corrección de validación visual de formularios (ahora muestra errores claros).
- [x] Perfil editable (username, email, avatar)
- [x] AuthGuard y JWT Interceptor

### Partidos & UI v2
- [x] Rediseño v2 implementado: Navbar isla, diseño editorial de detalles y perfil.
- [x] Ticker de resultados en vivo (estilo Bloomberg) pegado bajo la navbar. Conectado al backend/ESPN.
- [x] Listado en vivo vía ESPN API. Caché RxJS integrada (carga instantánea).
- [x] Detalle de partido con opiniones y gráficas (Rediseño aplicado).
- [x] Rating por partido — conectado a DB y actualizado de forma optimista.

### Opiniones & Actividad
- [x] Publicar opinión y respuestas anidadas.
- [x] Like/unlike en tiempo real.
- [x] Textarea de opiniones arreglado en su diseño visual (usa todo el ancho).
- [x] **NUEVO:** Feed de actividad global en la pantalla Home (`/api/activity`) consumiendo datos reales de valoraciones y reseñas.

### Jugadores
- [x] 8,010 jugadores cargados.
- [x] Fotos de soccer completadas al **90%** (fusionando API-Football y Wikipedia).
- [x] **NUEVO:** Filtros de posición arreglados en NBA (Guard→Base/Escolta, etc.) y NFL (Place Kicker→K/P).
- [x] Búsqueda global ESPN y Caché local.

### Listas
- [x] Crear/eliminar listas en el Perfil.
- [x] **NUEVO:** Botón "Añadir a lista" implementado en la UI del detalle de cada partido (abre modal, guarda en BD).

---

## 6. Pendientes e Issues Abiertos

*Todas las tareas de alta y media prioridad del antiguo Handover se han completado.*

### 🟢 Baja prioridad / Features nuevas

- **Predicciones (Picks)**: tabla `picks` existe en DB pero sin UI ni endpoints
- **Perfiles públicos**: no hay endpoint `GET /api/users/:id` para ver perfiles ajenos
- **Sistema de seguidores**: no hay tabla `user_follows` ni UI
- **Notificaciones**: sin sistema de notificaciones para replies
- **Deploy automático (Pages)**: crear el proyecto nuevo en Cloudflare Dashboard enlazado a Github para no usar Wrangler.
- **CORS más estricto**: el regex `.*\.pages\.dev` es demasiado permisivo

---

## 7. Instrucciones de Continuidad

### Estilo de colaboración
- **No pedir confirmación** antes de implementar cambios de código — ejecutar directamente
- **Probar en local primero**, luego el usuario confirma → hacer push + deploy
- **Sin comentarios en código** a menos que la lógica sea muy no-obvia
- **Sin logs de debug en producción** — limpiar `console.log` antes de push
- **Commits en español**, mensajes cortos y descriptivos, sin co-authored-by

### Comandos frecuentes
```bash
# Dev local
cd frontend && npm start               # Angular en localhost:4200
cd backend && node server.js           # Backend en localhost:3000

# Build + Deploy
cd frontend && npm run build
npx wrangler pages deploy dist/frontend/browser \
  --project-name=recordr --branch=main --commit-dirty=true

# Regenerar datos de jugadores (Ojo: Hacer backup del json para no perder fotos)
node scripts/generate-players.js
```
