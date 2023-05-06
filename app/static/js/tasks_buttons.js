// Форма редактирования
$(document).ready(function () {
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
                        $('#dateEdit').val(response.date);
                        $('#user_initEdit').val(response.user_init);
                        $('#ticketEdit').val(response.ticket);
                        $('#ticket_commentEdit').val(response.ticket_comment);
                        $('#priorityEdit').val(response.priority);
                        $('#statusEdit').val(response.status);
                        $('#executorEdit').val(response.executor);
                        $('#deadlineEdit').val(response.deadline);
                        $('#commentEdit').val(response.comment);
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
            $('#dateEdit').val(response.date);
            $('#user_initEdit').val(response.user_init);
            $('#ticketEdit').val(response.ticket);
            $('#ticket_commentEdit').val(response.ticket_comment);
            $('#priorityEdit').val(response.priority);
            $('#statusEdit').val(response.status);
            $('#executorEdit').val(response.executor);
            $('#deadlineEdit').val(response.deadline);
            $('#commentEdit').val(response.comment);
        }).fail(function (error) {
            console.log(error);
        });
    });

    $('#editForm').submit(function (event) {
        event.preventDefault();

        var data = $(this).serialize();

        $.post('/api/tasks/update_item', data, function (response) {
            location.reload();
        }).fail(function (error) {
            console.log(error);
        });
    });

    // TODO Добавить вывод информации об удаляемом элементе
    $('#deleteModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget); // кнопка, вызвавшая модальное окно
        var id = button.data('id'); // извлечь значение атрибута "data-id"
        var select = $('#idSelectDelete').empty();

        $.get('/api/tasks/get_id', function (response) {
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

        $.post('/api/tasks/delete_item', { id: $('#idSelectDelete').val() }, function (response) {
            $('#deleteModal').modal('hide');
            location.reload();
        }).fail(function (error) {
            console.log(error);
        });
    });
});