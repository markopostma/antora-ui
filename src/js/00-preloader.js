(function() {
  'use_strict';

  console.log('PRELOADER INIT');

  window.addEventListener(
    'load',
    () => {
      console.log('WINDOW.load');
    },
    { passive: true }
  );
})();
