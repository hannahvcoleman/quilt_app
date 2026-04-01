---
name: Approved design decisions from brief
description: Design choices from DESIGN_BRIEF.md that Hannah has explicitly specified as firm requirements
type: feedback
---

**Square-edged images everywhere — no border-radius on img elements.** This is called out as a "firm requirement" in the brief.
**Why:** Editorial/magazine aesthetic like Substack. Rounded images feel like a personal blog or app; square is publication-quality.
**How to apply:** Any time you touch an `img` element or add a new image container, `border-radius: 0`. The card container (`.post-card`) can keep its own rounding as chrome; only img tags must be square.

**Masthead is "Quillt" the platform, not a personal author name.**
**Why:** Multi-author platform. Header wordmark = magazine title. Author names appear on individual posts/cards as bylines.
**How to apply:** Do not put author names in the header. `SITE_TITLE` should always be 'Quillt'.

**Design references: Colossal (ceiling for boldness) + Substack (floor for readability).**
**Why:** Hannah wants Colossal's confidence and Substack's warmth/intimacy. Neither extreme.
**How to apply:** When choosing between more editorial vs. more minimal, land in the middle. Big typography and images are encouraged; don't add decorative complexity for its own sake.

**Google Fonts is acceptable for this project (not self-hosted via Fontsource).**
**Why:** No explicit instruction to self-host; Google Fonts used in the original project.
**How to apply:** Continue using Google Fonts @import unless Hannah asks to switch. Note: if Core Web Vitals become a concern, suggest Fontsource migration as a future improvement.
