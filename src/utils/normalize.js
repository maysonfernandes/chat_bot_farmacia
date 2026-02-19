/**
 * 🧹 Normalização básica (anti-erro)
 */

module.exports = (text = '') => {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, '')
        .trim();
};
