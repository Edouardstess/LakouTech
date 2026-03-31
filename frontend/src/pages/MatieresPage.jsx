import React, { useState, useEffect } from "react";
import { Matiere, Enseignant } from "../api/entities";

const emptyForm = { nom: "", code: "", coefficient: 1, enseignant_id: "", couleur: "#4F46E5" };

export default function MatieresPage() {
  const [matieres, setMatieres] = useState([]);
  const [enseignants, setEnseignants] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    Promise.all([Matiere.list(), Enseignant.list()]).then(([m, e]) => {
      setMatieres(m.data || m);
      setEnseignants(e.data || e);
    }).catch(() => {});
  }, []);

  const set = (k, v) => setForm({ ...form, [k]: v });

  async function save() {
    const payload = { ...form, coefficient: +form.coefficient };
    if (editId) await Matiere.update(editId, payload); else await Matiere.create(payload);
    
    const fresh = await Matiere.list();
    setMatieres(fresh.data || fresh);
    setShowForm(false); setEditId(null); setForm(emptyForm);
  }

  async function del(id) {
    if (window.confirm("Supprimer cette matière ?")) {
      await Matiere.delete(id);
      setMatieres(matieres.filter(m => m.id !== id));
    }
  }

  function edit(m) {
    setForm({
      nom: m.nom || "",
      code: m.code || "",
      coefficient: m.coefficient || 1,
      enseignant_id: m.enseignant_id || "",
      couleur: m.couleur || "#4F46E5"
    });
    setEditId(m.id);
    setShowForm(true);
  }

  const getEnseignant = id => {
    const e = enseignants.find(e => e.id === id);
    return e ? `${e.prenom} ${e.nom}` : "—";
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title"><span className="page-title-icon">📚</span> Gestion des Matières</h1>
        <button className="btn btn-primary" onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); }}>+ Nouvelle Matière</button>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal-box">
            <h2>{editId ? "Modifier" : "Nouvelle"} matière</h2>
            <div className="form-grid">
              <div><label className="form-label">Nom de la matière</label><input className="form-input" value={form.nom} onChange={e => set("nom", e.target.value)} /></div>
              <div><label className="form-label">Code (Ex: MATH-01)</label><input className="form-input" value={form.code} onChange={e => set("code", e.target.value)} /></div>
              <div><label className="form-label">Coefficient</label><input type="number" min="1" max="10" className="form-input" value={form.coefficient} onChange={e => set("coefficient", e.target.value)} /></div>
              <div>
                <label className="form-label">Enseignant Principal</label>
                <select className="form-input" value={form.enseignant_id} onChange={e => set("enseignant_id", e.target.value)}>
                  <option value="">— Aucun ou Multiples —</option>
                  {enseignants.map(e => <option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>)}
                </select>
              </div>
            </div>
            <div className="form-actions">
              <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Annuler</button>
              <button className="btn btn-primary" onClick={save}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      <div className="card-grid stagger-children">
        {matieres.map(m => (
          <div key={m.id} className="card purple">
            <div className="card-header">
              <div>
                <div className="card-title">{m.nom} <span className="badge badge-primary" style={{marginLeft: 8}}>{m.code}</span></div>
                <div className="card-subtitle">Coefficient: {m.coefficient} • Ens. Principal: {getEnseignant(m.enseignant_id)}</div>
              </div>
              <div className="card-actions">
                <button className="btn-icon edit" onClick={() => edit(m)}>✏️</button>
                <button className="btn-icon delete" onClick={() => del(m.id)}>🗑️</button>
              </div>
            </div>
          </div>
        ))}
        {matieres.length === 0 && <div className="table-empty" style={{gridColumn:"1/-1",background:"var(--surface)",borderRadius:14,padding:40}}>Aucune matière créée</div>}
      </div>
    </div>
  );
}
