/**
 * Progress tracking and achievement checking.
 */

"use strict";

window.App = window.App || {};

window.App.updateProgress = function updateProgress() {
    const { state, ACHIEVEMENTS } = window.App;
    const maxComponents = 6;
    const maxConnections = 8;
    const maxAchievements = ACHIEVEMENTS.length;
    const compScore = Math.min(state.elements.length / maxComponents, 1) * 30;
    const connScore = Math.min(state.connections.length / maxConnections, 1) * 40;
    const achScore = (state.unlockedAchievements.size / maxAchievements) * 30;
    const pct = Math.round(compScore + connScore + achScore);
    document.getElementById("progressFill").style.width = pct + "%";
    document.getElementById("progressPct").textContent = pct + "%";
};

window.App.checkAchievements = function checkAchievements() {
    const { state, ACHIEVEMENTS, showToast, updateProgress } = window.App;
    ACHIEVEMENTS.forEach(ach => {
        if (state.unlockedAchievements.has(ach.id)) return;
        if (ach.check(state)) {
            state.unlockedAchievements.add(ach.id);
            showToast(ach.title + " — " + ach.desc, "achievement");
        }
    });
    updateProgress();
};
