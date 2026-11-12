const MESSAGE_COUNT = 5;

document.documentElement.lang = chrome.i18n.getUILanguage();

for (const el of document.querySelectorAll('[data-i18n]')) {
  el.textContent = chrome.i18n.getMessage(el.dataset.i18n);
}

// The name on one line, with the word (IA / AI) in a tag. It is in "DIA" too, so use the last one.
const name = chrome.i18n.getMessage('extName');
const word = chrome.i18n.getMessage('word');
const h1 = document.getElementById('name');
const at = name.toUpperCase().lastIndexOf(word.toUpperCase());
if (at < 0) {
  h1.textContent = name;
} else {
  const tag = document.createElement('span');
  tag.className = 'tag';
  tag.textContent = name.slice(at, at + word.length);
  h1.append(name.slice(0, at), tag, name.slice(at + word.length));
}

// Sets the font size so the name fills the width, up to 980px (the model is 1280px wide).
function fit() {
  const width = Math.min(980, window.innerWidth * 0.9);
  let size = 100;
  for (let i = 0; i < 3; i++) {
    h1.style.fontSize = `${size}px`;
    size *= width / h1.getBoundingClientRect().width;
  }
  h1.style.fontSize = `${size}px`;
}
fit();
window.addEventListener('resize', fit);
document.fonts.ready.then(fit);

const n = 1 + Math.floor(Math.random() * MESSAGE_COUNT);
document.getElementById('message').textContent = chrome.i18n.getMessage(`message${n}`);
