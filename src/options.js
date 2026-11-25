import { SITES } from './sites.js';
import { getState, originPattern, parseSite } from './state.js';

const t = (key) => chrome.i18n.getMessage(key);

for (const el of document.querySelectorAll('[data-i18n]')) {
  el.textContent = t(el.dataset.i18n);
}
for (const el of document.querySelectorAll('[data-i18n-label]')) {
  el.setAttribute('aria-label', t(el.dataset.i18nLabel));
}

const daysForm = document.getElementById('days');
const list = document.getElementById('sites');
const addForm = document.getElementById('add');
const input = document.getElementById('site');
const saved = document.getElementById('saved');
// Some browsers report tags that Intl rejects, such as "ca-ES@valencia".
const language = chrome.i18n.getUILanguage().split('@')[0];
const dayName = new Intl.DateTimeFormat(language, { weekday: 'long' });

let timer;
function notify(key) {
  saved.textContent = t(key);
  clearTimeout(timer);
  timer = setTimeout(() => (saved.textContent = ''), 3000);
}

const { days } = await getState();

// Monday first. 2024-01-01 was a Monday.
for (const day of [1, 2, 3, 4, 5, 6, 0]) {
  const label = document.createElement('label');
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.value = day;
  box.checked = days.includes(day);
  const offset = day === 0 ? 6 : day - 1;
  label.append(box, ' ', dayName.format(new Date(2024, 0, 1 + offset)));
  daysForm.append(label);
}

daysForm.addEventListener('change', async () => {
  const selected = [...daysForm.querySelectorAll('input:checked')].map((i) => Number(i.value));
  await chrome.storage.sync.set({ days: selected });
  notify('optionsSaved');
});

function button(text, onClick) {
  const el = document.createElement('button');
  el.type = 'button';
  el.textContent = text;
  el.addEventListener('click', onClick);
  return el;
}

async function renderSites() {
  const { sites } = await getState();
  // The default sites have their permission in the manifest. Only the user's
  // own sites can lack it, for instance when they were added on another device.
  const missing = await Promise.all(
    sites.map(
      async (site) =>
        !SITES.includes(site) &&
        !(await chrome.permissions.contains({ origins: [originPattern(site)] })),
    ),
  );
  list.replaceChildren(
    ...sites.map((site, i) => {
      const item = document.createElement('li');
      const name = document.createElement('span');
      name.textContent = site;
      item.append(name);
      if (missing[i]) {
        item.append(
          button(t('optionsGrant'), async () => {
            await chrome.permissions.request({ origins: [originPattern(site)] });
            renderSites();
          }),
        );
      }
      const remove = button('×', () => removeSite(site));
      remove.title = t('optionsRemove');
      remove.setAttribute('aria-label', `${t('optionsRemove')}: ${site}`);
      item.append(remove);
      return item;
    }),
  );
}

async function removeSite(site) {
  const { addedSites, removedSites } = await getState();
  if (SITES.includes(site)) {
    await chrome.storage.sync.set({ removedSites: [...removedSites, site] });
  } else {
    await chrome.storage.sync.set({ addedSites: addedSites.filter((s) => s !== site) });
    // Fails for domains covered by the manifest, which cannot be given back.
    await chrome.permissions.remove({ origins: [originPattern(site)] }).catch(() => {});
  }
  notify('optionsSaved');
}

addForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const site = parseSite(input.value);
  if (!site) return notify('optionsInvalid');
  const isDefault = SITES.includes(site);
  // Firefox only shows the prompt if nothing is awaited before this call.
  if (!isDefault && !(await chrome.permissions.request({ origins: [originPattern(site)] }))) {
    return notify('optionsDenied');
  }
  const { addedSites, removedSites } = await getState();
  await chrome.storage.sync.set(
    isDefault
      ? { removedSites: removedSites.filter((s) => s !== site) }
      : { addedSites: [...new Set([...addedSites, site])] },
  );
  input.value = '';
  notify('optionsSaved');
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.addedSites || changes.removedSites) renderSites();
});
chrome.permissions.onAdded.addListener(renderSites);

renderSites();
