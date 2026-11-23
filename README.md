# Housing Pact — Samsun

A React and TypeScript website for the **Housing Pact**, an initiative focused on making high-quality rental housing more affordable in Samsun, Türkiye.

The site introduces the initiative, shares project updates, explains its development timeline, and invites landowners and developers to take part in creating more affordable homes.

## Features

- **Interactive hero section** with animated logo shapes that respond to pointer movement.
- **Navigation menu** with animated transitions and in-page links.
- **Latest updates** section with a scrollable news panel and pointer-following visual effect.
- **Promotional video** with a scroll-controlled, house-shaped reveal.
- **Project timeline** presenting five stages of the Housing Pact, from early research through to reviewing its impact.
- **Open call** section for developers and landowners interested in contributing projects.
- **Momentum scrolling** with a scroll hand-off between the page and the news panel.
- **Newsletter sign-up interface** and contact information in the footer.
- **Custom loading screen** and animated hover interactions throughout the site.

## Tech Stack

- React
- TypeScript
- CSS

## Project Structure

```text
src/
├── assets/
│   ├── news-1.png
│   ├── news-2.png
│   ├── news-3.png
│   ├── timeline-1.png
│   ├── timeline-2.png
│   ├── timeline-3.png
│   ├── timeline-4.png
│   ├── timeline-5.png
│   └── promo.mp4
├── components/
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── Updates.tsx
│   ├── UpdatesItems.tsx
│   ├── Promo.tsx
│   ├── Timeline.tsx
│   ├── OpenCall.tsx
│   ├── Newsletter.tsx
│   ├── Footer.tsx
│   └── ...
├── App.tsx
├── App.css
├── index.css
└── main.tsx
```

## Getting Started

Make sure you have Node.js and npm installed.

1. Clone the repository and open the project folder.
2. Install the dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open the local URL printed in your terminal.

If the project uses the standard Vite scripts, you can create a production build with:

```bash
npm run build
```

And preview that build locally with:

```bash
npm run preview
```

## Notes

- The newsletter form currently provides a front-end interface only. It does not submit email addresses to a server or mailing-list service.
- The supplied source snapshot contains the `src/` directory only. The repository also needs its project configuration files (such as `package.json` and the relevant build configuration) for the commands above to run.
