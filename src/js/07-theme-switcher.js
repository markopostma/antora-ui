(function() {
  "use strict";

  activateSwitch(document.getElementById("switch-theme-checkbox"));

  /**
   * Activate checkbox.
   * @param {HTMLInputElement} control
   * @returns {void}
   */
  function activateSwitch(control) {
    if (!control) return;

    if (window.localStorage && window.localStorage.getItem("theme")) {
      control.checked = window.localStorage.getItem("theme") === "dark";

      onThemeChange.call(control);
    } else {
      control.checked = document.documentElement.classList.contains(
        "dark-theme"
      );
    }

    control.addEventListener("change", onThemeChange.bind(control), {
      passive: true
    });
  }

  /**
   * Save theme to localStorage.
   * @param {'dark' | 'light'} theme
   */
  function saveTheme(theme) {
    window.localStorage && window.localStorage.setItem("theme", theme);
  }

  function onThemeChange() {
    document.documentElement.classList.toggle("dark-theme", this.checked);
    document.documentElement.setAttribute(
      "data-theme",
      this.checked ? "dark" : "light"
    );

    saveTheme(this.checked ? "dark" : "light");

    if (this.checked) {
      this.parentElement.classList.add("active");
    } else {
      this.parentElement.classList.remove("active");
    }
  }
})();
