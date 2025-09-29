# Contributing to Burnout Protector

Thank you for your interest in contributing to Burnout Protector! 🛡️

This project exists to help people protect their mental wellbeing online. Every contribution—whether code, design, documentation, or ideas—helps make the internet a healthier place.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Submitting Changes](#submitting-changes)
- [Issue Guidelines](#issue-guidelines)
- [Community](#community)

---

## Code of Conduct

### Our Pledge

This is a mental health project. We're committed to providing a welcoming, supportive environment for everyone, regardless of:

- Age, body size, disability, ethnicity
- Gender identity and expression
- Level of experience
- Nationality, personal appearance, race
- Religion, sexual identity and orientation

### Our Standards

**Positive behaviors:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what's best for the community
- Showing empathy towards others

**Unacceptable behaviors:**
- Trolling, insulting/derogatory comments, personal attacks
- Public or private harassment
- Publishing others' private information
- Conduct that could be considered inappropriate in a professional setting

### Enforcement

Violations can be reported to [your-email@example.com]. All complaints will be reviewed and investigated promptly and fairly.

---

## How Can I Contribute?

### 🐛 Reporting Bugs

Found a bug? Help us fix it!

**Before submitting:**
1. Check if the issue already exists in [Issues](../../issues)
2. Verify it happens on the latest version
3. Test in multiple browsers if possible

**When submitting:**
- Use the bug report template
- Include clear steps to reproduce
- Describe expected vs actual behavior
- Add screenshots/videos if helpful
- Specify browser version and OS

**Example:**
```markdown
**Bug**: Political content not filtered on Twitter

**Steps to Reproduce:**
1. Install extension v1.0.0
2. Enable politics filter
3. Visit twitter.com
4. Scroll feed

**Expected**: Political tweets replaced with calming UI
**Actual**: Political tweets still visible

**Browser**: Chrome 120.0.6099.129
**OS**: macOS 14.1
```

### 💡 Suggesting Features

Have an idea? We'd love to hear it!

**Before suggesting:**
1. Check existing feature requests
2. Consider if it aligns with our [core mission](#core-mission)
3. Think about privacy implications

**When suggesting:**
- Use the feature request template
- Explain the problem you're solving
- Describe your proposed solution
- Consider alternatives
- Think about implementation complexity

**Example:**
```markdown
**Feature**: Schedule-based filtering

**Problem**: I want to avoid politics during work hours, but stay informed in the evening.

**Solution**: Add a scheduler where users can enable/disable categories based on time of day.

**Alternatives**: 
- "Work mode" toggle that disables all filters
- Browser profile switching

**Implementation Notes**:
- Would need time-based logic in content.js
- Add schedule UI to popup
- Store schedule in chrome.storage
```

### 📝 Improving Documentation

Documentation is code! Help us make it clearer:

- Fix typos or unclear explanations
- Add examples to technical docs
- Translate to other languages
- Create video tutorials
- Write blog posts about usage

### 🎨 Design Contributions

Make Burnout Protector more beautiful:

- New calming image SVGs
- Alternative color themes
- Improved popup UI designs
- Icon redesigns
- Promotional graphics

### 🧑‍💻 Code Contributions

The fun part! See [Development Workflow](#development-workflow) below.

---

## Getting Started

### Prerequisites

- **Browser**: Chrome 120+ (for development)
- **Editor**: VS Code recommended (with ESLint extension)
- **Git**: Latest version
- **Node.js**: 18+ (optional, for testing)

### Fork & Clone

```bash
# Fork the repository on GitHub
# Then clone your fork:

git clone https://github.com/YOUR_USERNAME/BurnoutProtector.git
cd BurnoutProtector

# Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/BurnoutProtector.git
```

### Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (top-right toggle)
3. Click "Load unpacked"
4. Select the `BurnoutProtector` folder
5. The extension should now be active!

### Verify Installation

```bash
# Check for errors in chrome://extensions/
# Test on Twitter: https://twitter.com
# Open popup and verify settings UI
# Check browser console for errors
```

---

## Development Workflow

### 1. Create a Branch

```bash
# Update your fork
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/issue-number-description
```

**Branch naming conventions:**
- `feature/add-scheduling` - New features
- `fix/twitter-filtering` - Bug fixes
- `docs/improve-readme` - Documentation
- `refactor/optimize-patterns` - Code refactoring
- `test/add-unit-tests` - Testing

### 2. Make Changes

**Best practices:**
- Keep changes focused (one feature/fix per PR)
- Write clear, self-documenting code
- Add comments for complex logic
- Update documentation as you go
- Test thoroughly in multiple browsers

**File modification guidelines:**

```javascript
// content.js - Adding new filter pattern
const FILTER_PATTERNS = {
  yourNewCategory: [
    /\b(pattern1|pattern2)\b/i,  // Brief comment explaining
    /\b(complex.*pattern)\b/i     // Why this pattern needed
  ]
};

// Always test patterns on regex101.com first!
```

### 3. Test Your Changes

```bash
# Manual testing checklist:
# [ ] Extension loads without errors
# [ ] New feature works as expected
# [ ] Existing features still work
# [ ] UI looks good on different screen sizes
# [ ] No console errors
# [ ] Performance is acceptable

# Reload extension after changes:
# Go to chrome://extensions/ and click refresh icon
```

### 4. Commit Changes

```bash
# Stage your changes
git add .

# Commit with descriptive message
git commit -m "feat: add schedule-based filtering

- Add time-based rule system
- Update popup UI with schedule options
- Add storage schema for schedules
- Update documentation

Closes #123"
```

**Commit message format:**

```
<type>: <short summary>

<optional body>

<optional footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**

```bash
# Good commits
git commit -m "fix: prevent duplicate filtering on Twitter"
git commit -m "feat: add intensity slider to popup UI"
git commit -m "docs: improve pattern matching examples"

# Bad commits (avoid these)
git commit -m "fixed stuff"
git commit -m "asdfasdf"
git commit -m "updates"
```

### 5. Push & Create Pull Request

```bash
# Push to your fork
git push origin feature/your-feature-name

# Then create Pull Request on GitHub
```

---

## Coding Standards

### JavaScript Style Guide

**General principles:**
- Use modern ES6+ syntax
- Prefer `const` over `let`, avoid `var`
- Use meaningful variable names
- Keep functions small and focused
- Avoid deeply nested code

**Examples:**

```javascript
// ✅ Good
const filterCategories = ['politics', 'aiTech', 'gambling'];
const isEnabled = settings.categories[category];

function analyzeContent(text) {
  if (!text || !settings.enabled) return null;
  
  for (const [category, patterns] of Object.entries(FILTER_PATTERNS)) {
    if (!settings.categories[category]) continue;
    if (matchesPattern(text, patterns)) return category;
  }
  
  return null;
}

// ❌ Avoid
var cats = ['politics', 'aiTech', 'gambling'];
var x = settings.categories[category];

function doStuff(t) {
  if (t) {
    if (settings.enabled) {
      for (var i = 0; i < Object.keys(FILTER_PATTERNS).length; i++) {
        var category = Object.keys(FILTER_PATTERNS)[i];
        if (settings.categories[category]) {
          // ... deeply nested logic
        }
      }
    }
  }
}
```

### Naming Conventions

```javascript
// Variables and functions: camelCase
const filterCount = 0;
function createReplacement() {}

// Constants: UPPER_SNAKE_CASE
const MAX_FILTER_COUNT = 1000;
const FILTER_PATTERNS = {};

// Classes: PascalCase
class ContentFilter {}

// Private methods: _prefixWithUnderscore
function _internalHelper() {}

// Boolean variables: is/has prefix
const isEnabled = true;
const hasBeenFiltered = false;
```

### Code Organization

```javascript
// File structure:
// 1. Imports (if any)
// 2. Constants
// 3. State/settings
// 4. Helper functions
// 5. Main functions
// 6. Event listeners
// 7. Initialization

// Example:

// ========== Constants ==========
const FILTER_PATTERNS = { /* ... */ };
const CALMING_IMAGES = [ /* ... */ ];

// ========== State ==========
let settings = { /* ... */ };

// ========== Helper Functions ==========
function matchesPattern(text, patterns) {
  // Implementation
}

// ========== Main Functions ==========
function analyzeContent(text) {
  // Implementation
}

// ========== Event Listeners ==========
chrome.storage.onChanged.addListener((changes) => {
  // Implementation
});

// ========== Initialization ==========
chrome.storage.sync.get(['settings'], (result) => {
  // Implementation
});
```

### Comments

```javascript
// Good comments explain WHY, not WHAT

// ❌ Bad - describes WHAT code does
// Loop through patterns
for (const pattern of patterns) {
  // Test pattern
  if (pattern.test(text)) {
    return true;
  }
}

// ✅ Good - explains WHY this approach
// Use short-circuit evaluation to stop at first match
// This significantly improves performance on pages with 1000+ elements
for (const pattern of patterns) {
  if (pattern.test(text)) {
    return true;
  }
}

// ✅ Good - explains non-obvious decision
// Store original element for peek functionality
// We can't just hide it because some sites recycle DOM nodes
replacement._originalElement = originalElement.cloneNode(true);
```

### Regex Patterns

```javascript
// Always test patterns on regex101.com
// Use word boundaries for precision
// Add comments explaining complex patterns

const FILTER_PATTERNS = {
  politics: [
    // Match "election" as whole word, not "selection"
    /\b(election|elections)\b/i,
    
    // Match AI fear-mongering specifically
    // Not just any mention of AI
    /\b(AI (will|could|might) (kill|destroy|replace|end))\b/i,
    
    // Match breaking news format
    // "BREAKING:", "Breaking News:", etc.
    /\b(breaking|urgent)[\s:]/i
  ]
};
```

### CSS Standards

```css
/* Use BEM-like naming */
.burnout-protector-shield { }
.burnout-protector-shield__content { }
.burnout-protector-shield--disabled { }

/* Group related properties */
.element {
  /* Positioning */
  position: relative;
  top: 0;
  left: 0;
  
  /* Display & Box Model */
  display: flex;
  width: 100%;
  padding: 20px;
  margin: 10px 0;
  
  /* Colors & Backgrounds */
  background: linear-gradient(...);
  color: #333;
  
  /* Typography */
  font-size: 16px;
  font-weight: 600;
  
  /* Misc */
  cursor: pointer;
  transition: all 0.3s ease;
}

/* Mobile-first responsive design */
.element {
  padding: 16px;
}

@media (min-width: 768px) {
  .element {
    padding: 24px;
  }
}
```

---

## Testing Guidelines

### Manual Testing Checklist

Before submitting a PR, test:

**Installation:**
- [ ] Extension loads without errors
- [ ] Default settings applied correctly
- [ ] Icons display properly

**Core Functionality:**
- [ ] Content filtered on Twitter/X
- [ ] Content filtered on Reddit
- [ ] Content filtered on YouTube
- [ ] Content filtered on Facebook
- [ ] Replacement UI displays correctly
- [ ] "Show anyway" button works
- [ ] Filter count increments

**Settings:**
- [ ] Toggles work correctly
- [ ] Settings persist after reload
- [ ] Main toggle disables all filtering
- [ ] Category toggles work independently
- [ ] Display options work correctly
- [ ] Reset button resets count

**Edge Cases:**
- [ ] Works on empty pages
- [ ] Handles rapid scrolling (infinite scroll)
- [ ] No memory leaks on long browsing sessions
- [ ] Works with browser back/forward navigation
- [ ] Handles dynamic content updates

**Performance:**
- [ ] Page load time acceptable (<500ms impact)
- [ ] No visible lag when scrolling
- [ ] Memory usage reasonable (<50MB per tab)

**Cross-Browser:**
- [ ] Chrome: Latest version
- [ ] Firefox: Latest version (if applicable)
- [ ] Edge: Latest version

### Automated Testing (Future)

```javascript
// Example unit test structure
describe('analyzeContent', () => {
  test('detects political keywords', () => {
    expect(analyzeContent('election results today')).toBe('politics');
  });
  
  test('is case-insensitive', () => {
    expect(analyzeContent('ELECTION RESULTS')).toBe('politics');
  });
  
  test('returns null for benign content', () => {
    expect(analyzeContent('cute puppies playing')).toBeNull();
  });
  
  test('handles empty strings', () => {
    expect(analyzeContent('')).toBeNull();
  });
});
```

---

## Submitting Changes

### Pull Request Process

1. **Update Documentation**
   - Update README.md if adding features
   - Update TECHNICAL.md if changing architecture
   - Add JSDoc comments to new functions

2. **Create Pull Request**
   - Use the PR template
   - Write clear title and description
   - Link related issues
   - Add screenshots/videos if UI changes
   - Request review from maintainers

3. **PR Title Format**

```
<type>(<scope>): <short summary>

Examples:
feat(filtering): add schedule-based rules
fix(twitter): prevent duplicate filtering
docs(readme): improve installation instructions
refactor(content): optimize pattern matching
```

4. **PR Description Template**

```markdown
## Description
Brief description of changes

## Motivation
Why is this change needed?

## Changes Made
- Added X functionality
- Modified Y component
- Fixed Z bug

## Testing Done
- [x] Manual testing on Chrome
- [x] Manual testing on Firefox
- [x] Verified no console errors
- [x] Tested on Twitter, Reddit, YouTube

## Screenshots
(if applicable)

## Related Issues
Closes #123
Related to #456

## Checklist
- [x] Code follows style guidelines
- [x] Self-reviewed the code
- [x] Commented complex code
- [x] Updated documentation
- [x] No new warnings generated
- [x] Tested thoroughly
```

### Review Process

**What reviewers look for:**
- Code quality and readability
- Adherence to style guide
- Test coverage
- Performance implications
- Security considerations
- Documentation completeness

**Response time:**
- Initial review: Within 3 days
- Follow-up reviews: Within 2 days

**Making changes:**
```bash
# Make requested changes
git add .
git commit -m "refactor: address review comments"
git push origin feature/your-feature-name

# PR automatically updates
```

---

## Issue Guidelines

### Creating Issues

**Use templates for:**
- 🐛 Bug reports
- 💡 Feature requests
- 📝 Documentation improvements
- ❓ Questions

**Good issue example:**

```markdown
Title: Add whitelist for trusted sources

## Feature Request

**Is your feature request related to a problem?**
Yes, sometimes I want to see political content from specific trusted journalists, 
but the extension filters all political content.

**Describe the solution you'd like**
Add a whitelist system where users can:
- Whitelist specific domains (e.g., nytimes.com)
- Whitelist specific authors (e.g., @journalist)
- Whitelist specific keywords (e.g., "climate policy")

**Describe alternatives you've considered**
- Temporarily disabling the entire extension (too broad)
- Manually clicking "show anyway" every time (too tedious)

**Additional context**
This would help users stay informed about important topics while still 
filtering out low-quality content.

**Implementation ideas**
Could add a new section in popup.html:
- Whitelist tab
- Text input for domains/authors/keywords
- List of whitelisted items
- Storage in settings.whitelist object
```

### Issue Labels

We use labels to organize issues:

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Documentation improvements
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `priority: high` - Critical issue
- `priority: medium` - Should be addressed soon
- `priority: low` - Nice to have
- `status: in progress` - Being worked on
- `status: blocked` - Can't proceed yet

### Claiming Issues

Want to work on an issue?

1. Comment: "I'd like to work on this!"
2. Wait for maintainer approval
3. Get assigned to the issue
4. Create your branch and start coding

**Please:**
- Only claim issues you can complete within 2 weeks
- Update the issue with progress
- Ask questions if stuck

---

## Community

### Communication Channels

- **GitHub Issues**: Bug reports, features
- **GitHub Discussions**: General questions, ideas
- **Pull Requests**: Code review, collaboration
- **(Future) Discord**: Real-time chat

### Recognition

Contributors are recognized in:
- `CONTRIBUTORS.md` file
- Release notes
- Project README
- Special mentions for significant contributions

### Maintainers

Current maintainers:
- @yourusername - Project Lead

Want to become a maintainer? Regular, high-quality contributions may lead to maintainer status!

---

## Development Tips

### Useful Chrome Extensions for Development

- **Extensions Reloader** - Auto-reload on changes
- **React DevTools** - Inspect popup UI (if we add React)
- **JSON Formatter** - View storage prettily

### Debug Console

```javascript
// View extension logs
chrome://extensions/ → Burnout Protector → Errors

// View content script logs
Open page → F12 → Console

// View background worker logs
chrome://extensions/ → Burnout Protector → service worker → inspect
```

### Testing on Real Sites

**Recommended test sites:**
- Twitter/X: https://twitter.com/explore
- Reddit: https://reddit.com/r/politics
- YouTube: https://youtube.com/feed/trending
- HackerNews: https://news.ycombinator.com/

### Quick Reload Workflow

```bash
# Make code changes
# Then:
# 1. Go to chrome://extensions/
# 2. Click refresh icon next to Burnout Protector
# 3. Refresh your test page
# 4. Check console for errors
```

### Performance Profiling

```javascript
// Add to content.js for performance testing
console.time('filterElement');
filterElement(element);
console.timeEnd('filterElement');

// Check memory usage
console.memory.usedJSHeapSize / 1048576 + 'MB'
```

---

## Core Mission

When contributing, keep our core mission in mind:

**Burnout Protector exists to:**
- Protect mental wellbeing online
- Give users control over their content consumption
- Maintain privacy above all else
- Promote intentional browsing over mindless scrolling
- Support mental health without judgment

**We avoid:**
- Creating echo chambers
- Complete censorship
- Surveillance or tracking
- Profiting from user data
- Making users feel guilty

---

## Questions?

- Check existing [documentation](./TECHNICAL.md)
- Search [closed issues](../../issues?q=is%3Aissue+is%3Aclosed)
- Ask in [GitHub Discussions](../../discussions)
- Email: [your-email@example.com]

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for making the internet a healthier place! 🌱**

Your contributions help protect mental wellbeing for users around the world.