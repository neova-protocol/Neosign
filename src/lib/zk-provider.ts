import { ZKAuth, ZKProof, ZKIdentity } from "./zk-auth";

export interface ZKCredentials {
  commitment: string;
  proof: string;
  challenge: string;
}

export class ZKProvider {
  /**
   * Génère un challenge pour l'authentification ZK
   */
  static async generateChallenge(): Promise<string> {
    return ZKAuth.generateChallenge();
  }

  /**
   * Vérifie les credentials ZK
   */
  static async verifyCredentials(credentials: ZKCredentials): Promise<boolean> {
    try {
      const proof: ZKProof = {
        publicInput: credentials.commitment,
        proof: credentials.proof,
        timestamp: Date.now(),
      };

      return await ZKAuth.verifyProof(proof, credentials.challenge);
    } catch (error) {
      console.error(
        "Erreur lors de la vérification des credentials ZK:",
        error,
      );
      return false;
    }
  }

  /**
   * Crée une nouvelle identité ZK
   */
  static async createIdentity(): Promise<ZKIdentity> {
    return await ZKAuth.generateIdentity();
  }

  /**
   * Génère une preuve ZK pour une identité donnée
   */
  static async generateProof(
    identity: ZKIdentity,
    challenge: string,
  ): Promise<ZKProof> {
    return await ZKAuth.generateProof(identity, challenge);
  }
}
