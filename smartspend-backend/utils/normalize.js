
const normalizeLabel = (value = "") =>
  value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/^./, (c) => c.toUpperCase());

module.exports = { normalizeLabel };
