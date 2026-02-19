const axios = require('axios');

async function analyzeText(text) {
  const { data } = await axios.post('http://127.0.0.1:8000/analyze', { text });
  return data;
}

module.exports = { analyzeText };
