/* global chrome */
(function () {
  'use strict';

  const MD_EXTS = ['.md', '.markdown', '.mdown', '.mkd', '.mkdn', '.mdwn', '.mdtext'];

  function isMarkdownUrl(url) {
    if (!url) return false;
    const clean = url.toLowerCase().split('?')[0].split('#')[0];
    return MD_EXTS.some(e => clean.endsWith(e));
  }

  // ── Status indicator ────────────────────────────────────────────────────────
  function updateStatus(tab) {
    const dot  = document.getElementById('status-dot');
    const text = document.getElementById('status-text');
    if (isMarkdownUrl(tab?.url)) {
      dot.classList.add('active');
      text.textContent = 'Rendering markdown on this page';
    } else {
      dot.classList.remove('active');
      text.textContent = 'Not a markdown file';
    }
  }

  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    updateStatus(tab);
  });

  // ── Theme pills ─────────────────────────────────────────────────────────────
  function applyThemeSelection(theme) {
    document.querySelectorAll('.pill').forEach(p => {
      p.classList.toggle('selected', p.dataset.theme === theme);
    });
  }

  chrome.storage.local.get('theme', data => {
    applyThemeSelection(data.theme || 'auto');
  });

  document.getElementById('theme-btns').addEventListener('click', e => {
    const pill = e.target.closest('.pill');
    if (!pill) return;
    const theme = pill.dataset.theme;
    chrome.storage.local.set({ theme });
    applyThemeSelection(theme);

    // Apply to active tab immediately
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (!tab?.id || !isMarkdownUrl(tab.url)) return;
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (t) => {
          const root = document.documentElement;
          if (t === 'auto') root.removeAttribute('data-theme');
          else root.dataset.theme = t;
        },
        args: [theme]
      }).catch(() => {});
    });
  });

  // ── Font size slider ────────────────────────────────────────────────────────
  const slider  = document.getElementById('font-size');
  const sizeVal = document.getElementById('font-size-val');

  chrome.storage.local.get('fontSize', data => {
    const size = data.fontSize || 16;
    slider.value = size;
    sizeVal.textContent = `${size}px`;
  });

  slider.addEventListener('input', () => {
    const size = Number(slider.value);
    sizeVal.textContent = `${size}px`;
    chrome.storage.local.set({ fontSize: size });

    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (!tab?.id || !isMarkdownUrl(tab.url)) return;
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (s) => {
          const content = document.getElementById('md-content');
          if (content) content.style.fontSize = `${s}px`;
        },
        args: [size]
      }).catch(() => {});
    });
  });

  // ── Extension settings link ──────────────────────────────────────────────────
  document.getElementById('ext-settings').addEventListener('click', e => {
    e.preventDefault();
    chrome.tabs.create({ url: 'chrome://extensions/?id=' + chrome.runtime.id });
  });

})();
