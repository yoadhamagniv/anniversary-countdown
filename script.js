// Global variables
let currentGame = null;
let hints = [];
let gamesCompleted = new Set();
let isPromposalRevealed = false;

// Misleading/random clues for guesses
const misleadingClues = [
    "Close! Think about what we do together at night...",
    "Hmm... warmer than Antarctica, colder than the sun. ❄️☀️",
    "You're on the right planet. Keep going. 🌍",
    "Not quite. Try thinking sideways instead of forward. 🔄",
    "It's definitely not a left-handed spatula. Probably. 🍳",
    "Consider the mysteries of socks that vanish in the dryer. 🧦",
    "Closer than Mars, farther than your nose. 👃🚀",
    "Imagine a penguin wearing sunglasses. Now keep guessing. 🐧🕶️",
    "You've unlocked: +1 confusion. Keep trying! 🧩",
    "Try thinking of something that smells like blue. 💙👃",
    "A clue: The mitochondria is the powerhouse of the cell. 🔬",
    "It's exactly 42 things away from that guess. 42. 🔢",
    "Wrong, but stylish. Keep it up. 😎",
    "Consider the sound a cloud would make if it meowed. ☁️🐱",
    "Try again after consulting the Oracle (aka vibes). 🔮",
    "So close that even Schrödinger is confused. 🐱📦",
    "If guesses were waffles, that one was syrupy. 🧇",
    "That guess just did a backflip and landed sideways. 🤸",
    "New hint: triangles are sometimes pointy. 🔺",
    "This is not a clue. Or is it? 🕵️",
    "Nope! But you're getting warmer... or colder. 🌡️",
    "That's not it, but I like your thinking! 🤔",
    "Close, but no cigar! Wait, do you even smoke? 🚭",
    "Wrong direction! Try going the other way. ↩️",
    "Not quite! But you're on the right track... maybe? 🚂",
    "That's a creative guess! Still wrong though. 🎨",
    "Nope! But I appreciate the effort. 💪",
    "Wrong! But you're getting closer... or farther. 📏",
    "Not it! But keep trying, you'll get there! 🎯",
    "That's not right, but I love your persistence! 💕",
    "Nope! But you're making progress... I think. 📈",
    "Wrong again! But don't give up! 🚀",
    "Not quite! But you're getting warmer! 🔥",
    "That's not it! But I believe in you! ✨",
    "Nope! But you're on the right planet! 🌍",
    "Wrong! But you're getting closer... or not. 🤷‍♀️",
    "Not it! But I love your determination! 💪",
    "That's not right! But keep going! 🏃‍♀️",
    "Nope! But you're making me smile! 😊",
    "Wrong! But you're getting there... maybe! 🎪"
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

// Game unlock times are now loaded from countdown-dates.js

// Valid passkeys for unlocking hints
const validPasskeys = {
    'MUSIC2025': 'This is a gift you might say no to (hopefully not).',
    'MEMORY2025': 'It\'s something you never had before.',
    'HEBREW2025': 'I have to give it to you at night.',
    'CTF2025': 'This gift really packs a punch.'
};

// All countdown dates are now loaded from countdown-dates.js

// Silent guess tracking function
function sendGuessToGoogleForm(guess) {
    // Log guess to console for now (you can check browser console)
    console.log('🎯 GUESS TRACKED:', {
        guess: guess,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
    });
    
    // Your actual Google Form URL
    const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeKLfE4HBaljfiFdp7PhTyZPHTdyzVM1luFqNZ1iWKkA1mYgw/formResponse';
    
    const formData = new FormData();
    formData.append('entry.1234567890', guess); // Guess field (will be updated with actual ID)
    formData.append('entry.0987654321', new Date().toISOString()); // Timestamp field (will be updated with actual ID)
    formData.append('entry.1122334455', navigator.userAgent); // User Agent field (will be updated with actual ID)
    
    // Send silently in background
    fetch(GOOGLE_FORM_URL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors' // This prevents CORS errors
    }).catch(() => {
        // Silently fail if there's an error
        console.log('Guess tracking failed');
    });
}

// Simple time validation for GitHub Pages
let timeValidationEnabled = false; // Disabled for GitHub Pages compatibility

