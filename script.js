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
                language: "Language:",
                score: "Score:",
                question: "Question:",
                time: "Time:",
                check: "Check",
                nextQuestion: "Next Question",
                restartGame: "Restart Game",
                inputPlaceholder: "Type the missing word here...",
                correct: "Correct! The answer is",
                incorrect: "Incorrect. The correct answer is",
                timeUp: "Time's up! The correct answer is",
                gameComplete: "Game Complete!",
                finalScore: "Your final score:",
                noQuestions: "No questions available for this language.",
                errorLoading: "Error loading game data. Please refresh the page.",
                excellentWork: "Excellent work! You're a spelling champion! 🏆",
                greatJob: "Great job! You're doing well! 👍",
                goodEffort: "Good effort! Keep practicing! 😊",
                keepTrying: "Keep trying! Practice makes perfect! 💪"
            },
            nl: {
                language: "Taal:",
                score: "Score:",
                question: "Vraag:",
                time: "Tijd:",
                check: "Controleren",
                nextQuestion: "Volgende Vraag",
                restartGame: "Herstart Spel",
                inputPlaceholder: "Typ het ontbrekende woord hier...",
                correct: "Correct! Het antwoord is",
                incorrect: "Onjuist. Het juiste antwoord is",
                timeUp: "Tijd is om! Het juiste antwoord is",
                gameComplete: "Spel Voltooid!",
                finalScore: "Je eindscore:",
                noQuestions: "Geen vragen beschikbaar voor deze taal.",
                errorLoading: "Fout bij het laden van spelgegevens. Ververs de pagina.",
                excellentWork: "Uitstekend werk! Je bent een spelkampioen! 🏆",
                greatJob: "Goed gedaan! Je doet het goed! 👍",
                goodEffort: "Goede poging! Blijf oefenen! 😊",
                keepTrying: "Blijf proberen! Oefening baart kunst! 💪"
            },
            de: {
                language: "Sprache:",
                score: "Punkte:",
                question: "Frage:",
                time: "Zeit:",
                check: "Prüfen",
                nextQuestion: "Nächste Frage",
                restartGame: "Spiel Neustarten",
                inputPlaceholder: "Gib das fehlende Wort hier ein...",
                correct: "Richtig! Die Antwort ist",
                incorrect: "Falsch. Die richtige Antwort ist",
                timeUp: "Zeit ist um! Die richtige Antwort ist",
                gameComplete: "Spiel Beendet!",
                finalScore: "Deine Endpunktzahl:",
                noQuestions: "Keine Fragen für diese Sprache verfügbar.",
                errorLoading: "Fehler beim Laden der Spieldaten. Bitte lade die Seite neu.",
                excellentWork: "Hervorragende Arbeit! Du bist ein Rechtschreibchampion! 🏆",
                greatJob: "Großartige Arbeit! Du machst das gut! 👍",
                goodEffort: "Gute Anstrengung! Weiter üben! 😊",
                keepTrying: "Weiter versuchen! Übung macht den Meister! 💪"
            }
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
    }
    
    async loadData() {
        try {
            const response = await fetch('data.json');
            this.data = await response.json();
            this.updateUITranslations();
            this.startGame();
        } catch (error) {
            console.error('Error loading data:', error);
            this.sentenceElement.textContent = this.getTranslation('errorLoading');
        }
    }
    
    setupEventListeners() {
        this.languageSelect.addEventListener('change', () => {
            this.currentLanguage = this.languageSelect.value;
            this.updateUITranslations();
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
    
    getTranslation(key) {
        return this.translations[this.currentLanguage]?.[key] || this.translations.en[key] || key;
    }
    
    updateUITranslations() {
        // Update elements with data-translate attribute
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            element.textContent = this.getTranslation(key);
        });
        
        // Update placeholder texts
        document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
            const key = element.getAttribute('data-translate-placeholder');
            element.placeholder = this.getTranslation(key);
        });
    }
    
    startGame() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.gameCompleted = false;
        this.questions = this.data[this.currentLanguage] || [];
        
        this.updateUITranslations();
        
        if (this.questions.length === 0) {
            this.sentenceElement.textContent = this.getTranslation('noQuestions');
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
        
        // Load image with error handling
        this.loadImageWithFallback(question.image, question.word);
        
        // Clear previous answer
        this.answerInput.value = '';
        this.answerInput.focus();
        
        this.updateQuestionCounter();
        this.startTimer();
    }
    
    loadImageWithFallback(imageSrc, word) {
        // Reset image state
        this.imageElement.style.display = 'block';
        this.imageElement.alt = `Image for: ${word}`;
        
        // Remove any existing error handlers
        this.imageElement.onerror = null;
        this.imageElement.onload = null;
        
        // Set up error handling
        this.imageElement.onerror = () => {
            console.warn(`Failed to load image: ${imageSrc}`);
            this.showPlaceholderImage(word);
        };
        
        this.imageElement.onload = () => {
            console.log(`Successfully loaded image: ${imageSrc}`);
        };
        
        // Attempt to load the image
        this.imageElement.src = imageSrc;
    }
    
    checkAnswer() {
        this.stopTimer();
        
        const question = this.questions[this.currentQuestionIndex];
        const userAnswer = this.answerInput.value.trim().toLowerCase();
        const correctAnswer = question.word.toLowerCase();
        
        if (userAnswer === correctAnswer) {
            this.score++;
            this.showFeedback(true, `${this.getTranslation('correct')} "${question.word}".`);
            
            // Fill in the sentence input with the correct answer
            const sentenceInput = document.getElementById('sentence-input');
            if (sentenceInput) {
                sentenceInput.value = question.word;
                sentenceInput.style.background = '#d4edda';
                sentenceInput.style.color = '#155724';
            }
        } else {
            this.showFeedback(false, `${this.getTranslation('incorrect')} "${question.word}".`);
            
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
        this.stopTimer();
        this.gameCompleted = true;
        const percentage = Math.round((this.score / this.questions.length) * 100);
        
        this.sentenceElement.innerHTML = `
            <div class="game-complete">
                <h2>${this.getTranslation('gameComplete')}</h2>
                <p>${this.getTranslation('finalScore')} ${this.score} / ${this.questions.length} (${percentage}%)</p>
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
        if (percentage >= 90) return this.getTranslation('excellentWork');
        if (percentage >= 70) return this.getTranslation('greatJob');
        if (percentage >= 50) return this.getTranslation('goodEffort');
        return this.getTranslation('keepTrying');
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
        this.timerElement.classList.remove('warning', 'danger');
    }
    
    showPlaceholderImage(word = 'Unknown') {
        // Remove any existing placeholder
        const existingPlaceholder = this.imageElement.parentNode.querySelector('.placeholder-image');
        if (existingPlaceholder) {
            existingPlaceholder.remove();
        }
        
        // Create a placeholder div if image fails to load
        const placeholder = document.createElement('div');
        placeholder.className = 'placeholder-image';
        placeholder.innerHTML = `
            <div class="placeholder-content">
                <div class="placeholder-icon">🖼️</div>
                <div class="placeholder-text">${word}</div>
                <div class="placeholder-subtitle">Image not available</div>
            </div>
        `;
        
        // Add styles for the placeholder
        placeholder.style.cssText = `
            width: 200px;
            height: 200px;
            border: 3px solid #667eea;
            border-radius: 15px;
            background: #f0f4f7;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .placeholder-content {
                text-align: center;
                color: #667eea;
            }
            .placeholder-icon {
                font-size: 48px;
                margin-bottom: 10px;
            }
            .placeholder-text {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 5px;
                text-transform: capitalize;
            }
            .placeholder-subtitle {
                font-size: 12px;
                color: #999;
            }
        `;
        if (!document.head.querySelector('style[data-placeholder]')) {
            style.setAttribute('data-placeholder', 'true');
            document.head.appendChild(style);
        }
        
        this.imageElement.style.display = 'none';
        this.imageElement.parentNode.appendChild(placeholder);
    }
    
    startTimer() {
        this.timeRemaining = this.timeLimit;
        this.updateTimer();
        
        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            this.updateTimer();
            
            if (this.timeRemaining <= 0) {
                this.timeUp();
            }
        }, 1000);
    }
    
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
    
    updateTimer() {
        this.timerElement.textContent = this.timeRemaining;
        
        // Remove all timer classes
        this.timerElement.classList.remove('warning', 'danger');
        
        // Add appropriate class based on time remaining
        if (this.timeRemaining <= 5) {
            this.timerElement.classList.add('danger');
        } else if (this.timeRemaining <= 10) {
            this.timerElement.classList.add('warning');
        }
    }
    
    timeUp() {
        this.stopTimer();
        this.showFeedback(false, `${this.getTranslation('timeUp')} "${this.questions[this.currentQuestionIndex].word}".`);
        
        // Fill in the sentence input with the correct answer
        const sentenceInput = document.getElementById('sentence-input');
        if (sentenceInput) {
            sentenceInput.value = this.questions[this.currentQuestionIndex].word;
            sentenceInput.style.background = '#f8d7da';
            sentenceInput.style.color = '#721c24';
        }
        
        this.checkButton.style.display = 'none';
        this.answerInput.disabled = true;
        
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.nextButton.style.display = 'inline-block';
        } else {
            this.restartButton.style.display = 'inline-block';
        }
    }
}

// Additional CSS for sentence input
const style = document.createElement('style');
style.textContent = `
    .sentence-input {
        border: none;
        border-bottom: 2px solid #667eea;
        background: transparent;
        font-size: inherit;
        font-family: inherit;
        padding: 2px 8px;
        min-width: 100px;
        text-align: center;
        outline: none;
    }
    
    .sentence-input:focus {
        border-bottom-color: #333;
    }
    
    .game-complete {
        text-align: center;
        padding: 30px;
    }
    
    .game-complete h2 {
        color: #667eea;
        margin-bottom: 20px;
        font-size: 2em;
    }
    
    .game-complete p {
        margin: 10px 0;
        font-size: 1.1em;
    }
`;
document.head.appendChild(style);

// PWA functionality
class PWAManager {
    constructor() {
        this.deferredPrompt = null;
        this.installButton = null;
        this.init();
    }
    
    init() {
        this.registerServiceWorker();
        this.setupInstallPrompt();
        this.addInstallButton();
        this.handleAppInstalled();
    }
    
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker registered successfully:', registration);
                
                // Handle service worker updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.showUpdateAvailable();
                        }
                    });
                });
                
                // Check for updates periodically
                setInterval(() => {
                    registration.update();
                }, 60000); // Check every minute
                
            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        }
    }
    
    setupInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('beforeinstallprompt event fired');
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });
    }
    
    addInstallButton() {
        // Create install button
        this.installButton = document.createElement('button');
        this.installButton.textContent = '📱 Install App';
        this.installButton.id = 'install-button';
        this.installButton.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 1000;
            display: none;
            transition: background 0.3s ease;
        `;
        
        this.installButton.addEventListener('mouseenter', () => {
            this.installButton.style.background = '#45a049';
        });
        
        this.installButton.addEventListener('mouseleave', () => {
            this.installButton.style.background = '#4CAF50';
        });
        
        this.installButton.addEventListener('click', () => {
            this.installApp();
        });
        
        document.body.appendChild(this.installButton);
    }
    
    showInstallButton() {
        if (this.installButton) {
            this.installButton.style.display = 'block';
        }
    }
    
    hideInstallButton() {
        if (this.installButton) {
            this.installButton.style.display = 'none';
        }
    }
    
    async installApp() {
        if (!this.deferredPrompt) {
            console.log('No install prompt available');
            return;
        }
        
        try {
            this.deferredPrompt.prompt();
            const { outcome } = await this.deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                console.log('User accepted the install prompt');
                this.hideInstallButton();
            } else {
                console.log('User dismissed the install prompt');
            }
            
            this.deferredPrompt = null;
        } catch (error) {
            console.error('Error during app installation:', error);
        }
    }
    
    handleAppInstalled() {
        window.addEventListener('appinstalled', () => {
            console.log('App was installed successfully');
            this.hideInstallButton();
            this.showInstalledMessage();
        });
    }
    
    showInstalledMessage() {
        const message = document.createElement('div');
        message.textContent = '🎉 App installed successfully!';
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 1001;
            font-size: 14px;
            animation: slideIn 0.3s ease;
        `;
        
        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(message);
        
        // Remove message after 3 seconds
        setTimeout(() => {
            message.remove();
        }, 3000);
    }
    
    showUpdateAvailable() {
        const updateBanner = document.createElement('div');
        updateBanner.innerHTML = `
            <div style="background: #ff9800; color: white; padding: 10px; text-align: center; position: fixed; top: 0; left: 0; right: 0; z-index: 1002;">
                🔄 A new version is available! 
                <button onclick="window.location.reload()" style="background: white; color: #ff9800; border: none; padding: 5px 10px; margin-left: 10px; border-radius: 3px; cursor: pointer;">
                    Update Now
                </button>
                <button onclick="this.parentElement.remove()" style="background: none; color: white; border: 1px solid white; padding: 5px 10px; margin-left: 5px; border-radius: 3px; cursor: pointer;">
                    Later
                </button>
            </div>
        `;
        document.body.insertBefore(updateBanner, document.body.firstChild);
    }
    
    // Check if app is running as PWA
    isRunningAsPWA() {
        return window.matchMedia('(display-mode: standalone)').matches ||
               window.navigator.standalone === true;
    }
    
    // Handle network status
    setupNetworkStatusHandling() {
        const showNetworkStatus = (online) => {
            const statusBar = document.getElementById('network-status') || document.createElement('div');
            statusBar.id = 'network-status';
            statusBar.style.cssText = `
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                padding: 10px;
                text-align: center;
                color: white;
                font-size: 14px;
                z-index: 1003;
                transition: transform 0.3s ease;
                ${online ? 'background: #4CAF50; transform: translateY(100%);' : 'background: #f44336; transform: translateY(0);'}
            `;
            statusBar.textContent = online ? '🌐 Back online!' : '📱 You are offline - using cached content';
            
            if (!document.getElementById('network-status')) {
                document.body.appendChild(statusBar);
            }
            
            if (online) {
                setTimeout(() => {
                    statusBar.style.transform = 'translateY(100%)';
                    setTimeout(() => statusBar.remove(), 300);
                }, 2000);
            }
        };
        
        window.addEventListener('online', () => showNetworkStatus(true));
        window.addEventListener('offline', () => showNetworkStatus(false));
        
        // Show initial status if offline
        if (!navigator.onLine) {
            showNetworkStatus(false);
        }
    }
}

// Enhanced Game Loading with PWA features
document.addEventListener('DOMContentLoaded', () => {
    // Initialize PWA functionality
    const pwaManager = new PWAManager();
    pwaManager.setupNetworkStatusHandling();
    
    // Initialize the game
    const game = new SpellerGame();
    
    // Add PWA-specific features to the game
    if (pwaManager.isRunningAsPWA()) {
        console.log('Running as PWA');
        // Add any PWA-specific game features here
        document.body.classList.add('pwa-mode');
    }
    
    // Handle URL parameters for shortcuts
    const urlParams = new URLSearchParams(window.location.search);
    const lang = urlParams.get('lang');
    if (lang && ['en', 'nl', 'de'].includes(lang)) {
        // Set the language from URL parameter
        setTimeout(() => {
            const languageSelect = document.getElementById('language');
            if (languageSelect) {
                languageSelect.value = lang;
                languageSelect.dispatchEvent(new Event('change'));
            }
        }, 100);
    }
});