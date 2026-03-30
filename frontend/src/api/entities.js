/**
 * EduManager — Clients API Entités
 * Ces fonctions communiquent avec le backend Base44 ou l'API REST locale.
 */

const API_BASE = process.env.REACT_APP_API_URL || 'https://api.base44.com';
const APP_ID = process.env.REACT_APP_BASE44_APP_ID || '69c9b24e3697466f8942132b';

async function apiCall(method, path, body) {
  const res = await fetch(`${API_BASE}/apps/${APP_ID}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

function createEntity(name) {
  return {
    list: () => apiCall('GET', `/entities/${name}`),
    get: (id) => apiCall('GET', `/entities/${name}/${id}`),
    create: (data) => apiCall('POST', `/entities/${name}`, data),
    update: (id, data) => apiCall('PUT', `/entities/${name}/${id}`, data),
    delete: (id) => apiCall('DELETE', `/entities/${name}/${id}`),
    filter: (params) => {
      const query = new URLSearchParams(params).toString();
      return apiCall('GET', `/entities/${name}?${query}`);
    }
  };
}

const API_BASE_LOCAL = 'http://localhost:3001';

async function apiCallLocal(method, path, body) {
  const token = localStorage.getItem('edumanager_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_LOCAL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

export const Auth = {
  login: async (email, password) => {
    const data = await apiCallLocal('POST', '/api/auth/login', { email, password });
    if (data.token) {
      localStorage.setItem('edumanager_token', data.token);
      localStorage.setItem('edumanager_user', JSON.stringify(data.user));
    }
    return data;
  },
  register: (data) => apiCallLocal('POST', '/api/auth/register', data),
  me: () => apiCallLocal('GET', '/api/auth/me'),
  logout: () => {
    localStorage.removeItem('edumanager_token');
    localStorage.removeItem('edumanager_user');
  }
};

function createLocalEntity(name) {
  const pluralMap = { eleve: 'eleves', classe: 'classes', enseignant: 'enseignants', matiere: 'matieres', note: 'notes', presence: 'presences', paiement: 'paiements', emploiTemps: 'emploitempss', personnel: 'personnel', message: 'messages', depense: 'depenses', etablissement: 'etablissements' };
  const path = `/api/${pluralMap[name] || name + 's'}`;
  return {
    list: () => apiCallLocal('GET', path),
    get: (id) => apiCallLocal('GET', `${path}/${id}`),
    create: (data) => apiCallLocal('POST', path, data),
    update: (id, data) => apiCallLocal('PUT', `${path}/${id}`, data),
    delete: (id) => apiCallLocal('DELETE', `${path}/${id}`),
    filter: (params) => {
      const query = new URLSearchParams(params).toString();
      return apiCallLocal('GET', `${path}?${query}`);
    }
  };
}

export const Etablissement = createLocalEntity('etablissement');
export const Eleve = createLocalEntity('eleve');
export const Classe = createLocalEntity('classe');
export const Enseignant = createLocalEntity('enseignant');
export const Matiere = createLocalEntity('matiere');
export const Note = createLocalEntity('note');
export const Presence = createLocalEntity('presence');
export const Paiement = createLocalEntity('paiement');
export const EmploiTemps = createLocalEntity('emploiTemps');
export const Personnel = createLocalEntity('personnel');
export const Message = createLocalEntity('message');
export const Depense = createLocalEntity('depense');
