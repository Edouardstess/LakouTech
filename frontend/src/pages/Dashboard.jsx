import { Eleve, Enseignant, Classe, Paiement, Presence, Personnel, Message, Depense, Auth } from "../api/entities";

export default function Dashboard() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('edumanager_user')));
  const [stats, setStats] = useState({ eleves: 0, enseignants: 0, classes: 0, paiements: 0, absences: 0, personnel: 0, messages: 0, depenses: 0 });
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");

  useEffect(() => {
    if (user) loadStats();
  }, [user]);

  if (!user) {
    return <LoginPage onLogin={(userData) => setUser(userData)} />;
  }

  async function loadStats() {
    try {
      const [eleves, enseignants, classes, paiements, presences, personnel, messages, depenses] = await Promise.all([
        Eleve.list(), Enseignant.list(), Classe.list(), Paiement.list(),
        Presence.filter({ statut: "Absent" }), Personnel.list(), Message.list(), Depense.list()
      ]);
      const totalDepenses = depenses.reduce((s, d) => s + (d.montant || 0), 0);
      const totalPaie = paiements.filter(p => p.statut === "Payé").reduce((s, p) => s + (p.montant || 0), 0);
      setStats({
        eleves: eleves.length, enseignants: enseignants.length, classes: classes.length,
        paiements: totalPaie, absences: presences.length, personnel: personnel.length,
        messages: messages.filter(m => !m.lu).length, depenses: totalDepenses
      });
    } catch (e) {}
    setLoading(false);
  }

  const pages = [
    { id: "dashboard", label: "Tableau de bord", icon: "🏠" },
    { id: "eleves", label: "Élèves", icon: "👨‍🎓" },
    { id: "classes", label: "Classes", icon: "🏫" },
    { id: "enseignants", label: "Enseignants", icon: "👨‍🏫" },
    { id: "presences", label: "Présences", icon: "📋" },
    { id: "notes", label: "Notes & Bulletins", icon: "📝" },
    { id: "emploiTemps", label: "Emplois du temps", icon: "🗓️" },
    { id: "paiements", label: "Paiements", icon: "💰" },
    { id: "personnel", label: "RH & Paie", icon: "👥" },
    { id: "messages", label: "Messages", icon: "✉️" },
    { id: "finances", label: "Finances", icon: "📊" },
  ];

  const cardData = [
    { label: "Élèves inscrits", value: stats.eleves, icon: "👨‍🎓", color: "#4F46E5" },
    { label: "Enseignants", value: stats.enseignants, icon: "👨‍🏫", color: "#059669" },
    { label: "Classes", value: stats.classes, icon: "🏫", color: "#D97706" },
    { label: "Revenus (HTG)", value: stats.paiements.toLocaleString(), icon: "💰", color: "#7C3AED" },
    { label: "Absences aujourd'hui", value: stats.absences, icon: "📋", color: "#DC2626" },
    { label: "Personnel", value: stats.personnel, icon: "👥", color: "#0284C7" },
    { label: "Messages non lus", value: stats.messages, icon: "✉️", color: "#DB2777" },
    { label: "Dépenses (HTG)", value: stats.depenses.toLocaleString(), icon: "📊", color: "#EA580C" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif", background: "#F1F5F9" }}>
      {/* Sidebar */}
      <div style={{ width: 260, background: "linear-gradient(180deg, #1E3A5F 0%, #0F2440 100%)", color: "white", display: "flex", flexDirection: "column", position: "fixed", height: "100vh", overflowY: "auto", zIndex: 100 }}>
        <div style={{ padding: "24px 20px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ fontSize: 22, fontWeight: 700 }}>🏫 EduManager</div>
          <div style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>Gestion Scolaire Pro</div>
        </div>
        <nav style={{ padding: "12px 0", flex: 1 }}>
          {pages.map(p => (
            <button key={p.id} onClick={() => setActivePage(p.id)}
              style={{ width: "100%", textAlign: "left", padding: "11px 20px", background: activePage === p.id ? "rgba(255,255,255,0.15)" : "transparent", border: "none", color: "white", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, fontSize: 14, borderLeft: activePage === p.id ? "3px solid #60A5FA" : "3px solid transparent", transition: "all 0.2s" }}>
              <span>{p.icon}</span> {p.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#4F46E5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700 }}>{user?.nom?.charAt(0).toUpperCase()}</div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.nom}</div>
              <div style={{ fontSize: 11, opacity: 0.5 }}>{user?.role}</div>
            </div>
          </div>
          <button onClick={() => { Auth.logout(); setUser(null); }} 
            style={{ width: "100%", padding: "8px", background: "rgba(220,38,38,0.2)", border: "1px solid rgba(220,38,38,0.4)", borderRadius: 6, color: "#FCA5A5", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
            Déconnexion
          </button>
        </div>
        <div style={{ padding: "12px 20px", fontSize: 11, opacity: 0.3 }}>
          © 2025 EduManager v1.1
        </div>
      </div>

      {/* Main */}
      <div style={{ marginLeft: 260, flex: 1, padding: 32 }}>
        {activePage === "dashboard" && (
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1E293B", marginBottom: 8 }}>Tableau de bord</h1>
            <p style={{ color: "#64748B", marginBottom: 28 }}>Bienvenue sur EduManager — Vue d'ensemble de votre établissement</p>
            {loading ? <div style={{ textAlign: "center", padding: 60, color: "#64748B" }}>Chargement...</div> : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20, marginBottom: 32 }}>
                {cardData.map((c, i) => (
                  <div key={i} style={{ background: "white", borderRadius: 12, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", borderTop: `4px solid ${c.color}` }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{c.icon}</div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: c.color }}>{c.value}</div>
                    <div style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>{c.label}</div>
                  </div>
                ))}
              </div>
            )}
            <div style={{ background: "white", borderRadius: 12, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: "#1E293B", marginBottom: 16 }}>Navigation rapide</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
                {pages.slice(1).map(p => (
                  <button key={p.id} onClick={() => setActivePage(p.id)}
                    style={{ padding: "14px 10px", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 8, cursor: "pointer", fontSize: 13, color: "#374151", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, transition: "all 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#EFF6FF"}
                    onMouseLeave={e => e.currentTarget.style.background = "#F8FAFC"}>
                    <span style={{ fontSize: 24 }}>{p.icon}</span>
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activePage === "eleves" && <ElevesPage />}
        {activePage === "classes" && <ClassesPage />}
        {activePage === "enseignants" && <EnseignantsPage />}
        {activePage === "presences" && <PresencesPage />}
        {activePage === "notes" && <NotesPage />}
        {activePage === "emploiTemps" && <EmploiTempsPage />}
        {activePage === "paiements" && <PaiementsPage />}
        {activePage === "personnel" && <PersonnelPage />}
        {activePage === "messages" && <MessagesPage />}
        {activePage === "finances" && <FinancesPage />}
      </div>
    </div>
  );
}

// ===== ÉLÈVES =====
function ElevesPage() {
  const [eleves, setEleves] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nom: "", prenom: "", date_naissance: "", sexe: "M", adresse: "", telephone: "", email: "", nom_parent: "", tel_parent: "", numero_matricule: "", statut: "Actif" });
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => { Eleve.list().then(setEleves); }, []);

  async function save() {
    if (editId) { await Eleve.update(editId, form); } else { await Eleve.create(form); }
    const updated = await Eleve.list(); setEleves(updated);
    setShowForm(false); setEditId(null);
    setForm({ nom: "", prenom: "", date_naissance: "", sexe: "M", adresse: "", telephone: "", email: "", nom_parent: "", tel_parent: "", numero_matricule: "", statut: "Actif" });
  }

  async function del(id) { if (confirm("Supprimer cet élève ?")) { await Eleve.delete(id); setEleves(eleves.filter(e => e.id !== id)); } }

  function edit(e) { setForm({ nom: e.nom||"", prenom: e.prenom||"", date_naissance: e.date_naissance||"", sexe: e.sexe||"M", adresse: e.adresse||"", telephone: e.telephone||"", email: e.email||"", nom_parent: e.nom_parent||"", tel_parent: e.tel_parent||"", numero_matricule: e.numero_matricule||"", statut: e.statut||"Actif" }); setEditId(e.id); setShowForm(true); }

  const filtered = eleves.filter(e => `${e.nom} ${e.prenom} ${e.numero_matricule}`.toLowerCase().includes(search.toLowerCase()));
  const statusColor = { Actif: "#059669", Inactif: "#DC2626", Transféré: "#D97706", Diplômé: "#7C3AED" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1E293B" }}>👨‍🎓 Gestion des Élèves</h1>
        <button onClick={() => { setShowForm(true); setEditId(null); }} style={btnStyle("#4F46E5")}>+ Nouvel élève</button>
      </div>
      <input placeholder="Rechercher un élève..." value={search} onChange={e => setSearch(e.target.value)}
        style={{ width: "100%", padding: "10px 16px", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 14, marginBottom: 20, boxSizing: "border-box" }} />

      {showForm && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h2 style={{ marginBottom: 20, fontSize: 18, fontWeight: 700 }}>{editId ? "Modifier" : "Nouvel"} élève</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[["nom", "Nom"], ["prenom", "Prénom"], ["date_naissance", "Date naissance", "date"], ["telephone", "Téléphone"], ["email", "Email"], ["numero_matricule", "Matricule"], ["nom_parent", "Nom parent"], ["tel_parent", "Tél. parent"], ["adresse", "Adresse"]].map(([k, l, t]) => (
                <div key={k}>
                  <label style={labelStyle}>{l}</label>
                  <input type={t || "text"} value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} style={inputStyle} />
                </div>
              ))}
              <div>
                <label style={labelStyle}>Sexe</label>
                <select value={form.sexe} onChange={e => setForm({ ...form, sexe: e.target.value })} style={inputStyle}>
                  <option value="M">Masculin</option><option value="F">Féminin</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Statut</label>
                <select value={form.statut} onChange={e => setForm({ ...form, statut: e.target.value })} style={inputStyle}>
                  {["Actif", "Inactif", "Transféré", "Diplômé"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
              <button onClick={() => setShowForm(false)} style={btnStyle("#64748B")}>Annuler</button>
              <button onClick={save} style={btnStyle("#4F46E5")}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F8FAFC" }}>
              {["Matricule", "Nom complet", "Sexe", "Téléphone", "Parent", "Statut", "Actions"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748B", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((e, i) => (
              <tr key={e.id} style={{ borderTop: "1px solid #F1F5F9", background: i % 2 === 0 ? "white" : "#FAFAFA" }}>
                <td style={tdStyle}><span style={{ background: "#EEF2FF", color: "#4F46E5", padding: "2px 8px", borderRadius: 4, fontSize: 12 }}>{e.numero_matricule || "—"}</span></td>
                <td style={tdStyle}><strong>{e.prenom} {e.nom}</strong></td>
                <td style={tdStyle}>{e.sexe === "M" ? "♂ Masculin" : "♀ Féminin"}</td>
                <td style={tdStyle}>{e.telephone || "—"}</td>
                <td style={tdStyle}>{e.nom_parent || "—"}</td>
                <td style={tdStyle}><span style={{ background: `${statusColor[e.statut]}20`, color: statusColor[e.statut], padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{e.statut}</span></td>
                <td style={tdStyle}>
                  <button onClick={() => edit(e)} style={{ ...smallBtn, background: "#EFF6FF", color: "#3B82F6" }}>✏️</button>
                  <button onClick={() => del(e.id)} style={{ ...smallBtn, background: "#FEF2F2", color: "#EF4444" }}>🗑️</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={7} style={{ padding: 32, textAlign: "center", color: "#94A3B8" }}>Aucun élève trouvé</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ===== CLASSES =====
function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nom: "", niveau: "", capacite: 30, annee_scolaire: "2024-2025", salle: "" });
  const [editId, setEditId] = useState(null);

  useEffect(() => { Classe.list().then(setClasses); }, []);

  async function save() {
    if (editId) { await Classe.update(editId, form); } else { await Classe.create(form); }
    setClasses(await Classe.list()); setShowForm(false); setEditId(null);
    setForm({ nom: "", niveau: "", capacite: 30, annee_scolaire: "2024-2025", salle: "" });
  }
  async function del(id) { if (confirm("Supprimer ?")) { await Classe.delete(id); setClasses(classes.filter(c => c.id !== id)); } }
  function edit(c) { setForm({ nom: c.nom||"", niveau: c.niveau||"", capacite: c.capacite||30, annee_scolaire: c.annee_scolaire||"", salle: c.salle||"" }); setEditId(c.id); setShowForm(true); }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1E293B" }}>🏫 Gestion des Classes</h1>
        <button onClick={() => setShowForm(true)} style={btnStyle("#059669")}>+ Nouvelle classe</button>
      </div>
      {showForm && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h2 style={{ marginBottom: 20 }}>{editId ? "Modifier" : "Nouvelle"} classe</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[["nom", "Nom de la classe"], ["niveau", "Niveau"], ["salle", "Salle"], ["annee_scolaire", "Année scolaire"]].map(([k, l]) => (
                <div key={k}><label style={labelStyle}>{l}</label><input value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} style={inputStyle} /></div>
              ))}
              <div><label style={labelStyle}>Capacité</label><input type="number" value={form.capacite} onChange={e => setForm({ ...form, capacite: +e.target.value })} style={inputStyle} /></div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
              <button onClick={() => setShowForm(false)} style={btnStyle("#64748B")}>Annuler</button>
              <button onClick={save} style={btnStyle("#059669")}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {classes.map(c => (
          <div key={c.id} style={{ background: "white", borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", borderTop: "4px solid #059669" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#1E293B" }}>{c.nom}</div>
                <div style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>Niveau: {c.niveau}</div>
                <div style={{ fontSize: 13, color: "#64748B" }}>Salle: {c.salle || "—"} • Cap: {c.capacite}</div>
                <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 6 }}>{c.annee_scolaire}</div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => edit(c)} style={{ ...smallBtn, background: "#EFF6FF", color: "#3B82F6" }}>✏️</button>
                <button onClick={() => del(c.id)} style={{ ...smallBtn, background: "#FEF2F2", color: "#EF4444" }}>🗑️</button>
              </div>
            </div>
          </div>
        ))}
        {classes.length === 0 && <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 40, color: "#94A3B8", background: "white", borderRadius: 12 }}>Aucune classe créée</div>}
      </div>
    </div>
  );
}

// ===== ENSEIGNANTS =====
function EnseignantsPage() {
  const [enseignants, setEnseignants] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nom: "", prenom: "", email: "", telephone: "", specialite: "", date_embauche: "", salaire: 0, statut: "Actif" });
  const [editId, setEditId] = useState(null);

  useEffect(() => { Enseignant.list().then(setEnseignants); }, []);

  async function save() {
    if (editId) { await Enseignant.update(editId, form); } else { await Enseignant.create(form); }
    setEnseignants(await Enseignant.list()); setShowForm(false); setEditId(null);
  }
  async function del(id) { if (confirm("Supprimer ?")) { await Enseignant.delete(id); setEnseignants(enseignants.filter(e => e.id !== id)); } }
  function edit(e) { setForm({ nom: e.nom||"", prenom: e.prenom||"", email: e.email||"", telephone: e.telephone||"", specialite: e.specialite||"", date_embauche: e.date_embauche||"", salaire: e.salaire||0, statut: e.statut||"Actif" }); setEditId(e.id); setShowForm(true); }
  const sc = { Actif: "#059669", Congé: "#D97706", Inactif: "#DC2626" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1E293B" }}>👨‍🏫 Gestion des Enseignants</h1>
        <button onClick={() => { setShowForm(true); setEditId(null); }} style={btnStyle("#D97706")}>+ Nouvel enseignant</button>
      </div>
      {showForm && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h2 style={{ marginBottom: 20 }}>{editId ? "Modifier" : "Nouvel"} enseignant</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[["nom","Nom"],["prenom","Prénom"],["email","Email"],["telephone","Téléphone"],["specialite","Spécialité"]].map(([k,l]) => (
                <div key={k}><label style={labelStyle}>{l}</label><input value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})} style={inputStyle}/></div>
              ))}
              <div><label style={labelStyle}>Date embauche</label><input type="date" value={form.date_embauche} onChange={e => setForm({...form,date_embauche:e.target.value})} style={inputStyle}/></div>
              <div><label style={labelStyle}>Salaire (HTG)</label><input type="number" value={form.salaire} onChange={e => setForm({...form,salaire:+e.target.value})} style={inputStyle}/></div>
              <div><label style={labelStyle}>Statut</label><select value={form.statut} onChange={e => setForm({...form,statut:e.target.value})} style={inputStyle}>{["Actif","Congé","Inactif"].map(s=><option key={s}>{s}</option>)}</select></div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
              <button onClick={() => setShowForm(false)} style={btnStyle("#64748B")}>Annuler</button>
              <button onClick={save} style={btnStyle("#D97706")}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}
      <div style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ background: "#F8FAFC" }}>{["Nom complet","Email","Spécialité","Salaire","Statut","Actions"].map(h=><th key={h} style={{ padding:"12px 16px",textAlign:"left",fontSize:12,fontWeight:600,color:"#64748B",textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
          <tbody>
            {enseignants.map((e,i)=>(
              <tr key={e.id} style={{ borderTop:"1px solid #F1F5F9",background:i%2===0?"white":"#FAFAFA"}}>
                <td style={tdStyle}><strong>{e.prenom} {e.nom}</strong></td>
                <td style={tdStyle}>{e.email||"—"}</td>
                <td style={tdStyle}>{e.specialite||"—"}</td>
                <td style={tdStyle}>{(e.salaire||0).toLocaleString()} HTG</td>
                <td style={tdStyle}><span style={{background:`${sc[e.statut]}20`,color:sc[e.statut],padding:"3px 10px",borderRadius:20,fontSize:12,fontWeight:600}}>{e.statut}</span></td>
                <td style={tdStyle}>
                  <button onClick={()=>edit(e)} style={{...smallBtn,background:"#EFF6FF",color:"#3B82F6"}}>✏️</button>
                  <button onClick={()=>del(e.id)} style={{...smallBtn,background:"#FEF2F2",color:"#EF4444"}}>🗑️</button>
                </td>
              </tr>
            ))}
            {enseignants.length===0&&<tr><td colSpan={6} style={{padding:32,textAlign:"center",color:"#94A3B8"}}>Aucun enseignant</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ===== PRÉSENCES =====
function PresencesPage() {
  const [presences, setPresences] = useState([]);
  const [eleves, setEleves] = useState([]);
  const [classes, setClasses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ eleve_id: "", classe_id: "", date: new Date().toISOString().split("T")[0], statut: "Présent", motif: "" });
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split("T")[0]);
  const [filterClasse, setFilterClasse] = useState("");

  useEffect(() => {
    Promise.all([Presence.list(), Eleve.list(), Classe.list()]).then(([p, e, c]) => { setPresences(p); setEleves(e); setClasses(c); });
  }, []);

  async function save() {
    await Presence.create(form);
    setPresences(await Presence.list());
    setShowForm(false);
    setForm({ eleve_id: "", classe_id: "", date: new Date().toISOString().split("T")[0], statut: "Présent", motif: "" });
  }

  async function del(id) { if(confirm("Supprimer ?")){ await Presence.delete(id); setPresences(presences.filter(p=>p.id!==id)); } }

  const filtered = presences.filter(p => {
    if (filterDate && p.date !== filterDate) return false;
    if (filterClasse && p.classe_id !== filterClasse) return false;
    return true;
  });

  const getEleve = id => { const e = eleves.find(e => e.id === id); return e ? `${e.prenom} ${e.nom}` : id; };
  const getClasse = id => { const c = classes.find(c => c.id === id); return c ? c.nom : id; };

  const stats = { Présent: filtered.filter(p=>p.statut==="Présent").length, Absent: filtered.filter(p=>p.statut==="Absent").length, Retard: filtered.filter(p=>p.statut==="Retard").length, Excusé: filtered.filter(p=>p.statut==="Excusé").length };
  const sc = { Présent: "#059669", Absent: "#DC2626", Retard: "#D97706", Excusé: "#7C3AED" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1E293B" }}>📋 Gestion des Présences</h1>
        <button onClick={() => setShowForm(true)} style={btnStyle("#DC2626")}>+ Enregistrer présence</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {Object.entries(stats).map(([s, v]) => (
          <div key={s} style={{ background: "white", borderRadius: 10, padding: 16, textAlign: "center", borderTop: `3px solid ${sc[s]}`, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: sc[s] }}>{v}</div>
            <div style={{ fontSize: 13, color: "#64748B" }}>{s}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Filtrer par date</label>
          <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} style={inputStyle} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Filtrer par classe</label>
          <select value={filterClasse} onChange={e => setFilterClasse(e.target.value)} style={inputStyle}>
            <option value="">Toutes les classes</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
          </select>
        </div>
      </div>

      {showForm && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h2 style={{ marginBottom: 20 }}>Enregistrer une présence</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div><label style={labelStyle}>Élève</label>
                <select value={form.eleve_id} onChange={e => setForm({...form, eleve_id: e.target.value})} style={inputStyle}>
                  <option value="">— Choisir —</option>
                  {eleves.map(e => <option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>)}
                </select>
              </div>
              <div><label style={labelStyle}>Classe</label>
                <select value={form.classe_id} onChange={e => setForm({...form, classe_id: e.target.value})} style={inputStyle}>
                  <option value="">— Choisir —</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                </select>
              </div>
              <div><label style={labelStyle}>Date</label><input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} style={inputStyle}/></div>
              <div><label style={labelStyle}>Statut</label>
                <select value={form.statut} onChange={e => setForm({...form, statut: e.target.value})} style={inputStyle}>
                  {["Présent","Absent","Retard","Excusé"].map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: "1/-1" }}><label style={labelStyle}>Motif (si absent)</label><input value={form.motif} onChange={e => setForm({...form, motif: e.target.value})} style={inputStyle} placeholder="Raison de l'absence..." /></div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
              <button onClick={() => setShowForm(false)} style={btnStyle("#64748B")}>Annuler</button>
              <button onClick={save} style={btnStyle("#DC2626")}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ background: "#F8FAFC" }}>{["Date","Élève","Classe","Statut","Motif","Actions"].map(h=><th key={h} style={{ padding:"12px 16px",textAlign:"left",fontSize:12,fontWeight:600,color:"#64748B",textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map((p,i)=>(
              <tr key={p.id} style={{ borderTop:"1px solid #F1F5F9",background:i%2===0?"white":"#FAFAFA"}}>
                <td style={tdStyle}>{p.date}</td>
                <td style={tdStyle}>{getEleve(p.eleve_id)}</td>
                <td style={tdStyle}>{getClasse(p.classe_id)}</td>
                <td style={tdStyle}><span style={{background:`${sc[p.statut]}20`,color:sc[p.statut],padding:"3px 10px",borderRadius:20,fontSize:12,fontWeight:600}}>{p.statut}</span></td>
                <td style={tdStyle}>{p.motif||"—"}</td>
                <td style={tdStyle}><button onClick={()=>del(p.id)} style={{...smallBtn,background:"#FEF2F2",color:"#EF4444"}}>🗑️</button></td>
              </tr>
            ))}
            {filtered.length===0&&<tr><td colSpan={6} style={{padding:32,textAlign:"center",color:"#94A3B8"}}>Aucune présence enregistrée</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ===== NOTES =====
function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [eleves, setEleves] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ eleve_id: "", matiere_id: "", valeur: "", type_note: "Devoir", trimestre: "T1", date_evaluation: new Date().toISOString().split("T")[0], commentaire: "" });
  const [matieres, setMatieres] = useState([]);

  useEffect(() => {
    Promise.all([Note.list(), Eleve.list(), Matiere.list()])
      .then(([n, e, m]) => { setNotes(n.data || n); setEleves(e.data || e); setMatieres(m.data || m); })
      .catch(err => console.error("Erreur chargement notes:", err));
  }, []);

  async function save() {
    await Note.create({ ...form, valeur: +form.valeur });
    setNotes(await Note.list());
    setShowForm(false);
    setForm({ eleve_id: "", matiere_id: "", valeur: "", type_note: "Devoir", trimestre: "T1", date_evaluation: new Date().toISOString().split("T")[0], commentaire: "" });
  }

  const getEleve = id => { const e = eleves.find(e => e.id === id); return e ? `${e.prenom} ${e.nom}` : "—"; };
  const getMatiere = id => { const m = matieres.find(m => m.id === id); return m ? m.nom : "—"; };
  const noteColor = v => v >= 14 ? "#059669" : v >= 10 ? "#D97706" : "#DC2626";

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1E293B" }}>📝 Notes & Bulletins</h1>
        <button onClick={() => setShowForm(true)} style={btnStyle("#7C3AED")}>+ Saisir une note</button>
      </div>

      {showForm && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h2 style={{ marginBottom: 20 }}>Saisir une note</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div><label style={labelStyle}>Élève</label>
                <select value={form.eleve_id} onChange={e => setForm({...form,eleve_id:e.target.value})} style={inputStyle}>
                  <option value="">— Choisir —</option>
                  {eleves.map(e=><option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>)}
                </select>
              </div>
              <div><label style={labelStyle}>Matière</label>
                <select value={form.matiere_id} onChange={e => setForm({...form,matiere_id:e.target.value})} style={inputStyle}>
                  <option value="">— Choisir —</option>
                  {matieres.map(m=><option key={m.id} value={m.id}>{m.nom}</option>)}
                </select>
              </div>
              <div><label style={labelStyle}>Note (/20)</label><input type="number" min="0" max="20" step="0.5" value={form.valeur} onChange={e=>setForm({...form,valeur:e.target.value})} style={inputStyle}/></div>
              <div><label style={labelStyle}>Type</label>
                <select value={form.type_note} onChange={e=>setForm({...form,type_note:e.target.value})} style={inputStyle}>
                  {["Devoir","Interrogation","Examen","TP","Oral"].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div><label style={labelStyle}>Trimestre</label>
                <select value={form.trimestre} onChange={e=>setForm({...form,trimestre:e.target.value})} style={inputStyle}>
                  {["T1","T2","T3"].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div><label style={labelStyle}>Date</label><input type="date" value={form.date_evaluation} onChange={e=>setForm({...form,date_evaluation:e.target.value})} style={inputStyle}/></div>
              <div style={{gridColumn:"1/-1"}}><label style={labelStyle}>Commentaire</label><input value={form.commentaire} onChange={e=>setForm({...form,commentaire:e.target.value})} style={inputStyle}/></div>
            </div>
            <div style={{display:"flex",gap:10,marginTop:20,justifyContent:"flex-end"}}>
              <button onClick={()=>setShowForm(false)} style={btnStyle("#64748B")}>Annuler</button>
              <button onClick={save} style={btnStyle("#7C3AED")}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ background: "#F8FAFC" }}>{["Élève","Matière","Note","Type","Trimestre","Date","Commentaire"].map(h=><th key={h} style={{padding:"12px 16px",textAlign:"left",fontSize:12,fontWeight:600,color:"#64748B",textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
          <tbody>
            {notes.map((n,i)=>(
              <tr key={n.id} style={{ borderTop:"1px solid #F1F5F9",background:i%2===0?"white":"#FAFAFA"}}>
                <td style={tdStyle}>{getEleve(n.eleve_id)}</td>
                <td style={tdStyle}>{getMatiere(n.matiere_id)}</td>
                <td style={tdStyle}><span style={{background:`${noteColor(n.valeur)}20`,color:noteColor(n.valeur),padding:"3px 10px",borderRadius:20,fontWeight:700,fontSize:14}}>{n.valeur}/20</span></td>
                <td style={tdStyle}>{n.type_note}</td>
                <td style={tdStyle}>{n.trimestre}</td>
                <td style={tdStyle}>{n.date_evaluation}</td>
                <td style={tdStyle}>{n.commentaire||"—"}</td>
              </tr>
            ))}
            {notes.length===0&&<tr><td colSpan={7} style={{padding:32,textAlign:"center",color:"#94A3B8"}}>Aucune note saisie</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ===== EMPLOI DU TEMPS =====
function EmploiTempsPage() {
  const [emplois, setEmplois] = useState([]);
  const [classes, setClasses] = useState([]);
  const [enseignants, setEnseignants] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ classe_id: "", enseignant_id: "", jour: "Lundi", heure_debut: "08:00", heure_fin: "09:00", salle: "" });
  const [filterClasse, setFilterClasse] = useState("");
  const jours = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];
  const colors = ["#4F46E5","#059669","#D97706","#DC2626","#7C3AED","#0284C7","#DB2777","#EA580C"];

  useEffect(() => {
    Promise.all([EmploiTemps.list(), Classe.list(), Enseignant.list()]).then(([e,c,en])=>{setEmplois(e);setClasses(c);setEnseignants(en);});
  }, []);

  async function save() {
    await EmploiTemps.create(form); setEmplois(await EmploiTemps.list()); setShowForm(false);
  }
  async function del(id) { if(confirm("Supprimer ?")){ await EmploiTemps.delete(id); setEmplois(emplois.filter(e=>e.id!==id)); } }
  const getClasse = id => { const c = classes.find(c=>c.id===id); return c?c.nom:id; };
  const getEns = id => { const e = enseignants.find(e=>e.id===id); return e?`${e.prenom} ${e.nom}`:id; };
  const filtered = filterClasse ? emplois.filter(e=>e.classe_id===filterClasse) : emplois;

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <h1 style={{fontSize:24,fontWeight:700,color:"#1E293B"}}>🗓️ Emplois du temps</h1>
        <button onClick={()=>setShowForm(true)} style={btnStyle("#0284C7")}>+ Ajouter un créneau</button>
      </div>
      <div style={{marginBottom:16}}>
        <select value={filterClasse} onChange={e=>setFilterClasse(e.target.value)} style={{...inputStyle,maxWidth:300}}>
          <option value="">Toutes les classes</option>
          {classes.map(c=><option key={c.id} value={c.id}>{c.nom}</option>)}
        </select>
      </div>

      {showForm && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h2 style={{marginBottom:20}}>Nouveau créneau</h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div><label style={labelStyle}>Classe</label>
                <select value={form.classe_id} onChange={e=>setForm({...form,classe_id:e.target.value})} style={inputStyle}>
                  <option value="">— Choisir —</option>
                  {classes.map(c=><option key={c.id} value={c.id}>{c.nom}</option>)}
                </select>
              </div>
              <div><label style={labelStyle}>Enseignant</label>
                <select value={form.enseignant_id} onChange={e=>setForm({...form,enseignant_id:e.target.value})} style={inputStyle}>
                  <option value="">— Choisir —</option>
                  {enseignants.map(e=><option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>)}
                </select>
              </div>
              <div><label style={labelStyle}>Jour</label>
                <select value={form.jour} onChange={e=>setForm({...form,jour:e.target.value})} style={inputStyle}>
                  {jours.map(j=><option key={j}>{j}</option>)}
                </select>
              </div>
              <div><label style={labelStyle}>Salle</label><input value={form.salle} onChange={e=>setForm({...form,salle:e.target.value})} style={inputStyle}/></div>
              <div><label style={labelStyle}>Heure début</label><input type="time" value={form.heure_debut} onChange={e=>setForm({...form,heure_debut:e.target.value})} style={inputStyle}/></div>
              <div><label style={labelStyle}>Heure fin</label><input type="time" value={form.heure_fin} onChange={e=>setForm({...form,heure_fin:e.target.value})} style={inputStyle}/></div>
            </div>
            <div style={{display:"flex",gap:10,marginTop:20,justifyContent:"flex-end"}}>
              <button onClick={()=>setShowForm(false)} style={btnStyle("#64748B")}>Annuler</button>
              <button onClick={save} style={btnStyle("#0284C7")}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      <div style={{background:"white",borderRadius:12,boxShadow:"0 1px 4px rgba(0,0,0,0.08)",overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{background:"#F8FAFC"}}>{["Jour","Classe","Enseignant","Horaire","Salle","Actions"].map(h=><th key={h} style={{padding:"12px 16px",textAlign:"left",fontSize:12,fontWeight:600,color:"#64748B",textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map((e,i)=>(
              <tr key={e.id} style={{borderTop:"1px solid #F1F5F9",background:i%2===0?"white":"#FAFAFA"}}>
                <td style={tdStyle}><span style={{background:`${colors[jours.indexOf(e.jour)%colors.length]}20`,color:colors[jours.indexOf(e.jour)%colors.length],padding:"3px 10px",borderRadius:20,fontSize:12,fontWeight:600}}>{e.jour}</span></td>
                <td style={tdStyle}>{getClasse(e.classe_id)}</td>
                <td style={tdStyle}>{getEns(e.enseignant_id)}</td>
                <td style={tdStyle}>{e.heure_debut} – {e.heure_fin}</td>
                <td style={tdStyle}>{e.salle||"—"}</td>
                <td style={tdStyle}><button onClick={()=>del(e.id)} style={{...smallBtn,background:"#FEF2F2",color:"#EF4444"}}>🗑️</button></td>
              </tr>
            ))}
            {filtered.length===0&&<tr><td colSpan={6} style={{padding:32,textAlign:"center",color:"#94A3B8"}}>Aucun créneau</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ===== PAIEMENTS =====
function PaiementsPage() {
  const [paiements, setPaiements] = useState([]);
  const [eleves, setEleves] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ eleve_id: "", montant: "", type_paiement: "Scolarité", statut: "En attente", date_paiement: new Date().toISOString().split("T")[0], date_echeance: "", methode: "Espèces", reference: "", trimestre: "T1" });

  useEffect(() => { Promise.all([Paiement.list(), Eleve.list()]).then(([p,e])=>{setPaiements(p);setEleves(e);}); }, []);

  async function save() {
    await Paiement.create({...form, montant: +form.montant});
    setPaiements(await Paiement.list()); setShowForm(false);
  }
  async function del(id) { if(confirm("Supprimer ?")){ await Paiement.delete(id); setPaiements(paiements.filter(p=>p.id!==id)); } }
  const getEleve = id => { const e = eleves.find(e=>e.id===id); return e?`${e.prenom} ${e.nom}`:id; };
  const sc = { "Payé":"#059669","En attente":"#D97706","Partiel":"#0284C7","Annulé":"#DC2626" };
  const totalPaye = paiements.filter(p=>p.statut==="Payé").reduce((s,p)=>s+(p.montant||0),0);
  const totalAttente = paiements.filter(p=>p.statut==="En attente").reduce((s,p)=>s+(p.montant||0),0);

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <h1 style={{fontSize:24,fontWeight:700,color:"#1E293B"}}>💰 Paiements & Frais scolaires</h1>
        <button onClick={()=>setShowForm(true)} style={btnStyle("#059669")}>+ Enregistrer paiement</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,marginBottom:24}}>
        <div style={{background:"white",borderRadius:12,padding:20,borderTop:"4px solid #059669",boxShadow:"0 1px 4px rgba(0,0,0,0.08)"}}>
          <div style={{fontSize:13,color:"#64748B"}}>Total encaissé</div>
          <div style={{fontSize:24,fontWeight:700,color:"#059669"}}>{totalPaye.toLocaleString()} HTG</div>
        </div>
        <div style={{background:"white",borderRadius:12,padding:20,borderTop:"4px solid #D97706",boxShadow:"0 1px 4px rgba(0,0,0,0.08)"}}>
          <div style={{fontSize:13,color:"#64748B"}}>En attente</div>
          <div style={{fontSize:24,fontWeight:700,color:"#D97706"}}>{totalAttente.toLocaleString()} HTG</div>
        </div>
        <div style={{background:"white",borderRadius:12,padding:20,borderTop:"4px solid #4F46E5",boxShadow:"0 1px 4px rgba(0,0,0,0.08)"}}>
          <div style={{fontSize:13,color:"#64748B"}}>Total transactions</div>
          <div style={{fontSize:24,fontWeight:700,color:"#4F46E5"}}>{paiements.length}</div>
        </div>
      </div>

      {showForm && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h2 style={{marginBottom:20}}>Enregistrer un paiement</h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div><label style={labelStyle}>Élève</label>
                <select value={form.eleve_id} onChange={e=>setForm({...form,eleve_id:e.target.value})} style={inputStyle}>
                  <option value="">— Choisir —</option>
                  {eleves.map(e=><option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>)}
                </select>
              </div>
              <div><label style={labelStyle}>Montant (HTG)</label><input type="number" value={form.montant} onChange={e=>setForm({...form,montant:e.target.value})} style={inputStyle}/></div>
              <div><label style={labelStyle}>Type</label>
                <select value={form.type_paiement} onChange={e=>setForm({...form,type_paiement:e.target.value})} style={inputStyle}>
                  {["Inscription","Scolarité","Transport","Cantine","Activités","Autre"].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div><label style={labelStyle}>Méthode</label>
                <select value={form.methode} onChange={e=>setForm({...form,methode:e.target.value})} style={inputStyle}>
                  {["Espèces","Virement","Mobile Money","Carte","Chèque"].map(m=><option key={m}>{m}</option>)}
                </select>
              </div>
              <div><label style={labelStyle}>Statut</label>
                <select value={form.statut} onChange={e=>setForm({...form,statut:e.target.value})} style={inputStyle}>
                  {["Payé","En attente","Partiel","Annulé"].map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div><label style={labelStyle}>Trimestre</label>
                <select value={form.trimestre} onChange={e=>setForm({...form,trimestre:e.target.value})} style={inputStyle}>
                  {["T1","T2","T3"].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div><label style={labelStyle}>Date paiement</label><input type="date" value={form.date_paiement} onChange={e=>setForm({...form,date_paiement:e.target.value})} style={inputStyle}/></div>
              <div><label style={labelStyle}>Référence</label><input value={form.reference} onChange={e=>setForm({...form,reference:e.target.value})} style={inputStyle}/></div>
            </div>
            <div style={{display:"flex",gap:10,marginTop:20,justifyContent:"flex-end"}}>
              <button onClick={()=>setShowForm(false)} style={btnStyle("#64748B")}>Annuler</button>
              <button onClick={save} style={btnStyle("#059669")}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      <div style={{background:"white",borderRadius:12,boxShadow:"0 1px 4px rgba(0,0,0,0.08)",overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{background:"#F8FAFC"}}>{["Élève","Montant","Type","Méthode","Trimestre","Statut","Date","Actions"].map(h=><th key={h} style={{padding:"12px 16px",textAlign:"left",fontSize:12,fontWeight:600,color:"#64748B",textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
          <tbody>
            {paiements.map((p,i)=>(
              <tr key={p.id} style={{borderTop:"1px solid #F1F5F9",background:i%2===0?"white":"#FAFAFA"}}>
                <td style={tdStyle}>{getEleve(p.eleve_id)}</td>
                <td style={tdStyle}><strong>{(p.montant||0).toLocaleString()} HTG</strong></td>
                <td style={tdStyle}>{p.type_paiement}</td>
                <td style={tdStyle}>{p.methode}</td>
                <td style={tdStyle}>{p.trimestre}</td>
                <td style={tdStyle}><span style={{background:`${sc[p.statut]}20`,color:sc[p.statut],padding:"3px 10px",borderRadius:20,fontSize:12,fontWeight:600}}>{p.statut}</span></td>
                <td style={tdStyle}>{p.date_paiement}</td>
                <td style={tdStyle}><button onClick={()=>del(p.id)} style={{...smallBtn,background:"#FEF2F2",color:"#EF4444"}}>🗑️</button></td>
              </tr>
            ))}
            {paiements.length===0&&<tr><td colSpan={8} style={{padding:32,textAlign:"center",color:"#94A3B8"}}>Aucun paiement enregistré</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ===== PERSONNEL =====
function PersonnelPage() {
  const [personnel, setPersonnel] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nom: "", prenom: "", poste: "", departement: "", salaire: 0, date_embauche: "", statut: "Actif", telephone: "", email: "" });
  const [editId, setEditId] = useState(null);

  useEffect(() => { Personnel.list().then(setPersonnel); }, []);

  async function save() {
    if(editId){ await Personnel.update(editId, form); } else { await Personnel.create(form); }
    setPersonnel(await Personnel.list()); setShowForm(false); setEditId(null);
  }
  async function del(id) { if(confirm("Supprimer ?")){ await Personnel.delete(id); setPersonnel(personnel.filter(p=>p.id!==id)); } }
  function edit(p) { setForm({nom:p.nom||"",prenom:p.prenom||"",poste:p.poste||"",departement:p.departement||"",salaire:p.salaire||0,date_embauche:p.date_embauche||"",statut:p.statut||"Actif",telephone:p.telephone||"",email:p.email||""}); setEditId(p.id); setShowForm(true); }
  const totalMasse = personnel.filter(p=>p.statut==="Actif").reduce((s,p)=>s+(p.salaire||0),0);
  const sc = { Actif:"#059669",Congé:"#D97706",Suspendu:"#DC2626",Quitté:"#64748B" };

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <h1 style={{fontSize:24,fontWeight:700,color:"#1E293B"}}>👥 RH & Gestion du personnel</h1>
        <button onClick={()=>{setShowForm(true);setEditId(null);}} style={btnStyle("#0284C7")}>+ Nouveau membre</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,marginBottom:24}}>
        <div style={{background:"white",borderRadius:12,padding:20,borderTop:"4px solid #0284C7",boxShadow:"0 1px 4px rgba(0,0,0,0.08)"}}>
          <div style={{fontSize:13,color:"#64748B"}}>Personnel actif</div>
          <div style={{fontSize:28,fontWeight:700,color:"#0284C7"}}>{personnel.filter(p=>p.statut==="Actif").length}</div>
        </div>
        <div style={{background:"white",borderRadius:12,padding:20,borderTop:"4px solid #7C3AED",boxShadow:"0 1px 4px rgba(0,0,0,0.08)"}}>
          <div style={{fontSize:13,color:"#64748B"}}>Masse salariale</div>
          <div style={{fontSize:24,fontWeight:700,color:"#7C3AED"}}>{totalMasse.toLocaleString()} HTG</div>
        </div>
        <div style={{background:"white",borderRadius:12,padding:20,borderTop:"4px solid #D97706",boxShadow:"0 1px 4px rgba(0,0,0,0.08)"}}>
          <div style={{fontSize:13,color:"#64748B"}}>En congé</div>
          <div style={{fontSize:28,fontWeight:700,color:"#D97706"}}>{personnel.filter(p=>p.statut==="Congé").length}</div>
        </div>
      </div>

      {showForm && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h2 style={{marginBottom:20}}>{editId?"Modifier":"Nouveau"} membre du personnel</h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {[["nom","Nom"],["prenom","Prénom"],["poste","Poste"],["departement","Département"],["telephone","Téléphone"],["email","Email"]].map(([k,l])=>(
                <div key={k}><label style={labelStyle}>{l}</label><input value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} style={inputStyle}/></div>
              ))}
              <div><label style={labelStyle}>Salaire (HTG)</label><input type="number" value={form.salaire} onChange={e=>setForm({...form,salaire:+e.target.value})} style={inputStyle}/></div>
              <div><label style={labelStyle}>Date embauche</label><input type="date" value={form.date_embauche} onChange={e=>setForm({...form,date_embauche:e.target.value})} style={inputStyle}/></div>
              <div><label style={labelStyle}>Statut</label>
                <select value={form.statut} onChange={e=>setForm({...form,statut:e.target.value})} style={inputStyle}>
                  {["Actif","Congé","Suspendu","Quitté"].map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div style={{display:"flex",gap:10,marginTop:20,justifyContent:"flex-end"}}>
              <button onClick={()=>setShowForm(false)} style={btnStyle("#64748B")}>Annuler</button>
              <button onClick={save} style={btnStyle("#0284C7")}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      <div style={{background:"white",borderRadius:12,boxShadow:"0 1px 4px rgba(0,0,0,0.08)",overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{background:"#F8FAFC"}}>{["Nom complet","Poste","Département","Salaire","Statut","Actions"].map(h=><th key={h} style={{padding:"12px 16px",textAlign:"left",fontSize:12,fontWeight:600,color:"#64748B",textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
          <tbody>
            {personnel.map((p,i)=>(
              <tr key={p.id} style={{borderTop:"1px solid #F1F5F9",background:i%2===0?"white":"#FAFAFA"}}>
                <td style={tdStyle}><strong>{p.prenom} {p.nom}</strong></td>
                <td style={tdStyle}>{p.poste||"—"}</td>
                <td style={tdStyle}>{p.departement||"—"}</td>
                <td style={tdStyle}>{(p.salaire||0).toLocaleString()} HTG</td>
                <td style={tdStyle}><span style={{background:`${sc[p.statut]}20`,color:sc[p.statut],padding:"3px 10px",borderRadius:20,fontSize:12,fontWeight:600}}>{p.statut}</span></td>
                <td style={tdStyle}>
                  <button onClick={()=>edit(p)} style={{...smallBtn,background:"#EFF6FF",color:"#3B82F6"}}>✏️</button>
                  <button onClick={()=>del(p.id)} style={{...smallBtn,background:"#FEF2F2",color:"#EF4444"}}>🗑️</button>
                </td>
              </tr>
            ))}
            {personnel.length===0&&<tr><td colSpan={6} style={{padding:32,textAlign:"center",color:"#94A3B8"}}>Aucun membre du personnel</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ===== MESSAGES =====
function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ expediteur: "", destinataire: "", sujet: "", contenu: "", type: "Notification", lu: false });
  const [selected, setSelected] = useState(null);

  useEffect(() => { Message.list().then(setMessages); }, []);

  async function save() {
    await Message.create(form); setMessages(await Message.list()); setShowForm(false);
  }
  async function markRead(id) {
    await Message.update(id, { lu: true }); setMessages(await Message.list());
  }
  async function del(id) { if(confirm("Supprimer ?")){ await Message.delete(id); setMessages(messages.filter(m=>m.id!==id)); setSelected(null); } }
  const typeColor = { "Parent-Ecole":"#4F46E5","Notification":"#059669","Circulaire":"#D97706","Urgence":"#DC2626" };

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <h1 style={{fontSize:24,fontWeight:700,color:"#1E293B"}}>✉️ Messagerie</h1>
        <button onClick={()=>setShowForm(true)} style={btnStyle("#DB2777")}>+ Nouveau message</button>
      </div>

      {showForm && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h2 style={{marginBottom:20}}>Nouveau message</h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {[["expediteur","Expéditeur"],["destinataire","Destinataire"],["sujet","Sujet"]].map(([k,l])=>(
                <div key={k}><label style={labelStyle}>{l}</label><input value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} style={inputStyle}/></div>
              ))}
              <div><label style={labelStyle}>Type</label>
                <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} style={inputStyle}>
                  {["Parent-Ecole","Notification","Circulaire","Urgence"].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div style={{gridColumn:"1/-1"}}><label style={labelStyle}>Message</label><textarea value={form.contenu} onChange={e=>setForm({...form,contenu:e.target.value})} style={{...inputStyle,height:100,resize:"vertical"}}/></div>
            </div>
            <div style={{display:"flex",gap:10,marginTop:20,justifyContent:"flex-end"}}>
              <button onClick={()=>setShowForm(false)} style={btnStyle("#64748B")}>Annuler</button>
              <button onClick={save} style={btnStyle("#DB2777")}>Envoyer</button>
            </div>
          </div>
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"300px 1fr",gap:16}}>
        <div style={{background:"white",borderRadius:12,boxShadow:"0 1px 4px rgba(0,0,0,0.08)",overflow:"hidden",maxHeight:500,overflowY:"auto"}}>
          {messages.map((m,i)=>(
            <div key={m.id} onClick={()=>{setSelected(m);if(!m.lu)markRead(m.id);}} style={{padding:"14px 16px",borderBottom:"1px solid #F1F5F9",cursor:"pointer",background:selected?.id===m.id?"#EFF6FF":m.lu?"white":"#F0FDF4"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{fontSize:13,fontWeight:m.lu?400:700,color:"#1E293B",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:180}}>{m.sujet||"(sans sujet)"}</div>
                {!m.lu&&<span style={{width:8,height:8,background:"#059669",borderRadius:"50%",flexShrink:0}}/>}
              </div>
              <div style={{fontSize:12,color:"#64748B",marginTop:2}}>{m.expediteur}</div>
              <div style={{marginTop:4}}><span style={{background:`${typeColor[m.type]}20`,color:typeColor[m.type],fontSize:11,padding:"2px 6px",borderRadius:10}}>{m.type}</span></div>
            </div>
          ))}
          {messages.length===0&&<div style={{padding:32,textAlign:"center",color:"#94A3B8"}}>Aucun message</div>}
        </div>
        <div style={{background:"white",borderRadius:12,boxShadow:"0 1px 4px rgba(0,0,0,0.08)",padding:24}}>
          {selected ? (
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
                <div>
                  <h2 style={{fontSize:18,fontWeight:700,color:"#1E293B",marginBottom:4}}>{selected.sujet}</h2>
                  <div style={{fontSize:13,color:"#64748B"}}>De: {selected.expediteur} → {selected.destinataire}</div>
                </div>
                <button onClick={()=>del(selected.id)} style={{...smallBtn,background:"#FEF2F2",color:"#EF4444"}}>🗑️</button>
              </div>
              <div style={{background:"#F8FAFC",borderRadius:8,padding:16,fontSize:14,color:"#374151",lineHeight:1.6}}>{selected.contenu}</div>
            </div>
          ) : <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:200,color:"#94A3B8",fontSize:14}}>Sélectionnez un message</div>}
        </div>
      </div>
    </div>
  );
}

// ===== FINANCES =====
function FinancesPage() {
  const [depenses, setDepenses] = useState([]);
  const [paiements, setPaiements] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ libelle: "", montant: "", categorie: "Fournitures", date: new Date().toISOString().split("T")[0], statut: "En attente" });

  useEffect(() => {
    Promise.all([Depense.list(), Paiement.list()]).then(([d,p])=>{setDepenses(d);setPaiements(p);});
  }, []);

  async function save() {
    await Depense.create({...form,montant:+form.montant});
    setDepenses(await Depense.list()); setShowForm(false);
  }
  async function del(id) { if(confirm("Supprimer ?")){ await Depense.delete(id); setDepenses(depenses.filter(d=>d.id!==id)); } }

  const totalRevenu = paiements.filter(p=>p.statut==="Payé").reduce((s,p)=>s+(p.montant||0),0);
  const totalDepense = depenses.filter(d=>d.statut==="Payée").reduce((s,d)=>s+(d.montant||0),0);
  const solde = totalRevenu - totalDepense;
  const catColors = { Salaires:"#4F46E5",Fournitures:"#059669",Infrastructure:"#D97706",Services:"#0284C7",Activités:"#DB2777",Autre:"#64748B" };
  const catStats = {};
  depenses.forEach(d => { catStats[d.categorie] = (catStats[d.categorie]||0) + (d.montant||0); });

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <h1 style={{fontSize:24,fontWeight:700,color:"#1E293B"}}>📊 Comptabilité & Finances</h1>
        <button onClick={()=>setShowForm(true)} style={btnStyle("#EA580C")}>+ Nouvelle dépense</button>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,marginBottom:24}}>
        <div style={{background:"white",borderRadius:12,padding:20,borderTop:"4px solid #059669",boxShadow:"0 1px 4px rgba(0,0,0,0.08)"}}>
          <div style={{fontSize:13,color:"#64748B"}}>Total revenus</div>
          <div style={{fontSize:24,fontWeight:700,color:"#059669"}}>{totalRevenu.toLocaleString()} HTG</div>
        </div>
        <div style={{background:"white",borderRadius:12,padding:20,borderTop:"4px solid #DC2626",boxShadow:"0 1px 4px rgba(0,0,0,0.08)"}}>
          <div style={{fontSize:13,color:"#64748B"}}>Total dépenses</div>
          <div style={{fontSize:24,fontWeight:700,color:"#DC2626"}}>{totalDepense.toLocaleString()} HTG</div>
        </div>
        <div style={{background:"white",borderRadius:12,padding:20,borderTop:`4px solid ${solde>=0?"#4F46E5":"#DC2626"}`,boxShadow:"0 1px 4px rgba(0,0,0,0.08)"}}>
          <div style={{fontSize:13,color:"#64748B"}}>Solde</div>
          <div style={{fontSize:24,fontWeight:700,color:solde>=0?"#4F46E5":"#DC2626"}}>{solde.toLocaleString()} HTG</div>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12,marginBottom:24}}>
        {Object.entries(catStats).map(([cat,total])=>(
          <div key={cat} style={{background:"white",borderRadius:10,padding:16,borderLeft:`4px solid ${catColors[cat]||"#64748B"}`,boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
            <div style={{fontSize:12,color:"#64748B"}}>{cat}</div>
            <div style={{fontSize:18,fontWeight:700,color:catColors[cat]||"#64748B"}}>{total.toLocaleString()} HTG</div>
          </div>
        ))}
      </div>

      {showForm && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h2 style={{marginBottom:20}}>Nouvelle dépense</h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div style={{gridColumn:"1/-1"}}><label style={labelStyle}>Libellé</label><input value={form.libelle} onChange={e=>setForm({...form,libelle:e.target.value})} style={inputStyle}/></div>
              <div><label style={labelStyle}>Montant (HTG)</label><input type="number" value={form.montant} onChange={e=>setForm({...form,montant:e.target.value})} style={inputStyle}/></div>
              <div><label style={labelStyle}>Catégorie</label>
                <select value={form.categorie} onChange={e=>setForm({...form,categorie:e.target.value})} style={inputStyle}>
                  {["Salaires","Fournitures","Infrastructure","Services","Activités","Autre"].map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div><label style={labelStyle}>Date</label><input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} style={inputStyle}/></div>
              <div><label style={labelStyle}>Statut</label>
                <select value={form.statut} onChange={e=>setForm({...form,statut:e.target.value})} style={inputStyle}>
                  {["Payée","En attente","Annulée"].map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div style={{display:"flex",gap:10,marginTop:20,justifyContent:"flex-end"}}>
              <button onClick={()=>setShowForm(false)} style={btnStyle("#64748B")}>Annuler</button>
              <button onClick={save} style={btnStyle("#EA580C")}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      <div style={{background:"white",borderRadius:12,boxShadow:"0 1px 4px rgba(0,0,0,0.08)",overflow:"hidden"}}>
        <h2 style={{padding:"16px 20px",fontSize:16,fontWeight:600,color:"#1E293B",borderBottom:"1px solid #F1F5F9"}}>Dépenses</h2>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{background:"#F8FAFC"}}>{["Libellé","Montant","Catégorie","Date","Statut","Actions"].map(h=><th key={h} style={{padding:"12px 16px",textAlign:"left",fontSize:12,fontWeight:600,color:"#64748B",textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
          <tbody>
            {depenses.map((d,i)=>{
              const sc={"Payée":"#059669","En attente":"#D97706","Annulée":"#DC2626"};
              return(
              <tr key={d.id} style={{borderTop:"1px solid #F1F5F9",background:i%2===0?"white":"#FAFAFA"}}>
                <td style={tdStyle}>{d.libelle}</td>
                <td style={tdStyle}><strong>{(d.montant||0).toLocaleString()} HTG</strong></td>
                <td style={tdStyle}><span style={{background:`${catColors[d.categorie]||"#64748B"}20`,color:catColors[d.categorie]||"#64748B",padding:"3px 10px",borderRadius:20,fontSize:12}}>{d.categorie}</span></td>
                <td style={tdStyle}>{d.date}</td>
                <td style={tdStyle}><span style={{background:`${sc[d.statut]}20`,color:sc[d.statut],padding:"3px 10px",borderRadius:20,fontSize:12,fontWeight:600}}>{d.statut}</span></td>
                <td style={tdStyle}><button onClick={()=>del(d.id)} style={{...smallBtn,background:"#FEF2F2",color:"#EF4444"}}>🗑️</button></td>
              </tr>
            )})}
            {depenses.length===0&&<tr><td colSpan={6} style={{padding:32,textAlign:"center",color:"#94A3B8"}}>Aucune dépense enregistrée</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ===== STYLES =====
const btnStyle = (bg) => ({ padding: "10px 20px", background: bg, color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 14 });
const modalOverlay = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 };
const modalBox = { background: "white", borderRadius: 16, padding: 32, width: "90%", maxWidth: 640, maxHeight: "90vh", overflowY: "auto" };
const inputStyle = { width: "100%", padding: "9px 12px", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 14, boxSizing: "border-box", background: "#F8FAFC" };
const labelStyle = { display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 };
const tdStyle = { padding: "12px 16px", fontSize: 14, color: "#374151" };
const smallBtn = { padding: "5px 10px", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, marginRight: 4 };

// ===== LOGIN PAGE =====
function LoginPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ nom: "", email: "", password: "", role: "Admin" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        const data = await Auth.login(form.email, form.password);
        onLogin(data.user);
      } else {
        await Auth.register(form);
        const data = await Auth.login(form.email, form.password);
        onLogin(data.user);
      }
    } catch (err) {
      setError("Identifiants invalides ou erreur serveur.");
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)", fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ background: "white", padding: 40, borderRadius: 20, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)", width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🎓</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827" }}>EduManager</h1>
          <p style={{ color: "#6B7280", marginTop: 5 }}>{isLogin ? "Connectez-vous à votre espace" : "Créez votre compte administrateur"}</p>
        </div>

        {error && <div style={{ background: "#FEE2E2", color: "#DC2626", padding: "12px", borderRadius: 8, marginBottom: 20, fontSize: 14, textAlign: "center" }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {!isLogin && (
            <div>
              <label style={labelStyle}>Nom complet</label>
              <input required value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} style={inputStyle} placeholder="Jean Dupont" />
            </div>
          )}
          <div>
            <label style={labelStyle}>Email</label>
            <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} placeholder="admin@ecole.ht" />
          </div>
          <div>
            <label style={labelStyle}>Mot de passe</label>
            <input required type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={inputStyle} placeholder="••••••••" />
          </div>
          
          <button type="submit" disabled={loading} style={btnStyle("#3B82F6")}>
            {loading ? "Chargement..." : isLogin ? "Se connecter" : "Créer le compte"}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: "center", fontSize: 14 }}>
          <button onClick={() => setIsLogin(!isLogin)} style={{ background: "none", border: "none", color: "#3B82F6", cursor: "pointer", fontWeight: 600 }}>
            {isLogin ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
          </button>
        </div>
      </div>
    </div>
  );
}
