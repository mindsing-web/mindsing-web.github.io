# MindSing Hugo Website

www.mindsing.com - this site is built with Hugo, see https://gohugo.io/
## Getting Started
To get started, first initialize the sub-theme.
### Ananke Sub-Theme Initialization

To update the sub-theme:

`git submodule update --init`

### Hugo Dev Server
To start the server:

`cd web && hugo server -D`

### Front-end Development
To compile the front-end assets:
`cd frontend && npm run watch`

See `frontend/README.md` for more info.

## Publishing

The website is hosted at GitHub pages,
at https://github.com/bdanin/bdanin.github.io/settings/pages

To update the static page HTML, run `hugo` from the web directory
and the site will be regenerated.

To setup the public repo for publishing, first connect to the GitHub repo
from the public directory.

If this is the first time, create the public repo.

Note that `github-bdanin` is an alias
setup in `~/.ssh/config` for `git@github.com`.

This connection uses a specific SSH key used for
bdanin's GitHub account to connect to GitHub.

### Connect to the Public Publishing Repo
```
mkdir public && cd public;
git init;
git remote add origin github-bdanin:bdanin/bdanin.github.io.git;
git pull origin main;
git branch --set-upstream-to=origin/main main;
```
