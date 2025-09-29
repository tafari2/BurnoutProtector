# 🛡️ Burnout Protector Browser Extension

**Protect your mental wellbeing by filtering negative, political, and anxiety-inducing content across the web.**

## 🌟 Features

- **Local Processing**: All filtering happens in your browser - zero data sent to servers
- **Smart Content Detection**: Filters politics, AI hype, gambling, negative news, disasters, celebrity drama, and financial panic
- **Beautiful Replacements**: Shows calming nature images and encouraging quotes instead of filtered content
- **Peek Option**: Choose to view filtered content if you really want to
- **Cross-Platform**: Works on Twitter/X, Reddit, YouTube, Facebook, and news sites
- **Privacy First**: Transparent about what's filtered, no tracking, no data collection

## 📦 Installation

### Chrome / Edge / Brave

1. Download all the extension files to a folder
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right)
4. Click "Load unpacked"
5. Select the folder containing the extension files
6. Done! The shield icon should appear in your toolbar

### Firefox

1. Download all the extension files to a folder
2. Navigate to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Select the `manifest.json` file
5. Done! (Note: Firefox temporary add-ons clear on restart)

### Safari (requires Xcode)

Safari extensions require conversion using Xcode's converter tool. This is more advanced and requires macOS.

## 📁 Required Files

Your extension folder should contain:

```
burnout-protector/
├── manifest.json          # Extension configuration
├── content.js            # Content filtering logic
├── content.css           # Styling for filtered content
├── popup.html            # Settings panel UI
├── popup.js              # Settings panel logic
├── background.js         # Service worker
└── icons/
    ├── icon16.png        # 16x16 icon
    ├── icon48.png        # 48x48 icon
    └── icon128.png       # 128x128 icon
```

## 🎨 Creating Icons

You'll need to create three icon sizes. Here's a simple shield design you can use:

