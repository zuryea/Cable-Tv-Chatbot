# 🤖 WhatsApp AI Bot

A WhatsApp bot powered by Claude AI that can answer any question intelligently.

## ✅ Requirements
- Node.js 18+ installed
- A Claude API key (free at console.anthropic.com)
- A WhatsApp account to scan QR code

## 🚀 Local Setup (Start Here)

### Step 1 — Download the project
```bash
# Create a new folder
mkdir whatsapp-ai-bot
cd whatsapp-ai-bot
```

### Step 2 — Install packages
```bash
npm install
```

### Step 3 — Add your API key
```bash
# Copy the example file
cp .env.example .env

# Open .env and paste your Claude API key
# Get key from: https://console.anthropic.com
```

### Step 4 — Run the bot
```bash
npm start
```

### Step 5 — Scan QR Code
1. A QR code will appear in your terminal
2. Open WhatsApp on your phone
3. Go to Settings → Linked Devices → Link a Device
4. Scan the QR code
5. Bot is now LIVE! ✅

## 💬 Bot Commands
| Command | What it does |
|---------|-------------|
| !help   | Show help menu |
| !reset  | Clear chat history |
| !about  | About the bot |
| (anything else) | AI replies intelligently |

## ☁️ Deploy to Render (Free Hosting)

1. Push code to GitHub
2. Go to render.com → New Web Service
3. Connect your GitHub repo
4. Add ANTHROPIC_API_KEY in Environment Variables
5. Deploy!

## 🔄 Keep Render Alive (Free)
1. Go to uptimerobot.com
2. Create free account
3. Add monitor → your Render URL
4. Set check every 5 minutes
5. Bot stays online 24/7!

## 🛠️ Customize Your Bot
Edit the `SYSTEM_PROMPT` in `index.js` to change the bot's personality.

For example, for a restaurant bot:
```
You are a friendly assistant for Kerala Kitchen restaurant.
Help customers with: menu items, prices, opening hours, and taking orders.
Our hours: 8am-10pm daily. Location: MG Road, Alappuzha.
```
