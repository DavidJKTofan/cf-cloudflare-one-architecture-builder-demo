/**
 * Sidebar interactions: click-to-place components, connector buttons,
 * and template selection.
 */

"use strict";

window.App = window.App || {};

/* ---------- Click-to-place ---------- */
window.App.setupSidebarClicks = function setupSidebarClicks() {
    const { COMPONENTS, addElement } = window.App;

    document.querySelectorAll(".component-card").forEach(card => {
        card.addEventListener("click", () => {
            const type = card.dataset.type;
            if (!type || !COMPONENTS[type]) return;
            const comp = COMPONENTS[type];
            const canvas = document.getElementById("canvasContainer");
            const rect = canvas.getBoundingClientRect();
            const isUser = comp.category === "users";
            const baseX = isUser ? rect.width * 0.2 : rect.width * 0.78;
            const x = baseX + (Math.random() - 0.5) * rect.width * 0.12;
            const y = rect.height * 0.2 + Math.random() * rect.height * 0.55;
            addElement(type, x, y);
        });
    });
};

/* ---------- Connector buttons ---------- */
window.App.setupConnectorButtons = function setupConnectorButtons() {
    const { state, addConnection } = window.App;

    document.querySelectorAll(".connector-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            if (btn.disabled) return;
            const connector = btn.dataset.connector;
            const elId = state.selectedElementId;
            if (!elId || !connector) return;
            addConnection(elId, connector);
        });
    });
};

/* ---------- Connector state (enable/disable) ---------- */
window.App.renderConnectorStates = function renderConnectorStates() {
    const { state, COMPONENTS } = window.App;
    const el = state.selectedElementId ? state.elements.find(e => e.id === state.selectedElementId) : null;
    const comp = el ? COMPONENTS[el.type] : null;
    document.querySelectorAll(".connector-btn").forEach(btn => {
        const key = btn.dataset.connector;
        btn.disabled = !comp || !comp.compatibleConnectors.includes(key);
    });
};

/* ---------- Templates ---------- */
window.App.setupTemplates = function setupTemplates() {
    const { TEMPLATES } = window.App;

    document.querySelectorAll(".template-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const key = btn.dataset.template;
            if (!key || !TEMPLATES[key]) return;
            window.App.applyTemplate(key);
        });
    });
};

window.App.applyTemplate = function applyTemplate(key) {
    const { TEMPLATES, state, renderAll, checkAchievements, showToast } = window.App;
    const tpl = TEMPLATES[key];
    if (!tpl) return;

    // Full reset
    state.elements = [];
    state.connections = [];
    state.selectedElementId = null;
    state.unlockedAchievements.clear();
    state.idCounter = 0;
    document.getElementById("placedElements").innerHTML = "";
    document.getElementById("connectionsLayer").innerHTML = "";
    document.getElementById("onboarding").classList.add("hidden");

    // Compute layout positions
    const canvas = document.getElementById("canvasContainer");
    const rect = canvas.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    const slotPositions = (side, total) => {
        const positions = [];
        const baseX = side === "left" ? cx * 0.34 : cx * 1.60;
        const startY = cy - ((total - 1) * 100) / 2;
        for (let i = 0; i < total; i++) {
            positions.push({ x: baseX + (Math.random() - 0.5) * 40, y: startY + i * 100 });
        }
        return positions;
    };

    const leftItems = tpl.elements.filter(e => e.side === "left");
    const rightItems = tpl.elements.filter(e => e.side === "right");
    const leftSlots = slotPositions("left", leftItems.length);
    const rightSlots = slotPositions("right", rightItems.length);

    let leftIdx = 0, rightIdx = 0;
    tpl.elements.forEach(item => {
        const id = "el-" + (++state.idCounter);
        const pos = item.side === "left" ? leftSlots[leftIdx++] : rightSlots[rightIdx++];
        state.elements.push({ id, type: item.type, x: pos.x, y: pos.y });
    });

    tpl.connections.forEach(conn => {
        const elId = state.elements[conn.elementIdx]?.id;
        if (!elId) return;
        const connId = "conn-" + (++state.idCounter);
        state.connections.push({ id: connId, elementId: elId, connector: conn.connector });
    });

    renderAll();
    checkAchievements();
    showToast("Loaded: " + tpl.name, "template");
};
