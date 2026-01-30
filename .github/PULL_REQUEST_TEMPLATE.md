# Description

Décrivez clairement les changements apportés et leur raison d'être.

Fixes # (numéro de l'issue)

## Type de changement

- [ ] Bug fix (changement non-breaking qui corrige un problème)
- [ ] Nouvelle fonctionnalité (changement non-breaking qui ajoute une fonctionnalité)
- [ ] Breaking change (correction ou fonctionnalité qui causerait un dysfonctionnement des fonctionnalités existantes)
- [ ] Documentation uniquement
- [ ] Refactoring (pas de changement fonctionnel)
- [ ] Performance
- [ ] Test

## Changements effectués

-
-
-

## Screenshots / Vidéos

Si applicable, ajoutez des screenshots ou vidéos pour illustrer les changements visuels.

## Checklist

### Code quality

- [ ] Mon code suit les conventions de style du projet
- [ ] J'ai effectué une auto-review de mon code
- [ ] J'ai commenté mon code dans les parties difficiles à comprendre
- [ ] Mes changements ne génèrent pas de nouveaux warnings
- [ ] J'ai formaté mon code avec Prettier (`pnpm format`)
- [ ] Mon code passe le linting (`pnpm lint`)

### Tests

- [ ] J'ai ajouté des tests qui prouvent que ma correction fonctionne ou que ma fonctionnalité marche
- [ ] Les tests unitaires nouveaux et existants passent localement
- [ ] Tous les tests passent (`pnpm test`)

### Documentation

- [ ] J'ai mis à jour la documentation si nécessaire
- [ ] J'ai mis à jour le CHANGELOG.md
- [ ] J'ai ajouté/mis à jour les commentaires JSDoc si nécessaire

### Database (si applicable)

- [ ] J'ai créé une migration Supabase
- [ ] J'ai testé la migration localement
- [ ] J'ai mis à jour les types TypeScript

### Security

- [ ] Je n'ai pas commit de secrets ou credentials
- [ ] J'ai vérifié les vulnérabilités de sécurité potentielles
- [ ] J'ai testé les permissions (RLS) si applicable

## Comment tester ?

Expliquez comment les reviewers peuvent tester vos changements :

1.
2.
3.

## Impact

- [ ] Cette PR affecte la base de données
- [ ] Cette PR nécessite des variables d'environnement
- [ ] Cette PR change l'API
- [ ] Cette PR affecte les performances

## Dépendances

## Cette PR dépend de :

## Notes pour les reviewers

Ajoutez ici toute information qui pourrait aider les reviewers.

## Checklist finale

- [ ] J'ai testé mes changements en local
- [ ] Ma branche est à jour avec `main`
- [ ] Il n'y a pas de conflits
- [ ] Le build passe (`pnpm build`)
