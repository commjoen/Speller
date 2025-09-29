// Speller Game Class for Testing
// This is a copy of the main SpellerGame class modified for testing

class SpellerGame {
  constructor() {
    this.data = {};
    this.currentLanguage = 'en';
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.questions = [];
    this.gameCompleted = false;
    this.timeLimit = 30; // 30 seconds per question
    this.timeRemaining = this.timeLimit;
    this.timerInterval = null;
    this.translations = this.initTranslations();

    this.initializeElements();
    this.loadData();
    this.setupEventListeners();
  }

  initTranslations() {
    return {
      en: {
        language: 'Language:',
        version: 'Version:',
        score: 'Score:',
        question: 'Question:',
        time: 'Time:',
        check: 'Check',
        nextQuestion: 'Next Question',
        restartGame: 'Restart Game',
        inputPlaceholder: 'Type the missing word here...',
        correct: 'Correct! The answer is',
        incorrect: 'Incorrect. The correct answer is',
        timeUp: "Time's up! The correct answer is",
        gameComplete: 'Game Complete!',
        finalScore: 'Your final score:',
        noQuestions: 'No questions available for this language.',
        errorLoading: 'Error loading game data. Please refresh the page.',
        excellentWork: "Excellent work! You're a spelling champion! 🏆",
        greatJob: "Great job! You're doing well! 👍",
        goodEffort: 'Good effort! Keep practicing! 😊',
        keepTrying: 'Keep trying! Practice makes perfect! 💪',
      },
      nl: {
        language: 'Taal:',
        version: 'Versie:',
        score: 'Score:',
        question: 'Vraag:',
        time: 'Tijd:',
        check: 'Controleren',
        nextQuestion: 'Volgende Vraag',
        restartGame: 'Herstart Spel',
        inputPlaceholder: 'Typ het ontbrekende woord hier...',
        correct: 'Correct! Het antwoord is',
        incorrect: 'Incorrect. Het juiste antwoord is',
        timeUp: 'Tijd is om! Het juiste antwoord is',
        gameComplete: 'Spel Voltooid!',
        finalScore: 'Je eindscore:',
        noQuestions: 'Geen vragen beschikbaar voor deze taal.',
        errorLoading: 'Fout bij het laden van spelgegevens. Ververs de pagina.',
        excellentWork: 'Uitstekend werk! Je bent een spelkampioen! 🏆',
        greatJob: 'Goed gedaan! Je doet het goed! 👍',
        goodEffort: 'Goede poging! Blijf oefenen! 😊',
        keepTrying: 'Blijf proberen! Oefening baart kunst! 💪',
      },
      de: {
        language: 'Sprache:',
        version: 'Version:',
        score: 'Punkte:',
        question: 'Frage:',
        time: 'Zeit:',
        check: 'Prüfen',
        nextQuestion: 'Nächste Frage',
        restartGame: 'Spiel Neustarten',
        inputPlaceholder: 'Gib das fehlende Wort hier ein...',
        correct: 'Richtig! Die Antwort ist',
        incorrect: 'Falsch. Die richtige Antwort ist',
        timeUp: 'Zeit ist um! Die richtige Antwort ist',
        gameComplete: 'Spiel Beendet!',
        finalScore: 'Deine Endpunktzahl:',
        noQuestions: 'Keine Fragen für diese Sprache verfügbar.',
        errorLoading: 'Fehler beim Laden der Spieldaten. Bitte lade die Seite neu.',
        excellentWork: 'Hervorragende Arbeit! Du bist ein Rechtschreibchampion! 🏆',
        greatJob: 'Großartige Arbeit! Du machst das gut! 👍',
        goodEffort: 'Gute Anstrengung! Weiter üben! 😊',
        keepTrying: 'Weiter versuchen! Übung macht den Meister! 💪',
      },
    };
  }

  initializeElements() {
    this.languageSelect = document.getElementById('language');
    this.sentenceElement = document.getElementById('sentence');
    this.imageElement = document.getElementById('word-image');
    this.answerInput = document.getElementById('answer-input');
    this.checkButton = document.getElementById('check-button');
    this.nextButton = document.getElementById('next-button');
    this.restartButton = document.getElementById('restart-button');
    this.feedbackElement = document.getElementById('feedback');
    this.scoreElement = document.getElementById('score');
    this.currentQuestionElement = document.getElementById('current-question');
    this.totalQuestionsElement = document.getElementById('total-questions');
    this.timerElement = document.getElementById('timer');
    this.versionElement = document.getElementById('app-version');
  }

  async loadData() {
    try {
      const response = await fetch('data.json');
      this.data = await response.json();
      await this.loadVersion();
      this.updateUITranslations();
      this.startGame();
    } catch (error) {
      console.error('Error loading data:', error);
      this.sentenceElement.textContent = this.getTranslation('errorLoading');
    }
  }

  async loadVersion() {
    try {
      const response = await fetch('package.json');
      const packageData = await response.json();
      this.version = packageData.version;
      if (this.versionElement) {
        this.versionElement.textContent = this.version;
      }
    } catch (error) {
      console.error('Error loading version:', error);
      this.version = '1.0.0'; // fallback version
      if (this.versionElement) {
        this.versionElement.textContent = this.version;
      }
    }
  }

  getTranslation(key) {
    return this.translations[this.currentLanguage][key] || key;
  }

  updateUITranslations() {
    // Update translatable elements
    const translatableElements = document.querySelectorAll('[data-translate]');
    translatableElements.forEach(element => {
      const key = element.getAttribute('data-translate');
      element.textContent = this.getTranslation(key);
    });

    // Update placeholder text
    const placeholderElements = document.querySelectorAll('[data-translate-placeholder]');
    placeholderElements.forEach(element => {
      const key = element.getAttribute('data-translate-placeholder');
      element.placeholder = this.getTranslation(key);
    });
  }

