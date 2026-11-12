# 06 — Accessibility Deep Dive

> WCAG 2.2 AA compliance audit mapped to the current site, plus specific remediation steps for every identified gap. Target: Lighthouse Accessibility score of 100.

---

## Table of Contents

- [A11y Philosophy](#a11y-philosophy)
- [Current Accessibility Score Estimate](#current-accessibility-score-estimate)
- [WCAG 2.2 AA Checklist](#wcag-22-aa-checklist)
- [Gap 1: SVG and Icon Alt Text](#gap-1-svg-and-icon-alt-text)
- [Gap 2: Terminal Screen Reader Experience](#gap-2-terminal-screen-reader-experience)
- [Gap 3: Character Key Shortcuts Compliance](#gap-3-character-key-shortcuts-compliance)
- [Gap 4: Focus Management in Overlays](#gap-4-focus-management-in-overlays)
- [Gap 5: Heading Hierarchy Consistency](#gap-5-heading-hierarchy-consistency)
- [Gap 6: Chat Output Readability](#gap-6-chat-output-readability)
- [Gap 7: Aria-Live for Dynamic Content](#gap-7-aria-live-for-dynamic-content)
- [Gap 8: Status Messages](#gap-8-status-messages)
- [Color Contrast Verification](#color-contrast-verification)
- [Keyboard Navigation Audit](#keyboard-navigation-audit)
- [Screen Reader Testing Protocol](#screen-reader-testing-protocol)
- [Implementation Tasks by File](#implementation-tasks-by-file)
- [Acceptance Criteria](#acceptance-criteria)

---

## A11y Philosophy

### Why Accessibility Matters on a Developer Portfolio

1. In 2026, WCAG 2.2 AA compliance is expected by employers, clients, and hiring managers who care about quality
2. The terminal, command palette, and chat assistant are complex interactive widgets — they are exactly where accessibility breaks in most implementations
3. A Lighthouse Accessibility score of 100 is achievable and should be the floor, not the ceiling
4. Showing that interactive systems work for keyboard users and screen reader users demonstrates engineering depth

### Current Strengths (Keep These)

- Skip link on every page
- ARIA labels on all interactive buttons (theme toggle, terminal trigger, mobile nav)
- `aria-expanded` and `aria-controls` on mobile navigation
- `aria-current="page"` on active nav link
- `aria-hidden` on decorative elements
- `role="dialog"` on terminal and chat modals
- `role="listbox"` on command palette
- `role="progressbar"` on reading progress bar
- Reduced motion respected via `prefers-reduced-motion`
- Semantic HTML throughout (main, nav, section, article, footer, aside)
- Color contrast passes WCAG AA in both light and dark themes
- Tab indexing and focus trapping in overlays

---

## Current Accessibility Score Estimate

| Category | Estimated Status | Priority to Fix |
|----------|-----------------|----------------|
| Perceivable | ~90% | SVG alt text missing |
| Operable | ~85% | Keyboard shortcuts not remappable (WCAG 2.1.4) |
| Understandable | ~95% | Language of page set; minor heading gaps |
| Robust | ~90% | Terminal/chat complex HTML output |

---

## WCAG 2.2 AA Checklist

### Principle 1: Perceivable

| Criterion | Level | Status | Notes |
|-----------|-------|--------|-------|
| 1.1.1 Non-text Content | A | ⚠️ Partial | Decorative SVGs (`aria-hidden` ✅), but functional icons lack descriptive text in some places |
| 1.3.1 Info and Relationships | A | ✅ | Semantic HTML throughout |
| 1.3.2 Meaningful Sequence | A | ✅ | DOM order matches visual order |
| 1.3.3 Sensory Characteristics | A | ✅ | No instructions relying solely on shape/location |
| 1.3.4 Orientation | AA | ✅ | No landscape/portrait lock |
| 1.3.5 Identify Input Purpose | AA | ✅ | No form inputs currently (contact page uses links) |
| 1.4.1 Use of Color | A | ✅ | Color is not the sole means of conveying information |
| 1.4.3 Contrast Minimum | AA | ✅ | Both themes pass 4.5:1 for normal text |
| 1.4.4 Resize Text | AA | ✅ | Fluid typography via `clamp()` scales correctly |
| 1.4.10 Reflow | AA | ✅ | Single breakpoint + fluid layout; no horizontal scroll at 320px |
| 1.4.11 Non-text Contrast | AA | ⚠️ Partial | Button outlines and focus rings: verify actual contrast ratios in both themes |
| 1.4.12 Text Spacing | AA | ✅ | No fixed-height containers that clip text when spacing changed |
| 1.4.13 Content on Hover or Focus | AA | ✅ | Tooltips (if any) are dismissable and persistent |

### Principle 2: Operable

| Criterion | Level | Status | Notes |
|-----------|-------|--------|-------|
| 2.1.1 Keyboard | A | ✅ | All functionality operable by keyboard |
| 2.1.2 No Keyboard Trap | A | ✅ | Overlays have escape exits; tab cycles correctly |
| 2.1.4 Character Key Shortcuts | A | ❌ | Single-key shortcuts (`t`, backtick) have no way to be remapped or turned off |
| 2.4.1 Bypass Blocks | A | ✅ | Skip link present on all pages |
| 2.4.2 Page Titled | A | ✅ | All pages have unique, descriptive titles |
| 2.4.3 Focus Order | A | ✅ | DOM order = visual order |
| 2.4.4 Link Purpose | A | ⚠️ Partial | Some icon-only links lack sufficient context |
| 2.4.6 Headings and Labels | AA | ⚠️ Partial | Heading consistency: audit across all pages |
| 2.4.7 Focus Visible | AA | ✅ | Keyboard focus ring visible |
| 2.4.11 Focus Not Obscured (Minimum) | AA | ⚠️ Check | Sticky header at 64px could obscure focused elements below it |
| 2.5.8 Target Size (Minimum) | AA | ⚠️ Partial | Most buttons >= 44px, but verify small nav items |

### Principle 3: Understandable

| Criterion | Level | Status | Notes |
|-----------|-------|--------|-------|
| 3.1.1 Language of Page | A | ✅ | `lang="en"` on every page |
| 3.2.1 On Focus | A | ✅ | No context changes on focus |
| 3.2.2 On Input | A | ✅ | No unexpected context changes on input |
| 3.2.3 Consistent Navigation | AA | ✅ | Nav identical across all pages |
| 3.2.4 Consistent Identification | AA | ✅ | Components with same function identified consistently |
| 3.2.6 Consistent Help | A | ✅ | Contact information consistently positioned |

### Principle 4: Robust

| Criterion | Level | Status | Notes |
|-----------|-------|--------|-------|
| 4.1.2 Name, Role, Value | A | ⚠️ Partial | Custom widgets (terminal, chat, palette) need thorough audit of states |
| 4.1.3 Status Messages | AA | ❌ | Terminal output and chat responses lack `aria-live` announcements |

---

## Gap 1: SVG and Icon Alt Text

### Problem

Icon SVGs throughout the site (footer social links, button icons, arrow icons) fall into two categories that need different treatment:

- **Decorative** — purely visual, meaning conveyed by adjacent text → `aria-hidden="true"`
- **Functional** — standalone icon buttons where the icon IS the label → need accessible name

### Where to Audit

In `styles.css` and all HTML files, look for `<svg>` elements. Check:

```powershell
# Find all SVG tags in HTML files
Get-ChildItem -Path . -Recurse -Filter "*.html" | 
  Select-String -Pattern '<svg' | 
  Format-Table Path, LineNumber, Line
```

### Fix Pattern for Decorative SVGs

```html
<!-- Before -->
<svg class="arrow-icon" viewBox="0 0 24 24">...</svg>

<!-- After -->
<svg class="arrow-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">...</svg>
```

### Fix Pattern for Functional Icon Buttons

```html
<!-- Before: icon-only button -->
<button class="theme-btn">
  <svg viewBox="0 0 24 24">...</svg>
</button>

<!-- After: visually-hidden label text -->
<button class="theme-btn" aria-label="Toggle dark mode">
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">...</svg>
</button>
```

### Fix Pattern for Linked Icons (footer social links)

```html
<!-- Before -->
<a href="https://github.com/MarcoLadeira">
  <svg>...</svg>
</a>

<!-- After -->
<a href="https://github.com/MarcoLadeira" aria-label="View Marco Ladeira's GitHub profile (opens in new tab)">
  <svg aria-hidden="true" focusable="false">...</svg>
</a>
```

---

## Gap 2: Terminal Screen Reader Experience

### Problem

The terminal emulator (`#terminal`) renders output as complex HTML strings — color spans, nested elements, links. Screen readers encounter this as a wall of structural HTML rather than sequential command output.

### Current Behavior

When a user types a command and presses Enter:
1. Input is echoed back as styled HTML
2. Command output is injected as a complex HTML block
3. There is no announcement that new output has appeared

### Fixes

#### A) Wrap terminal output in an aria-live region

```html
<!-- In the terminal HTML structure -->
<div 
  id="terminal-output"
  role="log"
  aria-live="polite"
  aria-label="Terminal output"
  aria-relevant="additions"
>
  <!-- command output injected here -->
</div>
```

`role="log"` is the correct role for terminal-style output: it implies new content is appended, and `aria-live="polite"` announces additions after current speech finishes.

#### B) Simplify DOM structure for each output entry

Each command response should have a minimal accessible structure:

```javascript
function renderOutput(commandText, outputHtml) {
  const entry = document.createElement('div');
  entry.className = 'terminal-entry';
  // Associate command with its output for SR users
  entry.setAttribute('aria-label', `Command: ${commandText}`);
  // The output can still use rich HTML inside
  entry.innerHTML = `<span class="t-prompt" aria-hidden="true">$ </span>
                     <span class="t-echo">${escapeHtml(commandText)}</span>
                     <div class="t-response">${outputHtml}</div>`;
  return entry;
}
```

#### C) Announce command completion

For long-running fake commands (like `deploy` or `traceroute` that use setTimeout):

```javascript
// When the command "completes"
const announcement = document.createElement('div');
announcement.className = 'sr-only';
announcement.setAttribute('aria-live', 'assertive');
announcement.textContent = `Command ${commandName} complete`;
document.body.appendChild(announcement);
setTimeout(() => announcement.remove(), 1000);
```

#### D) Add `role="status"` to the terminal prompt line

```javascript
document.querySelector('.terminal-input-line')
  .setAttribute('role', 'status'); // announces current prompt text
```

---

## Gap 3: Character Key Shortcuts Compliance

### Problem

WCAG 2.1.4 (Level A) requires that single-key keyboard shortcuts (letters, punctuation, numbers) either:
1. Can be turned off, OR
2. Can be remapped, OR
3. Are only active when a component has focus

Current violations:
- `T` key → toggle theme (active on entire page, not just when in a widget)
- Backtick `` ` `` → open terminal (active on entire page)
- `/` → open command palette hint (if implemented)

These shortcuts fire when AT users are navigating with a screen reader using letter keys to jump to next heading, link, etc.

### Fix

Add a keyboard shortcuts settings option accessible via the site settings or a simple toggle:

```javascript
// Add to theme/settings persistence in localStorage
let shortcutsEnabled = localStorage.getItem('keyboardShortcuts') !== 'false';

// All shortcut handlers should check this flag
document.addEventListener('keydown', (e) => {
  // Skip if user is typing in an input field (already handled)
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
  
  // Skip if shortcuts are disabled
  if (!shortcutsEnabled) return;
  
  if (e.key === 't' && !e.ctrlKey && !e.metaKey) {
    toggleTheme();
  }
  if (e.key === '`') {
    openTerminal();
  }
});
```

Add a "Disable keyboard shortcuts" option to the command palette (so power users can disable if needed):

```javascript
// In the command palette command list
{
  label: 'Disable keyboard shortcuts',
  description: 'Turn off single-key shortcuts (T, `, etc.)',
  action: () => {
    shortcutsEnabled = false;
    localStorage.setItem('keyboardShortcuts', 'false');
  }
}
```

---

## Gap 4: Focus Management in Overlays

### Problem

When the terminal or command palette opens, focus should move INTO the overlay. When it closes, focus must return to the element that triggered it.

### Current Behavior

Based on the code, this is partially implemented. A full audit and any missing steps:

```javascript
// On open: save trigger, move focus to input
function openTerminal(triggerElement) {
  window.__terminalTrigger = triggerElement || document.activeElement;
  terminal.removeAttribute('hidden');
  terminal.removeAttribute('aria-hidden');
  terminalInput.focus();
}

// On close: return focus to trigger
function closeTerminal() {
  terminal.setAttribute('hidden', '');
  terminal.setAttribute('aria-hidden', 'true');
  if (window.__terminalTrigger) {
    window.__terminalTrigger.focus();
    window.__terminalTrigger = null;
  }
}
```

### Focus Trap Completeness

Ensure Tab and Shift+Tab cycle ONLY within the open overlay (not into page behind it):

```javascript
function trapFocus(containerElement) {
  const focusable = containerElement.querySelectorAll(
    'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  
  containerElement.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
}
```

### Also Verify

- `aria-modal="true"` on the terminal dialog — tells AT to not expose content behind it
- Terminal `role="dialog"` should also have `aria-labelledby` pointing to the terminal heading

```html
<div 
  id="terminal"
  role="dialog"
  aria-modal="true"
  aria-labelledby="terminal-title"
  aria-describedby="terminal-desc"
>
  <h2 id="terminal-title" class="sr-only">Terminal</h2>
  <p id="terminal-desc" class="sr-only">Interactive terminal. Type help for available commands. Press Escape to close.</p>
  ...
</div>
```

---

## Gap 5: Heading Hierarchy Consistency

### Problem

Each page should have exactly:
- One `<h1>` (page title/hero)
- `<h2>` for major sections
- `<h3>` for sub-sections within h2
- `<h4>` or deeper only when genuinely needed

Skipping levels (h1 → h3) is a WCAG 1.3.1 failure.

### Audit Script

```javascript
// Paste in browser console on any page
const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
let last = 0;
headings.forEach(h => {
  const level = parseInt(h.tagName[1]);
  const skip = level - last > 1 && last !== 0;
  console.log(`${skip ? '⚠️ SKIP' : '✅'} ${'  '.repeat(level-1)}h${level}: "${h.textContent.trim().substring(0, 60)}"`);
  last = level;
});
```

Run this on every page. Fix any skips by either using intermediate headings or using `<p>` with visually matching styles.

### Common Issue: Visually-styled non-headings

If a paragraph is styled to look like a h3 but uses `<p class="kicker">`, that is fine as long as it is not meant to be a structural heading for a section that follows.

---

## Gap 6: Chat Output Readability

### Problem

The AI chat assistant renders responses with HTML formatting (bold, links, bullet points). When a screen reader reads this, the raw markup structure can interrupt the natural flow.

### Fixes

#### A) `aria-live="polite"` on the chat output container

```html
<div 
  id="chat-messages" 
  role="log"
  aria-live="polite"
  aria-label="Chat conversation"
>
  <!-- messages injected here -->
</div>
```

#### B) Structure each message as semantic chat history

```html
<div class="chat-message" role="listitem">
  <span class="sr-only">Marco's AI assistant says:</span>
  <div class="chat-content">
    <!-- formatted HTML response -->
  </div>
</div>
```

#### C) Announce message count for context

```javascript
const msgCount = document.querySelectorAll('.chat-message').length;
chatContainer.setAttribute('aria-label', `Chat conversation with ${msgCount} messages`);
```

---

## Gap 7: Aria-Live for Dynamic Content

### All Dynamic Regions Inventory

| Component | Dynamic Content | Current aria-live | Fix |
|-----------|----------------|-------------------|-----|
| Terminal output | Command responses | Missing | Add `role="log" aria-live="polite"` |
| Chat messages | AI responses | Missing | Add `role="log" aria-live="polite"` |
| Command palette results | Filtered commands | Partial (listbox) | Verify count announced |
| Theme toggle | Button label change | Missing | Add visually-hidden status update |
| Reading progress | Progress % | None needed | Decorative — `aria-hidden="true"` |
| Terminal boot sequence | Typed animation | Missing | Provide full text when complete |

### Pattern for Status Announcements

```javascript
function announceStatus(message, politeness = 'polite') {
  const announcer = document.getElementById('sr-announcer') || (() => {
    const el = document.createElement('div');
    el.id = 'sr-announcer';
    el.className = 'sr-only';
    el.setAttribute('aria-live', politeness);
    el.setAttribute('aria-atomic', 'true');
    document.body.appendChild(el);
    return el;
  })();
  
  // Brief reset trick ensures re-announcements work
  announcer.textContent = '';
  requestAnimationFrame(() => { announcer.textContent = message; });
}

// Usage
announceStatus('Dark mode enabled');
announceStatus('Terminal opened. Type help for commands.');
announceStatus('Command palette opened. Type to search.');
```

---

## Gap 8: Status Messages

### WCAG 4.1.3 Status Messages (AA)

Status messages that appear without receiving focus must still be announced to AT users.

**Affected components:**
- Theme toggle confirmation ("Dark mode enabled")
- Terminal boot message ("system ready")
- Copy-to-clipboard success (if you add this feature)
- Form submission success (if you add a contact form)

Use `announceStatus()` from Gap 7 for all of these.

---

## Color Contrast Verification

### Tools

- **WebAIM Contrast Checker** — contrast.webaim.org
- **Colour Contrast Analyser** — desktop tool (most accurate against actual rendered pixels)
- **Lighthouse** — automated check in DevTools

### Critical Pairs to Verify

#### Light Theme

| Foreground | Background | Ratio Needed | Check |
|-----------|-----------|-------------|-------|
| `--text` `#111318` | `--bg` `#f5f0e8` | 4.5:1 | ✅ ~16:1 estimated |
| `--text-secondary` `#494e5b` | `--bg` `#f5f0e8` | 4.5:1 | Verify |
| `--muted` `#7c8190` | `--bg` `#f5f0e8` | 4.5:1 | ⚠️ Likely marginal |
| Button text on primary button | `#1a1a1a` fill | 4.5:1 | Verify |

#### Dark Theme

| Foreground | Background | Ratio Needed | Check |
|-----------|-----------|-------------|-------|
| `--text` `#f1f3f7` | `--bg` `#0b0d11` | 4.5:1 | ✅ ~17:1 estimated |
| `--text-secondary` | `--bg` `#0b0d11` | 4.5:1 | Verify |
| `--muted` `#8a91a3` | `--bg` `#0b0d11` | 4.5:1 | ⚠️ Marginal |

If `--muted` fails AA, either darken it on light theme (`#5f6470`) or lighten it on dark theme (`#9ba3b8`).

---

## Keyboard Navigation Audit

### Tab Order Test (Do This Manually)

On every page, press Tab from the top and verify:

1. Skip link is first focusable element and works
2. Navigation links are in DOM order
3. Main content comes after navigation
4. All interactive elements receive visible focus
5. No focus traps in page content (only in overlays when open)
6. Terminal/palette/chat overlays trap focus while open
7. Escape closes all overlays and returns focus

### Interactive Widgets Test

For the terminal:
1. Open with keyboard (backtick)
2. Type a command, press Enter — output announced?
3. Tab autocomplete works
4. Up/Down history works
5. Ctrl+L clears
6. Escape closes and returns focus

For the command palette:
1. Open with Ctrl+K
2. Type to filter
3. Arrow keys navigate results
4. Enter executes
5. Escape closes and returns focus

---

## Screen Reader Testing Protocol

### Tools

- **NVDA + Chrome** (Windows — free)
- **VoiceOver + Safari** (macOS — free, built-in)
- **axe DevTools browser extension** (automated structural checks)

### Test Script

1. Navigate to homepage
2. Activate screen reader browse mode
3. Tab through entire page — every focusable element should have a clear, descriptive label
4. H key (heading navigation) — all content sections are reachable and labeled
5. Open terminal with backtick — announcement on open? Focus moves in?
6. Type "about" — is the output read aloud?
7. Escape — focus returns to trigger?
8. Open command palette — focus moves? Results announced?
9. Navigate to article page — reading time announced? TOC navigable? Progress bar silent?

---

## Implementation Tasks by File

### `interactive.js`

- Add `role="log"` and `aria-live="polite"` to terminal output container
- Add `role="log"` and `aria-live="polite"` to chat container
- Add `aria-modal="true"` to terminal dialog
- Add `aria-labelledby`/`aria-describedby` to terminal and chat dialogs
- Add screen reader only title and description to terminal dialog
- Implement focus save/restore on open/close for all overlays
- Implement complete focus trap with Shift+Tab coverage
- Add `announceStatus()` utility function
- Add `shortcutsEnabled` toggle for WCAG 2.1.4

### `script.js`

- Add `announceStatus()` calls for theme toggle
- Verify focus-not-obscured: when sticky header is 64px, ensure focused elements scroll into view with that offset
- Add `focusable` scroll padding to `<html>` or `body`:

```css
html {
  scroll-padding-top: calc(var(--nav-height) + 16px);
}
```

### `styles.css`

- Add `.sr-only` utility class (visually-hidden but accessible):

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

- Verify focus ring visibility in both themes: minimum 2px solid, offset 2px, high-contrast color
- Verify `--muted` color meets 4.5:1 in both themes, adjust if not

### Every HTML file

- `aria-hidden="true" focusable="false"` on all decorative SVGs
- `aria-label="..."` on all icon-only linked/button SVGs
- `lang="en"` already present — verify none missed
- Run heading hierarchy audit with console script and fix skips

---

## Acceptance Criteria

Accessibility phase complete when:

1. Lighthouse Accessibility score is 100 on all pages
2. axe DevTools reports zero violations
3. Terminal opens, accepts commands, and announces output in NVDA+Chrome
4. Command palette opens, filters, and executes in keyboard-only mode
5. All SVG icons have correct accessible names or `aria-hidden`
6. Tab order on all pages is logical and skip link works
7. Heading hierarchy has no skipped levels on any page
8. `--muted` colors pass WCAG AA contrast in both themes
9. Keyboard shortcuts can be disabled via command palette
10. WCAG 2.1.4 complied with via disable/remap mechanism
