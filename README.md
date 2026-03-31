# Personal Newsletter Site

A minimal newsletter/blog site built with [Astro](https://astro.build), deployed to GitHub Pages, with a Google Sheets subscriber list.

---

## Writing a new post

1. Create a new file in `src/content/posts/`, e.g. `my-new-post.md`
2. Add frontmatter at the top:

```yaml
---
title: 'My New Post'
description: 'One sentence summary shown on the homepage.'
pubDate: '2026-04-01'
coverImage: '/images/my-new-post/cover.jpg'   # optional
tags: ['writing', 'ideas']                     # optional
draft: false
---
```

3. Write your post content below the frontmatter using Markdown
4. Set `draft: true` to hide a post from the homepage while drafting
5. Push to `main` — GitHub Actions will build and deploy automatically

### Importing from Notion

1. In Notion, open the page → `···` → **Export** → **Markdown & CSV**
2. Drop the `.md` file into `src/content/posts/`
3. Add the required frontmatter fields at the top
4. Move any images to `public/images/<post-slug>/` and update image paths

---

## Adding images

Store images in `public/images/<post-slug>/`:

```
public/
  images/
    my-new-post/
      cover.jpg
      photo-1.jpg
```

Reference in markdown:
```markdown
![Alt text](/images/my-new-post/photo-1.jpg)
```

---

## Subscribe webhook (Google Sheets)

1. Create a Google Sheet with headers: `Email` (col A), `Date` (col B)
2. Open **Extensions → Apps Script** and paste:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  sheet.appendRow([data.email, new Date()]);
  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Click **Deploy → New deployment** → type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Copy the deployment URL
5. Open `src/components/SubscribeForm.astro` and paste it:

```javascript
const SUBSCRIBE_URL = "https://script.google.com/macros/s/YOUR_ID/exec";
```

---

## Customising the look

All design tokens live in `src/styles/global.css` under `:root`:

```css
:root {
  --color-bg: #fafaf9;
  --color-text: #1c1917;
  --color-accent: #b45309;       /* change this for a new accent colour */
  --font-body: 'Newsreader', Georgia, serif;
  --font-ui: 'Inter', system-ui, sans-serif;
}
```

To change fonts, update the Google Fonts import URL at the top of `global.css` and the `--font-body` / `--font-ui` variables.

---

## Deployment

Deployment is fully automated via GitHub Actions (`.github/workflows/deploy.yml`).

**First-time setup:**

```bash
# Install dependencies
npm install

# Preview locally
npm run dev

# Initialise git and push to GitHub
git init
git add .
git commit -m "Initial commit"
gh repo create quilt_app --public --source=. --push

# Enable GitHub Pages (Actions as source)
gh api -X PUT repos/hannahvcoleman/quilt_app/pages \
  -f build_type=workflow
```

Every subsequent push to `main` deploys automatically. The live URL will be:
`https://hannahvcoleman.github.io/quilt_app/`

> **Note:** Update `site` and `base` in `astro.config.mjs` if your repo name differs.

---

## Local development

```bash
npm install       # first time only
npm run dev       # start dev server at http://localhost:4321
npm run build     # build for production
npm run preview   # preview the production build
```

---

## Project structure

```
src/
  content/posts/     <- markdown posts live here
  layouts/
    PostLayout.astro <- individual post layout
  pages/
    index.astro      <- homepage
    subscribe.astro  <- subscribe page
    posts/[...slug].astro
  components/
    Header.astro
    Footer.astro
    PostCard.astro
    SubscribeForm.astro
    Video.astro
  styles/
    global.css
public/
  images/            <- post images go here
.github/workflows/
  deploy.yml         <- GitHub Pages deploy action
```
