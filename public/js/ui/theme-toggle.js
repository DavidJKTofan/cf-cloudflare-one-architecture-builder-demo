"use strict";

window.App = window.App || {};

/**
 * Theme toggle — dark / light mode switcher.
 *
 * Behaviour:
 *   1. On first visit, honours the OS `prefers-color-scheme` preference
 *      (no `data-theme` attribute is set, so the CSS @media query applies).
 *   2. When the user explicitly clicks the toggle, their choice is saved
 *      to localStorage and the `data-theme` attribute is set on <html>.
 *   3. The stored preference persists across sessions.
 *   4. The `color-scheme` meta tag and <html> attribute are kept in sync
 *      so native form controls, scrollbars, etc. adapt correctly.
 */

/* --- Constants --- */
const THEME_STORAGE_KEY = "cf-arch-theme";

/* --- Private helpers --- */

/**
 * Resolve the effective theme, considering stored preference and OS setting.
 * @returns {"dark"|"light"}
 */
function getEffectiveTheme() {
	let stored = null;
	try {
		stored = localStorage.getItem(THEME_STORAGE_KEY);
	} catch (_) {
		/* localStorage unavailable — fall through to OS preference */
	}
	if (stored === "dark" || stored === "light") return stored;
	return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

/**
 * Apply a theme to the document.
 * @param {"dark"|"light"} theme
 */
function applyTheme(theme) {
	const root = document.documentElement;
	root.setAttribute("data-theme", theme);

	/* Keep the <meta name="color-scheme"> tag in sync */
	const meta = document.querySelector('meta[name="color-scheme"]');
	if (meta) {
		meta.setAttribute("content", theme);
	}

	/* Keep the <meta name="theme-color"> tag in sync for mobile address bars */
	const themeMeta = document.querySelector('meta[name="theme-color"]');
	if (themeMeta) {
		themeMeta.setAttribute("content", theme === "dark" ? "#0C0F14" : "#FFFFFF");
	}
}

/* --- Public API --- */

/**
 * Initialise the theme system. Call once on DOMContentLoaded.
 * - Restores saved preference (or respects OS preference).
 * - Wires the toggle button click handler.
 * - Listens for OS preference changes when no explicit choice is stored.
 */
window.App.setupThemeToggle = function setupThemeToggle() {
	let stored = null;
	try {
		stored = localStorage.getItem(THEME_STORAGE_KEY);
	} catch (_) {
		/* ignore */
	}

	/* Only set data-theme if the user previously made an explicit choice.
	   Otherwise leave the attribute off so the CSS @media query handles it. */
	if (stored === "dark" || stored === "light") {
		applyTheme(stored);
	}

	const btn = document.getElementById("btnThemeToggle");
	if (!btn) return;

	btn.addEventListener("click", () => {
		const current = getEffectiveTheme();
		const next = current === "dark" ? "light" : "dark";
		try {
			localStorage.setItem(THEME_STORAGE_KEY, next);
		} catch (_) {
			/* ignore */
		}
		applyTheme(next);
	});

	/* When the OS preference changes and the user hasn't made an explicit
	   choice, update the toggle icon state by toggling data-theme. */
	try {
		const mq = window.matchMedia("(prefers-color-scheme: light)");
		mq.addEventListener("change", () => {
			let saved = null;
			try {
				saved = localStorage.getItem(THEME_STORAGE_KEY);
			} catch (_) {
				/* ignore */
			}
			if (!saved) {
				/* Remove data-theme so CSS @media takes over */
				document.documentElement.removeAttribute("data-theme");

				const meta = document.querySelector('meta[name="color-scheme"]');
				if (meta) {
					meta.setAttribute("content", "dark light");
				}
			}
		});
	} catch (_) {
		/* matchMedia.addEventListener not supported — degrade gracefully */
	}
};
