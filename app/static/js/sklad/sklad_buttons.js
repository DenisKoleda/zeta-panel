$(document).ready(function () {
    // Форма добавления элемента
    $('#addForm').submit(function (event) {
        event.preventDefault();

        // Получение данных из формы
        var formData = $('#addForm').serialize();

        // AJAX запрос для добавления строки в базу данных
        $.ajax({
            url: '/api/sklad/' + path + '/add',
            type: 'POST',
            data: formData,
            success: function (response) {
                // Очистка формы и закрытие модального окна
                $('#addForm')[0].reset();
                $('#addModal').modal('hide');
                location.reload();
            },
            error: function (error) {
                console.log(error);
            }
        });
    });
    // Форма редактирования
    $('#editModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget); // кнопка, вызвавшая модальное окно
        var id = button.data('id'); // извлечь значение атрибута "data-id"
        $.ajax({
            url: '/api/sklad/' + path + '/get_id',
            type: 'GET',
            success: function (response) {
                $('#idSelectEdit').empty();
                response.forEach(function (item) {
                    $('#idSelectEdit').append($('<option>', {
                        value: item.id,
                        text: item.id
                    }));
                });
                if (id !== null && id !== undefined) {
                    $('#idSelectEdit').val(id);
                }
                $.ajax({
                    url: '/api/sklad/' + path + '/get_item',
                    type: 'GET',
                    data: { id: $('#idSelectEdit').val() },
                    success: function (response) {
                        // Заполняем поля формы данными об элементе
                        $('*[id$="Edit"]').each(function () {
                            // Получаем имя элемента формы
                            var fieldName = $(this).attr('id').replace('Edit', '');

                            // Если имя поля формы соответствует имени свойства в объекте response, заполняем его значением
                            if (fieldName in response) {
                                $(this).val(response[fieldName]);
                            }
                        });
                    },
                    error: function (error) {
                        console.log(error);
                    }
                });
            },
            error: function (error) {
                console.log(error);
            }
        });
    });

    // Обновляем данные об элементе при изменении выбранного ID
    $('#idSelectEdit').change(function () {
        var itemId = $(this).val();
        $.get('/api/sklad/' + path + '/get_item', { id: itemId }, function (response) {
            // Проходим по всем элементам формы, имена которых заканчиваются на "Edit"
            $('*[id$="Edit"]').each(function () {
                // Получаем имя элемента формы
                var fieldName = $(this).attr('id').replace('Edit', '');

                // Если имя поля формы соответствует имени свойства в объекте response, заполняем его значением
                if (fieldName in response) {
                    $(this).val(response[fieldName]);
                }
            });
        }).fail(function (error) {
            console.log(error);
        });
    });
    $('#editForm').submit(function (event) {
        event.preventDefault();

        var data = $(this).serialize();

        $.post('/api/sklad/' + path + '/update_item', data, function (response) {
            location.reload();
        }).fail(function (error) {
            console.log(error);
        });
    });
    // TODO Добавить вывод информации об удаляемом элементе
    $('#deleteModal').on('show.bs.modal', function (event) {
        var select = $('#idSelectDelete').empty();
        var button = $(event.relatedTarget); // кнопка, вызвавшая модальное окно
        var id = button.data('id'); // извлечь значение атрибута "data-id"
        $.get('/api/sklad/' + path + '/get_id', function (response) {
            response.forEach(function (item) {
                select.append($('<option>', { value: item.id, text: item.id }));
                if (id !== null && id !== undefined) {
                    $('#idSelectDelete').val(id);
                }
            });
        }).fail(function (error) {
            console.log(error);
        });
    });
    $('#deleteForm').submit(function (event) {
        event.preventDefault();

        $.post('/api/sklad/' + path + '/delete_item', { id: $('#idSelectDelete').val() }, function (response) {
            $('#deleteModal').modal('hide');
            location.reload();
        }).fail(function (error) {
            console.log(error);
        });
    });
});