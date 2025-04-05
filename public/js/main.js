mermaid.initialize({ startOnLoad: false });

async function renderDiagram() {
	const input = document.getElementById('mermaidInput').value;
	const output = document.getElementById('mermaidOutput');
	try {
		output.innerHTML = input;
		await mermaid.run();
	} catch (error) {
		output.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
	}
}

// Initial render
document.addEventListener('DOMContentLoaded', renderDiagram);
