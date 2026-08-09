HUGO ?= hugo
BIND ?= 127.0.0.1
PORT ?= 1313
THEME_DIR ?= ../oink

.PHONY: dev workspace

dev: workspace
	@printf 'Oink preview: http://%s:%s/\n' "$(BIND)" "$(PORT)"
	@HUGO_MODULE_WORKSPACE="$(CURDIR)/go.work" $(HUGO) server \
		--cleanDestinationDir \
		--logLevel info \
		--environment dev \
		-DFE \
		--printPathWarnings \
		--disableFastRender \
		--renderToMemory \
		--minify \
		--bind "$(BIND)" \
		--port "$(PORT)"

workspace:
	@test -f "$(THEME_DIR)/go.mod" || { \
		echo "Theme not found: $(THEME_DIR)" >&2; \
		exit 1; \
	}
	@test -f go.work || go work init .
	@go work use .
	@go work edit -replace=github.com/pgsty/oink="$(THEME_DIR)"
