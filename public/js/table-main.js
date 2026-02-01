// Enhanced JavaScript for filtering and search functionality
document.addEventListener('DOMContentLoaded', function () {
	const table = document.getElementById('connectivityTable');
	const tbody = table.querySelector('tbody');
	const rows = Array.from(tbody.querySelectorAll('tr'));

	// Filter elements
	const categoryFilter = document.getElementById('categoryFilter');
	const useCaseFilter = document.getElementById('useCaseFilter');
	const searchFilter = document.getElementById('searchFilter');

	// Stats elements
	const filteredOptionsCount = document.getElementById('filteredOptions');

	// Store original row data
	rows.forEach((row) => {
		row.originalIndex = rows.indexOf(row);
	});

	function updateStats() {
		const visibleRows = rows.filter((row) => row.style.display !== 'none');
		filteredOptionsCount.textContent = visibleRows.length;
	}

	function filterTable() {
		const categoryValue = categoryFilter.value;
		const useCaseValue = useCaseFilter.value;
		const searchValue = searchFilter.value.toLowerCase();

		rows.forEach((row) => {
			let showRow = true;

			// Category filter
			if (categoryValue !== 'all') {
				const rowCategory = row.getAttribute('data-category');
				if (rowCategory !== categoryValue) {
					showRow = false;
				}
			}

			// Use case filter
			if (useCaseValue !== 'all' && showRow) {
				const rowUseCase = row.getAttribute('data-use-case');
				if (!rowUseCase || !rowUseCase.includes(useCaseValue)) {
					showRow = false;
				}
			}

			// Search filter
			if (searchValue && showRow) {
				const rowText = row.textContent.toLowerCase();
				if (!rowText.includes(searchValue)) {
					showRow = false;
				}
			}

			row.style.display = showRow ? '' : 'none';
		});

		updateStats();
	}

	// Event listeners
	categoryFilter.addEventListener('change', filterTable);
	useCaseFilter.addEventListener('change', filterTable);
	searchFilter.addEventListener('input', filterTable);

	// Initialize stats
	updateStats();

	// Row hover effects handled via CSS for better performance

	// Keyboard navigation
	document.addEventListener('keydown', function (e) {
		if (e.key === '/' && e.target !== searchFilter) {
			e.preventDefault();
			searchFilter.focus();
		}
	});

	// Clear search shortcut
	searchFilter.addEventListener('keydown', function (e) {
		if (e.key === 'Escape') {
			this.value = '';
			filterTable();
		}
	});
});
