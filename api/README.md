# Leonce Ouattara Studio API

API Express avec architecture MVC complète pour le portfolio de Leonce Ouattara.

## 🚀 Fonctionnalités

- **Architecture MVC** organisée et scalable
- **Authentification JWT** avec refresh tokens
- **Validation des données** avec Joi
- **Gestion d'erreurs centralisée** avec logging Winston
- **Rate limiting** configurable
- **CORS** sécurisé
- **Sécurité renforcée** (Helmet, XSS, NoSQL injection)
- **Logging avancé** avec rotation des fichiers
- **Base de données MongoDB** avec Mongoose
- **Documentation API** intégrée

## 📋 Prérequis

- Node.js >= 16.0.0
- MongoDB >= 4.4
- npm ou yarn

## 🛠️ Installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd api
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration de l'environnement**
```bash
cp .env.example .env
```

4. **Configurer les variables d'environnement**
Éditer le fichier `.env` avec vos valeurs :
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/leonce-studio
JWT_SECRET=your-super-secret-jwt-key
# ... autres variables
```

5. **Démarrer MongoDB**
```bash
# Avec Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Ou avec MongoDB installé localement
mongod
```

6. **Démarrer l'application**
```bash
# Développement
npm run dev

# Production
npm start
```

## 📚 Structure du projet

```
api/
├── src/
│   ├── config/          # Configuration (DB, Logger, CORS, etc.)
│   ├── controllers/     # Contrôleurs (logique métier)
│   ├── middleware/      # Middlewares (auth, validation, erreurs)
│   ├── models/          # Modèles Mongoose
│   ├── routes/          # Routes Express
│   ├── services/        # Services métier
│   ├── utils/           # Utilitaires
│   ├── app.js           # Configuration Express
│   └── server.js        # Point d'entrée
├── logs/                # Fichiers de logs
├── .env.example         # Variables d'environnement exemple
└── package.json
```

## 🔐 Authentification

L'API utilise JWT avec refresh tokens pour l'authentification :

### Inscription
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!"
}
```

### Connexion
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

### Utilisation du token
```bash
GET /api/v1/auth/me
Authorization: Bearer <your-jwt-token>
```

## 📖 Endpoints principaux

### Authentification
- `POST /api/v1/auth/register` - Inscription
- `POST /api/v1/auth/login` - Connexion
- `POST /api/v1/auth/logout` - Déconnexion
- `GET /api/v1/auth/me` - Profil utilisateur
- `PUT /api/v1/auth/me` - Mise à jour profil
- `PUT /api/v1/auth/change-password` - Changer mot de passe
- `POST /api/v1/auth/forgot-password` - Mot de passe oublié
- `PATCH /api/v1/auth/reset-password/:token` - Réinitialiser mot de passe

### Projets
- `GET /api/v1/projects` - Liste des projets
- `GET /api/v1/projects/:id` - Détail d'un projet
- `POST /api/v1/projects` - Créer un projet (Admin)
- `PUT /api/v1/projects/:id` - Modifier un projet (Admin)
- `DELETE /api/v1/projects/:id` - Supprimer un projet (Admin)
- `GET /api/v1/projects/popular` - Projets populaires
- `GET /api/v1/projects/category/:category` - Projets par catégorie
- `POST /api/v1/projects/:id/like` - Liker un projet

### Utilitaires
- `GET /api/v1/health` - Santé de l'API
- `GET /api/v1/` - Informations API

## 🔒 Sécurité

### Mesures implémentées
- **Helmet** : Headers de sécurité HTTP
- **CORS** : Configuration stricte des origines
- **Rate Limiting** : Limitation des requêtes par IP
- **XSS Protection** : Nettoyage des données entrantes
- **NoSQL Injection** : Sanitisation MongoDB
- **JWT** : Tokens sécurisés avec expiration
- **Bcrypt** : Hashage des mots de passe
- **Validation** : Validation stricte avec Joi

### Rate Limiting
- **Général** : 100 requêtes / 15 minutes
- **Authentification** : 5 tentatives / 15 minutes
- **API Publique** : 200 requêtes / 15 minutes

## 📊 Logging

Le système de logging utilise Winston avec :
- **Console** : Logs colorés en développement
- **Fichiers rotatifs** : Logs quotidiens avec rétention
- **Niveaux** : error, warn, info, debug
- **Métadonnées** : IP, User-Agent, timestamp

### Fichiers de logs
- `logs/application-YYYY-MM-DD.log` : Logs généraux
- `logs/error-YYYY-MM-DD.log` : Logs d'erreurs uniquement

## 🧪 Tests

```bash
# Lancer les tests
npm test

# Tests en mode watch
npm run test:watch

# Coverage
npm run test:coverage
```

## 🚀 Déploiement

### Variables d'environnement production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=your-production-secret
CORS_ORIGIN=https://yourdomain.com
```

### Docker
```bash
# Build
docker build -t leonce-api .

# Run
docker run -p 5000:5000 --env-file .env leonce-api
```

## 📈 Monitoring

### Métriques disponibles
- Temps de réponse des endpoints
- Nombre de requêtes par endpoint
- Erreurs par type
- Utilisation mémoire
- Connexions base de données

### Health Check
```bash
GET /api/v1/health
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👨‍💻 Auteur

**Leonce Ouattara**
- Email: leonce.ouattara@outlook.fr
- LinkedIn: [Leonce Ouattara](https://www.linkedin.com/in/leonce-ouattara/)
- GitHub: [leonce-ouattara](https://github.com/leonce-ouattara/)

## 🆘 Support

Pour toute question ou problème :
1. Vérifier la documentation
2. Consulter les logs d'erreur
3. Ouvrir une issue sur GitHub
4. Contacter l'équipe de développement