# 📋 Plan d'implémentation - Éléments restants

Ce document détaille les étapes pour implémenter les fonctionnalités manquantes qui nécessitent des décisions ou une configuration plus complexe.

---

## 🎯 Vue d'ensemble

### ✅ Déjà fait

- README complet avec instructions de setup
- Configuration ESLint + Prettier
- Sécurisation du script seed
- LICENSE MIT
- Documentation (CONTRIBUTING.md, SECURITY.md)
- Templates GitHub (issues, PR)
- CI/CD basique (GitHub Actions)
- Supabase config.toml
- Marquage du code legacy
- .gitignore amélioré
- Dependabot configuré

### 🚧 À implémenter (détaillé ci-dessous)

1. Pre-commit hooks (Husky + lint-staged)
2. Configuration Docker
3. Framework de tests
4. Monitoring & Error tracking
5. Configuration de déploiement avancée

---

## 1️⃣ Pre-commit Hooks avec Husky + lint-staged

### Objectif

Empêcher les commits de code mal formaté ou contenant des erreurs de lint.

### Étapes d'implémentation

#### Étape 1.1 : Installer les dépendances

```bash
cd /Volumes/YaqubLegacy/Dev/clients/carnetmariage
pnpm add -D husky lint-staged
```

#### Étape 1.2 : Initialiser Husky

```bash
pnpm exec husky init
```

#### Étape 1.3 : Créer le fichier .lintstagedrc.json

Créer à la racine :

```json
{
  "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,css,md}": ["prettier --write"]
}
```

#### Étape 1.4 : Configurer le pre-commit hook

Éditer `.husky/pre-commit` :

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm exec lint-staged
```

#### Étape 1.5 : Ajouter les scripts dans package.json

```json
{
  "scripts": {
    "prepare": "husky"
  }
}
```

#### Étape 1.6 : Tester

```bash
# Faire un changement et tenter de committer
git add .
git commit -m "test: vérifier pre-commit hook"
# Le hook devrait formater automatiquement et bloquer si erreur
```

### Résultat attendu

- Tout commit doit passer lint + format automatiquement
- Les fichiers mal formatés sont corrigés avant le commit
- Les erreurs de lint bloquent le commit

---

## 2️⃣ Configuration Docker

### Objectif

Permettre de lancer l'environnement complet (apps + Supabase) avec Docker.

### Architecture Docker proposée

```
docker-compose.yml
├── supabase (PostgreSQL + Auth + Storage)
├── web (Next.js app client)
└── admin (Next.js app admin)
```

### Étapes d'implémentation

#### Étape 2.1 : Créer Dockerfile pour les apps Next.js

Créer `apps/web/Dockerfile` :

```dockerfile
FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.28.0 --activate

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/
COPY packages/core/package.json packages/core/
COPY packages/ui/package.json packages/ui/
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build:web

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

USER nextjs
EXPOSE 3002
ENV PORT=3002
CMD ["node", "apps/web/server.js"]
```

Faire de même pour `apps/admin/Dockerfile` (adapter le port 3003).

#### Étape 2.2 : Créer docker-compose.yml

À la racine :

```yaml
version: "3.8"