// Quiz data is now loaded from quiz-data.js

// Hebrew data is now loaded from hebrew-data.js

// Memory data is now loaded from memory-data.js

// CTF password (you can change this)
const ctfPassword = "PROM2024";

// Simple time function for GitHub Pages
function getValidatedTime() {
    return new Date();
}

function validateTimeIntegrity() {
    return true; // Always return true for GitHub Pages
}

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
    
    // Ensure guess input is enabled during normal operation
    const guessInput = document.getElementById('guessInput');
    const guessButton = document.getElementById('guessButton');
    if (guessInput && guessButton) {
        guessInput.disabled = false;
        guessButton.disabled = false;
    }
}

function startCountdowns() {
    updateMainCountdown();
    updateWeeklyCountdown();
    updateGameCountdowns();
    
    // Update countdowns every second
    setInterval(updateMainCountdown, 1000);
    setInterval(updateWeeklyCountdown, 1000);
    setInterval(updateGameCountdowns, 1000);
}

function updateMainCountdown() {
    const now = new Date();
    const timeLeft = finalCountdownTarget - now;
    
    if (timeLeft <= 0) {
        showPromposalButton();
        return;
    }
    
    const days = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60 * 24)));
    const hours = Math.max(0, Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    const minutes = Math.max(0, Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)));
    const seconds = Math.max(0, Math.floor((timeLeft % (1000 * 60)) / 1000));
    
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
    
    // Hide weekly countdown if no more Shabbat times or if all games are unlocked
    if (!nextShabbat) {
        document.getElementById('weeklyCountdown').style.display = 'none';
        return;
    }
    
    // Check if all games are unlocked (last game is CTF which unlocks on Oct 11th)
    const lastGameUnlockTime = new Date('2025-10-11T19:45:00-04:00');
    if (now >= lastGameUnlockTime) {
        document.getElementById('weeklyCountdown').style.display = 'none';
        return;
    }
    
    const timeLeft = nextShabbat - now;
    const days = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60 * 24)));
    const hours = Math.max(0, Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    const minutes = Math.max(0, Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)));
    
    document.getElementById('weeklyDays').textContent = days;
    document.getElementById('weeklyHours').textContent = hours;
    document.getElementById('weeklyMinutes').textContent = minutes;
    
    document.getElementById('weeklyCountdown').style.display = 'block';
}

function updateGameCountdowns() {
    const now = new Date();
    
    gameUnlockTimes.forEach((game, index) => {
        const gameElement = document.getElementById(`game${game.id}`);
        const gameBtn = document.getElementById(`game${game.id}Btn`);
        
        // Check if previous game is unlocked (for games 2, 3, 4)
        let shouldShow = true;
        if (game.id > 1) {
            const previousGame = gameUnlockTimes[index - 1];
            const previousTimeLeft = previousGame.unlockTime - now;
            shouldShow = previousTimeLeft <= 0; // Show only if previous game is unlocked
        }
        
        if (shouldShow) {
            // Show this game
            gameElement.style.display = 'block';
            
            const timeLeft = game.unlockTime - now;
            const days = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60 * 24)));
            const hours = Math.max(0, Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
            const minutes = Math.max(0, Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)));
            const seconds = Math.max(0, Math.floor((timeLeft % (1000 * 60)) / 1000));
            
            // Update timer display
            document.getElementById(`game${game.id}Days`).textContent = days;
            document.getElementById(`game${game.id}Hours`).textContent = hours;
            document.getElementById(`game${game.id}Minutes`).textContent = minutes;
            document.getElementById(`game${game.id}Seconds`).textContent = seconds;
            
            if (timeLeft <= 0) {
                // Game is unlocked
                gameElement.classList.add('unlocked');
                gameBtn.disabled = false;
                gameBtn.textContent = `Play Game ${game.id}`;
            }
        } else {
            // Hide this game until previous one is unlocked
            gameElement.style.display = 'none';
        }
    });
}

function checkForAvailableGames() {
    // Games are now handled via separate pages and countdown timers
    // This function is kept for compatibility but no longer needed
}

// Old game creation functions removed - games are now on separate pages

