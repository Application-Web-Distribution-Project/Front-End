# Utiliser Node.js 14 (version alpine pour un conteneur plus léger)
FROM node:14-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier uniquement package.json et package-lock.json pour installer les dépendances en premier
COPY package.json package-lock.json ./

# Nettoyer le cache et installer les dépendances avec --legacy-peer-deps
RUN npm cache clean --force && npm install --legacy-peer-deps

# Copier le reste des fichiers de l'application
COPY . .

# Exposer le port 4200
EXPOSE 4200

# Lancer l'application avec binding réseau pour l'accès externe
CMD ["npm", "run", "start", "--", "--host", "0.0.0.0"]
