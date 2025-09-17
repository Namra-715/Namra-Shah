import React, { useEffect, useRef } from 'react';

// Global state to manage background words across all instances
let globalActiveWords = [];
let globalIntervals = [];
let globalTimeouts = [];
let isInitialized = false;

const BackgroundWords = ({ theme, containerId = 'hero' }) => {
  const containerRef = useRef(null);
  const activeWordsRef = useRef([]);
  const backgroundWordsRef = useRef([]);
  const maxWords = 46;
  
  // Use separate state for experiment page to avoid global interference
  const isExperimentPage = containerId === 'background-words-section';
  const experimentActiveWords = useRef([]);
  const experimentIntervals = useRef([]);
  const experimentTimeouts = useRef([]);
  const experimentInitialized = useRef(false);

  // Function to check if a position overlaps with existing words
  const checkOverlap = (x, y) => {
    const minDistance = 80; // Increased to prevent clustering
    
    const wordsToCheck = isExperimentPage ? experimentActiveWords.current : globalActiveWords;
    
    for (const activeWord of wordsToCheck) {
      const activeX = parseInt(activeWord.style.left);
      const activeY = parseInt(activeWord.style.top);
      
      const distance = Math.sqrt((x - activeX) ** 2 + (y - activeY) ** 2);
      if (distance < minDistance) {
        return true; // Overlap detected
      }
    }
    return false; // No overlap
  };

  // Function to check if position overlaps with the card area
  const isOverlappingCard = (x, y) => {
    if (containerId !== 'background-words-section') return false;
    
    const card = document.querySelector('.info-page-card');
    if (!card) {
      return false;
    }
    
    const cardRect = card.getBoundingClientRect();
    const containerSection = document.getElementById(containerId);
    if (!containerSection) {
      return false;
    }
    
    const containerRect = containerSection.getBoundingClientRect();
    
    // Convert card position to container-relative coordinates
    const cardLeft = cardRect.left - containerRect.left;
    const cardTop = cardRect.top - containerRect.top;
    const cardRight = cardLeft + cardRect.width;
    const cardBottom = cardTop + cardRect.height;
    
    // Check if word position is within card bounds (with minimal buffer)
    const buffer = 20; // Minimal buffer to protect just the card area
    const overlaps = x >= cardLeft - buffer && x <= cardRight + buffer && 
                    y >= cardTop - buffer && y <= cardBottom + buffer;
    
    return overlaps;
  };

  // Function to check if position is in the hero section (avoid placing words there)
  const isInHeroSection = (x, y) => {
    // Since we're now targeting only the background-words-section container,
    // we don't need to check for hero section overlap as it's above this container
    return false;
  };

  // Function to check if position is too close to content areas
  const isNearContent = (x, y) => {
    // Temporarily disabled to test word generation
    return false;
  };

  // Function to find the least crowded area
  const findLeastCrowdedArea = () => {
    const containerSection = document.getElementById(containerId);
    if (!containerSection) return { x: 0, y: 0 };
    
    const width = containerSection.offsetWidth - 80;
    const height = containerSection.offsetHeight - 25;
    
    // Divide screen into a grid to find least crowded areas
    const gridSize = 100;
    const cols = Math.floor(width / gridSize);
    const rows = Math.floor(height / gridSize);
    
    let bestArea = { x: 0, y: 0, density: Infinity };
    
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        const centerX = col * gridSize + gridSize / 2;
        const centerY = row * gridSize + gridSize / 2;
        
        // Count words in this area
        let wordCount = 0;
        const wordsToCheck = isExperimentPage ? experimentActiveWords.current : globalActiveWords;
        for (const activeWord of wordsToCheck) {
          const activeX = parseInt(activeWord.style.left);
          const activeY = parseInt(activeWord.style.top);
          const distance = Math.sqrt((centerX - activeX) ** 2 + (centerY - activeY) ** 2);
          if (distance < gridSize) {
            wordCount++;
          }
        }
        
        if (wordCount < bestArea.density) {
          bestArea = { x: centerX, y: centerY, density: wordCount };
        }
      }
    }
    
    return bestArea;
  };

  // Function to create background word (exactly like original)
  const createBackgroundWord = (startAtRandomStage = false) => {
    // Don't create if we have too many words
    const currentWords = isExperimentPage ? experimentActiveWords.current : globalActiveWords;
    if (currentWords.length >= maxWords) return;
    
    // Don't create if words haven't been loaded yet
    if (!backgroundWordsRef.current || backgroundWordsRef.current.length === 0) return;
    
    // Get container section
    const containerSection = document.getElementById(containerId);
    if (!containerSection) return;
    
    // Create word element
    const word = document.createElement('div');
    word.className = 'background-word';
    
    // Get random word
    const randomIndex = Math.floor(Math.random() * backgroundWordsRef.current.length);
    word.textContent = backgroundWordsRef.current[randomIndex];
    
    // Smart positioning to prevent clustering and avoid content
    let x, y;
    let attempts = 0;
    const maxAttempts = 100; // Increased attempts
    
    // First try to find the least crowded area
    const leastCrowdedArea = findLeastCrowdedArea();
    
    do {
      // Start from the least crowded area and add some randomness
      const baseX = leastCrowdedArea.x;
      const baseY = leastCrowdedArea.y;
      
      // Add random offset within the grid cell
      x = baseX + (Math.random() - 0.5) * 60;
      y = baseY + (Math.random() - 0.5) * 60;
      
      // Ensure within bounds
      x = Math.max(0, Math.min(x, containerSection.offsetWidth - 80));
      y = Math.max(0, Math.min(y, containerSection.offsetHeight - 25));
      
      attempts++;
      
      // Check for overlap with existing words, proximity to content, and card overlap
      if (!checkOverlap(x, y) && !isNearContent(x, y) && !isOverlappingCard(x, y) && !isInHeroSection(x, y)) break;
      
    } while (attempts < maxAttempts);
    
    // If still no good position found, try completely random positions
    if (attempts >= maxAttempts) {
      let foundGoodPosition = false;
      for (let i = 0; i < 50; i++) {
        x = Math.random() * (containerSection.offsetWidth - 80);
        y = Math.random() * (containerSection.offsetHeight - 25);
        
        if (!checkOverlap(x, y) && !isNearContent(x, y) && !isOverlappingCard(x, y) && !isInHeroSection(x, y)) {
          foundGoodPosition = true;
          break;
        }
      }
      
      // If no good position found after all attempts, don't create the word
      if (!foundGoodPosition) {
        return;
      }
    }
    
    word.style.left = x + 'px';
    word.style.top = y + 'px';
    word.style.position = 'absolute';
    word.style.zIndex = '1'; // Background words below everything
    
    
    // Use CSS animations instead of JavaScript timing for better performance and no sync issues
    const totalTime = 5.0; // Total animation time in seconds (faster)
    
    // Create unique animation with random start time
    const randomStart = startAtRandomStage ? Math.random() * totalTime : 0;
    const animationName = `wordFade_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create unique keyframes for this word
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ${animationName} {
            0% { opacity: 0; }
            15% { opacity: 0.85; }
            62% { opacity: 0.85; }
            100% { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Apply animation with random start time
    word.style.animation = `${animationName} ${totalTime}s linear ${randomStart}s infinite`;
    
    // Add to container section
    containerSection.appendChild(word);
    if (isExperimentPage) {
      experimentActiveWords.current.push(word);
    } else {
      globalActiveWords.push(word);
    }
    activeWordsRef.current.push(word);
    
    // Remove word and style after animation completes
    setTimeout(() => {
      if (word.parentNode) {
        word.parentNode.removeChild(word);
        if (isExperimentPage) {
          experimentActiveWords.current = experimentActiveWords.current.filter(w => w !== word);
        } else {
          globalActiveWords = globalActiveWords.filter(w => w !== word);
        }
        activeWordsRef.current = activeWordsRef.current.filter(w => w !== word);
        
        // Remove the unique style element
        if (style.parentNode) {
          style.parentNode.removeChild(style);
        }
        
        // Create new word with spread out timing to prevent waves
        setTimeout(() => createBackgroundWord(true), Math.random() * 1500);
      }
    }, (totalTime + randomStart) * 1000);
  };

  // Function to update background words theme without recreating them
  const updateBackgroundWordsTheme = (theme) => {
    // Update CSS variable instead of individual word styles
    if (theme === 'light') {
      document.documentElement.style.setProperty('--bg-word-color', 'rgba(0, 0, 0, 0.7)');
    } else {
      document.documentElement.style.setProperty('--bg-word-color', 'rgba(255, 255, 255, 0.7)');
    }
  };

  // Function to load background words
  const loadBackgroundWords = async () => {
    try {
      const response = await fetch('/background-words.txt');
      const text = await response.text();
      backgroundWordsRef.current = text.split('\n').filter(word => word.trim() !== '').map(word => word.toUpperCase());
    } catch (error) {
      // Fallback words if file loading fails
      backgroundWordsRef.current = ['ALGORITHM', 'STACK', 'MERGE', 'ARCHITECTURE', 'TYPESCRIPT', 'MARKDOWN', 'CLIENT', 'BINARY', 'CLASS', 'PERFORMANCE'];
    }
  };

  // Function to initialize background words (start immediately)
  const initBackgroundWords = () => {
    if (isExperimentPage) {
      // Handle experiment page separately
      if (experimentInitialized.current) return;
      experimentInitialized.current = true;
      
      loadBackgroundWords().then(() => {
        let wordsCreated = 0;
        
        function createInitialWord() {
          if (wordsCreated < maxWords) {
            createBackgroundWord(true);
            wordsCreated++;
            
            const randomDelay = 20 + Math.random() * 100;
            const timeoutId = setTimeout(createInitialWord, randomDelay);
            experimentTimeouts.current.push(timeoutId);
          } else {
            const intervalId = setInterval(() => {
              if (experimentActiveWords.current.length < maxWords) {
                const randomGap = Math.random() * 1000;
                const timeoutId = setTimeout(() => {
                  createBackgroundWord(true);
                }, randomGap);
                experimentTimeouts.current.push(timeoutId);
              }
            }, 50);
            experimentIntervals.current.push(intervalId);
          }
        }
        
        createInitialWord();
      });
    } else {
      // Handle main page with global state
      if (isInitialized) return;
      isInitialized = true;
      
      loadBackgroundWords().then(() => {
        let wordsCreated = 0;
        
        function createInitialWord() {
          if (wordsCreated < maxWords) {
            createBackgroundWord(true);
            wordsCreated++;
            
            const randomDelay = 20 + Math.random() * 100;
            const timeoutId = setTimeout(createInitialWord, randomDelay);
            globalTimeouts.push(timeoutId);
          } else {
            const intervalId = setInterval(() => {
              if (globalActiveWords.length < maxWords) {
                const randomGap = Math.random() * 1000;
                const timeoutId = setTimeout(() => {
                  createBackgroundWord(true);
                }, randomGap);
                globalTimeouts.push(timeoutId);
              }
            }, 50);
            globalIntervals.push(intervalId);
          }
        }
        
        createInitialWord();
      });
    }
  };

  useEffect(() => {
    // Initialize background words
    initBackgroundWords();
    
    return () => {
      // Cleanup: remove all active words from this instance
      activeWordsRef.current.forEach(word => {
        if (word.parentNode) {
          word.parentNode.removeChild(word);
        }
        // Remove from appropriate array
        if (isExperimentPage) {
          experimentActiveWords.current = experimentActiveWords.current.filter(w => w !== word);
        } else {
          globalActiveWords = globalActiveWords.filter(w => w !== word);
        }
      });
      activeWordsRef.current = [];
      
      // Clear experiment-specific timeouts and intervals
      if (isExperimentPage) {
        experimentTimeouts.current.forEach(timeoutId => clearTimeout(timeoutId));
        experimentIntervals.current.forEach(intervalId => clearInterval(intervalId));
        experimentTimeouts.current = [];
        experimentIntervals.current = [];
        experimentInitialized.current = false;
      }
    };
  }, [containerId]); // Re-run when containerId changes

  useEffect(() => {
    // Update theme when theme changes
    updateBackgroundWordsTheme(theme);
  }, [theme]);

  return (
    <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', zIndex: 1 }}>
      {/* Words are created and managed by DOM manipulation, not React state */}
    </div>
  );
};

export default BackgroundWords;
