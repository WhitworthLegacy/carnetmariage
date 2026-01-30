# 🔧 Configuration des services externes

État des lieux de tous les services tiers utilisés par CarnetMariage.

---

## ✅ Services configurés

### 1. Supabase (Base de données & Auth)
**Status:** ✅ Configuré

**Configuration existante:**
- Client browser: [apps/web/lib/supabase/client.ts](apps/web/lib/supabase/client.ts)
- Client server: [apps/web/lib/supabase/server.ts](apps/web/lib/supabase/server.ts)
- Middleware: [apps/web/lib/supabase/middleware.ts](apps/web/lib/supabase/middleware.ts)
- Migrations: [supabase/migrations/](supabase/migrations/) (9 fichiers)
- Config locale: [supabase/config.toml](supabase/config.toml)

**Variables d'environnement:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
```

**Fonctionnalités:**
- ✅ Authentification (email/password)
- ✅ Base de données PostgreSQL
- ✅ Row Level Security (RLS)
- ✅ Storage (prêt à utiliser)
- ✅ Realtime (configuré mais pas utilisé)

---

### 2. Stripe (Paiements)
**Status:** ✅ Configuré

**Configuration existante:**
- API checkout: [apps/web/app/api/stripe/checkout/route.ts](apps/web/app/api/stripe/checkout/route.ts)
- Package installé: `stripe@17.7.0`

**Variables d'environnement:**
```env
STRIPE_SECRET_KEY=sk_test_xxx...
STRIPE_WEBHOOK_SECRET=whsec_xxx...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx...
```

**Fonctionnalités:**
- ✅ Checkout sessions
- ✅ Webhooks (route configurée)
- ✅ Gestion des abonnements (dans la DB)
- ⚠️ Webhooks à configurer dans Stripe Dashboard

**À faire:**
1. Créer les webhooks dans Stripe Dashboard
2. Configurer les produits/prix dans Stripe
3. Tester le flow de paiement complet

---

## ❌ Services NON configurés

### 3. Resend (Emails transactionnels)
**Status:** ❌ PAS configuré

**Pourquoi c'est important:**
Pour envoyer les emails automatiques :
- Emails de bienvenue
- Confirmations d'inscription
- Notifications (tâches, rappels)
- Invitations par email
- Récupération de mot de passe

**Configuration recommandée:**

#### Étape 1: Installer Resend
```bash
cd /Volumes/YaqubLegacy/Dev/clients/carnetmariage
pnpm add resend
```

#### Étape 2: Ajouter à .env.example
```env
# Resend (Emails)
RESEND_API_KEY=re_xxx...
RESEND_FROM_EMAIL=noreply@carnetmariage.com
```

#### Étape 3: Créer le client Resend
Créer `apps/web/lib/resend.ts` :
```typescript
import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not defined');
}

export const resend = new Resend(process.env.RESEND_API_KEY);
```

#### Étape 4: Créer les templates d'emails
Structure recommandée :
```
apps/web/emails/
├── WelcomeEmail.tsx         # Email de bienvenue
├── InvitationEmail.tsx      # Invitation mariage
├── ReminderEmail.tsx        # Rappel tâche
└── components/
    └── EmailLayout.tsx      # Layout commun
```

Exemple de template React avec Resend:
```tsx
// apps/web/emails/WelcomeEmail.tsx
import { Html, Head, Body, Container, Text, Button } from '@react-email/components';

interface WelcomeEmailProps {
  userName: string;
  weddingDate: string;
}

export default function WelcomeEmail({ userName, weddingDate }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'Arial, sans-serif' }}>
        <Container>
          <Text>Bonjour {userName},</Text>
          <Text>
            Bienvenue sur CarnetMariage ! Nous sommes ravis de vous accompagner dans
            l'organisation de votre mariage prévu le {weddingDate}.
          </Text>
          <Button href="https://carnetmariage.com/dashboard">
            Accéder à mon tableau de bord
          </Button>
        </Container>
      </Body>
    </Html>
  );
}
```

#### Étape 5: Créer une API route pour envoyer les emails
Créer `apps/web/app/api/emails/send/route.ts` :
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { resend } from '@/lib/resend';
import WelcomeEmail from '@/emails/WelcomeEmail';

export async function POST(request: NextRequest) {
  try {
    const { to, type, data } = await request.json();

    let subject: string;
    let template: React.ReactElement;

    switch (type) {
      case 'welcome':
        subject = '🎊 Bienvenue sur CarnetMariage !';
        template = WelcomeEmail(data);
        break;
      // Autres types d'emails...
      default:
        return NextResponse.json({ error: 'Invalid email type' }, { status: 400 });
    }

    const { data: emailData, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to,
      subject,
      react: template,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true, id: emailData.id });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
```

#### Étape 6: Intégrer dans Supabase Auth
Configurer les emails Supabase pour utiliser Resend via SMTP ou webhooks.

**Alternative:** Utiliser Supabase Auth avec templates HTML personnalisés.

#### Coût Resend:
- Gratuit: 100 emails/jour
- Pro: 10$/mois pour 50k emails/mois

---

### 4. Analytics & Monitoring
**Status:** ⚠️ Partiellement configuré

