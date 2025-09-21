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
        
        this.initializeElements();
        this.loadData();
        this.setupEventListeners();
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
    }
    
    async loadData() {
        try {
            const response = await fetch('data.json');
            this.data = await response.json();
            this.startGame();
        } catch (error) {
            console.error('Error loading data:', error);
            this.sentenceElement.textContent = 'Error loading game data. Please refresh the page.';
        }
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
        
        this.answerInput.addEventListener('keypress', (e) => {
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
        const sentenceWithInput = question.sentence.replace('{blank}', 
            '<input type="text" id="sentence-input" class="sentence-input" readonly placeholder="___">');
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
        if (percentage >= 50) return "Good effort! Keep practicing! 😊";
        return "Keep trying! Practice makes perfect! 💪";
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