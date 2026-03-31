/**
 * EduManager — Clients API Entités
 * Communique avec le backend REST API avec authentification JWT.
 */

// Déterminer l'URL de base de l'API (Forcé en dur pour contourner le cache de Render)
const API_BASE = 'https://edumanager-backend-67i1.onrender.com';

// ---- Utilitaire d'appel API ----
async function apiCall(method, path, body) {
  const token = localStorage.getItem('edumanager_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  // Si 401/403, déconnecter l'utilisateur
  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem('edumanager_token');
    localStorage.removeItem('edumanager_user');
    window.location.reload();
    throw new Error('Session expirée');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `API Error: ${res.status}`);
  }

  return res.json();
}

// ---- Auth ----
export const Auth = {
  login: async (email, password) => {
    const data = await apiCall('POST', '/api/auth/login', { email, password });
    if (data.token) {
      localStorage.setItem('edumanager_token', data.token);
      localStorage.setItem('edumanager_user', JSON.stringify(data.user));
    }
    return data;
  },
  register: (data) => apiCall('POST', '/api/auth/register', data),
  me: () => apiCall('GET', '/api/auth/me'),
  logout: () => {
    localStorage.removeItem('edumanager_token');
    localStorage.removeItem('edumanager_user');
  }
};

// ---- Entités CRUD ----
function createEntity(name) {
  const pluralMap = {
    eleve: 'eleves',
    classe: 'classes',
    enseignant: 'enseignants',
    matiere: 'matieres',
    note: 'notes',
    presence: 'presences',
    paiement: 'paiements',
    emploiTemps: 'emploitempss',
    personnel: 'personnel',
    message: 'messages',
    depense: 'depenses',
    etablissement: 'etablissements'
  };
  const path = `/api/${pluralMap[name] || name + 's'}`;

  return {
    list: () => apiCall('GET', path),
    get: (id) => apiCall('GET', `${path}/${id}`),
    create: (data) => apiCall('POST', path, data),
    update: (id, data) => apiCall('PUT', `${path}/${id}`, data),
    delete: (id) => apiCall('DELETE', `${path}/${id}`),
    filter: (params) => {
      const query = new URLSearchParams(params).toString();
      return apiCall('GET', `${path}?${query}`);
    }
  };
}

export const Etablissement = createEntity('etablissement');
export const Eleve = createEntity('eleve');
export const Classe = createEntity('classe');
export const Enseignant = createEntity('enseignant');
export const Matiere = createEntity('matiere');
export const Note = createEntity('note');
export const Presence = createEntity('presence');
export const Paiement = createEntity('paiement');
export const EmploiTemps = createEntity('emploiTemps');
export const Personnel = createEntity('personnel');
export const Message = createEntity('message');
export const Depense = createEntity('depense');
