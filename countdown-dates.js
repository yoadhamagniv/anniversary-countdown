// Countdown Dates Configuration
// Modify these dates for testing or production

// Main countdown target: October 18th, 7:27 PM Texas time (CDT)
// For testing, set to a future date
const finalCountdownTarget = new Date('2025-10-18T19:35:00-04:00'); // December 18th, 7:27 PM Texas time (CDT) - for testing

// Shabbat end times (Connecticut time) - modify these for testing
const shabbatEndTimes = [
    new Date('2025-09-20T20:15:00-04:00'), // September 20th (Friday night)
    new Date('2025-09-27T20:05:00-04:00'), // September 27th (Friday night)
    new Date('2025-10-04T19:55:00-04:00'), // October 4th (Friday night)
    new Date('2025-10-11T19:45:00-04:00'), // October 11th (Friday night)
    new Date('2025-10-18T19:35:00-04:00')  // October 18th (Friday night)
];

// Game unlock times - modify these for testing
// For immediate testing, set to current time + small delays
const gameUnlockTimes = [
    {
        id: 1,
        unlockTime: new Date(Date.now() + 5 * 1000), // 5 seconds from now
        gameUrl: 'quiz-game.html',
        passkey: 'QUIZ2024'
    },
    {
        id: 2,
        unlockTime: new Date(Date.now() + 10 * 1000), // 10 seconds from now
        gameUrl: 'memory-game.html',
        passkey: 'MEMORY2024'
    },
    {
        id: 3,
        unlockTime: new Date(Date.now() + 15 * 1000), // 15 seconds from now
        gameUrl: 'hebrew-game.html',
        passkey: 'HEBREW2024'
    },
    {
        id: 4,
        unlockTime: new Date(Date.now() + 20 * 1000), // 20 seconds from now
        gameUrl: 'ctf-game.html',
        passkey: 'CTF2024'
    }
];

// For production, use these dates instead:
/*
const gameUnlockTimes = [
    {
        id: 1,
        unlockTime: new Date('2025-09-20T20:15:00-04:00'), // September 20th after Shabbat
        gameUrl: 'quiz-game.html',
        passkey: 'QUIZ2024'
    },
    {
        id: 2,
        unlockTime: new Date('2025-09-27T20:05:00-04:00'), // September 27th after Shabbat
        gameUrl: 'memory-game.html',
        passkey: 'MEMORY2024'
    },
    {
        id: 3,
        unlockTime: new Date('2025-10-04T19:55:00-04:00'), // October 4th after Shabbat
        gameUrl: 'hebrew-game.html',
        passkey: 'HEBREW2024'
    },
    {
        id: 4,
        unlockTime: new Date('2025-10-11T19:45:00-04:00'), // October 11th after Shabbat
        gameUrl: 'ctf-game.html',
        passkey: 'CTF2024'
    }
];
*/

