/**
 * Onboarding overlay — dismissed on "Start Building" click.
 */

"use strict";

window.App = window.App || {};

window.App.setupOnboarding = function setupOnboarding() {
    const overlay = document.getElementById("onboarding");
    const btn = document.getElementById("btnStart");
    btn.addEventListener("click", () => {
        overlay.classList.add("hidden");
    });
};
