# Design Subagent Brief: Quillt Newsletter Platform

## Brand Identity

### Name & Concept
- **Site name:** Quillt
- **Tagline idea:** Something subtle — "writing that flows" or similar (quill + quilt + German "quillt" meaning flow)
- **This is a multi-author platform.** "Quillt" is the masthead. Each author has their own name/profile beneath it. Think of it like a magazine title with bylines, not a personal blog with one name in the header.
- **First author:** Hannah (link to existing Substack: hannahvictorius.substack.com for tone/content reference)

### Design References
- **Colossal** (thisiscolossal.com): Bold typography, big images, confident layout, editorial feel. Use this as the ceiling for visual boldness.
- **Substack** (hannahvictorius.substack.com): Clean reading experience, warm background colours, square-edged images in posts, simple nav. Use this as the floor for readability.
- **Target:** Somewhere between the two. Colossal's confidence with Substack's warmth and intimacy.

---

## Layout & Spacing

### Content Width — THIS IS IMPORTANT
- **Body text and images in posts should fill ~70% of the viewport width on desktop**, not the typical narrow 680px strip.
- On a 1440px screen that means content area of ~1000px.
- Images within posts can go even wider — up to 85-90% viewport for full-bleed hero shots.
- On mobile, content should fill the screen edge-to-edge with modest padding (16-20px).
- On tablets, keep it proportional — no thin strip of text floating in white space.

### Homepage Layout
- **Big bold "Quillt" header** at the top — think Colossal's oversized masthead but adapted. Not necessarily as huge, but confident and distinctive.
- Navigation: Posts, Subscribe, About (keep it simple)
- **Featured/latest post** gets a hero treatment: large cover image spanning most of the width, title overlaid or directly below, author name and date.
- **Post grid below:** 2 columns on desktop, 1 on mobile. Cards with cover images, title, excerpt, date, author, tags.
- Subscribe CTA near the bottom — the existing "Stay in the loop" section is good, keep iterating on it.

### Individual Post Layout
- **Hero image at the top: full-width, big, magazine-style.** This is the first thing you see — it should feel like opening a feature article. Square edges (no rounded corners on the hero).
- Post title: large, bold, editorial. Sits below or overlaid on the hero.
- Author name + date + reading time beneath the title.
- **Body content at ~70% width**, centred.
- **Images within the post: square-edged** (no border-radius). They can optionally break out wider than the text column for visual impact.
- At the bottom: tags, subscribe CTA, "next post" navigation.

---

## Typography

- **Masthead/site title (Quillt):** Something bold and distinctive. Consider: a chunky serif like Playfair Display Black, or a bold grotesque like Space Grotesk Bold, or something with personality. This should feel like a magazine logo, not a default heading.
- **Post titles:** Large serif — Newsreader, Lora, or Playfair Display. Should feel editorial.
- **Body text:** Readable serif at 18-20px, generous line-height (1.7-1.8). Newsreader or Lora work well. The 70% width means slightly larger text works.
- **UI elements (nav, dates, tags, buttons):** Clean sans-serif — Inter or similar.
- **Pull quotes / blockquotes:** Styled distinctively — larger font, maybe italic, with a visual accent.

---

## Colour & Theming

### Dynamic Theming (Future CMS Feature)
The site should support customisable colour themes per author or globally. For now, implement with CSS custom properties so swapping themes is trivial.

### Default Theme
- **Background:** Warm off-white/cream (`#faf9f6` or similar — NOT pure white)
- **Text:** Near-black (`#1a1a1a`)
- **Accent colour:** A warm, muted tone — burnt amber/sienna (`#b45309`), forest green, or muted navy. Should feel editorial, not startup-y.
- **Muted text (dates, excerpts):** Warm grey (`#6b6560`)
- **Cards/surfaces:** Slightly lighter or same as background with subtle border or shadow

### Colour Customisation Goal
Eventually each author could pick their own background colour and accent, like Substack allows. For now, just make sure all colours flow through CSS custom properties:
```css
:root {
  --color-bg: #faf9f6;
  --color-text: #1a1a1a;
  --color-text-muted: #6b6560;
  --color-accent: #b45309;
  --color-surface: #ffffff;
  --color-border: #e8e6e1;
  --font-display: 'Playfair Display', serif;
  --font-body: 'Newsreader', Georgia, serif;
  --font-ui: 'Inter', system-ui, sans-serif;
  --content-width: 70vw;
  --content-max-width: 1000px;
  --wide-width: 85vw;
}
```

---

## Component-Specific Notes

### Header/Nav
- "Quillt" as a bold masthead — should be the visual anchor of the page
- Keep nav minimal: Posts, Subscribe, About
- On mobile: hamburger or simplified nav
- Subtle top border or accent line (like the current amber line) is nice, keep it

### Post Cards (Homepage Grid)
- Cover image fills the top of the card, square-edged
- Title bold and prominent
- Excerpt in muted text
- Date + author + tags at bottom
- Hover state: subtle lift or image zoom
- Cards should feel spacious, not cramped

### Subscribe Form
- Keep it simple: email input + button
- Accent colour for the button
- Friendly copy ("Stay in the loop" or "Join the quilt" or similar)
- Success/error states

### Footer
- Minimal — copyright, maybe a small "Built with Astro" or similar
- Social links if desired

---

## Images
- **Hero images on posts: square-edged, no border-radius.** This is a firm preference.
- Images in the post grid/cards can have very subtle rounding (2-4px max) or also be square — keep consistent.
- All images responsive, proper aspect ratios maintained.
- Support for wide/full-bleed images within posts that break out of the text column.

---

## Multi-Author Considerations
- The site is "Quillt" — not "Hannah's blog"
- Each post shows its author
- Homepage can filter by author eventually (not needed now, but don't hardcode assumptions about a single author)
- Author pages would be a future feature
- The current "Hannah" branding in the header should become "Quillt"

---

## What NOT to Change
- The subscribe form functionality (Google Sheets integration) — just restyle it
- The Keystatic CMS setup — this is purely frontend design
- The Astro project structure — work within the existing components

---

## Priority Order
1. Rename site from "Hannah" to "Quillt" with proper masthead typography
2. Widen the content area to ~70% viewport
3. Hero image treatment on post pages (big, square-edged, magazine-style)
4. Homepage layout with featured post + grid
5. Typography system (display + body + UI fonts)
6. Colour theme with CSS custom properties
7. Responsive refinements
