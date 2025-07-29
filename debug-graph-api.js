require('dotenv').config({ path: '.env.local' });

async function getAccessToken() {
    const tokenUrl = `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/token`;
    const params = new URLSearchParams();
    params.append('client_id', process.env.AZURE_CLIENT_ID);
    params.append('client_secret', process.env.AZURE_CLIENT_SECRET);
    params.append('scope', 'https://graph.microsoft.com/.default');
    params.append('grant_type', 'client_credentials');
    
    const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
    });
    
    const data = await response.json();
    return data.access_token;
}

async function discoverTenantInfo() {
    console.log('🔍 Découverte de votre tenant Azure AD...\n');
    
    const token = await getAccessToken();
    
    try {
        // Obtenir les informations de l'organisation
        const orgResponse = await fetch('https://graph.microsoft.com/v1.0/organization', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (orgResponse.ok) {
            const orgData = await orgResponse.json();
            if (orgData.value && orgData.value.length > 0) {
                const org = orgData.value[0];
                
                console.log('🏢 Votre tenant Azure AD:');
                console.log(`   📝 Nom: ${org.displayName}`);
                console.log(`   🆔 Tenant ID: ${org.id}`);
                
                if (org.verifiedDomains) {
                    console.log('\n📧 Domaines disponibles:');
                    let defaultDomain = null;
                    
                    org.verifiedDomains.forEach(domain => {
                        if (domain.isDefault) {
                            console.log(`   ✅ ${domain.name} (domaine par défaut)`);
                            defaultDomain = domain.name;
                        } else {
                            console.log(`   📧 ${domain.name}`);
                        }
                    });
                    
                    if (defaultDomain) {
                        console.log(`\n🎯 UTILISEZ CE FORMAT: leonce.test@${defaultDomain}`);
                        return defaultDomain;
                    }
                }
            }
        }
        
        // Si on ne peut pas obtenir l'organisation, essayer autre chose
        console.log('❌ Impossible d\'obtenir les infos de l\'organisation');
        return null;
        
    } catch (error) {
        console.log(`❌ Erreur: ${error.message}`);
        return null;
    }
}

async function listExistingUsers() {
    console.log('\n🔍 Recherche d\'utilisateurs existants...\n');
    
    const token = await getAccessToken();
    
    try {
        const usersResponse = await fetch('https://graph.microsoft.com/v1.0/users?$top=10&$select=userPrincipalName,displayName,mail,createdDateTime', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log(`📊 Status: ${usersResponse.status}`);
        
        if (usersResponse.ok) {
            const usersData = await usersResponse.json();
            
            if (usersData.value && usersData.value.length > 0) {
                console.log(`✅ ${usersData.value.length} utilisateur(s) trouvé(s):\n`);
                
                usersData.value.forEach((user, index) => {
                    console.log(`👤 Utilisateur ${index + 1}:`);
                    console.log(`   📧 UPN: ${user.userPrincipalName}`);
                    console.log(`   👤 Nom: ${user.displayName}`);
                    console.log(`   📬 Mail: ${user.mail || 'Non défini'}`);
                    console.log(`   📅 Créé: ${user.createdDateTime ? new Date(user.createdDateTime).toLocaleDateString('fr-FR') : 'N/A'}`);
                    console.log('');
                });
                
                return usersData.value;
            } else {
                console.log('📭 Aucun utilisateur trouvé dans le tenant');
                return [];
            }
        } else {
            const error = await usersResponse.text();
            console.log('❌ Erreur lors de la récupération des utilisateurs:');
            console.log(error.substring(0, 200));
            return [];
        }
        
    } catch (error) {
        console.log(`❌ Erreur réseau: ${error.message}`);
        return [];
    }
}

async function testEmailSend(userEmail) {
    console.log(`\n📧 Test d'envoi vers: ${userEmail}`);
    
    const token = await getAccessToken();
    
    const emailData = {
        message: {
            subject: `🧪 Test Azure AD (sans licence M365) - ${new Date().toLocaleString('fr-FR')}`,
            body: {
                contentType: "HTML",
                content: `
                    <h2>🎉 Test réussi!</h2>
                    <p>Cet email a été envoyé via Microsoft Graph API avec :</p>
                    <ul>
                        <li>✅ Azure AD gratuit (sans licence M365)</li>
                        <li>✅ Permissions Application</li>
                        <li>✅ Client Credentials Flow</li>
                    </ul>
                    <p><strong>Destinataire:</strong> ${userEmail}</p>
                    <p><strong>Envoyé le:</strong> ${new Date().toLocaleString('fr-FR')}</p>
                    <hr>
                    <p><em>Si vous recevez cet email, votre configuration fonctionne parfaitement!</em></p>
                `
            },
            toRecipients: [{
                emailAddress: { address: userEmail }
            }]
        }
    };
    
    try {
        const sendResponse = await fetch(
            `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(userEmail)}/sendMail`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(emailData)
            }
        );
        
        console.log(`📊 Status: ${sendResponse.status} ${sendResponse.statusText}`);
        
        if (sendResponse.ok) {
            console.log('✅ EMAIL ENVOYÉ AVEC SUCCÈS! 🎉\n');
            return true;
        } else {
            const error = await sendResponse.text();
            console.log('❌ Échec de l\'envoi:');
            console.log(error.substring(0, 300));
            
            if (sendResponse.status === 403) {
                console.log('\n💡 Cela peut être normal sans licence Exchange.');
                console.log('   L\'utilisateur peut ne pas avoir de boîte mail active.');
            }
            
            return false;
        }
        
    } catch (error) {
        console.log(`❌ Erreur: ${error.message}`);
        return false;
    }
}

async function main() {
    console.log('🚀 Test Microsoft Graph sans licence M365\n');
    console.log('📋 Ce script va:');
    console.log('   1. Découvrir votre domaine Azure AD');
    console.log('   2. Lister les utilisateurs existants');
    console.log('   3. Vous guider pour créer un utilisateur si nécessaire');
    console.log('   4. Tester l\'envoi d\'email\n');
    
    console.log('='.repeat(60));
    
    // 1. Découvrir le tenant
    const defaultDomain = await discoverTenantInfo();
    
    // 2. Lister les utilisateurs existants
    const existingUsers = await listExistingUsers();
    
    // 3. Instructions selon le résultat
    console.log('='.repeat(60));
    console.log('📋 PROCHAINES ÉTAPES:');
    console.log('='.repeat(60));
    
    if (existingUsers.length > 0) {
        console.log('✅ Vous avez déjà des utilisateurs! Testez avec l\'un d\'eux:\n');
        
        // Tester avec le premier utilisateur
        const testUser = existingUsers[0];
        console.log(`🎯 Test avec: ${testUser.userPrincipalName}`);
        
        const success = await testEmailSend(testUser.userPrincipalName);
        
        if (success) {
            console.log('🎉 CONFIGURATION PARFAITE!');
            console.log(`✅ Utilisez: ${testUser.userPrincipalName} dans votre application`);
        } else {
            console.log('⚠️  L\'utilisateur existe mais n\'a peut-être pas de boîte mail');
        }
        
    } else {
        console.log('📝 Vous devez créer un utilisateur:');
        console.log('');
        console.log('1. Aller sur https://portal.azure.com');
        console.log('2. Azure Active Directory > Users > New user');
        console.log('3. Create new user');
        console.log('4. User name: leonce.test@' + (defaultDomain || 'VOTRE-DOMAINE.onmicrosoft.com'));
        console.log('5. Name: Leonce Test');
        console.log('6. IGNORER la section Licenses (pas nécessaire)');
        console.log('7. Create');
        console.log('');
        console.log('Puis relancez ce script pour tester!');
    }
    
    console.log('\n💡 NOTE IMPORTANTE:');
    console.log('Sans licence Exchange, l\'utilisateur peut ne pas avoir de boîte mail,');
    console.log('mais Microsoft Graph peut quand même fonctionner pour d\'autres scénarios.');
}

main().catch(console.error);