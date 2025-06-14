const zodiacSigns = [
    'Aries', 'Taurus', 'Gemini', 'Cancer',
    'Leo', 'Virgo', 'Libra', 'Scorpio',
    'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const zodiacDates = {
        Aries: 'March 21 – April 19',
        Taurus:'April 20 – May 20',
        Gemini: 'May 21 – June 20',
        Cancer: 'June 21 – July 22',
        Leo: 'July 23 – August 22',
        Virgo: 'August 23 – September 22',
        Libra: 'September 23 – October 22',
        Scorpio: 'October 23 – November 21',
        Sagittarius: 'November 22 – December 21',
        Capricorn: 'December 22 – January 19',
        Aquarius: 'January 20 – February 18',
        Pisces: 'February 19 – March 20'
};

const zodiacImages = {
    Aries: 'icons/aries-sign-zodiac-astrology-26365.svg',
    Taurus: 'icons/taurus-sign-zodiac-astrology-26366.svg',
    Gemini: 'icons/gemini-sign-zodiac-astrology-26367.svg',
    Cancer: 'icons/cancer-sign-zodiac-astrology-26368.svg',
    Leo: 'icons/leo-sign-zodiac-astrology-26369.svg',
    Virgo: 'icons/virgo-sign-zodiac-astrology-26370.svg',
    Libra: 'icons/libra-sign-zodiac-astrology-26371.svg',
    Scorpio: 'icons/scorpio-sign-zodiac-astrology-26372.svg',
    Sagittarius: 'icons/sagittarius-sign-zodiac-astrology-26373.svg',
    Capricorn: 'icons/capricorn-sign-zodiac-astrology-26374.svg',
    Aquarius: 'icons/aquarius-sign-zodiac-astrology-26375.svg',
    Pisces: 'icons/pisces-sign-zodiac-astrology-26376.svg'
};




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

let currentHoroscopes = [];

        async function renderHoroscopes() {
            currentHoroscopes = await getDailyHoroscopes();
            const grid = document.getElementById('horoscopeGrid');
            
            if (currentHoroscopes.length === 0) {
                grid.innerHTML = '<div class="loading">Unable to load horoscopes. Please try again later!</div>';
                return;
            }

            grid.innerHTML = currentHoroscopes.map(({ sign, message, theme }) => `
                <div class="horoscope-card" data-sign="${sign}"  id=${sign}>
                    <div class="sign-container">
                        <div class="sign">${sign}</div>
                        <div class="dates-tag">${zodiacDates[sign]}</div>
                        <div class="sign-image">
                            <img src=" ${zodiacImages[sign] ||'/placeholder/120/120'}" alt="${sign} zodiac sign"/>
                        </div>
                        <div class="theme-tag">${theme}</div>
                    </div>
                    <div class="message">${message}</div>
                </div>
            `).join('');
        }

        async function refreshSelectedHoroscope() {
            const selectedSign = document.getElementById('signSelect').value;
            if (!selectedSign) {
                alert('Please select a zodiac sign');
                return;
            }

            const horoscopes = await loadHoroscopes();
            if (horoscopes.length === 0) return;

            // Get a new random horoscope
            const date = new Date();
            const seed = date.getTime(); // Use current timestamp for randomness...
            const usedMessages = currentHoroscopes
                .filter(h => h.sign !== selectedSign)
                .map(h => h.message);

            const newHoroscope = getRandomMessage(horoscopes, usedMessages, seed);

            // Update the selected horoscope card
            const card = document.querySelector(`.horoscope-card[data-sign="${selectedSign}"]`);
            if (card) {
                card.querySelector('.message').textContent = newHoroscope.message;
                card.querySelector('.theme-tag').textContent = newHoroscope.theme;

                // Update the currentHoroscopes array
                const index = currentHoroscopes.findIndex(h => h.sign === selectedSign);
                if (index !== -1) {
                    currentHoroscopes[index] = {
                        ...currentHoroscopes[index],
                        message: newHoroscope.message,
                        theme: newHoroscope.theme
                    };
                }
            }
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

        // Event listeners
        document.getElementById('refreshButton').addEventListener('click', refreshSelectedHoroscope);

        // Previous interval setups remain the same
        setInterval(updateCountdown, 1000);
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

