# Flowless

**Block and hide social media feeds** - Replace distractions with motivational quotes and customize your browsing experience.

## Features

- 🚫 **Block Feeds**: Hide news feeds on Twitter/X, Instagram, YouTube, LinkedIn, Reddit, Facebook, GitHub, and Hacker News
- 💬 **Motivational Quotes**: Replace feeds with inspiring quotes
- 🔤 **Word Replacement**: Replace specific words across web pages (e.g., "AI" → "cocaine")
- 🎨 **Display Modes**: Choose between quotes, blank screen, or cat pictures
- ⏰ **Timed Blocking**: Temporarily disable for specific durations (5 min, 1 hr, 1 day, etc.)
- 🌙 **Dark Mode**: Beautiful dark-themed interface
- ⚙️ **Custom Quotes**: Add your own motivational quotes
- 🔧 **Per-Site Control**: Enable/disable for each social media site individually

## Installation

### Chrome/Edge/Brave

1. Download or clone this repository
2. Run `cd news-feed-eradicator-master && npm install`
3. Run `npm run build` (or `make build`)
4. Open Chrome and go to `chrome://extensions/`
5. Enable "Developer mode" (top right)
6. Click "Load unpacked"
7. Select the `news-feed-eradicator-master/build/` folder

### Firefox

1. Follow steps 1-3 above
2. Open Firefox and go to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Navigate to `news-feed-eradicator-master/build/` and select `manifest.json`

## Usage

### Quick Access (Popup)
- Click the extension icon in your toolbar
- Toggle individual sites on/off
- Enable/disable word replacement with the **Aa** button
- Access full settings with the ⚙️ button

### Full Settings
- Right-click extension icon → Options
- **Sites Tab**: Enable/disable per site, set timed blocks
- **Quotes Tab**: Manage custom quotes, choose display mode
- **Replace Tab**: Configure word replacements
- **About Tab**: Information and support

## Word Replacement

The word replacement feature uses:
- **TreeWalker** for efficient DOM traversal
- **MutationObserver** for dynamic content (infinite scroll)
- **Regex with word boundaries** to avoid breaking words
- **Built-in rules**: AI → cocaine, machine learning → cocaine, etc.
- **Custom rules**: Add your own word pairs

## Development

### Build from source

```bash
cd news-feed-eradicator-master
npm install
npm run build
```

### Watch mode for development

```bash
npm run dev
```

### Project Structure

```
news-feed-eradicator-master/
├── src/
│   ├── components/       # UI components (Snabbdom)
│   ├── lib/             # Core utilities
│   │   ├── word-replacement.ts      # Regex rules
│   │   └── dom-text-replacement.ts  # TreeWalker + Observer
│   ├── sites/           # Site-specific logic
│   ├── store/           # Redux state management
│   ├── popup/           # Popup UI
│   └── options/         # Settings page
└── assets/              # Icons and images
```

## Technologies

- **TypeScript** - Type safety
- **Snabbdom** - Virtual DOM
- **Redux** - State management
- **Rollup** - Build tool
- **Chrome Extension Manifest V3**

## License

Original project by Jordan West. Modified and enhanced as "Flowless".

## Credits

Based on [News Feed Eradicator](https://github.com/jordwest/news-feed-eradicator) by Jordan West.

---

Made with ❤️ to help you stay focused and productive.

