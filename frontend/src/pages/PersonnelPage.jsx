import React, { useState, useEffect } from "react";
import { Personnel } from "../api/entities";

const emptyForm = { nom:"",prenom:"",poste:"",departement:"",salaire:0,date_embauche:"",statut:"Actif",telephone:"",email:"" };
const sb = { Actif:"badge-success",Congé:"badge-warning",Suspendu:"badge-danger",Quitté:"badge-gray" };

export default function PersonnelPage() {
  const [personnel, setPersonnel] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  useEffect(() => { Personnel.list().then(setPersonnel).catch(()=>{}); }, []);
  const set = (k,v) => setForm({...form,[k]:v});
  const totalMasse = personnel.filter(p=>p.statut==="Actif").reduce((s,p)=>s+(p.salaire||0),0);

  async function save() { if(editId) await Personnel.update(editId,form); else await Personnel.create(form); setPersonnel(await Personnel.list()); setShowForm(false); setEditId(null); setForm(emptyForm); }
  async function del(id) { if(window.confirm("Supprimer ?")){ await Personnel.delete(id); setPersonnel(personnel.filter(p=>p.id!==id)); } }
  function edit(p) { setForm({nom:p.nom||"",prenom:p.prenom||"",poste:p.poste||"",departement:p.departement||"",salaire:p.salaire||0,date_embauche:p.date_embauche||"",statut:p.statut||"Actif",telephone:p.telephone||"",email:p.email||""}); setEditId(p.id); setShowForm(true); }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title"><span className="page-title-icon">👥</span> RH & Personnel</h1>
        <button className="btn btn-info" onClick={()=>{setShowForm(true);setEditId(null);setForm(emptyForm);}}>+ Nouveau membre</button>
      </div>
      <div className="summary-grid stagger-children">
        <div className="summary-card sky"><div className="summary-card-label">Personnel actif</div><div className="summary-card-value">{personnel.filter(p=>p.statut==="Actif").length}</div></div>
        <div className="summary-card purple"><div className="summary-card-label">Masse salariale</div><div className="summary-card-value">{totalMasse.toLocaleString()} HTG</div></div>
        <div className="summary-card amber"><div className="summary-card-label">En congé</div><div className="summary-card-value">{personnel.filter(p=>p.statut==="Congé").length}</div></div>
      </div>
      {showForm && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowForm(false)}>
          <div className="modal-box">
            <h2>{editId?"Modifier":"Nouveau"} membre du personnel</h2>
            <div className="form-grid">
              {[["nom","Nom"],["prenom","Prénom"],["poste","Poste"],["departement","Département"],["telephone","Téléphone"],["email","Email"]].map(([k,l])=>(<div key={k}><label className="form-label">{l}</label><input className="form-input" value={form[k]} onChange={e=>set(k,e.target.value)} /></div>))}
              <div><label className="form-label">Salaire (HTG)</label><input type="number" className="form-input" value={form.salaire} onChange={e=>set("salaire",+e.target.value)} /></div>
              <div><label className="form-label">Date embauche</label><input type="date" className="form-input" value={form.date_embauche} onChange={e=>set("date_embauche",e.target.value)} /></div>
              <div><label className="form-label">Statut</label><select className="form-input" value={form.statut} onChange={e=>set("statut",e.target.value)}>{["Actif","Congé","Suspendu","Quitté"].map(s=><option key={s}>{s}</option>)}</select></div>
            </div>
            <div className="form-actions"><button className="btn btn-ghost" onClick={()=>setShowForm(false)}>Annuler</button><button className="btn btn-info" onClick={save}>Enregistrer</button></div>
          </div>
        </div>
      )}
      <div className="table-container">
        <table>
          <thead><tr>{["Nom complet","Poste","Département","Salaire","Statut","Actions"].map(h=><th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {personnel.map(p=>(<tr key={p.id}><td><strong>{p.prenom} {p.nom}</strong></td><td>{p.poste||"—"}</td><td>{p.departement||"—"}</td><td>{(p.salaire||0).toLocaleString()} HTG</td><td><span className={`badge ${sb[p.statut]||"badge-gray"}`}>{p.statut}</span></td><td><button className="btn-icon edit" onClick={()=>edit(p)}>✏️</button><button className="btn-icon delete" onClick={()=>del(p.id)}>🗑️</button></td></tr>))}
            {personnel.length===0&&<tr><td colSpan={6} className="table-empty">Aucun membre du personnel</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
