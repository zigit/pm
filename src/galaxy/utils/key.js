export default {
  isModifier,

  H: 72,
  O: 79,
  L: 76,
  B: 66,
  Space: 32,
  '/': 191
};

function isModifier(e) {
  return e.altKey || e.ctrlKey || e.metaKey || e.shiftKey;
}
