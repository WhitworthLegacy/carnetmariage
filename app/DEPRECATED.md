# ⚠️ DEPRECATED - Legacy Code

Ce dossier contient l'ancienne version prototype de CarnetMariage basée sur **Vite + React**.

## ❌ NE PLUS UTILISER

Cette version est **obsolète** et **ne doit plus être utilisée** pour le développement.

## ✅ Utiliser à la place

Les applications actives se trouvent dans :

- [apps/web](../apps/web/) - Application client (Next.js 15)
- [apps/admin](../apps/admin/) - Dashboard admin (Next.js 15)

## Historique

Ce dossier était un prototype initial créé avec Vite avant la migration vers l'architecture monorepo avec Next.js 15.

## Action recommandée

Ce dossier peut être supprimé en toute sécurité une fois que vous avez confirmé que tout le code utile a été migré vers `apps/web` et `apps/admin`.

Pour supprimer ce dossier legacy :

```bash
rm -rf app/
```

## Migration

Si vous trouvez du code utile ici qui n'a pas encore été migré, veuillez :

1. Le porter vers la nouvelle architecture dans `apps/`
2. Créer une issue pour suivre la migration
3. Mettre à jour cette documentation