services:
  # Supabase services (PostgreSQL, Auth, etc.)
  postgres:
    image: supabase/postgres:15.1.0.147
    environment:
      POSTGRES_PASSWORD: your-super-secret-and-long-postgres-password
      POSTGRES_DB: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./supabase/migrations:/docker-entrypoint-initdb.d

  studio:
    image: supabase/studio:latest
    environment:
      SUPABASE_URL: http://kong:8000
      STUDIO_PG_META_URL: http://meta:8080
    ports:
      - "3000:3000"
    depends_on:
      - postgres

  kong:
    image: kong:2.8.1
    environment:
      KONG_DATABASE: "off"
      KONG_DECLARATIVE_CONFIG: /var/lib/kong/kong.yml
    ports:
      - "8000:8000"
    volumes:
      - ./supabase/config/kong.yml:/var/lib/kong/kong.yml

  # App Web
  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    ports:
      - "3002:3002"
    environment:
      NEXT_PUBLIC_SUPABASE_URL: http://localhost:8000
      NEXT_PUBLIC_SUPABASE_ANON_KEY: ${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      SUPABASE_SERVICE_ROLE_KEY: ${SUPABASE_SERVICE_ROLE_KEY}
      NEXT_PUBLIC_APP_URL: http://localhost:3002
      STRIPE_SECRET_KEY: ${STRIPE_SECRET_KEY}
    depends_on:
      - postgres
      - kong

  # App Admin
  admin:
    build:
      context: .
      dockerfile: apps/admin/Dockerfile
    ports:
      - "3003:3003"
    environment:
      NEXT_PUBLIC_SUPABASE_URL: http://localhost:8000
      NEXT_PUBLIC_SUPABASE_ANON_KEY: ${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      NEXT_PUBLIC_ADMIN_URL: http://localhost:3003
    depends_on:
      - postgres
      - kong

volumes:
  postgres_data:
```

#### Étape 2.3 : Ajouter scripts Docker dans package.json

```json
{
  "scripts": {
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down",
    "docker:logs": "docker-compose logs -f",
    "docker:build": "docker-compose build",
    "docker:clean": "docker-compose down -v"
  }
}
```

#### Étape 2.4 : Créer .dockerignore

```
node_modules
.next
dist
.env
.env.local
.git
.github
*.log
coverage
.turbo
```

#### Étape 2.5 : Tester

```bash
# Build et lancer
pnpm docker:build
pnpm docker:up

# Vérifier les logs
pnpm docker:logs

# Accéder aux apps
# Web: http://localhost:3002
# Admin: http://localhost:3003
# Supabase Studio: http://localhost:3000
```

### Résultat attendu

- Environnement complet en 1 commande
- Isolation des services
- Facile à partager avec l'équipe

### Notes importantes

- ⚠️ **Configuration de Supabase** : Pour une config Supabase complète en Docker, considérer utiliser le [Supabase CLI](https://supabase.com/docs/guides/cli/local-development) qui gère tout automatiquement
- ⚠️ **Performance** : Docker sur Mac peut être lent, envisager des volumes pour node_modules

### Alternative recommandée : Supabase CLI

Au lieu de Docker custom pour Supabase :

```bash
# Installer Supabase CLI
brew install supabase/tap/supabase

# Démarrer Supabase localement
supabase start

# Appliquer les migrations
supabase db push

# Arrêter
supabase stop
```

---

## 3️⃣ Framework de tests (Vitest + Testing Library)

### Objectif

Mettre en place une suite de tests complète (unit, intégration, E2E).

### Stack de tests proposée

- **Vitest** : Test runner (rapide, compatible Vite)
- **@testing-library/react** : Tests de composants React
- **@testing-library/jest-dom** : Matchers personnalisés
- **Playwright** : Tests E2E
- **MSW** : Mock des API calls

### Étapes d'implémentation

#### Étape 3.1 : Installer les dépendances

```bash
# Tests unitaires et intégration
pnpm add -D vitest @vitejs/plugin-react jsdom
pnpm add -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
pnpm add -D @vitest/ui @vitest/coverage-v8

# Mock des APIs
pnpm add -D msw

# Tests E2E
pnpm add -D @playwright/test
```

#### Étape 3.2 : Configurer Vitest

Créer `vitest.config.ts` à la racine :

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", ".next/", "dist/", "**/*.config.*", "**/*.d.ts"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
```

#### Étape 3.3 : Créer le fichier de setup

Créer `vitest.setup.ts` :

```typescript
import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Cleanup après chaque test
afterEach(() => {
  cleanup();
});

// Mock de variables d'environnement
process.env.NEXT_PUBLIC_SUPABASE_URL = "http://localhost:54321";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-key";
```

#### Étape 3.4 : Configurer Playwright

```bash
pnpm create playwright
```

Suivre le wizard et créer `playwright.config.ts` :

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3002",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
  webServer: {
    command: "pnpm dev:web",
    url: "http://localhost:3002",
    reuseExistingServer: !process.env.CI,
  },
});
```

#### Étape 3.5 : Ajouter les scripts de test

Dans `package.json` :

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

#### Étape 3.6 : Créer des exemples de tests

**Test unitaire - `packages/core/utils.test.ts`** :

```typescript
import { describe, it, expect } from "vitest";

