{{/*
  Generates release summary links for the version specified in page params.

  Usage: {{% release-summary %}}

  The version is read from .Params.version in the page's front matter.
  The changelog label and #v anchor follow the release-note version when a
  matching report exists (e.g. 0.15.1-dev → blog/release/0.15.0 → changelog
  #v0.15.0).
*/ -}}

{{ $version := $.Page.Param "version" | string -}}
{{ $version = strings.TrimPrefix "v" $version -}}
{{ $isDevVersion := strings.Contains $version "-dev" -}}
{{ if not $version -}}
  {{ errorf "%s: shortcode 'release-summary': version parameter not found in page or site params" .Position -}}
{{ end -}}

{{/* Same major.minor with patch 0, for release lookup when there is no note for this patch (e.g. 0.14.1 → 0.14.0) */ -}}
{{ $parts := split $version "." -}}
{{ $versionForRelease := $version -}}
{{ if and (ge (len $parts) 3) (ne (index $parts 2) "0") -}}
  {{ $versionForRelease = printf "%s.%s.0" (index $parts 0) (index $parts 1) -}}
{{ end -}}

{{/* Get the release section and search for a note: exact version first, then same release with patch 0 */ -}}
{{ $releaseSection := $.Site.GetPage "/blog/release" -}}
{{ $releasePage := false -}}
{{/* Changelog anchor + label align with the resolved release-report version when a note exists */ -}}
{{ $changelogVersion := $version -}}
{{ range $ver := (slice $version $versionForRelease) -}}
  {{ if $releasePage }}{{ break }}{{ end -}}
  {{ $candidate := $releaseSection.GetPage $ver -}}
  {{ if $candidate -}}
    {{ $releasePage = $candidate -}}
    {{ $changelogVersion = $ver -}}
    {{ break -}}
  {{ end -}}
{{ end -}}

{{ $changelogUrlFragment := add "#v" $changelogVersion -}}
{{ $errorOnMissingReleaseNote := and (not $releasePage) (not $isDevVersion) -}}
{{ if $errorOnMissingReleaseNote -}}
  {{ if false -}}
    {{ errorf "%s: shortcode 'release-summary': release note not found for version %q (tried %q)"
        .Position $version (delimit (slice $version $versionForRelease) ", ") -}}
  {{ else -}}
    {{ $changelogUrlFragment = "" -}}
  {{ end -}}
{{ end -}}

{{ $changelogURL := printf "/project/about/changelog/%s" $changelogUrlFragment -}}
{{ $productionURL := .Site.Params.productionURL -}}

## Release summary

- [{{ with $releasePage }}{{ .Title }}{{ else }}Release notes{{ end }}][release]
- [Changelog v{{ $changelogVersion }}][changelog] entry

{{ if and (not $releasePage) (not $isDevVersion) -}}
<!--
  {{ printf "WARNING: shortcode 'release-summary': release note not found for\n  version %q (tried %q)\n"
       $version (delimit (slice $version $versionForRelease) ", ") -}}
-->
{{ end }}
[release]: <{{ $productionURL }}{{ with $releasePage }}{{ .RelPermalink }}{{ else }}/blog/release/{{ end }}>
[changelog]: <{{ $productionURL }}{{ $changelogURL }}>
