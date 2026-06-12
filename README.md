# Markdown Viewer & Editor

A cross-browser extension that renders **and edits** Markdown files beautifully — directly in Chrome, Edge, and Firefox. No external dependencies, no build step.

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-green.svg)

---

## Features

### Viewer

- **Automatic rendering** — detects `.md`, `.markdown`, `.mdown`, `.mkd`, `.mkdn`, `.mdwn`, `.mdtext` files and renders them instantly
- **GitHub Flavored Markdown** — tables, task lists, fenced code blocks, setext headers, nested blockquotes, strikethrough, highlights, superscript
- **Syntax highlighting** — 15+ languages: JavaScript, TypeScript, Python, Java, Go, Rust, C#, PHP, Ruby, Swift, Kotlin, SQL, Bash, CSS, HTML, JSON, YAML
- **Table of Contents** sidebar with scroll-spy
- **Dark / Light / Auto** theme — follows OS preference, persists across sessions
- **Raw ↔ Rendered** toggle to inspect the original source
- **Copy** button on every code block
- **Print-friendly** layout

### Editor

- **Three modes** — View, Edit, and Side-by-side Split (live preview as you type)
- **Formatting toolbar** — H1–H3, Bold, Italic, Strikethrough, Link, Image, Inline Code, Code Block, Bullet List, Numbered List, Task List, Blockquote, Horizontal Rule, Table
- **Keyboard shortcuts** — `Ctrl+B` Bold, `Ctrl+I` Italic, `Ctrl+K` Link, `Ctrl+E` Inline Code, `Ctrl+S` Save
- **Smart editing** — Tab/Shift+Tab indent, auto-continue list items on Enter
- **Save** — uses the File System Access API when available; falls back to download
- **Word count** and character count in the toolbar
- **Scroll sync** — editor and preview scroll together in Split mode

---

## Installation

### 1. Load the extension

**Chrome / Edge**
1. Go to `chrome://extensions`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked**
4. Select the `markdown-viewer` folder

**Firefox**
1. Go to `about:debugging`
2. Click **This Firefox**
3. Click **Load Temporary Add-on**
4. Select `manifest.json` inside the folder

### 2. Allow local file access (optional)

To render `.md` files opened from your disk (`file:///...`):

- **Chrome/Edge:** `chrome://extensions` → find *Markdown Viewer* → enable **Allow access to file URLs**
- **Firefox:** this is allowed automatically for temporary add-ons

---

## Usage

Navigate to any `.md` file — on the web or locally — and the extension renders it automatically.

| Toolbar button | Action |
|:--- |:--- |
| **TOC** | Toggle the Table of Contents sidebar |
| **Raw** | Switch between rendered and raw source view |
| ☀ / 🌙 | Toggle light / dark theme |
| 🖨 | Print the rendered document |

The **popup** (click the extension icon) lets you pick a theme and adjust the base font size.

---

## File Structure

```
markdown-viewer/
├── manifest.json       # Extension manifest (Manifest V3)
├── content.js          # Content script — parser, renderer, highlighter
├── content.css         # Styles — light/dark themes, responsive layout
├── background.js       # Service worker — storage init, badge updates
├── popup.html          # Extension popup
├── popup.js            # Popup logic
├── popup.css           # Popup styles
├── test.md             # Feature test file
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

---

## Browser Compatibility

| Browser | Version | Notes |
|:--- |:--- |:--- |
| Chrome | 88+ | Full support |
| Edge | 88+ | Full support |
| Firefox | 109+ | Full support (MV3) |
| Safari | — | Not supported (no MV3 WebExtensions) |

---

## Development

No build toolchain required. Edit the source files directly and reload the extension.

**Reload after changes:**
- Chrome/Edge: `chrome://extensions` → click the refresh icon on the extension card
- Firefox: `about:debugging` → click **Reload**

**Test file:** Open `test.md` in the browser after loading the extension to verify all features are working.

---

## License

MIT
