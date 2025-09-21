// Jest setup file
// Mock DOM elements that the SpellerGame class expects
const mockElement = {
  textContent: '',
  innerHTML: '',
  style: { display: 'block' },
  value: '',
  disabled: false,
  className: '',
  addEventListener: jest.fn(),
  parentNode: {
    appendChild: jest.fn()
  }
};

// Mock fetch for loading data.json
global.fetch = jest.fn();

// Mock document methods
global.document = {
  getElementById: jest.fn(() => mockElement),
  createElement: jest.fn(() => mockElement),
  addEventListener: jest.fn()
};

// Mock console.error to avoid noise in tests
global.console.error = jest.fn();

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  
  // Reset mock element properties
  Object.assign(mockElement, {
    textContent: '',
    innerHTML: '',
    style: { display: 'block' },
    value: '',
    disabled: false,
    className: ''
  });
});