# @townhall-gg/cli

Command-line interface for [TownHall](https://townhall.gg) form management.

## Installation

```bash
npm install -g @townhall-gg/cli
# or
npx @townhall-gg/cli
```

## Quick Start

```bash
# Authenticate with your API key
townhall login

# List your forms
townhall forms list

# View recent submissions
townhall submissions

# Create a new form
townhall forms create
```

## Commands

### Authentication

```bash
townhall login    # Login with API key
townhall logout   # Clear stored credentials
townhall whoami   # Show current user info
```

### Forms

```bash
townhall forms list              # List all forms
townhall forms ls                # Alias for list
townhall forms create            # Create a new form interactively
townhall forms get <formId>      # Get details about a specific form
```

### Submissions

```bash
townhall submissions             # List recent submissions (interactive form selection)
townhall submissions <formId>    # List submissions for a specific form
townhall subs -l 20              # Show last 20 submissions
```

### Project Setup

```bash
townhall init    # Initialize TownHall in your project (creates .townhallrc)
```

## Configuration

The CLI stores your credentials securely using [conf](https://github.com/sindresorhus/conf).

Configuration location:
- **macOS**: `~/Library/Preferences/townhall-nodejs/config.json`
- **Windows**: `%APPDATA%\townhall-nodejs\Config\config.json`
- **Linux**: `~/.config/townhall-nodejs/config.json`

## Getting Your API Key

1. Go to [townhall.gg/settings/api](https://townhall.gg/settings/api)
2. Create a new API key
3. Run `townhall login` and paste your key

## Examples

### Create a form and use it in your app

```bash
$ townhall forms create
? Form name: Contact Form

✓ Form created!

Form ID: abc123xyz

Use in your code:

  import { useTownHallForm } from '@townhall-gg/react'

  const form = useTownHallForm('abc123xyz')
```

### View submissions as they come in

```bash
$ townhall submissions abc123xyz --limit 5

📬 Recent Submissions (5)

─── 1 ───────────────────────────────
ID:   sub_abc123
Date: 1/8/2026, 3:45:00 PM
Data:
  name: John Doe
  email: john@example.com
  message: Hello there!

─── 2 ───────────────────────────────
...
```

## License

MIT © [TownHall](https://townhall.gg)
