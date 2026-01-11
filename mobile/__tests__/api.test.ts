import { addMockImageIfNeeded } from '../src/services/api';

// Mock the api module
jest.mock('../src/services/api', () => {
  const actual = jest.requireActual('../src/services/api');
  return {
    ...actual,
    api: {
      get: jest.fn(),
      post: jest.fn(),
    },
  };
});

describe('API Service', () => {
  it('should be importable', () => {
    const { api } = require('../src/services/api');
    expect(api).toBeDefined();
  });

  it('getItems should be a function', () => {
    const { getItems } = require('../src/services/api');
    expect(typeof getItems).toBe('function');
  });

  it('addItem should be a function', () => {
    const { addItem } = require('../src/services/api');
    expect(typeof addItem).toBe('function');
  });
});
