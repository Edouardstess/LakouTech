/**
 * EduManager — Tests unitaires : Élèves
 */

const request = require('supertest');
const app = require('../server');

describe('API Élèves', () => {
  let eleveId;

  test('GET /api/eleves — retourne une liste', async () => {
    const res = await request(app).get('/api/eleves');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('POST /api/eleves — crée un élève', async () => {
    const res = await request(app).post('/api/eleves').send({
      nom: 'PIERRE', prenom: 'Jean', sexe: 'M',
      date_naissance: '2010-03-15', numero_matricule: 'TEST-001'
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.nom).toBe('PIERRE');
    eleveId = res.body.data.id;
  });

  test('GET /api/eleves/:id — récupère un élève', async () => {
    if (!eleveId) return;
    const res = await request(app).get(`/api/eleves/${eleveId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.id).toBe(eleveId);
  });

  test('PUT /api/eleves/:id — modifie un élève', async () => {
    if (!eleveId) return;
    const res = await request(app).put(`/api/eleves/${eleveId}`).send({ statut: 'Inactif' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.statut).toBe('Inactif');
  });

  test('DELETE /api/eleves/:id — supprime un élève', async () => {
    if (!eleveId) return;
    const res = await request(app).delete(`/api/eleves/${eleveId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
