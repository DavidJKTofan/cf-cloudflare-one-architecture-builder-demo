/**
 * Cloudflare One Architecture Builder — Application entry point.
 *
 * This file is a thin orchestrator that wires together all modules.
 * All logic lives in the modular files under js/data/, js/engine/,
 * js/ui/, and js/presets/.
 *
 * Load order (defined in index.html):
 *   1. data/*      — COMPONENTS, CONNECTORS, TEMPLATES, ACHIEVEMENTS
 *   2. engine/*    — state, connections, progress
 *   3. ui/*        — toast, drag-drop, sidebar, detail-panel, canvas, onboarding
 *   4. presets/*   — full-sase
 *   5. app.js      — this file (init)
 */

"use strict";

window.App = window.App || {};

/* ---------- renderAll — master render function ---------- */
window.App.renderAll = function renderAll() {
    window.App.renderPlacedElements();
    window.App.renderConnections();
    window.App.renderDetailPanel();
    window.App.renderConnectorStates();
    window.App.renderDropZones();
    window.App.updateProgress();
};

/* ---------- Reset button ---------- */
function setupResetButton() {
    document.getElementById("btnReset").addEventListener("click", () => {
        window.App.resetState();
    });
}

/* ---------- Click-outside deselect ---------- */
function setupCanvasDeselect() {
    document.addEventListener("click", (e) => {
        const canvas = document.getElementById("canvasContainer");
        if (!canvas.contains(e.target)) return;
        if (e.target.closest(".placed-element") || e.target.closest(".cf-network")) return;
        window.App.state.selectedElementId = null;
        window.App.renderAll();
    });
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
    const A = window.App;
    A.setupDragAndDrop();
    A.setupSidebarClicks();
    A.setupConnectorButtons();
    setupResetButton();
    A.setupFullSase();
    A.setupOnboarding();
    A.setupTemplates();
    setupCanvasDeselect();
    A.renderAll();
});
