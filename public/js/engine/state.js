/**
 * Application state — single source of truth for all placed elements,
 * connections, selection, achievements, and ID counter.
 *
 * Also contains element/connection mutation helpers and a full reset function.
 */

"use strict";

window.App = window.App || {};

/* ---------- State object ---------- */
window.App.state = {
    elements: [],          // { id, type, x, y }
    connections: [],       // { id, elementId, connector }
    selectedElementId: null,
    unlockedAchievements: new Set(),
    idCounter: 0,
};

/* ---------- Mutations ---------- */

window.App.addElement = function addElement(type, x, y) {
    const { state, COMPONENTS, renderAll, checkAchievements, showToast } = window.App;
    const id = "el-" + (++state.idCounter);
    state.elements.push({ id, type, x, y });
    state.selectedElementId = id;
    renderAll();
    checkAchievements();
    showToast("Placed " + COMPONENTS[type].label, "component");
};

window.App.removeElement = function removeElement(id) {
    const { state, COMPONENTS, renderAll, showToast } = window.App;
    const el = state.elements.find(e => e.id === id);
    const label = el ? COMPONENTS[el.type]?.label : "";
    state.elements = state.elements.filter(e => e.id !== id);
    state.connections = state.connections.filter(c => c.elementId !== id);
    if (state.selectedElementId === id) state.selectedElementId = null;
    renderAll();
    if (label) showToast("Removed " + label, "info");
};

window.App.addConnection = function addConnection(elementId, connector) {
    const { state, CONNECTORS, renderAll, checkAchievements, showToast } = window.App;
    if (state.connections.some(c => c.elementId === elementId && c.connector === connector)) {
        showToast("Already connected", "info");
        return;
    }
    const connId = "conn-" + (++state.idCounter);
    state.connections.push({ id: connId, elementId, connector });
    renderAll();
    checkAchievements();
    showToast("Connected via " + CONNECTORS[connector].name, "connection");
};

window.App.removeConnection = function removeConnection(connId) {
    const { state, renderAll } = window.App;
    state.connections = state.connections.filter(c => c.id !== connId);
    renderAll();
};

window.App.resetState = function resetState() {
    const { state, renderAll } = window.App;
    state.elements = [];
    state.connections = [];
    state.selectedElementId = null;
    state.unlockedAchievements.clear();
    state.idCounter = 0;
    document.getElementById("placedElements").innerHTML = "";
    document.getElementById("connectionsLayer").innerHTML = "";
    renderAll();
};
