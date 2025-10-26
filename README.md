# MindSing Website

Professional website at [www.mindsing.com](https://www.mindsing.com) - built with [Hugo](https://gohugo.io/) static site generator.

## Quick Start

Follow these minimal steps to get the site running locally and to build/publish changes.

1) Clone and initialize the theme (one-time):

```bash
git clone github-bdanin:bdanin/mindsing-hugo.git
cd mindsing-hugo
git submodule update --init --recursive
```

2) Start the development server (live reload, includes drafts):

```bash
make serve
# equivalent: cd web && hugo server -D --port 1313
```

3) Build a production (minified) site:

```bash
make build
# equivalent: cd web && HUGO_ENV="production" hugo --minify
```

4) One-time: initialize the publishing repo in `web/public` and push the initial site to GitHub Pages:

```bash
make public-init
# creates web/public, git init, sets remote (PAGES_REMOTE) and pushes initial commit
```

5) Publish updates (build then commit & push changed files from `web/public`):

```bash
make publish
# builds then commits & pushes only when there are staged changes
```

6) Remove the generated site output:

```bash
make clean
# removes web/public
```

Site will be available at `http://localhost:1313`

## Project Structure

```
mindsing-hugo/              # Main development repository
├── web/                    # Hugo source code
│   ├── assets/             # Hugo assets (SCSS, images, etc.)
│   │   ├── scss/           # SCSS stylesheets
│   │   │   ├── app.scss              # Main site styles
│   │   │   ├── calculator.scss       # Calculator-specific styles
│   │   │   ├── _buttons.scss         # Site-wide button system
│   │   │   ├── hamburger-menu.scss   # Navigation menu
│   │   │   ├── vars.scss             # SCSS variables
│   │   │   └── partials/             # Calculator partials
│   │   │       ├── _collapse.scss
│   │   │       ├── _fixed-action-bar.scss
│   │   │       ├── _forms.scss
│   │   │       ├── _dialog.scss
│   │   │       └── _password.scss
│   │   └── js/            # JavaScript files
│   ├── content/           # Markdown content files
│   ├── layouts/           # Custom Hugo templates
│   ├── static/            # Static assets (images, favicons)
│   ├── themes/ananke/     # Ananke theme (submodule)
│   ├── config.json        # Hugo configuration
│   └── public/            # Generated static site (GitHub Pages)
└── README.md              # This file
```

## Prerequisites

