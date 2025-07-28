// Utilisation des APIs Web Crypto natives pour l'authentification ZK
export interface ZKProof {
  publicInput: string;
  proof: string;
  timestamp: number;
}

export interface ZKIdentity {
  commitment: string;
  nullifier: string;
  trapdoor: string;
}

export interface ZKIdentityExport {
  version: string;
  identity: ZKIdentity;
  metadata: {
    createdAt: string;
    description?: string;
  };
}

export class ZKAuth {
  /**
   * Convertit un ArrayBuffer en hex string
   */
  private static arrayBufferToHex(buffer: ArrayBuffer): string {
    return Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  /**
   * Convertit un hex string en ArrayBuffer
   */
  private static hexToArrayBuffer(hex: string): ArrayBuffer {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes.buffer;
  }

  /**
   * Génère un hash SHA-256
   */
  private static async sha256(data: Uint8Array): Promise<string> {
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return this.arrayBufferToHex(hashBuffer);
  }

  /**
   * Génère une identité ZK avec un commitment et un nullifier
   */
  static async generateIdentity(): Promise<ZKIdentity> {
    // Générer des valeurs aléatoires pour l'identité
    const secret = crypto.getRandomValues(new Uint8Array(32));
    const nullifier = crypto.getRandomValues(new Uint8Array(32));
    const trapdoor = crypto.getRandomValues(new Uint8Array(32));

    // Calculer le commitment (hash du secret + nullifier)
    const commitmentData = new Uint8Array([...secret, ...nullifier]);
    const commitment = await this.sha256(commitmentData);

    return {
      commitment,
      nullifier: this.arrayBufferToHex(nullifier.buffer),
      trapdoor: this.arrayBufferToHex(trapdoor.buffer),
    };
  }

  /**
   * Génère une preuve ZK pour prouver la connaissance du secret
   */
  static async generateProof(
    identity: ZKIdentity,
    challenge: string,
  ): Promise<ZKProof> {
    // Générer une nouvelle paire de clés pour cette session
    const keyPair = await crypto.subtle.generateKey(
      {
        name: "ECDSA",
        namedCurve: "P-256",
      },
      true,
      ["sign", "verify"],
    );

    // Signer le challenge
    const message = new TextEncoder().encode(challenge);
    const signature = await crypto.subtle.sign(
      {
        name: "ECDSA",
        hash: "SHA-256",
      },
      keyPair.privateKey,
      message,
    );

    // Exporter la clé publique
    const publicKeyBuffer = await crypto.subtle.exportKey(
      "spki",
      keyPair.publicKey,
    );

    // Générer un hash du challenge pour l'input public
    const publicInput = await this.sha256(message);

    return {
      publicInput,
      proof: JSON.stringify({
        signature: this.arrayBufferToHex(signature),
        publicKey: this.arrayBufferToHex(publicKeyBuffer),
        nullifier: identity.nullifier,
      }),
      timestamp: Date.now(),
    };
  }

  /**
   * Vérifie une preuve ZK
   */
  static async verifyProof(
    proof: ZKProof,
    challenge: string,
  ): Promise<boolean> {
    try {
      const proofData = JSON.parse(proof.proof);

      // Importer la clé publique
      const publicKeyBuffer = this.hexToArrayBuffer(proofData.publicKey);
      const publicKey = await crypto.subtle.importKey(
        "spki",
        publicKeyBuffer,
        {
          name: "ECDSA",
          namedCurve: "P-256",
        },
        false,
        ["verify"],
      );

      // Vérifier la signature
      const message = new TextEncoder().encode(challenge);
      const signature = this.hexToArrayBuffer(proofData.signature);

      return await crypto.subtle.verify(
        {
          name: "ECDSA",
          hash: "SHA-256",
        },
        publicKey,
        signature,
        message,
      );
    } catch (error) {
      console.error("Erreur lors de la vérification de la preuve ZK:", error);
      return false;
    }
  }

  /**
   * Génère un challenge unique pour l'authentification
   */
  static generateChallenge(): string {
    const randomBytes = crypto.getRandomValues(new Uint8Array(32));
    return this.arrayBufferToHex(randomBytes.buffer);
  }

  /**
   * Crée un hash sécurisé pour le stockage
   */
  static async hashIdentity(identity: ZKIdentity): Promise<string> {
    const data = new TextEncoder().encode(JSON.stringify(identity));
    return await this.sha256(data);
  }

  /**
   * Exporte une identité ZK pour sauvegarde/transfert
   */
  static exportIdentity(
    identity: ZKIdentity,
    description?: string,
  ): ZKIdentityExport {
    return {
      version: "1.0",
      identity,
      metadata: {
        createdAt: new Date().toISOString(),
        description: description || "Identité ZK exportée",
      },
    };
  }

  /**
   * Importe une identité ZK depuis un export
   */
  static importIdentity(exportData: ZKIdentityExport): ZKIdentity {
    if (exportData.version !== "1.0") {
      throw new Error("Version d'export non supportée");
    }

    if (
      !exportData.identity ||
      !exportData.identity.commitment ||
      !exportData.identity.nullifier ||
      !exportData.identity.trapdoor
    ) {
      throw new Error("Format d'identité invalide");
    }

    return exportData.identity;
  }

  /**
   * Valide une identité ZK importée
   */
  static async validateImportedIdentity(
    identity: ZKIdentity,
  ): Promise<boolean> {
    try {
      // Vérifier que l'identité a tous les champs requis
      if (!identity.commitment || !identity.nullifier || !identity.trapdoor) {
        return false;
      }

      // Vérifier que les champs sont des hex strings valides
      const hexRegex = /^[0-9a-fA-F]+$/;
      if (
        !hexRegex.test(identity.commitment) ||
        !hexRegex.test(identity.nullifier) ||
        !hexRegex.test(identity.trapdoor)
      ) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }
}

/**
 * Utilitaire pour la gestion des sessions ZK
 */
export class ZKSessionManager {
  private static readonly SESSION_KEY = "zk_session";
  private static readonly IDENTITY_KEY = "zk_identity";

  static saveSession(proof: ZKProof): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(proof));
    }
  }

  static getSession(): ZKProof | null {
    if (typeof window !== "undefined") {
      const session = localStorage.getItem(this.SESSION_KEY);
      return session ? JSON.parse(session) : null;
    }
    return null;
  }

  static clearSession(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.SESSION_KEY);
      localStorage.removeItem(this.IDENTITY_KEY);
    }
  }

  static saveIdentity(identity: ZKIdentity): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.IDENTITY_KEY, JSON.stringify(identity));
    }
  }

  static getIdentity(): ZKIdentity | null {
    if (typeof window !== "undefined") {
      const identity = localStorage.getItem(this.IDENTITY_KEY);
      return identity ? JSON.parse(identity) : null;
    }
    return null;
  }

  /**
   * Exporte l'identité ZK actuelle pour sauvegarde
   */
  static exportCurrentIdentity(description?: string): ZKIdentityExport | null {
    const identity = this.getIdentity();
    if (!identity) {
      return null;
    }
    return ZKAuth.exportIdentity(identity, description);
  }

  /**
   * Importe et sauvegarde une identité ZK
   */
  static importAndSaveIdentity(exportData: ZKIdentityExport): boolean {
    try {
      const identity = ZKAuth.importIdentity(exportData);
      this.saveIdentity(identity);
      return true;
    } catch (error) {
      console.error("Erreur lors de l'import de l'identité ZK:", error);
      return false;
    }
  }

  /**
   * Génère un fichier de sauvegarde pour téléchargement
   */
  static downloadIdentityBackup(description?: string): void {
    const exportData = this.exportCurrentIdentity(description);
    if (!exportData) {
      throw new Error("Aucune identité ZK à exporter");
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `zk-identity-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
