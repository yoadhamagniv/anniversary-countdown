// Global variables
let currentGame = null;
let hints = [];
let gamesCompleted = new Set();
let isPromposalRevealed = false;

// Misleading/random clues for guesses
const misleadingClues = [
    "Close! Think about what we do together at night... 💃",
    "Hmm... warmer than Antarctica, colder than the sun. ❄️☀️",
    "You're on the right planet. Keep going. 🌍",
    "Not quite. Try thinking sideways instead of forward. 🔄",
    "It’s definitely not a left-handed spatula. Probably. 🍳",
    "Consider the mysteries of socks that vanish in the dryer. 🧦",
    "Closer than Mars, farther than your nose. 👃🚀",
    "Imagine a penguin wearing sunglasses. Now keep guessing. 🐧🕶️",
    "You’ve unlocked: +1 confusion. Keep trying! 🧩",
    "Try thinking of something that smells like blue. 💙👃",
    "A clue: The mitochondria is the powerhouse of the cell. 🔬",
    "It’s exactly 42 things away from that guess. 42. 🔢",
    "Wrong, but stylish. Keep it up. 😎",
    "Consider the sound a cloud would make if it meowed. ☁️🐱",
    "Try again after consulting the Oracle (aka vibes). 🔮",
    "So close that even Schrödinger is confused. 🐱📦",
    "If guesses were waffles, that one was syrupy. 🧇",
    "That guess just did a backflip and landed sideways. 🤸",
    "New hint: triangles are sometimes pointy. 🔺",
    "This is not a clue. Or is it? 🕵️"
];

let lastClueIndex = -1;
function getRandomClue() {
    if (misleadingClues.length === 1) return misleadingClues[0];
    let idx = Math.floor(Math.random() * misleadingClues.length);
    while (idx === lastClueIndex) {
        idx = Math.floor(Math.random() * misleadingClues.length);
    }
    lastClueIndex = idx;
    return misleadingClues[idx];
}

// Game schedule - you'll need to update these dates
const gameSchedule = [
    {
        date: new Date('2024-09-19T00:00:00'),
        game: 'quiz',
        hint: 'This is a gift you might say no to (hopefully not).'
    },
    {
        date: new Date('2024-09-27T00:00:00'),
        game: 'memory',
        hint: 'It\'s something you never had before.'
    },
    {
        date: new Date('2024-10-04T00:00:00'),
        game: 'hebrew',
        hint: 'I have to give it to you at night.'
    },
    {
        date: new Date('2024-10-11T00:00:00'),
        game: 'ctf',
        hint: 'This gift really packs a punch.'
    }
];

// Final countdown target: October 18th, 7:27 PM Texas time
const finalCountdownTarget = new Date('2024-10-18T19:27:00-05:00'); // Texas time (CDT)

// Shabbat end times (Connecticut time) - you'll need to provide exact times
const shabbatEndTimes = [
    new Date('2024-09-20T20:15:00-04:00'), // September 20th
    new Date('2024-09-27T20:05:00-04:00'), // September 27th
    new Date('2024-10-04T19:55:00-04:00'), // October 4th
    new Date('2024-10-11T19:45:00-04:00'), // October 11th
    new Date('2024-10-18T19:35:00-04:00')  // October 18th
];

// Quiz questions and answers
const quizData = [
    {
        question: "What was our first date?",
        options: ["Coffee shop", "Movie theater", "Park walk", "Restaurant"],
        correct: 0
    },
    {
        question: "What's my favorite color?",
        options: ["Blue", "Red", "Green", "Purple"],
        correct: 0
    },
    {
        question: "What do we do most often together?",
        options: ["Watch movies", "Go for walks", "Cook together", "Play games"],
        correct: 1
    },
    {
        question: "What's the best part of our relationship?",
        options: ["The laughter", "The adventures", "The quiet moments", "All of the above"],
        correct: 3
    }
];

