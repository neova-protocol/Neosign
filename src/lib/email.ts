import { Resend } from 'resend';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

// Initialiser Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(options: EmailOptions): Promise<void> {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: [options.to],
      subject: options.subject,
      html: options.html,
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log(`Email sent to ${options.to}`, data);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// Fonction pour envoyer un code de vérification 2FA
export async function send2FACode(email: string, code: string): Promise<void> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Code de vérification 2FA</h2>
      <p>Votre code de vérification pour activer l'authentification à deux facteurs :</p>
      <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
        <h1 style="font-size: 32px; color: #2563eb; margin: 0; font-family: monospace;">${code}</h1>
      </div>
      <p>Ce code expire dans 5 minutes.</p>
      <p>Si vous n'avez pas demandé ce code, ignorez cet email.</p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: 'Code de vérification 2FA - Neosign',
    html,
  });
} 