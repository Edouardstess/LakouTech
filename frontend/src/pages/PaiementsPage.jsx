import React, { useState, useEffect } from "react";
import { Paiement, Eleve } from "../api/entities";

const sb = {"Payé":"badge-success","En attente":"badge-warning","Partiel":"badge-info","Annulé":"badge-danger"};

export default function PaiementsPage() {
  const [paiements, setPaiements] = useState([]);
  const [eleves, setEleves] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ eleve_id:"",montant:"",type_paiement:"Scolarité",statut:"En attente",date_paiement:new Date().toISOString().split("T")[0],methode:"Espèces",reference:"",trimestre:"T1" });

  useEffect(() => { Promise.all([Paiement.list(),Eleve.list()]).then(([p,e])=>{setPaiements(p);setEleves(e);}).catch(()=>{}); }, []);
  const set = (k,v) => setForm({...form,[k]:v});
  const getEleve = id => { const e=eleves.find(e=>e.id===id); return e?`${e.prenom} ${e.nom}`:id; };
  const totalPaye = paiements.filter(p=>p.statut==="Payé").reduce((s,p)=>s+(p.montant||0),0);
  const totalAttente = paiements.filter(p=>p.statut==="En attente").reduce((s,p)=>s+(p.montant||0),0);

  async function save() { await Paiement.create({...form,montant:+form.montant}); setPaiements(await Paiement.list()); setShowForm(false); }
  async function del(id) { if(window.confirm("Supprimer ?")){ await Paiement.delete(id); setPaiements(paiements.filter(p=>p.id!==id)); } }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title"><span className="page-title-icon">💰</span> Paiements & Frais</h1>
        <button className="btn btn-success" onClick={()=>setShowForm(true)}>+ Enregistrer paiement</button>
      </div>
      <div className="summary-grid stagger-children">
        <div className="summary-card green"><div className="summary-card-label">Total encaissé</div><div className="summary-card-value">{totalPaye.toLocaleString()} HTG</div></div>
        <div className="summary-card amber"><div className="summary-card-label">En attente</div><div className="summary-card-value">{totalAttente.toLocaleString()} HTG</div></div>
        <div className="summary-card indigo"><div className="summary-card-label">Total transactions</div><div className="summary-card-value">{paiements.length}</div></div>
      </div>
      {showForm && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowForm(false)}>
          <div className="modal-box">
            <h2>Enregistrer un paiement</h2>
            <div className="form-grid">
              <div><label className="form-label">Élève</label><select className="form-input" value={form.eleve_id} onChange={e=>set("eleve_id",e.target.value)}><option value="">— Choisir —</option>{eleves.map(e=><option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>)}</select></div>
              <div><label className="form-label">Montant (HTG)</label><input type="number" className="form-input" value={form.montant} onChange={e=>set("montant",e.target.value)} /></div>
              <div><label className="form-label">Type</label><select className="form-input" value={form.type_paiement} onChange={e=>set("type_paiement",e.target.value)}>{["Inscription","Scolarité","Transport","Cantine","Activités","Autre"].map(t=><option key={t}>{t}</option>)}</select></div>
              <div><label className="form-label">Méthode</label><select className="form-input" value={form.methode} onChange={e=>set("methode",e.target.value)}>{["Espèces","Virement","Mobile Money","Carte","Chèque"].map(m=><option key={m}>{m}</option>)}</select></div>
              <div><label className="form-label">Statut</label><select className="form-input" value={form.statut} onChange={e=>set("statut",e.target.value)}>{["Payé","En attente","Partiel","Annulé"].map(s=><option key={s}>{s}</option>)}</select></div>
              <div><label className="form-label">Trimestre</label><select className="form-input" value={form.trimestre} onChange={e=>set("trimestre",e.target.value)}>{["T1","T2","T3"].map(t=><option key={t}>{t}</option>)}</select></div>
              <div><label className="form-label">Date paiement</label><input type="date" className="form-input" value={form.date_paiement} onChange={e=>set("date_paiement",e.target.value)} /></div>
              <div><label className="form-label">Référence</label><input className="form-input" value={form.reference} onChange={e=>set("reference",e.target.value)} /></div>
            </div>
            <div className="form-actions"><button className="btn btn-ghost" onClick={()=>setShowForm(false)}>Annuler</button><button className="btn btn-success" onClick={save}>Enregistrer</button></div>
          </div>
        </div>
      )}
      <div className="table-container">
        <table>
          <thead><tr>{["Élève","Montant","Type","Méthode","Trimestre","Statut","Date","Actions"].map(h=><th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {paiements.map(p=>(<tr key={p.id}><td>{getEleve(p.eleve_id)}</td><td><strong>{(p.montant||0).toLocaleString()} HTG</strong></td><td>{p.type_paiement}</td><td>{p.methode}</td><td>{p.trimestre}</td><td><span className={`badge ${sb[p.statut]||"badge-gray"}`}>{p.statut}</span></td><td>{p.date_paiement}</td><td><button className="btn-icon delete" onClick={()=>del(p.id)}>🗑️</button></td></tr>))}
            {paiements.length===0&&<tr><td colSpan={8} className="table-empty">Aucun paiement</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
