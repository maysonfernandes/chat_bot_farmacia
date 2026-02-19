async function delayComDigitando(sock, jid, ms = 3000) {
  await sock.sendPresenceUpdate('composing', jid);
  await new Promise(resolve => setTimeout(resolve, ms));
  await sock.sendPresenceUpdate('paused', jid);
}

module.exports = { delayComDigitando };
