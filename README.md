# Speller

A multilingual spelling game that helps users learn vocabulary in English, Dutch, and German. Players see a sentence with a missing word and an accompanying image that provides a visual clue for the correct answer.

🚀 **[Play the game live on GitHub Pages!](https://commjoen.github.io/Speller/)**

![Speller Game Screenshot](https://github.com/user-attachments/assets/154b5bc0-62b4-41b4-80b5-69f688f7965a)

## Features

- **Multilingual Support**: Practice spelling in English, Dutch, and German
- **Visual Learning**: Each word is accompanied by a helpful image
- **Interactive Sentences**: Fill in the missing word directly in the sentence
- **Score Tracking**: Keep track of correct answers
- **Responsive Design**: Works on desktop and mobile devices
- **Immediate Feedback**: Get instant feedback on your answers

## How to Play

1. Select your preferred language from the dropdown menu
2. Look at the image to understand what word is missing
3. Read the sentence with the blank space
4. Type the missing word in the input field
5. Click "Check" to submit your answer
6. Review the feedback and click "Next Question" to continue
7. Complete all questions to see your final score

## Supported Languages

- **English**: 5 vocabulary words (cat, house, sun, apple, fish)
- **Dutch**: 5 vocabulary words (kat, huis, zon, appel, vis)
- **German**: 5 vocabulary words (katze, haus, sonne, apfel, fisch)

## Getting Started

### Play Online

🌐 **[Play immediately on GitHub Pages](https://commjoen.github.io/Speller/)** - No setup required!

### Running Locally

1. **Simple HTTP Server** (for development):
   ```bash
   # Using Python 3
   python3 -m http.server 8000
   
   # Using Python 2
   python -m SimpleHTTPServer 8000
   
   # Using Node.js (if you have it installed)
   npx http-server
   ```

2. **Open in Browser**: Navigate to `http://localhost:8000`

### File Structure

```
Speller/
├── .github/
│   └── workflows/
│       ├── deploy.yml    # GitHub Pages deployment workflow
│       ├── test.yml      # Automated testing workflow
│       └── docker.yml    # Container build and push workflow
├── test/                 # Test files
│   ├── SpellerGame.js    # Testable version of game class
│   ├── setup.js          # Jest test setup
│   └── speller.test.js   # Unit tests
├── images/               # Word images
│   ├── cat.svg
│   ├── house.svg
│   ├── sun.svg
│   ├── apple.svg
│   └── fish.svg
├── index.html            # Main game interface
├── style.css             # Game styling
├── script.js             # Game logic and functionality
├── data.json             # Multilingual word data
├── package.json          # Node.js dependencies and scripts
├── Dockerfile            # Container configuration
├── .dockerignore         # Docker build exclusions
├── .gitignore            # Git exclusions
└── README.md             # This file
```

## Technical Details

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Images**: SVG format for scalability
- **Data Format**: JSON for easy multilingual content management
- **Browser Compatibility**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **Deployment**: Automatic deployment to GitHub Pages via GitHub Actions
- **Testing**: Jest framework with comprehensive unit tests
- **Containerization**: Docker support with Node.js Alpine base image
- **Registry**: GitHub Container Registry (GHCR) for container distribution

## Deployment

The game is automatically deployed to GitHub Pages using GitHub Actions whenever changes are pushed to the main branch. The deployment workflow:

1. **Triggers**: Automatically on push to main branch, or manually via GitHub Actions tab
2. **Build**: Sets up GitHub Pages environment and prepares static files
3. **Deploy**: Deploys the game to GitHub Pages at `https://commjoen.github.io/Speller/`

No build process is required since this is a static HTML/CSS/JavaScript application.

### Container Deployment

The application is also available as a Docker container published to GitHub Container Registry:

```bash
# Pull and run the latest container
docker pull ghcr.io/commjoen/speller:latest
docker run -p 8080:8000 ghcr.io/commjoen/speller:latest

# Access the game at http://localhost:8080
```

### Local Development

1. **Clone and install dependencies**:
   ```bash
   git clone https://github.com/commjoen/Speller.git
   cd Speller
   npm install
   ```

2. **Run locally**:
   ```bash
   # Option 1: Using npm
   npm start
   
   # Option 2: Using Docker
   docker build -t speller-local .
   docker run -p 8080:8000 speller-local
   ```

3. **Run tests**:
   ```bash
   # Run all tests
   npm test
   
   # Run tests in watch mode
   npm run test:watch
   ```

## Adding New Content

To add new words or languages, edit the `data.json` file:

```json
{
  "language_code": [
    {
      "sentence": "Example sentence with {blank} placeholder.",
      "word": "answer",
      "image": "images/answer.svg",
      "hint": "Optional hint text"
    }
  ]
}
```

## Game Mechanics

- **Scoring**: 1 point per correct answer
- **Case Insensitive**: Answers are checked regardless of capitalization
- **Visual Feedback**: Correct answers show in green, incorrect in red
- **Progress Tracking**: Shows current question number and total questions
- **Language Reset**: Changing language resets the game and score

## Educational Value

This game is designed to help with:
- **Vocabulary Building**: Learn new words in multiple languages
- **Spelling Practice**: Improve spelling accuracy
- **Visual Association**: Connect words with images for better retention
- **Language Comparison**: See how the same concepts are expressed in different languages