  setupEventListeners() {
    this.languageSelect.addEventListener('change', () => {
      this.currentLanguage = this.languageSelect.value;
      this.startGame();
    });

    this.checkButton.addEventListener('click', () => {
      this.checkAnswer();
    });

    this.nextButton.addEventListener('click', () => {
      this.nextQuestion();
    });

    this.restartButton.addEventListener('click', () => {
      this.startGame();
    });

    this.answerInput.addEventListener('keypress', e => {
      if (e.key === 'Enter') {
        if (this.checkButton.style.display !== 'none') {
          this.checkAnswer();
        } else if (this.nextButton.style.display !== 'none') {
          this.nextQuestion();
        }
      }
    });

    // Handle image loading errors
    this.imageElement.addEventListener('error', () => {
      this.showPlaceholderImage();
    });
  }

  startGame() {
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.gameCompleted = false;
    this.questions = this.data[this.currentLanguage] || [];

    if (this.questions.length === 0) {
      this.sentenceElement.textContent = 'No questions available for this language.';
      return;
    }

    this.updateScore();
    this.updateQuestionCounter();
    this.loadQuestion();
    this.resetUI();
  }

  loadQuestion() {
    if (this.currentQuestionIndex >= this.questions.length) {
      this.endGame();
      return;
    }

    const question = this.questions[this.currentQuestionIndex];

    // Display sentence with input field instead of {blank}
    const sentenceWithInput = question.sentence.replace(
      '{blank}',
      '<input type="text" id="sentence-input" class="sentence-input" readonly placeholder="___">'
    );
    this.sentenceElement.innerHTML = sentenceWithInput;

    // Load image
    this.imageElement.src = question.image;
    this.imageElement.alt = `Image for: ${question.word}`;

    // Clear previous answer
    this.answerInput.value = '';
    this.answerInput.focus();

    this.updateQuestionCounter();
  }

  checkAnswer() {
    const question = this.questions[this.currentQuestionIndex];
    const userAnswer = this.answerInput.value.trim().toLowerCase();
    const correctAnswer = question.word.toLowerCase();

    if (userAnswer === correctAnswer) {
      this.score++;
      this.showFeedback(true, `Correct! The answer is "${question.word}".`);

      // Fill in the sentence input with the correct answer
      const sentenceInput = document.getElementById('sentence-input');
      if (sentenceInput) {
        sentenceInput.value = question.word;
        sentenceInput.style.background = '#d4edda';
        sentenceInput.style.color = '#155724';
      }
    } else {
      this.showFeedback(false, `Incorrect. The correct answer is "${question.word}".`);

      // Fill in the sentence input with the correct answer
      const sentenceInput = document.getElementById('sentence-input');
      if (sentenceInput) {
        sentenceInput.value = question.word;
        sentenceInput.style.background = '#f8d7da';
        sentenceInput.style.color = '#721c24';
      }
    }

    this.updateScore();
    this.checkButton.style.display = 'none';
    this.answerInput.disabled = true;

    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.nextButton.style.display = 'inline-block';
    } else {
      this.restartButton.style.display = 'inline-block';
    }
  }

  nextQuestion() {
    this.currentQuestionIndex++;
    this.loadQuestion();
    this.resetUI();
  }

  endGame() {
    this.gameCompleted = true;
    const percentage = Math.round((this.score / this.questions.length) * 100);

    this.sentenceElement.innerHTML = `
            <div class="game-complete">
                <h2>Game Complete!</h2>
                <p>Your final score: ${this.score} / ${this.questions.length} (${percentage}%)</p>
                <p>${this.getPerformanceMessage(percentage)}</p>
            </div>
        `;

    this.imageElement.style.display = 'none';
    this.answerInput.style.display = 'none';
    this.checkButton.style.display = 'none';
    this.nextButton.style.display = 'none';
    this.restartButton.style.display = 'inline-block';
    this.feedbackElement.textContent = '';
  }

  getPerformanceMessage(percentage) {
    if (percentage >= 90) return "Excellent work! You're a spelling champion! 🏆";
    if (percentage >= 70) return "Great job! You're doing well! 👍";
    if (percentage >= 50) return 'Good effort! Keep practicing! 😊';
    return 'Keep trying! Practice makes perfect! 💪';
  }

  showFeedback(isCorrect, message) {
    this.feedbackElement.textContent = message;
    this.feedbackElement.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
  }

  updateScore() {
    this.scoreElement.textContent = this.score;
  }

  updateQuestionCounter() {
    this.currentQuestionElement.textContent = this.currentQuestionIndex + 1;
    this.totalQuestionsElement.textContent = this.questions.length;
  }

  resetUI() {
    this.checkButton.style.display = 'inline-block';
    this.nextButton.style.display = 'none';
    this.restartButton.style.display = 'none';
    this.answerInput.style.display = 'inline-block';
    this.answerInput.disabled = false;
    this.imageElement.style.display = 'block';
    this.feedbackElement.textContent = '';
    this.feedbackElement.className = 'feedback';
  }

  showPlaceholderImage() {
    // Create a placeholder div if image fails to load
    const placeholder = document.createElement('div');
    placeholder.className = 'placeholder-image';
    placeholder.textContent = 'Image not available';

    this.imageElement.style.display = 'none';
    this.imageElement.parentNode.appendChild(placeholder);
  }
}

module.exports = SpellerGame;
