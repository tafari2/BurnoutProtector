// Burnout Protector - Background Service Worker

// Initialize settings on install
chrome.runtime.onInstalled.addListener(() => {
  const defaultSettings = {
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
  
  chrome.storage.sync.get(['settings'], (result) => {
    if (!result.settings) {
      chrome.storage.sync.set({ settings: defaultSettings });
    }
  });
  
  // Show welcome notification
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title: 'Burnout Protector Activated! 🛡️',
    message: 'Your mental wellbeing shield is now active. Browse with peace of mind.'
  });
});

// Badge to show filter count
chrome.storage.onChanged.addListener((changes) => {
  if (changes.settings && changes.settings.newValue) {
    const count = changes.settings.newValue.filterCount;
    if (count > 0) {
      chrome.action.setBadgeText({ text: count.toString() });
      chrome.action.setBadgeBackgroundColor({ color: '#667eea' });
    } else {
      chrome.action.setBadgeText({ text: '' });
    }
  }
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'incrementFilterCount') {
    chrome.storage.sync.get(['settings'], (result) => {
      if (result.settings) {
        result.settings.filterCount++;
        chrome.storage.sync.set({ settings: result.settings });
      }
    });
  }
  
  return true;
});