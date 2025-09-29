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
    if (chrome.runtime.lastError) {
      console.error('Burnout Protector: Error checking existing settings:', chrome.runtime.lastError);
      return;
    }
    if (!result.settings) {
      chrome.storage.sync.set({ settings: defaultSettings }, () => {
        if (chrome.runtime.lastError) {
          console.error('Burnout Protector: Error setting default settings:', chrome.runtime.lastError);
        }
      });
    }
  });
  
  // Show welcome notification
  if (chrome.notifications) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: 'Burnout Protector Activated! 🛡️',
      message: 'Your mental wellbeing shield is now active. Browse with peace of mind.'
    }, (notificationId) => {
      if (chrome.runtime.lastError) {
        console.warn('Burnout Protector: Could not show notification:', chrome.runtime.lastError);
      }
    });
  }
});

// Badge to show filter count
if (chrome.storage && chrome.storage.onChanged) {
  chrome.storage.onChanged.addListener((changes) => {
    try {
      if (changes.settings && changes.settings.newValue) {
        const count = changes.settings.newValue.filterCount;
        if (count > 0) {
          chrome.action.setBadgeText({ text: count.toString() });
          chrome.action.setBadgeBackgroundColor({ color: '#667eea' });
        } else {
          chrome.action.setBadgeText({ text: '' });
        }
      }
    } catch (error) {
      console.error('Burnout Protector: Error updating badge:', error);
    }
  });
}

// Listen for messages from content scripts
if (chrome.runtime && chrome.runtime.onMessage) {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    try {
      if (request.action === 'incrementFilterCount') {
        chrome.storage.sync.get(['settings'], (result) => {
          if (chrome.runtime.lastError) {
            console.error('Burnout Protector: Error getting settings for filter count:', chrome.runtime.lastError);
            return;
          }
          if (result.settings) {
            result.settings.filterCount++;
            chrome.storage.sync.set({ settings: result.settings }, () => {
              if (chrome.runtime.lastError) {
                console.error('Burnout Protector: Error saving filter count:', chrome.runtime.lastError);
              }
            });
          }
        });
      }
    } catch (error) {
      console.error('Burnout Protector: Error handling message:', error);
    }

    return true;
  });
}