// Hebrew words for scramble game
const hebrewWords = [
    { hebrew: "אהבה", english: "love" },
    { hebrew: "טקסס", english: "texas" },
    { hebrew: "שמלה", english: "dress" },
    { hebrew: "ריקוד", english: "dance" },
    { hebrew: "מוזיקה", english: "music" }
];

// Memory game images (placeholder - you'll need to add actual images)
const memoryImages = [
    '💕', '🌟', '🎵', '🌹', '💖', '🎉', '🌈', '💝'
];

// CTF password (you can change this)
const ctfPassword = "PROM2024";

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    startCountdowns();
    loadHints();
    setupEventListeners();
});

function initializeApp() {
    // Check if we're past the final countdown
    if (new Date() >= finalCountdownTarget) {
        showPromposalButton();
        return;
    }
    
    // Check for available games
    checkForAvailableGames();
}

function startCountdowns() {
    updateMainCountdown();
    updateWeeklyCountdown();
    
    // Update countdowns every second
    setInterval(updateMainCountdown, 1000);
    setInterval(updateWeeklyCountdown, 1000);
}

function updateMainCountdown() {
    const now = new Date();
    const timeLeft = finalCountdownTarget - now;
    
    if (timeLeft <= 0) {
        showPromposalButton();
        return;
    }
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;
}

function updateWeeklyCountdown() {
    const now = new Date();
    let nextShabbat = null;
    
    // Find the next Shabbat end time
    for (const shabbatTime of shabbatEndTimes) {
        if (shabbatTime > now) {
            nextShabbat = shabbatTime;
            break;
        }
    }
    
    if (!nextShabbat) {
        document.getElementById('weeklyCountdown').style.display = 'none';
        return;
    }
    
    const timeLeft = nextShabbat - now;
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    document.getElementById('weeklyDays').textContent = days;
    document.getElementById('weeklyHours').textContent = hours;
    document.getElementById('weeklyMinutes').textContent = minutes;
    
    document.getElementById('weeklyCountdown').style.display = 'block';
}

function checkForAvailableGames() {
    const now = new Date();
    
    for (const gameInfo of gameSchedule) {
        if (now >= gameInfo.date && !gamesCompleted.has(gameInfo.game)) {
            showMiniGame(gameInfo.game, gameInfo.hint);
            break;
        }
    }
}

function showMiniGame(gameType, hint) {
    const miniGameSection = document.getElementById('miniGameSection');
    const gameContainer = document.getElementById('gameContainer');
    
    miniGameSection.style.display = 'block';
    
    switch (gameType) {
        case 'quiz':
            createQuizGame(gameContainer, hint);
            break;
        case 'memory':
            createMemoryGame(gameContainer, hint);
            break;
        case 'hebrew':
            createHebrewGame(gameContainer, hint);
            break;
        case 'ctf':
            createCTFGame(gameContainer, hint);
            break;
    }
    
    currentGame = gameType;
}

function createQuizGame(container, hint) {
    container.innerHTML = `
        <div class="game">
            <h4>Relationship Quiz</h4>
            <p>Answer these questions about our relationship to unlock your hint!</p>
            <div class="quiz-container" id="quizContainer">
                <!-- Questions will be loaded here -->
            </div>
            <button class="game-button" id="submitQuiz" disabled>Submit Answers</button>
        </div>
    `;
    
    const quizContainer = document.getElementById('quizContainer');
    let currentQuestion = 0;
    let answers = [];
    
    function loadQuestion() {
        if (currentQuestion >= quizData.length) {
            checkQuizAnswers();
            return;
        }
        
        const question = quizData[currentQuestion];
        quizContainer.innerHTML = `
            <div class="question">${question.question}</div>
            <div class="options">
                ${question.options.map((option, index) => 
                    `<div class="option" data-index="${index}">${option}</div>`
                ).join('')}
            </div>
        `;
        
        // Add click handlers
        document.querySelectorAll('.option').forEach(option => {
            option.addEventListener('click', function() {
                document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                answers[currentQuestion] = parseInt(this.dataset.index);
                document.getElementById('submitQuiz').disabled = false;
            });
        });
    }
    
    function checkQuizAnswers() {
        let correct = 0;
        quizData.forEach((question, index) => {
            if (answers[index] === question.correct) {
                correct++;
            }
        });
        
        if (correct >= 3) { // Need at least 3 out of 4 correct
            completeGame(hint);
        } else {
            alert('Not quite! Try again.');
            currentQuestion = 0;
            answers = [];
            loadQuestion();
        }
    }
    
    document.getElementById('submitQuiz').addEventListener('click', function() {
        if (answers[currentQuestion] !== undefined) {
            currentQuestion++;
            loadQuestion();
        }
    });
    
    loadQuestion();
}

