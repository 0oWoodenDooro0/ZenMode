const siteConfig = [
  {
    regex: /youtube\.com$/,
    siteKey: "youtube",
    prefix: "yt",
    categories: [
      {
        name: "Home",
        options: [
          { id: "hideTabs", label: "Hide Tabs", default: false },
          { id: "hideAllVideos", label: "Hide All Video", default: false },
          { id: "hideShorts", label: "Hide Shorts", default: false },
          { id: "hideAds", label: "Hide Ads", default: false },
          { id: "videosPerRowAuto", label: "Video Per Row Auto", type: "checkbox", default: false },
          { id: "videosPerRow", label: "Video Per Row", type: "range", min: 3, max: 8, default: 4 },
        ]
      },
      {
        name: "Header",
        options: [
          { id: "hideSidebar", label: "Hide Sidebar", default: false },
          { id: "hideYoutubeLogo", label: "Hide Youtube Logo", default: false },
          { id: "hideSearchBar", label: "Hide Search Bar", default: false },
          { id: "hideMircophoneSearchIcon", label: "Hide Mircophone Search Icon", default: false },
          { id: "hideCreateIcon", label: "Hide Create Icon", default: false },
          { id: "hideNotificationsIcon", label: "Hide Notifications Icon", default: false },
          { id: "hideAccountIcon", label: "Hide Account Icon", default: false }
        ]
      },
      {
        name: "Sidebar",
        options: [
          { id: "hideHomePanel", label: "Hide Home Panel", default: false },
          { id: "hideHomeButton", label: "Hide Home Button", default: false },
          { id: "hideShortsButton", label: "Hide Shorts Button", default: false },
          { id: "hideSubscriptionsPanel", label: "Hide Subscriptions Panel", default: false },
          { id: "hideYouPanel", label: "Hide You Panel", default: false },
          { id: "hideYouButton", label: "Hide You Button", default: false },
          { id: "hideHistoryButton", label: "Hide History Button", default: false },
          { id: "hidePlaylistsButton", label: "Hide Playlists Button", default: false },
          { id: "hideWatchLaterButton", label: "Hide Watch Later Button", default: false },
          { id: "hideLikedVideosButton", label: "Hide Liked Videos Button", default: false },
          { id: "hideYourVideosButton", label: "Hide Your Videos Button", default: false },
          { id: "hideDownloadsButton", label: "Hide Downloads Button", default: false },
          { id: "hideClipsButton", label: "Hide Clips Button", default: false },
          { id: "hideExplorePanel", label: "Hide Explore Panel", default: false },
          { id: "hideYoutubePanel", label: "Hide Youtube Panel", default: false },
          { id: "hideSettingsPanel", label: "Hide Settings Panel", default: false },
          { id: "hideFooter", label: "Hide Footer", default: false },
        ]
      },
      {
        name: "Search",
        options: [
          { id: "hideShorts", label: "Hide Shorts", default: false },
          { id: "hidePeopleAlsoSearchFor", label: "Hide People Also Search For", default: false },
        ]
      },
      {
        name: "Video",
        options: [
          { id: "hideTitle", label: "Hide Title", default: false },
          { id: "hideSubscribersCount", label: "Hide Subscribers Count", default: false },
          { id: "hideJoinButton", label: "Hide Join Button", default: false },
          { id: "hideSubscribeButton", label: "Hide Subscribe Button", default: false },
          { id: "hideSubscribedButton", label: "Hide Subscribed Button", default: false },
          { id: "hideLikesDislikesButton", label: "Hide Likes/Dislikes Button", default: false },
          { id: "hideShareButton", label: "Hide Share Button", default: false },
          { id: "hideAskButton", label: "Hide Ask Button", default: false },
          { id: "hideSaveButton", label: "Hide Save Button", default: false },
          { id: "hideThanksButton", label: "Hide Thanks Button", default: false },
          { id: "hideDownloadButton", label: "Hide Download Button", default: false },
          { id: "hideClipButton", label: "Hide Clip Button", default: false },
          { id: "hideReportButton", label: "Hide Report Button", default: false },
          { id: "hideCollaspedButton", label: "Hide Collasped Button", default: false },
          { id: "hideDescription", label: "Hide Descritption", default: false },
          { id: "hideLivePremiumChat", label: "Hide Live/Premium Chat", default: false },
          { id: "hideGameAndCategory", label: "Hide Game And Category", default: false },
          { id: "hideComments", label: "Hide Comments", default: false },
          { id: "hideCommentsAvatars", label: "Hide Comments Avatars", default: false },
          { id: "hideCommentsReplies", label: "Hide Comments Replies", default: false },
          { id: "hideAdPanel", label: "Hide Ad Panel", default: false },
          { id: "hideSuggestedVideosTabs", label: "Hide Suggested Videos Tabs", default: false },
          { id: "hideSuggestedShorts", label: "Hide Suggested Shorts", default: false },
          { id: "hideSuggestedVideos", label: "Hide Suggested Videos", default: false },
        ]
      },
      {
        name: "Subscriptions",
        options: [
          { id: "hideShorts", label: "Hide Shorts", default: false },
        ]
      },
    ]
  }
];

document.addEventListener('DOMContentLoaded', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab || !tab.url) return;

  const url = new URL(tab.url);
  const hostname = url.hostname;

  const siteNameEl = document.getElementById('site-name');
  const container = document.getElementById('options-container');
  const footer = document.querySelector('footer');
  const config = siteConfig.find(config => config.regex.test(hostname));

  if (config) {
    siteNameEl.textContent = config.siteKey;
    footer.style.display = 'block';
    renderOptions(config.siteKey, config, container);
  } else {
    siteNameEl.textContent = "Unsupported Site";
    container.innerHTML = '<div class="empty-state">ZenMode is not available for this site yet.</div>';
    footer.style.display = 'none';
  }

  document.getElementById('reset-btn').addEventListener('click', () => {
    if (config) {
      resetSettings(config.siteKey, config);
    }
  });
});

