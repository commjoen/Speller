// Version loading tests
const SpellerGame = require('./SpellerGame');

describe('Version Loading', () => {
  let game;
  let originalFetch;

  beforeEach(() => {
    // Mock DOM elements
    document.body.innerHTML = `
      <div id="app-version">1.0.0</div>
      <select id="language">
        <option value="en">English</option>
      </select>
      <div id="sentence">Loading...</div>
      <img id="word-image" />
      <input id="answer-input" />
      <button id="check-button">Check</button>
      <button id="next-button">Next</button>
      <button id="restart-button">Restart</button>
      <div id="feedback"></div>
      <span id="score">0</span>
      <span id="current-question">1</span>
      <span id="total-questions">0</span>
      <span id="timer">30</span>
    `;

    // Mock fetch
    originalFetch = global.fetch;
    global.fetch = jest.fn();

    // Create game instance manually to avoid constructor DOM calls
    game = Object.create(SpellerGame.prototype);
    game.data = {};
    game.currentLanguage = 'en';
    game.currentQuestionIndex = 0;
    game.score = 0;
    game.questions = [];
    game.gameCompleted = false;
    game.timeLimit = 30;
    game.timeRemaining = 30;
    game.timerInterval = null;
    game.version = '1.0.0';
    game.translations = game.initTranslations();
    game.initializeElements();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    if (game.timerInterval) {
      clearInterval(game.timerInterval);
    }
  });

  describe('loadVersion', () => {
    test('should load version from package.json successfully', async () => {
      const mockPackageJson = { version: '2.1.0' };
      global.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockPackageJson),
      });

      await game.loadVersion();

      expect(global.fetch).toHaveBeenCalledWith('package.json');
      expect(game.version).toBe('2.1.0');
      expect(game.versionElement.textContent).toBe('2.1.0');
    });

    test('should handle version loading error gracefully', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await game.loadVersion();

      expect(consoleSpy).toHaveBeenCalledWith('Error loading version:', expect.any(Error));
      expect(game.version).toBe('1.0.0'); // fallback version
      expect(game.versionElement.textContent).toBe('1.0.0');
      
      consoleSpy.mockRestore();
    });

    test('should handle missing version element gracefully', async () => {
      // Remove version element
      document.getElementById('app-version').remove();
      game.versionElement = null;

      const mockPackageJson = { version: '3.0.0' };
      global.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockPackageJson),
      });

      await game.loadVersion();

      expect(game.version).toBe('3.0.0');
      // Should not throw error when version element is missing
    });

    test('should handle malformed package.json', async () => {
      global.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve({}), // missing version field
      });

      await game.loadVersion();

      expect(game.version).toBeUndefined();
      expect(game.versionElement.textContent).toBe('');
    });
  });

  describe('Version display in UI', () => {
    test('should display version in multiple languages', () => {
      // Test English
      game.currentLanguage = 'en';
      expect(game.getTranslation('version')).toBe('Version:');

      // Test Dutch
      game.currentLanguage = 'nl';
      expect(game.getTranslation('version')).toBe('Versie:');

      // Test German
      game.currentLanguage = 'de';
      expect(game.getTranslation('version')).toBe('Version:');
    });

    test('should initialize version element correctly', () => {
      expect(game.versionElement).toBeTruthy();
      expect(game.versionElement.id).toBe('app-version');
    });
  });

  describe('Integration with loadData', () => {
    test('should load version during data loading', async () => {
      const mockData = { en: [{ sentence: 'Test', word: 'test', image: 'test.svg' }] };
      const mockPackageJson = { version: '1.5.0' };

      global.fetch
        .mockResolvedValueOnce({ json: () => Promise.resolve(mockData) })
        .mockResolvedValueOnce({ json: () => Promise.resolve(mockPackageJson) });

      await game.loadData();

      expect(global.fetch).toHaveBeenCalledWith('data.json');
      expect(global.fetch).toHaveBeenCalledWith('package.json');
      expect(game.version).toBe('1.5.0');
      expect(game.data).toEqual(mockData);
    });

    test('should continue working if version loading fails during data loading', async () => {
      const mockData = { en: [{ sentence: 'Test', word: 'test', image: 'test.svg' }] };

      global.fetch
        .mockResolvedValueOnce({ json: () => Promise.resolve(mockData) })
        .mockRejectedValueOnce(new Error('Package.json not found'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await game.loadData();

      expect(game.data).toEqual(mockData);
      expect(game.version).toBe('1.0.0'); // fallback
      expect(consoleSpy).toHaveBeenCalledWith('Error loading version:', expect.any(Error));
      
      consoleSpy.mockRestore();
    });
  });
});