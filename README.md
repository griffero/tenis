# 🎾 Tenis Championship

App de campeonato de tenis con animaciones ricas, login por email (magic link via
**Resend**), y deploy listo para **Render**.

Reglas del torneo:

- Cada jugador programa **4 partidos por mes** (cupo que se renueva el día 1).
- Cada partido se agenda contra otro jugador, día y hora, y opcionalmente cancha.
- Los resultados se cargan set por set y alimentan un ranking global.
- Ranking: 3 puntos por victoria. Desempate por diferencia de sets.

## Stack

- **Next.js 14** (App Router, Server Actions) + **TypeScript**
- **Tailwind CSS** con theme custom (cancha, pelota)
- **Framer Motion** para animaciones (hero, scroll, transiciones, ranking)
- **Prisma** + **Postgres**
- **NextAuth v5 (Auth.js)** con provider **Resend** (magic link)

## Correr localmente

```bash
cp .env.example .env          # completa RESEND_API_KEY y AUTH_SECRET
npm install
npx prisma migrate dev --name init
npm run dev
```

Abre http://localhost:3000 e ingresa con tu mail.

En desarrollo, si no configuraste `RESEND_API_KEY`, el enlace mágico se imprime
en la consola del server.

### Variables

| Variable          | Descripción                                                                 |
| ----------------- | --------------------------------------------------------------------------- |
| `DATABASE_URL`    | String de conexión a Postgres (Render lo inyecta automáticamente).          |
| `AUTH_SECRET`     | Secret para firmar tokens (`openssl rand -base64 32`).                      |
| `AUTH_URL`        | URL pública del sitio (ej. `https://tenis-web.onrender.com`).               |
| `AUTH_TRUST_HOST` | `true` detrás del proxy de Render (ya configurado en `render.yaml`).        |
| `RESEND_API_KEY`  | API key de Resend (https://resend.com).                                     |
| `EMAIL_FROM`      | Remitente verificado en Resend, ej. `Tenis <no-reply@tudominio.com>`.       |

## Deploy a Render

El archivo `render.yaml` es un Blueprint listo para apretar **"New +" → "Blueprint"**
en Render y apuntar al repo. Crea:

- Un **Web Service** (`tenis-web`, plan **Starter** — always-on, USD 7/mes).
- Un **Postgres** (`tenis-db`, plan **Starter** — persistente, USD 7/mes).

### ¿Por qué Starter y no Free?

- El **Postgres Free** de Render **expira a los 90 días**. Starter es el primer plan
  persistente: 256 MB RAM, 1 GB de disco — sobra para un torneo con decenas de
  jugadores y unos miles de partidos.
- El **web Free** hiberna después de 15 min sin tráfico. Eso **rompe magic-links**
  (el usuario abre el link y se encuentra con un arranque en frío de 30 s, y el
  token puede haber expirado). Starter mantiene la instancia despierta.

Total: ~USD 13/mes. Si el torneo crece, sube el web a Standard.

### Pasos

1. Crea una cuenta en https://render.com y conecta tu repo de GitHub.
2. Click en **New → Blueprint** y elige este repo.
3. Render detectará `render.yaml` y creará los dos servicios.
4. Al completar el deploy, configura las variables `sync: false`:
   - `AUTH_URL` → la URL pública que te dio Render (ej. `https://tenis-web.onrender.com`).
   - `RESEND_API_KEY` → tu key de https://resend.com/api-keys.
   - `EMAIL_FROM` → remitente verificado, ej. `Tenis <no-reply@tudominio.com>`.
5. Redeploy. El build corre `prisma migrate deploy` automáticamente.

### Primer login

- Ingresa tu mail en `/login`, te llega el link de Resend.
- El primer usuario se crea automáticamente (no hay flujo de registro aparte).
- Cada jugador que ingrese queda disponible como rival en el selector de partidos.

## Estructura

```
src/
├── app/
│   ├── page.tsx                          # Landing animada
│   ├── login/                            # Magic-link login + verify
│   ├── dashboard/
│   │   ├── page.tsx                      # Home: cupo mensual, próximos, ranking
│   │   ├── matches/                      # Lista, crear, detalle + resultado
│   │   └── leaderboard/                  # Ranking animado
│   └── api/auth/[...nextauth]/route.ts
├── components/                           # Ball, Court, Landing, NavLinks…
├── lib/
│   ├── auth.ts                           # NextAuth + Resend provider
│   ├── email.tsx                         # Template HTML del magic link
│   ├── matches.ts                        # Server Actions (crear/cargar/cancelar)
│   ├── prisma.ts
│   └── utils.ts
└── middleware.ts                         # Protege /dashboard
```

## Scripts

```bash
npm run dev         # dev server
npm run build       # genera client + migra + build de Next
npm start           # produce server
npm run db:push     # push schema sin migración (dev)
npm run db:studio   # Prisma Studio
```

Disfruta el torneo 🎾
