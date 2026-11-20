#!/bin/sh
# Deskmate installer for macOS.
#
# Read it before you run it:
#   https://github.com/AndanteCM/deskmate/blob/main/install.sh
#
# Why this exists instead of "download the .dmg":
# Deskmate isn't code-signed yet (an Apple Developer membership costs $99/yr,
# which the beta is trying to raise). Gatekeeper doesn't block unsigned apps as
# such — it blocks files carrying com.apple.quarantine, which is an attribute
# the *downloading app* attaches. Browsers attach it; curl does not. So
# installing this way skips the "Deskmate can't be opened" wall entirely,
# rather than working around it afterwards.
#
# What it does: finds the latest release, downloads the disk image for your
# chip, copies Deskmate.app to /Applications, and opens it. Nothing else is
# touched — no login items, no system settings, no sudo.

set -eu

REPO="AndanteCM/deskmate-releases"
APP="/Applications/Deskmate.app"
RELEASES="https://github.com/$REPO/releases/latest"

b=$(printf '\033[1m'); dim=$(printf '\033[2m'); off=$(printf '\033[0m')
y=$(printf '\033[1;33m'); r=$(printf '\033[1;31m')

say()  { printf '%s•%s %s\n' "$y" "$off" "$1"; }
die()  { printf '%s✗%s %s\n' "$r" "$off" "$1" >&2; exit 1; }

# ---- checks before touching anything ------------------------------------
[ "$(uname -s)" = "Darwin" ] ||
  die "This installer is macOS-only. For Windows, download the .exe: $RELEASES"

# /Applications is root:admin. A standard (non-admin) account can't write to
# it, and cp would fail partway through with a confusing permissions error.
[ -w /Applications ] ||
  die "Your account can't write to /Applications — it needs an administrator account.
  Log in as an admin user and run this again, or download the .dmg manually: $RELEASES"

# ---- find the right build ------------------------------------------------
say "Looking up the latest release…"
assets=$(curl -fsSL "https://api.github.com/repos/$REPO/releases/latest" \
  | grep -o '"browser_download_url": *"[^"]*\.dmg"' \
  | sed 's/.*"\(https[^"]*\)"/\1/') ||
  die "Couldn't reach GitHub. Check your connection, or download manually: $RELEASES"

[ -n "$assets" ] || die "The latest release has no macOS build. Try: $RELEASES"

if [ "$(uname -m)" = "arm64" ]; then
  url=$(printf '%s\n' "$assets" | grep 'arm64' | head -1)
else
  url=$(printf '%s\n' "$assets" | grep -v 'arm64' | head -1)
fi
[ -n "$url" ] || die "No build for $(uname -m) in the latest release. Try: $RELEASES"

# ---- install -------------------------------------------------------------
tmp=$(mktemp -d)
mnt=""
cleanup() {
  [ -n "$mnt" ] && hdiutil detach "$mnt" >/dev/null 2>&1 || true
  rm -rf "$tmp"
}
trap cleanup EXIT INT TERM

say "Downloading $(basename "$url")"
curl -fL --progress-bar -o "$tmp/deskmate.dmg" "$url" ||
  die "Download failed. Try again, or grab it manually: $RELEASES"

# Replacing a running app's bundle leaves it in a broken half-state, so ask it
# to quit first. Graceful (osascript), not a kill — unsaved widget state gets
# flushed on quit.
if pgrep -qx Deskmate 2>/dev/null; then
  say "Deskmate is running — asking it to quit"
  osascript -e 'quit app "Deskmate"' >/dev/null 2>&1 || true
  sleep 2
fi

say "Mounting the disk image"
mnt=$(hdiutil attach -nobrowse -readonly "$tmp/deskmate.dmg" | grep -o '/Volumes/.*' | head -1)
[ -n "$mnt" ] || die "Couldn't mount the disk image."
[ -d "$mnt/Deskmate.app" ] || die "The disk image doesn't contain Deskmate.app."

say "Installing to /Applications"
rm -rf "$APP"
cp -R "$mnt/Deskmate.app" /Applications/

# Belt and braces: curl didn't set the quarantine attribute, but the disk image
# could have carried one in, and one quarantined bundle is enough to be blocked.
xattr -dr com.apple.quarantine "$APP" 2>/dev/null || true

say "Opening Deskmate"
open -a Deskmate

cat <<EOF

${b}Installed.${off} Two things to know on first launch:

  ${b}1. Press ${y}Alt+Space${off}${b} to open the workspace.${off}
     ${dim}That shortcut works right away. Opening with a double-tap of Ctrl
     needs Accessibility permission (below) before it does anything.${off}

  ${b}2. macOS will ask for permissions.${off}
     ${dim}Accessibility — lets Dusty run off with your cursor, and enables the
     Ctrl double-tap. Camera — only for the optional selfie easter egg; say no
     and everything else still works. Both are also in the welcome screen.${off}

${dim}This is a free beta, so there's no auto-update: rerun this command to
update. Problems or ideas → https://andantecm.github.io/deskmate/#community${off}

EOF
