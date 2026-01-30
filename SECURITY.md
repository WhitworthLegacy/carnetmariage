# Security Policy

## Reporting a Vulnerability

Si vous découvrez une vulnérabilité de sécurité dans CarnetMariage, merci de nous la signaler de manière responsable.

### Comment signaler

**NE PAS** créer une issue publique pour les vulnérabilités de sécurité.

À la place :

1. Envoyez un email à : **security@carnetmariage.com**
2. Incluez une description détaillée de la vulnérabilité
3. Fournissez les étapes pour reproduire le problème
4. Si possible, suggérez un correctif

### Ce qui se passe ensuite

- Nous accuserons réception de votre rapport sous **48 heures**
- Nous vous tiendrons informé de l'avancement de la correction
- Nous vous créditerons (si vous le souhaitez) dans le changelog une fois le correctif déployé

## Versions supportées

| Version | Supportée |
| ------- | --------- |
| 1.x     | ✅ Oui    |
| < 1.0   | ❌ Non    |

## Bonnes pratiques de sécurité

### Pour les développeurs

- **Ne jamais committer** de secrets (clés API, tokens, mots de passe)
- Toujours utiliser des variables d'environnement pour les credentials
- Maintenir les dépendances à jour
- Suivre les principes du moindre privilège
- Valider toutes les entrées utilisateur
- Utiliser HTTPS en production

### Pour les utilisateurs

- Utiliser des mots de passe forts et uniques
- Activer l'authentification à deux facteurs (2FA) si disponible
- Ne jamais partager vos identifiants
- Signaler tout comportement suspect

## Sécurité de l'infrastructure

### Base de données (Supabase)

- Row Level Security (RLS) activé sur toutes les tables
- Politiques RLS strictes par utilisateur/mariage
- Backups automatiques quotidiens
- Chiffrement au repos et en transit

### Authentification

- Gestion via Supabase Auth
- Tokens JWT sécurisés
- Sessions avec expiration
- Protection CSRF

### API

- Rate limiting activé
- Validation des entrées via Zod
- Sanitization des données
- Headers de sécurité configurés

### Paiements

- Intégration Stripe sécurisée
- Pas de stockage de données bancaires
- Webhooks vérifiés avec signature
- Conformité PCI DSS via Stripe

## Dépendances

Nous utilisons :

- Dependabot pour détecter les vulnérabilités
- Audits réguliers des dépendances npm
- Mises à jour de sécurité prioritaires

```bash
# Vérifier les vulnérabilités
pnpm audit

# Corriger les vulnérabilités automatiquement (si possible)
pnpm audit --fix
```

## Checklist de sécurité

### Avant le déploiement

- [ ] Tous les secrets sont dans les variables d'environnement
- [ ] Les dépendances sont à jour et sans vulnérabilités connues
- [ ] Les tests de sécurité passent
- [ ] Les headers de sécurité sont configurés
- [ ] RLS est activé et testé
- [ ] Rate limiting est configuré
- [ ] HTTPS est forcé en production

### Maintenance continue

- [ ] Revue de code pour les changements sensibles
- [ ] Audit des logs régulier
- [ ] Monitoring des erreurs et comportements anormaux
- [ ] Tests de pénétration périodiques
- [ ] Formation des développeurs aux bonnes pratiques

## Ressources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [Stripe Security](https://stripe.com/docs/security)

## Contact

Pour toute question de sécurité : **security@carnetmariage.com**

Merci de nous aider à garder CarnetMariage sécurisé ! 🔒
