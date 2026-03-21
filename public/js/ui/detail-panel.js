/**
 * Right-side detail panel — shows component info, connection toggles,
 * and documentation links.
 */

"use strict";

window.App = window.App || {};

/** Derive a human-readable label from a Cloudflare docs URL path. */
function docLabelFromUrl(url) {
    const path = url.replace("https://developers.cloudflare.com/", "").replace(/\/+$/, "");
    const last = path.split("/").pop() || path;
    return last.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

window.App.renderDetailPanel = function renderDetailPanel() {
    const { state, COMPONENTS, CONNECTORS, removeElement, removeConnection, addConnection } = window.App;
    const empty = document.getElementById("detailEmpty");
    const content = document.getElementById("detailContent");

    if (!state.selectedElementId) {
        empty.style.display = "";
        content.style.display = "none";
        return;
    }

    const el = state.elements.find(e => e.id === state.selectedElementId);
    if (!el) { empty.style.display = ""; content.style.display = "none"; return; }

    const comp = COMPONENTS[el.type];
    if (!comp) return;

    empty.style.display = "none";
    content.style.display = "";

    document.getElementById("detailTitle").textContent = comp.label;
    document.getElementById("detailDesc").textContent = comp.desc;

    // Build unified connections list: all compatible connectors,
    // active ones highlighted, inactive ones greyed out and clickable.
    const activeConns = state.connections.filter(c => c.elementId === el.id);
    const activeConnectorKeys = new Set(activeConns.map(c => c.connector));

    let connsHtml = `<h4 style="font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-muted);margin-bottom:6px">Connections</h4>`;

    comp.compatibleConnectors.forEach(key => {
        const conn = CONNECTORS[key];
        if (!conn) return;
        const isActive = activeConnectorKeys.has(key);
        const activeEntry = isActive ? activeConns.find(c => c.connector === key) : null;

        if (isActive) {
            connsHtml += `<div class="detail-conn-item conn-active" data-connector="${key}">
                <div class="conn-color" style="background:${conn.color}"></div>
                <div class="conn-text">
                    <span class="conn-name">${conn.name}</span>
                    <span class="conn-protocol">${conn.protocol}</span>
                </div>
                <button class="conn-remove" data-conn-id="${activeEntry.id}" title="Disconnect">&times;</button>
            </div>`;
        } else {
            connsHtml += `<div class="detail-conn-item conn-inactive" data-connector="${key}">
                <div class="conn-color" style="background:${conn.color}"></div>
                <div class="conn-text">
                    <span class="conn-name">${conn.name}</span>
                    <span class="conn-protocol">${conn.protocol}</span>
                </div>
                <span class="conn-add-hint">+ click to connect</span>
            </div>`;
        }
    });

    const connsContainer = document.getElementById("detailConnections");
    connsContainer.innerHTML = connsHtml;

    // Attach event handlers
    connsContainer.querySelectorAll(".conn-remove").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            removeConnection(btn.dataset.connId);
        });
    });
    connsContainer.querySelectorAll(".conn-inactive").forEach(item => {
        item.addEventListener("click", () => {
            const connKey = item.dataset.connector;
            if (connKey && el.id) addConnection(el.id, connKey);
        });
    });

    // Remove element button
    document.getElementById("btnRemoveElement").onclick = () => removeElement(el.id);

    // Documentation links: component URL + each connector's URL (deduplicated)
    let infoHtml = "";
    const docLinks = [];
    if (comp.docsUrl) {
        const matchingConn = Object.values(CONNECTORS).find(c => c.docsUrl === comp.docsUrl);
        const label = matchingConn ? matchingConn.name : docLabelFromUrl(comp.docsUrl);
        docLinks.push({ label, url: comp.docsUrl });
    }
    comp.compatibleConnectors.forEach(key => {
        const c = CONNECTORS[key];
        if (c && c.docsUrl && !docLinks.some(d => d.url === c.docsUrl)) {
            docLinks.push({ label: c.name, url: c.docsUrl });
        }
    });
    if (docLinks.length > 0) {
        infoHtml += `<h4>Documentation</h4><ul>`;
        docLinks.forEach(d => {
            infoHtml += `<li><a href="${d.url}" target="_blank" rel="noopener">${d.label}</a></li>`;
        });
        infoHtml += `</ul>`;
    }

    document.getElementById("detailInfo").innerHTML = infoHtml;
};
