# 📋 RecordR — Handover Document
**Fecha:** 2026-04-30  
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
  /api/lists/*   (con JWT Bearer)     /api/espn/*
         │             │
┌────────▼─────────────▼──────────────────────────────────┐
│         Render Free (recordr-api.onrender.com)          │
│         Node.js / Express · server.js                   │
│                                                         │
│  Rutas públicas:   GET /api/opinions/:matchId           │
│                    GET /api/ratings/:matchId            │
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
  /data/players.json  →  7,865 jugadores pre-generados
  Contenido: Fútbol (6 ligas), NBA, NFL, MLB
  Fotos soccer: ~19% (700+ jugadores)
  Fotos NBA/NFL/MLB: 100% (ESPN CDN)
  Regenerar con: node scripts/generate-players.js
                 node scripts/generate-soccer-photos.js API_KEY
```

### Flujo de datos de jugadores
```
scripts/generate-players.js        →  ESPN API (directo, Node.js)
scripts/generate-soccer-photos.js  →  API-Football /players/squads
                                   →  Wikipedia API (fallback)
                                   →  frontend/public/data/players.json
                                   →  Build Angular → incluido en bundle
```

### Proxy de ESPN (CORS fix)
El backend actúa como proxy para endpoints de ESPN que bloquean CORS desde el browser:
- `GET /espn/apis/site/v2/sports/soccer/{league}/teams` → ESPN
- `GET /espn/apis/site/v2/sports/soccer/{league}/teams/{id}/roster` → ESPN
- NBA/NFL/MLB roster endpoints NO necesitan proxy (ESPN permite CORS en esos)

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
- El primer request tarda ~30 segundos en despertar
- Con usuarios activos no duerme

### CI/CD
**No hay pipeline automático.** El deploy es manual:

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
#    (si está conectado al repo ingeAMIR/RecordR en Render dashboard)
```

### Archivos clave de deployment
- `render.yaml` — configuración del servicio Render
- `frontend/public/_redirects` — SPA routing en Cloudflare Pages
- `frontend/angular.json` — build config, budgets aumentados
- `frontend/proxy.conf.json` — proxy dev server (solo local)

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

### frontend/src/environments/environment.ts (local dev)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
};
```

### frontend/src/environments/environment.prod.ts (Cloudflare Pages)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://recordr-api.onrender.com',
};
```

### Cuentas y servicios
```
TiDB Cloud:      amirgoyri@gmail.com
Cloudflare:      cuenta GitHub ingeAMIR (OAuth)
Render:          cuenta GitHub ingeAMIR (OAuth)
GitHub:          ingeAMIR/RecordR (repo público)
API-Football:    amirgoyri@gmail.com
                 Key: 25999792cebaba43e105fc133cc96fcc
                 Límite: 100 req/día (se resetea a medianoche)
Wrangler CLI:    autenticado localmente (token en ~/.wrangler)
```

---

## 5. Funcionalidades Implementadas (100% operativas)

### Autenticación
- [x] Registro con email + contraseña (bcrypt)
- [x] Login con JWT (30 días de expiración)
- [x] Perfil editable (username, email, avatar)
- [x] HTTP Interceptor que adjunta JWT a todos los requests al backend
- [x] AuthGuard en ruta `/profile` → redirige a `/login` si no autenticado

### Partidos
- [x] Listado en vivo vía ESPN API (Soccer, NBA, NFL, MLB)
- [x] Filtros por deporte (tabs), liga y estado (live/final/próximo)
- [x] Detalle de partido con opiniones
- [x] Rating por partido — guardado en DB (`match_ratings`)
- [x] Rating promedio calculado en backend

### Opiniones
- [x] Publicar opinión (requiere auth) con usuario y avatar reales
- [x] Respuestas anidadas (threading)
- [x] Like/unlike con actualización optimista
- [x] Carga de opiniones con estado "likedByMe" por usuario

### Jugadores
- [x] 7,865 jugadores cargados desde JSON estático
- [x] Fotos: NBA/NFL/MLB 100%, Soccer ~19%
- [x] Filtros: sport tabs, liga, equipo, posición, búsqueda local
- [x] Búsqueda global ESPN (endpoint `/search/v2`) — encuentra cualquier jugador
- [x] Caché en localStorage (7 días)
- [x] Ligas: LaLiga, PL, Bundesliga, Ligue 1, Serie A, Liga MX, NBA, NFL, MLB

### Listas
- [x] Crear/eliminar listas — guardadas en DB (`user_lists`, `list_items`)
- [x] Persistencia real entre dispositivos (requiere auth)

### Infraestructura
- [x] Backend proxy para ESPN (evita CORS en soccer rosters)
- [x] Backend proxy para TheSportsDB
- [x] JWT middleware (`requireAuth`) en rutas protegidas
- [x] Validación de ownership en edición de perfil
- [x] CORS configurado para Cloudflare Pages

---

## 6. Pendientes e Issues Abiertos

### 🔴 Alta prioridad

**[FOTOS] Enriquecer soccer players pendientes**
- Ligas sin fotos completas: Serie A (~6%), Liga MX (~7%)
- Fix: correr `node scripts/generate-soccer-photos.js 25999792cebaba43e105fc133cc96fcc`
- Requiere >100 requests → esperar al siguiente día (límite API-Football = 100/día)
- Después: `npm run build` → `git push` → `wrangler pages deploy`

**[AUTH] Google OAuth no está configurado**
- `login.ts` tiene `client_id: 'TU_CLIENT_ID_DE_GOOGLE...'` hardcodeado
- Necesita Google Cloud Console → OAuth 2.0 Client ID
- El endpoint `/api/auth/google` en el backend SÍ está implementado

**[MATCHES] Ratings en matches.ts todavía son client-only**
- `matches.ts` usa `fakeTotalVotes = 10` en su cálculo local
- Solo `match-detail.ts` fue corregido para usar el backend
- Fix: replicar la lógica de `RatingService` en `matches.ts`

### 🟡 Media prioridad

**[LISTAS] Agregar partidos a listas desde match-detail**
- El backend tiene `POST /api/lists/:id/items` operativo
- Falta el botón "Agregar a lista" en la UI de match-detail
- `ListsService.addMatch()` ya existe en el frontend, solo falta conectarlo

**[HOME] Feed de actividad reciente es mock**
- `home.ts`: `recentActivity` y `popularLists` son arrays hardcodeados
- Necesita endpoint `GET /api/activity` en el backend
- Sugerencia: consultar opiniones recientes de todos los usuarios

**[MATCHES] Rating previo del usuario no se carga**
- Al entrar a la página de partidos, el usuario no ve su rating anterior
- Fix: al cargar cada partido, consultar `GET /api/ratings/:matchId/user/:userId`

### 🟢 Baja prioridad / Features nuevas

- **Predicciones (Picks)**: tabla `picks` existe en DB pero sin UI ni endpoints
- **Perfiles públicos**: no hay endpoint `GET /api/users/:id` para ver perfiles ajenos
- **Sistema de seguidores**: no hay tabla `user_follows` ni UI
- **Notificaciones**: sin sistema de notificaciones para replies
- **Deploy automático**: conectar Render al repo para auto-deploy en push
- **CORS más estricto**: el regex `.*\.pages\.dev` es demasiado permisivo

---

## 7. Instrucciones de Continuidad

### Estilo de colaboración
- **No pedir confirmación** antes de implementar cambios de código — ejecutar directamente
- **Probar en local primero**, luego el usuario confirma → hacer push + deploy
- **Sin comentarios en código** a menos que la lógica sea muy no-obvia
- **Sin logs de debug en producción** — limpiar `console.log` antes de push
- **Commits en español**, mensajes cortos y descriptivos, sin co-authored-by
- Cuando hay múltiples cambios relacionados: **un solo commit**

### Reglas de código establecidas
```
Angular:
  - Standalone components siempre
  - ChangeDetectorRef.detectChanges() para forzar re-render en callbacks async
  - Usar environment.apiUrl para todas las URLs al backend
  - environment.ts path desde services:    '../../environments/environment'
  - environment.ts path desde components:  '../../../environments/environment'

Backend:
  - requireAuth middleware en rutas protegidas
  - Rutas públicas de lectura NO requieren auth (GET opinions, GET ratings)
  - Usar parámetros preparados en todas las queries SQL (ya implementado)
  - ESPN proxy y TheSportsDB proxy viven en server.js

Base de datos:
  - DB name: recorder (minúsculas)
  - TiDB Cloud: ejecutar migraciones desde el SQL Editor del dashboard
  - Crear tablas de una en una si hay foreign keys entre ellas
```

### Comandos frecuentes
```bash
# Dev local
cd frontend && npm start               # Angular en localhost:4200
cd backend && node server.js           # Backend en localhost:3000

# Build + Deploy
cd frontend && npm run build
npx wrangler pages deploy dist/frontend/browser \
  --project-name=recordr --branch=main --commit-dirty=true

# Regenerar datos de jugadores (correr desde /RecordR)
node scripts/generate-players.js
node scripts/generate-soccer-photos.js 25999792cebaba43e105fc133cc96fcc
# ⚠️  API-Football: 100 req/día → 2-3 días para todas las ligas

# Git
git add -A && git commit -m "descripción" && git push
```

### Estructura de archivos clave
```
RecordR/
├── backend/
│   ├── server.js              ← TODO el backend (rutas, middleware, proxies)
│   ├── config/db.js           ← Conexión MySQL con SSL
│   └── sql/
│       ├── schema.sql         ← Tablas originales
│       └── migrations.sql     ← Tablas nuevas (ratings, user_lists, list_items)
├── frontend/src/app/
│   ├── services/
│   │   ├── espn.service.ts         ← Partidos en vivo (ESPN scoreboard)
│   │   ├── espn-players.service.ts ← Jugadores (static JSON + ESPN search)
│   │   ├── auth.service.ts         ← JWT, currentUser$
│   │   ├── opinion.service.ts      ← Opiniones/comentarios
│   │   ├── rating.service.ts       ← Ratings de partidos
│   │   └── lists.service.ts        ← Listas de usuario
│   ├── guards/
│   │   └── auth.guard.ts           ← Protección de rutas
│   ├── interceptors/
│   │   └── auth.interceptor.ts     ← JWT automático en cada request
│   └── environments/
│       ├── environment.ts          ← dev (localhost:3000)
│       └── environment.prod.ts     ← prod (recordr-api.onrender.com)
├── frontend/public/
│   ├── data/players.json      ← 7,865 jugadores pre-generados (3.7MB)
│   └── _redirects             ← SPA routing Cloudflare Pages
└── scripts/
    ├── generate-players.js         ← Genera players.json desde ESPN (~15min)
    └── generate-soccer-photos.js   ← Enriquece fotos vía API-Football + Wikipedia
```

---

*Documento generado el 2026-04-30. Próxima tarea inmediata: completar fotos de Serie A y Liga MX cuando el límite de API-Football se resetee (correr `node scripts/generate-soccer-photos.js 25999792cebaba43e105fc133cc96fcc`).*
