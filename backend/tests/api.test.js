/**
 * EduManager — Tests API Backend
 * Jest + Supertest
 */

const request = require('supertest');
const app = require('../server');
const { Pool } = require('pg');

// Mock de la base de données pour tests
jest.mock('pg', () => {
  const mPool = {
    query: jest.fn(),
  };
  return {
    Pool: jest.fn(() => mPool),
  };
});

describe('EduManager API - Integration Tests', () => {

  // =============== HEALTH CHECK ===============
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  // =============== ÉLÈVES API ===============
  describe('API Élèves', () => {
    const mockEleve = {
      id: 'test-id-123',
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean@example.com',
      statut: 'Actif'
    };

    it('should list all eleves', async () => {
      const response = await request(app)
        .get('/api/eleves')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(Array.isArray(response.body.data) || response.body.data === null).toBe(true);
    });

    it('should handle eleves filters', async () => {
      const response = await request(app)
        .get('/api/eleves?statut=Actif')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
    });
  });

  // =============== CLASSES API ===============
  describe('API Classes', () => {
    it('should list all classes', async () => {
      const response = await request(app)
        .get('/api/classes')
        .expect(200);

      expect(response.body).toHaveProperty('success');
      expect(typeof response.body.data).toBe('object');
    });

    it('should handle class filters', async () => {
      const response = await request(app)
        .get('/api/classes?niveau=6ème')
        .expect(200);

      expect(response.body).toHaveProperty('success');
    });
  });

  // =============== ENSEIGNANTS API ===============
  describe('API Enseignants', () => {
    it('should list all enseignants', async () => {
      const response = await request(app)
        .get('/api/enseignants')
        .expect(200);

      expect(response.body).toHaveProperty('success');
    });

    it('should handle teacher filters', async () => {
      const response = await request(app)
        .get('/api/enseignants?statut=Actif')
        .expect(200);

      expect(response.body).toHaveProperty('success');
    });
  });

  // =============== MATIERES API ===============
  describe('API Matières', () => {
    it('should list all matieres', async () => {
      const response = await request(app)
        .get('/api/matieres')
        .expect(200);

      expect(response.body).toHaveProperty('success');
    });
  });

  // =============== PRESENCES API ===============
  describe('API Présences', () => {
    it('should list presences', async () => {
      const response = await request(app)
        .get('/api/presences')
        .expect(200);

      expect(response.body).toHaveProperty('success');
    });

    it('should filter by date', async () => {
      const response = await request(app)
        .get('/api/presences?date=2026-03-30')
        .expect(200);

      expect(response.body).toHaveProperty('success');
    });
  });

  // =============== NOTES API ===============
  describe('API Notes', () => {
    it('should list notes', async () => {
      const response = await request(app)
        .get('/api/notes')
        .expect(200);

      expect(response.body).toHaveProperty('success');
    });

    it('should filter by trimestre', async () => {
      const response = await request(app)
        .get('/api/notes?trimestre=T1')
        .expect(200);

      expect(response.body).toHaveProperty('success');
    });
  });

  // =============== PAIEMENTS API ===============
  describe('API Paiements', () => {
    it('should list paiements', async () => {
      const response = await request(app)
        .get('/api/paiements')
        .expect(200);

      expect(response.body).toHaveProperty('success');
    });

    it('should get stats', async () => {
      const response = await request(app)
        .get('/api/paiements/stats')
        .expect(200);

      expect(response.body).toHaveProperty('success');
    });
  });

  // =============== EMPLOI DU TEMPS API ===============
  describe('API Emploi du Temps', () => {
    it('should list emploi du temps', async () => {
      const response = await request(app)
        .get('/api/emploitempss')
        .expect(200);

      expect(response.body).toHaveProperty('success');
    });
  });

  // =============== PERSONNEL API ===============
  describe('API Personnel', () => {
    it('should list personnel', async () => {
      const response = await request(app)
        .get('/api/personnel')
        .expect(200);

      expect(response.body).toHaveProperty('success');
    });
  });

  // =============== MESSAGES API ===============
  describe('API Messages', () => {
    it('should list messages', async () => {
      const response = await request(app)
        .get('/api/messages')
        .expect(200);

      expect(response.body).toHaveProperty('success');
    });
  });

  // =============== DÉPENSES API ===============
  describe('API Dépenses', () => {
    it('should list dépenses', async () => {
      const response = await request(app)
        .get('/api/depenses')
        .expect(200);

      expect(response.body).toHaveProperty('success');
    });
  });

  // =============== ÉTABLISSEMENTS API ===============
  describe('API Établissements', () => {
    it('should list établissements', async () => {
      const response = await request(app)
        .get('/api/etablissements')
        .expect(200);

      expect(response.body).toHaveProperty('success');
    });
  });

  // =============== ERROR HANDLING ===============
  describe('Error Handling', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/api/unknown')
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toBeTruthy();
    });

    it('should handle CORS requests', async () => {
      const response = await request(app)
        .get('/health')
        .set('Origin', 'http://localhost:3000')
        .expect(200);

      expect(response.body.status).toBe('OK');
    });
  });
});

describe('API Response Format', () => {
  it('all endpoints should return consistent format', async () => {
    const endpoints = [
      '/api/eleves',
      '/api/classes',
      '/api/enseignants',
      '/api/matieres',
      '/api/presences',
      '/api/notes',
      '/api/paiements',
      '/api/emploitempss',
      '/api/personnel',
      '/api/messages',
      '/api/depenses',
      '/api/etablissements'
    ];

    for (const endpoint of endpoints) {
      const response = await request(app).get(endpoint);

      // Check response structure
      expect(response.body).toHaveProperty('success');
      if (response.status === 200) {
        expect(response.body.data).toBeDefined();
      }
    }
  });
});
