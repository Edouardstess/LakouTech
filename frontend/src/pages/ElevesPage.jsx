import React, { useState, useEffect } from "react";
import { Eleve } from "../api/entities";

const emptyForm = { nom: "", prenom: "", date_naissance: "", sexe: "M", adresse: "", telephone: "", email: "", nom_parent: "", tel_parent: "", numero_matricule: "", statut: "Actif" };
const statusBadge = { Actif: "badge-success", Inactif: "badge-danger", Transféré: "badge-warning", "Diplômé": "badge-purple" };

export default function ElevesPage() {
  const [eleves, setEleves] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => { Eleve.list().then(setEleves).catch(() => {}); }, []);

  const set = (k, v) => setForm({ ...form, [k]: v });

  async function save() {
    if (editId) await Eleve.update(editId, form); else await Eleve.create(form);
    setEleves(await Eleve.list()); setShowForm(false); setEditId(null); setForm(emptyForm);
  }
  async function del(id) { if (window.confirm("Supprimer cet élève ?")) { await Eleve.delete(id); setEleves(eleves.filter(e => e.id !== id)); } }
  function edit(e) { setForm({ nom: e.nom||"", prenom: e.prenom||"", date_naissance: e.date_naissance||"", sexe: e.sexe||"M", adresse: e.adresse||"", telephone: e.telephone||"", email: e.email||"", nom_parent: e.nom_parent||"", tel_parent: e.tel_parent||"", numero_matricule: e.numero_matricule||"", statut: e.statut||"Actif" }); setEditId(e.id); setShowForm(true); }

  const filtered = eleves.filter(e => `${e.nom} ${e.prenom} ${e.numero_matricule}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title"><span className="page-title-icon">👨‍🎓</span> Gestion des Élèves</h1>
        <button className="btn btn-primary" onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); }}>+ Nouvel élève</button>
      </div>

      <div className="search-wrapper">
        <input className="search-input" placeholder="Rechercher un élève..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal-box">
            <h2>{editId ? "Modifier" : "Nouvel"} élève</h2>
            <div className="form-grid">
              {[["nom","Nom"],["prenom","Prénom"],["date_naissance","Date naissance","date"],["telephone","Téléphone"],["email","Email"],["numero_matricule","Matricule"],["nom_parent","Nom parent"],["tel_parent","Tél. parent"],["adresse","Adresse"]].map(([k,l,t]) => (
                <div key={k}><label className="form-label">{l}</label><input type={t||"text"} className="form-input" value={form[k]} onChange={e => set(k, e.target.value)} /></div>
              ))}
              <div><label className="form-label">Sexe</label><select className="form-input" value={form.sexe} onChange={e => set("sexe", e.target.value)}><option value="M">Masculin</option><option value="F">Féminin</option></select></div>
              <div><label className="form-label">Statut</label><select className="form-input" value={form.statut} onChange={e => set("statut", e.target.value)}>{["Actif","Inactif","Transféré","Diplômé"].map(s => <option key={s}>{s}</option>)}</select></div>
            </div>
            <div className="form-actions">
              <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Annuler</button>
              <button className="btn btn-primary" onClick={save}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      <div className="table-container">
        <table>
          <thead><tr>{["Matricule","Nom complet","Sexe","Téléphone","Parent","Statut","Actions"].map(h => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map(e => (
              <tr key={e.id}>
                <td><span className="badge badge-primary">{e.numero_matricule || "—"}</span></td>
                <td><strong>{e.prenom} {e.nom}</strong></td>
                <td>{e.sexe === "M" ? "♂ Masculin" : "♀ Féminin"}</td>
                <td>{e.telephone || "—"}</td>
                <td>{e.nom_parent || "—"}</td>
                <td><span className={`badge ${statusBadge[e.statut] || "badge-gray"}`}>{e.statut}</span></td>
                <td>
                  <button className="btn-icon edit" onClick={() => edit(e)}>✏️</button>
                  <button className="btn-icon delete" onClick={() => del(e.id)}>🗑️</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={7} className="table-empty">Aucun élève trouvé</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
