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
        url: '/sklad/api/save_all_products',
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
    // получаем заголовки столбцов из таблицы
    var headers = [];
    $('#TableBody tr:first-child th').each(function() {
        headers.push($(this).attr('data-column-id'));
    });

    // создаем всплывающее окно для добавления новой строки
    var modal = $('<div class="modal" tabindex="-1" role="dialog">' +
        '<div class="modal-dialog" role="document">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<h5 class="modal-title">Добавление новой строки</h5>' +
        '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>' +
        '</div>' +
        '<div class="modal-body">' +
        '<form>' +
        '<div class="form-fields"></div>' +
        '</form>' +
        '</div>' +
        '<div class="modal-footer">' +
        '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>' +
        '<button type="button" class="btn btn-primary" onclick="addTableRow()">Добавить</button>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>');

    // добавляем поля формы в всплывающее окно
    var formFields = modal.find('.form-fields');
    headers.forEach(function(header) {
        var input = '<div class="mb-3">' +
            '<label for="' + header + '" class="form-label">' + header + '</label>' +
            '<input type="text" class="form-control" id="' + header + '" name="' + header + '">' +
            '</div>';
        formFields.append(input);
    });

    // добавляем всплывающее окно на страницу и отображаем его
    $('body').append(modal);
    modal.modal('show');
}

function addTableRow() {
    // получаем значения из динамических полей ввода
    var values = {};
    var formFields = $('.form-fields');
    formFields.find('input').each(function() {
        var name = $(this).attr('name');
        var value = $(this).val();
        values[name] = value;
    });

    // создаем новую строку таблицы на основе значений
    var newRow = $('<tr></tr>');
    var lastRow = $('#TableBody tr:last-child');
    var currentId = parseInt(lastRow.find('td:first-child').text()) + 1;
    newRow.append('<td data-column-id="id">' + currentId + '</td>');
    for (var key in values) {
        var value = values[key];
        var cell = '<td data-column-id="' + key + '">' + value + '</td>';
        newRow.append(cell);
    }

    // добавляем кнопки в последнюю ячейку новой строки
    var lastCell = lastRow.find('td:last-child');
    newRow.append(lastCell.html());

    // добавляем новую строку в таблицу
    $('#TableBody').append(newRow);

    // закрываем всплывающее окно
    $('.modal').modal('hide');
}
