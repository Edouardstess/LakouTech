import React, { useState, useEffect } from "react";
import { Presence, Eleve, Classe } from "../api/entities";

const sb = { Présent:"badge-success", Absent:"badge-danger", Retard:"badge-warning", Excusé:"badge-purple" };

export default function PresencesPage() {
  const [presences, setPresences] = useState([]);
  const [eleves, setEleves] = useState([]);
  const [classes, setClasses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ eleve_id:"", classe_id:"", date:new Date().toISOString().split("T")[0], statut:"Présent", motif:"" });
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split("T")[0]);
  const [filterClasse, setFilterClasse] = useState("");

  useEffect(() => { Promise.all([Presence.list(),Eleve.list(),Classe.list()]).then(([p,e,c])=>{setPresences(p);setEleves(e);setClasses(c);}).catch(()=>{}); }, []);
  const set = (k,v) => setForm({...form,[k]:v});
  const getEleve = id => { const e=eleves.find(e=>e.id===id); return e?`${e.prenom} ${e.nom}`:id; };
  const getClasse = id => { const c=classes.find(c=>c.id===id); return c?c.nom:id; };

  async function save() { await Presence.create(form); setPresences(await Presence.list()); setShowForm(false); }
  async function del(id) { if(window.confirm("Supprimer ?")){ await Presence.delete(id); setPresences(presences.filter(p=>p.id!==id)); } }

  const filtered = presences.filter(p => { if(filterDate&&p.date!==filterDate) return false; if(filterClasse&&p.classe_id!==filterClasse) return false; return true; });
  const stats = { Présent:filtered.filter(p=>p.statut==="Présent").length, Absent:filtered.filter(p=>p.statut==="Absent").length, Retard:filtered.filter(p=>p.statut==="Retard").length, Excusé:filtered.filter(p=>p.statut==="Excusé").length };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title"><span className="page-title-icon">📋</span> Gestion des Présences</h1>
        <button className="btn btn-danger" onClick={()=>setShowForm(true)}>+ Enregistrer présence</button>
      </div>
      <div className="summary-grid stagger-children">
        {Object.entries(stats).map(([s,v])=>(
          <div key={s} className={`summary-card ${s==="Présent"?"green":s==="Absent"?"red":s==="Retard"?"amber":"purple"}`}>
            <div className="summary-card-label">{s}</div>
            <div className="summary-card-value">{v}</div>
          </div>
        ))}
      </div>
      <div className="filter-bar">
        <div><label className="form-label">Filtrer par date</label><input type="date" className="form-input" value={filterDate} onChange={e=>setFilterDate(e.target.value)} /></div>
        <div><label className="form-label">Filtrer par classe</label><select className="form-input" value={filterClasse} onChange={e=>setFilterClasse(e.target.value)}><option value="">Toutes</option>{classes.map(c=><option key={c.id} value={c.id}>{c.nom}</option>)}</select></div>
      </div>
      {showForm && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowForm(false)}>
          <div className="modal-box">
            <h2>Enregistrer une présence</h2>
            <div className="form-grid">
              <div><label className="form-label">Élève</label><select className="form-input" value={form.eleve_id} onChange={e=>set("eleve_id",e.target.value)}><option value="">— Choisir —</option>{eleves.map(e=><option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>)}</select></div>
              <div><label className="form-label">Classe</label><select className="form-input" value={form.classe_id} onChange={e=>set("classe_id",e.target.value)}><option value="">— Choisir —</option>{classes.map(c=><option key={c.id} value={c.id}>{c.nom}</option>)}</select></div>
              <div><label className="form-label">Date</label><input type="date" className="form-input" value={form.date} onChange={e=>set("date",e.target.value)} /></div>
              <div><label className="form-label">Statut</label><select className="form-input" value={form.statut} onChange={e=>set("statut",e.target.value)}>{["Présent","Absent","Retard","Excusé"].map(s=><option key={s}>{s}</option>)}</select></div>
              <div className="form-full"><label className="form-label">Motif</label><input className="form-input" value={form.motif} onChange={e=>set("motif",e.target.value)} placeholder="Raison de l'absence..." /></div>
            </div>
            <div className="form-actions"><button className="btn btn-ghost" onClick={()=>setShowForm(false)}>Annuler</button><button className="btn btn-danger" onClick={save}>Enregistrer</button></div>
          </div>
        </div>
      )}
      <div className="table-container">
        <table>
          <thead><tr>{["Date","Élève","Classe","Statut","Motif","Actions"].map(h=><th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map(p=>(<tr key={p.id}><td>{p.date}</td><td>{getEleve(p.eleve_id)}</td><td>{getClasse(p.classe_id)}</td><td><span className={`badge ${sb[p.statut]||"badge-gray"}`}>{p.statut}</span></td><td>{p.motif||"—"}</td><td><button className="btn-icon delete" onClick={()=>del(p.id)}>🗑️</button></td></tr>))}
            {filtered.length===0&&<tr><td colSpan={6} className="table-empty">Aucune présence enregistrée</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
