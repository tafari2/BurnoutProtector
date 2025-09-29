// Burnout Protector - Content Script
// Processes locally for privacy

const FILTER_PATTERNS = {
  politics: [
    /\b(election|vote|democrat|republican|trump|biden|congress|senate|political|politician|campaign)\b/i,
    /\b(liberal|conservative|left-wing|right-wing|partisan|policy|legislation)\b/i
  ],
  aiTech: [
    /\b(AI (will|could|might) (kill|destroy|replace|end)|AGI|existential risk)\b/i,
    /\b(revolutionary AI|breakthrough|game-changer|disrupting everything)\b/i,
    /\b(crypto (crash|moon|scam)|NFT|blockchain revolution)\b/i
  ],
  gambling: [
    /\b(bet now|odds|sportsbook|casino|poker|slot machine|gambling)\b/i,
    /\b(win big|jackpot|lottery|betting)\b/i
  ],
  negative: [
    /\b(breaking|urgent|crisis|disaster|tragedy|horror|terrible|awful)\b/i,
    /\b(shocking|outrage|scandal|controversy|slams|blasts|destroys)\b/i,
    /\b(you won't believe|everyone is talking about|went viral)\b/i
  ],
  disaster: [
    /\b(earthquake|hurricane|flood|wildfire|tsunami|tornado)\b/i,
    /\b(death toll|casualties|victims|devastation)\b/i
  ],
  celebrity: [
    /\b(kardashian|celebrity drama|feud|breakup|relationship)\b/i,
    /\b(shocking revelation|secret exposed)\b/i
  ],
  financial: [
    /\b(market crash|stock plunge|recession|economic collapse)\b/i,
    /\b(financial crisis|bankruptcy|debt crisis)\b/i
  ]
};

const CALMING_IMAGES = [
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Cdefs%3E%3ClinearGradient id="sky" x1="0" y1="0" x2="0" y2="1"%3E%3Cstop offset="0%25" stop-color="%2387CEEB"/%3E%3Cstop offset="100%25" stop-color="%23E0F6FF"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23sky)" width="400" height="300"/%3E%3Ccircle cx="320" cy="60" r="40" fill="%23FFD700" opacity="0.8"/%3E%3Cellipse cx="100" cy="250" rx="80" ry="30" fill="%2398D8C8"/%3E%3Cellipse cx="300" cy="260" rx="100" ry="35" fill="%2398D8C8"/%3E%3Cpath d="M 0 230 Q 100 200 200 230 T 400 230 L 400 300 L 0 300 Z" fill="%2334C759"/%3E%3C/svg%3E'
];

const ENCOURAGING_QUOTES = [
  "Take a breath. You're doing great.",
  "Your wellbeing matters more than staying updated.",
  "Peace of mind is priceless.",
  "Protected content for your mental health.",
  "You chose calm over chaos today.",
  "This space is reserved for your peace.",
  "Filtered for your wellbeing ✨",
  "Taking care of your mind, one post at a time."
];

let settings = {
  enabled: true,
  categories: {
    politics: true,
    aiTech: true,
    gambling: true,
    negative: true,
    disaster: true,
    celebrity: true,
    financial: true
  },
  showImages: true,
  showQuotes: true,
  allowPeek: true,
  filterCount: 0
};

// Load settings from storage
chrome.storage.sync.get(['settings'], (result) => {
  if (chrome.runtime.lastError) {
    console.warn('Burnout Protector: Error loading settings:', chrome.runtime.lastError);
    startFiltering();
    return;
  }
  if (result.settings) {
    settings = { ...settings, ...result.settings };
  }
  startFiltering();
});

function analyzeContent(text) {
  if (!text || !settings.enabled) return null;
  
  text = text.toLowerCase();
  
  for (const [category, patterns] of Object.entries(FILTER_PATTERNS)) {
    if (!settings.categories[category]) continue;
    
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        return category;
      }
    }
  }
  
  return null;
}