describe("formatCurrency", () => {
  it("formate correctement un nombre en euros", () => {
    expect(formatCurrency(1234.56)).toBe("1 234,56 €");
  });
});
```

**Test de composant - `packages/ui/Button.test.tsx`** :

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('affiche le texte correct', () => {
    render(<Button>Cliquez-moi</Button>);
    expect(screen.getByText('Cliquez-moi')).toBeInTheDocument();
  });

  it('appelle onClick quand cliqué', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Cliquer</Button>);

    await userEvent.click(screen.getByText('Cliquer'));
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

**Test E2E - `e2e/auth.spec.ts`** :

```typescript
import { test, expect } from "@playwright/test";

test("login flow", async ({ page }) => {
  await page.goto("/connexion");

  await page.fill('input[name="email"]', "demo@carnetmariage.fr");
  await page.fill('input[name="password"]', "Demo2025!");
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL("/dashboard");
  await expect(page.locator("h1")).toContainText("Tableau de bord");
});
```

#### Étape 3.7 : Configurer MSW pour mocker les APIs

Créer `mocks/handlers.ts` :

```typescript
import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/api/weddings", () => {
    return HttpResponse.json([{ id: "1", partner1_name: "Marie", partner2_name: "Thomas" }]);
  }),
];
```

Créer `mocks/server.ts` :

```typescript
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);
```

Mettre à jour `vitest.setup.ts` :

```typescript
import { beforeAll, afterEach, afterAll } from "vitest";
import { server } from "./mocks/server";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

#### Étape 3.8 : Ajouter la couverture de code dans CI

Mettre à jour `.github/workflows/ci.yml` :

```yaml
test:
  name: Test
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: pnpm/action-setup@v4
    - uses: actions/setup-node@v4
    - run: pnpm install --frozen-lockfile
    - run: pnpm test:coverage
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        files: ./coverage/coverage-final.json
```

### Résultat attendu

- Tests unitaires pour la logique métier
- Tests de composants pour l'UI
- Tests E2E pour les flows critiques
- Couverture de code visible
- Tests qui tournent en CI

### Recommandations de couverture

- **Composants UI** : 70%+ (focus sur comportement, pas rendu)
- **Logique métier** : 90%+ (calculs, validations)
- **API routes** : 80%+ (sécurité, edge cases)
- **Tests E2E** : Flows critiques uniquement (auth, paiement, création mariage)

---

## 4️⃣ Monitoring & Error Tracking

### Objectif

Détecter et tracer les erreurs en production.

### Stack recommandée

- **Sentry** : Error tracking
- **Vercel Analytics** : Performance monitoring (si déployé sur Vercel)

### Étapes d'implémentation

#### Étape 4.1 : Configurer Sentry

**Installer Sentry** :

```bash
pnpm add @sentry/nextjs
```

**Initialiser dans chaque app** :

```bash
cd apps/web
pnpm exec sentry-wizard --integration nextjs
```

Cela crée automatiquement :

- `sentry.client.config.ts`
- `sentry.server.config.ts`
- `sentry.edge.config.ts`
- `next.config.js` mis à jour

**Configuration dans `.env`** :

```env
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
SENTRY_ORG=carnetmariage
SENTRY_PROJECT=web
```

**Wrapper l'app pour capturer les erreurs** :
`apps/web/app/layout.tsx` :

```typescript
'use client';
import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function RootLayout({ children }) {
  useEffect(() => {
    // Configure user context si connecté
    const user = getUserFromSession();
    if (user) {
      Sentry.setUser({
        id: user.id,
        email: user.email,
      });
    }
  }, []);

  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

#### Étape 4.2 : Configurer les alertes

Dans Sentry Dashboard :

1. Créer des alertes pour :
   - Erreurs critiques (> 10/min)
   - Nouvelles erreurs
   - Taux d'erreur élevé (> 5%)
2. Configurer les notifications (Email, Slack)

#### Étape 4.3 : Logger les événements métier importants

```typescript
import * as Sentry from "@sentry/nextjs";

