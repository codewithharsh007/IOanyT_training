// Unit tests for invoiceService.
const invoiceService = require('../../src/services/invoiceService');
const timeLogService = require('../../src/services/timeLogService');
const { connectTestDb, clearTestDb, closeTestDb } = require('../helpers/testDb');
const { createTestUser, createTestClient, createTestProject, createTestTimeLog } = require('../helpers/testFactories');

beforeAll(async () => {
  await connectTestDb();
});

afterEach(async () => {
  await clearTestDb();
});

afterAll(async () => {
  await closeTestDb();
});

describe('invoiceService', () => {
  test('createInvoice computes totals', async () => {
    const user = await createTestUser();
    const client = await createTestClient(user._id);

    const invoice = await invoiceService.createInvoice(user._id.toString(), {
      clientId: client._id.toString(),
      issueDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      lineItems: [{ description: 'Work', quantity: 2, rate: 50 }],
      taxPercent: 10,
    });

    expect(Number(invoice.totalAmount)).toBe(110);
  });

  test('sendInvoice locks time logs', async () => {
    const user = await createTestUser();
    const client = await createTestClient(user._id);
    const project = await createTestProject(user._id, client._id);
    const timeLog = await createTestTimeLog(user._id, project._id);

    const invoice = await invoiceService.createInvoice(user._id.toString(), {
      clientId: client._id.toString(),
      projectId: project._id.toString(),
      issueDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      lineItems: [{ description: 'Work', quantity: 1, rate: 100 }],
      timeLogIds: [timeLog._id.toString()],
    });

    await timeLogService.lockTimeLogs([timeLog._id], invoice._id);
    const updatedTimeLog = await timeLogService.getAllTimeLogs(user._id.toString(), {});
    expect(updatedTimeLog.timeLogs[0].status).toBe('Locked');
  });
});
