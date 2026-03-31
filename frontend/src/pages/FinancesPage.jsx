import React, { useState, useEffect } from "react";
import { Depense, Paiement } from "../api/entities";

const catColors = { Salaires:"indigo",Fournitures:"green",Infrastructure:"amber",Services:"sky",Activités:"pink",Autre:"orange" };
const catBadge = { Salaires:"badge-primary",Fournitures:"badge-success",Infrastructure:"badge-warning",Services:"badge-info",Activités:"badge-pink",Autre:"badge-orange" };
const sb = {"Payée":"badge-success","En attente":"badge-warning","Annulée":"badge-danger"};

export default function FinancesPage() {
  const [depenses, setDepenses] = useState([]);
  const [paiements, setPaiements] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ libelle:"",montant:"",categorie:"Fournitures",date:new Date().toISOString().split("T")[0],statut:"En attente" });

  useEffect(() => { Promise.all([Depense.list(),Paiement.list()]).then(([d,p])=>{setDepenses(d);setPaiements(p);}).catch(()=>{}); }, []);
  const set = (k,v) => setForm({...form,[k]:v});

  const totalRevenu = paiements.filter(p=>p.statut==="Payé").reduce((s,p)=>s+(p.montant||0),0);
  const totalDepense = depenses.filter(d=>d.statut==="Payée").reduce((s,d)=>s+(d.montant||0),0);
  const solde = totalRevenu - totalDepense;
  const catStats = {};
  depenses.forEach(d => { catStats[d.categorie] = (catStats[d.categorie]||0) + (d.montant||0); });

  async function save() { await Depense.create({...form,montant:+form.montant}); setDepenses(await Depense.list()); setShowForm(false); }
  async function del(id) { if(window.confirm("Supprimer ?")){ await Depense.delete(id); setDepenses(depenses.filter(d=>d.id!==id)); } }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title"><span className="page-title-icon">📊</span> Comptabilité & Finances</h1>
        <button className="btn btn-orange" onClick={()=>setShowForm(true)}>+ Nouvelle dépense</button>
      </div>
      <div className="summary-grid stagger-children">
        <div className="summary-card green"><div className="summary-card-label">Total revenus</div><div className="summary-card-value">{totalRevenu.toLocaleString()} HTG</div></div>
        <div className="summary-card red"><div className="summary-card-label">Total dépenses</div><div className="summary-card-value">{totalDepense.toLocaleString()} HTG</div></div>
        <div className={`summary-card ${solde>=0?"indigo":"red"}`}><div className="summary-card-label">Solde</div><div className="summary-card-value">{solde.toLocaleString()} HTG</div></div>
      </div>
      {Object.keys(catStats).length > 0 && (
        <div className="summary-grid" style={{marginBottom:24}}>
          {Object.entries(catStats).map(([cat,total])=>(
            <div key={cat} className={`summary-card ${catColors[cat]||"orange"}`}>
              <div className="summary-card-label">{cat}</div>
              <div className="summary-card-value" style={{fontSize:20}}>{total.toLocaleString()} HTG</div>
            </div>
          ))}
        </div>
      )}
      {showForm && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowForm(false)}>
          <div className="modal-box">
            <h2>Nouvelle dépense</h2>
            <div className="form-grid">
              <div className="form-full"><label className="form-label">Libellé</label><input className="form-input" value={form.libelle} onChange={e=>set("libelle",e.target.value)} /></div>
              <div><label className="form-label">Montant (HTG)</label><input type="number" className="form-input" value={form.montant} onChange={e=>set("montant",e.target.value)} /></div>
              <div><label className="form-label">Catégorie</label><select className="form-input" value={form.categorie} onChange={e=>set("categorie",e.target.value)}>{["Salaires","Fournitures","Infrastructure","Services","Activités","Autre"].map(c=><option key={c}>{c}</option>)}</select></div>
              <div><label className="form-label">Date</label><input type="date" className="form-input" value={form.date} onChange={e=>set("date",e.target.value)} /></div>
              <div><label className="form-label">Statut</label><select className="form-input" value={form.statut} onChange={e=>set("statut",e.target.value)}>{["Payée","En attente","Annulée"].map(s=><option key={s}>{s}</option>)}</select></div>
            </div>
            <div className="form-actions"><button className="btn btn-ghost" onClick={()=>setShowForm(false)}>Annuler</button><button className="btn btn-orange" onClick={save}>Enregistrer</button></div>
          </div>
        </div>
      )}
      <div className="table-container">
        <table>
          <thead><tr>{["Libellé","Montant","Catégorie","Date","Statut","Actions"].map(h=><th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {depenses.map(d=>(<tr key={d.id}><td>{d.libelle}</td><td><strong>{(d.montant||0).toLocaleString()} HTG</strong></td><td><span className={`badge ${catBadge[d.categorie]||"badge-gray"}`}>{d.categorie}</span></td><td>{d.date}</td><td><span className={`badge ${sb[d.statut]||"badge-gray"}`}>{d.statut}</span></td><td><button className="btn-icon delete" onClick={()=>del(d.id)}>🗑️</button></td></tr>))}
            {depenses.length===0&&<tr><td colSpan={6} className="table-empty">Aucune dépense enregistrée</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
