# Burnout Protector - Technical Documentation

**Version:** 1.0.0  
**Last Updated:** September 28, 2025  
**Manifest Version:** 3  
**License:** MIT

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [System Requirements](#system-requirements)
3. [File Structure](#file-structure)
4. [Core Components](#core-components)
5. [Content Filtering Engine](#content-filtering-engine)
6. [Data Flow](#data-flow)
7. [Storage Schema](#storage-schema)
8. [API Reference](#api-reference)
9. [Performance Considerations](#performance-considerations)
10. [Security & Privacy](#security--privacy)
11. [Testing Strategy](#testing-strategy)
12. [Deployment](#deployment)
13. [Troubleshooting](#troubleshooting)
14. [Future Enhancements](#future-enhancements)

---

## Architecture Overview

### High-Level Design

Burnout Protector is a client-side browser extension built on Chrome's Manifest V3 architecture. It uses a multi-layered approach to content filtering:

```
┌─────────────────────────────────────────────┐
│           Browser Extension                  │
├─────────────────────────────────────────────┤
│  ┌──────────────┐      ┌─────────────────┐ │
│  │   Popup UI   │◄────►│  Background     │ │
│  │  (Settings)  │      │  Service Worker │ │
│  └──────────────┘      └─────────────────┘ │
│         │                       │           │
│         │                       │           │
│         ▼                       ▼           │
│  ┌──────────────────────────────────────┐  │
│  │      Chrome Storage API (sync)       │  │
│  └──────────────────────────────────────┘  │
│         │                       │           │
└─────────┼───────────────────────┼───────────┘
          │                       │
          ▼                       ▼
┌─────────────────────────────────────────────┐
│              Web Pages                       │
├─────────────────────────────────────────────┤
│  ┌──────────────────────────────────────┐  │
│  │   Content Script (content.js)        │  │
│  │   • DOM Observer                     │  │
│  │   • Pattern Matching Engine          │  │
│  │   • Element Replacement              │  │
│  └──────────────────────────────────────┘  │
│         │                                    │
│         ▼                                    │
│  ┌──────────────────────────────────────┐  │
│  │   Modified DOM with Filtered Content │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

### Design Principles

1. **Privacy-First**: All processing occurs client-side; no external API calls for content analysis
2. **Performance**: Minimal DOM manipulation; efficient pattern matching using compiled regex
3. **Transparency**: Users can peek at filtered content and see filtering statistics
4. **Extensibility**: Modular pattern matching system allows easy addition of new categories
5. **User Control**: Granular settings for each category and display option

---

## System Requirements

### Minimum Requirements

- **Chrome/Edge/Brave**: Version 88+ (Manifest V3 support)
- **Firefox**: Version 109+ (Manifest V3 support)
- **Safari**: Version 15.4+ (with Xcode conversion)
- **Storage**: <5MB disk space
- **Memory**: ~10-20MB RAM per tab (depending on page complexity)

### Recommended

- **Chrome/Edge/Brave**: Version 120+
- **Firefox**: Version 120+
- Modern multi-core processor for smooth DOM observation

---

## File Structure

```
BurnoutProtector/
│
├── manifest.json              # Extension configuration (Manifest V3)
│
├── background.js              # Service worker
│   └── Functions:
│       ├── onInstalled()      # Initialization
│       ├── Badge management   # Visual feedback
│       └── Message handling   # Inter-component communication
│
├── content.js                 # Content script (injected into pages)
│   └── Functions:
│       ├── analyzeContent()   # Pattern matching engine
│       ├── filterElement()    # DOM element processor
│       ├── createReplacement()# UI generation
│       └── MutationObserver   # Dynamic content watcher
│
├── content.css                # Styling for filtered content
│   └── Styles:
│       ├── .burnout-protector-shield
│       ├── Category themes (7 variants)
│       ├── Animations
│       └── Responsive design
│
├── popup.html                 # Settings panel UI
│   └── Elements:
│       ├── Header with stats
│       ├── Main toggle
│       ├── Category toggles (7)
│       ├── Display options (3)
│       └── Reset button
│
├── popup.js                   # Settings panel logic
│   └── Functions:
│       ├── updateUI()         # Render settings
│       ├── saveSettings()     # Persist to storage
│       └── Event handlers     # User interactions
│
├── icons/                     # Extension icons
│   ├── icon16.png            # Toolbar icon
│   ├── icon48.png            # Extension management
│   └── icon128.png           # Chrome Web Store
│
└── README.md                  # User documentation
```

---

## Core Components

### 1. Manifest Configuration (manifest.json)

**Purpose**: Defines extension metadata, permissions, and component registration.

**Key Configurations:**

```json
{
  "manifest_version": 3,
  "permissions": ["storage", "activeTab"],
  "host_permissions": ["https://*/*", "http://*/*"],
  "content_scripts": [{
    "matches": ["targeted URLs"],
    "js": ["content.js"],
    "css": ["content.css"],
    "run_at": "document_idle"
  }]
}
```

**Permission Justification:**
- `storage`: Required for saving user preferences
- `activeTab`: Needed for content script injection
- `host_permissions`: Broad access for cross-site filtering

### 2. Background Service Worker (background.js)

**Purpose**: Handles extension lifecycle, badge updates, and cross-component messaging.

**Key Features:**
- Initializes default settings on install
- Updates badge text with filter count
- Listens for storage changes
- Displays welcome notification

**Performance Note**: Service worker remains dormant until needed, minimizing memory usage.

### 3. Content Script (content.js)

**Purpose**: Core filtering engine that processes page content in real-time.

**Architecture:**

```javascript
// Main Components
1. FILTER_PATTERNS      // Regex pattern dictionary
2. analyzeContent()     // Pattern matching
3. filterElement()      // DOM modification
4. MutationObserver     // Dynamic content detection
```

**Execution Flow:**

1. Load settings from storage
2. Initial DOM scan for matching elements
3. Apply filters to matching content
4. Activate MutationObserver for new content
5. Listen for settings changes

### 4. Popup Interface (popup.html + popup.js)

**Purpose**: User-facing settings panel for configuration.

**State Management:**
- Loads settings from `chrome.storage.sync`
- Updates UI to reflect current state
- Saves changes immediately on toggle
- Provides visual feedback for actions

---

## Content Filtering Engine

### Pattern Matching System

**Algorithm**: Multi-pass regex matching with category-based patterns.

#### Filter Categories & Patterns

```javascript
const FILTER_PATTERNS = {
  // 1. Politics (14 patterns)
  politics: [
    /\b(election|vote|democrat|republican|trump|biden)\b/i,
    /\b(congress|senate|political|politician|campaign)\b/i,
    // ... more patterns
  ],
  
  // 2. AI/Tech Hype (8 patterns)
  aiTech: [
    /\b(AI (will|could|might) (kill|destroy|replace))\b/i,
    /\b(revolutionary AI|breakthrough|game-changer)\b/i,
    // ... more patterns
  ],
  
  // 3. Gambling (6 patterns)
  gambling: [
    /\b(bet now|odds|sportsbook|casino)\b/i,
    // ... more patterns
  ],
  
  // 4-7. Additional categories...
};
```

#### Matching Algorithm

**Complexity**: O(n*m) where n = patterns, m = text length

```
1. Extract text content from DOM element
2. Convert to lowercase for case-insensitive matching
3. For each enabled category:
   a. Iterate through category patterns
   b. Test regex against text
   c. Return first match (short-circuit)
4. If match found, create replacement element
5. If no match, element passes through unchanged
```

**Optimization**: Short-circuit evaluation stops at first match, avoiding unnecessary pattern testing.

### Element Replacement System

**Process:**

1. **Identify**: Pattern match triggers replacement
2. **Create**: Generate styled replacement div
3. **Populate**: Add images, quotes, labels, peek button
4. **Replace**: Swap original element with replacement in DOM
5. **Store**: Cache original element for peek functionality

**UI Components:**

```javascript
Replacement Element:
├── .burnout-protector-shield (container)
│   ├── .burnout-content
│   │   ├── .calming-image (optional)
│   │   ├── .quote (optional)
│   │   ├── .filter-label
│   │   └── .peek-button (optional)
```

### Dynamic Content Detection

**MutationObserver Configuration:**

```javascript
observer.observe(document.body, {
  childList: true,    // Watch for added/removed nodes
  subtree: true       // Monitor entire DOM tree
});
```

**Trigger Events:**
- New posts loaded (infinite scroll)
- Comments expanded
- Feed updates
- Single-page app navigation

**Performance**: Observer filters only relevant element types to minimize processing overhead.

---

## Data Flow

### 1. Initial Load Sequence

```
User opens page
      ↓
Content script injected (document_idle)
      ↓
Load settings from chrome.storage.sync
      ↓
Initial DOM scan
      ↓
Apply filters to existing content
      ↓
Activate MutationObserver
      ↓
Monitor for new content
```

### 2. Settings Change Flow

```
User toggles setting in popup
      ↓
popup.js updates settings object
      ↓
Save to chrome.storage.sync
      ↓
Storage change event fired
      ↓
Content script receives update
      ↓
Page reload (for simplicity)
```

### 3. Filtering Flow

```
New element added to DOM
      ↓
MutationObserver detects change
      ↓
analyzeContent() checks element
      ↓
Pattern matching against enabled categories
      ↓
Match found?
   │
   ├─ Yes → createReplacement()
   │         ↓
   │        Replace in DOM
   │         ↓
   │        Increment filter count
   │         ↓
   │        Update badge
   │
   └─ No → Element unchanged
```

---

## Storage Schema

### chrome.storage.sync

**Key**: `settings`

**Schema:**

```typescript
interface Settings {
  enabled: boolean;              // Master toggle
  categories: {
    politics: boolean;           // Filter politics
    aiTech: boolean;            // Filter AI/tech hype
    gambling: boolean;          // Filter gambling
    negative: boolean;          // Filter negative news
    disaster: boolean;          // Filter disasters
    celebrity: boolean;         // Filter celebrity drama
    financial: boolean;         // Filter financial panic
  };
  showImages: boolean;          // Display calming images
  showQuotes: boolean;          // Display quotes
  allowPeek: boolean;           // Show "peek" button
  filterCount: number;          // Total items filtered
}
```

**Default Values:**

```javascript
{
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
}
```

**Storage Limits:**
- `chrome.storage.sync`: 100KB total, 8KB per item
- Current usage: ~1KB (well within limits)

---

## API Reference

### Content Script API

#### `analyzeContent(text: string): string | null`

Analyzes text content for matching patterns.

**Parameters:**
- `text` (string): Text content to analyze

**Returns:**
- (string): Category name if match found
- (null): No match found

**Example:**

```javascript
const category = analyzeContent("Breaking: Election results!");
// Returns: "politics"
```

#### `filterElement(element: HTMLElement): void`

Processes a DOM element and replaces if content matches patterns.

**Parameters:**
- `element` (HTMLElement): DOM element to filter

**Side Effects:**
- May replace element in DOM
- Increments filter count
- Updates storage

**Example:**

```javascript
const tweet = document.querySelector('[data-testid="tweet"]');
filterElement(tweet);
```

#### `createReplacementElement(originalElement: HTMLElement, category: string): HTMLElement`

Generates styled replacement element with calming UI.

**Parameters:**
- `originalElement` (HTMLElement): Original element being replaced
- `category` (string): Matched filter category

**Returns:**
- (HTMLElement): Replacement element

**Example:**

```javascript
const replacement = createReplacementElement(element, "politics");
```

### Popup API

#### `updateUI(): void`

Synchronizes UI state with settings object.

**Side Effects:**
- Updates all toggle states
- Updates filter count display
- Updates disabled states

#### `saveSettings(): void`

Persists settings to chrome.storage.sync.

**Side Effects:**
- Writes to storage
- Notifies content scripts
- May trigger page reload

### Background API

#### `chrome.runtime.onInstalled`

Fired when extension is installed or updated.

**Actions:**
- Initialize default settings
- Display welcome notification

#### `chrome.storage.onChanged`

Fired when storage values change.

**Actions:**
- Update badge text
- Update badge color

---

## Performance Considerations

### Memory Usage

**Per Tab:**
- Content script baseline: ~5-10MB
- Pattern dictionary: ~50KB
- MutationObserver: ~1-5MB (varies with page complexity)
- Replacement elements: ~100KB per 100 filtered items

**Total Extension:**
- Background worker: ~2-5MB
- Popup (when open): ~3-5MB

### CPU Usage

**Initial Scan:**
- Typical page (100 elements): ~50-100ms
- Heavy page (1000+ elements): ~200-500ms

**Mutation Processing:**
- Single element: ~1-5ms
- Bulk updates (10+ elements): ~10-50ms

### Optimizations Implemented

1. **Short-circuit evaluation**: Stop at first pattern match
2. **Lazy loading**: Process elements only when needed
3. **Caching**: Mark processed elements to avoid reprocessing
4. **Efficient selectors**: Target specific element types
5. **Debouncing**: Not currently implemented (future enhancement)

### Performance Bottlenecks

**Identified:**
1. Large initial DOM scans on complex pages
2. High-frequency mutation events (live feeds)
3. Regex compilation overhead

**Mitigation Strategies:**
1. Use `document_idle` for content script injection
2. Implement requestAnimationFrame for batching
3. Consider Web Worker for heavy processing (future)

---

## Security & Privacy

### Threat Model

**In Scope:**
- User privacy from external tracking
- Secure storage of preferences
- Protection against malicious content injection

**Out of Scope:**
- Network-level filtering
- Malware detection
- Phishing protection

### Privacy Guarantees

1. **Zero External Communication**
   - No API calls for content analysis
   - No telemetry or analytics
   - No user behavior tracking

2. **Local Processing Only**
   - All pattern matching client-side
   - Settings stored in browser only
   - No cloud synchronization beyond Chrome sync

3. **Minimal Data Collection**
   - Filter count (optional, user-visible)
   - User preferences only
   - No browsing history

4. **No Third-Party Dependencies**
   - Pure JavaScript implementation
   - No external libraries
   - No CDN dependencies

### Security Measures

1. **Content Security Policy**
   - Inline scripts prohibited
   - External resources restricted

2. **Permission Minimization**
   - Only essential permissions requested
   - No clipboard access
   - No downloads permission

3. **Input Validation**
   - Settings validated before saving
   - DOM manipulation sanitized
   - No eval() usage

### Data Retention

- **Settings**: Persist until user uninstalls or resets
- **Filter count**: Can be reset by user at any time
- **No long-term data storage**: No logs, history, or caches

---

## Testing Strategy

### Unit Testing

**Framework**: Jest (recommended)

**Test Coverage Areas:**

```javascript
// content.js
describe('analyzeContent', () => {
  test('detects political content', () => {
    expect(analyzeContent('election results')).toBe('politics');
  });
  
  test('returns null for benign content', () => {
    expect(analyzeContent('cute cat photos')).toBeNull();
  });
  
  test('is case-insensitive', () => {
    expect(analyzeContent('ELECTION RESULTS')).toBe('politics');
  });
});

// popup.js
describe('saveSettings', () => {
  test('persists to chrome.storage', async () => {
    await saveSettings();
    const result = await chrome.storage.sync.get('settings');
    expect(result.settings).toBeDefined();
  });
});
```

### Integration Testing

**Manual Test Cases:**

1. **Installation Flow**
   - Install extension
   - Verify default settings
   - Check welcome notification

2. **Content Filtering**
   - Visit Twitter
   - Verify political tweets filtered
   - Check replacement UI displays correctly

3. **Settings Persistence**
   - Change setting in popup
   - Refresh page
   - Verify setting persisted

4. **Peek Functionality**
   - Click "Show anyway" button
   - Verify original content restored
   - Check no state corruption

### End-to-End Testing

**Tools**: Puppeteer or Playwright

**Test Scenarios:**

```javascript
test('filters Twitter political content', async () => {
  await page.goto('https://twitter.com');
  await page.waitForSelector('.burnout-protector-shield');
  const filtered = await page.$$('.burnout-protector-shield');
  expect(filtered.length).toBeGreaterThan(0);
});
```

### Performance Testing

**Metrics to Monitor:**
- Initial load time
- Memory consumption over time
- CPU usage during heavy scrolling
- Extension impact on page load

**Tools:**
- Chrome DevTools Performance tab
- Memory profiler
- Lighthouse extension performance audit

### Browser Compatibility Testing

**Test Matrix:**

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 120+ | ✅ Primary |
| Edge | 120+ | ✅ Supported |
| Brave | 1.60+ | ✅ Supported |
| Firefox | 120+ | ⚠️ Testing required |
| Safari | 15.4+ | ⚠️ Conversion required |

---

## Deployment

### Pre-Deployment Checklist

- [ ] All icons created (16, 48, 128px)
- [ ] README.md complete
- [ ] Privacy policy written
- [ ] Test on target platforms
- [ ] Version number updated
- [ ] Changelog documented

### Chrome Web Store Deployment

**Requirements:**
- Google Developer account ($5 one-time fee)
- High-quality screenshots (1280x800 or 640x400)
- Promotional images (optional)
- Privacy policy URL

**Steps:**

1. Create ZIP file:
   ```bash
   zip -r BurnoutProtector.zip . -x "*.git*" -x "node_modules/*"
   ```

2. Upload to Chrome Web Store Developer Dashboard
3. Fill out listing details:
   - Name: Burnout Protector
   - Summary: Protect your mental wellbeing by filtering anxiety-inducing content
   - Description: (from README)
   - Category: Productivity
   - Language: English

4. Submit for review (typically 1-3 days)

### Firefox Add-ons Deployment

**Requirements:**
- Firefox Developer account (free)
- Source code submission (if using minification)

**Steps:**

1. Create XPI file:
   ```bash
   zip -r BurnoutProtector.xpi . -x "*.git*"
   ```

2. Upload to addons.mozilla.org
3. Automated validation runs
4. Submit for review

### Edge Add-ons Deployment

**Process**: Similar to Chrome Web Store

### Version Management

**Semantic Versioning:**
- MAJOR.MINOR.PATCH (e.g., 1.0.0)
- MAJOR: Breaking changes
- MINOR: New features
- PATCH: Bug fixes

**Update Process:**

1. Update `manifest.json` version
2. Update `README.md` with changes
3. Create GitHub release
4. Upload to extension stores
5. Users auto-update within 24-48 hours

---

## Troubleshooting

### Common Issues

#### Extension Not Loading

**Symptoms**: Icon not visible, no filtering

**Diagnosis:**
1. Check `chrome://extensions/` for errors
2. Verify all files present
3. Check manifest.json syntax

**Solution:**
```bash
# Reload extension
1. Go to chrome://extensions/
2. Click refresh icon
3. Check for errors in console
```

#### Filtering Too Aggressive

**Symptoms**: Legitimate content filtered

**Diagnosis:**
1. Check which category matched
2. Review pattern in FILTER_PATTERNS
3. Check for false positive keywords

**Solution:**
```javascript
// Refine pattern to be more specific
// Before: /\b(AI)\b/i
// After: /\b(AI (will|could) (destroy|end))\b/i
```

#### Performance Issues

**Symptoms**: Page slow to load, high CPU usage

**Diagnosis:**
1. Open Chrome DevTools Performance tab
2. Record page load
3. Identify bottleneck

**Solution:**
```javascript
// Add debouncing to mutation observer
const debouncedFilter = debounce(filterElement, 100);
```

#### Settings Not Persisting

**Symptoms**: Changes revert after reload

**Diagnosis:**
1. Check chrome.storage quota
2. Verify sync is enabled
3. Check for storage errors

**Solution:**
```javascript
// Check storage
chrome.storage.sync.getBytesInUse(['settings'], (bytes) => {
  console.log('Storage used:', bytes, 'bytes');
});
```

### Debug Mode

**Enable verbose logging:**

```javascript
// Add to content.js
const DEBUG = true;

function log(...args) {
  if (DEBUG) console.log('[Burnout Protector]', ...args);
}

// Use throughout code
log('Filtering element:', element);
log('Pattern matched:', category);
```

### Performance Profiling

```javascript
// Measure filtering performance
console.time('filterElement');
filterElement(element);
console.timeEnd('filterElement');
```

---

## Future Enhancements

### Roadmap

#### Version 1.1 (Q4 2025)

- [ ] Scheduled filtering (time-based rules)
- [ ] Intensity slider (strict → relaxed)
- [ ] Whitelist trusted sources
- [ ] Import/export settings

#### Version 1.2 (Q1 2026)

- [ ] Machine learning sentiment analysis (TensorFlow.js)
- [ ] More replacement themes (ocean, forest, space)
- [ ] Wellbeing dashboard
- [ ] Weekly digest reports

#### Version 2.0 (Q2 2026)

- [ ] Mobile app (iOS/Android)
- [ ] Cross-device sync
- [ ] Community pattern sharing
- [ ] Multi-language support

### Technical Debt

**Current Limitations:**

1. **No debouncing on MutationObserver**
   - Could cause performance issues on high-frequency updates
   - Solution: Implement requestAnimationFrame batching

2. **Regex-based filtering only**
   - Limited accuracy vs. ML approaches
   - Solution: Add optional TensorFlow.js sentiment analysis

3. **Page reload on settings change**
   - Poor UX for minor tweaks
   - Solution: Implement dynamic re-filtering without reload

4. **No analytics/telemetry**
   - Can't measure effectiveness
   - Solution: Add optional, privacy-respecting metrics

### Proposed Features

#### 1. Smart Scheduling

```javascript
// Example: No politics after 8pm
settings.schedule = {
  enabled: true,
  rules: [
    {
      category: 'politics',
      disabledHours: [20, 21, 22, 23, 0, 1, 2, 3, 4, 5, 6]
    }
  ]
};
```

#### 2. Intensity Levels

```javascript
settings.intensity = 'relaxed'; // relaxed | moderate | strict

// Strict: Filter everything matching any pattern
// Moderate: Require 2+ pattern matches
// Relaxed: Only filter highly negative content
```

#### 3. Whitelist System

```javascript
settings.whitelist = {
  domains: ['nytimes.com', 'bbc.com'],
  authors: ['@trustednewsperson'],
  keywords: ['important update']
};
```

#### 4. ML-Based Filtering

```javascript
// Optional TensorFlow.js integration
import * as toxicity from '@tensorflow-models/toxicity';

async function analyzeSentiment(text) {
  const model = await toxicity.load();
  const predictions = await model.classify(text);
  return predictions;
}
```

---

## Appendix

### A. Regex Pattern Reference

**Common Patterns:**

```javascript
// Word boundary matching
/\b(word)\b/i          // Matches "word" but not "keyword"

// Alternation (OR)
/\b(cat|dog|bird)\b/i  // Matches any of: cat, dog, bird

// Grouping with modifiers
/\b(very )?(bad|awful)\b/i  // Matches "bad" or "very bad"

// Case insensitivity
/pattern/i             // Flag 'i' makes match case-insensitive
```

### B. Chrome APIs Used

**chrome.storage.sync**
- Purpose: Store user settings
- Limit: 100KB total
- Methods: get(), set()

**chrome.runtime**
- Purpose: Extension lifecycle events
- Events: onInstalled, onMessage

**chrome.action**
- Purpose: Extension icon and badge
- Methods: setBadgeText(), setBadgeBackgroundColor()

**chrome.notifications**
- Purpose: System notifications
- Methods: create()

### C. Browser Compatibility Matrix

| Feature | Chrome | Firefox | Edge | Safari |
|---------|--------|---------|------|--------|
| Manifest V3 | ✅ | ✅ | ✅ | ⚠️ |
| chrome.storage.sync | ✅ | ✅* | ✅ | ❌ |
| MutationObserver | ✅ | ✅ | ✅ | ✅ |
| CSS Gradients | ✅ | ✅ | ✅ | ✅ |

*Firefox uses browser.storage.sync

### D. Resources

**Documentation:**
- [Chrome Extensions Docs](https://developer.chrome.com/docs/extensions/)
- [MDN Web Extensions](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
- [Manifest V3 Migration](https://developer.chrome.com/docs/extensions/mv3/intro/)

**Tools:**
- [Regex101](https://regex101.com/) - Regex testing
- [Extension Reloader](https://chrome.google.com/webstore/detail/extensions-reloader/) - Development tool
- [web-ext](https://github.com/mozilla/web-ext) - Firefox development CLI

---

## Changelog

### Version 1.0.0 (September 28, 2025)

**Initial Release**

Features:
- 7 filter categories with 50+ patterns
- Beautiful calming UI replacements
- Granular settings control
- Privacy-first architecture
- Cross-platform support (Chrome, Firefox, Edge)
- Filter count tracking
- Peek functionality

---

**Document Version:** 1.0  
**Last Updated:** September 28, 2025  
**Maintained By:** Burnout Protector Development Team