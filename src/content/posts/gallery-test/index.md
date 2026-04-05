---
title: Gallery test
description: Testing the four gallery layouts with placeholder images.
pubDate: 2026-04-01
coverImage: ./coverImage.JPG
tags: []
draft: false
author: Hannah
---
This post tests all four gallery layouts. Set `draft: false` to publish it, or delete it once you've seen what you need.

## 2×1 — two images side by side

{% gallery
   images=[{src: "./DSCF0359.jpg", alt: "Sunrise"}, {alt: "Bird"}]
   layout="2x1" /%}

## 3×1 — three across

{% gallery images=[{}, {}, {}] layout="3x1" /%}

## 2×2 — four in a grid

{% gallery images=[{}, {}, {}, {}] layout="2x2" /%}

## 3×3 — nine in a grid

{% gallery images=[{}, {}, {}, {}, {}, {}, {}, {}, {}] layout="3x3" /%}
