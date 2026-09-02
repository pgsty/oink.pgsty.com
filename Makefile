.PHONY: browser build check dev serve

browser:
	HUGO_MODULE_REPLACEMENTS='github.com/pgsty/oink -> $(abspath ../oink)' npm run test:browser

build:
	hugo --cleanDestinationDir --minify

check:
	HUGO_MODULE_REPLACEMENTS='github.com/pgsty/oink -> $(abspath ../oink)' npm test

dev:
	HUGO_MODULE_REPLACEMENTS='github.com/pgsty/oink -> $(abspath ../oink)' hugo server --renderToMemory -DFE

serve:
	hugo server --environment production --minify --disableFastRender --disableLiveReload
