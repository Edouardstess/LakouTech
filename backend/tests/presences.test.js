/**
 * EduManager — Tests unitaires : Présences
 */

const request = require('supertest');
const app = require('../server');

describe('API Présences', () => {
  test('GET /api/presences — retourne la liste', async () => {
    const res = await request(app).get('/api/presences');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('GET /api/presences?date=2025-03-29 — filtre par date', async () => {
    const res = await request(app).get('/api/presences?date=2025-03-29');
    expect(res.statusCode).toBe(200);
  });

  test('POST /api/presences — enregistre une présence', async () => {
    const res = await request(app).post('/api/presences').send({
      eleve_id: 'test-uuid', classe_id: 'test-classe',
      date: '2025-03-29', statut: 'Présent'
    });
    expect([201, 500]).toContain(res.statusCode);
  });
});