function addHint(hint) {
    // Check if hint already exists to prevent duplicates
    if (!hints.includes(hint)) {
        hints.push(hint);
        updateHintsDisplay();
        saveHints();
    }
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

function clearAllData() {
    // Clear all localStorage data
    localStorage.removeItem('anniversaryHints');
    localStorage.removeItem('anniversaryGames');
    
    // Reset variables
    hints = [];
    gamesCompleted = new Set();
    
    // Update display
    updateHintsDisplay();
    
    // Show confirmation
    alert('All data cleared! The page will reload.');
    
    // Reload page
    location.reload();
}

function saveHints() {
    localStorage.setItem('anniversaryHints', JSON.stringify(hints));
    localStorage.setItem('anniversaryGames', JSON.stringify([...gamesCompleted]));
}

function setupEventListeners() {
    // Passkey input
    const passkeyInput = document.getElementById('passkeyInput');
    const passkeyButton = document.getElementById('passkeyButton');
    const passkeyResponse = document.getElementById('passkeyResponse');
    
    if (passkeyInput && passkeyButton) {
        passkeyInput.addEventListener('input', function() {
            passkeyButton.disabled = this.value.trim() === '';
        });
        
        // Add Enter key support for passkey input
        passkeyInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !passkeyButton.disabled) {
                passkeyButton.click();
            }
        });
        
        passkeyButton.addEventListener('click', function() {
            const passkey = passkeyInput.value.trim().toUpperCase();
            if (passkey) {
                if (validPasskeys[passkey]) {
                    // Check if hint already exists
                    const hint = validPasskeys[passkey];
                    if (hints.includes(hint)) {
                        passkeyResponse.textContent = 'ℹ️ You already have this hint! Check your hints list above.';
                        passkeyResponse.className = 'passkey-response info';
                    } else {
                        // Valid passkey - add hint
                        addHint(hint);
                        passkeyResponse.textContent = '🎉 Hint unlocked! Check your hints list above.';
                        passkeyResponse.className = 'passkey-response success';
                    }
                    passkeyInput.value = '';
                    passkeyButton.disabled = true;
                } else {
                    // Invalid passkey
                    passkeyResponse.textContent = '❌ Invalid passkey. Make sure you completed the game correctly.';
                    passkeyResponse.className = 'passkey-response error';
                    passkeyInput.value = '';
                    passkeyButton.disabled = true;
                }
            }
        });
    }
    
    // Guess input
    const guessInput = document.getElementById('guessInput');
    const guessButton = document.getElementById('guessButton');
    const guessResponse = document.getElementById('guessResponse');
    
    if (guessInput && guessButton) {
        guessInput.addEventListener('input', function() {
            guessButton.disabled = this.value.trim() === '';
        });
        
        // Add Enter key support for guess input
        guessInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !guessButton.disabled) {
                guessButton.click();
            }
        });
        
        guessButton.addEventListener('click', function() {
            const guess = guessInput.value.trim();
            if (guess) {
                // Send guess to Google Form silently (invisible to her)
                sendGuessToGoogleForm(guess);
                
                // Always show a playful misleading clue until the final reveal
                guessResponse.textContent = getRandomClue();
                guessResponse.className = 'guess-response incorrect';
                guessInput.value = '';
                guessButton.disabled = true;
            }
        });
    }
    
    // Game buttons
    gameUnlockTimes.forEach(game => {
        const gameBtn = document.getElementById(`game${game.id}Btn`);
        if (gameBtn) {
            gameBtn.addEventListener('click', function() {
                if (!this.disabled) {
                    window.location.href = game.gameUrl;
                }
            });
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
    if (guessInput && guessButton) {
        guessInput.disabled = false;
        guessButton.disabled = false;
        
        // Update guess functionality for final reveal
        guessButton.addEventListener('click', function() {
            const guess = guessInput.value.trim();
            const guessResponse = document.getElementById('guessResponse');
            
            // Send guess to Google Form silently (invisible to her)
            sendGuessToGoogleForm(guess);
            
            const guessLower = guess.toLowerCase();
            if (guessLower.includes('prom') || guessLower.includes('promposal') || guessLower.includes('dance')) {
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
}
