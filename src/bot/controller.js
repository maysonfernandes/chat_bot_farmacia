const flows = require('./flows');
const rateLimit = require('../services/rateLimit.service');
const { state } = require('../services/cache.service');
const { analyzeText } = require('../services/nlp.service');
const { transcreverAudio } = require('../services/audio.service');
const { isFarmaciaAberta, isPlantao } = require('../services/horario.service');
const { delayComDigitando } = require('../services/typing.service');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');
const formatter = require('./formatter');


module.exports = async (sock, msg) => {
  try {
    const jid = msg.key.remoteJid;

    // 🚫 Bloqueios
    if (
      jid.endsWith('@g.us') ||
      jid === 'status@broadcast' ||
      msg.key.fromMe
    ) return;

    let text = null;

    /**
     * 🧠 Texto normal
     */
    if (msg.message?.conversation || msg.message?.extendedTextMessage?.text) {
      text =
        msg.message.conversation ||
        msg.message.extendedTextMessage.text;
    }

    /**
     * 🎧 Áudio
     */
    if (msg.message?.audioMessage) {
  const stream = await downloadContentFromMessage(
    msg.message.audioMessage,
    'audio'
  );

  let buffer = Buffer.from([]);
  for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk]);
  }

  const tmpDir = path.resolve('./tmp');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

  const filePath = path.join(tmpDir, `${Date.now()}.ogg`);
  fs.writeFileSync(filePath, buffer);

  await sock.sendMessage(jid, { text: '🎧 Entendi seu áudio, processando...' });

  text = await transcreverAudio(filePath);
  console.log('🎧 Áudio transcrito:', text);
  fs.unlink(filePath, () => {});
}


    /**
     * ⏱ Rate limit
     */
    if (!rateLimit(jid)) {
      return sock.sendMessage(jid, {
        text: '⚠️ Muitas mensagens. Aguarde um momento.'
      });
    }

    /**
     * 🕘 Horário de funcionamento
     */
    if (!isFarmaciaAberta(isPlantao)) {
      return sock.sendMessage(jid, {
        text: formatter.farmaciaFechada()
      });
    }

    /**
     * 🧠 NLP (não pode quebrar o bot)
     */
    let nlp = null;
    try {
      nlp = await analyzeText(text);
    } catch (err) {
      console.error('Erro NLP:', err.message);
    }

    /**
     * 🗃 Estado do usuário
     */
    const lastState = state.get(jid);

    /**
     * 🔁 Fluxo de negócio
     */
    const result = await flows.handle({
      from: jid,
      body: text,
      lastState,
      nlp
    });

    if (!result?.text) return;

    /**
     * 🧍‍♂️ Atualiza estado
     */
    if (result.nextState) state.set(jid, result.nextState);
    else state.clear(jid);

    /**
     * ⌛ Simula digitação + delay
     */
    await delayComDigitando(sock, jid, 3000);

    /**
     * 📤 Resposta final
     */
    await sock.sendMessage(jid, { text: result.text });

  } catch (err) {
    console.error('🔥 Erro no controller:', err);
  }
};