function createReplacementElement(originalElement, category) {
  const replacement = document.createElement('div');
  replacement.className = 'burnout-protector-shield';
  replacement.setAttribute('data-category', category);
  
  const content = document.createElement('div');
  content.className = 'burnout-content';
  
  if (settings.showImages) {
    const img = document.createElement('img');
    img.src = CALMING_IMAGES[Math.floor(Math.random() * CALMING_IMAGES.length)];
    img.className = 'calming-image';
    content.appendChild(img);
  }
  
  if (settings.showQuotes) {
    const quote = document.createElement('div');
    quote.className = 'quote';
    quote.textContent = ENCOURAGING_QUOTES[Math.floor(Math.random() * ENCOURAGING_QUOTES.length)];
    content.appendChild(quote);
  }
  
  const label = document.createElement('div');
  label.className = 'filter-label';
  label.textContent = `${category} content filtered`;
  content.appendChild(label);
  
  if (settings.allowPeek) {
    const peekBtn = document.createElement('button');
    peekBtn.className = 'peek-button';
    peekBtn.textContent = 'Show anyway';
    peekBtn.onclick = (e) => {
      e.stopPropagation();
      replacement.replaceWith(originalElement);
    };
    content.appendChild(peekBtn);
  }
  
  replacement.appendChild(content);
  
  // Store original element for peek functionality
  replacement._originalElement = originalElement.cloneNode(true);
  
  return replacement;
}

function filterElement(element) {
  if (element.classList.contains('burnout-protector-shield')) return;
  if (element.hasAttribute('data-burnout-checked')) return;
  
  element.setAttribute('data-burnout-checked', 'true');
  
  const text = element.textContent || element.innerText || '';
  const category = analyzeContent(text);
  
  if (category) {
    const replacement = createReplacementElement(element, category);
    element.replaceWith(replacement);
    
    settings.filterCount++;
    chrome.storage.sync.set({ settings }, () => {
      if (chrome.runtime.lastError) {
        console.warn('Burnout Protector: Error saving filter count:', chrome.runtime.lastError);
      }
    });
  }
}

function startFiltering() {
  // Platform-specific selectors
  const selectors = {
    twitter: '[data-testid="tweet"]',
    reddit: '.Post, [data-test-id="post-content"]',
    youtube: 'ytd-video-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer',
    facebook: '[data-pagelet*="FeedUnit"]',
    general: 'article, .post, .entry, .story'
  };
  
  const allSelectors = Object.values(selectors).join(', ');
  
  // Initial scan
  document.querySelectorAll(allSelectors).forEach(filterElement);
  
  // Watch for new content (infinite scroll, etc.)
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) { // Element node
          if (node.matches && node.matches(allSelectors)) {
            filterElement(node);
          }
          node.querySelectorAll && node.querySelectorAll(allSelectors).forEach(filterElement);
        }
      });
    });
  });

  // Store observer globally so we can disconnect it later
  window.burnoutObserver = observer;

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Helper functions for dynamic filtering without page reload
function restartFiltering() {
  // Clear any existing observer and restart filtering
  if (window.burnoutObserver) {
    window.burnoutObserver.disconnect();
  }
  startFiltering();
}

function restoreFilteredContent() {
  // Find all filtered elements and restore their original content
  const filteredElements = document.querySelectorAll('.burnout-protector-shield');
  filteredElements.forEach(shieldElement => {
    if (shieldElement._originalElement) {
      shieldElement.replaceWith(shieldElement._originalElement);
    }
  });

  // Disconnect observer when disabled
  if (window.burnoutObserver) {
    window.burnoutObserver.disconnect();
    window.burnoutObserver = null;
  }
}

function rescanContent() {
  // Re-scan all content with new settings without removing existing filters
  const selectors = {
    twitter: '[data-testid="tweet"]',
    reddit: '.Post, [data-test-id="post-content"]',
    youtube: 'ytd-video-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer',
    facebook: '[data-pagelet*="FeedUnit"]',
    general: 'article, .post, .entry, .story'
  };

  const allSelectors = Object.values(selectors).join(', ');

  // Only scan elements that haven't been checked yet or need re-checking
  document.querySelectorAll(allSelectors).forEach(element => {
    if (!element.classList.contains('burnout-protector-shield')) {
      // Remove the checked attribute to allow re-scanning
      element.removeAttribute('data-burnout-checked');
      filterElement(element);
    }
  });
}

// Listen for setting changes
if (chrome.storage && chrome.storage.onChanged) {
  chrome.storage.onChanged.addListener((changes) => {
    try {
      if (changes.settings) {
        const oldSettings = { ...settings };
        settings = { ...settings, ...changes.settings.newValue };

        // Handle settings changes without page reload
        if (settings.enabled !== oldSettings.enabled) {
          if (settings.enabled) {
            // Extension was just enabled - start filtering
            restartFiltering();
          } else {
            // Extension was disabled - restore filtered content
            restoreFilteredContent();
          }
        } else if (settings.enabled) {
          // Settings changed while enabled - re-scan existing content
          rescanContent();
        }
      }
    } catch (error) {
      console.warn('Burnout Protector: Error handling settings change:', error);
    }
  });
}