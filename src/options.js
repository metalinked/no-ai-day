import { DEFAULT_DAYS } from './sites.js';

for (const el of document.querySelectorAll('[data-i18n]')) {
  el.textContent = chrome.i18n.getMessage(el.dataset.i18n);
}

const form = document.getElementById('days');
const saved = document.getElementById('saved');
const dayName = new Intl.DateTimeFormat(chrome.i18n.getUILanguage(), { weekday: 'long' });
const { days = DEFAULT_DAYS } = await chrome.storage.sync.get('days');

// Monday first. 2024-01-01 was a Monday.
for (const day of [1, 2, 3, 4, 5, 6, 0]) {
  const label = document.createElement('label');
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.value = day;
  input.checked = days.includes(day);
  const offset = day === 0 ? 6 : day - 1;
  label.append(input, ' ', dayName.format(new Date(2024, 0, 1 + offset)));
  form.append(label);
}

form.addEventListener('change', async () => {
  const selected = [...form.querySelectorAll('input:checked')].map((i) => Number(i.value));
  await chrome.storage.sync.set({ days: selected });
  saved.textContent = chrome.i18n.getMessage('optionsSaved');
  setTimeout(() => (saved.textContent = ''), 1500);
});