function createMemoryGame(container, hint) {
    const cards = [...memoryImages, ...memoryImages].sort(() => Math.random() - 0.5);
    let flippedCards = [];
    let matchedPairs = 0;
    
    container.innerHTML = `
        <div class="game">
            <h4>Memory Match</h4>
            <p>Match the pairs to unlock your hint!</p>
            <div class="memory-grid" id="memoryGrid">
                ${cards.map((image, index) => 
                    `<div class="memory-card" data-index="${index}">?</div>`
                ).join('')}
            </div>
        </div>
    `;
    
    document.querySelectorAll('.memory-card').forEach(card => {
        card.addEventListener('click', function() {
            if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
                const index = parseInt(this.dataset.index);
                this.textContent = cards[index];
                this.classList.add('flipped');
                flippedCards.push({ element: this, index });
                
                if (flippedCards.length === 2) {
                    setTimeout(checkMatch, 1000);
                }
            }
        });
    });
    
    function checkMatch() {
        const [card1, card2] = flippedCards;
        
        if (cards[card1.index] === cards[card2.index]) {
            card1.element.classList.add('matched');
            card2.element.classList.add('matched');
            matchedPairs++;
            
            if (matchedPairs === memoryImages.length) {
                completeGame(hint);
            }
        } else {
            card1.element.textContent = '?';
            card2.element.textContent = '?';
            card1.element.classList.remove('flipped');
            card2.element.classList.remove('flipped');
        }
        
        flippedCards = [];
    }
}

function createHebrewGame(container, hint) {
    const randomWord = hebrewWords[Math.floor(Math.random() * hebrewWords.length)];
    const scrambled = scrambleWord(randomWord.hebrew);
    
    container.innerHTML = `
        <div class="game">
            <h4>Hebrew Word Scramble</h4>
            <p>Unscramble this Hebrew word to unlock your hint!</p>
            <div class="scramble-container">
                <div class="scramble-word">${scrambled}</div>
                <input type="text" class="scramble-input" id="hebrewInput" placeholder="Enter the English word...">
                <button class="game-button" id="checkHebrew">Check Answer</button>
            </div>
        </div>
    `;
    
    document.getElementById('checkHebrew').addEventListener('click', function() {
        const answer = document.getElementById('hebrewInput').value.toLowerCase().trim();
        if (answer === randomWord.english.toLowerCase()) {
            completeGame(hint);
        } else {
            alert('Not quite! Try again.');
        }
    });
}

function createCTFGame(container, hint) {
    container.innerHTML = `
        <div class="game">
            <h4>Capture The Flag Challenge</h4>
            <p>Use this reference to find the password: <a href="https://view.genially.com/68bded39d2c452050a21cbe4/interactive-content-love-island" target="_blank">Love Island Challenge</a></p>
            <div class="ctf-container">
                <input type="text" class="ctf-password" id="ctfPassword" placeholder="Enter the password...">
                <button class="game-button" id="checkCTF">Submit Password</button>
            </div>
        </div>
    `;
    
    document.getElementById('checkCTF').addEventListener('click', function() {
        const password = document.getElementById('ctfPassword').value.trim();
        if (password === ctfPassword) {
            completeGame(hint);
        } else {
            alert('Incorrect password! Try again.');
        }
    });
}

