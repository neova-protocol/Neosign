"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "/auth/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      localStorage.setItem("token", res.data.token);
      router.push("/dashboard");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Erreur de connexion");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erreur de connexion");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f6fa' }}>
      <div style={{ background: '#fff', padding: '2rem 2.5rem', borderRadius: 12, boxShadow: '0 2px 16px 0 rgba(60,60,60,0.08)', maxWidth: 370, width: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Connexion</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: 6, border: '1px solid #d1d5db', marginTop: 4 }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="password">Mot de passe</label>
            <input id="password" type="password" placeholder="Mot de passe" required value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: 6, border: '1px solid #d1d5db', marginTop: 4 }} />
          </div>
          <button type="submit" style={{ width: '100%', background: '#646cff', color: '#fff', border: 'none', borderRadius: 6, padding: '0.8rem 0', fontWeight: 600, fontSize: '1.1rem', cursor: 'pointer' }} disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
          {error && <div style={{ color: '#e74c3c', background: '#fbeaea', borderRadius: 4, padding: '0.5rem 1rem', marginTop: 8, textAlign: 'center', fontSize: '0.98rem' }}>{error}</div>}
        </form>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          Pas de compte ? <a href="/signup" style={{ color: '#646cff', textDecoration: 'none', fontWeight: 500 }}>Créer un compte</a>
        </div>
      </div>
    </main>
  );
} 