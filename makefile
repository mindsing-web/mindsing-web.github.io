# Makefile for mindsing-hugo
# Usage: make [serve|build|public-init|publish|clean|check|help]

HUGO ?= hugo
HUGO_DIR := web
PUBLIC_DIR := $(HUGO_DIR)/public
PAGES_REMOTE ?= github-mindsing:mindsing-web/mindsing-web.github.io.git
HUGO_ENV ?= production
PORT ?= 1313

.PHONY: help check serve build public-init publish clean

help:
	@echo "Usage: make <target>"
	@echo "Targets:"
	@echo "  help         Show this help"
	@echo "  check        Check prerequisites and variables"
	@echo "  serve        Start Hugo dev server (port $(PORT))"
	@echo "  build        Production build (minified)"
	@echo "  public-init  Initialize $(PUBLIC_DIR) as a git repo and push to remote (one-time)"
	@echo "  publish      Build and push changed files from $(PUBLIC_DIR) to remote"
	@echo "  clean        Remove generated $(PUBLIC_DIR)"

check:
	@command -v $(HUGO) >/dev/null 2>&1 || { echo "ERROR: '$(HUGO)' not found in PATH"; exit 1; }
	@echo "hugo: $$(which $(HUGO))"
	@echo "HUGO_DIR=$(HUGO_DIR)"
	@echo "PUBLIC_DIR=$(PUBLIC_DIR)"
	@echo "PAGES_REMOTE=$(PAGES_REMOTE)"
	@echo "PORT=$(PORT)"

serve:
	@echo "Starting Hugo dev server on port $(PORT)..."
	@cd $(HUGO_DIR) && $(HUGO) server -D --port $(PORT) --tlsAuto

build:
	@echo "Building site (production)..."
	@cd $(HUGO_DIR) && HUGO_ENV="$(HUGO_ENV)" $(HUGO) --minify

# One-time: initialize public/ as a repo and push to remote (no --force)
public-init: build
	@echo "Initializing $(PUBLIC_DIR) and pushing to $(PAGES_REMOTE)"
	@test -d $(PUBLIC_DIR) || (echo "Build failed: $(PUBLIC_DIR) not found" && false)
	@cd $(PUBLIC_DIR) && if [ ! -d .git ]; then \
		git init; \
		git remote add origin $(PAGES_REMOTE); \
		git checkout -b main || true; \
	else \
		echo "public/ already a git repo"; \
	fi
	@cd $(PUBLIC_DIR) && git add . && git commit -m "Initial publish" || echo "Nothing to commit"
	@cd $(PUBLIC_DIR) && git push origin main || echo "Push failed (check remote and credentials)"

# Publish: build then commit/push changed files (no force)
publish: build
	@echo "Publishing changes from $(PUBLIC_DIR) to $(PAGES_REMOTE)"
	@test -d $(PUBLIC_DIR) || (echo "Build failed: $(PUBLIC_DIR) not found" && false)
	@cd $(PUBLIC_DIR) && git add .
	@cd $(PUBLIC_DIR) && if git diff --staged --quiet; then \
		echo "No changes to publish"; \
	else \
		git commit -m "Update site" || echo "Commit failed"; \
		git push origin main; \
	fi

clean:
	@echo "Removing $(PUBLIC_DIR)"
	@rm -rf $(PUBLIC_DIR)
