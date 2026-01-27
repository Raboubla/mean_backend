# 📰 MEAN Stack - Backend API

API REST pour la gestion d'articles construite avec Node.js, Express et MongoDB.

## 🚀 Technologies utilisées

- **Node.js** - Environnement d'exécution JavaScript
- **Express.js** - Framework web minimaliste
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB
- **CORS** - Gestion des requêtes cross-origin
- **dotenv** - Gestion des variables d'environnement

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- [Node.js](https://nodejs.org/) (version 14 ou supérieure)
- [npm](https://www.npmjs.com/) (généralement installé avec Node.js)
- Un compte [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (gratuit) ou MongoDB local

## 🛠️ Installation locale

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd MEANoff/backend
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

Créez un fichier `.env` à la racine du dossier `backend` en vous basant sur `.env.example` :

```bash
cp .env.example .env
```

Puis éditez le fichier `.env` avec vos propres valeurs :

```env
MONGO_URI=mongodb+srv://votre_utilisateur:votre_mot_de_passe@votre_cluster.mongodb.net/votre_base?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
```

#### 📝 Comment obtenir votre MONGO_URI ?

**Contactez raboubla** pour obtenir la chaîne de connexion MongoDB du projet.

> ⚠️ **Important** : Ce projet utilise une base de données MongoDB partagée. Ne créez pas votre propre cluster. Demandez l'accès à raboubla qui vous fournira le `MONGO_URI` nécessaire.

### 4. Démarrer le serveur

**Mode développement** (avec rechargement automatique) :
```bash
npm run dev
```

**Mode production** :
```bash
npm start
```

Le serveur démarrera sur `http://localhost:5000`

## 📡 Endpoints API

### Articles

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/articles` | Récupérer tous les articles |
| `POST` | `/articles` | Créer un nouvel article |
| `PUT` | `/articles/:id` | Mettre à jour un article |
| `DELETE` | `/articles/:id` | Supprimer un article |

### Exemples de requêtes

#### Créer un article
```bash
POST http://localhost:5000/articles
Content-Type: application/json

{
  "title": "Mon premier article",
  "content": "Contenu de l'article..."
}
```

#### Récupérer tous les articles
```bash
GET http://localhost:5000/articles
```

#### Mettre à jour un article
```bash
PUT http://localhost:5000/articles/65f1a2b3c4d5e6f7g8h9i0j1
Content-Type: application/json

{
  "title": "Titre modifié",
  "content": "Nouveau contenu..."
}
```

#### Supprimer un article
```bash
DELETE http://localhost:5000/articles/65f1a2b3c4d5e6f7g8h9i0j1
```

## 📁 Structure du projet

```
backend/
├── models/
│   └── Article.js          # Modèle Mongoose pour les articles
├── routes/
│   └── articleRoutes.js    # Routes CRUD pour les articles
├── .env                    # Variables d'environnement (non versionné)
├── .env.example            # Template des variables d'environnement
├── .gitignore              # Fichiers à ignorer par Git
├── package.json            # Dépendances et scripts npm
├── server.js               # Point d'entrée de l'application
└── README.md               # Ce fichier
```

## 🧪 Tester l'API

Vous pouvez tester l'API avec :

- [Postman](https://www.postman.com/)
- [Insomnia](https://insomnia.rest/)
- [Thunder Client](https://www.thunderclient.com/) (extension VS Code)
- cURL en ligne de commande

### Exemple avec cURL

```bash
# Créer un article
curl -X POST http://localhost:5000/articles \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Contenu de test"}'

# Récupérer tous les articles
curl http://localhost:5000/articles
```

## 🐛 Dépannage

### Erreur de connexion MongoDB

Si vous obtenez une erreur de connexion à MongoDB :
- Vérifiez que votre `MONGO_URI` est correct dans `.env`
- Assurez-vous que votre IP est autorisée dans MongoDB Atlas (Network Access)
- Vérifiez que votre mot de passe ne contient pas de caractères spéciaux non encodés

### Port déjà utilisé

Si le port 5000 est déjà utilisé :
- Changez la valeur de `PORT` dans votre fichier `.env`
- Ou arrêtez le processus utilisant le port 5000

## 📝 Scripts disponibles

- `npm start` - Démarre le serveur en mode production
- `npm run dev` - Démarre le serveur en mode développement avec nodemon

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 Licence

ISC

---

**Bon développement ! 🚀**
