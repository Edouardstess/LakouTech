import React, { useState, useEffect } from "react";
import { Note, Eleve, Matiere } from "../api/entities";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [eleves, setEleves] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ eleve_id:"", matiere_id:"", valeur:"", type_note:"Devoir", trimestre:"T1", date_evaluation:new Date().toISOString().split("T")[0], commentaire:"" });

  useEffect(() => { Promise.all([Note.list(),Eleve.list(),Matiere.list()]).then(([n,e,m])=>{setNotes(n.data||n);setEleves(e.data||e);setMatieres(m.data||m);}).catch(()=>{}); }, []);
  const set = (k,v) => setForm({...form,[k]:v});
  const getEleve = id => { const e=eleves.find(e=>e.id===id); return e?`${e.prenom} ${e.nom}`:"—"; };
  const getMatiere = id => { const m=matieres.find(m=>m.id===id); return m?m.nom:"—"; };
  const noteClass = v => v>=14?"badge-success":v>=10?"badge-warning":"badge-danger";

  async function save() { await Note.create({...form,valeur:+form.valeur}); setNotes(await Note.list()); setShowForm(false); }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title"><span className="page-title-icon">📝</span> Notes & Bulletins</h1>
        <button className="btn btn-purple" onClick={()=>setShowForm(true)}>+ Saisir une note</button>
      </div>
      {showForm && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowForm(false)}>
          <div className="modal-box">
            <h2>Saisir une note</h2>
            <div className="form-grid">
              <div><label className="form-label">Élève</label><select className="form-input" value={form.eleve_id} onChange={e=>set("eleve_id",e.target.value)}><option value="">— Choisir —</option>{eleves.map(e=><option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>)}</select></div>
              <div><label className="form-label">Matière</label><select className="form-input" value={form.matiere_id} onChange={e=>set("matiere_id",e.target.value)}><option value="">— Choisir —</option>{matieres.map(m=><option key={m.id} value={m.id}>{m.nom}</option>)}</select></div>
              <div><label className="form-label">Note (/20)</label><input type="number" min="0" max="20" step="0.5" className="form-input" value={form.valeur} onChange={e=>set("valeur",e.target.value)} /></div>
              <div><label className="form-label">Type</label><select className="form-input" value={form.type_note} onChange={e=>set("type_note",e.target.value)}>{["Devoir","Interrogation","Examen","TP","Oral"].map(t=><option key={t}>{t}</option>)}</select></div>
              <div><label className="form-label">Trimestre</label><select className="form-input" value={form.trimestre} onChange={e=>set("trimestre",e.target.value)}>{["T1","T2","T3"].map(t=><option key={t}>{t}</option>)}</select></div>
              <div><label className="form-label">Date</label><input type="date" className="form-input" value={form.date_evaluation} onChange={e=>set("date_evaluation",e.target.value)} /></div>
              <div className="form-full"><label className="form-label">Commentaire</label><input className="form-input" value={form.commentaire} onChange={e=>set("commentaire",e.target.value)} /></div>
            </div>
            <div className="form-actions"><button className="btn btn-ghost" onClick={()=>setShowForm(false)}>Annuler</button><button className="btn btn-purple" onClick={save}>Enregistrer</button></div>
          </div>
        </div>
      )}
      <div className="table-container">
        <table>
          <thead><tr>{["Élève","Matière","Note","Type","Trimestre","Date","Commentaire"].map(h=><th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {notes.map(n=>(<tr key={n.id}><td>{getEleve(n.eleve_id)}</td><td>{getMatiere(n.matiere_id)}</td><td><span className={`badge ${noteClass(n.valeur)}`} style={{fontWeight:700}}>{n.valeur}/20</span></td><td>{n.type_note}</td><td>{n.trimestre}</td><td>{n.date_evaluation}</td><td>{n.commentaire||"—"}</td></tr>))}
            {notes.length===0&&<tr><td colSpan={7} className="table-empty">Aucune note saisie</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
