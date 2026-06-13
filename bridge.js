// Runs in the page's main world. Receives render requests from the isolated-world
// content script via CustomEvents on the shared document, calls mermaid.render(),
// and dispatches the resulting SVG back.
document.addEventListener('_mv_req', async function (e) {
  const { id, code, theme } = e.detail;
  try {
    if (window._mvTheme !== theme) {
      window.mermaid.initialize({
        startOnLoad: false,
        theme: theme,
        securityLevel: 'loose',
        fontFamily: 'inherit',
        suppressErrorRendering: false,
      });
      window._mvTheme = theme;
    }
    const { svg } = await window.mermaid.render(id, code);
    document.dispatchEvent(new CustomEvent('_mv_res', { detail: { id, svg } }));
  } catch (err) {
    document.dispatchEvent(new CustomEvent('_mv_res', { detail: { id, error: err.message } }));
  }
});
