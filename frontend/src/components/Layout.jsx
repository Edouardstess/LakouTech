import React, { useState } from "react";
import { Auth } from "../api/entities";

export default function Layout({ user, onLogout, pages, activePage, setActivePage, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      {/* Mobile Header */}
      <div className="mobile-header">
        <div className="mobile-brand">
          <span>🎓</span> EduManager
        </div>
        <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Overlay */}
      <div className={`sidebar-overlay ${sidebarOpen ? "visible" : ""}`} onClick={() => setSidebarOpen(false)} />

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-logo">🎓</div>
            <div className="sidebar-brand-text">
              <h1>EduManager</h1>
              <span>Gestion Scolaire Pro</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {pages.map(p => (
            <button
              key={p.id}
              className={`sidebar-link ${activePage === p.id ? "active" : ""}`}
              onClick={() => { setActivePage(p.id); setSidebarOpen(false); }}
            >
              <span className="sidebar-link-icon">{p.icon}</span>
              {p.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{user?.nom?.charAt(0).toUpperCase()}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.nom}</div>
              <div className="sidebar-user-role">{user?.role}</div>
            </div>
          </div>
          <button className="sidebar-logout" onClick={() => { Auth.logout(); onLogout(); }}>
            🚪 Déconnexion
          </button>
        </div>
        <div className="sidebar-version">© 2026 EduManager v2.0</div>
      </div>

      {/* Main */}
      <div className="main-content">
        {children}
      </div>
    </div>
  );
}