// Logger une action critique
Sentry.captureMessage("Wedding created", {
  level: "info",
  tags: { action: "wedding_created" },
  extra: { weddingId, userId },
});

// Capturer une erreur avec contexte
try {
  await createPayment(amount);
} catch (error) {
  Sentry.captureException(error, {
    tags: { feature: "payment" },
    extra: { amount, userId },
  });
  throw error;
}
```

### Résultat attendu

- Visibilité sur toutes les erreurs production
- Alertes en temps réel
- Stack traces détaillées
- Context utilisateur sur chaque erreur

---

## 5️⃣ Configuration de déploiement avancée

### Objectif

Déployer les apps sur Vercel avec plusieurs environnements.

### Architecture proposée

- **Production** : main branch → carnetmariage.com
- **Staging** : develop branch → staging.carnetmariage.com
- **Preview** : PR branches → preview-{pr}.carnetmariage.com

### Étapes d'implémentation

#### Étape 5.1 : Connecter à Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Lier les projets
cd apps/web
vercel link

cd ../admin
vercel link
```

#### Étape 5.2 : Configurer les environnements

**Dans Vercel Dashboard** :

1. Settings → Environment Variables
2. Ajouter pour chaque environnement (Production, Preview, Development) :
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   STRIPE_SECRET_KEY
   STRIPE_WEBHOOK_SECRET
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
   SENTRY_DSN
   ```

#### Étape 5.3 : Créer vercel.json pour chaque app

`apps/web/vercel.json` :

```json
{
  "buildCommand": "pnpm build:web",
  "outputDirectory": ".next",
  "installCommand": "pnpm install --frozen-lockfile",
  "framework": "nextjs",
  "regions": ["cdg1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

#### Étape 5.4 : Configurer les webhooks Stripe

Pour chaque environnement :

1. Aller dans Stripe Dashboard → Webhooks
2. Créer un webhook endpoint :
   - Production : `https://carnetmariage.com/api/webhooks/stripe`
   - Staging : `https://staging.carnetmariage.com/api/webhooks/stripe`
3. Sélectionner les événements :
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copier le webhook secret dans Vercel env vars

#### Étape 5.5 : Créer un workflow de déploiement

`.github/workflows/deploy.yml` :

```yaml
name: Deploy

on:
  push:
    branches: [main, develop]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: "--prod"
```

### Résultat attendu

- Déploiement automatique sur push
- Environnements isolés (prod/staging/preview)
- Variables d'env par environnement
- Webhooks Stripe configurés

---

## 📊 Résumé des priorités

| Tâche                 | Priorité   | Difficulté | Temps estimé |
| --------------------- | ---------- | ---------- | ------------ |
| Pre-commit hooks      | 🔴 Haute   | Facile     | 30min        |
| Tests (setup de base) | 🔴 Haute   | Moyenne    | 2h           |
| Monitoring (Sentry)   | 🟡 Moyenne | Facile     | 1h           |
| Docker (dev)          | 🟡 Moyenne | Moyenne    | 3h           |
| Déploiement Vercel    | 🟢 Basse   | Facile     | 1h           |

---

## 🚀 Ordre d'exécution recommandé

1. **Immédiat** : Pre-commit hooks (évite le code sale)
2. **Cette semaine** : Tests de base + Monitoring
3. **Ce mois** : Docker pour dev + Déploiement staging
4. **Continu** : Écrire des tests pour chaque nouvelle feature

---

## 💡 Conseils

- Commencer petit : 1-2 tests par feature au début
- Ne pas chercher 100% de couverture immédiatement
- Docker n'est pas obligatoire si Supabase CLI suffit
- Monitoring est critique dès la prod
- Automatiser tout ce qui peut l'être

---

## 📞 Questions ?

Si vous avez besoin d'aide sur une section spécifique :

1. Créer une issue GitHub
2. Référencer cette section du plan
3. Poser vos questions précises

Bon courage ! 💪
