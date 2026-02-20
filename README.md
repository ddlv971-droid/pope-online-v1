# POPE Online V1 (Front Netlify + API Render + Mistral)

## URLs
- Front : https://popeonline.netlify.app
- API : https://popeonline-ai-api.onrender.com

---

## 1) Déploiement BACKEND (Render)

### 1.1 Dossier
Le backend est dans `/backend`.

### 1.2 Render
- Create New -> Web Service
- Root Directory : backend
- Build Command : `npm install`
- Start Command : `npm start`

### 1.3 Environment variables (Render)
- LLM_PROVIDER=mistral
- MISTRAL_API_KEY=...
- MISTRAL_MODEL=mistral-small-latest
- CORS_ORIGIN=https://popeonline.netlify.app
- NODE_ENV=production

### 1.4 Test
- https://popeonline-ai-api.onrender.com/health -> {"ok":true}

---

## 2) Déploiement FRONTEND (Netlify)

### 2.1 Dossier
Le frontend est dans `/frontend`.

### 2.2 Netlify
- New site from Git
- Base directory : frontend
- Publish directory : frontend
- Build command : (empty)

### 2.3 Vérification
- https://popeonline.netlify.app/app.html
- Cliquer "Générer"