- [Hugo Extended](https://gohugo.io/installation/) (latest version)
- [Git](https://git-scm.com/)
- SSH access to GitHub (for publishing)

## SSH Configuration

This project uses the SSH alias `github-bdanin` which should be configured in your `~/.ssh/config`:

```
# briandanin github
Host github-bdanin
  HostName github.com
  User git
  IdentityFile ~/.ssh/github_bdanin.rsa
  IdentitiesOnly yes
```

This alias is used for the main development repository.

For publishing, it uses the `github-mindsing` alias:

```
# mindsing github
Host github-mindsing
  HostName github.com
  User git
  IdentityFile ~/.ssh/mindsing-ssh-git
  IdentitiesOnly yes
```


## Developer notes
More details and information for developers below.

### Makefile info

Makefile targets (quick reference)
- help — show usage and list targets
- check — verify Hugo is installed and print key variables
- serve — start Hugo dev server (PORT default: 1313)
- build — production build with HUGO_ENV="production" and --minify
- public-init — one-time init of web/public as a git repo and push to PAGES_REMOTE
- publish — build then commit & push changes from web/public to PAGES_REMOTE
- clean — remove web/public

Notes:
- Key Makefile variables are defined at the top of the `Makefile`: `HUGO_DIR`, `PUBLIC_DIR`, `PAGES_REMOTE`, `HUGO_ENV`, `PORT`.
- The publishing targets (`public-init` and `publish`) expect the SSH alias `github-mindsing` to be configured in your `~/.ssh/config` (see the SSH Configuration section below).

**SCSS Processing:** Hugo automatically compiles all SCSS files using its built-in `css.Sass` pipeline. No additional build tools required.

## Development Workflow

### Making Changes
```bash
# Make your changes to content, layouts, or static files
git add .
git commit -m "Describe your changes"
git push origin main        # Push to main development branch
```

### Working with Branches
```bash
git checkout -b feature-name  # Create new feature branch
# Make changes...
git push origin feature-name  # Push feature branch
```

## Styling Architecture

### SCSS Organization
The project uses Hugo's built-in SCSS processing with a modular architecture:

- **Main Site Styles**: `web/assets/scss/app.scss` - Compiled into main site CSS bundle
- **Calculator Styles**: `web/assets/scss/calculator.scss` - Separate stylesheet for calculator pages
- **Shared Components**:
  - `_buttons.scss` - Site-wide button system
  - `hamburger-menu.scss` - Navigation menu styles
  - `vars.scss` - SCSS variables and mixins
- **Calculator Partials**: Modular components in `partials/` directory
  - `_collapse.scss` - Collapsible sections
  - `_forms.scss` - Form-specific styles
  - `_dialog.scss` - Modal dialogs
  - `_password.scss` - Password protection states
  - `_fixed-action-bar.scss` - Action bar components

### How It Works
1. **Hugo processes** SCSS files using `css.Sass` pipeline
2. **Main site pages** get `app.scss` → included in main CSS bundle
3. **Calculator pages** get `calculator.scss` → separate modular stylesheet
4. **Automatic features**: Minification, fingerprinting in production, live reload in development

### Making Style Changes
Simply edit SCSS files in `web/assets/scss/` and Hugo will automatically recompile them during development.

## Content Management

### Creating New Content
```bash
cd web
hugo new content/page-name.md
```

### Working with Drafts
- Add `draft: true` to front matter to hide pages
- Use `hugo server -D` to preview draft content
- Remove `draft: true` when ready to publish

### Adding Images
Place images in `web/static/images/` - they'll be available at `/images/filename.jpg`

## Publishing

### Build for Production
```bash
cd web
HUGO_ENV="production" hugo --minify  # Generates optimized site in public/
```

### Deploy to GitHub Pages
The site is hosted at [GitHub Pages](https://github.com/mindsing-web/mindsing-web.github.io/settings/pages).

#### First-time Setup
```bash
cd web
mkdir public && cd public
git init
git remote add origin github-mindsing:mindsing-web/mindsing-web.github.io.git
git pull origin main
git branch --set-upstream-to=origin/main main
```

#### Publishing Updates
```bash
cd web
HUGO_ENV="production" hugo --minify  # Build the site
cd public
git add .
git commit -m "Update site content"
git push origin main        # Triggers GitHub Pages build
```

## Makefile

A Makefile is included at the repository root to simplify common tasks for development, building, and publishing.

Usage:
- `make serve`      — Start Hugo dev server (port 1313)
- `make build`      — Production build (minified)
- `make public-init` — One-time: initialize `web/public` as a git repo and push to the GitHub Pages remote
- `make publish`    — Build then commit & push changes from `web/public` to the publishing repo
- `make clean`      — Remove the generated `public/` directory

Key variables (in the Makefile):
- `HUGO_DIR` = `web`
- `PUBLIC_DIR` = `web/public`
- `PAGES_REMOTE` = `github-mindsing:mindsing-web/mindsing-web.github.io.git`
- `HUGO_ENV` = `production`
- `PORT` = `1313`


Notes:
- The Makefile expects the SSH alias `github-mindsing` to be configured in your `~/.ssh/config` (see "SSH Configuration" above).
- The `public-init` and `publish` targets operate on `web/public`. Review changes in `web/public` before pushing.

## Configuration Notes

- **Main Repository**: `github-bdanin:bdanin/mindsing-hugo.git` - Primary development repo
- **Publishing Repository**: `github-mindsing:mindsing-web/mindsing-web.github.io.git` - GitHub Pages deployment
- **Theme**: Uses [Ananke](https://github.com/theNewDynamic/gohugo-theme-ananke) theme as Git submodule
- **Custom Overrides**: Local template overrides in `web/layouts/`
- **SCSS Processing**: Hugo's native `css.Sass` pipeline handles all stylesheet compilation

## Hiding Pages From The Main Navigation

You can prevent a page or section from appearing in the site's main navigation by adding a `hideFromMenu: true` boolean to the page's front matter. This is useful for utility pages (like `/calculator/`) that should be reachable but not shown in the global nav.

Example front matter:

```yaml
---
title: "Calculator"
hideFromMenu: true
---
```

Notes:
- The theme's navigation partial may also check additional conditions (for example local template overrides under `web/layouts/partials/` can change behavior).
- If you have a local override for the navigation partial it will take precedence over the theme's partial. Remove or edit `web/layouts/partials/site-navigation.html` if you want the theme's default behavior.

## Troubleshooting

### Submodule Issues
```bash
cd web/themes/ananke
git restore .               # Reset any accidental theme modifications
```

### Theme Updates
```bash
git submodule update --remote
```

### SCSS Issues
```bash
# Hugo automatically recompiles SCSS on changes
# If styles aren't updating, restart the Hugo server:
cd web
hugo server -D
```

### Repository Remote Issues
```bash
# Check remote configuration
git remote -v
# Should show: origin github-bdanin:bdanin/mindsing-hugo.git (fetch/push)

# Reset if needed
git remote set-url origin github-bdanin:bdanin/mindsing-hugo.git
```

## Hugo Shortcodes

This document describes the custom shortcodes available in this Hugo site and how to use them.

### What are Shortcodes?

Shortcodes are simple snippets you can use inside your Markdown content files to add complex HTML without writing raw HTML. They're called using the `{{< shortcode >}}` syntax.

## Available Shortcodes

### YouTube Video Embed

Embeds a responsive YouTube video player.

**Location:** `/web/layouts/shortcodes/youtube.html`

**Usage:**
```
{{< youtube "VIDEO_ID" >}}
```

**Parameters:**
- `VIDEO_ID` (required): The YouTube video ID from the URL

**Examples:**

From URL `https://youtu.be/WzG9vDnizRg`:
```
{{< youtube "WzG9vDnizRg" >}}
```

From URL `https://www.youtube.com/watch?v=WzG9vDnizRg`:
```
{{< youtube "WzG9vDnizRg" >}}
```

**Features:**
- Fully responsive (maintains 16:9 aspect ratio)
- Includes proper iframe attributes for security and accessibility
- Styled with `.video` and `.video--youtube` classes

**CSS Classes:**
- `.video` - Outer wrapper with margin
- `.video__wrapper` - Responsive container maintaining aspect ratio
- `.video--youtube` - Specific styling for YouTube embeds

---

### Partial (Hugo Built-in)

Includes a partial template from `/web/layouts/partials/`.

**Usage:**
```
{{< partial "partial-name.html" >}}
```

**Example:**
```
{{< partial "privacy-banner.html" >}}
```

---

## Creating New Shortcodes

To create a new shortcode:

1. Create an HTML file in `/web/layouts/shortcodes/`
2. Use Hugo template syntax to define the output
3. Access parameters with `.Get 0` (positional) or `.Get "name"` (named)
4. Document it in this file

**Example shortcode structure:**

```html
{{- $param := .Get 0 -}}
{{- if not $param -}}
  {{- errorf "Shortcode requires a parameter" -}}
{{- end -}}

<div class="my-shortcode">
  <!-- Your HTML here -->
  {{ $param }}
</div>
```

## Shortcode Best Practices

1. **Always validate required parameters** - Use `errorf` to provide helpful error messages
2. **Use semantic HTML** - Follow accessibility guidelines
3. **Add CSS classes** - Make shortcodes styleable and maintainable
4. **Keep them simple** - Complex logic belongs in partials or templates
5. **Document thoroughly** - Update this README when adding new shortcodes

## Related Documentation

- [Hugo Shortcodes Documentation](https://gohugo.io/content-management/shortcodes/)
- [Hugo Template Functions](https://gohugo.io/functions/)
- Project CSS: `/web/assets/scss/app.scss`
