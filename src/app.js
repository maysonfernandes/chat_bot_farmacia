const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const pino = require('pino');
const path = require('path');
const fs = require('fs');
const controller = require('./bot/controller');

let connectionRetries = 0;
const MAX_RETRIES = 5;

async function startBot() {
const botDir = __dirname;
const authInfoPath = path.join(botDir, 'auth_info');
const { state, saveCreds } = await useMultiFileAuthState(authInfoPath);

// fetch latest WhatsApp version
const { version: waVersion } = await fetchLatestBaileysVersion();

const sock = makeWASocket({
    auth: state,
    version: waVersion,
    browser: ['Chrome', 'Windows', '110.0.5481.177'], // simulate real browser
    logger: pino({ level: 'info' }),
    connectTimeoutMs: 60_000,
    patchMessageBeforeSending: (msg) => msg,
});

// persist credentials
sock.ev.on('creds.update', saveCreds);

// handle connection updates
sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;
    const hasAuthInfo = fs.existsSync(authInfoPath) && fs.readdirSync(authInfoPath).length > 0;
    const qrcode = require('qrcode-terminal');

    if (qr && !hasAuthInfo) {
        console.log('🆕 QR-Code required, scan to login');
        qrcode.generate(qr, { small: true });
        // display QR in terminal if needed
    }

    if (connection === 'open') {
        console.log('✅ Connected to WhatsApp');
        connectionRetries = 0; // reset retries
    } else if (connection === 'close') {
        console.log('🔴 Connection closed:', lastDisconnect?.error?.message || lastDisconnect?.error);
        connectionRetries++;

        if (connectionRetries >= MAX_RETRIES) {
            console.log(`❌ Max retries reached (${MAX_RETRIES}), restarting in 30s`);
            connectionRetries = 0;
            setTimeout(startBot, 30000);
        } else {
            console.log(`⚠️ Attempt ${connectionRetries}/${MAX_RETRIES}, retrying in 15s...`);
            setTimeout(startBot, 15000);
        }
    } else if (connection === 'connecting') {
        console.log('🟡 Connecting to WhatsApp...');
    }
});

sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    await controller(sock, msg);
  });
}

startBot();