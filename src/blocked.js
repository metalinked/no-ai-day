const MESSAGE_COUNT = 5;

document.documentElement.lang = chrome.i18n.getUILanguage();

for (const el of document.querySelectorAll('[data-i18n]')) {
  el.textContent = chrome.i18n.getMessage(el.dataset.i18n);
}

const n = 1 + Math.floor(Math.random() * MESSAGE_COUNT);
document.getElementById('message').textContent = chrome.i18n.getMessage(`message${n}`);
