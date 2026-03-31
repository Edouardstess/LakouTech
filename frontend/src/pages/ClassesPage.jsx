import React, { useState, useEffect } from "react";
import { Classe } from "../api/entities";

const emptyForm = { nom: "", niveau: "", capacite: 30, annee_scolaire: "2025-2026", salle: "" };

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  useEffect(() => { Classe.list().then(setClasses).catch(() => {}); }, []);
  const set = (k, v) => setForm({ ...form, [k]: v });

  async function save() {
    if (editId) await Classe.update(editId, form); else await Classe.create(form);
    setClasses(await Classe.list()); setShowForm(false); setEditId(null); setForm(emptyForm);
  }
  async function del(id) { if (window.confirm("Supprimer ?")) { await Classe.delete(id); setClasses(classes.filter(c => c.id !== id)); } }
  function edit(c) { setForm({ nom: c.nom||"", niveau: c.niveau||"", capacite: c.capacite||30, annee_scolaire: c.annee_scolaire||"", salle: c.salle||"" }); setEditId(c.id); setShowForm(true); }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title"><span className="page-title-icon">🏫</span> Gestion des Classes</h1>
        <button className="btn btn-success" onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); }}>+ Nouvelle classe</button>
      </div>
      {showForm && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal-box">
            <h2>{editId ? "Modifier" : "Nouvelle"} classe</h2>
            <div className="form-grid">
              {[["nom","Nom de la classe"],["niveau","Niveau"],["salle","Salle"],["annee_scolaire","Année scolaire"]].map(([k,l]) => (
                <div key={k}><label className="form-label">{l}</label><input className="form-input" value={form[k]} onChange={e => set(k, e.target.value)} /></div>
              ))}
              <div><label className="form-label">Capacité</label><input type="number" className="form-input" value={form.capacite} onChange={e => set("capacite", +e.target.value)} /></div>
            </div>
            <div className="form-actions">
              <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Annuler</button>
              <button className="btn btn-success" onClick={save}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}
      <div className="card-grid stagger-children">
        {classes.map(c => (
          <div key={c.id} className="card green">
            <div className="card-header">
              <div>
                <div className="card-title">{c.nom}</div>
                <div className="card-subtitle">Niveau: {c.niveau} • Salle: {c.salle || "—"} • Cap: {c.capacite}</div>
                <div style={{fontSize:12,color:"var(--text-muted)",marginTop:6}}>{c.annee_scolaire}</div>
              </div>
              <div className="card-actions">
                <button className="btn-icon edit" onClick={() => edit(c)}>✏️</button>
                <button className="btn-icon delete" onClick={() => del(c.id)}>🗑️</button>
              </div>
            </div>
          </div>
        ))}
        {classes.length === 0 && <div className="table-empty" style={{gridColumn:"1/-1",background:"var(--surface)",borderRadius:14,padding:40}}>Aucune classe créée</div>}
      </div>
    </div>
  );
}
