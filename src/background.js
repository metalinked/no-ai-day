import { getState, originPattern } from './state.js';

const RULE_ID = 1;
const ALARM = 'sync';

// Adds or removes the redirect rule depending on today's weekday.
async function sync() {
  const { days, sites } = await getState();
  const active = days.includes(new Date().getDay());
  // A rule with an empty list of domains is not valid.
  const blocking = active && sites.length > 0;
  const rule = {
    id: RULE_ID,
    priority: 1,
    action: { type: 'redirect', redirect: { extensionPath: '/src/blocked.html' } },
    condition: { requestDomains: sites, resourceTypes: ['main_frame'] },
  };
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [RULE_ID],
    addRules: blocking ? [rule] : [],
  });
  await chrome.action.setBadgeBackgroundColor({ color: '#000000' });
  await chrome.action.setBadgeText({ text: active ? 'OFF' : '' });
  if (blocking) await blockOpenTabs(sites);
}

// The redirect rule only applies to new navigations, so tabs that were
// already open when the day started are sent to the poster here.
async function blockOpenTabs(sites) {
  const tabs = await chrome.tabs.query({ url: sites.map(originPattern) });
  const blocked = chrome.runtime.getURL('/src/blocked.html');
  await Promise.all(tabs.map((tab) => chrome.tabs.update(tab.id, { url: blocked }).catch(() => {})));
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
  if (area === 'sync' && (changes.days || changes.addedSites || changes.removedSites)) sync();
});

// A site added on another device needs its permission granted on this one.
chrome.permissions.onAdded.addListener(() => sync());

chrome.action.onClicked.addListener(() => chrome.runtime.openOptionsPage());
