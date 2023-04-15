document.addEventListener('DOMContentLoaded', function() {
    const filterInput = document.getElementById('filterInput');
    const filterColumn = document.getElementById('filterColumn');
    const productTableBody = document.getElementById('productTableBody');

    filterInput.addEventListener('keyup', function() {
        const filterValue = filterInput.value.toLowerCase();
        const column = filterColumn.value;

        for (let i = 0; i < productTableBody.rows.length; i++) {
            const cellValue = productTableBody.rows[i].cells[column].textContent.toLowerCase();

            if (cellValue.indexOf(filterValue) > -1) {
                productTableBody.rows[i].style.display = '';
            } else {
                productTableBody.rows[i].style.display = 'none';
            }
        }
    });

    filterColumn.addEventListener('change', function() {
        filterInput.dispatchEvent(new Event('keyup'));
    });

});