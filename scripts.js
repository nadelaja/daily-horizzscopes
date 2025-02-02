const zodiacSigns = [
    "Aries", "Taurus", "Gemini", "Cancer",
    "Leo", "Virgo", "Libra", "Scorpio",
    "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const zodiacDates = [
    "Aries", "Taurus", "Gemini", "Cancer",
    "Leo", "Virgo", "Libra", "Scorpio",
    "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];


async function loadHoroscopes() {
    try {
        const response = await fetch('horoscopes.json');
        if (!response.ok) throw new Error('Failed to load horoscopes');
        const data = await response.json();
        return data.horoscopes;
    } catch (error) {
        console.error('Error loading horoscopes:', error);
        return [];
    }
}

function seededRandom(seed) {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

function getRandomMessage(horoscopes, usedMessages, seed) {
    const availableMessages = horoscopes.filter(h => !usedMessages.includes(h.id));
    const randomIndex = Math.floor(seededRandom(seed) * availableMessages.length);
    return availableMessages[randomIndex];
}

async function getDailyHoroscopes() {
    const horoscopes = await loadHoroscopes();
    if (horoscopes.length === 0) return [];

    const date = new Date();
    const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
    const usedMessages = [];

    return zodiacSigns.map((sign, index) => {
        const horoscope = getRandomMessage(horoscopes, usedMessages, seed + index);
        usedMessages.push(horoscope.id);
        return {
            sign,            
            message: horoscope.message,
            theme: horoscope.theme,
            intensity: horoscope.intensity
        };
    });
}

function updateCountdown() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const diff = tomorrow - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('countdown').textContent =
        `${hours}h ${minutes}m ${seconds}s`;
}

async function renderHoroscopes() {
    const horoscopes = await getDailyHoroscopes();
    const grid = document.getElementById('horoscopeGrid');

    if (horoscopes.length === 0) {
        grid.innerHTML = '<div class="loading">Unable to load horoscopes. Please try again later!</div>';
        return;
    }

    grid.innerHTML = horoscopes.map(({ sign, message, theme }) => `
                <div class="horoscope-card">
                    <div class="sign-container">
                        <div class="sign">${sign}</div>
                        <div class="sign-image">
                            <img src="/api/placeholder/120/120" alt="${sign} zodiac sign"/>
                        </div>
                        <div class="theme-tag">${theme}</div>
                    </div>
                    <div class="message">${message}</div>
                </div>
            `).join('');
}

function updateDate() {
    const date = new Date();
    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.getDate();
    const year = date.getFullYear();

    document.getElementById('currentDate').textContent = `${month} ${day}, ${year}`;
}

// Initial render
renderHoroscopes();
updateCountdown();
updateDate();

// Update countdown every second
setInterval(updateCountdown, 1000);

// Check for midnight reset
setInterval(() => {
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 0 && now.getSeconds() === 0) {
        renderHoroscopes();
        updateDate();
    }
}, 1000);

// Scroll to top button
let backTo = document.getElementById("backToTop");

// Show/hide the button when scrolling
window.onscroll = function () {
    backTo.style.display = (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) ? "block" : "none";
};

// Scroll to the top when the button is clicked
backTo.onclick = function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}; 