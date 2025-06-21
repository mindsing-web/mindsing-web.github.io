# MindSing Website

Professional website at [www.mindsing.com](https://www.mindsing.com) - built with [Hugo](https://gohugo.io/) static site generator.

## Project Structure

```
mindsing-hugo/              # Main development repository
├── web/                    # Hugo source code
│   ├── content/           # Markdown content files
│   ├── layouts/           # Custom Hugo templates
│   ├── static/            # Static assets (images, CSS)
│   ├── themes/ananke/     # Ananke theme (submodule)
│   ├── config.json        # Hugo configuration
│   └── public/            # Generated static site (GitHub Pages)
├── frontend/              # Frontend development assets
│   ├── package.json       # Node.js dependencies
│   └── README.md          # Frontend-specific documentation
└── README.md              # This file
```

## Prerequisites

- [Hugo Extended](https://gohugo.io/installation/) (latest version)
- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (for frontend development)
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

## Getting Started

### 1. Clone and Setup
```bash
git clone github-bdanin:bdanin/mindsing-hugo.git
cd mindsing-hugo
git submodule update --init  # Initialize Ananke theme
```

### 2. Frontend Setup
```bash
cd frontend
npm install                  # Install frontend dependencies
```

### 3. Development Server
```bash
cd web
hugo server -D              # Development mode (includes drafts)
```

For frontend development with live reloading:
```bash
cd frontend
npm run watch               # Compile and watch frontend assets
```

Site will be available at `http://localhost:1313`

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

## Frontend Development

For detailed frontend development instructions, see `frontend/README.md`.

### Quick Commands
```bash
cd frontend
npm run watch               # Watch and compile assets
npm run build               # Build for production
```

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

## Configuration Notes

- **Main Repository**: `github-bdanin:bdanin/mindsing-hugo.git` - Primary development repo
- **Publishing Repository**: `github-mindsing:mindsing-web/mindsing-web.github.io.git` - GitHub Pages deployment
- **Theme**: Uses [Ananke](https://github.com/theNewDynamic/gohugo-theme-ananke) theme as Git submodule
- **Custom Overrides**: Local template overrides in `web/layouts/`
- **Frontend Assets**: Managed separately in `frontend/` directory

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

### Frontend Issues
```bash
cd frontend
npm install                 # Reinstall dependencies
npm run build               # Rebuild assets
```

### Repository Remote Issues
```bash
# Check remote configuration
git remote -v
# Should show: origin github-bdanin:bdanin/mindsing-hugo.git (fetch/push)

# Reset if needed
git remote set-url origin github-bdanin:bdanin/mindsing-hugo.git
```
