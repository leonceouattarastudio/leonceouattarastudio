// setup-oauth.js - Script pour obtenir le refresh token
// À exécuter UNE SEULE FOIS pour obtenir les tokens

import { createServer } from 'http';
import { parse } from 'url';
import open from 'open'; // npm install open

// REMPLACEZ CES VALEURS PAR CELLES DE VOTRE NOUVELLE APPLICATION AZURE
const CLIENT_ID = '94a22f4c-2bc7-49ea-9bb1-a2e8d04dcf2e'; // Remplacez par l'ID d'application (client)
const CLIENT_SECRET = 'lUV8Q~sGMhmDre9u_b6PkVLrkD5AptRyQV3REcB~'; // Remplacez par le secret que vous venez de copier
const TENANT_ID = '2ad5b350-1ca9-4e0b-991f-5e6dae0c9771'; // Remplacez par l'ID de l'annuaire (locataire)
const REDIRECT_URI = 'http://localhost:3000/auth/callback';
//const SCOPES = 'https://graph.microsoft.com/Mail.Send https://graph.microsoft.com/Mail.ReadWrite https://graph.microsoft.com/Mail.Send.Shared https://graph.microsoft.com/User.Read https://graph.microsoft.com/SMTP.Send offline_access';
// const SCOPES = 'https://graph.microsoft.com/Mail.Send https://graph.microsoft.com/User.Read https://graph.microsoft.com/Contacts.ReadWrite https://graph.microsoft.com/Calendars.ReadWrite offline_access';
const SCOPES = 'https://graph.microsoft.com/Contacts.ReadWrite https://graph.microsoft.com/Calendars.ReadWrite offline_access';

console.log('🚀 Configuration OAuth2 pour Outlook...\n');

// Vérification des variables
if (CLIENT_ID.includes('VOTRE_') || CLIENT_SECRET.includes('VOTRE_') || TENANT_ID.includes('VOTRE_')) {
  console.error('❌ ERREUR : Vous devez remplacer CLIENT_ID, CLIENT_SECRET et TENANT_ID par vos vraies valeurs !');
  console.log('📋 Récupérez ces valeurs depuis le portail Azure :');
  console.log('- CLIENT_ID : ID d\'application (client)');
  console.log('- CLIENT_SECRET : La valeur du secret client que vous venez de créer');
  console.log('- TENANT_ID : ID de l\'annuaire (locataire)');
  process.exit(1);
}

// Étape 1 : URL d'autorisation
const authUrl = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/authorize?` +
  `client_id=${CLIENT_ID}&` +
  `response_type=code&` +
  `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
  `scope=${encodeURIComponent(SCOPES)}&` +
  `response_mode=query`; 

console.log('📋 Étapes à suivre :');
console.log('1. Un navigateur va s\'ouvrir');
console.log('2. Connectez-vous avec leonce-ouattara-studio@outlook.com');
console.log('3. Acceptez les permissions');
console.log('4. Le code sera automatiquement récupéré\n');

