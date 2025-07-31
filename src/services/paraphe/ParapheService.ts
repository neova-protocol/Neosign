import { Paraphe, CreateParapheRequest, UpdateParapheRequest, ParapheSettings } from '@/types/paraphe';

export class ParapheService {
  private static instance: ParapheService;

  private constructor() {}

  public static getInstance(): ParapheService {
    if (!ParapheService.instance) {
      ParapheService.instance = new ParapheService();
    }
    return ParapheService.instance;
  }

  /**
   * Récupère tous les paraphes d'un utilisateur
   */
  async getUserParaphes(): Promise<Paraphe[]> {
    try {
      const response = await fetch(`/api/user/paraphes`);
      if (!response.ok) {
        throw new Error('Failed to fetch paraphes');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching paraphes:', error);
      return [];
    }
  }

  /**
   * Récupère un paraphe par ID
   */
  async getParaphe(parapheId: string): Promise<Paraphe | null> {
    try {
      const response = await fetch(`/api/user/paraphes/${parapheId}`);
      if (!response.ok) {
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching paraphe:', error);
      return null;
    }
  }

  /**
   * Crée un nouveau paraphe
   */
  async createParaphe(data: CreateParapheRequest): Promise<Paraphe | null> {
    try {
      const response = await fetch('/api/user/paraphes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create paraphe');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating paraphe:', error);
      return null;
    }
  }

  /**
   * Met à jour un paraphe
   */
  async updateParaphe(parapheId: string, data: UpdateParapheRequest): Promise<Paraphe | null> {
    try {
      const response = await fetch(`/api/user/paraphes/${parapheId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update paraphe');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating paraphe:', error);
      return null;
    }
  }

  /**
   * Supprime un paraphe
   */
  async deleteParaphe(parapheId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/user/paraphes/${parapheId}`, {
        method: 'DELETE',
      });

      return response.ok;
    } catch (error) {
      console.error('Error deleting paraphe:', error);
      return false;
    }
  }

  /**
   * Définit un paraphe comme défaut
   */
  async setDefaultParaphe(parapheId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/user/paraphes/${parapheId}/default`, {
        method: 'PUT',
      });

      return response.ok;
    } catch (error) {
      console.error('Error setting default paraphe:', error);
      return false;
    }
  }

  /**
   * Récupère les paramètres par défaut des paraphes
   */
  getDefaultSettings(): ParapheSettings {
    return {
      defaultFont: 'Dancing Script',
      defaultColor: '#000000',
      defaultSize: 24,
      availableFonts: [
        'Dancing Script',
        'Great Vibes',
        'Pacifico',
        'Satisfy',
        'Kaushan Script',
        'Allura',
        'Alex Brush',
        'Tangerine',
        'Courgette',
        'Homemade Apple'
      ],
      availableColors: [
        '#000000', // Noir
        '#1f2937', // Gris foncé
        '#374151', // Gris
        '#6b7280', // Gris clair
        '#dc2626', // Rouge
        '#ea580c', // Orange
        '#d97706', // Orange foncé
        '#059669', // Vert
        '#0d9488', // Teal
        '#0891b2', // Cyan
        '#3b82f6', // Bleu
        '#6366f1', // Indigo
        '#8b5cf6', // Violet
        '#ec4899', // Rose
        '#f59e0b', // Jaune
      ]
    };
  }

  /**
   * Génère un paraphe par défaut pour un utilisateur
   */
  generateDefaultParaphe(userName: string): CreateParapheRequest {
    const settings = this.getDefaultSettings();
    return {
      name: 'Paraphe par défaut',
      type: 'text',
      content: userName,
      font: settings.defaultFont,
      color: settings.defaultColor,
      size: settings.defaultSize,
      isDefault: true
    };
  }
} 