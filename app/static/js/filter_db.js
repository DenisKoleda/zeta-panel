document.addEventListener('DOMContentLoaded', function() {
    const filterInput = document.getElementById('filterInput');
    const filterColumn = document.getElementById('filterColumn');
    const TableBody = document.getElementById('TableBody');

    filterInput.addEventListener('keyup', function() {
        const filterValue = filterInput.value.toLowerCase();
        const column = filterColumn.value;

        for (let i = 0; i < TableBody.rows.length; i++) {
            const cellValue = TableBody.rows[i].cells[column].textContent.toLowerCase();

            if (cellValue.indexOf(filterValue) > -1) {
                TableBody.rows[i].style.display = '';
            } else {
                TableBody.rows[i].style.display = 'none';
            }
        }
    });

    filterColumn.addEventListener('change', function() {
        filterInput.dispatchEvent(new Event('keyup'));
    });

});