// Créer un serveur temporaire pour recevoir le callback
const server = createServer(async (req, res) => {
  const urlParts = parse(req.url, true);
  
  if (urlParts.pathname === '/auth/callback') {
    const { code, error } = urlParts.query;
    
    if (error) {
      console.error('❌ Erreur d\'autorisation:', error);
      res.end(`
        <html>
          <body>
            <h1>❌ Erreur d'autorisation</h1>
            <p>Erreur: ${error}</p>
            <p>Vérifiez la console pour plus de détails.</p>
            <p><a href="javascript:window.close()">Fermer cette fenêtre</a></p>
          </body>
        </html>
      `);
      server.close();
      return;
    }

    if (!code) {
      console.error('❌ Aucun code d\'autorisation reçu');
      res.end(`
        <html>
          <body>
            <h1>❌ Aucun code reçu</h1>
            <p>Le processus d'autorisation a échoué.</p>
            <p><a href="javascript:window.close()">Fermer cette fenêtre</a></p>
          </body>
        </html>
      `);
      server.close();
      return;
    }

    console.log('✅ Code d\'autorisation reçu !');
    console.log('🔄 Échange du code contre des tokens...\n');

    try {
      // Échanger le code contre des tokens
      const tokenResponse = await fetch(`https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code: code,
          redirect_uri: REDIRECT_URI,
          grant_type: 'authorization_code',
          scope: SCOPES
        })
      });

      const tokens = await tokenResponse.json();

      if (tokens.error) {
        console.error('❌ Erreur lors de l\'échange de tokens:', tokens);
        res.end(`
          <html>
            <body>
              <h1>❌ Erreur lors de l'échange de tokens</h1>
              <p>Erreur: ${tokens.error}</p>
              <p>Description: ${tokens.error_description}</p>
              <p>Vérifiez la console pour plus de détails.</p>
            </body>
          </html>
        `);
        server.close();
        return;
      }

      console.log('🎉 Tokens obtenus avec succès !\n');
      console.log('===============================================');
      console.log('📋 COPIEZ CES VARIABLES DANS VOTRE .env.local :');
      console.log('===============================================\n');
      console.log('# Configuration OAuth2 Outlook');
      console.log(`OUTLOOK_CLIENT_ID=${CLIENT_ID}`);
      console.log(`OUTLOOK_CLIENT_SECRET=${CLIENT_SECRET}`);
      console.log(`OUTLOOK_TENANT_ID=${TENANT_ID}`);
      console.log(`OUTLOOK_REFRESH_TOKEN=${tokens.refresh_token}`);
      console.log('NODEMAILER_EMAIL=leonce-ouattara-studio@outlook.com\n');

      console.log('⏰ Informations sur les tokens :');
      console.log(`- Access token expire dans : ${tokens.expires_in} secondes`);
      console.log('- Refresh token : permanent (à garder secret !)\n');
      
      console.log('🔐 Pour la sécurité :');
      console.log('- Ne partagez JAMAIS ces tokens');
      console.log('- Ajoutez .env.local à votre .gitignore');
      console.log('- Le refresh token permet de générer de nouveaux access tokens\n');

      res.end(`
        <html>
          <head>
            <title>Configuration OAuth2 réussie</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
              .container { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              .success { color: #28a745; }
              .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 4px; margin: 20px 0; }
              code { background: #f8f9fa; padding: 2px 6px; border-radius: 3px; font-family: monospace; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1 class="success">✅ Configuration OAuth2 réussie !</h1>
              <p>Les tokens ont été générés avec succès.</p>
              
              <div class="warning">
                <strong>📋 Action requise :</strong>
                <ol>
                  <li>Vérifiez votre console/terminal pour voir les variables d'environnement</li>
                  <li>Copiez-les dans votre fichier <code>.env.local</code></li>
                  <li>Redémarrez votre application</li>
                  <li>Testez l'envoi d'email</li>
                </ol>
              </div>
              
              <p><strong>🔐 Important :</strong> Gardez ces tokens secrets et ne les partagez jamais.</p>
              <p><a href="javascript:window.close()">Fermer cette fenêtre</a></p>
            </div>
          </body>
        </html>
      `);

      // Test rapide de l'access token
      try {
        console.log('🧪 Test rapide de l\'access token...');
        const testResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
          headers: {
            'Authorization': `Bearer ${tokens.access_token}`
          }
        });
        
        if (testResponse.ok) {
          const userData = await testResponse.json();
          console.log(`✅ Test réussi ! Connecté en tant que : ${userData.displayName} (${userData.mail})`);
        } else {
          console.log('⚠️ Test de l\'access token échoué, mais ce n\'est pas grave');
        }
      } catch (testError) {
        console.log('⚠️ Impossible de tester l\'access token, mais les tokens sont générés');
      }

    } catch (error) {
      console.error('❌ Erreur lors de l\'échange de tokens:', error);
      res.end(`
        <html>
          <body>
            <h1>❌ Erreur serveur</h1>
            <p>Une erreur inattendue s'est produite.</p>
            <p>Vérifiez la console pour plus de détails.</p>
          </body>
        </html>
      `);
    }

    server.close();
  }
});

// Démarrer le serveur temporaire
server.listen(3000, () => {
  console.log('🌐 Serveur de callback démarré sur http://localhost:3000');
  console.log('🔗 Ouverture du navigateur...\n');
  
  console.log('🔧 Configuration utilisée :');
  console.log(`- Client ID: ${CLIENT_ID}`);
  console.log(`- Tenant ID: ${TENANT_ID}`);
  console.log(`- Redirect URI: ${REDIRECT_URI}`);
  console.log(`- Scopes: ${SCOPES}\n`);
  
  // Ouvrir le navigateur
  open(authUrl).catch(() => {
    console.log('❌ Impossible d\'ouvrir automatiquement le navigateur');
    console.log('🔗 Copiez cette URL dans votre navigateur :');
    console.log(authUrl);
  });
});

// Gérer l'arrêt propre
process.on('SIGINT', () => {
  console.log('\n👋 Arrêt du script...');
  server.close();
  process.exit(0);
});

console.log('⏳ En attente de l\'autorisation...');
console.log('💡 Si le navigateur ne s\'ouvre pas, copiez l\'URL ci-dessus');