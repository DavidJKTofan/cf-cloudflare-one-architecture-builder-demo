/**
 * Drag-and-drop setup for placing components from the sidebar onto the canvas.
 */

"use strict";

window.App = window.App || {};

window.App.setupDragAndDrop = function setupDragAndDrop() {
    const { COMPONENTS, addElement } = window.App;

    const cards = document.querySelectorAll(".component-card[draggable]");
    cards.forEach(card => {
        card.addEventListener("dragstart", e => {
            e.dataTransfer.setData("text/plain", card.dataset.type);
            card.classList.add("dragging");
        });
        card.addEventListener("dragend", () => card.classList.remove("dragging"));
    });

    const canvasArea = document.getElementById("canvasContainer");
    const dzLeft = document.getElementById("dropZoneLeft");
    const dzRight = document.getElementById("dropZoneRight");

    [dzLeft, dzRight, canvasArea].forEach(zone => {
        zone.addEventListener("dragover", e => {
            e.preventDefault();
            if (zone.classList.contains("drop-zone")) zone.classList.add("drag-over");
        });
        zone.addEventListener("dragleave", () => {
            if (zone.classList.contains("drop-zone")) zone.classList.remove("drag-over");
        });
        zone.addEventListener("drop", e => {
            e.preventDefault();
            e.stopPropagation(); // Prevent parent canvasContainer from also firing
            zone.classList.remove("drag-over");
            const type = e.dataTransfer.getData("text/plain");
            if (!type || !COMPONENTS[type]) return;

            const rect = canvasArea.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;
            x = Math.max(40, Math.min(rect.width - 40, x));
            y = Math.max(40, Math.min(rect.height - 40, y));

            addElement(type, x, y);
        });
    });
};
