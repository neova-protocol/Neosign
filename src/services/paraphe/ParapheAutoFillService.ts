import { Paraphe } from "@/types/paraphe";
import { SignatureField } from "@/types";
import { ParapheService } from "./ParapheService";

export interface ParapheAutoFillData {
  fieldId: string;
  parapheId: string;
  paraphe: Paraphe;
  signatoryName: string;
  timestamp: Date;
}

export class ParapheAutoFillService {
  private static instance: ParapheAutoFillService;
  private parapheService: ParapheService;

  private constructor() {
    this.parapheService = ParapheService.getInstance();
  }

  public static getInstance(): ParapheAutoFillService {
    if (!ParapheAutoFillService.instance) {
      ParapheAutoFillService.instance = new ParapheAutoFillService();
    }
    return ParapheAutoFillService.instance;
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
   * Remplit automatiquement tous les champs de paraphe d'un document
   */
  async autoFillParaphes(
    fields: SignatureField[],
    signatoryName: string
  ): Promise<ParapheAutoFillData[]> {
    const parapheFields = fields.filter(field => field.type === "paraphe");
    const defaultParaphe = await this.getDefaultParaphe();
    
    if (!defaultParaphe) {
      console.warn("No default paraphe found for auto-fill");
      return [];
    }

    const autoFillData: ParapheAutoFillData[] = [];

    for (const field of parapheFields) {
      const autoFillDataItem: ParapheAutoFillData = {
        fieldId: field.id,
        parapheId: defaultParaphe.id,
        paraphe: defaultParaphe,
        signatoryName,
        timestamp: new Date(),
      };

      autoFillData.push(autoFillDataItem);
    }

    return autoFillData;
  }

  /**
   * Convertit un paraphe en données de signature pour un champ
   */
  convertParapheToFieldValue(paraphe: Paraphe): string {
    switch (paraphe.type) {
      case 'text':
        // Pour les paraphes textuels, créer une image avec le texte
        return this.createTextParapheImage(paraphe);
      case 'drawing':
      case 'upload':
        // Pour les images, retourner directement le contenu
        return paraphe.content;
      default:
        throw new Error(`Type de paraphe non supporté: ${paraphe.type}`);
    }
  }

  /**
   * Crée une image de paraphe à partir d'un paraphe textuel
   */
  private createTextParapheImage(paraphe: Paraphe): string {
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
   * Valide qu'un paraphe peut être utilisé pour l'auto-remplissage
   */
  validateParapheForAutoFill(paraphe: Paraphe): boolean {
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
   * Récupère tous les paraphes disponibles pour l'auto-remplissage
   */
  async getAvailableParaphes(): Promise<Paraphe[]> {
    try {
      const paraphes = await this.parapheService.getUserParaphes();
      return paraphes.filter(p => this.validateParapheForAutoFill(p));
    } catch (error) {
      console.error('Error getting available paraphes:', error);
      return [];
    }
  }

  /**
   * Log les données d'auto-remplissage pour audit
   */
  logAutoFillData(data: ParapheAutoFillData[]): void {
    console.log('🔄 Auto-fill paraphe data:', {
      timestamp: new Date().toISOString(),
      totalFields: data.length,
      data: data.map(item => ({
        fieldId: item.fieldId,
        parapheName: item.paraphe.name,
        parapheType: item.paraphe.type,
        signatoryName: item.signatoryName,
      }))
    });
  }
} 