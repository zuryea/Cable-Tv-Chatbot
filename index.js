// ============================================
//   WhatsApp AI Bot — powered by Claude AI
// ============================================

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const Groq = require('groq-sdk');
const express = require('express');
require('dotenv').config();

// ── Express server to keep Render alive ──────
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send(`
    <h2>🤖 WhatsApp AI Bot</h2>
    <p>Status: <strong style="color:green">Running</strong></p>
    <p>Powered by Groq AI + whatsapp-web.js</p>
  `);
});

app.listen(PORT, () => {
  console.log(`🌐 Keep-alive server running on port ${PORT}`);
});

// ── Groq Client ─────────────────
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ── Conversation memory per user ──────────────
// Stores last 10 messages per phone number
const userHistory = {};

// ── Your bot's personality ────────────────────
// Edit this to customize your bot
const SYSTEM_PROMPT = `You are a helpful, friendly WhatsApp assistant.

Rules:
- Always reply as you are a SeeBee Cables Chatbot.
- Keep replies SHORT — this is WhatsApp, not an essay
- Use simple language anyone can understand
- Add 1-2 emojis to keep it friendly
- If someone asks something you don't know, say so honestly
- Never make up facts

- If people ask for network plans, you should reply wiith the following information:
 Keralavision Network Plans

40M 2000G -- 499 ₹
50M 2000G -- 550 ₹
50M 5000G -- 570 ₹
60M 4000G -- 600 ₹
80M 4000G -- 699 ₹
100M 4000G -- 839 ₹
125M 4000G -- 949 ₹
200M 4500G -- 1199 ₹
250M 4500G -- 1499 ₹
300M 5000G -- 1799 ₹
350M 7500G -- 2249 ₹
400M 8000G -- 2399 ₹
500M 8000G -- 2999 ₹
1000M 8000G -- 4100 ₹
1000M 15000G -- 8800 ₹

Amounts are applicable per month


You can help with: answering questions, giving advice, writing messages, solving math, translating text, explaining things simply.`;

// ── Get AI reply ──────────────────────────────
async function getAIReply(message, userId) {
  try {
    if (!userHistory[userId]) userHistory[userId] = [];

    userHistory[userId].push({ role: 'user', content: message });

    if (userHistory[userId].length > 10)
      userHistory[userId] = userHistory[userId].slice(-10);

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 500,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...userHistory[userId],
      ],
    });

    const reply = response.choices[0].message.content;

    userHistory[userId].push({ role: 'assistant', content: reply });

    return reply;
  } catch (error) {
    console.error('Groq API error:', error.message);
    return 'Sorry, I had a technical issue. Please try again!';
  }
}

// ── WhatsApp Client Setup ─────────────────────
const client = new Client({
  authStrategy: new LocalAuth({ clientId: "ai-bot" }),
  puppeteer: {
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/chromium",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu"
    ]
  }
});

// ── QR Code (scan this to login) ─────────────
client.on('qr', (qr) => {
  console.log('\n📱 SCAN THIS QR CODE WITH YOUR WHATSAPP:\n');
  qrcode.generate(qr, { small: true });
  console.log('\n(Open WhatsApp → Settings → Linked Devices → Link a Device)\n');
});

// ── Bot is ready ──────────────────────────────
client.on('ready', () => {
  console.log('✅ WhatsApp AI Bot is LIVE and ready!');
  console.log('💬 Send any message to your WhatsApp to test it\n');
});

// ── Handle incoming messages ──────────────────
client.on('message', async (msg) => {
  // Ignore your own messages
  if (msg.fromMe) return;

  if (msg.from === 'status@broadcast') return;

  // Ignore group messages (remove this line to enable groups)
  if (msg.from.endsWith('@g.us')) return;

  const userId = msg.from;
  const text = msg.body.trim();

  console.log(`📩 [${new Date().toLocaleTimeString()}] ${userId}: ${text}`);

  // ── Special Commands ──────────────────────
  if (text.toLowerCase() === '!help') {
    await msg.reply(
      `🤖 *AI WhatsApp Bot — Help Menu*\n\n` +
      `Just type anything and I'll reply intelligently!\n\n` +
      `*Commands:*\n` +
      `• !help — Show this menu\n` +
      `• !reset — Clear our chat history\n` +
      `• !about — About this bot\n\n` +
      `*I can help you with:*\n` +
      `• Answer any question 🧠\n` +
      `• Write messages & emails ✍️\n` +
      `• Translate text 🌍\n` +
      `• Solve math problems 🔢\n` +
      `• Give advice & ideas 💡`
    );
    return;
  }

  if (text.toLowerCase() === '!reset') {
    userHistory[userId] = [];
    await msg.reply('🔄 Chat history cleared! Starting fresh. How can I help you?');
    return;
  }

  if (text.toLowerCase() === '!about') {
    await msg.reply(
      `🤖 *About This Bot*\n\n` +
      `Built with:\n` +
      `• Claude AI by Anthropic 🧠\n` +
      `• whatsapp-web.js 📱\n` +
      `• Node.js ⚙️\n` +
      `• Hosted on Render.com ☁️\n\n` +
      `Made with ❤️`
    );
    return;
  }

  // ── Show "typing..." indicator ────────────
  const chat = await msg.getChat();
  await chat.sendStateTyping();

  // ── Get and send AI reply ─────────────────
  const reply = await getAIReply(text, userId);
  await msg.reply(reply);

  console.log(`🤖 Bot: ${reply.substring(0, 80)}...`);
});

// ── Error handling ────────────────────────────
client.on('auth_failure', () => {
  console.error('❌ WhatsApp authentication failed. Delete .wwebjs_auth folder and restart.');
});

client.on('disconnected', (reason) => {
  console.warn('⚠️  Bot disconnected:', reason);
  console.log('🔄 Attempting to reconnect...');
  client.initialize();
});

// ── Start the bot ─────────────────────────────
console.log('🚀 Starting WhatsApp AI Bot...');
client.initialize();
