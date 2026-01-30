# Contributing to CarnetMariage

Merci de votre intérêt pour contribuer à CarnetMariage ! 🎉

## Comment contribuer

### Signaler un bug

1. Vérifiez que le bug n'a pas déjà été signalé dans les [issues](../../issues)
2. Créez une nouvelle issue en utilisant le template "Bug Report"
3. Fournissez un maximum de détails :
   - Étapes pour reproduire le bug
   - Comportement attendu vs comportement actuel
   - Screenshots si applicable
   - Environnement (navigateur, OS, version)

### Proposer une nouvelle fonctionnalité

1. Vérifiez que la fonctionnalité n'existe pas déjà ou n'est pas en cours de développement
2. Créez une issue "Feature Request"
3. Décrivez clairement :
   - Le besoin ou le problème à résoudre
   - La solution proposée
   - Des alternatives envisagées

### Soumettre une Pull Request

1. **Fork** le repository
2. **Créer une branche** depuis `main` :

   ```bash
   git checkout -b feature/ma-fonctionnalite
   # ou
   git checkout -b fix/mon-bug
   ```

3. **Faire vos modifications** en suivant les conventions du projet

4. **Committer** vos changements avec des messages clairs :

   ```bash
   git commit -m "feat: ajouter la fonctionnalité X"
   # ou
   git commit -m "fix: corriger le bug Y"
   ```

5. **Pousser** votre branche :

   ```bash
   git push origin feature/ma-fonctionnalite
   ```

6. **Ouvrir une Pull Request** vers `main`

## Standards de code

### TypeScript

- Utiliser TypeScript pour tout nouveau code
- Typer explicitement les fonctions et variables
- Éviter `any` autant que possible

### Style de code

- Utiliser Prettier pour le formatage (configuré dans le projet)
- Suivre les règles ESLint
- Avant de committer :
  ```bash
  pnpm format        # Formatter le code
  pnpm lint          # Vérifier les erreurs
  ```

### Conventions de nommage

- **Variables/Fonctions** : `camelCase`
- **Composants React** : `PascalCase`
- **Fichiers de composants** : `PascalCase.tsx`
- **Fichiers utilitaires** : `kebab-case.ts`
- **Constantes** : `UPPER_SNAKE_CASE`

### Structure des commits

Nous suivons [Conventional Commits](https://www.conventionalcommits.org/) :

- `feat:` Nouvelle fonctionnalité
- `fix:` Correction de bug
- `docs:` Documentation uniquement
- `style:` Formatage, points-virgules manquants, etc.
- `refactor:` Refactoring de code
- `test:` Ajout ou modification de tests
- `chore:` Maintenance, dépendances, etc.

Exemples :

```
feat: ajouter filtrage des invités par groupe
fix: corriger le calcul du budget total
docs: mettre à jour le README avec les instructions Docker
```

## Tests

- Écrire des tests pour toute nouvelle fonctionnalité
- S'assurer que tous les tests passent avant de soumettre une PR
- Viser une couverture de code raisonnable

```bash
pnpm test              # Lancer les tests
pnpm test:coverage     # Avec couverture
```

## Processus de review

1. Au moins une review est requise avant le merge
2. Les CI checks doivent passer (build, tests, lint)
3. Les conflits doivent être résolus
4. Le code doit suivre les conventions du projet

## Questions ?

N'hésitez pas à :

- Ouvrir une issue pour toute question
- Rejoindre les discussions existantes
- Contacter les mainteneurs

## Code of Conduct

Ce projet adhère à un code de conduite. En participant, vous vous engagez à respecter ses termes :

- Être respectueux et inclusif
- Accepter les critiques constructives
- Se concentrer sur ce qui est meilleur pour la communauté
- Faire preuve d'empathie envers les autres membres

Merci de contribuer à CarnetMariage ! 💍
