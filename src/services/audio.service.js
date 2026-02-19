const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function transcreverAudio(filePath) {
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));

  const { data } = await axios.post(
    'http://127.0.0.1:8000/transcribe',
    form,
    { headers: form.getHeaders() }
  );

  return data.text;
}

module.exports = { transcreverAudio };
