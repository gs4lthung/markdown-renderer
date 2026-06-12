/* global chrome */
(function () {
  'use strict';

  // ── Detection ────────────────────────────────────────────────────────────────

  const MD_EXTS = ['.md', '.markdown', '.mdown', '.mkd', '.mkdn', '.mdwn', '.mdtext'];

  function isMarkdownPage() {
    const url = location.href.toLowerCase().split('?')[0].split('#')[0];
    if (!MD_EXTS.some(e => url.endsWith(e))) return false;

    // Browsers display plain-text files as a bare <pre> inside <body>
    const body = document.body;
    if (!body) return false;
    const realChildren = [...body.children].filter(
      el => !['SCRIPT', 'STYLE', 'LINK', 'META'].includes(el.tagName)
    );
    return realChildren.length === 0 ||
      (realChildren.length === 1 && realChildren[0].tagName === 'PRE');
  }

  // ── Utilities ────────────────────────────────────────────────────────────────

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function slugify(s) {
    return s.replace(/<[^>]+>/g, '').toLowerCase()
      .replace(/[^\w\s-]/g, '').trim().replace(/[\s]+/g, '-');
  }

  function getFilename() {
    return decodeURIComponent(location.pathname.split('/').pop() || 'document.md');
  }

  // ── Syntax Highlighting ──────────────────────────────────────────────────────

  const LANG_ALIASES = {
    js: 'javascript', jsx: 'javascript', mjs: 'javascript', cjs: 'javascript',
    ts: 'typescript', tsx: 'typescript',
    py: 'python', py3: 'python',
    sh: 'bash', shell: 'bash', zsh: 'bash',
    rb: 'ruby', yml: 'yaml', md: 'markdown'
  };

  const KEYWORDS = {
    javascript: 'async await break case catch class const continue debugger default delete do else export extends finally for from function if import in instanceof let new null of return static super switch this throw true false try typeof undefined var void while with yield',
    typescript: 'abstract any async await break case catch class const continue declare default delete do else enum export extends finally for from function if implements import in instanceof interface keyof let namespace new null of override package private protected public readonly return static super switch this throw true false try type typeof undefined var void while with yield',
    python: 'and as assert async await break class continue def del elif else except False finally for from global if import in is lambda None nonlocal not or pass raise return True try while with yield',
    java: 'abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for goto if implements import instanceof int interface long native new null package private protected public return short static strictfp super switch synchronized this throw throws transient true false try var void volatile while',
    go: 'break case chan const continue default defer else fallthrough false for func go goto if import interface map nil package range return select struct switch true type var',
    rust: 'as async await break const continue crate dyn else enum extern false fn for if impl in let loop match mod move mut pub ref return self Self static struct super trait true type union unsafe use where while',
    csharp: 'abstract as base bool break byte case catch char checked class const continue decimal default delegate do double else enum event explicit extern false finally fixed float for foreach goto if implicit in int interface internal is lock long namespace new null object operator out override params private protected public readonly ref return sbyte sealed short sizeof stackalloc static string struct switch this throw true try typeof uint ulong unchecked unsafe ushort using virtual void volatile while',
    php: 'abstract and array as break callable case catch class clone const continue declare default do echo else elseif empty enddeclare endfor endforeach endif endswitch endwhile extends false final finally fn for foreach function global goto if implements include include_once instanceof insteadof interface list match namespace new null or print private protected public readonly require require_once return static switch throw trait true try use var while xor yield',
    ruby: 'alias and begin break case class def defined? do else elsif end ensure false for if in module next nil not or redo rescue retry return self super then true undef unless until when while yield',
    swift: 'Any as associatedtype associativity break case catch class continue convenience deinit default defer do dynamic else enum extension false fallthrough fileprivate final for func get guard if import in infix init inout internal is lazy left let mutating nil none nonmutating open operator optional override postfix precedence prefix private protocol public repeat required rethrows return right self Self set static struct subscript super switch throw throws true try type typealias unowned var weak where while',
    kotlin: 'abstract actual as break by catch class companion const constructor continue crossinline data delegate do dynamic else enum expect external false field file finally for fun get if in infix init inline inner interface internal is it lateinit noinline null object open operator out override package param private protected public receiver reified return sealed set setparam super suspend tailrec this throw true try typealias typeof val var vararg when where while',
    sql: 'ADD ALL ALTER AND AS ASC BETWEEN BY CASE COLUMN CONSTRAINT CREATE CROSS DATABASE DEFAULT DELETE DESC DISTINCT DROP ELSE END EXISTS EXPLAIN FALSE FOREIGN FROM FULL GROUP HAVING IF IN INDEX INNER INSERT INTO IS JOIN KEY LEFT LIKE LIMIT NOT NULL ON OR ORDER OUTER PRIMARY RIGHT SELECT SET TABLE THEN TRUE TRUNCATE UNION UNIQUE UPDATE VALUES VIEW WHERE WITH',
    bash: 'case do done elif else esac fi for function if in select then time until while',
    css: '',
    html: '',
    json: '',
    xml: '',
    yaml: '',
    markdown: ''
  };

  function highlight(code, lang) {
    const normalized = LANG_ALIASES[lang] || lang;
    if (!KEYWORDS[normalized] && normalized !== 'html' && normalized !== 'css' && normalized !== 'json' && normalized !== 'xml') {
      return code;
    }

    let result = code;
    const placeholder = [];

    // Protect already-escaped HTML entities
    result = result.replace(/(&(?:[a-z]+|#\d+);)/g, (m) => {
      placeholder.push(m);
      return `\x00P${placeholder.length - 1}\x00`;
    });

    const addSpan = (cls, text) => `<span class="sh-${cls}">${text}</span>`;

    // Strings
    result = result.replace(/(["'`])(?:\\[\s\S]|(?!\1)[^\\])*\1/g, m => addSpan('str', m));

    // Comments
    if (['javascript','typescript','java','go','rust','csharp','swift','kotlin','php','css'].includes(normalized)) {
      result = result.replace(/\/\/[^\n]*/g, m => addSpan('cmt', m));
      result = result.replace(/\/\*[\s\S]*?\*\//g, m => addSpan('cmt', m));
    }
    if (['python','ruby','bash','yaml'].includes(normalized)) {
      result = result.replace(/(^|\n)([ \t]*)#[^\n]*/g, (m, nl, indent, text) =>
        nl + indent + addSpan('cmt', '#' + m.slice(nl.length + indent.length + 1)));
    }
    if (['html','xml'].includes(normalized)) {
      result = result.replace(/&lt;!--[\s\S]*?--&gt;/g, m => addSpan('cmt', m));
    }
    if (normalized === 'sql') {
      result = result.replace(/--[^\n]*/g, m => addSpan('cmt', m));
    }

    // Numbers
    result = result.replace(/\b(0x[\da-fA-F]+|\d+\.?\d*(?:[eE][+-]?\d+)?[fFdDlL]?)\b/g, m => addSpan('num', m));

    // Keywords
    const kws = KEYWORDS[normalized];
    if (kws) {
      const kwRe = new RegExp(`\\b(${kws.trim().split(/\s+/).join('|')})\\b`, 'g');
      result = result.replace(kwRe, m => addSpan('kw', m));
    }

    // HTML/XML tags & attributes
    if (['html','xml'].includes(normalized)) {
      result = result.replace(/(&lt;\/?)([\w.-]+)/g, (_, lt, tag) => lt + addSpan('tag', tag));
      result = result.replace(/\s([\w:-]+)(=)/g, (_, attr, eq) => ' ' + addSpan('attr', attr) + eq);
    }

    // CSS properties
    if (normalized === 'css') {
      result = result.replace(/([\w-]+)(\s*:)/g, (_, prop, colon) => addSpan('prop', prop) + colon);
      result = result.replace(/(#[\da-fA-F]{3,8})\b/g, m => addSpan('num', m));
    }

    // JSON
    if (normalized === 'json') {
      result = result.replace(/("(?:\\.|[^"\\])*")\s*:/g, (m, key) => addSpan('key', key) + ':');
      result = result.replace(/\b(true|false|null)\b/g, m => addSpan('kw', m));
    }

    // YAML keys
    if (normalized === 'yaml') {
      result = result.replace(/^([ \t]*)([\w-]+)(\s*:)/gm, (_, ind, key, col) => ind + addSpan('key', key) + col);
    }

    // Function calls
    result = result.replace(/\b([\w$]+)(\s*\()/g, (_, fn, paren) => addSpan('fn', fn) + paren);

    // Restore placeholders
    result = result.replace(/\x00P(\d+)\x00/g, (_, i) => placeholder[+i]);

    return result;
  }

  // ── Inline Markdown Parser ───────────────────────────────────────────────────

  function parseInline(text) {
    // Images before links
    text = text.replace(/!\[([^\]]*)\]\(([^)\s"]+)(?:\s+"([^"]*)")?\)/g, (_, alt, src, title) =>
      `<img src="${src}" alt="${esc(alt)}"${title ? ` title="${esc(title)}"` : ''} loading="lazy">`
    );

    // Links
    text = text.replace(/\[([^\]]+)\]\(([^)\s"]+)(?:\s+"([^"]*)")?\)/g, (_, label, href, title) => {
      const ext = /^https?:\/\//.test(href);
      return `<a href="${href}"${title ? ` title="${esc(title)}"` : ''}${ext ? ' target="_blank" rel="noopener noreferrer"' : ''}>${label}</a>`;
    });

    // Bold + Italic
    text = text.replace(/(\*\*\*|___)(.+?)\1/g, (_, __, t) => `<strong><em>${t}</em></strong>`);
    text = text.replace(/(\*\*|__)(.+?)\1/g, (_, __, t) => `<strong>${t}</strong>`);
    text = text.replace(/\*([^*\n]+?)\*/g, (_, t) => `<em>${t}</em>`);
    text = text.replace(/_([^_\n]+?)_/g, (_, t) => `<em>${t}</em>`);

    // Strikethrough, mark, sup, sub
    text = text.replace(/~~(.+?)~~/g, '<del>$1</del>');
    text = text.replace(/==(.+?)==/g, '<mark>$1</mark>');
    text = text.replace(/\^(.+?)\^/g, '<sup>$1</sup>');

    // Auto-links (bare URLs not inside href="...")
    text = text.replace(/(?<![="'>])(https?:\/\/[^\s<>")\]]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');

    // Hard line break
    text = text.replace(/  \n|\\n/g, '<br>').replace(/\n/g, ' ');

    return text;
  }

  // ── List Parser ──────────────────────────────────────────────────────────────

  function parseList(lines, start) {
    const baseIndent = lines[start].match(/^(\s*)/)[1].length;
    const isOrdered = /^\s*\d+\./.test(lines[start]);
    const tag = isOrdered ? 'ol' : 'ul';
    const items = [];
    let i = start;

    while (i < lines.length) {
      const line = lines[i];
      if (!line.trim()) { i++; continue; }

      const indent = line.match(/^(\s*)/)[1].length;
      if (indent < baseIndent) break;

      const isUL = /^\s*[-*+]\s/.test(line);
      const isOL = /^\s*\d+\.\s/.test(line);
      if (indent === baseIndent && (isUL || isOL)) {
        let content = line.replace(/^\s*(?:[-*+]|\d+\.)\s+/, '');
        i++;

        // Continuation lines (same indent, not a new item)
        while (i < lines.length && lines[i].trim() &&
          lines[i].match(/^(\s*)/)[1].length > baseIndent &&
          !/^\s*[-*+]\s/.test(lines[i]) && !/^\s*\d+\.\s/.test(lines[i])) {
          content += ' ' + lines[i].trim();
          i++;
        }

        // Nested list
        let nested = '';
        if (i < lines.length && lines[i].trim() &&
          lines[i].match(/^(\s*)/)[1].length > baseIndent) {
          const res = parseList(lines, i);
          nested = res.html;
          i = res.next;
        }

        // Task list checkbox
        const cbMatch = content.match(/^\[([ xX])\]\s+([\s\S]+)/);
        if (cbMatch) {
          const checked = cbMatch[1].toLowerCase() === 'x' ? ' checked' : '';
          items.push(`<li class="task-item"><label><input type="checkbox" disabled${checked}> ${parseInline(cbMatch[2])}</label>${nested}</li>`);
        } else {
          items.push(`<li>${parseInline(content)}${nested}</li>`);
        }
      } else {
        break;
      }
    }

    return { html: `<${tag}>${items.join('')}</${tag}>`, next: i };
  }

  // ── Table Parser ─────────────────────────────────────────────────────────────

  function parseTable(lines) {
    if (lines.length < 2) return `<p>${parseInline(lines.join(' '))}</p>`;

    const splitRow = l => l.split('|').slice(1, -1).map(c => c.trim());
    const headers = splitRow(lines[0]);
    const aligns = splitRow(lines[1]).map(c =>
      c.startsWith(':') && c.endsWith(':') ? 'center' : c.endsWith(':') ? 'right' : 'left'
    );

    const th = headers.map((h, i) =>
      `<th style="text-align:${aligns[i] || 'left'}">${parseInline(h)}</th>`
    ).join('');

    const tbody = lines.slice(2).map(line => {
      const cells = splitRow(line);
      return '<tr>' + cells.map((c, i) =>
        `<td style="text-align:${aligns[i] || 'left'}">${parseInline(c)}</td>`
      ).join('') + '</tr>';
    }).join('');

    return `<div class="tbl-wrap"><table><thead><tr>${th}</tr></thead><tbody>${tbody}</tbody></table></div>`;
  }

  // ── Block Parser ─────────────────────────────────────────────────────────────

  function parseBlocks(src) {
    src = src.replace(/\r\n|\r/g, '\n');
    const lines = src.split('\n');
    const out = [];
    let i = 0;

    while (i < lines.length) {
      const raw = lines[i];
      const line = raw.trimEnd();
      const trimmed = line.trim();

      // Empty line
      if (!trimmed) { i++; continue; }

      // Code block placeholder (injected by parseMarkdown)
      if (/^\x00CB\d+\x00$/.test(trimmed)) {
        out.push(trimmed);
        i++;
        continue;
      }

      // Fenced code block (shouldn't appear here, but safe guard)
      if (/^`{3,}/.test(trimmed)) { i++; continue; }

      // ATX heading
      const hm = line.match(/^(#{1,6})\s+(.*?)\s*(?:\s+#+)?\s*$/);
      if (hm) {
        const lvl = hm[1].length;
        const content = parseInline(hm[2]);
        const id = slugify(hm[2]);
        out.push(`<h${lvl} id="${id}">${content}</h${lvl}>`);
        i++;
        continue;
      }

      // Setext headings (=== or --- on next line)
      if (i + 1 < lines.length && trimmed) {
        const nxt = lines[i + 1].trim();
        if (/^=+$/.test(nxt)) {
          out.push(`<h1 id="${slugify(trimmed)}">${parseInline(trimmed)}</h1>`);
          i += 2; continue;
        }
        if (/^-+$/.test(nxt) && !/^[-*+]\s/.test(trimmed)) {
          out.push(`<h2 id="${slugify(trimmed)}">${parseInline(trimmed)}</h2>`);
          i += 2; continue;
        }
      }

      // Horizontal rule
      if (/^([-*_])\1{2,}\s*$/.test(trimmed)) {
        out.push('<hr>');
        i++;
        continue;
      }

      // Blockquote
      if (trimmed.startsWith('>')) {
        const bqLines = [];
        while (i < lines.length && /^\s*>/.test(lines[i])) {
          bqLines.push(lines[i].replace(/^\s*>[ \t]?/, ''));
          i++;
        }
        out.push(`<blockquote>${parseBlocks(bqLines.join('\n'))}</blockquote>`);
        continue;
      }

      // Unordered list
      if (/^\s*[-*+]\s/.test(line)) {
        const res = parseList(lines, i);
        out.push(res.html);
        i = res.next;
        continue;
      }

      // Ordered list
      if (/^\s*\d+\.\s/.test(line)) {
        const res = parseList(lines, i);
        out.push(res.html);
        i = res.next;
        continue;
      }

      // Table (current line has | and next line is a separator row)
      if (trimmed.includes('|') && i + 1 < lines.length && /^[\s|:+-]+$/.test(lines[i + 1])) {
        const tblLines = [];
        while (i < lines.length && lines[i].trim().includes('|')) {
          tblLines.push(lines[i]);
          i++;
        }
        out.push(parseTable(tblLines));
        continue;
      }

      // Paragraph — gather until blank line or block-level element
      const paraLines = [];
      while (i < lines.length) {
        const l = lines[i];
        const t = l.trim();
        if (!t) break;
        if (/^\x00CB\d+\x00$/.test(t)) break;
        if (/^#{1,6}\s/.test(l)) break;
        if (/^\s*[-*+]\s/.test(l)) break;
        if (/^\s*\d+\.\s/.test(l)) break;
        if (/^\s*>/.test(l)) break;
        if (/^([-*_])\1{2,}\s*$/.test(t)) break;
        paraLines.push(l);
        i++;
      }
      if (paraLines.length) {
        out.push(`<p>${parseInline(paraLines.join('\n'))}</p>`);
      }
    }

    return out.join('\n');
  }

  // ── Markdown Entry Point ─────────────────────────────────────────────────────

  function parseMarkdown(src) {
    src = src.replace(/\r\n|\r/g, '\n');

    // Store for restoring later
    const inlineCodes = [];
    const codeBlocks = [];

    // 1. Extract fenced code blocks
    src = src.replace(/^(`{3,}|~{3,})([\w+#.-]*)[^\n]*\n([\s\S]*?)\n\1\s*$/gm,
      (_, fence, lang, code) => {
        const id = codeBlocks.length;
        codeBlocks.push({ lang: lang.trim().toLowerCase(), code });
        return `\x00CB${id}\x00`;
      }
    );

    // 2. Extract inline code
    src = src.replace(/`([^`\n]+?)`/g, (_, code) => {
      const id = inlineCodes.length;
      inlineCodes.push(esc(code));
      return `\x00IC${id}\x00`;
    });

    // 3. Process blocks
    src = parseBlocks(src);

    // 4. Restore inline code
    src = src.replace(/\x00IC(\d+)\x00/g, (_, i) =>
      `<code class="ic">${inlineCodes[+i]}</code>`
    );

    // 5. Restore code blocks with highlighting
    src = src.replace(/\x00CB(\d+)\x00/g, (_, i) => {
      const { lang, code } = codeBlocks[+i];
      const escaped = esc(code);
      const hlit = highlight(escaped, lang);
      const badge = lang ? `<span class="cb-lang">${esc(lang)}</span>` : '';
      return `<div class="cb-wrap">
  <div class="cb-bar">${badge}<button class="cb-copy">Copy</button></div>
  <pre><code class="language-${esc(lang)}">${hlit}</code></pre>
</div>`;
    });

    return src;
  }

  // ── TOC ──────────────────────────────────────────────────────────────────────

  function buildTOC(container) {
    const hs = [...container.querySelectorAll('h1,h2,h3,h4,h5,h6')];
    if (hs.length < 3) return null;

    const nav = document.createElement('nav');
    nav.id = 'md-toc';
    nav.innerHTML = '<div class="toc-title">Contents</div>';
    const ul = document.createElement('ul');

    const minLevel = Math.min(...hs.map(h => +h.tagName[1]));
    hs.forEach(h => {
      const lvl = +h.tagName[1] - minLevel;
      const li = document.createElement('li');
      li.style.paddingLeft = `${lvl * 14}px`;
      const a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent;
      li.appendChild(a);
      ul.appendChild(li);
    });

    nav.appendChild(ul);
    return nav;
  }

  // ── Page Renderer ────────────────────────────────────────────────────────────

  let rawContent = '';
  let isRawMode = false;

  function getDocTitle(src) {
    const m = src.match(/^#\s+(.+)/m);
    return m ? m[1].replace(/[*_`]/g, '') : getFilename();
  }

  function render(src) {
    rawContent = src;
    const title = getDocTitle(src);
    const html = parseMarkdown(src);

    document.title = title;
    document.head.innerHTML = `
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${esc(title)}</title>`;

    document.body.innerHTML = `
      <div id="md-root">
        <header id="md-bar">
          <div class="bar-left">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            <span id="md-fname">${esc(getFilename())}</span>
          </div>
          <div class="bar-right">
            <button id="btn-toc"   title="Toggle Table of Contents">TOC</button>
            <button id="btn-raw"   title="Toggle raw source view">Raw</button>
            <button id="btn-theme" title="Toggle dark / light mode" aria-label="Toggle theme">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            </button>
            <button id="btn-print" title="Print" aria-label="Print">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            </button>
          </div>
        </header>
        <div id="md-layout">
          <aside id="md-toc-wrap" hidden></aside>
          <main id="md-content" class="md-body">${html}</main>
          <div id="md-raw-wrap" hidden><pre id="md-raw-pre">${esc(src)}</pre></div>
        </div>
      </div>`;

    // TOC
    const tocWrap = document.getElementById('md-toc-wrap');
    const toc = buildTOC(document.getElementById('md-content'));
    if (toc) {
      tocWrap.appendChild(toc);
      tocWrap.hidden = false;
    }

    // Scrollspy
    setupScrollSpy();

    // Copy buttons
    document.querySelectorAll('.cb-copy').forEach(btn => {
      btn.addEventListener('click', () => {
        const code = btn.closest('.cb-wrap').querySelector('code').textContent;
        navigator.clipboard.writeText(code).then(() => {
          btn.textContent = 'Copied!';
          btn.classList.add('copied');
          setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
        }).catch(() => {});
      });
    });

    // Toolbar buttons
    document.getElementById('btn-toc').addEventListener('click', () => {
      if (!toc) return;
      tocWrap.hidden = !tocWrap.hidden;
    });

    document.getElementById('btn-raw').addEventListener('click', () => {
      isRawMode = !isRawMode;
      document.getElementById('md-content').hidden = isRawMode;
      document.getElementById('md-raw-wrap').hidden = !isRawMode;
      document.getElementById('btn-raw').textContent = isRawMode ? 'Rendered' : 'Raw';
    });

    document.getElementById('btn-theme').addEventListener('click', () => {
      const isDark = document.documentElement.dataset.theme === 'dark';
      applyTheme(isDark ? 'light' : 'dark');
      try { chrome.storage.local.set({ theme: isDark ? 'light' : 'dark' }); } catch {}
    });

    document.getElementById('btn-print').addEventListener('click', () => window.print());

    // Load saved theme
    try {
      chrome.storage.local.get('theme', data => {
        applyTheme(data.theme || 'auto');
      });
    } catch {
      applyTheme('auto');
    }
  }

  function applyTheme(theme) {
    const root = document.documentElement;
    if (theme === 'auto') {
      root.removeAttribute('data-theme');
    } else {
      root.dataset.theme = theme;
    }
  }

  // ── Scroll Spy ───────────────────────────────────────────────────────────────

  function setupScrollSpy() {
    const toc = document.getElementById('md-toc');
    if (!toc) return;

    const headings = [...document.querySelectorAll('#md-content h1,#md-content h2,#md-content h3,#md-content h4')];
    if (!headings.length) return;

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        const id = e.target.id;
        const link = toc.querySelector(`a[href="#${id}"]`);
        if (!link) return;
        if (e.isIntersecting) {
          toc.querySelectorAll('a.active').forEach(a => a.classList.remove('active'));
          link.classList.add('active');
        }
      });
    }, { rootMargin: '-10% 0px -80% 0px' });

    headings.forEach(h => obs.observe(h));
  }

  // ── Init ─────────────────────────────────────────────────────────────────────

  function init() {
    if (!isMarkdownPage()) return;

    const pre = document.querySelector('pre');
    const src = pre ? pre.textContent : document.body.innerText;
    if (!src.trim()) return;

    render(src);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for popup to call toggle
  window.__mdViewer = { toggleRaw: () => document.getElementById('btn-raw')?.click() };

})();
