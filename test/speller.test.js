// Import the SpellerGame class
const SpellerGame = require('./SpellerGame');

describe('SpellerGame', () => {
  let game;
  const mockData = {
    en: [
      {
        sentence: "The {blank} is sleeping on the mat.",
        word: "cat",
        image: "images/cat.svg",
        hint: "A furry pet that meows"
      },
      {
        sentence: "I live in a big {blank} with my family.",
        word: "house",
        image: "images/house.svg",
        hint: "A place where people live"
      }
    ],
    nl: [
      {
        sentence: "De {blank} slaapt op de mat.",
        word: "kat",
        image: "images/cat.svg",
        hint: "Een harig huisdier dat miauwt"
      }
    ]
  };

  beforeEach(() => {
    // Mock fetch to return our test data
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockData)
    });

    // Create game instance manually to avoid constructor DOM calls
    game = Object.create(SpellerGame.prototype);
    game.data = {};
    game.currentLanguage = 'en';
    game.currentQuestionIndex = 0;
    game.score = 0;
    game.questions = [];
    game.gameCompleted = false;
    
    // Mock DOM elements
    game.sentenceElement = { textContent: '', innerHTML: '' };
    game.imageElement = { src: '', alt: '', style: { display: 'block' }, parentNode: { appendChild: jest.fn() } };
    game.answerInput = { value: '', disabled: false, style: { display: 'block' }, focus: jest.fn() };
    game.checkButton = { style: { display: 'inline-block' } };
    game.nextButton = { style: { display: 'none' } };
    game.restartButton = { style: { display: 'none' } };
    game.feedbackElement = { textContent: '', className: 'feedback' };
    game.scoreElement = { 
      set textContent(value) { this._textContent = String(value); },
      get textContent() { return this._textContent; },
      _textContent: '0'
    };
    game.currentQuestionElement = { 
      set textContent(value) { this._textContent = String(value); },
      get textContent() { return this._textContent; },
      _textContent: '1'
    };
    game.totalQuestionsElement = { 
      set textContent(value) { this._textContent = String(value); },
      get textContent() { return this._textContent; },
      _textContent: '0'
    };
    game.languageSelect = { value: 'en', addEventListener: jest.fn() };
  });

  describe('Game Logic', () => {
    beforeEach(() => {
      game.data = mockData;
    });

    test('should start game with correct initial state', () => {
      game.startGame();
      
      expect(game.currentQuestionIndex).toBe(0);
      expect(game.score).toBe(0);
      expect(game.gameCompleted).toBe(false);
      expect(game.questions).toEqual(mockData.en);
    });

    test('should load questions for selected language', () => {
      game.currentLanguage = 'nl';
      game.startGame();
      expect(game.questions).toEqual(mockData.nl);
    });

    test('should handle empty question data', () => {
      game.data = { en: [] };
      game.startGame();
      expect(game.sentenceElement.textContent).toBe('No questions available for this language.');
    });
  });

  describe('Answer Checking', () => {
    beforeEach(() => {
      game.data = mockData;
      game.startGame();
    });

    test('should accept correct answer (case insensitive)', () => {
      game.answerInput.value = 'CAT';
      game.checkAnswer();
      
      expect(game.score).toBe(1);
      expect(game.feedbackElement.className).toBe('feedback correct');
      expect(game.feedbackElement.textContent).toContain('Correct!');
    });

    test('should reject incorrect answer', () => {
      game.answerInput.value = 'dog';
      game.checkAnswer();
      
      expect(game.score).toBe(0);
      expect(game.feedbackElement.className).toBe('feedback incorrect');
      expect(game.feedbackElement.textContent).toContain('Incorrect');
    });

    test('should trim whitespace from answers', () => {
      game.answerInput.value = '  cat  ';
      game.checkAnswer();
      
      expect(game.score).toBe(1);
      expect(game.feedbackElement.className).toBe('feedback correct');
    });

    test('should update UI after checking answer', () => {
      game.answerInput.value = 'cat';
      game.checkAnswer();
      
      expect(game.checkButton.style.display).toBe('none');
      expect(game.answerInput.disabled).toBe(true);
    });
  });

  describe('Question Navigation', () => {
    beforeEach(() => {
      game.data = mockData;
      game.startGame();
    });

    test('should move to next question', () => {
      expect(game.currentQuestionIndex).toBe(0);
      game.nextQuestion();
      expect(game.currentQuestionIndex).toBe(1);
    });

    test('should end game when all questions answered', () => {
      game.currentQuestionIndex = mockData.en.length;
      game.endGame();
      
      expect(game.gameCompleted).toBe(true);
      expect(game.imageElement.style.display).toBe('none');
      expect(game.answerInput.style.display).toBe('none');
      expect(game.restartButton.style.display).toBe('inline-block');
    });
  });

  describe('Scoring and Performance', () => {
    test('should calculate percentage correctly', () => {
      game.score = 8;
      game.questions = new Array(10);
      game.endGame();
      
      expect(game.sentenceElement.innerHTML).toContain('8 / 10 (80%)');
    });

    test('should return appropriate performance messages', () => {
      expect(game.getPerformanceMessage(95)).toContain('Excellent work');
      expect(game.getPerformanceMessage(75)).toContain('Great job');
      expect(game.getPerformanceMessage(55)).toContain('Good effort');
      expect(game.getPerformanceMessage(30)).toContain('Keep trying');
    });
  });

  describe('UI Updates', () => {
    beforeEach(() => {
      game.data = mockData;
    });

    test('should update score display', () => {
      game.score = 5;
      game.updateScore();
      expect(game.scoreElement.textContent).toBe('5');
    });

    test('should update question counter', () => {
      game.currentQuestionIndex = 2;
      game.questions = new Array(5);
      game.updateQuestionCounter();
      
      expect(game.currentQuestionElement.textContent).toBe('3');
      expect(game.totalQuestionsElement.textContent).toBe('5');
    });

    test('should reset UI correctly', () => {
      game.resetUI();
      
      expect(game.checkButton.style.display).toBe('inline-block');
      expect(game.nextButton.style.display).toBe('none');
      expect(game.restartButton.style.display).toBe('none');
      expect(game.answerInput.style.display).toBe('inline-block');
      expect(game.answerInput.disabled).toBe(false);
      expect(game.imageElement.style.display).toBe('block');
      expect(game.feedbackElement.textContent).toBe('');
      expect(game.feedbackElement.className).toBe('feedback');
    });
  });

  describe('Language Switching', () => {
    beforeEach(() => {
      game.data = mockData;
    });

    test('should switch language and restart game', () => {
      game.currentLanguage = 'en';
      game.startGame();
      expect(game.questions.length).toBe(2);
      
      game.currentLanguage = 'nl';
      game.startGame();
      expect(game.questions.length).toBe(1);
      expect(game.questions[0].word).toBe('kat');
    });

    test('should reset score when switching language', () => {
      game.currentLanguage = 'en';
      game.startGame();
      game.score = 5;
      
      game.currentLanguage = 'nl';
      game.startGame();
      expect(game.score).toBe(0);
    });
  });

  describe('Error Handling', () => {
    test('should show placeholder when image fails to load', () => {
      // Mock createElement
      const mockDiv = { className: '', textContent: '' };
      global.document.createElement = jest.fn(() => mockDiv);
      
      game.showPlaceholderImage();
      
      expect(document.createElement).toHaveBeenCalledWith('div');
      expect(game.imageElement.style.display).toBe('none');
      expect(game.imageElement.parentNode.appendChild).toHaveBeenCalledWith(mockDiv);
    });
  });
});
