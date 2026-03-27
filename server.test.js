import test from 'node:test';
import assert from 'node:assert/strict';
import process from 'node:process';
process.env.OPENCLAW_TEST = '1';
import request from 'supertest';
const { app } = await import('./server.js');

test('workflow audit scores multi-channel workflow', async () => {
  const response = await request(app)
    .post('/workflow/audit')
    .send({ workflow: 'inbound lead flow', channels: ['ads', 'email', 'sales'] })
    .expect(200);

  assert.ok(response.body.maturityScore >= 68);
  assert.equal(response.body.channels.length, 3);
  assert.ok(response.body.issues[0].includes('manual handoffs'));
});

test('workflow backlog returns actionable tasks', async () => {
  const response = await request(app)
    .post('/workflow/backlog')
    .send({ objective: 'reduce response time' })
    .expect(200);

  assert.equal(response.body.backlog[0].id, 'WF-1');
  assert.equal(response.body.backlog.length, 4);
});