async function renderOptions(siteKey, config, container) {
  container.innerHTML = '';

  const storageKey = `zm_settings_${siteKey}`;
  const result = await chrome.storage.local.get(storageKey);
  const currentSettings = result[storageKey] || {};

  config.categories.forEach(category => {
    const section = document.createElement('div');
    section.className = 'category-section';

    const header = document.createElement('div');
    header.className = 'category-header';

    const titleSpan = document.createElement('span');
    titleSpan.textContent = category.name;

    const arrowSpan = document.createElement('span');
    arrowSpan.className = 'arrow';
    arrowSpan.textContent = '▼';

    header.appendChild(titleSpan);
    header.appendChild(arrowSpan);

    const optionsGroup = document.createElement('div');
    optionsGroup.className = 'options-group';

    header.addEventListener('click', () => {
      const isHidden = getComputedStyle(optionsGroup).display === 'none';
      if (isHidden) {
        optionsGroup.style.display = 'block';
        header.classList.add('expanded');
      } else {
        optionsGroup.style.display = 'none';
        header.classList.remove('expanded');
      }
    });

    category.options.forEach(opt => {
      const fullId = `${config.prefix}_${category.name.toLowerCase()}_${opt.id}`;
      const inputType = opt.type || 'checkbox';

      const itemDiv = document.createElement('div');
      itemDiv.className = 'option-item';

      const labelSpan = document.createElement('span');
      labelSpan.className = 'option-label';
      labelSpan.textContent = opt.label;

      let inputControl;

      if (inputType === 'checkbox') {
        const labelSwitch = document.createElement('label');
        labelSwitch.className = 'switch';

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = fullId;

        if (currentSettings.hasOwnProperty(fullId)) {
          input.checked = currentSettings[fullId];
        } else {
          input.checked = opt.default;
        }

        input.addEventListener('change', (e) => {
          saveSetting(siteKey, fullId, e.target.checked);
          updateUiState(siteKey, config);
        });

        const slider = document.createElement('span');
        slider.className = 'slider';

        labelSwitch.appendChild(input);
        labelSwitch.appendChild(slider);
        inputControl = labelSwitch;

      } else if (inputType === 'range') {
        const rangeContainer = document.createElement('div');
        rangeContainer.style.display = 'flex';
        rangeContainer.style.alignItems = 'center';
        rangeContainer.style.gap = '8px';

        const input = document.createElement('input');
        input.type = 'range';
        input.id = fullId;
        input.min = opt.min;
        input.max = opt.max;
        input.style.width = '100px';

        if (currentSettings.hasOwnProperty(fullId)) {
          input.value = currentSettings[fullId];
        } else {
          input.value = opt.default;
        }

        const valueDisplay = document.createElement('span');
        valueDisplay.textContent = input.value;
        valueDisplay.style.fontSize = '12px';
        valueDisplay.style.color = '#94a3b8';
        valueDisplay.style.minWidth = '12px';

        input.addEventListener('input', (e) => {
          valueDisplay.textContent = e.target.value;
          saveSetting(siteKey, fullId, e.target.value);
        });

        rangeContainer.appendChild(valueDisplay);
        rangeContainer.appendChild(input);
        inputControl = rangeContainer;
      }

      itemDiv.appendChild(labelSpan);
      itemDiv.appendChild(inputControl);

      optionsGroup.appendChild(itemDiv);
    });

    section.appendChild(header);
    section.appendChild(optionsGroup);
    container.appendChild(section);
  });

  updateUiState(siteKey, config);
}

function updateUiState(siteKey, config) {
  const autoCheckboxId = `${config.prefix}_home_videosPerRowAuto`;
  const sliderId = `${config.prefix}_home_videosPerRow`;

  const autoCheckbox = document.getElementById(autoCheckboxId);
  const sliderInput = document.getElementById(sliderId);

  if (autoCheckbox && sliderInput) {
    if (autoCheckbox.checked) {
      sliderInput.disabled = true;
      sliderInput.style.opacity = '0.5';
    } else {
      sliderInput.disabled = false;
      sliderInput.style.opacity = '1';
    }
  }
}

async function saveSetting(siteKey, fullId, value) {
  const storageKey = `zm_settings_${siteKey}`;
  const result = await chrome.storage.local.get(storageKey);
  let settings = result[storageKey] || {};

  settings[fullId] = value;

  await chrome.storage.local.set({ [storageKey]: settings });

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      chrome.tabs.sendMessage(tab.id, {
        type: "UPDATE_SETTINGS",
        settings: settings
      });
    }
  } catch (err) {
  }
}

async function resetSettings(siteKey, config) {
  const storageKey = `zm_settings_${siteKey}`;
  const defaultSettings = {};

  config.categories.forEach(cat => {
    cat.options.forEach(opt => {
      const fullId = `${config.prefix}_${cat.name.toLowerCase()}_${opt.id}`;
      defaultSettings[fullId] = opt.default;
    });
  });

  await chrome.storage.local.set({ [storageKey]: defaultSettings });

  const container = document.getElementById('options-container');
  await renderOptions(siteKey, config, container);

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      chrome.tabs.sendMessage(tab.id, {
        type: "UPDATE_SETTINGS",
        settings: defaultSettings
      });
    }
  } catch (err) {
  }
}
