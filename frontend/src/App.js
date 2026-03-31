import React, { useState } from 'react';
import Layout from './components/Layout';
import LoginPage from './components/LoginPage';
import DashboardHome from './pages/DashboardHome';
import ElevesPage from './pages/ElevesPage';
import ClassesPage from './pages/ClassesPage';
import EnseignantsPage from './pages/EnseignantsPage';
import PresencesPage from './pages/PresencesPage';
import NotesPage from './pages/NotesPage';
import EmploiTempsPage from './pages/EmploiTempsPage';
import PaiementsPage from './pages/PaiementsPage';
import PersonnelPage from './pages/PersonnelPage';
import MessagesPage from './pages/MessagesPage';
import FinancesPage from './pages/FinancesPage';
import MatieresPage from './pages/MatieresPage';

const pages = [
  { id: "dashboard", label: "Tableau de bord", icon: "🏠" },
  { id: "classes", label: "Classes", icon: "🏫" },
  { id: "matieres", label: "Matières", icon: "📚" },
  { id: "enseignants", label: "Enseignants", icon: "👨‍🏫" },
  { id: "eleves", label: "Élèves", icon: "👨‍🎓" },
  { id: "presences", label: "Présences", icon: "📋" },
  { id: "notes", label: "Notes & Bulletins", icon: "📝" },
  { id: "emploiTemps", label: "Emplois du temps", icon: "🗓️" },
  { id: "paiements", label: "Paiements", icon: "💰" },
  { id: "personnel", label: "RH & Paie", icon: "👥" },
  { id: "messages", label: "Messages", icon: "✉️" },
  { id: "finances", label: "Finances", icon: "📊" },
];

const pageComponents = {
  dashboard: DashboardHome,
  eleves: ElevesPage,
  classes: ClassesPage,
  matieres: MatieresPage,
  enseignants: EnseignantsPage,
  presences: PresencesPage,
  notes: NotesPage,
  emploiTemps: EmploiTempsPage,
  paiements: PaiementsPage,
  personnel: PersonnelPage,
  messages: MessagesPage,
  finances: FinancesPage,
};

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('edumanager_user')));
  const [activePage, setActivePage] = useState("dashboard");

  if (!user) return <LoginPage onLogin={u => setUser(u)} />;

  const PageComponent = pageComponents[activePage] || DashboardHome;

  return (
    <Layout user={user} onLogout={() => setUser(null)} pages={pages} activePage={activePage} setActivePage={setActivePage}>
      <PageComponent setActivePage={setActivePage} pages={pages} />
    </Layout>
  );
}

export default App;
