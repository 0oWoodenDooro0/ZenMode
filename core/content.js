window.ZenEngine = {
  siteKey: null,

  init: async function (siteKey) {
    this.siteKey = siteKey;
    document.documentElement.setAttribute('data-zm-site', siteKey);

    await this.applySettings();

    this.setupListeners();
  },

  applySettings: async function () {
    if (!this.siteKey) return;

    const storageKey = `zm_settings_${this.siteKey}`;
    const result = await chrome.storage.local.get(storageKey);
    const settings = result[storageKey] || {};

    Object.keys(settings).forEach(key => {
      this.updateAttribute(key, settings[key]);
    });
  },

  updateAttribute: function (key, value) {
    const attrName = `data-zm-${key}`;
    if (value) {
      document.documentElement.setAttribute(attrName, "true");
    } else {
      document.documentElement.removeAttribute(attrName);
    }
  },

  setupListeners: function () {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === "UPDATE_SETTINGS" && message.settings) {
        Object.keys(message.settings).forEach(key => {
          this.updateAttribute(key, message.settings[key]);
        });
      }
    });

    chrome.storage.onChanged.addListener((changes, namespace) => {
      const storageKey = `zm_settings_${this.siteKey}`;

      if (changes[storageKey]) {
        const newSettings = changes[storageKey].newValue || {};
        Object.keys(newSettings).forEach(key => {
          this.updateAttribute(key, newSettings[key]);
        });

        if (changes[storageKey].oldValue) {
          const oldKeys = Object.keys(changes[storageKey].oldValue);
          const newKeys = Object.keys(newSettings);
          oldKeys.forEach(oldKey => {
            if (!newKeys.includes(oldKey)) {
              this.updateAttribute(oldKey, false);
            }
          });
        }
      }
    });
  }
};
