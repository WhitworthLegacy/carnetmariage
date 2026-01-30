# 💍 CarnetMariage

Plateforme SaaS complète de planification de mariage permettant aux couples de gérer tous les aspects de leur grand jour.

## 🎯 Fonctionnalités

- **Gestion du budget** - Suivi des dépenses et catégories
- **Liste d'invités** - Gestion des invités, confirmations et régimes alimentaires
- **Plan de table** - Organisation visuelle des tables
- **Tâches** - Liste de tâches avec échéances et priorités
- **Fournisseurs** - Gestion des prestataires (photographe, traiteur, etc.)
- **Lieux** - Recherche et comparaison de salles
- **Timeline** - Planification détaillée de la journée
- **Abonnements** - Système de paiement via Stripe

## 🏗️ Architecture

### Monorepo Structure

```
carnetmariage/
├── apps/
│   ├── web/          # Application client (Next.js 15, port 3002)
│   └── admin/        # Dashboard admin (Next.js 15, port 3003)
├── packages/
│   ├── core/         # Logique métier, schémas Zod, types
│   └── ui/           # Composants UI partagés
├── supabase/
│   └── migrations/   # Migrations SQL
└── scripts/
    └── seed.mjs      # Script de seed avec données de démo
```

### Stack Technique

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage + RLS)
- **Validation**: Zod
- **Paiements**: Stripe
- **Package Manager**: pnpm (workspaces)

## 🚀 Installation

### Prérequis

- Node.js 18+
- pnpm 10+
- Compte Supabase
- Compte Stripe (pour les paiements)

### Setup Local

1. **Cloner le repository**

   ```bash
   git clone <url-du-repo>
   cd carnetmariage
   ```

2. **Installer les dépendances**

   ```bash
   pnpm install
   ```

3. **Configuration des variables d'environnement**

   Créer un fichier `.env` à la racine du projet :

   ```bash
   cp .env.example .env
   ```

   Remplir les valeurs :

   ```env
   # Supabase (depuis https://app.supabase.com)
   NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key
   SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key

   # App URLs
   NEXT_PUBLIC_APP_URL=http://localhost:3002
   NEXT_PUBLIC_ADMIN_URL=http://localhost:3003

   # Stripe (depuis https://dashboard.stripe.com)
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

   # Timezone
   TZ=Europe/Paris
   ```

4. **Setup Supabase**

   a. Créer un nouveau projet sur [Supabase](https://app.supabase.com)

   b. Appliquer les migrations :

   ```bash
   # Option 1: Via Supabase CLI (recommandé)
   npx supabase db push

   # Option 2: Manuellement via le Dashboard Supabase
   # Copier/coller chaque fichier .sql depuis supabase/migrations/
   ```

   c. (Optionnel) Seed la base de données avec des données de démo :

   ```bash
   node scripts/seed.mjs
   ```

5. **Setup Stripe Webhooks** (pour tester les paiements localement)

   ```bash
   # Installer Stripe CLI
   brew install stripe/stripe-cli/stripe

   # Login
   stripe login

   # Forward webhooks
   stripe listen --forward-to localhost:3002/api/webhooks/stripe
   ```

## 💻 Développement

### Démarrer les applications

```bash
# Démarrer les deux apps en parallèle
pnpm dev

# Ou individuellement :
pnpm dev:web      # App client sur http://localhost:3002
pnpm dev:admin    # App admin sur http://localhost:3003
```

### Build

```bash
# Build toutes les apps
pnpm build

# Ou individuellement :
pnpm build:web
pnpm build:admin
```

### Linting

```bash
pnpm lint
```

## 📦 Packages

### `@carnetmariage/core`

Package partagé contenant :

- Schémas de validation Zod
- Types TypeScript
- Constantes métier
- Utilitaires

### `@carnetmariage/ui`

Bibliothèque de composants UI réutilisables :

- Button, Card, Input, Modal, Select
- Badge, Toast, Tabs, Avatar, Skeleton

## 🗄️ Base de données

### Migrations

Les migrations se trouvent dans [supabase/migrations/](supabase/migrations/) et couvrent :

- Profiles utilisateurs
- Mariages (weddings)
- Tâches et timeline
- Budget et catégories
- Invités et tables
- Fournisseurs et lieux
- Abonnements Stripe
- Row Level Security (RLS) policies

### Modèle de données simplifié

```
profiles (utilisateurs)
  ↓
weddings (mariages)
  ├── tasks (tâches)
  ├── budget_categories → budget_items
  ├── guests → tables
  ├── vendors
  ├── venues
  └── subscriptions (Stripe)
```

## 🔐 Authentification & Sécurité

- Authentification gérée par Supabase Auth
- Row Level Security (RLS) activé sur toutes les tables
- Politiques RLS par utilisateur/mariage
- Secrets stockés dans variables d'environnement
- Validation des données via Zod

## 🌐 Déploiement

### Vercel (Recommandé)

1. Connecter le repo à Vercel
2. Configurer 2 projets :
   - `carnetmariage-web` (root: `apps/web`)
   - `carnetmariage-admin` (root: `apps/admin`)
3. Ajouter les variables d'environnement
4. Configurer les webhooks Stripe pour l'URL de production

### Variables d'environnement en production

Assurer que toutes les variables du fichier `.env.example` sont configurées avec les valeurs de production.

## 📝 Scripts disponibles

| Commande           | Description                     |
| ------------------ | ------------------------------- |
| `pnpm dev`         | Lance les deux apps en mode dev |
| `pnpm dev:web`     | Lance uniquement l'app client   |
| `pnpm dev:admin`   | Lance uniquement l'app admin    |
| `pnpm build`       | Build toutes les apps           |
| `pnpm build:web`   | Build l'app client              |
| `pnpm build:admin` | Build l'app admin               |
| `pnpm lint`        | Lint toutes les apps            |

## 🤝 Contribution

Les contributions sont les bienvenues ! Voir [CONTRIBUTING.md](CONTRIBUTING.md) pour plus de détails.

## 📄 License

Voir [LICENSE](LICENSE)

## 🆘 Support

Pour toute question ou problème :

- Ouvrir une issue sur GitHub
- Contacter l'équipe de développement

## 🗺️ Roadmap

- [ ] Tests (unit, intégration, E2E)
- [ ] CI/CD automatisé
- [ ] Monitoring et error tracking
- [ ] Support multilingue (i18n)
- [ ] Application mobile (React Native)
- [ ] Intégrations tierces (Google Calendar, etc.)

---

Fait avec ❤️ pour les futurs mariés
