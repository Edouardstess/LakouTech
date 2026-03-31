import React, { useState, useEffect } from "react";
import { Enseignant } from "../api/entities";

const emptyForm = { nom: "", prenom: "", email: "", telephone: "", specialite: "", date_embauche: "", salaire: 0, statut: "Actif" };
const sb = { Actif: "badge-success", Congé: "badge-warning", Inactif: "badge-danger" };

export default function EnseignantsPage() {
  const [list, setList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  useEffect(() => { Enseignant.list().then(setList).catch(() => {}); }, []);
  const set = (k, v) => setForm({ ...form, [k]: v });

  async function save() {
    if (editId) await Enseignant.update(editId, form); else await Enseignant.create(form);
    setList(await Enseignant.list()); setShowForm(false); setEditId(null); setForm(emptyForm);
  }
  async function del(id) { if (window.confirm("Supprimer ?")) { await Enseignant.delete(id); setList(list.filter(e => e.id !== id)); } }
  function edit(e) { setForm({ nom:e.nom||"",prenom:e.prenom||"",email:e.email||"",telephone:e.telephone||"",specialite:e.specialite||"",date_embauche:e.date_embauche||"",salaire:e.salaire||0,statut:e.statut||"Actif" }); setEditId(e.id); setShowForm(true); }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title"><span className="page-title-icon">👨‍🏫</span> Gestion des Enseignants</h1>
        <button className="btn btn-warning" onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); }}>+ Nouvel enseignant</button>
      </div>
      {showForm && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal-box">
            <h2>{editId ? "Modifier" : "Nouvel"} enseignant</h2>
            <div className="form-grid">
              {[["nom","Nom"],["prenom","Prénom"],["email","Email"],["telephone","Téléphone"],["specialite","Spécialité"]].map(([k,l]) => (
                <div key={k}><label className="form-label">{l}</label><input className="form-input" value={form[k]} onChange={e => set(k,e.target.value)} /></div>
              ))}
              <div><label className="form-label">Date embauche</label><input type="date" className="form-input" value={form.date_embauche} onChange={e => set("date_embauche",e.target.value)} /></div>
              <div><label className="form-label">Salaire (HTG)</label><input type="number" className="form-input" value={form.salaire} onChange={e => set("salaire",+e.target.value)} /></div>
              <div><label className="form-label">Statut</label><select className="form-input" value={form.statut} onChange={e => set("statut",e.target.value)}>{["Actif","Congé","Inactif"].map(s=><option key={s}>{s}</option>)}</select></div>
            </div>
            <div className="form-actions">
              <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Annuler</button>
              <button className="btn btn-warning" onClick={save}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}
      <div className="table-container">
        <table>
          <thead><tr>{["Nom complet","Email","Spécialité","Salaire","Statut","Actions"].map(h=><th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {list.map(e => (
              <tr key={e.id}>
                <td><strong>{e.prenom} {e.nom}</strong></td>
                <td>{e.email||"—"}</td>
                <td>{e.specialite||"—"}</td>
                <td>{(e.salaire||0).toLocaleString()} HTG</td>
                <td><span className={`badge ${sb[e.statut]||"badge-gray"}`}>{e.statut}</span></td>
                <td>
                  <button className="btn-icon edit" onClick={() => edit(e)}>✏️</button>
                  <button className="btn-icon delete" onClick={() => del(e.id)}>🗑️</button>
                </td>
              </tr>
            ))}
            {list.length===0 && <tr><td colSpan={6} className="table-empty">Aucun enseignant</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
