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
        url: '/save_all_products',
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



function deleteAllProducts() {
    if (confirm('Вы уверены, что хотите удалить все данные?')) {
        $.ajax({
            type: 'POST',
            url: '/delete_all_products',
            contentType: 'application/json',
            success: function(response) {
                alert('Данные успешно удалены!');
                window.location.reload();
            },
            error: function(response) {
                alert('Произошла ошибка при удалении данных!');
            }
        });
    }
}


