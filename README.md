# react-native-inventory-management

Application mobile de gestion de matériels développée avec React Native et Expo.
Elle permet d'ajouter, modifier, supprimer et visualiser des matériels via une API REST connectée à une base de données MySQL.

---

PREREQUIS : 

Installer les outils suivants avant de commencer :

- Node.js (version LTS) : https://nodejs.org
- Git : https://git-scm.com
- Android Studio (pour le cable USB) : https://developer.android.com/studio
- Expo Go sur le téléphone (Play Store)

Installer Expo CLI :

    npm install -g expo-cli

---

INSTALLATION : 

Cloner le projet :

    git clone https://github.com/TiavinaDeathStalker/react-native-inventory-management.git
    cd react-native-inventory-management

Installer les dépendances du backend :

    cd backend
    npm install

Installer les dépendances du frontend :

    cd ../frontend/sujet24-app
    npm install

---

CONFIGURATION : 

Ouvrir le fichier frontend/sujet24-app/api/config.js et remplacer l'IP par celle du PC qui héberge le backend :

    const API_URL = "http://192.168.X.X:3000";
    export default API_URL;

Le téléphone et le PC doivent être connectés au même réseau WiFi.

---

LANCER L'APPLICATION : 

Démarrer le backend (dans un premier terminal) :

    cd backend
    node server.js

Démarrer le frontend (dans un second terminal) :

    cd frontend/sujet24-app
    npx expo start

---

CONNEXION VIA CABLE USB : 

Activer le mode développeur sur le téléphone Android :

    Paramètres > A propos du téléphone > Numéro de build (appuyer 7 fois)
    Puis activer : Options développeur > Debogage USB

Vérifier que le téléphone est bien détecté :

    adb devices

Faire le reverse ADB (même commande sur Windows, Mac et Linux) :

    adb reverse tcp:8081 tcp:8081
    adb reverse tcp:19000 tcp:19000
    adb reverse tcp:19001 tcp:19001
    adb reverse tcp:3000 tcp:3000

Lancer ensuite npx expo start et appuyer sur "a" dans le terminal pour ouvrir sur Android.

---

## Si adb n'est pas reconnu sur Windows

Ajouter le dossier platform-tools au PATH Windows :

    C:\Users\VOTRE-NOM\AppData\Local\Android\Sdk\platform-tools

Ou lancer adb directement depuis ce dossier :

    cd C:\Users\VOTRE-NOM\AppData\Local\Android\Sdk\platform-tools
    .\adb reverse tcp:8081 tcp:8081
    .\adb reverse tcp:3000 tcp:3000

---

## Structure du projet

    react-native-inventory-management/
    ├── backend/
    │   ├── server.js
    │   └── package.json
    └── frontend/
        └── sujet24-app/
            ├── App.js
            ├── api/config.js
            ├── components/
            │   └── CustomAlert.js
            └── screens/
                ├── HomeScreen.js
                ├── AddMaterielScreen.js
                ├── EditMaterielScreen.js
                └── StatsScreen.js
