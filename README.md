# Speller

A multilingual spelling game that helps users learn vocabulary in English, Dutch, and German. Players see a sentence with a missing word and an accompanying image that provides a visual clue for the correct answer.

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

### Running the Game

1. **Simple HTTP Server** (Recommended):
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
├── index.html          # Main game interface
├── style.css           # Game styling
├── script.js           # Game logic and functionality
├── data.json           # Multilingual word data
├── images/             # Word images
│   ├── cat.svg
│   ├── house.svg
│   ├── sun.svg
│   ├── apple.svg
│   └── fish.svg
└── README.md           # This file
```

## Technical Details

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Images**: SVG format for scalability
- **Data Format**: JSON for easy multilingual content management
- **Browser Compatibility**: Modern browsers (Chrome, Firefox, Safari, Edge)

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