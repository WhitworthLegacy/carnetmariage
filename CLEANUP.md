# 🧹 Guide de nettoyage du projet

Actions recommandées pour nettoyer le projet et libérer de l'espace.

---

## 🚨 PRIORITÉ HAUTE - Gagner 15GB d'espace

### 1. Supprimer le dossier `/app` legacy

**Taille:** 15 GB 🔥
**Raison:** Code Vite obsolète, remplacé par apps/web et apps/admin

```bash
cd /Volumes/YaqubLegacy/Dev/clients/carnetmariage

# Sauvegarder d'abord (au cas où)
tar -czf app-backup-$(date +%Y%m%d).tar.gz app/

# Supprimer le dossier
rm -rf app/
```

**Impact:** Libère 15GB, accélère git, simplifie le projet

---

## 🧹 Nettoyage des fichiers macOS

### 2. Supprimer les fichiers `._*` (macOS metadata)

```bash
# Trouver tous les fichiers ._*
find . -name "._*" -type f ! -path "*/node_modules/*"

# Les supprimer
find . -name "._*" -type f ! -path "*/node_modules/*" -delete

# Empêcher leur création future
echo ".DS_Store
._*" >> .gitignore
```

**Note:** `.DS_Store` et `._*` sont déjà dans le .gitignore mais les anciens fichiers restent dans git.

Pour les retirer de git :
```bash
git rm -r --cached . -f
find . -name "._*" -type f -delete
find . -name ".DS_Store" -type f -delete
git add .
git commit -m "chore: remove macOS metadata files"
```

---

## ⚠️ Corriger le .gitignore

### 3. Ne PAS ignorer pnpm-lock.yaml

**Problème:** Ligne 3 du .gitignore ignore `pnpm-lock.yaml`
**Solution:** Le lock file DOIT être versionné pour garantir des builds reproductibles

```bash
# Éditer .gitignore et RETIRER cette ligne :
# pnpm-lock.yaml

# Puis ajouter le lock file à git
git add pnpm-lock.yaml
git commit -m "fix: track pnpm-lock.yaml for reproducible builds"
```

---

## 🔧 Nettoyer les configurations inutiles

### 4. Retirer la référence Turbo du .gitignore

**Raison:** Pas de Turbo installé dans le projet

```bash
# Éditer .gitignore et retirer :
# # Turbo
# .turbo/
```

---

## 📦 Nettoyer node_modules et caches

### 5. Nettoyer les dépendances

```bash
# Supprimer tous les node_modules
rm -rf node_modules apps/*/node_modules packages/*/node_modules

# Nettoyer le cache pnpm
pnpm store prune

# Réinstaller proprement
pnpm install
```

---

## 🎯 Script de nettoyage complet

Créer `scripts/cleanup.sh` :

```bash
#!/bin/bash
set -e

echo "🧹 Nettoyage du projet CarnetMariage..."

# 1. Supprimer /app legacy
if [ -d "app" ]; then
  echo "📦 Sauvegarde de /app..."
  tar -czf "app-backup-$(date +%Y%m%d).tar.gz" app/
  echo "🗑️  Suppression de /app (15GB)..."
  rm -rf app/
  echo "✅ /app supprimé"
fi

# 2. Supprimer fichiers macOS
echo "🍎 Suppression des fichiers macOS..."
find . -name "._*" -type f ! -path "*/node_modules/*" -delete
find . -name ".DS_Store" -type f ! -path "*/node_modules/*" -delete
echo "✅ Fichiers macOS supprimés"

# 3. Nettoyer node_modules
echo "📦 Nettoyage des node_modules..."
rm -rf node_modules apps/*/node_modules packages/*/node_modules
pnpm store prune
echo "✅ node_modules nettoyés"

# 4. Nettoyer .next
echo "⚡ Nettoyage des builds..."
rm -rf apps/*/.next
echo "✅ Builds nettoyés"

# 5. Réinstaller
echo "📥 Réinstallation des dépendances..."
pnpm install
echo "✅ Dépendances réinstallées"

echo ""
echo "🎉 Nettoyage terminé !"
echo "💾 Espace libéré : ~15GB"
echo ""
echo "⚠️  N'oubliez pas de :"
echo "1. Éditer .gitignore (retirer pnpm-lock.yaml et .turbo/)"
echo "2. Committer les changements"
```

Rendre exécutable et lancer :
```bash
chmod +x scripts/cleanup.sh
./scripts/cleanup.sh
```

---

## 📊 Gain d'espace estimé

| Action | Espace libéré |
|--------|---------------|
| Supprimer `/app` | ~15 GB |
| Nettoyer node_modules | ~2-3 GB |
| Supprimer fichiers `._*` | ~10 MB |
| Nettoyer `.next` | ~500 MB |
| **TOTAL** | **~17-18 GB** |

---

## ✅ Checklist après nettoyage

- [ ] `/app` supprimé
- [ ] Fichiers `._*` supprimés
- [ ] `.gitignore` corrigé (garde pnpm-lock.yaml, retire .turbo/)
- [ ] `pnpm-lock.yaml` versionné dans git
- [ ] Commit créé avec les changements
- [ ] Push vers GitHub
- [ ] Vérifier que le build fonctionne : `pnpm build`

---

## 🚨 Avant de supprimer /app

**Vérifier qu'il n'y a rien d'unique dedans :**

```bash
# Comparer les composants
ls app/src/components/
ls apps/web/components/

# Vérifier les configs
cat app/src/lib/config.js
cat apps/web/lib/utils.ts
```

Si tout est migré vers `apps/web` et `apps/admin` → ✅ Safe de supprimer

---

**Prêt à libérer 15GB ? 🚀**
