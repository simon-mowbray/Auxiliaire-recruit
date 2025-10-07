# PoC Diffusion Annonces — Auxiliaire de vie

Ce mini-repo Express couvre les **4 points** :
1. **Job canonique** + rendu messages (FB/TG/WA) et JSON (APIs partenaires).
2. **Intégrations** prêtes pour **Telegram**, **WhatsApp Cloud**, **Facebook Page**.
3. **Génération de flux XML** + **push SFTP** (France Travail ou assimilé).
4. **Clés** dans `.env` (exemple fourni).

## Lancer en local

```bash
cd auxvie-poc
npm install
cp .env.example .env
# -> remplir les variables nécessaires
npm run start
```

L'API écoute par défaut sur `http://localhost:3030`.

## How to run

```bash
cd auxvie-poc
npm install
npm start -- --port 3030
```

> ℹ️ L'exécution requiert l'installation des dépendances (accès au registre npm) et un fichier `.env` valide si vous ciblez des intégrations externes.

## Endpoints

### POST /publish
Publier vers un connecteur.

Body minimal :
```json
{
  "board": "telegram",
  "job": {
    "id": "job_001",
    "title": "Auxiliaire de vie - Nuit (H/F)",
    "description_html": "<p>...</p>",
    "description_text": "…",
    "city": "Paris",
    "postcode": "75012",
    "country": "FR",
    "department": "75",
    "region": "IDF",
    "employment_type": "FULL_TIME",
    "hours": 35,
    "salary": { "min": 1800, "max": 2100, "currency": "EUR", "period": "MONTH" },
    "remote": false,
    "valid_through": "2025-11-15T23:59:59+02:00",
    "apply_url": "https://exemple.tld/jobs/auxvie-nuit-paris"
  }
}
```

Réponse :
```json
{ "status": "posted", "board": "telegram", "job_id": "job_001", "dedupe_key": "telegram:job_001:xxxx" }
```

### POST /publish/flux
Génère un **jobs.xml** et le pousse via **SFTP** si les variables sont présentes.

Body identique à `/publish` (le champ `board` est ignoré).


---

## Déploiement sur ton Git + Codespaces (Codex)

### 1) Crée le dépôt et pousse le code
```bash
git init
git add .
git commit -m "feat: PoC diffusion auxiliaire de vie"
git branch -M main
git remote add origin <URL_DE_TON_DEPOT>
git push -u origin main
```

### 2) Ouvrir dans GitHub Codespaces
- **Code → Codespaces → Create codespace on main**
- Démarrage grâce à `.devcontainer/devcontainer.json`
- Le serveur est exposé sur le port **3030**

### 3) Renseigner les Secrets (pour tests réels)
Dans **GitHub → Settings → Secrets and variables → Actions** :
- `FACEBOOK_PAGE_ID`, `FACEBOOK_PAGE_TOKEN`
- `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`
- `WA_PHONE_NUMBER_ID`, `WA_BEARER`
- `SFTP_HOST`, `SFTP_USER`, (`SFTP_PASSWORD` ou `SFTP_PRIVATE_KEY`), `SFTP_REMOTE_PATH`

En Codespaces local, mets-les dans `.env` (copie `.env.example`).

### 4) Workflow CI
Le workflow **CI** (`.github/workflows/ci.yml`) vérifie l'installation et un smoke test minimal.
