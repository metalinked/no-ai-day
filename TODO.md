# TODO

- [ ] Make the list of sites editable from the options.
- [ ] Add a second block screen with messages that are not about programming. Most of the current ones assume the reader is a developer. The new ones should fit people who ask ChatGPT what they would have googled, or something they already know how to do, or something they could ask their mother, a friend or a coworker.
- [ ] Decide whether there should be a way to skip the block in an emergency, and how much effort it should take.
- [ ] Firefox for Android warns that `strict_min_version` 140 is older than 142, the first version that supports `data_collection_permissions` there. Add `"gecko_android": { "strict_min_version": "142.0" }` to `browser_specific_settings` in the next release. The other warning (`service_worker` ignored by Firefox) is expected and stays.
