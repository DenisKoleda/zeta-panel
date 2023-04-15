function toggleEditable(button) {
    var elements = document.getElementsByClassName("editable");
    for (var i = 0; i < elements.length; i++) {
        if (elements[i].contentEditable == "true") {
            elements[i].contentEditable = "false";
        } else {
            elements[i].contentEditable = "true";
        }
    }
    if (button.classList.contains("btn-warning")) {
        button.classList.replace("btn-warning", "btn-danger");
        button.innerHTML = "Выключить Редактирование";
    } else {
        button.classList.replace("btn-danger", "btn-warning");
        button.innerHTML = "Включить Редактирование";
    }
}

function saveAllProducts() {
    var rows = $('#TableBody tr');
    var data = [];
    rows.each(function(index, value) {
        var row = $(this);
        var product = {};
        row.find('td:not(.text-end)').each(function(index, value) {
            var columnId = $(this).data('column-id');
            var value = $(this).text();
            product[columnId] = value;
        });
        data.push(product);
    });
    $.ajax({
        type: 'POST',
        url: '/sklad/save_all_products',
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function(response) {
            if (response.success) {
                alert('Данные успешно сохранены!');
                window.location.reload();
            } else {
                alert(response.message);
            }
        },
        error: function(response) {
            alert('Произошла ошибка при сохранении данных!');
        }
    });
}


function addRow() {

    // выбираем последнюю строку таблицы
    var lastRow = $('#TableBody tr:last-child');

    // клонируем последнюю строку и устанавливаем пустые значения в ячейках, кроме первой (id)
    var newRow = lastRow.clone();
    newRow.find('td').not(':first').text('');

    // увеличиваем значение в первой ячейке на 1
    var currentId = parseInt(newRow.find('td:first').text());
    newRow.find('td:first').text(currentId + 1);

    // включаем атрибут contenteditable="true" для всех ячеек, кроме первой (id) и последней (кнопок)
    newRow.find('td').not(':first, :last').attr('contenteditable', 'true');

    // добавляем скопированную строку в таблицу
    $('#TableBody').append(newRow);

    // сохраняем кнопки в последней ячейке и отключаем атрибут contenteditable для кнопок
    var lastCell = lastRow.find('td:last-child');
    newRow.find('td:last-child').html(lastCell.html()).find('button').removeAttr('contenteditable');
}

