# Version Tagger
cli tool to set version on JS projects by git tags

## flow
- read latest version from git tag, bump it by 0.0.1
  - if version from package.json is larger than latest tag, use that
- (optionally) set tag
- (optionally) write to package.json
- (optionally) commit