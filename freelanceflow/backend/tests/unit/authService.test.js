// Unit tests for authService.
jest.mock('../../src/services/emailService', () => ({
  sendEmailVerification: jest.fn(),
  sendPasswordReset: jest.fn(),
}));

const authService = require('../../src/services/authService');
const User = require('../../src/models/User');
const { connectTestDb, clearTestDb, closeTestDb } = require('../helpers/testDb');

beforeAll(async () => {
  process.env.JWT_SECRET = 'testsecretkey_testsecretkey_testsecretkey';
  await connectTestDb();
});

afterEach(async () => {
  await clearTestDb();
});

afterAll(async () => {
  await closeTestDb();
});

describe('authService', () => {
  test('registerUser creates a user with hashed password', async () => {
    const result = await authService.registerUser('Jane Doe', 'jane@test.com', 'SecurePass123!');
    const user = await User.findOne({ email: 'jane@test.com' });

    expect(result.email).toBe('jane@test.com');
    expect(user).toBeTruthy();
    expect(user.passwordHash).not.toBe('SecurePass123!');
  });

  test('loginUser rejects unverified users', async () => {
    await authService.registerUser('Jane Doe', 'jane@test.com', 'SecurePass123!');
    await expect(authService.loginUser('jane@test.com', 'SecurePass123!')).rejects.toThrow(
      'Please verify your email before logging in'
    );
  });
});
