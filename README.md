# Housing Pact – Real-Estate Website

A single-page real-estate website built section by section with **React**, **Vite** and **TypeScript**, styled with **vanilla CSS only** (no UI or animation libraries).

## Features

- **Page loader** – a pink start-up screen that follows real asset loading (fonts, images, videos) with a logo fill and a bottom progress bar, then slides up when the page is ready.
- **Header** – logo with random hover colours and a time-shifted scroll, plus a menu button that opens a dimmed full-page overlay with a card that grows from the corner and changes background colour each time it opens.
- **Hero** – large headline, animated outline shapes, arrowheads and a contact button with hover animation.
- **Latest updates** – news items in an inner scroller; the title slides down only at the end of the scroll so both finish together.
- **Promo** – full-width autoplaying video revealed through a house-shaped mask as you scroll.
- **Timeline** – pinned section where posts fade and move in sequence while a timeline tape moves sideways.
- **Open call, arrow band and newsletter** – content blocks with hover link effects and a signup form.
- **Footer** – sits behind the newsletter and is revealed with a curtain effect as you scroll, with rolling-text hover links.
- **Smooth scrolling** – a custom wheel-driven glide with hand-over between nested scroll areas.

## Getting started

Requires Node.js 18 or newer.

```bash
npm install
npm run dev       # start the dev server
npm run build     # type-check and create a production build
npm run preview   # preview the production build
```

> This repository contains the `src/` folder. Use the standard Vite React + TypeScript setup (`npm create vite@latest`, template `react-ts`) for the config files, then drop this `src/` folder in.

## Project structure

```
src/
├── App.tsx            # page layout: all sections in order
├── main.tsx           # entry point
├── index.css          # global reset, colour tokens, base font
├── App.css
├── assets/            # images and the promo video
└── components/        # one .tsx/.css pair per section or widget
    ├── Loader         # start-up screen
    ├── Header, Logo   # header, menu panel, shared logo
    ├── Hero, Arrowheads, ContactButton
    ├── Updates, UpdatesTitle, UpdatesItems
    ├── Promo, Timeline, OpenCall
    ├── ArrowBand, Newsletter, Footer
    ├── PactLink, SlideText, ArrowIcon, PlayIcons   # shared UI pieces
    └── SmoothScroll   # global smooth-scroll engine
```

## Customising

- **Promo video:** replace `src/assets/promo.mp4` (keep the file name).
- **Colours:** edit the tokens at the top of `src/index.css`.
- **Menu and footer links:** edit `src/components/navLinks.ts`.
- **Fonts:** Inter and Anton are loaded from Google Fonts.

## Notes

- Layout scales with the viewport width and was designed at about 1900px wide.
- Animations respect the `prefers-reduced-motion` setting.
- Some links (Partners, Agenda, Privacy Policy, Cookie settings) are placeholder anchors until their pages exist.
