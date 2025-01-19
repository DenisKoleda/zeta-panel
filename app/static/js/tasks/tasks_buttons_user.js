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
                // Заново устанавливаем текущую дату после сброса формы
                var today = new Date();
                var formattedDate = today.toISOString().substr(0, 10);
                dateInput.value = formattedDate;
                // Удаляем класс modal-open и backdrop
                $('body').removeClass('modal-open').css('padding-right', '');
                $('.modal-backdrop').remove();
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
        var id = button.data('id') || selectedTaskId; // используем ID из кнопки или из контекстного меню
        if (!id) return;

        $.get('/api/tasks/get_item', { id: id }, function (response) {
            $('#idSelectEdit').empty().append($('<option>', {
                value: response.id,
                text: response.id
            })).val(response.id);

            $('*[id$="Edit"]').each(function () {
                var fieldName = $(this).attr('id').replace('Edit', '');
                if (fieldName in response) {
                    $(this).val(response[fieldName]);
                }
            });
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
            $('#editModal').modal('hide');
            // Удаляем класс modal-open и backdrop
            $('body').removeClass('modal-open').css('padding-right', '');
            $('.modal-backdrop').remove();
        })
            .fail(function (error) {
                console.log(error);
            })
            .always(function () {
                // Разблокируем все кнопки отправки форм
                $('.btn[type="submit"]').prop('disabled', false);
            });
    });

    // Обработка контекстного меню
    var selectedTaskId = null;

    // Отключаем стандартное контекстное меню на таблице
    $('#myTable tbody').on('contextmenu', 'tr', function (e) {
        e.preventDefault();

        // Получаем данные строки
        var row = table.row(this).data();
        if (row) {
            selectedTaskId = row.id;

            // Позиционируем и показываем меню
            $("#contextMenu").css({
                top: e.pageY + "px",
                left: e.pageX + "px"
            }).show();
        }
    });

    // Скрываем меню при клике в любом месте документа
    $(document).click(function () {
        $("#contextMenu").hide();
    });

    // Обработка клика по пункту "Редактировать"
    $(".edit-task").click(function () {
        if (selectedTaskId) {
            $('#editModal').modal('show');
            // Устанавливаем выбранный ID в модальном окне
            $('#idSelectEdit').val(selectedTaskId);
            // Загружаем данные задачи
            $.get('/api/tasks/get_item', { id: selectedTaskId }, function (response) {
                $('*[id$="Edit"]').each(function () {
                    var fieldName = $(this).attr('id').replace('Edit', '');
                    if (fieldName in response) {
                        $(this).val(response[fieldName]);
                    }
                });
            });
        }
    });

    // Обработка кнопки удаления
    $(".delete-task").click(function () {
        if (selectedTaskId && confirm('Вы уверены, что хотите удалить эту задачу?')) {
            $('.btn[type="submit"]').prop('disabled', true); // блокируем кнопки

            $.post('/api/tasks/delete_item', { id: selectedTaskId }, function (response) {
                table.ajax.reload();
            })
                .fail(function (error) {
                    console.log(error);
                })
                .always(function () {
                    $('.btn[type="submit"]').prop('disabled', false); // разблокируем кнопки
                });

            $("#contextMenu").hide();
        }
    });

    // Обработка контекстного меню для действий с задачами
    $(".take-task").click(function () {
        if (selectedTaskId) {
            $('.action-btn').prop('disabled', true);
            var data = { id: selectedTaskId, status: "В Работе", executor: userName };
            $.post('/api/tasks/update_item_status', data, function (response) {
                table.ajax.reload();
            })
                .fail(function (error) {
                    console.log(error);
                })
                .always(function () {
                    $('.action-btn').prop('disabled', false);
                });
            $("#contextMenu").hide();
        }
    });

    $(".complete-task").click(function () {
        if (selectedTaskId) {
            $('.action-btn').prop('disabled', true);
            var data = { id: selectedTaskId, status: "Выполнено", executor: userName };
            $.post('/api/tasks/update_item_status', data, function (response) {
                table.ajax.reload();
            })
                .fail(function (error) {
                    console.log(error);
                })
                .always(function () {
                    $('.action-btn').prop('disabled', false);
                });
            $("#contextMenu").hide();
        }
    });

    $(".postpone-task").click(function () {
        if (selectedTaskId) {
            $('.action-btn').prop('disabled', true);
            var data = { id: selectedTaskId, status: "Отложено", executor: userName };
            $.post('/api/tasks/update_item_status', data, function (response) {
                table.ajax.reload();
            })
                .fail(function (error) {
                    console.log(error);
                })
                .always(function () {
                    $('.action-btn').prop('disabled', false);
                });
            $("#contextMenu").hide();
        }
    });

    $(".free-task").click(function () {
        if (selectedTaskId && confirm('Вы уверены, что хотите освободить задачу?')) {
            $('.action-btn').prop('disabled', true);
            var data = {
                id: selectedTaskId,
                status: "Отложено",
                executor: "Общая"
            };
            $.post('/api/tasks/update_item_status', data, function (response) {
                table.ajax.reload();
            })
                .fail(function (error) {
                    console.log(error);
                })
                .always(function () {
                    $('.action-btn').prop('disabled', false);
                });
            $("#contextMenu").hide();
        }
    });

    // Показываем/скрываем кнопки контекстного меню в зависимости от статуса задачи
    $('#myTable tbody').on('contextmenu', 'tr', function (e) {
        e.preventDefault();
        var row = table.row(this).data();
        if (row) {
            selectedTaskId = row.id;

            // Скрываем все кнопки действий
            $(".take-task, .complete-task, .postpone-task, .free-task").hide();

            // Показываем соответствующие кнопки в зависимости от статуса
            if (row.status === "Новый" || row.status === "Возобновлена") {
                $(".take-task, .postpone-task").show();
            } else if (row.status === "В Работе") {
                $(".complete-task, .postpone-task, .free-task").show();
            } else if (row.status === "Отложено" && row.executor !== "Общая") {
                $(".take-task, .complete-task, .free-task").show();
            } else if (row.status === "Отложено") {
                $(".take-task, .complete-task").show();
            }

            $("#contextMenu").css({
                top: e.pageY + "px",
                left: e.pageX + "px"
            }).show();
        }
    });

    // Функция показа контекстного меню
    function showContextMenu(e, row) {
        selectedTaskId = row.id;

        // Скрываем все кнопки действий
        $(".take-task, .complete-task, .postpone-task, .free-task").hide();

        // Показываем соответствующие кнопки в зависимости от статуса
        if (row.status === "Новый" || row.status === "Возобновлена") {
            $(".take-task, .postpone-task").show();
        } else if (row.status === "В Работе") {
            $(".complete-task, .postpone-task, .free-task").show();
        } else if (row.status === "Отложено") {
            $(".take-task, .complete-task, .free-task").show();
        }

        // Позиционируем и показываем меню
        var pageX = e.pageX || e.originalEvent.touches[0].pageX;
        var pageY = e.pageY || e.originalEvent.touches[0].pageY;

        $("#contextMenu").css({
            top: pageY + "px",
            left: pageX + "px"
        }).show();

        // Предотвращаем выход меню за пределы экрана
        var menuWidth = $("#contextMenu").width();
        var menuHeight = $("#contextMenu").height();
        var windowWidth = $(window).width();
        var windowHeight = $(window).height();

        if (pageX + menuWidth > windowWidth) {
            $("#contextMenu").css("left", (windowWidth - menuWidth) + "px");
        }
        if (pageY + menuHeight > windowHeight) {
            $("#contextMenu").css("top", (windowHeight - menuHeight) + "px");
        }
    }

    // Обработка правого клика
    $('#myTable tbody').on('contextmenu', 'tr', function (e) {
        e.preventDefault();
        var row = table.row(this).data();
        if (row) {
            showContextMenu(e, row);
        }
    });

    // Обработка длительного нажатия для мобильных устройств
    $('#myTable tbody').on('taphold', 'tr', function (e) {
        e.preventDefault();
        var row = table.row(this).data();
        if (row) {
            showContextMenu(e, row);
        }
    });

    // Предотвращаем появление стандартного контекстного меню на мобильных
    document.addEventListener('touchmove', function (e) {
        if ($("#contextMenu").is(":visible")) {
            e.preventDefault();
        }
    }, { passive: false });

    // Закрываем меню при тапе в любом месте
    $(document).on('tap click', function (e) {
        if (!$(e.target).closest('#contextMenu').length) {
            $("#contextMenu").hide();
        }
    });

});