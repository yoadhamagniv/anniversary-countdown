# Anniversary Countdown Website

A special interactive website for your 6-month anniversary countdown to prom!

## Features

- **Main Countdown**: Counts down to October 18th, 7:27 PM Texas time
- **Weekly Mini-Games**: Unlock hints through fun games every week
- **Hint System**: Collect hints and try to guess the surprise
- **Promposal Reveal**: Beautiful animated promposal page when countdown ends
- **Responsive Design**: Works perfectly on mobile and desktop

## Games Schedule

1. **September 19th**: Relationship Quiz
2. **September 27th**: Memory Match Game
3. **October 4th**: Hebrew Word Scramble
4. **October 11th**: CTF Challenge
5. **October 18th**: Final Promposal Reveal

## Deployment to GitHub Pages

### Method 1: Direct Upload
1. Create a new repository on GitHub
2. Upload all files (`index.html`, `styles.css`, `script.js`, `README.md`)
3. Go to repository Settings → Pages
4. Select "Deploy from a branch" → "main" branch
5. Your site will be available at `https://yourusername.github.io/repository-name`

### Method 2: Using Git
1. Initialize git repository: `git init`
2. Add files: `git add .`
3. Commit: `git commit -m "Initial commit"`
4. Add remote: `git remote add origin https://github.com/yourusername/repository-name.git`
5. Push: `git push -u origin main`
6. Enable GitHub Pages in repository settings

## Customization

### Update Shabbat Times
Edit the `shabbatEndTimes` array in `script.js` with the exact Connecticut times:

```javascript
const shabbatEndTimes = [
    new Date('2024-09-20T20:15:00-04:00'), // Update these times
    new Date('2024-09-27T20:05:00-04:00'),
    // ... etc
];
```

### Add Personal Content
- **Quiz Questions**: Update the `quizData` array in `script.js`
- **Memory Game Images**: Replace the emoji placeholders in `memoryImages` array
- **Hebrew Words**: Modify the `hebrewWords` array for different words
- **CTF Password**: Change the `ctfPassword` variable

### Update Hints
Modify the hints in the `gameSchedule` array:

```javascript
const gameSchedule = [
    {
        date: new Date('2024-09-19T00:00:00'),
        game: 'quiz',
        hint: 'Your custom hint here!'
    },
    // ... etc
];
```

## File Structure

```
├── index.html          # Main HTML file
├── styles.css          # All styling and animations
├── script.js           # Game logic and countdown functionality
└── README.md           # This file
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive design works on all screen sizes

## Notes

- All times are automatically handled for different time zones
- Progress is saved in browser localStorage
- The site works offline once loaded
- Games unlock automatically based on the schedule

Enjoy your special anniversary countdown! 💕
