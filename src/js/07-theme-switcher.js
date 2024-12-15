(function() {
  "use strict";

  let theme = "light";

  if ("matchMedia" in window) {
    theme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener(
      "change",
      ({ matches }) => {
        console.log("(prefers-color-scheme: dark)", ev);
        theme = matches ? "dark" : "light";
        activateSwitch(el, matches);
      },
      { passive: true }
    );

    activateSwitch(
      document.getElementById("switch-theme-checkbox"),
      theme === "dark"
    );
  }

  window.onload = function onload() {
    const el = document.getElementById("switch-theme-checkbox");

    if ("localStorage" in window && window.localStorage.getItem("theme")) {
      const checked = window.localStorage.getItem("theme") === "dark";

      activateSwitch(el, checked);
    } else {
      activateSwitch(el, theme === "dark");
    }
  };

  /**
   * Activate checkbox.
   * @param {HTMLInputElement} control
   * @param {boolean} checked
   * @returns {void}
   */
  function activateSwitch(control, checked) {
    if (!control) return;

    control.checked = checked || false;
    onThemeChange(control);

    control.addEventListener("change", () => onThemeChange(control), {
      passive: true
    });
  }

  /**
   * Save theme to localStorage.
   * @param {'dark' | 'light'} theme
   */
  function saveTheme(theme) {
    if ("localStorage" in window) {
      window.localStorage.setItem("theme", theme);
    }
  }

  /**
   * Handles a theme switch.
   * @param {HTMLElement} control
   */
  function onThemeChange(control) {
    document.documentElement.classList.toggle("dark-theme", control.checked);
    document.documentElement.setAttribute(
      "data-theme",
      control.checked ? "dark" : "light"
    );

    saveTheme(control.checked ? "dark" : "light");

    if (control.checked) {
      control.parentElement.classList.add("active");
    } else {
      control.parentElement.classList.remove("active");
    }
  }
})();
