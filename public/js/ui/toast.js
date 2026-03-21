/**
 * Toast notification system.
 */

"use strict";

window.App = window.App || {};

const TOAST_ICONS = {
    component: "\u{1F4E6}",
    connection: "\u{1F517}",
    achievement: "\u{1F3C6}",
    info: "\u{2139}\uFE0F",
    template: "\u{1F680}"
};

window.App.showToast = function showToast(message, type) {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<span class="toast-icon">${TOAST_ICONS[type] || ""}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
};
