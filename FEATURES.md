# Markdown Viewer - Feature Enhancement Roadmap

This document outlines potential enhancements and new features for the Markdown Viewer Chrome extension.

## 🔒 Security & Accessibility

### High Priority

- [ ] **CSP for external images** - Add Content Security Policy to restrict image sources
- [ ] **ARIA improvements** - Add live regions for dynamic content (toast notifications, TOC updates)
- [ ] **Keyboard navigation** - Full keyboard shortcuts for all interactive elements
- [ ] **Focus management** - Improve focus trapping in modals/lightboxes

## ✨ Features

### High Impact

- [x] **Search functionality** - Full-text search with highlighting ✅
- [ ] **Export options** - Export to PDF, HTML, or copy formatted content
- [ ] **Footnotes support** - Add markdown footnote parsing and rendering
- [ ] **Definition lists** - Support for `term : definition` syntax
- [x] **Math support** - KaTeX integration for LaTeX math (using local files) ✅
- [x] **Emoji support** - GitHub-flavored emoji shortcodes ✅

### Medium Priority

- [ ] **Task checkboxes** - Make them interactive (toggleable state)
- [ ] **Code block line numbers** - Optional line numbering
- [ ] **File tree navigation** - For multi-file projects in a directory
- [ ] **Reading time** - Estimated reading time display
- [ ] **Print styles** - Optimized print CSS

## ⚡ Performance

- [ ] **Virtual scrolling** - For very large markdown files (>10k lines)
- [ ] **Incremental rendering** - Render visible sections first
- [ ] **Debounced resize handlers** - Optimize resize performance
- [ ] **Code splitting** - Lazy load syntax highlighting rules

## 📝 Editor Enhancements

### High Value

- [ ] **Find/replace** - In-editor find and replace functionality
- [ ] **Auto-save** - Periodic auto-save with crash recovery
- [ ] **Spell checking** - Enhanced browser spellcheck integration

### Advanced

- [ ] **Markdown linting** - Optional markdown style warnings
- [ ] **Vim/Emacs key bindings** - Optional modal editing modes
- [ ] **Multiple cursors** - Multi-cursor editing support
- [ ] **Bracket matching** - Highlight matching brackets

## 🚀 Advanced Features

- [ ] **Git integration** - Show git diff for changed files
- [ ] **Frontmatter parsing** - YAML/TOML frontmatter support with metadata display
- [ ] **Anchor links** - Copy anchor link on heading hover
- [ ] **Sidebar file browser** - Navigate related files in current directory
- [ ] **Custom themes** - User-defined theme editor
- [ ] **Sync scrolling** - Bi-directional scroll sync in split mode
- [ ] **Presentation mode** - Slideshow-like presentation view
- [ ] **Collapsible sections** - Fold long sections of content

## 🛠️ Developer Features

- [ ] **Debug mode** - Show rendering timing and performance metrics
- [ ] **Markdown source export** - Copy raw markdown easily
- [ ] **API hooks** - Allow other extensions to hook into rendering
- [ ] **Custom CSS injection** - User-provided CSS files

## 📱 Mobile & Responsive

- [ ] **Touch gestures** - Swipe between images, pinch to zoom
- [ ] **Mobile toolbar** - Bottom toolbar for mobile devices
- [ ] **Responsive tables** - Better table rendering on small screens
- [ ] **Offline mode** - Service worker for caching

## 🎨 UI/UX Improvements

- [ ] **Loading skeleton** - Better loading states
- [ ] **Error boundaries** - Graceful error handling
- [ ] **Undo/redo** - Undo stack for editor changes
- [ ] **Tooltip improvements** - Better keyboard shortcut hints
- [ ] **Animation settings** - Option to disable animations

## 📊 Metrics & Analytics

- [ ] **Usage stats** - Anonymous feature usage tracking
- [ ] **Performance monitoring** - Render time metrics
- [ ] **Error tracking** - Automatic error reporting

## 🔧 Configuration

- [ ] **Settings sync** - Sync settings across devices
- [ ] **Import/Export settings** - Backup and restore configuration
- [ ] **Per-file settings** - Remember settings per file
- [ ] **Keyboard shortcut customization** - Remap all shortcuts

---

## Priority Matrix

### Quick Wins (1-2 hours each)

- Print styles
- Reading time display
- Emoji support
- ARIA improvements

### Medium Projects (4-8 hours each)

- Search functionality
- Export options
- Footnotes support
- Find/replace in editor
- Auto-save

### Large Projects (16+ hours each)

- Math support (KaTeX/MathJax)
- Virtual scrolling
- Git integration
- File tree navigation
- Custom themes

---

## Implementation Notes

### Adding New Features

When implementing new features, follow the existing patterns:

1. **Content scripts** (`content.js`) - Main rendering logic
2. **CSS** (`content.css`) - All styling with CSS variables
3. **Background** (`background.js`) - Service worker for persistence
4. **Popup** (`popup.html/js/css`) - Extension settings UI

### Code Style

- Keep functions small and focused
- Use descriptive variable names
- Add comments for complex logic
- Follow the existing section structure with `// ── Section ──` comments

### Performance Considerations

- Use `IntersectionObserver` for lazy loading
- Debounce expensive operations
- Cache rendered results when possible
- Test with large files (>1000 lines)

---

## Future Considerations

### Browser Compatibility

- Currently optimized for Chromium-based browsers
- Firefox support via `browser_specific_settings`
- Consider Safari Web Extension support

### Manifest V3 Compliance

- Ensure all features work with MV3 restrictions
- No inline scripts or eval usage
- Proper CSP headers

### Accessibility Targets

- WCAG 2.1 AA compliance
- Full keyboard navigation
- Screen reader optimization
- High contrast mode support

---

*Last updated: 2025-06-15*
