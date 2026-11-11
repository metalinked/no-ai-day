import { SITES, DEFAULT_DAYS } from './sites.js';

const RULE_ID = 1;
const ALARM = 'sync';

async function isNoAiDay() {
  const { days = DEFAULT_DAYS } = await chrome.storage.sync.get('days');
  return days.includes(new Date().getDay());
}

// Adds or removes the redirect rule depending on today's weekday.
async function sync() {
  const active = await isNoAiDay();
  const rule = {
    id: RULE_ID,
    priority: 1,
    action: { type: 'redirect', redirect: { extensionPath: '/src/blocked.html' } },
    condition: { requestDomains: SITES, resourceTypes: ['main_frame'] },
  };
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [RULE_ID],
    addRules: active ? [rule] : [],
  });
  await chrome.action.setBadgeBackgroundColor({ color: '#000000' });
  await chrome.action.setBadgeText({ text: active ? 'OFF' : '' });
}

function scheduleAlarm() {
  const midnight = new Date();
  midnight.setHours(24, 0, 5, 0);
  chrome.alarms.create(ALARM, { when: midnight.getTime(), periodInMinutes: 60 });
}

chrome.runtime.onInstalled.addListener(() => {
  scheduleAlarm();
  sync();
});

chrome.runtime.onStartup.addListener(() => {
  scheduleAlarm();
  sync();
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM) sync();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.days) sync();
});

chrome.action.onClicked.addListener(() => chrome.runtime.openOptionsPage());
