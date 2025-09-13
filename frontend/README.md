# Front-end for MindSing Hugo
This directory contains the front-end toolchain used to compile the project's Sass into the Hugo site's `web/static/css` folder.

Key points
- **Sass source:** `resources/sass/`
- **Build tool:** Laravel Mix (`mix`) driven by `webpack.mix.js`
- **Utility CSS:** The site theme `ananke` provides Tachyons utilities (e.g. `flex`, `items-center`, `pa3`). Use Tachyons for layout/spacing and the local `.btn` / `.btn--primary` styles for site buttons.

Prerequisites
- Node.js (LTS recommended, e.g. Node 16+)
- npm (bundled with Node)

Build output
- Compiled CSS is written into the Hugo site public assets at `../web/static/css` (relative to this folder). The Mix config sets `../web/` as the public path.

Install & develop
1. From this directory install exact dev deps:

```bash
cd frontend
npm ci
```

2. For development (watch + rebuild on change):

```bash
npm run watch
```

3. For a production build:

```bash
npm run production
```

Preview with Hugo
- After building the CSS, you can run Hugo to preview the site from the `web` folder:

```bash
cd web
hugo server -D
```

Troubleshooting
- If CSS changes don't appear, ensure the Mix build completed successfully and confirm the expected file exists in `web/static/css`.
- Clear the browser cache or disable cache when testing with `hugo server`.

If you'd like, I can run the install + production build and report the output to confirm the front-end build is clean.
This uses Webpack's Laravel Mix.

This project uses Sass for custom site styles (see `resources/sass/`) and the site theme `ananke` provides the Tachyons utility library for utility classes (like `flex`, `items-center`, `pa3`, etc.).

Default button-like styles live in `app.scss` (for `.btn` and `.btn--primary`) but you can also use Tachyons utilities provided by the theme for layout and spacing without adding extra CSS.

The build uses Laravel Mix to compile the Sass into the site's `web/static/css` folder. Run the build step so the compiled CSS is available during development and deployment.

## Development

First, from this directory install with `npm ci` (preferred) or `npm i`.

To develop, run `npm run watch` from this directory.

## Prod Deployment
Run `npm run production` to prepare for deployment.

Quick commands:

```bash
npm i
npm run watch   # development
npm run production  # production build
```
