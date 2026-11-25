import { SITES, DEFAULT_DAYS } from './sites.js';

// The user's changes to the list are stored as differences from SITES, so
// sites added in a later version still reach people who edited their list.
export async function getState() {
  const {
    days = DEFAULT_DAYS,
    addedSites = [],
    removedSites = [],
  } = await chrome.storage.sync.get(['days', 'addedSites', 'removedSites']);
  const defaults = SITES.filter((site) => !removedSites.includes(site));
  return {
    days,
    addedSites,
    removedSites,
    sites: [...new Set([...defaults, ...addedSites])],
  };
}

export const originPattern = (site) => `*://*.${site}/*`;

// Turns what the user typed (a domain or a full address) into a domain.
// Returns null if it does not look like one.
export function parseSite(text) {
  const value = text.trim().toLowerCase();
  if (!value) return null;
  let host;
  try {
    host = new URL(value.includes('://') ? value : `https://${value}`).hostname;
  } catch {
    return null;
  }
  host = host.replace(/^www\./, '').replace(/\.$/, '');
  return /^([a-z0-9-]+\.)+([a-z]{2,}|xn--[a-z0-9-]+)$/.test(host) ? host : null;
}
