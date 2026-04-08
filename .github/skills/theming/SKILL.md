---
description: "CSS theming system — 16 themes, CSS vars, dark mode, flash-prevention. Use when creating or modifying theme support, themes.css, or dark mode behavior."
---

# CSS Theming System

> Full reference for the CSS variable-based theming system.
> For policy-level rules (which 4 themes to use by default), see `ui.instructions.md`.

---

## Setup

**themes.css** — link after Tailwind config in `index.html`. Defines all CSS variable sets.

**Flash-prevention inline script** — runs before React CDNs, before any paint:

```html
<script>
  (function() {
    var t = localStorage.getItem('ui-theme') || 'zinc';
    var m = localStorage.getItem('ui-mode')  || 'light';
    document.documentElement.setAttribute('data-theme', t + '-' + m);
  })();
</script>
```

**React integration** (in `app.jsx`):

```jsx
const [theme, setTheme] = React.useState(() => localStorage.getItem('ui-theme') || 'zinc');
const [mode,  setMode]  = React.useState(() => localStorage.getItem('ui-mode')  || 'light');

React.useEffect(() => {
  document.documentElement.setAttribute('data-theme', `${theme}-${mode}`);
  localStorage.setItem('ui-theme', theme);
  localStorage.setItem('ui-mode',  mode);
}, [theme, mode]);
```

**Tailwind config** — gray scale remapped to CSS vars:

```html
<script>
  tailwind.config = {
    theme: {
      extend: {
        fontFamily: {
          sans: ['Inter', 'system-ui', 'sans-serif'],
        },
        colors: {
          white: 'var(--color-white)',
          gray: {
            50:  'var(--gray-50)',
            100: 'var(--gray-100)',
            200: 'var(--gray-200)',
            300: 'var(--gray-300)',
            400: 'var(--gray-400)',
            500: 'var(--gray-500)',
            600: 'var(--gray-600)',
            700: 'var(--gray-700)',
            800: 'var(--gray-800)',
            900: 'var(--gray-900)',
          }
        }
      }
    }
  }
</script>
```

---

## CSS Variables

| Variable | Role |
|---|---|
| `--gray-50` … `--gray-900` | Full gray scale — remapped per theme |
| `--color-white` | Surface backgrounds (dark mode maps to a dark tone) |
| `--toggle-thumb` | Toggle thumb color — always use this, never `bg-white` |
| `--overlay-bg` | Tooltip/overlay background — defined at `:root` scope (global, not per-theme), always `var(--gray-900)` |
| `--overlay-text` | Tooltip/overlay text — defined at `:root` scope (global, not per-theme), always `var(--gray-50)` |
| `--accent` | Theme accent (darkest meaningful tone) |
| `--accent-fg` | Foreground on accent background |

---

## Standard Theme Set (default for new apps)

Use these 4 themes as the default options in new app theme selectors:

| Value | Label | Description |
|---|---|---|
| `zinc` | zinc | Pure neutral (default) |
| `arctic` | arctic | Icy saturated blue |
| `stone` | stone | Warm taupe |
| `hc` | contrast | Maximum separation |

`ui-showcase` may expose all 16 themes. Generated apps should start with the standard 4 unless the user asks for more.

---

## Full Theme Catalog (all 16)

Grouped by family — available in `themes.css`:

**Standard:** `zinc`, `arctic`, `stone`, `hc`
**Business:** `navy`, `oxblood`, `racing`
**Vibrant:** `fuchsia`, `amber`, `teal`, `crimson`
**Casual:** `peach`, `sky`, `sage`, `lavender`, `sand`

Each has `-light` and `-dark` variant: `data-theme="zinc-light"` / `data-theme="zinc-dark"`.

---

## `hc` Special Behavior

```css
[data-theme^="hc-"] *,
[data-theme^="hc-"] *::before,
[data-theme^="hc-"] *::after { letter-spacing: 0.01em; }
```

---

## Toggle Thumb Rule

```jsx
{/* ❌ breaks in dark/colored themes */}
<span className="bg-white" />

{/* ✅ always use the CSS variable */}
<span style={{ backgroundColor: 'var(--toggle-thumb)' }} />
```

---

## Dark Mode Shadows

```css
[data-theme$="-dark"] .shadow-sm {
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.6), 0 1px 2px -1px rgb(0 0 0 / 0.4);
}
```

---

## Theme Selector Pattern

```jsx
<Dropdown
  value={theme}
  onChange={setTheme}
  width="w-full"
  options={[
    { value: 'zinc',    label: 'zinc'     },
    { value: 'arctic',  label: 'arctic'   },
    { value: 'stone',   label: 'stone'    },
    { value: 'hc',      label: 'contrast' },
  ]}
/>
<Toggle
  checked={mode === 'dark'}
  onChange={v => setMode(v ? 'dark' : 'light')}
  label="dark mode"
/>
```

For multi-section apps with sidebar, place theme controls at the top of the sidebar. For simpler apps, use a top-right corner or settings area.
