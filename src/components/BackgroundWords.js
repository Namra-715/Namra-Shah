import React, { useEffect, useRef } from 'react';

const BackgroundWords = ({ theme }) => {
  const containerRef = useRef(null);
  const activeWordsRef = useRef([]);
  const backgroundWordsRef = useRef([]);
  const maxWords = 46;

  // Function to check if a position overlaps with existing words
  const checkOverlap = (x, y) => {
    const minDistance = 80; // Increased to prevent clustering
    
    for (const activeWord of activeWordsRef.current) {
      const activeX = parseInt(activeWord.style.left);
      const activeY = parseInt(activeWord.style.top);
      
      const distance = Math.sqrt((x - activeX) ** 2 + (y - activeY) ** 2);
      if (distance < minDistance) {
        return true; // Overlap detected
      }
    }
    return false; // No overlap
  };

  // Function to find the least crowded area
  const findLeastCrowdedArea = () => {
    const heroSection = document.getElementById('hero');
    if (!heroSection) return { x: 0, y: 0 };
    
    const width = heroSection.offsetWidth - 80;
    const height = heroSection.offsetHeight - 25;
    
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
        for (const activeWord of activeWordsRef.current) {
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
    if (activeWordsRef.current.length >= maxWords) return;
    
    // Don't create if words haven't been loaded yet
    if (!backgroundWordsRef.current || backgroundWordsRef.current.length === 0) return;
    
    // Get hero section
    const heroSection = document.getElementById('hero');
    if (!heroSection) return;
    
    // Create word element
    const word = document.createElement('div');
    word.className = 'background-word';
    
    // Get random word
    const randomIndex = Math.floor(Math.random() * backgroundWordsRef.current.length);
    word.textContent = backgroundWordsRef.current[randomIndex];
    
    // Smart positioning to prevent clustering
    let x, y;
    let attempts = 0;
    const maxAttempts = 50;
    
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
      x = Math.max(0, Math.min(x, heroSection.offsetWidth - 80));
      y = Math.max(0, Math.min(y, heroSection.offsetHeight - 25));
      
      attempts++;
      
      // Check for overlap with existing words
      if (!checkOverlap(x, y)) break;
      
    } while (attempts < maxAttempts);
    
    // Fallback to random position if no good spot found
    if (attempts >= maxAttempts) {
      x = Math.random() * (heroSection.offsetWidth - 80);
      y = Math.random() * (heroSection.offsetHeight - 25);
    }
    
    word.style.left = x + 'px';
    word.style.top = y + 'px';
    word.style.position = 'absolute';
    
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
    
    // Add to hero section
    heroSection.appendChild(word);
    activeWordsRef.current.push(word);
    
    // Remove word and style after animation completes
    setTimeout(() => {
      if (word.parentNode) {
        word.parentNode.removeChild(word);
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

  // Function to initialize background words (exactly like original)
  const initBackgroundWords = () => {
    // Load words first, then initialize
    loadBackgroundWords().then(() => {
      // Start background words very early (1 second)
      const heroAnimationDelay = 1000;
      
      setTimeout(() => {
        // Create words with much more staggered timing to prevent waves
        let wordsCreated = 0;
        
        function createInitialWord() {
          if (wordsCreated < maxWords) {
            // Create word with random start stage to avoid synchronized lifecycles
            createBackgroundWord(true);
            wordsCreated++;
            
            // More aggressive creation to fill screen faster
            const randomDelay = 50 + Math.random() * 300; // 0.05 to 0.35 seconds
            setTimeout(createInitialWord, randomDelay);
          } else {
            // All initial words created, start the continuous replacement system
            setInterval(() => {
              // Replace words that have finished their lifecycle
              if (activeWordsRef.current.length < maxWords) {
                // Much more random timing to completely break up waves
                const randomGap = Math.random() * 2000; // 0 to 2 seconds random gap
                setTimeout(() => {
                  createBackgroundWord(true);
                }, randomGap);
              }
            }, 100); // Check more frequently for better distribution
          }
        }
        
        // Start creating initial words after hero animation completes
        createInitialWord();
      }, heroAnimationDelay);
    });
  };

  useEffect(() => {
    // Initialize background words
    initBackgroundWords();
    
    return () => {
      // Cleanup: remove all active words
      activeWordsRef.current.forEach(word => {
        if (word.parentNode) {
          word.parentNode.removeChild(word);
        }
      });
      activeWordsRef.current = [];
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Update theme when theme changes
    updateBackgroundWordsTheme(theme);
  }, [theme]);

  return (
    <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Words are created and managed by DOM manipulation, not React state */}
    </div>
  );
};

export default BackgroundWords;
