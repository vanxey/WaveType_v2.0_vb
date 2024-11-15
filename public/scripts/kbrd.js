// Constants and DOM Element Selectors
const DEFAULT_COLOR_LYRICS = 'rgb(189, 189, 189)';
const DISPLAY = document.querySelector('.display-text');
const KEYBOARD = document.querySelector('.keyboard');
const TYPING_START_BUTTON = document.querySelector('.typing-start');
const TIMER_DISPLAY = document.querySelector('.timer');

if (!DISPLAY) {
    console.error('Display element not found!');
    return;
}

// Default fetched lyrics message if no lyrics are present
let fetchedLyrics = document.querySelector('.lyrics-span').innerText;
if (!fetchedLyrics) {
    fetchedLyrics = 'Search for lyrics from your favourite artists...';
}

// Keyboard layout rows
const KEYBOARD_ROWS = [
    '^ 1 2 3 4 5 6 7 8 9 0 ß ´ Backspace',
    'Tab q w e r t z u i o p ü + Enter',
    'CapsLock a s d f g h j k l ö ä # Enter2',
    'Shift < y x c v b n m , . - Shift',
    'Fn Control Alt Meta Space Meta Alt ArrowLeft ArrowUp/ArrowDown ArrowRight'
];

// Function to display a congrats message with stats
const displayCongratsMessage = () => {
    const formattedTime = TIMER_DISPLAY.innerText;
    const accuracy = calculateAccuracy();
    const wpm = calculateWPM();

    const message = `Congrats, you did it!\n` +
                    `Accuracy: ${accuracy}%\n` +
                    `WPM: ${wpm}\n` +
                    `Mistakes: ${incorrectCount}\n` +
                    `Backspace count: ${backspaceCount}\n` +
                    `Time: ${formattedTime}\n` +
                    `Do you want to reload?`;
    if (confirm(message)) {
        window.location.href = '/';
    }
};

// Function to calculate accuracy
const calculateAccuracy = () => {
    const totalKeystrokes = correctCount + incorrectCount;
    return totalKeystrokes === 0 ? 0 : ((correctCount / totalKeystrokes) * 100).toFixed(2);
};

// Function to calculate words per minute
const calculateWPM = () => {
    const timeInMinutes = minutes + (seconds / 60);
    const wordCount = correctCount / 5;
    return timeInMinutes === 0 ? 0 : (wordCount / timeInMinutes).toFixed(2);
};

// Function to initialize lyrics display
let isDisplayInitialized = false; 

const initLyricsDisplay = () => {
    DISPLAY.innerHTML = ''; // Clear any existing content
    fetchedLyrics.split('').forEach((char) => {
        const span = document.createElement('span');
        span.style.color = DEFAULT_COLOR_LYRICS;
        span.style.fontSize = '2vw';
        span.innerText = char;
        DISPLAY.append(span);
    });
    isDisplayInitialized = true; // Set flag once display is ready
};

// Function to initialize keyboard display
const initKeyboardDisplay = () => {
    KEYBOARD_ROWS.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('kb-row');

        row.split(' ').forEach(key => {
            const keyDiv = document.createElement('div');
            keyDiv.classList.add('kb-key');
            keyDiv.id = key;

            if (key === 'ArrowUp/ArrowDown') {
                keyDiv.style.background = 'transparent';
                key.split('/').forEach(arrow => {
                    const arrowKey = document.createElement('div');
                    arrowKey.classList.add('kb-key-item');
                    arrowKey.id = arrow;
                    arrowKey.innerText = arrow === 'ArrowUp' ? '↑' : '↓';
                    keyDiv.append(arrowKey);
                });
            } else {
                keyDiv.innerText = getKeyLabel(key);
                keyDiv.style.width = getKeyWidth(key);
            }

            rowDiv.append(keyDiv);
        });

        KEYBOARD.append(rowDiv);
    });
};

