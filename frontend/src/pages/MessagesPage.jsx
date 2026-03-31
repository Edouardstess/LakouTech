import React, { useState, useEffect } from "react";
import { Message } from "../api/entities";

const tc = {"Parent-Ecole":"badge-primary","Notification":"badge-success","Circulaire":"badge-warning","Urgence":"badge-danger"};

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ expediteur:"",destinataire:"",sujet:"",contenu:"",type:"Notification",lu:false });
  const [selected, setSelected] = useState(null);

  useEffect(() => { Message.list().then(setMessages).catch(()=>{}); }, []);
  const set = (k,v) => setForm({...form,[k]:v});

  async function save() { await Message.create(form); setMessages(await Message.list()); setShowForm(false); setForm({expediteur:"",destinataire:"",sujet:"",contenu:"",type:"Notification",lu:false}); }
  async function markRead(id) { await Message.update(id,{lu:true}); setMessages(await Message.list()); }
  async function del(id) { if(window.confirm("Supprimer ?")){ await Message.delete(id); setMessages(messages.filter(m=>m.id!==id)); setSelected(null); } }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title"><span className="page-title-icon">✉️</span> Messagerie</h1>
        <button className="btn btn-pink" onClick={()=>setShowForm(true)}>+ Nouveau message</button>
      </div>
      {showForm && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowForm(false)}>
          <div className="modal-box">
            <h2>Nouveau message</h2>
            <div className="form-grid">
              {[["expediteur","Expéditeur"],["destinataire","Destinataire"],["sujet","Sujet"]].map(([k,l])=>(<div key={k}><label className="form-label">{l}</label><input className="form-input" value={form[k]} onChange={e=>set(k,e.target.value)} /></div>))}
              <div><label className="form-label">Type</label><select className="form-input" value={form.type} onChange={e=>set("type",e.target.value)}>{["Parent-Ecole","Notification","Circulaire","Urgence"].map(t=><option key={t}>{t}</option>)}</select></div>
              <div className="form-full"><label className="form-label">Message</label><textarea className="form-input" style={{height:100,resize:"vertical"}} value={form.contenu} onChange={e=>set("contenu",e.target.value)} /></div>
            </div>
            <div className="form-actions"><button className="btn btn-ghost" onClick={()=>setShowForm(false)}>Annuler</button><button className="btn btn-pink" onClick={save}>Envoyer</button></div>
          </div>
        </div>
      )}
      <div className="messages-layout">
        <div className="messages-list">
          {messages.map(m=>(
            <div key={m.id} className={`message-item ${selected?.id===m.id?"active":""} ${!m.lu?"unread":""}`} onClick={()=>{setSelected(m);if(!m.lu)markRead(m.id);}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{fontSize:13,fontWeight:m.lu?400:700,color:"var(--text-primary)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:200}}>{m.sujet||"(sans sujet)"}</div>
                {!m.lu&&<span style={{width:8,height:8,background:"var(--success)",borderRadius:"50%",flexShrink:0}} />}
              </div>
              <div style={{fontSize:12,color:"var(--text-muted)",marginTop:2}}>{m.expediteur}</div>
              <div style={{marginTop:4}}><span className={`badge ${tc[m.type]||"badge-gray"}`} style={{fontSize:11,padding:"2px 6px"}}>{m.type}</span></div>
            </div>
          ))}
          {messages.length===0&&<div className="table-empty">Aucun message</div>}
        </div>
        <div className="message-detail">
          {selected ? (
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
                <div><h2 style={{fontSize:18,fontWeight:700,marginBottom:4}}>{selected.sujet}</h2><div style={{fontSize:13,color:"var(--text-muted)"}}>De: {selected.expediteur} → {selected.destinataire}</div></div>
                <button className="btn-icon delete" onClick={()=>del(selected.id)}>🗑️</button>
              </div>
              <div style={{background:"var(--surface-hover)",borderRadius:"var(--radius)",padding:16,fontSize:14,color:"var(--text-secondary)",lineHeight:1.7}}>{selected.contenu}</div>
            </div>
          ) : <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:200,color:"var(--text-muted)",fontSize:14}}>Sélectionnez un message</div>}
        </div>
      </div>
    </div>
  );
}