**Quick Option**: Use any image editor or online tool like:
- Canva (search "shield icon")
- Figma (create 128x128 artboard with shield)
- Or download free shield icons from [Heroicons](https://heroicons.com/) or [Feather Icons](https://feathericons.com/)

**Colors**: Use the extension theme colors:
- Primary: #667eea (purple-blue)
- Secondary: #764ba2 (purple)
- Accent: #66bb6a (green for protection)

## ⚙️ Configuration

Click the shield icon in your toolbar to access settings:

### Filter Categories
Toggle individual categories:
- 🏛️ **Politics & Elections** - partisan content, campaigns
- 🤖 **AI & Tech Hype** - breathless AI announcements, crypto hype
- 🎰 **Gambling & Betting** - sportsbooks, casinos, betting ads
- ⚠️ **Negative News** - doom-scrolling triggers, outrage bait
- 🌪️ **Disaster Coverage** - natural disasters, tragedies
- ⭐ **Celebrity Drama** - feuds, breakups, gossip
- 📉 **Financial Panic** - market crashes, economic fear

### Display Options
- **Calming Images**: Show peaceful nature scenes
- **Encouraging Quotes**: Display supportive messages
- **"Show Anyway" Button**: Allow peeking at filtered content

## 🔧 Customization

### Add Your Own Keywords

Edit `content.js` and modify the `FILTER_PATTERNS` object:

```javascript
const FILTER_PATTERNS = {
  myCustomCategory: [
    /\b(keyword1|keyword2|keyword3)\b/i,
    /\b(another pattern)\b/i
  ]
};
```

### Add Your Own Quotes

Edit the `ENCOURAGING_QUOTES` array in `content.js`:

```javascript
const ENCOURAGING_QUOTES = [
  "Your custom quote here",
  "Another encouraging message",
  // ... more quotes
];
```

### Customize Colors

Edit `content.css` to change the calming gradient backgrounds:

```css
.burnout-protector-shield {
  background: linear-gradient(135deg, #yourcolor1 0%, #yourcolor2 100%);
  border-color: #yourbordercolor;
}
```

## 🌐 Supported Websites

Currently optimized for:
- Twitter / X
- Reddit
- YouTube
- Facebook
- Most news sites (CNN, BBC, NYTimes, etc.)

The extension works on most websites, but filtering accuracy is best on the platforms listed above.

## 🐛 Troubleshooting

**Extension not filtering:**
- Refresh the page after installation
- Check that "Protection Enabled" toggle is ON
- Make sure at least one category is enabled

**Too much/little filtering:**
- Adjust category toggles in settings
- Keywords are case-insensitive and match partial words
- Edit `FILTER_PATTERNS` in `content.js` for fine-tuning

**Can't see filtered content:**
- Enable "Show Anyway" button in settings
- Disable individual categories temporarily
- Turn off protection entirely with main toggle

## 📊 Privacy & Data

**What we collect:** Nothing. Zero. Nada.

**Where data is stored:** Only in your browser's local storage (Chrome sync if enabled)

**What's sent to servers:** Nothing. All processing happens locally in your browser.

**Can others see what you've filtered:** No. Your filter count and settings are private.

## 🚀 Future Enhancements

Potential features for future versions:
- ⏰ Scheduled filtering (e.g., "no politics after 8pm")
- 📍 Location-based filtering
- 🧠 ML-based sentiment analysis (still local)
- 📊 Wellbeing dashboard & trends
- 🤝 Whitelist trusted sources
- 📱 Mobile app version
- 🌍 Multi-language support

## 💝 Philosophy

Burnout Protector isn't about censorship or creating echo chambers. It's about:
- **Intentional consumption** over mindless scrolling
- **Mental health** over FOMO
- **Peace of mind** over staying "informed" about every controversy
- **Your wellbeing** over engagement metrics

You can always peek at filtered content. You're in control.

## 🔧 Development Notes

### Recent Improvements (v1.0.1)

**✅ Extension Functionality**
- **Icon files**: Created required PNG icons (16x16, 48x48, 128x128)
- **Website coverage**: Expanded from 7 to 30+ supported websites including major social platforms and news sites
- **Error handling**: Added comprehensive error handling for all Chrome API calls
- **Reliability**: Improved extension stability and graceful degradation

**🌐 Supported Platforms**
- Social Media: Twitter/X, Reddit, YouTube, Facebook, Instagram, TikTok, LinkedIn
- News Sites: CNN, BBC, NYTimes, Reuters, Guardian, AP, NPR, Fox News, MSNBC, etc.
- Tech Sites: TechCrunch, Wired, Ars Technica, The Verge, Engadget, Gizmodo
- Discussion: Hacker News, Reddit variants

**📋 For Developers**
- All Chrome API calls now include proper error handling
- Extension gracefully handles missing permissions or API failures
- Console warnings instead of silent failures for better debugging
- Settings validation and corruption recovery

### Testing the Extension

1. **Load in Chrome**: Navigate to `chrome://extensions/`, enable Developer Mode, click "Load unpacked"
2. **Test filtering**: Visit supported sites and verify content filtering works
3. **Check settings**: Click extension icon to verify settings panel opens and saves
4. **Monitor console**: Check for any error messages in browser console

### Known Limitations

- Icon files are simple colored squares (functional but not polished)
- No content scripts for non-HTTPS sites
- Filtering patterns are English-only
- No user-defined custom patterns yet

## 📄 License

MIT License - Feel free to modify and distribute!

## 🤝 Contributing

This is an open-source mental health tool. Contributions welcome:
- Improve keyword detection
- Add new calming images
- Translate to other languages
- Optimize performance
- Add new filter categories

## ⚠️ Disclaimer

This extension is not a substitute for professional mental health care. If you're experiencing burnout, anxiety, or depression, please reach out to a mental health professional.

---

**Built with ❤️ for your wellbeing**

*Because your mental health matters more than the outrage of the day.*