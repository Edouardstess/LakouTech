import React, { useState, useEffect } from "react";
import { Eleve, Enseignant, Classe, Paiement, Presence, Personnel, Message, Depense } from "../api/entities";

export default function DashboardHome({ setActivePage, pages }) {
  const [stats, setStats] = useState({ eleves: 0, enseignants: 0, classes: 0, paiements: 0, absences: 0, personnel: 0, messages: 0, depenses: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStats(); }, []);

  async function loadStats() {
    try {
      const [eleves, enseignants, classes, paiements, presences, personnel, messages, depenses] = await Promise.all([
        Eleve.list(), Enseignant.list(), Classe.list(), Paiement.list(),
        Presence.filter({ statut: "Absent" }), Personnel.list(), Message.list(), Depense.list()
      ]);
      setStats({
        eleves: eleves.length, enseignants: enseignants.length, classes: classes.length,
        paiements: paiements.filter(p => p.statut === "Payé").reduce((s, p) => s + (p.montant || 0), 0),
        absences: presences.length, personnel: personnel.length,
        messages: messages.filter(m => !m.lu).length,
        depenses: depenses.reduce((s, d) => s + (d.montant || 0), 0)
      });
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  const cards = [
    { label: "Élèves inscrits", value: stats.eleves, icon: "👨‍🎓", accent: "indigo" },
    { label: "Enseignants", value: stats.enseignants, icon: "👨‍🏫", accent: "green" },
    { label: "Classes", value: stats.classes, icon: "🏫", accent: "amber" },
    { label: "Revenus (HTG)", value: stats.paiements.toLocaleString(), icon: "💰", accent: "purple" },
    { label: "Absences aujourd'hui", value: stats.absences, icon: "📋", accent: "red" },
    { label: "Personnel", value: stats.personnel, icon: "👥", accent: "sky" },
    { label: "Messages non lus", value: stats.messages, icon: "✉️", accent: "pink" },
    { label: "Dépenses (HTG)", value: stats.depenses.toLocaleString(), icon: "📊", accent: "orange" },
  ];

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title"><span className="page-title-icon">🏠</span> Tableau de bord</h1>
          <p className="page-subtitle">Bienvenue — Vue d'ensemble de votre établissement</p>
        </div>
      </div>

      {loading ? (
        <div className="loading-container"><div className="loading-spinner" /><p>Chargement des données...</p></div>
      ) : (
        <>
          <div className="stats-grid stagger-children">
            {cards.map((c, i) => (
              <div key={i} className={`stat-card ${c.accent}`}>
                <div className="stat-card-icon">{c.icon}</div>
                <div className="stat-card-value">{c.value}</div>
                <div className="stat-card-label">{c.label}</div>
              </div>
            ))}
          </div>

          <div className="quick-links slide-in-up">
            <h2>Navigation rapide</h2>
            <div className="quick-links-grid">
              {pages.slice(1).map(p => (
                <button key={p.id} className="quick-link-btn" onClick={() => setActivePage(p.id)}>
                  <span>{p.icon}</span>
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
