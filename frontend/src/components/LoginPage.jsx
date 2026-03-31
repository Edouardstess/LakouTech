import React, { useState } from "react";
import { Auth } from "../api/entities";

export default function LoginPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ nom: "", email: "", password: "", role: "Admin" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        const data = await Auth.login(form.email, form.password);
        onLogin(data.user);
      } else {
        await Auth.register(form);
        const data = await Auth.login(form.email, form.password);
        onLogin(data.user);
      }
    } catch (err) {
      setError(err.message || "Identifiants invalides ou erreur serveur.");
    }
    setLoading(false);
  }

  const set = (k, v) => setForm({ ...form, [k]: v });

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">🎓</div>
        <h1>EduManager</h1>
        <p>{isLogin ? "Connectez-vous à votre espace" : "Créez votre compte administrateur"}</p>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <div>
              <label className="form-label">Nom complet</label>
              <input required className="form-input" value={form.nom} onChange={e => set("nom", e.target.value)} placeholder="Jean Dupont" />
            </div>
          )}
          <div>
            <label className="form-label">Email</label>
            <input required type="email" className="form-input" value={form.email} onChange={e => set("email", e.target.value)} placeholder="admin@ecole.ht" />
          </div>
          <div>
            <label className="form-label">Mot de passe</label>
            <input required type="password" className="form-input" value={form.password} onChange={e => set("password", e.target.value)} placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="login-btn">
            {loading ? "Chargement..." : isLogin ? "Se connecter" : "Créer le compte"}
          </button>
        </form>

        <div className="login-toggle">
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
          </button>
        </div>
      </div>
    </div>
  );
}
