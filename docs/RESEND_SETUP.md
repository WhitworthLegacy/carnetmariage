# 📧 Guide de configuration Resend

Guide pas-à-pas pour configurer Resend et les emails transactionnels.

---

## 🎯 Pourquoi Resend ?

Resend permet d'envoyer des emails transactionnels professionnels :
- ✉️ Emails de bienvenue
- 🔔 Notifications (rappels de tâches)
- 🎉 Invitations aux événements
- 🔐 Récupération de mot de passe
- 📄 Factures et reçus Stripe

---

## 🚀 Installation rapide (30 minutes)

### Étape 1 : Créer un compte Resend

1. Aller sur [resend.com](https://resend.com)
2. S'inscrire gratuitement
3. Vérifier l'email

### Étape 2 : Configurer le domaine

#### Option A : Domaine personnalisé (recommandé)
Pour envoyer depuis `@carnetmariage.com` :

1. Dashboard Resend → **Domains** → **Add Domain**
2. Entrer : `carnetmariage.com`
3. Copier les 3 enregistrements DNS :
   - **SPF** (TXT)
   - **DKIM** (TXT)
   - **DMARC** (TXT)
4. Ajouter ces enregistrements dans votre DNS (Namecheap, Cloudflare, etc.)
5. Attendre la vérification (5-30 minutes)

#### Option B : Sous-domaine Resend (développement)
Utiliser `onboarding@resend.dev` pour tester.

### Étape 3 : Obtenir la clé API

1. Dashboard Resend → **API Keys** → **Create API Key**
2. Nom : `CarnetMariage Production`
3. Permissions : `Full Access` ou `Sending access`
4. Copier la clé (commence par `re_...`)

### Étape 4 : Configurer les variables d'environnement

Dans votre fichier `.env` :
```env
RESEND_API_KEY=re_123456789...
RESEND_FROM_EMAIL=noreply@carnetmariage.com
```

### Étape 5 : Installer le package

```bash
cd /Volumes/YaqubLegacy/Dev/clients/carnetmariage
pnpm add resend react-email @react-email/components
```

### Étape 6 : Créer le client Resend

Créer `apps/web/lib/resend.ts` :
```typescript
import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  console.warn('⚠️  RESEND_API_KEY is not set - emails will not be sent');
}

export const resend = new Resend(process.env.RESEND_API_KEY);
```

### Étape 7 : Créer votre premier template d'email

Structure des dossiers :
```bash
mkdir -p apps/web/emails/components
```

Créer `apps/web/emails/WelcomeEmail.tsx` :
```tsx
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Button,
  Hr,
} from '@react-email/components';

interface WelcomeEmailProps {
  userName: string;
  weddingDate: string;
}

export default function WelcomeEmail({ userName, weddingDate }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Bienvenue sur CarnetMariage - Organisez votre mariage facilement</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Heading style={h1}>💍 Bienvenue sur CarnetMariage !</Heading>

            <Text style={text}>
              Bonjour <strong>{userName}</strong>,
            </Text>

            <Text style={text}>
              Félicitations pour votre mariage ! Nous sommes ravis de vous accompagner dans
              l'organisation de votre grand jour prévu le <strong>{weddingDate}</strong>.
            </Text>

            <Text style={text}>
              Avec CarnetMariage, vous pouvez :
            </Text>

            <ul>
              <li>📊 Gérer votre budget en temps réel</li>
              <li>👥 Organiser votre liste d'invités</li>
              <li>✅ Suivre vos tâches et deadlines</li>
              <li>🎪 Trouver et comparer des prestataires</li>
              <li>🗓️ Planifier votre timeline de mariage</li>
            </ul>

            <Button style={button} href="https://carnetmariage.com/dashboard">
              Accéder à mon tableau de bord
            </Button>

            <Hr style={hr} />

            <Text style={footer}>
              Besoin d'aide ? Répondez à cet email, nous sommes là pour vous aider !
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const box = {
  padding: '0 48px',
};

const h1 = {
  color: '#1d1d1f',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
};

const text = {
  color: '#484848',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
};

const button = {
  backgroundColor: '#ec4899',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
  padding: '12px',
  margin: '24px 0',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
};
```

### Étape 8 : Créer une API route pour envoyer

Créer `apps/web/app/api/emails/welcome/route.ts` :
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { resend } from '@/lib/resend';
import WelcomeEmail from '@/emails/WelcomeEmail';

export async function POST(request: NextRequest) {
  try {
    const { email, userName, weddingDate } = await request.json();

    if (!process.env.RESEND_API_KEY) {
      console.log('📧 [DEV] Email would be sent to:', email);
      return NextResponse.json({
        success: true,
        message: 'Email not sent (RESEND_API_KEY not configured)'
      });
    }

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: email,
      subject: '🎊 Bienvenue sur CarnetMariage !',
      react: WelcomeEmail({ userName, weddingDate }),
    });

    if (error) {
      console.error('❌ Failed to send email:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log('✅ Email sent successfully:', data.id);
    return NextResponse.json({ success: true, id: data.id });
  } catch (error) {
    console.error('❌ Error:', error);
    return NextResponse.json({
      error: 'Failed to send email'
    }, { status: 500 });
  }
}
```

### Étape 9 : Tester l'envoi

Dans votre code d'inscription (par exemple dans `onboarding/route.ts`) :
```typescript
// Après avoir créé le mariage
try {
  await fetch('/api/emails/welcome', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: user.email,
      userName: profile.full_name,
      weddingDate: wedding.wedding_date,
    }),
  });
} catch (error) {
  console.error('Failed to send welcome email:', error);
  // Ne pas bloquer si l'email échoue
}
```

### Étape 10 : Prévisualiser les emails en dev

Installer le serveur de preview :
```bash
pnpm add -D @react-email/cli
```

Ajouter dans `package.json` :
```json
{
  "scripts": {
    "email:dev": "email dev"
  }
}
```

Lancer le serveur de preview :
```bash
cd apps/web
pnpm email:dev
```

Ouvrir http://localhost:3000 pour voir vos templates.

---

## 📧 Templates d'emails recommandés

### 1. WelcomeEmail ✅ (créé ci-dessus)
Envoyé après l'inscription.

### 2. TaskReminderEmail
Rappel de tâche à échéance.

Créer `apps/web/emails/TaskReminderEmail.tsx` :
```tsx
export default function TaskReminderEmail({
  userName,
  taskTitle,
  dueDate
}: TaskReminderEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Rappel : {taskTitle} - À faire avant le {dueDate}</Preview>
      <Body>
        <Container>
          <Heading>⏰ Rappel de tâche</Heading>
          <Text>Bonjour {userName},</Text>
          <Text>
            N'oubliez pas de compléter la tâche <strong>{taskTitle}</strong>
            avant le <strong>{dueDate}</strong>.
          </Text>
          <Button href="https://carnetmariage.com/dashboard/taches">
            Voir mes tâches
          </Button>
        </Container>
      </Body>
    </Html>
  );
}
```

### 3. GuestInvitationEmail
Invitation envoyée aux invités.

### 4. VendorContactEmail
Email de contact à un prestataire.

### 5. PaymentReceiptEmail
Reçu de paiement Stripe.

---

## 🎨 Bonnes pratiques

### Design
- ✅ Utiliser des styles inline (compatibilité email)
- ✅ Limiter la largeur à 600px
- ✅ Tester sur différents clients email (Gmail, Outlook, Apple Mail)
- ✅ Avoir un CTA clair (Call To Action)
- ✅ Inclure un preview text

### Contenu
- ✅ Personnaliser avec le nom de l'utilisateur
- ✅ Être concis et clair
- ✅ Inclure un lien "Se désabonner" pour les emails marketing
- ✅ Ajouter des informations de contact

### Technique
- ✅ Gérer les erreurs d'envoi gracieusement
- ✅ Logger les envois pour debug
- ✅ Ne jamais bloquer l'UX si l'email échoue
- ✅ Utiliser des queues pour les envois en masse (BullMQ, etc.)

---

## 🧪 Tests

### Test manuel
```bash
curl -X POST http://localhost:3002/api/emails/welcome \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "userName": "Marie & Thomas",
    "weddingDate": "12 septembre 2026"
  }'
