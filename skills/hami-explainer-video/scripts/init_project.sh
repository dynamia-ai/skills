#!/usr/bin/env bash
# Create (or update) the Remotion project that HAMi explainer videos are built in.
#
#   init_project.sh [project-dir] [--website <dir>] [--update-kit]
#
# The HAMi website checkout (https://github.com/Project-HAMi/website) is a required
# input: BRAND.md and the official logo and mascot artwork are read from it. Pass it
# with --website <dir> or set HAMI_WEBSITE_REPO. The skill ships no artwork.
#
# project-dir defaults to $HAMI_VIDEO_PROJECT, then to ../hami-videos next to the
# website checkout. The project lives outside the website repo on purpose: renders,
# audio and node_modules must not end up in the site or its CI checks.
#
# Safe to re-run: existing files are kept. --update-kit overwrites only the
# shared code (src/remotion/hami/*.ts, *.tsx, Root.tsx, index.ts) with the skill's version.
set -euo pipefail

SKILL_DIR="$(cd "$(dirname "$0")/.." && pwd)"
WEBSITE="${HAMI_WEBSITE_REPO:-}"
PROJECT=""
UPDATE_KIT=0
while [ $# -gt 0 ]; do
  case "$1" in
    --update-kit) UPDATE_KIT=1 ;;
    --website)
      [ $# -ge 2 ] || { echo "--website needs a directory" >&2; exit 1; }
      WEBSITE="$2"
      shift
      ;;
    --website=*) WEBSITE="${1#--website=}" ;;
    -*) echo "Unknown option: $1" >&2; exit 1 ;;
    *) PROJECT="$1" ;;
  esac
  shift
done

if [ -z "$WEBSITE" ]; then
  echo "HAMi website checkout not given. Set HAMI_WEBSITE_REPO or pass --website <dir>" >&2
  echo "(a clone of https://github.com/Project-HAMi/website; the brand rules and artwork are read from it)." >&2
  exit 1
fi
[ -d "$WEBSITE" ] || { echo "HAMi website checkout not found: $WEBSITE" >&2; exit 1; }
WEBSITE="$(cd "$WEBSITE" && pwd)"
STATIC="$WEBSITE/static"
CHAR="$STATIC/resources/hami-character-assets/illustrations"
MASCOTS="glasses balloon icon/service icon/curiosity icon/broadcast"
missing=""
for f in "$WEBSITE/BRAND.md" "$STATIC/img/hami-horizontal-color-black.svg" "$STATIC/img/hami-graph-color.svg"; do
  [ -f "$f" ] || missing="$missing\n  $f"
done
for name in $MASCOTS; do
  [ -f "$CHAR/$name.png" ] || missing="$missing\n  $CHAR/$name.png"
done
if [ -n "$missing" ]; then
  printf '%s is not a HAMi website checkout, or is out of date. Missing:%b\n' "$WEBSITE" "$missing" >&2
  exit 1
fi

PROJECT="${PROJECT:-${HAMI_VIDEO_PROJECT:-$WEBSITE/../hami-videos}}"

for bin in node npm ffmpeg ffprobe python3; do
  command -v "$bin" >/dev/null || { echo "Missing required tool: $bin" >&2; exit 1; }
done

mkdir -p "$PROJECT/src/remotion/hami/assets" "$PROJECT/src/remotion/compositions" "$PROJECT/videos" "$PROJECT/out"
PROJECT="$(cd "$PROJECT" && pwd)"
T="$SKILL_DIR/template"

keep() { [ -e "$2" ] || cp "$1" "$2"; }
keep "$T/package.json" "$PROJECT/package.json"
keep "$T/tsconfig.json" "$PROJECT/tsconfig.json"
keep "$T/remotion.config.ts" "$PROJECT/remotion.config.ts"
keep "$T/gitignore" "$PROJECT/.gitignore"
keep "$T/env.example" "$PROJECT/.env.example"
keep "$T/src/remotion/registry.ts" "$PROJECT/src/remotion/registry.ts" # yours: the list of videos
for f in index.ts Root.tsx; do
  dest="$PROJECT/src/remotion/$f"
  if [ "$UPDATE_KIT" = 1 ]; then cp "$T/src/remotion/$f" "$dest"; else keep "$T/src/remotion/$f" "$dest"; fi
done
for f in "$T"/src/remotion/hami/*.ts "$T"/src/remotion/hami/*.tsx; do
  dest="$PROJECT/src/remotion/hami/$(basename "$f")"
  if [ "$UPDATE_KIT" = 1 ]; then cp "$f" "$dest"; else keep "$f" "$dest"; fi
done

# Official artwork comes straight from the website checkout, so it is never redrawn.
A="$PROJECT/src/remotion/hami/assets"
cp "$STATIC/img/hami-horizontal-color-black.svg" "$STATIC/img/hami-graph-color.svg" "$A/"
for name in $MASCOTS; do
  out="$A/hami-$(basename "$name").png"
  if command -v sips >/dev/null; then
    sips -Z 1200 "$CHAR/$name.png" --out "$out" >/dev/null # proportional downscale only
  else
    cp "$CHAR/$name.png" "$out"
  fi
done

cd "$PROJECT"
# Install only when the declared dependencies are missing or incomplete.
npm ls --depth=0 >/dev/null 2>&1 || npm install --no-audit --no-fund --loglevel=error
[ -d .venv ] || python3 -m venv .venv
.venv/bin/pip install -q -r "$SKILL_DIR/scripts/requirements.txt"

echo "Project ready: $PROJECT"
if [ -f .env ] && grep -q '^AZURE_SPEECH_KEY=..*' .env; then
  echo "Azure Speech key: found in .env"
else
  echo "Azure Speech key: MISSING. Put AZURE_SPEECH_KEY and AZURE_SPEECH_REGION in $PROJECT/.env (see .env.example)."
fi
