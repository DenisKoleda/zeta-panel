$(document).ready(function() {
    // Назначение обработчика кликов на родительский элемент
    $("#TableBody").on("click", ".action-btn", function() {
        var columnId = $(this).data("id");
        var buttonName = $(this).text();
        var data = {id: columnId, text: buttonName};
        console.log(data);        
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
            $('#commentEdit').val(response.comment);
        }).fail(function (error) {
            console.log(error);
        });
    });

    $('#editForm').submit(function (event) {
        event.preventDefault();

        var data = $(this).serialize();

        $.post('/api/tasks/update_item_comment', data, function (response) {
            location.reload();
        }).fail(function (error) {
            console.log(error);
        });
    });

  });