// Helper function to get display label for each key
const getKeyLabel = (key) => {
    const keyLabels = {
        'Backspace': '⌫', 'Enter': '⏎', 'Tab': '⇥',
        'Shift': '⇧', 'CapsLock': '⇪', 'Control': 'Ctr',
        'Meta': 'Cmd', 'ArrowLeft': '←', 'ArrowRight': '→'
    };
    return keyLabels[key] || key;
};

// Helper function to get width for special keys
const getKeyWidth = (key) => {
    const keyWidths = {
        'Backspace': '76px', 'Enter': '76px', 'Shift': '76px',
        'CapsLock': '76px', 'Space': '190px', 'ArrowLeft': '12px',
        'ArrowRight': '12px'
    };
    return keyWidths[key] || '38px';
};

// Typing test variables
let currentIndex = 0;
let correctCount = 0;
let incorrectCount = 0;
let backspaceCount = 0;
let minutes = 0;
let seconds = 0;
let timerInterval;

// Function to start the timer
const startTimer = () => {
    timerInterval = setInterval(() => {
        seconds += 1;
        if (seconds === 60) {
            seconds = 0;
            minutes += 1;
        }
        const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        TIMER_DISPLAY.innerText = formattedTime;

        if (minutes === 1) { // 1-minute limit for testing
            clearInterval(timerInterval);
            displayCongratsMessage();
        }
    }, 1000);
};

// Function to handle keydown event for key press effect
const handleKeyDown = (e) => {
    const keyElement = document.getElementById(e.key);
    if (keyElement) keyElement.style.opacity = '0.5';
};

// Function to handle keyup event for typing functionality
const handleKeyUp = (e) => {
    if (!isDisplayInitialized) return; // Ensure display is ready before proceeding

    const keyElement = document.getElementById(e.key);
    if (keyElement) keyElement.style.opacity = '1';

    const characters = DISPLAY.children;

    // console.log(`Key pressed: ${e.key}, Expected char: ${characters[currentIndex]?.innerText}, Index: ${currentIndex}`);

    if (currentIndex < characters.length) {
        const expectedChar = characters[currentIndex].innerText;

        if (e.key === expectedChar) {
            // Correct character typed
            correctCount += 1;
            characters[currentIndex].style.color = 'rgb(156, 227, 161)';
            currentIndex += 1;

            if (currentIndex === characters.length) {
                clearInterval(timerInterval);
                setTimeout(() => displayCongratsMessage(correctCount, incorrectCount, TIMER_DISPLAY.innerText, backspaceCount), 300);
            }
        } else if (e.key === 'Backspace' && currentIndex > 0) {
            // Backspace pressed (undo previous character)
            currentIndex -= 1;
            backspaceCount += 1;
            characters[currentIndex].style.color = DEFAULT_COLOR_LYRICS;
        } else if (!['Shift', 'Control', 'Alt', 'Meta', 'Backspace'].includes(e.key)) {
            // Incorrect character typed (not backspace or modifier keys)
            characters[currentIndex].style.color = 'rgb(233, 153, 153)';
            incorrectCount += 1;
            currentIndex += 1;
        }
    } else {
        console.warn("Typing beyond displayed text length.");
    }
};


// Initialize the application on page load
window.addEventListener('load', () => {
    document.querySelector(document.querySelector('#scrollTo').innerText).scrollIntoView();
    initLyricsDisplay();
    initKeyboardDisplay();
});

// Start the typing test on button click
TYPING_START_BUTTON.addEventListener('click', () => {
    if (!isDisplayInitialized) {
        initLyricsDisplay(); // Ensure display is initialized
    }

    document.querySelector('.display-start').style.display = 'none';
    startTimer();

    // Delay adding the event listeners slightly to allow display to render fully
    setTimeout(() => {
        document.body.addEventListener('keydown', handleKeyDown);
        document.body.addEventListener('keyup', handleKeyUp);
    }, 100);
});

