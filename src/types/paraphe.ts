export interface Paraphe {
  id: string;
  userId: string;
  name: string;
  type: 'text' | 'drawing' | 'upload';
  content: string; // Base64 pour drawing/upload, texte pour text
  font?: string; // Pour les paraphes textuels
  color?: string; // Couleur du paraphe
  size?: number; // Taille du paraphe
  isDefault?: boolean; // Paraphe par défaut
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateParapheRequest {
  name: string;
  type: 'text' | 'drawing' | 'upload';
  content: string;
  font?: string;
  color?: string;
  size?: number;
  isDefault?: boolean;
}

export interface UpdateParapheRequest {
  name?: string;
  content?: string;
  font?: string;
  color?: string;
  size?: number;
  isDefault?: boolean;
}

export interface ParapheSettings {
  defaultFont: string;
  defaultColor: string;
  defaultSize: number;
  availableFonts: string[];
  availableColors: string[];
} 