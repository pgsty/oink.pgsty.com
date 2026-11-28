.PHONY: browser build check dev serve

browser:
	GOWORK=off HUGO_MODULE_WORKSPACE=off HUGO_MODULE_REPLACEMENTS='github.com/pgsty/oink -> $(abspath ../oink)' npm run test:browser

build:
	hugo --cleanDestinationDir --minify

check:
	GOWORK=off HUGO_MODULE_WORKSPACE=off HUGO_MODULE_REPLACEMENTS='github.com/pgsty/oink -> $(abspath ../oink)' npm run _test:sibling

dev:
	GOWORK=off HUGO_MODULE_WORKSPACE=off HUGO_MODULE_REPLACEMENTS='github.com/pgsty/oink -> $(abspath ../oink)' hugo server --renderToMemory -DFE

serve:
	hugo server --environment production --minify --disableFastRender --disableLiveReload
