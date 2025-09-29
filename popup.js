// Burnout Protector - Popup Script

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

// Load settings on popup open
chrome.storage.sync.get(['settings'], (result) => {
  if (chrome.runtime.lastError) {
    console.error('Burnout Protector: Error loading settings:', chrome.runtime.lastError);
    updateUI();
    return;
  }
  if (result.settings) {
    settings = { ...settings, ...result.settings };
  }
  updateUI();
});

function updateUI() {
  // Main toggle
  document.getElementById('enabledToggle').checked = settings.enabled;
  document.getElementById('settingsPanel').classList.toggle('disabled', !settings.enabled);
  
  // Category toggles
  document.querySelectorAll('.category-toggle').forEach(toggle => {
    const category = toggle.dataset.category;
    toggle.checked = settings.categories[category];
  });
  
  // Display options
  document.getElementById('showImages').checked = settings.showImages;
  document.getElementById('showQuotes').checked = settings.showQuotes;
  document.getElementById('allowPeek').checked = settings.allowPeek;
  
  // Filter count
  document.getElementById('filterCount').textContent = settings.filterCount;
}

function saveSettings() {
  chrome.storage.sync.set({ settings }, () => {
    if (chrome.runtime.lastError) {
      console.error('Burnout Protector: Error saving settings:', chrome.runtime.lastError);
      return;
    }
    // Notify content scripts
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (chrome.runtime.lastError) {
        console.error('Burnout Protector: Error querying tabs:', chrome.runtime.lastError);
        return;
      }
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'settingsUpdated',
          settings
        }).catch((error) => {
          // Tab might not have content script - this is normal
          console.debug('Burnout Protector: Could not send message to tab:', error.message);
        });
      }
    });
  });
}

// Main toggle
document.getElementById('enabledToggle').addEventListener('change', (e) => {
  settings.enabled = e.target.checked;
  document.getElementById('settingsPanel').classList.toggle('disabled', !settings.enabled);
  saveSettings();
});

// Category toggles
document.querySelectorAll('.category-toggle').forEach(toggle => {
  toggle.addEventListener('change', (e) => {
    const category = e.target.dataset.category;
    settings.categories[category] = e.target.checked;
    saveSettings();
  });
});

// Display options
document.getElementById('showImages').addEventListener('change', (e) => {
  settings.showImages = e.target.checked;
  saveSettings();
});

document.getElementById('showQuotes').addEventListener('change', (e) => {
  settings.showQuotes = e.target.checked;
  saveSettings();
});

document.getElementById('allowPeek').addEventListener('change', (e) => {
  settings.allowPeek = e.target.checked;
  saveSettings();
});

// Reset button
document.getElementById('resetBtn').addEventListener('click', () => {
  settings.filterCount = 0;
  document.getElementById('filterCount').textContent = '0';
  saveSettings();
  
  // Visual feedback
  const btn = document.getElementById('resetBtn');
  btn.textContent = 'Reset! ✓';
  setTimeout(() => {
    btn.textContent = 'Reset Filter Count';
  }, 1500);
});