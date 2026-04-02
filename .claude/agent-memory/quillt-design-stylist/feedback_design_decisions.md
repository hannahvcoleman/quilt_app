---
name: Approved design decisions from brief
description: Design choices from DESIGN_BRIEF.md that Hannah has explicitly specified as firm requirements
type: feedback
---

**Square-edged images everywhere — no border-radius on img elements.** This is called out as a "firm requirement" in the brief.
**Why:** Editorial/magazine aesthetic like Substack. Rounded images feel like a personal blog or app; square is publication-quality.
**How to apply:** Any time you touch an `img` element or add a new image container, `border-radius: 0`. Card containers and other chrome may use rounding; only img tags and image-holding divs must be square.

**Masthead is "Quillt" the platform, not a personal author name.**
**Why:** Multi-author platform. Header wordmark = magazine title. Author names appear on individual posts/cards as bylines.
**How to apply:** Do not put author names in the header. `SITE_TITLE` should always be 'Quillt'.

**Design references: Colossal (ceiling for boldness) + Substack (floor for readability).**
**Why:** Hannah wants Colossal's confidence and Substack's warmth/intimacy. Neither extreme.
**How to apply:** When choosing between more editorial vs. more minimal, land in the middle. Big typography and images are encouraged; don't add decorative complexity for its own sake.

**Google Fonts is acceptable for this project (not self-hosted via Fontsource).**
**Why:** No explicit instruction to self-host; Google Fonts used in the original project.
**How to apply:** Continue using Google Fonts @import unless Hannah asks to switch. Note: if Core Web Vitals become a concern, suggest Fontsource migration as a future improvement.

**Archivo Black for the QUILLT masthead and featured post title.**
**Why:** Specified in Colossal-inspired brief. Compressed, Black-weight display type for the wordmark.
**How to apply:** Use `--font-masthead` token (Archivo Black). Do NOT use for body text or card titles.

**Newsreader for post titles and body text (replacing Playfair Display as the editorial serif).**
**Why:** Brief specifies "Newsreader or Lora" — Newsreader is already installed and was the body font. Playfair Display has been removed.
**How to apply:** Post h1 and body prose use `--font-display` / `--font-body` (both Newsreader). Card h2 also uses `--font-display`.

**Cream background #f9f7f2 — not white.**
**Why:** Brief specifies this exact value globally, including `--color-surface`. Cards no longer get white backgrounds.
**How to apply:** `--color-bg` and `--color-surface` both resolve to `#f9f7f2`. Never use `#ffffff` for page or card backgrounds.

**Mint green #b2f2d8 is the accent for active/highlight states.**
**Why:** Brief specifies this exactly for active category tags and highlights.
**How to apply:** Use `--color-accent-mint` token. The `.tag-btn.active` class applies it as a background.

**Tag strip in Header has hardcoded placeholder categories.**
**Why:** Real tag filtering requires routing/page logic, which is out of scope for the design layer. The visual shell is implemented.
**How to apply:** If Hannah asks for live tag filtering, flag that it requires changes to `src/pages/` (out of scope).
