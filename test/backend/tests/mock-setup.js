// Mock setup para tests unitarios que no requieren base de datos real

// Mock de bcryptjs para tests
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn().mockResolvedValue(true),
  genSalt: jest.fn().mockResolvedValue('salt')
}));

// Setup global para mocks
beforeAll(() => {
  // Configuración global de mocks
  process.env.NODE_ENV = 'test';
});

afterEach(() => {
  // Limpiar mocks después de cada test
  jest.clearAllMocks();
});