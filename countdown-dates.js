// Countdown Dates Configuration
// Modify these dates for testing or production

// Main countdown target: October 18th, 7:27 PM Texas time (CDT)
const finalCountdownTarget = new Date('2025-10-18T19:27:00-05:00'); // October 18th, 7:27 PM Texas time (CDT)

// Shabbat end times (Connecticut time)
const shabbatEndTimes = [
    new Date('2025-09-20T20:15:00-04:00'), // September 20th (Friday night)
    new Date('2025-09-27T20:05:00-04:00'), // September 27th (Friday night)
    new Date('2025-10-04T19:55:00-04:00'), // October 4th (Friday night)
    new Date('2025-10-11T19:45:00-04:00'), // October 11th (Friday night)
    new Date('2025-10-18T19:35:00-04:00')  // October 18th (Friday night)
];

// Game unlock times - games unlock after each Shabbat ends
const gameUnlockTimes = [
    {
        id: 1,
        unlockTime: new Date('2025-09-20T20:15:00-04:00'), // September 20th after Shabbat
        gameUrl: 'music-game.html',
        passkey: 'MUSIC2025'
    },
    {
        id: 2,
        unlockTime: new Date('2025-09-27T20:05:00-04:00'), // September 27th after Shabbat
        gameUrl: 'memory-game.html',
        passkey: 'MEMORY2025'
    },
    {
        id: 3,
        unlockTime: new Date('2025-10-04T19:55:00-04:00'), // October 4th after Shabbat
        gameUrl: 'hebrew-game.html',
        passkey: 'HEBREW2025'
    },
    {
        id: 4,
        unlockTime: new Date('2025-10-11T19:45:00-04:00'), // October 11th after Shabbat
        gameUrl: 'ctf-game.html',
        passkey: 'CTF2025'
    }
];