```

### Test avec Jest/Vitest
```typescript
import { resend } from '@/lib/resend';

vi.mock('@/lib/resend', () => ({
  resend: {
    emails: {
      send: vi.fn().mockResolvedValue({ data: { id: 'test-id' } }),
    },
  },
}));

it('should send welcome email', async () => {
  const response = await fetch('/api/emails/welcome', {
    method: 'POST',
    body: JSON.stringify({
      email: 'test@example.com',
      userName: 'Test User',
      weddingDate: '2026-09-12',
    }),
  });

  expect(response.ok).toBe(true);
  expect(resend.emails.send).toHaveBeenCalled();
});
```

---

## 📊 Monitoring

### Dashboard Resend
- Voir tous les emails envoyés
- Taux de délivrabilité
- Taux d'ouverture
- Erreurs et bounces

### Logs dans votre app
```typescript
console.log('📧 Sending email:', {
  to: email,
  template: 'WelcomeEmail',
  timestamp: new Date().toISOString(),
});
```

---

## 💰 Tarification Resend

- **Gratuit** : 100 emails/jour (3000/mois)
- **Pro** : 10$/mois → 50 000 emails/mois
- **Enterprise** : Sur devis

Pour un SaaS en lancement, le plan gratuit suffit largement.

---

## 🔗 Ressources

- [Documentation Resend](https://resend.com/docs)
- [React Email Components](https://react.email/docs/components/html)
- [Exemples de templates](https://react.email/examples)
- [Best practices emails](https://www.goodemailcode.com/)

---

## ❓ Troubleshooting

### L'email n'arrive pas
1. Vérifier les logs Resend Dashboard
2. Vérifier le spam
3. Vérifier la configuration DNS du domaine
4. Essayer avec un email de test différent

### Erreur "Domain not verified"
Attendre que la vérification DNS soit complète (jusqu'à 48h).

### Emails en spam
- Configurer SPF, DKIM et DMARC correctement
- Éviter les mots spam ("gratuit", "gagnez", etc.)
- Avoir un ratio texte/images équilibré

---

**Prêt à envoyer vos premiers emails !** 🚀
