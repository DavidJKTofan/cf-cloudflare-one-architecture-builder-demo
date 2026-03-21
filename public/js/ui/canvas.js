/**
 * Canvas rendering — placed elements, drag-within-canvas, drop zones.
 */

"use strict";

window.App = window.App || {};

/* ---------- Placed elements ---------- */
window.App.renderPlacedElements = function renderPlacedElements() {
    const { state, COMPONENTS, CONNECTORS, removeElement, renderAll, renderConnections } = window.App;
    const container = document.getElementById("placedElements");

    const existingEls = container.querySelectorAll(".placed-element");
    const existingMap = new Map();
    existingEls.forEach(el => existingMap.set(el.dataset.id, el));

    const stateIds = new Set(state.elements.map(e => e.id));
    existingMap.forEach((el, id) => { if (!stateIds.has(id)) el.remove(); });

    state.elements.forEach(elem => {
        const comp = COMPONENTS[elem.type];
        if (!comp) return;
        let el = existingMap.get(elem.id);
        if (!el) {
            el = document.createElement("div");
            el.className = "placed-element";
            el.dataset.id = elem.id;
            el.innerHTML = `
                <button class="element-remove-btn" title="Remove">
                    <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2"><line x1="2" y1="2" x2="10" y2="10"/><line x1="10" y1="2" x2="2" y2="10"/></svg>
                </button>
                <div class="element-body" style="border-color: ${comp.color}20; background: linear-gradient(135deg, ${comp.color}08, var(--bg-card))">
                    ${comp.icon}
                    <div class="element-connectors"></div>
                </div>
                <span class="element-label">${comp.label}</span>
            `;
            el.querySelector(".element-remove-btn").addEventListener("click", (e) => {
                e.stopPropagation();
                removeElement(elem.id);
            });
            el.addEventListener("click", (e) => {
                e.stopPropagation();
                if (e.target.closest(".element-remove-btn")) return;
                state.selectedElementId = elem.id;
                renderAll();
            });
            makeDraggableInCanvas(el, elem, renderConnections);
            container.appendChild(el);
            // Entrance animation
            el.style.opacity = "0";
            el.style.transform = "scale(0.5)";
            requestAnimationFrame(() => {
                el.style.transition = "opacity 0.3s, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)";
                el.style.opacity = "1";
                el.style.transform = "scale(1)";
            });
        }
        el.style.left = (elem.x - 32) + "px";
        el.style.top = (elem.y - 42) + "px";
        el.classList.toggle("selected", state.selectedElementId === elem.id);

        const dotsContainer = el.querySelector(".element-connectors");
        const elConns = state.connections.filter(c => c.elementId === elem.id);
        dotsContainer.innerHTML = elConns.map(c =>
            `<div class="element-connector-dot" style="background:${CONNECTORS[c.connector]?.color ?? '#666'}" title="${CONNECTORS[c.connector]?.name ?? ''}"></div>`
        ).join("");
    });
};

/* ---------- In-canvas drag ---------- */
function makeDraggableInCanvas(domEl, stateEl, renderConnectionsFn) {
    let dragging = false, startX, startY, origX, origY;
    const body = domEl.querySelector(".element-body");
    body.addEventListener("mousedown", e => {
        if (e.button !== 0) return;
        dragging = true;
        startX = e.clientX;
        startY = e.clientY;
        origX = stateEl.x;
        origY = stateEl.y;
        body.style.cursor = "grabbing";
        e.preventDefault();
    });
    document.addEventListener("mousemove", e => {
        if (!dragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        stateEl.x = origX + dx;
        stateEl.y = origY + dy;
        domEl.style.left = (stateEl.x - 32) + "px";
        domEl.style.top = (stateEl.y - 42) + "px";
        renderConnectionsFn();
    });
    document.addEventListener("mouseup", () => {
        if (dragging) {
            dragging = false;
            body.style.cursor = "";
        }
    });
}

/* ---------- Drop zones ---------- */
window.App.renderDropZones = function renderDropZones() {
    const { state, COMPONENTS } = window.App;
    const left = document.getElementById("dropZoneLeft");
    const right = document.getElementById("dropZoneRight");
    const hasUsers = state.elements.some(e => COMPONENTS[e.type]?.category === "users");
    const hasInfra = state.elements.some(e => COMPONENTS[e.type]?.category === "infrastructure");
    left.classList.toggle("has-items", hasUsers);
    right.classList.toggle("has-items", hasInfra);
};
