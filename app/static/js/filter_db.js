document.addEventListener('DOMContentLoaded', function() {
    const filterInput = document.getElementById('filterInput');
    const TableBody = document.getElementById('TableBody');

    filterInput.addEventListener('keyup', function() {
        const filterValue = filterInput.value.toLowerCase();

        for (let i = 0; i < TableBody.rows.length; i++) {
            let rowDisplay = 'none';
            for (let j = 0; j < TableBody.rows[i].cells.length; j++) {
                const cellValue = TableBody.rows[i].cells[j].textContent.toLowerCase();
                if (cellValue.indexOf(filterValue) > -1) {
                    rowDisplay = '';
                    break;
                }
            }
            TableBody.rows[i].style.display = rowDisplay;
        }
    });
});
