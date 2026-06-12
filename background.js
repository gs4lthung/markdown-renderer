// Minimal service worker — keeps the extension alive and handles icon badge.

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get('theme', data => {
    if (!data.theme) chrome.storage.local.set({ theme: 'auto' });
  });
});

// Update the toolbar icon badge when a tab is a markdown file
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete') return;
  const url = (tab.url || '').toLowerCase();
  const MD_EXTS = ['.md', '.markdown', '.mdown', '.mkd', '.mkdn', '.mdwn', '.mdtext'];
  const isMarkdown = MD_EXTS.some(e => url.split('?')[0].endsWith(e));
  chrome.action.setBadgeText({ tabId, text: isMarkdown ? 'MD' : '' });
  chrome.action.setBadgeBackgroundColor({ tabId, color: isMarkdown ? '#0969da' : '#888' });
});
