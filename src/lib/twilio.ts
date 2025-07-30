import twilio from 'twilio';

// Configuration Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Client Twilio
const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export interface SMSResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export class TwilioService {
  /**
   * Vérifie si Twilio est configuré
   */
  static isConfigured(): boolean {
    return !!(accountSid && authToken && phoneNumber);
  }

  /**
   * Envoie un SMS via Twilio
   */
  static async sendSMS(to: string, message: string): Promise<SMSResult> {
    if (!this.isConfigured()) {
      console.warn('Twilio not configured, SMS will be simulated');
      return this.simulateSMS(to, message);
    }

    if (!client) {
      return {
        success: false,
        error: 'Twilio client not initialized'
      };
    }

    try {
      // Valider le numéro de téléphone
      if (!this.isValidPhoneNumber(to)) {
        return {
          success: false,
          error: 'Invalid phone number format'
        };
      }

      // Envoyer le SMS
      const result = await client.messages.create({
        body: message,
        from: phoneNumber!,
        to: to
      });

      console.log(`SMS sent successfully to ${to}, SID: ${result.sid}`);

      return {
        success: true,
        messageId: result.sid
      };
    } catch (error) {
      console.error('Error sending SMS via Twilio:', error);
      
      // Gestion des erreurs spécifiques Twilio
      if (error instanceof Error) {
        if (error.message.includes('21211')) {
          return {
            success: false,
            error: 'Invalid phone number'
          };
        } else if (error.message.includes('21214')) {
          return {
            success: false,
            error: 'Phone number is not mobile'
          };
        } else if (error.message.includes('21608')) {
          return {
            success: false,
            error: 'Message delivery failed'
          };
        }
      }

      return {
        success: false,
        error: 'Failed to send SMS'
      };
    }
  }

  /**
   * Simule l'envoi d'un SMS (pour le développement)
   */
  private static simulateSMS(to: string, message: string): SMSResult {
    console.log(`[SIMULATION] SMS to ${to}: ${message}`);
    return {
      success: true,
      messageId: `sim_${Date.now()}`
    };
  }

  /**
   * Valide le format du numéro de téléphone
   */
  private static isValidPhoneNumber(phoneNumber: string): boolean {
    // Format international E.164
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phoneNumber);
  }

  /**
   * Formate un numéro de téléphone français
   */
  static formatFrenchPhoneNumber(phoneNumber: string): string {
    // Supprimer tous les espaces et caractères spéciaux
    let cleaned = phoneNumber.replace(/[\s\-\(\)\.]/g, '');
    
    // Si le numéro commence par 0, le remplacer par +33
    if (cleaned.startsWith('0')) {
      cleaned = '+33' + cleaned.substring(1);
    }
    
    // Si le numéro ne commence pas par +, ajouter +33
    if (!cleaned.startsWith('+')) {
      cleaned = '+33' + cleaned;
    }
    
    return cleaned;
  }

  /**
   * Génère un message SMS pour la vérification 2FA
   */
  static generateVerificationMessage(code: string): string {
    return `Votre code de vérification Neosign: ${code}\n\nCe code expire dans 5 minutes.`;
  }
} 