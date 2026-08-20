.PHONY: build check dev serve

build:
	hugo --cleanDestinationDir --minify

check:
	HUGO_MODULE_REPLACEMENTS='github.com/pgsty/oink -> $(abspath ../oink)' npm test

dev:
	HUGO_MODULE_REPLACEMENTS='github.com/pgsty/oink -> $(abspath ../oink)' hugo server --renderToMemory -DFE

serve:
	hugo server --environment production --minify --disableFastRender --disableLiveReload
