import { Paraphe } from "@/types/paraphe";
import { ParapheService } from "./ParapheService";

export interface ParapheSignatureData {
  parapheId: string;
  paraphe: Paraphe;
  signatureData: string; // Base64 ou contenu du paraphe
  timestamp: Date;
  signatoryName: string;
  documentId: string;
}

export class ParapheSignatureService {
  private static instance: ParapheSignatureService;
  private parapheService: ParapheService;

  private constructor() {
    this.parapheService = ParapheService.getInstance();
  }

  public static getInstance(): ParapheSignatureService {
    if (!ParapheSignatureService.instance) {
      ParapheSignatureService.instance = new ParapheSignatureService();
    }
    return ParapheSignatureService.instance;
  }

  /**
   * Récupère le paraphe par défaut de l'utilisateur
   */
  async getDefaultParaphe(): Promise<Paraphe | null> {
    try {
      const paraphes = await this.parapheService.getUserParaphes();
      return paraphes.find(p => p.isDefault) || null;
    } catch (error) {
      console.error('Error getting default paraphe:', error);
      return null;
    }
  }

  /**
   * Récupère un paraphe par ID
   */
  async getParapheById(parapheId: string): Promise<Paraphe | null> {
    try {
      return await this.parapheService.getParaphe(parapheId);
    } catch (error) {
      console.error('Error getting paraphe by ID:', error);
      return null;
    }
  }

  /**
   * Crée une signature avec un paraphe
   */
  createParapheSignature(
    paraphe: Paraphe,
    signatoryName: string,
    documentId: string
  ): ParapheSignatureData {
    return {
      parapheId: paraphe.id,
      paraphe,
      signatureData: paraphe.content,
      timestamp: new Date(),
      signatoryName,
      documentId,
    };
  }

  /**
   * Valide qu'un paraphe peut être utilisé pour la signature
   */
  validateParapheForSignature(paraphe: Paraphe): boolean {
    if (!paraphe.content || paraphe.content.trim() === '') {
      return false;
    }

    switch (paraphe.type) {
      case 'text':
        return paraphe.content.length > 0;
      case 'drawing':
      case 'upload':
        return paraphe.content.startsWith('data:image/') || paraphe.content.startsWith('http');
      default:
        return false;
    }
  }

  /**
   * Convertit un paraphe en données de signature compatibles
   */
  convertParapheToSignatureData(paraphe: Paraphe): string {
    switch (paraphe.type) {
      case 'text':
        // Pour les paraphes textuels, on peut créer une image avec le texte
        return this.createTextSignatureImage(paraphe);
      case 'drawing':
      case 'upload':
        // Pour les images, on retourne directement le contenu
        return paraphe.content;
      default:
        throw new Error(`Type de paraphe non supporté: ${paraphe.type}`);
    }
  }

  /**
   * Crée une image de signature à partir d'un paraphe textuel
   */
  private createTextSignatureImage(paraphe: Paraphe): string {
    // Cette méthode pourrait créer une image canvas avec le texte
    // Pour l'instant, on retourne le texte en base64 simple
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Impossible de créer le contexte canvas');
    }

    // Configuration du style
    const fontSize = paraphe.size || 24;
    const fontFamily = paraphe.font || 'Dancing Script';
    const color = paraphe.color || '#000000';

    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;

    // Mesurer le texte
    const metrics = ctx.measureText(paraphe.content);
    const textWidth = metrics.width;
    const textHeight = fontSize;

    // Ajuster la taille du canvas
    canvas.width = textWidth + 20;
    canvas.height = textHeight + 20;

    // Redessiner avec la nouvelle taille
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.fillText(paraphe.content, 10, fontSize + 5);

    return canvas.toDataURL();
  }

  /**
   * Récupère tous les paraphes disponibles pour la signature
   */
  async getAvailableParaphes(): Promise<Paraphe[]> {
    try {
      const paraphes = await this.parapheService.getUserParaphes();
      return paraphes.filter(p => this.validateParapheForSignature(p));
    } catch (error) {
      console.error('Error getting available paraphes:', error);
      return [];
    }
  }

  /**
   * Vérifie si un paraphe est le paraphe par défaut
   */
  isDefaultParaphe(paraphe: Paraphe): boolean {
    return paraphe.isDefault === true;
  }

  /**
   * Définit un paraphe comme paraphe par défaut
   */
  async setDefaultParaphe(parapheId: string): Promise<boolean> {
    try {
      return await this.parapheService.setDefaultParaphe(parapheId);
    } catch (error) {
      console.error('Error setting default paraphe:', error);
      return false;
    }
  }
} 