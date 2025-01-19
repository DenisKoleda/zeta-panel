$(document).ready(function () {

    // получение ссылки на поле ввода
    var dateInput = document.getElementById('date');

    // создание объекта даты для текущей даты
    var today = new Date();

    // форматирование даты в строку в формате yyyy-mm-dd
    var formattedDate = today.toISOString().substr(0, 10);

    // установка значения поля ввода
    dateInput.value = formattedDate;

    // Форма добавления элемента
    $('#addForm').submit(function (event) {
        event.preventDefault();

        // Отключаем все кнопки отправки форм
        $('.btn[type="submit"]').prop('disabled', true);

        // Получение данных из формы
        var formData = $('#addForm').serialize();

        // AJAX запрос для добавления строки в базу данных
        $.ajax({
            url: '/api/tasks/add',
            type: 'POST',
            data: formData,
            success: function (response) {
                // Очистка формы и закрытие модального окна
                $('#addForm')[0].reset();
                $('#addModal').modal('hide');
                table.ajax.reload();
            },
            error: function (error) {
                console.log(error);
            },
            complete: function () {
                // Включаем обратно все кнопки отправки форм
                $('.btn[type="submit"]').prop('disabled', false);
            }
        });
    });

    // Назначение обработчика кликов на родительский элемент
    $("#TableBody").on("click", ".action-btn", function () {
        var $button = $(this);
        var columnId = $button.data("id");
        var buttonName = $button.data("status");
        var userName = $button.data("name");

        // Блокируем все кнопки действий
        $('.action-btn').prop('disabled', true);

        var data = { id: columnId, status: buttonName, executor: userName };
        $.post('/api/tasks/update_item_status', data, function (response) {
            table.ajax.reload();
        })
            .fail(function (error) {
                console.log(error);
            })
            .always(function () {
                // Разблокируем все кнопки действий
                $('.action-btn').prop('disabled', false);
            });
    });

    $('#editModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget); // кнопка, вызвавшая модальное окно
        var id = button.data('id'); // извлечь значение атрибута "data-id"
        $.ajax({
            url: '/api/tasks/get_id',
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
                    url: '/api/tasks/get_item',
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
        $.get('/api/tasks/get_item', { id: itemId }, function (response) {
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

        // Блокируем все кнопки отправки форм
        $('.btn[type="submit"]').prop('disabled', true);

        var data = $(this).serialize();

        $.post('/api/tasks/update_item', data, function (response) {
            table.ajax.reload();
        })
            .fail(function (error) {
                console.log(error);
            })
            .always(function () {
                // Разблокируем все кнопки отправки форм
                $('.btn[type="submit"]').prop('disabled', false);
            });
    });

});