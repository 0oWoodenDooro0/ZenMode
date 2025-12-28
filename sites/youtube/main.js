(function () {
  function start() {
    if (window.ZenEngine) {
      window.ZenEngine.init('youtube');
    } else {
      console.error("ZenMode not found!");
    }

    GridFixer.init();
  }

  const GridFixer = {
    updateTimeout: null,

    init() {
      const target = document.querySelector('ytd-app');

      const observer = new MutationObserver((mutations) => {
        let shouldUpdate = false;
        for (const m of mutations) {
          if (m.addedNodes.length > 0) {
            shouldUpdate = true;
            break;
          }
        }
        if (shouldUpdate) this.scheduleUpdate();
      });

      observer.observe(target, { childList: true, subtree: true });

      window.addEventListener('resize', () => this.scheduleUpdate());

      const attrObserver = new MutationObserver((mutations) => {
        for (const m of mutations) {
          if (m.attributeName && m.attributeName.startsWith('data-zm-yt_home_videosPerRow')) {
            this.scheduleUpdate();
          }
        }
      });
      attrObserver.observe(document.documentElement, { attributes: true });

      setTimeout(() => this.update(), 500);
      setTimeout(() => this.update(), 1500);
    },

    scheduleUpdate() {
      if (this.updateTimeout) clearTimeout(this.updateTimeout);
      this.updateTimeout = setTimeout(() => this.update(), 50);
    },

    getItemsPerRow() {
      const grid = document.querySelector('ytd-rich-grid-renderer');
      if (!grid) return 5;

      const style = getComputedStyle(grid);
      const val = style.getPropertyValue('--ytd-rich-grid-items-per-row').trim();

      return val ? parseInt(val, 10) : 5;
    },

    update() {
      const grid = document.querySelector('ytd-rich-grid-renderer');

      const n = this.getItemsPerRow();

      const allItems = Array.from(grid.querySelectorAll('ytd-rich-item-renderer'));

      const mainItems = allItems.filter(item => !item.closest('ytd-rich-section-renderer'));

      mainItems.forEach((item, index) => {
        if (index % n === 0) {
          item.setAttribute('is-in-first-column', '');
        } else {
          item.removeAttribute('is-in-first-column');
        }
      });
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

})();
