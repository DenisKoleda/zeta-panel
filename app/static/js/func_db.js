document.addEventListener('DOMContentLoaded', function() {
    function toggleEditable() {
        var elements = document.getElementsByClassName("editable");
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].contentEditable == "true") {
                elements[i].contentEditable = "false";
            } else {
                elements[i].contentEditable = "true";
            }
        }
    }
    
    function saveAllProducts() {
        var rows = $('#productTableBody tr');
        var data = [];
        rows.each(function(index, value) {
            var row = $(this);
            var id = row.find('td:eq(0)').text();
            var name = row.find('td:eq(1)').text();
            var description = row.find('td:eq(2)').text();
            var product = {
                id: id,
                name: name,
                description: description
            };
            data.push(product);
        });
        $.ajax({
            type: 'POST',
            url: '/sklad/save_all_products',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function(response) {
                alert('Данные успешно сохранены!');
                window.location.reload();
            },
            error: function(response) {
                alert('Произошла ошибка при сохранении данных!');
            }
        });
    }
    
    function addRow() {
        var tableBody = document.getElementById("productTableBody");
        var lastRow = tableBody.lastElementChild;
        var lastId = lastRow ? parseInt(lastRow.firstElementChild.innerHTML) : 0;
        var newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${lastId + 1}</td>
            <td contenteditable="true" class="editable" data-field="name"></td>
            <td contenteditable="true" class="editable" data-field="description"></td>
        `;
        if (lastRow) {
            tableBody.appendChild(newRow);
        } else {
            tableBody.innerHTML = newRow.outerHTML;
        }
    }
    
    document.querySelector(".btn-primary").addEventListener("click", saveAllProducts);
    document.querySelector(".btn-success").addEventListener("click", addRow);
    document.querySelector(".btn-warning").addEventListener("click", toggleEditable);
    
    
});