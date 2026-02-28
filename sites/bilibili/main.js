(function () {
  function start() {
    if (window.ZenEngine) {
      window.ZenEngine.init('bilibili');
    } else {
      console.error("ZenMode not found!");
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
