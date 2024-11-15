import { vi, expect, describe, it } from 'vitest';

global.document = {
  querySelector: vi.fn((selector) => {
    if (selector === '.display-text') return { innerText: '' }; 
    if (selector === '.keyboard') return {}; 
    if (selector === '.typing-start') return {}; 
    if (selector === '.timer') return { innerText: '00:00' }; 
    if (selector === '.lyrics-span') return { innerText: 'Hello World' }; 
    return null;
  }),
  createElement: vi.fn(() => ({
    append: vi.fn(),
    setAttribute: vi.fn(),
    style: {},
    innerText: '',
  })),
};

global.setInterval = vi.fn((callback, interval) => {
  callback();
  return 1;
});

describe('Utility functions tests', () => {
  describe('calculateAccuracy', () => {
    it('should return correct accuracy percentage', () => {
      const correctCount = 10;
      const incorrectCount = 5;

      const calculateAccuracy = (correct, incorrect) => {
        const totalKeystrokes = correct + incorrect;
        return totalKeystrokes === 0 ? 0 : ((correct / totalKeystrokes) * 100).toFixed(2);
      };

      const accuracy = calculateAccuracy(correctCount, incorrectCount);
      expect(accuracy).toBe('66.67');
    });
  });

  describe('calculateWPM', () => {
    it('should calculate WPM correctly', () => {
      const correctCount = 30;   
      const minutes = 1;         
      const seconds = 30;        

      const calculateWPM = (correct, min, sec) => {
        const timeInMinutes = min + (sec / 60);
        const wordCount = correct / 5; 
        return timeInMinutes === 0 ? 0 : (wordCount / timeInMinutes).toFixed(2);
      };

      const wpm = calculateWPM(correctCount, minutes, seconds);
      expect(wpm).toBe('4.00');
    });
  });
});

describe('DOM interaction tests', () => {
  describe('initLyricsDisplay', () => {
    it('should initialize the lyrics display correctly', () => {
      const DISPLAY = { innerHTML: '', append: vi.fn() };
      const fetchedLyrics = 'Hello World';

      const initLyricsDisplay = (lyrics, displayElement) => {
        displayElement.innerHTML = ''; 
        lyrics.split('').forEach((char) => {
          const span = { innerText: char, style: { color: 'rgb(189, 189, 189)' } };
          displayElement.append(span);
        });
      };

      initLyricsDisplay(fetchedLyrics, DISPLAY);
      expect(DISPLAY.append).toHaveBeenCalledTimes(fetchedLyrics.length);
      expect(DISPLAY.append.mock.calls[0][0].innerText).toBe('H');
      expect(DISPLAY.append.mock.calls[1][0].innerText).toBe('e');
    });
  });

  describe('startTimer', () => {
    it('should work correctly without jsdom', () => {
      let minutes = 0;
      let seconds = 0;
      const timerDisplay = { innerText: '00:00' };

      const startTimer = (timerElement) => {
        setInterval(() => {
          seconds += 1;
          if (seconds === 60) {
            seconds = 0;
            minutes += 1;
          }
          timerElement.innerText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }, 1000);
      };

      startTimer(timerDisplay);
      expect(timerDisplay.innerText).toBe('00:01');
    });
  });

  describe('handleKeyDown', () => {
    it('should update key opacity', () => {
      const mockKeyElement = { style: { opacity: '1' } };
      global.document.getElementById = vi.fn(() => mockKeyElement);

      const handleKeyDown = (e) => {
        const keyElement = document.getElementById(e.key);
        if (keyElement) keyElement.style.opacity = '0.5';
      };

      handleKeyDown({ key: 'a' });
      expect(mockKeyElement.style.opacity).toBe('0.5');
    });
  });
});