function scrambleWord(word) {
    return word.split('').sort(() => Math.random() - 0.5).join('');
}

function completeGame(hint) {
    gamesCompleted.add(currentGame);
    addHint(hint);
    
    // Hide the mini-game section
    document.getElementById('miniGameSection').style.display = 'none';
    
    // Check if there are more games available
    setTimeout(checkForAvailableGames, 1000);
}

function addHint(hint) {
    hints.push(hint);
    updateHintsDisplay();
    saveHints();
}

function updateHintsDisplay() {
    const hintsList = document.getElementById('hintsList');
    
    if (hints.length === 0) {
        hintsList.innerHTML = '<p class="no-hints">Complete mini-games to unlock hints!</p>';
    } else {
        hintsList.innerHTML = hints.map((hint, index) => 
            `<div class="hint-item">Hint ${index + 1}: ${hint}</div>`
        ).join('');
    }
}

function loadHints() {
    const savedHints = localStorage.getItem('anniversaryHints');
    if (savedHints) {
        hints = JSON.parse(savedHints);
        updateHintsDisplay();
    }
    
    const savedGames = localStorage.getItem('anniversaryGames');
    if (savedGames) {
        gamesCompleted = new Set(JSON.parse(savedGames));
    }
}

function saveHints() {
    localStorage.setItem('anniversaryHints', JSON.stringify(hints));
    localStorage.setItem('anniversaryGames', JSON.stringify([...gamesCompleted]));
}

function setupEventListeners() {
    // Guess input
    const guessInput = document.getElementById('guessInput');
    const guessButton = document.getElementById('guessButton');
    const guessResponse = document.getElementById('guessResponse');
    
    guessInput.addEventListener('input', function() {
        guessButton.disabled = this.value.trim() === '';
    });
    
    guessButton.addEventListener('click', function() {
        const guess = guessInput.value.trim();
        if (guess) {
            // Always show a playful misleading clue until the final reveal
            guessResponse.textContent = getRandomClue();
            guessResponse.className = 'guess-response incorrect';
            guessInput.value = '';
            guessButton.disabled = true;
        }
    });
    
    // Promposal button
    const promposalButton = document.getElementById('promposalButton');
    const promposalModal = document.getElementById('promposalModal');
    
    promposalButton.addEventListener('click', function() {
        promposalModal.style.display = 'block';
        isPromposalRevealed = true;
    });
    
    // Modal close
    promposalModal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.style.display = 'none';
        }
    });
    
    // Promposal response buttons
    document.querySelector('.yes-button').addEventListener('click', function() {
        alert('YES! I\'m so excited! 💕🎉');
        promposalModal.style.display = 'none';
    });
    
    document.querySelector('.no-button').addEventListener('click', function() {
        alert('I\'ll keep trying to convince you! 😏💕');
        promposalModal.style.display = 'none';
    });
}

function showPromposalButton() {
    document.getElementById('promposalSection').style.display = 'block';
    document.getElementById('weeklyCountdown').style.display = 'none';
    document.getElementById('miniGameSection').style.display = 'none';
    
    // Enable guess input when promposal is revealed
    const guessInput = document.getElementById('guessInput');
    const guessButton = document.getElementById('guessButton');
    guessInput.disabled = false;
    guessButton.disabled = false;
    
    // Update guess functionality for final reveal
    guessButton.addEventListener('click', function() {
        const guess = guessInput.value.trim().toLowerCase();
        const guessResponse = document.getElementById('guessResponse');
        
        if (guess.includes('prom') || guess.includes('promposal') || guess.includes('dance')) {
            guessResponse.textContent = 'You got it! Click the button above for the full reveal! 🎉';
            guessResponse.className = 'guess-response correct';
        } else {
            // After reveal, still show misleading/random clue on wrong guesses
            guessResponse.textContent = getRandomClue();
            guessResponse.className = 'guess-response incorrect';
        }
        
        guessInput.value = '';
    });
}
