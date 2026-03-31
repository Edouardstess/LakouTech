import React, { useState, useEffect } from "react";
import { EmploiTemps, Classe, Enseignant } from "../api/entities";

const jours = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];
const jourBadge = { Lundi:"badge-primary",Mardi:"badge-success",Mercredi:"badge-warning",Jeudi:"badge-danger",Vendredi:"badge-purple",Samedi:"badge-info" };

export default function EmploiTempsPage() {
  const [emplois, setEmplois] = useState([]);
  const [classes, setClasses] = useState([]);
  const [enseignants, setEnseignants] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ classe_id:"",enseignant_id:"",jour:"Lundi",heure_debut:"08:00",heure_fin:"09:00",salle:"" });
  const [filterClasse, setFilterClasse] = useState("");

  useEffect(() => { Promise.all([EmploiTemps.list(),Classe.list(),Enseignant.list()]).then(([e,c,en])=>{setEmplois(e);setClasses(c);setEnseignants(en);}).catch(()=>{}); }, []);
  const set = (k,v) => setForm({...form,[k]:v});
  const getClasse = id => classes.find(c=>c.id===id)?.nom || id;
  const getEns = id => { const e=enseignants.find(e=>e.id===id); return e?`${e.prenom} ${e.nom}`:id; };
  const filtered = filterClasse ? emplois.filter(e=>e.classe_id===filterClasse) : emplois;

  async function save() { await EmploiTemps.create(form); setEmplois(await EmploiTemps.list()); setShowForm(false); }
  async function del(id) { if(window.confirm("Supprimer ?")){ await EmploiTemps.delete(id); setEmplois(emplois.filter(e=>e.id!==id)); } }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title"><span className="page-title-icon">🗓️</span> Emplois du temps</h1>
        <button className="btn btn-info" onClick={()=>setShowForm(true)}>+ Ajouter un créneau</button>
      </div>
      <div style={{marginBottom:16,maxWidth:300}}><select className="form-input" value={filterClasse} onChange={e=>setFilterClasse(e.target.value)}><option value="">Toutes les classes</option>{classes.map(c=><option key={c.id} value={c.id}>{c.nom}</option>)}</select></div>
      {showForm && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowForm(false)}>
          <div className="modal-box">
            <h2>Nouveau créneau</h2>
            <div className="form-grid">
              <div><label className="form-label">Classe</label><select className="form-input" value={form.classe_id} onChange={e=>set("classe_id",e.target.value)}><option value="">— Choisir —</option>{classes.map(c=><option key={c.id} value={c.id}>{c.nom}</option>)}</select></div>
              <div><label className="form-label">Enseignant</label><select className="form-input" value={form.enseignant_id} onChange={e=>set("enseignant_id",e.target.value)}><option value="">— Choisir —</option>{enseignants.map(e=><option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>)}</select></div>
              <div><label className="form-label">Jour</label><select className="form-input" value={form.jour} onChange={e=>set("jour",e.target.value)}>{jours.map(j=><option key={j}>{j}</option>)}</select></div>
              <div><label className="form-label">Salle</label><input className="form-input" value={form.salle} onChange={e=>set("salle",e.target.value)} /></div>
              <div><label className="form-label">Heure début</label><input type="time" className="form-input" value={form.heure_debut} onChange={e=>set("heure_debut",e.target.value)} /></div>
              <div><label className="form-label">Heure fin</label><input type="time" className="form-input" value={form.heure_fin} onChange={e=>set("heure_fin",e.target.value)} /></div>
            </div>
            <div className="form-actions"><button className="btn btn-ghost" onClick={()=>setShowForm(false)}>Annuler</button><button className="btn btn-info" onClick={save}>Enregistrer</button></div>
          </div>
        </div>
      )}
      <div className="table-container">
        <table>
          <thead><tr>{["Jour","Classe","Enseignant","Horaire","Salle","Actions"].map(h=><th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map(e=>(<tr key={e.id}><td><span className={`badge ${jourBadge[e.jour]||"badge-gray"}`}>{e.jour}</span></td><td>{getClasse(e.classe_id)}</td><td>{getEns(e.enseignant_id)}</td><td>{e.heure_debut} – {e.heure_fin}</td><td>{e.salle||"—"}</td><td><button className="btn-icon delete" onClick={()=>del(e.id)}>🗑️</button></td></tr>))}
            {filtered.length===0&&<tr><td colSpan={6} className="table-empty">Aucun créneau</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
