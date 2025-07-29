// lib/emailService.js - Version avec Brevo pour emails + Graph API pour calendrier

class EmailService {
  constructor() {
    // Configuration Brevo (ex-Sendinblue)
    this.brevoApiKey = process.env.BREVO_API_KEY;
    this.brevoSenderEmail = process.env.BREVO_SENDER_EMAIL;
    this.brevoSenderName = process.env.BREVO_SENDER_NAME || 'Leonce Ouattara Studio';
    
    // Configuration Microsoft Graph (pour calendrier uniquement)
    this.clientId = process.env.OUTLOOK_CLIENT_ID;
    this.clientSecret = process.env.OUTLOOK_CLIENT_SECRET;
    this.tenantId = process.env.OUTLOOK_TENANT_ID;
    this.refreshToken = process.env.OUTLOOK_REFRESH_TOKEN;
  }

  /**
   * Obtenir un access token Microsoft Graph (pour calendrier)
   */
  async getGraphAccessToken() {
    try {
      const response = await fetch(`https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          refresh_token: this.refreshToken,
          scope: 'https://graph.microsoft.com/Calendars.ReadWrite https://graph.microsoft.com/Contacts.ReadWrite offline_access'
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erreur réponse token Graph:', errorText);
        throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(`Erreur token Graph: ${data.error} - ${data.error_description}`);
      }

      return data.access_token;
    } catch (error) {
      console.error('❌ Erreur obtention access token Graph:', error.message);
      throw new Error(`Impossible d'obtenir l'access token Graph: ${error.message}`);
    }
  }

  /**
   * Envoyer un email via Brevo API
   */
  async sendEmailViaBrevo(to, subject, htmlContent, textContent = null) {
    try {
      console.log('📧 Envoi email via Brevo API...');
      
      if (!this.brevoApiKey) {
        throw new Error('BREVO_API_KEY manquant dans les variables d\'environnement');
      }

      const recipients = Array.isArray(to) 
        ? to.map(email => ({ email }))
        : [{ email: to }];

      const emailData = {
        sender: {
          name: this.brevoSenderName,
          email: this.brevoSenderEmail
        },
        to: recipients,
        subject: subject,
        htmlContent: htmlContent,
        textContent: textContent || this.stripHtmlTags(htmlContent)
      };

      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': this.brevoApiKey
        },
        body: JSON.stringify(emailData)
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Erreur Brevo API:', responseData);
        throw new Error(`Brevo API Error: ${JSON.stringify(responseData)}`);
      }

      console.log('✅ Email envoyé avec succès via Brevo');
      console.log('📧 Message ID:', responseData.messageId);
      
      return { 
        success: true, 
        method: 'Brevo API', 
        messageId: responseData.messageId 
      };

    } catch (error) {
      console.error('❌ Erreur envoi Brevo:', error.message);
      throw error;
    }
  }

  /**
   * Supprimer les balises HTML (pour le contenu texte)
   */
  stripHtmlTags(html) {
    return html
      .replace(/<style[^>]*>.*?<\/style>/gis, '')
      .replace(/<script[^>]*>.*?<\/script>/gis, '')
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Créer un événement dans le calendrier Outlook via Graph API
   */
  async createCalendarEvent(appointmentData) {
    try {
      console.log('📅 Création événement calendrier via Graph API...');
      
      const accessToken = await this.getGraphAccessToken();
      
      // Préparer les dates
      const appointmentDate = new Date(appointmentData.date);
      const [hours, minutes] = appointmentData.time.split(':');
      appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      const endDate = new Date(appointmentDate);
      endDate.setHours(endDate.getHours() + 1); // Durée de 1h

      const event = {
        subject: `Consultation - ${appointmentData.service}`,
        body: {
          contentType: 'HTML',
          content: `
            <h3>Consultation avec ${appointmentData.name}</h3>
            <p><strong>Service :</strong> ${appointmentData.service}</p>
            <p><strong>Email client :</strong> ${appointmentData.email}</p>
            <p><strong>Téléphone :</strong> ${appointmentData.phone || 'Non renseigné'}</p>
            <p><strong>Message :</strong></p>
            <p>${appointmentData.message || 'Aucun message spécifique'}</p>
          `
        },
        start: {
          dateTime: appointmentDate.toISOString(),
          timeZone: 'Africa/Abidjan'
        },
        end: {
          dateTime: endDate.toISOString(),
          timeZone: 'Africa/Abidjan'
        },
        attendees: [
          {
            emailAddress: {
              address: appointmentData.email,
              name: appointmentData.name
            },
            type: 'required'
          }
        ],
        isOnlineMeeting: true,
        onlineMeetingProvider: 'teamsForBusiness'
      };

      const response = await fetch('https://graph.microsoft.com/v1.0/me/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erreur création événement:', errorData);
        throw new Error(`Graph Calendar Error: ${JSON.stringify(errorData)}`);
      }

      const eventData = await response.json();
      console.log('✅ Événement calendrier créé avec succès');
      console.log('📅 Event ID:', eventData.id);

      return {
        success: true,
        eventId: eventData.id,
        webLink: eventData.webLink,
        onlineMeeting: eventData.onlineMeeting
      };

    } catch (error) {
      console.error('❌ Erreur création calendrier:', error.message);
      // Ne pas faire échouer l'ensemble si le calendrier échoue
      return { success: false, error: error.message };
    }
  }

  /**
   * Ajouter un contact dans Outlook via Graph API
   */
  async addContact(appointmentData) {
    try {
      console.log('👤 Ajout contact via Graph API...');
      
      const accessToken = await this.getGraphAccessToken();
      
      const contact = {
        givenName: appointmentData.name.split(' ')[0] || appointmentData.name,
        surname: appointmentData.name.split(' ').slice(1).join(' ') || '',
        emailAddresses: [
          {
            address: appointmentData.email,
            name: appointmentData.email
          }
        ],
        businessPhones: appointmentData.phone ? [appointmentData.phone] : [],
        jobTitle: `Client ${appointmentData.service}`,
        companyName: 'Clients Leonce Ouattara Studio',
        businessAddress: {
          city: 'Distance'
        }
      };

      const response = await fetch('https://graph.microsoft.com/v1.0/me/contacts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contact)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erreur ajout contact:', errorData);
        // Ne pas faire échouer si le contact existe déjà
        if (!errorData.error?.code?.includes('Duplicate')) {
          throw new Error(`Graph Contact Error: ${JSON.stringify(errorData)}`);
        }
      } else {
        const contactData = await response.json();
        console.log('✅ Contact ajouté avec succès');
        console.log('👤 Contact ID:', contactData.id);
      }

      return { success: true };

    } catch (error) {
      console.error('❌ Erreur ajout contact:', error.message);
      // Ne pas faire échouer l'ensemble si le contact échoue
      return { success: false, error: error.message };
    }
  }

  /**
   * Méthode principale d'envoi d'email
   */
  async sendEmail(to, subject, text, html = null) {
    console.log(`🚀 Envoi email à: ${Array.isArray(to) ? to.join(', ') : to}`);
    console.log(`📑 Sujet: ${subject}`);

    try {
      // Utiliser directement Brevo pour l'envoi d'emails
      return await this.sendEmailViaBrevo(to, subject, html || text, text);
    } catch (error) {
      console.error('❌ Erreur envoi email:', error.message);
      throw error;
    }
  }

  /**
   * Traitement complet d'un nouveau rendez-vous
   */
  async processNewAppointment(appointmentData) {
    const results = {
      emailSent: false,
      calendarCreated: false,
      contactAdded: false,
      errors: []
    };

    try {
      // 1. Envoyer l'email de confirmation (prioritaire)
      console.log('📧 === ENVOI EMAIL DE CONFIRMATION ===');
      const emailContent = this.generateClientConfirmationEmail(appointmentData);
      await this.sendEmail(
        appointmentData.email,
        emailContent.subject,
        emailContent.text,
        emailContent.html
      );
      results.emailSent = true;
      console.log('✅ Email de confirmation envoyé');

      // 2. Créer l'événement calendrier (optionnel)
      console.log('📅 === CRÉATION ÉVÉNEMENT CALENDRIER ===');
      const calendarResult = await this.createCalendarEvent(appointmentData);
      if (calendarResult.success) {
        results.calendarCreated = true;
        results.calendarData = calendarResult;
      } else {
        results.errors.push(`Calendrier: ${calendarResult.error}`);
      }

      // 3. Ajouter le contact (optionnel)
      console.log('👤 === AJOUT CONTACT ===');
      const contactResult = await this.addContact(appointmentData);
      if (contactResult.success) {
        results.contactAdded = true;
      } else {
        results.errors.push(`Contact: ${contactResult.error}`);
      }

      // 4. Envoyer notification admin
      console.log('📧 === NOTIFICATION ADMIN ===');
      try {
        const adminEmail = process.env.ADMIN_EMAIL || this.brevoSenderEmail;
        const adminEmailContent = this.generateAdminNotificationEmail(appointmentData);
        await this.sendEmail(
          adminEmail,
          adminEmailContent.subject,
          adminEmailContent.text,
          adminEmailContent.html
        );
        console.log('✅ Notification admin envoyée');
      } catch (adminError) {
        results.errors.push(`Admin notification: ${adminError.message}`);
      }

      return results;

    } catch (error) {
      console.error('❌ Erreur traitement rendez-vous:', error.message);
      results.errors.push(`Email principal: ${error.message}`);
      throw error; // L'email principal doit réussir
    }
  }

  /**
   * Générer le template email de confirmation client
   */
  generateClientConfirmationEmail(appointmentData) {
    const formatDate = (dateStr) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    };

    const subject = `✅ Confirmation de votre rendez-vous - ${appointmentData.service}`;
    
    const text = `
Bonjour ${appointmentData.name},

Votre rendez-vous a été confirmé avec succès !

📅 Détails de votre consultation :
• Service : ${appointmentData.service}
• Date : ${formatDate(appointmentData.date)}
• Heure : ${appointmentData.time}
• Durée : Environ 60 minutes
• Mode : Visioconférence   
      
📧 Un lien de connexion vous sera envoyé 1 heure avant le rendez-vous.

💬 Message : ${appointmentData.message || 'Aucun message spécifique'}

📞 Pour toute question ou modification :
• Email : leonce-ouattara-studio@outlook.com
• Téléphone : +225 05 45 13 07 39

Merci de votre confiance !

Leonce Ouattara
Intégrateur Développeur & Consultant Digital
`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Confirmation de rendez-vous</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="margin: 0; font-size: 28px;">✅ Rendez-vous Confirmé</h1>
    <p style="margin: 10px 0 0 0; opacity: 0.9;">Votre consultation a été réservée avec succès</p>
  </div>
  
  <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
    
    <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <h2 style="color: #667eea; margin-top: 0;">📅 Détails de votre consultation</h2>
      
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>👤 Client :</strong></td>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${appointmentData.name}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>🛠️ Service :</strong></td>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${appointmentData.service}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>📅 Date :</strong></td>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${formatDate(appointmentData.date)}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>🕐 Heure :</strong></td>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${appointmentData.time}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>⏱️ Durée :</strong></td>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee;">Environ 60 minutes</td>
        </tr>
        <tr>
          <td style="padding: 10px 0;"><strong>💻 Mode :</strong></td>
          <td style="padding: 10px 0;">Visioconférence</td>
        </tr>
      </table>
    </div>
    
    ${appointmentData.message ? `
    <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <h3 style="color: #667eea; margin-top: 0;">💬 Votre message</h3>
      <p style="background: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #667eea; margin: 0;">
        ${appointmentData.message}
      </p>
    </div>
    ` : ''}
    
    <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745; margin-bottom: 20px;">
      <h3 style="color: #28a745; margin-top: 0;">📧 Prochaines étapes</h3>
      <ul style="margin: 0; padding-left: 20px;">
        <li>Un lien de visioconférence vous sera envoyé <strong>1 heure avant</strong> le rendez-vous</li>
        <li>Vous recevrez un rappel <strong>24h avant</strong> votre consultation</li>
        <li>Préparez vos questions et documents relatifs à votre projet</li>
      </ul>
    </div>
    
    <div style="text-align: center; padding: 20px;">
      <h3 style="color: #667eea;">📞 Besoin d'aide ?</h3>
      <p>
        <strong>Email :</strong> <a href="mailto:leonce-ouattara-studio@outlook.com" style="color: #667eea;">leonce-ouattara-studio@outlook.com</a><br>
        <strong>Téléphone :</strong> <a href="tel:+22505451307390" style="color: #667eea;">+225 05 45 13 07 39</a>
      </p>
      <p style="font-size: 12px; color: #666; margin-top: 20px;">
        Vous pouvez annuler ou reporter votre rendez-vous jusqu'à 24h avant la date prévue.
      </p>
    </div>
    
  </div>
  
  <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
    <p>
      <strong>Leonce Ouattara</strong><br>
      Intégrateur Développeur & Consultant Digital<br>
      🌐 <a href="https://leonceouattarastudio.netlify.app" style="color: #667eea;">leonceouattarastudio.netlify.app</a>
    </p>
  </div>
  
</body>
</html>
`;

    return { subject, text, html };
  }

  /**
   * Générer le template email de notification admin
   */
  generateAdminNotificationEmail(appointmentData) {
    const subject = `🔔 Nouveau rendez-vous - ${appointmentData.name} (${appointmentData.service})`;
    
    const text = `
NOUVEAU RENDEZ-VOUS RÉSERVÉ

👤 Client : ${appointmentData.name}
📧 Email : ${appointmentData.email}
📞 Téléphone : ${appointmentData.phone || 'Non renseigné'}

🛠️ Service : ${appointmentData.service}
📅 Date : ${appointmentData.date}
🕐 Heure : ${appointmentData.time}

💬 Message du client :
${appointmentData.message || 'Aucun message spécifique'}

---
Notification automatique du système de réservation
`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Nouveau rendez-vous</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  
  <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="margin: 0; font-size: 24px;">🔔 Nouveau Rendez-vous</h1>
  </div>
  
  <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 10px 10px;">
    
    <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      
      <h2 style="color: #ff6b6b; margin-top: 0;">Informations client</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Nom :</strong></td>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${appointmentData.name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Email :</strong></td>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><a href="mailto:${appointmentData.email}">${appointmentData.email}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Téléphone :</strong></td>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${appointmentData.phone || 'Non renseigné'}</td>
        </tr>
      </table>
      
      <h2 style="color: #ff6b6b;">Détails du rendez-vous</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Service :</strong></td>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${appointmentData.service}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Date :</strong></td>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${appointmentData.date}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>Heure :</strong></td>
          <td style="padding: 8px 0;">${appointmentData.time}</td>
        </tr>
      </table>
      
      ${appointmentData.message ? `
      <h2 style="color: #ff6b6b;">Message du client</h2>
      <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #ff6b6b;">
        ${appointmentData.message}
      </div>
      ` : ''}
      
    </div>
    
  </div>
  
  <div style="text-align: center; padding: 15px; color: #666; font-size: 12px;">
    Notification automatique du système de réservation
  </div>
  
</body>
</html>
`;

    return { subject, text, html };
  }
}

// Créer une instance du service
const emailService = new EmailService();

// Fonctions de compatibilité pour l'API
export const sendClientConfirmationEmail = async (appointmentData) => {
  try {
    const result = await emailService.processNewAppointment(appointmentData);
    
    // Log des résultats
    console.log('📊 === RÉSUMÉ TRAITEMENT RENDEZ-VOUS ===');
    console.log(`✅ Email envoyé: ${result.emailSent}`);
    console.log(`📅 Calendrier créé: ${result.calendarCreated}`);
    console.log(`👤 Contact ajouté: ${result.contactAdded}`);
    if (result.errors.length > 0) {
      console.log('⚠️ Erreurs non critiques:', result.errors);
    }
    
    return result;
  } catch (error) {
    console.error('Erreur traitement rendez-vous:', error);
    throw error;
  }
};

export const sendAdminNotificationEmail = async (appointmentData) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || emailService.brevoSenderEmail;
    const emailContent = emailService.generateAdminNotificationEmail(appointmentData);
    return await emailService.sendEmail(
      adminEmail,
      emailContent.subject,
      emailContent.text,
      emailContent.html
    );
  } catch (error) {
    console.error('Erreur envoi notification admin:', error);
    throw error;
  }
};

// Export par défaut
export default emailService;

// Exports supplémentaires
export { emailService };
export const sendEmail = (to, subject, text, html) => emailService.sendEmail(to, subject, text, html);
export const processNewAppointment = (appointmentData) => emailService.processNewAppointment(appointmentData);