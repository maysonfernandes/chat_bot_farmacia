const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require('@whiskeysockets/baileys');

const controller = require('./bot/controller');


async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth');

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false
  });

  const qrcode = require('qrcode-terminal')

sock.ev.on('connection.update', (update) => {
    const { connection, qr } = update

    if (qr) {
        console.log('📲 Escaneie este QR Code:')
        qrcode.generate(qr, { small: true })
    }
})

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'close') {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

      console.log('Conexão fechada. Reconectar?', shouldReconnect);
      if (shouldReconnect) startBot();
    }

    if (connection === 'open') {
      console.log('✅ WhatsApp conectado com sucesso!');
    }
  });

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    await controller(sock, msg);
  });
}

startBot();
