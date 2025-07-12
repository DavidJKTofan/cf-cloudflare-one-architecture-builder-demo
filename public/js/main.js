// Configure Mermaid with optimized settings
mermaid.initialize({
    startOnLoad: true,
    theme: 'default',
    logLevel: 'error',
    securityLevel: 'strict',
    flowchart: {
        curve: 'basis',
        diagramPadding: 8,
        htmlLabels: true,
        useMaxWidth: true,
        padding: 20,
        nodeSpacing: 100,
        rankSpacing: 100
    }
});

async function renderDiagram() {
    const output = document.querySelector('.mermaid');
    if (!output) return;
    
    try {
        await mermaid.run();
    } catch (error) {
        console.error('Mermaid rendering error:', error);
        output.innerHTML = `<p style="color: var(--error-color);">Error rendering diagram: ${error.message}</p>`;
    }
}

// Initial render when DOM is loaded
document.addEventListener('DOMContentLoaded', renderDiagram);

// Re-render on window resize for responsive behavior
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        renderDiagram();
    }, 250);
});