**Ce qui existe:**
- ✅ GitHub Actions (CI/CD)
- ✅ Dependabot (sécurité)
- ❌ Sentry (error tracking) - voir [PLAN_IMPLEMENTATION.md](PLAN_IMPLEMENTATION.md#4)

**Services recommandés:**

#### A. Vercel Analytics (si déployé sur Vercel)
Gratuit, activé automatiquement sur Vercel.

#### B. PostHog (Analytics & Feature Flags)
Alternative open-source à Google Analytics.

```bash
pnpm add posthog-js
```

Configuration:
```typescript
// apps/web/lib/posthog.ts
import posthog from 'posthog-js';

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: 'https://app.posthog.com',
  });
}

export default posthog;
```

#### C. Sentry (Error Tracking)
Voir section 4 de [PLAN_IMPLEMENTATION.md](PLAN_IMPLEMENTATION.md#4-monitoring--error-tracking)

---

### 5. Storage externe (images, documents)
**Status:** ✅ Supabase Storage est configuré

Supabase inclut déjà un système de storage.

**Configuration du bucket:**
1. Aller dans Supabase Dashboard → Storage
2. Créer les buckets :
   - `avatars` (public) - Photos de profil
   - `wedding-photos` (privé) - Photos de mariage
   - `documents` (privé) - Documents (contrats, factures)

**Code exemple:**
```typescript
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

// Upload
const { data, error } = await supabase.storage
  .from('avatars')
  .upload('user-123.jpg', file);

// Get URL
const { data: { publicUrl } } = supabase.storage
  .from('avatars')
  .getPublicUrl('user-123.jpg');
```

---

### 6. Calendrier / Google Calendar
**Status:** ❌ Pas configuré (optionnel)

**Cas d'usage:**
- Synchroniser les tâches avec Google Calendar
- Export de la timeline vers calendrier
- Partage des dates importantes

**Si besoin, voir:**
- Google Calendar API
- Microsoft Graph API (Outlook)

---

## 📊 Résumé des priorités

| Service | Status | Priorité | Action requise |
|---------|--------|----------|----------------|
| Supabase | ✅ OK | - | Configurer les buckets storage |
| Stripe | ✅ OK | - | Créer les webhooks |
| Resend | ❌ Manquant | 🔴 Haute | Configurer pour les emails |
| Sentry | ❌ Manquant | 🟡 Moyenne | Voir PLAN_IMPLEMENTATION.md |
| Analytics | ⚠️ Partiel | 🟡 Moyenne | Activer Vercel Analytics |
| Storage | ✅ OK | - | Créer les buckets |

---

## 🚀 Actions immédiates recommandées

### Cette semaine:
1. **Configurer Resend** (2h)
   - Créer compte sur resend.com
   - Ajouter domaine et vérifier DNS
   - Installer le package
   - Créer les premiers templates

2. **Configurer Stripe Webhooks** (30min)
   - Créer les endpoints dans Stripe Dashboard
   - Tester avec Stripe CLI

### Ce mois:
3. **Configurer Supabase Storage** (1h)
   - Créer les buckets
   - Configurer les RLS policies pour le storage
   - Implémenter l'upload d'avatar

4. **Ajouter Sentry** (1h)
   - Voir [PLAN_IMPLEMENTATION.md](PLAN_IMPLEMENTATION.md#4-monitoring--error-tracking)

---

## 💡 Services optionnels à considérer

### Pour plus tard:
- **Uploadthing** : Alternative à Supabase Storage (plus simple)
- **Cloudinary** : Pour optimisation d'images avancée
- **Algolia** : Recherche full-text performante (invités, lieux, etc.)
- **Twilio** : SMS (rappels par SMS)
- **Google Maps API** : Géolocalisation des lieux
- **Cal.com** : Planification de rendez-vous avec prestataires

---

## 🔐 Checklist de configuration

### Avant le lancement en production:

**Supabase:**
- [ ] Configurer les politiques RLS sur toutes les tables
- [ ] Activer la sauvegarde automatique
- [ ] Configurer les buckets storage
- [ ] Tester l'authentification complète

**Stripe:**
- [ ] Créer les produits (Free, Premium, etc.)
- [ ] Configurer les webhooks pour prod
- [ ] Tester un paiement complet
- [ ] Configurer les emails de facturation

**Resend:**
- [ ] Vérifier le domaine
- [ ] Créer tous les templates d'emails
- [ ] Tester l'envoi d'emails
- [ ] Configurer les emails transactionnels Supabase

**Monitoring:**
- [ ] Activer Sentry
- [ ] Configurer les alertes
- [ ] Tester le reporting d'erreurs

**Sécurité:**
- [ ] Tous les secrets dans les env vars
- [ ] Aucune clé hardcodée
- [ ] HTTPS forcé en production
- [ ] Rate limiting configuré

---

## 📞 Besoin d'aide ?

Pour chaque service, consulter :
- Documentation officielle du service
- Section correspondante dans [PLAN_IMPLEMENTATION.md](PLAN_IMPLEMENTATION.md)
- Créer une issue GitHub si blocage

---

**Dernière mise à jour:** 2025-01-30
