# Dia sense IA (No-AI Day)

A browser extension that blocks ChatGPT, Claude, Gemini, Copilot and other assistants one day a week. On that day, opening any of them shows a poster in the style of the "Día sin IVA" sale posters: "Today is" on top, then "No-AI Day" with the AI in a tilted black tag, and a short line under it.

The name is Catalan for "No-AI Day". It comes from the "Día sin IVA" (VAT-free day) sales that Spanish appliance stores run.

## Why

One day the agent I was using ran out of tokens in the middle of a job and I finished the changes by hand. I had not done that in a while, and I had forgotten git commands I used to type every day. I decided to work without AI one day a week. The extension is there so that day has no temptations.

## Status

Version 0.1.0. This is the base and it has not been tested in depth yet. What is left is in [TODO.md](TODO.md).

## What it does

- On the chosen day (Friday by default) it redirects the sites on the list to a block page.
- You can pick one or more days in the options.
- On that day the icon shows "OFF".
- The texts are in Catalan, Spanish and English, depending on the browser language.

The list of sites is in [src/sites.js](src/sites.js).

It does not block anything outside the browser: assistants in your editor and terminal keep working.

## Install

It is not in the Chrome Web Store or Firefox Add-ons yet.

To try it in Chrome, Edge or Brave:

1. Clone the repository.
2. Open `chrome://extensions` and turn on developer mode.
3. Click "Load unpacked" and choose the project folder.

In Firefox (140 or later), open `about:debugging#/runtime/this-firefox`, click "Load Temporary Add-on" and choose `manifest.json`. The add-on is removed when you close Firefox.

## Privacy

The extension does not collect or send any data. It only stores the days you pick, using the browser's storage.

## Contributing

If a site is missing from the list or you have a better line for the poster, open an issue or a pull request.

## License

MIT. Made by [Metalinked](https://metalinked.net).
