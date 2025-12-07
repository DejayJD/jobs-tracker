#!/bin/bash

# Script to copy Prettier settings to global VS Code/Cursor configuration

echo "Setting up global Prettier and editor settings..."

# Detect if Cursor or VS Code is available
CURSOR_SETTINGS="$HOME/Library/Application Support/Cursor/User/settings.json"
VSCODE_SETTINGS="$HOME/Library/Application Support/Code/User/settings.json"

if [ -d "$HOME/Library/Application Support/Cursor" ]; then
    SETTINGS_FILE="$CURSOR_SETTINGS"
    EDITOR_NAME="Cursor"
elif [ -d "$HOME/Library/Application Support/Code" ]; then
    SETTINGS_FILE="$VSCODE_SETTINGS"
    EDITOR_NAME="VS Code"
else
    echo "Neither Cursor nor VS Code settings directory found."
    echo "Please manually copy the settings from .vscode/settings.json to your editor's settings."
    exit 1
fi

echo "Found $EDITOR_NAME settings at: $SETTINGS_FILE"

# Create directory if it doesn't exist
mkdir -p "$(dirname "$SETTINGS_FILE")"

# Backup existing settings if they exist
if [ -f "$SETTINGS_FILE" ]; then
    cp "$SETTINGS_FILE" "${SETTINGS_FILE}.backup.$(date +%Y%m%d_%H%M%S)"
    echo "Backed up existing settings"
fi

# Copy our settings
cp ".vscode/settings.json" "$SETTINGS_FILE"
echo "Copied Prettier settings to $EDITOR_NAME global configuration"

echo "✅ Global settings configured!"
echo ""
echo "Next steps:"
echo "1. Restart $EDITOR_NAME"
echo "2. Install the Prettier extension if prompted"
echo "3. Format document (Shift+Alt+F) should now work in all projects"

# Clean up the script itself
echo ""
echo "You can delete this script now: rm setup-global-settings.sh"
