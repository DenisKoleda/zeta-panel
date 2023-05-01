$(document).ready(function () {
  var apiEndpoint = '/api/tasks/get';

  // отправляем GET запрос на сервер и получаем данные
  $.get(apiEndpoint, function (data) {
    var table = $('#myTable').DataTable({
      dom: '<"justify-content-between align-items-center"lfB><"table-responsive"rt><"justify-content-between align-items-center"ip>',
      buttons:[
        {
          extend: 'searchPanes',
          config: {
            cascadePanes: true,
            viewTotal: true,
          }
        },
          'createState', 'savedStates', 'copy', 
        {
          extend: 'excelHtml5',
          autoFilter: true,
          sheetName: 'Exported data'
        }, 'print', 'colvis'
        
      ],
      stateSave: true,
      responsive: true,
      paging: true,
      searching: true,
      ordering: true,
      data: data,
      language: {
        "processing": "Подождите...",
        "search": "Поиск:",
        "lengthMenu": "Показать _MENU_ записей",
        "info": "Записи с _START_ до _END_ из _TOTAL_ записей",
        "infoEmpty": "Записи с 0 до 0 из 0 записей",
        "infoFiltered": "(отфильтровано из _MAX_ записей)",
        "loadingRecords": "Загрузка записей...",
        "zeroRecords": "Записи отсутствуют.",
        "emptyTable": "В таблице отсутствуют данные",
        "paginate": {
            "first": "Первая",
            "previous": "Предыдущая",
            "next": "Следующая",
            "last": "Последняя"
        },
        "aria": {
            "sortAscending": ": активировать для сортировки столбца по возрастанию",
            "sortDescending": ": активировать для сортировки столбца по убыванию"
        },
        "select": {
            "rows": {
                "_": "Выбрано записей: %d",
                "1": "Выбрана одна запись"
            },
            "cells": {
                "_": "Выбрано %d ячеек",
                "1": "Выбрана 1 ячейка "
            },
            "columns": {
                "1": "Выбран 1 столбец ",
                "_": "Выбрано %d столбцов "
            }
        },
        "searchBuilder": {
            "conditions": {
                "string": {
                    "startsWith": "Начинается с",
                    "contains": "Содержит",
                    "empty": "Пусто",
                    "endsWith": "Заканчивается на",
                    "equals": "Равно",
                    "not": "Не",
                    "notEmpty": "Не пусто",
                    "notContains": "Не содержит",
                    "notStartsWith": "Не начинается на",
                    "notEndsWith": "Не заканчивается на"
                },
                "date": {
                    "after": "После",
                    "before": "До",
                    "between": "Между",
                    "empty": "Пусто",
                    "equals": "Равно",
                    "not": "Не",
                    "notBetween": "Не между",
                    "notEmpty": "Не пусто"
                },
                "number": {
                    "empty": "Пусто",
                    "equals": "Равно",
                    "gt": "Больше чем",
                    "gte": "Больше, чем равно",
                    "lt": "Меньше чем",
                    "lte": "Меньше, чем равно",
                    "not": "Не",
                    "notEmpty": "Не пусто",
                    "between": "Между",
                    "notBetween": "Не между ними"
                },
                "array": {
                    "equals": "Равно",
                    "empty": "Пусто",
                    "contains": "Содержит",
                    "not": "Не равно",
                    "notEmpty": "Не пусто",
                    "without": "Без"
                }
            },
            "data": "Данные",
            "deleteTitle": "Удалить условие фильтрации",
            "logicAnd": "И",
            "logicOr": "Или",
            "title": {
                "0": "Конструктор поиска",
                "_": "Конструктор поиска (%d)"
            },
            "value": "Значение",
            "add": "Добавить условие",
            "button": {
                "0": "Конструктор поиска",
                "_": "Конструктор поиска (%d)"
            },
            "clearAll": "Очистить всё",
            "condition": "Условие",
            "leftTitle": "Превосходные критерии",
            "rightTitle": "Критерии отступа"
        },
        "searchPanes": {
            "clearMessage": "Очистить всё",
            "collapse": {
                "0": "Панели поиска",
                "_": "Панели поиска (%d)"
            },
            "count": "{total}",
            "countFiltered": "{shown} ({total})",
            "emptyPanes": "Нет панелей поиска",
            "loadMessage": "Загрузка панелей поиска",
            "title": "Фильтры активны - %d",
            "showMessage": "Показать все",
            "collapseMessage": "Скрыть все"
        },
        "buttons": {
            "pdf": "PDF",
            "print": "Печать",
            "collection": "Коллекция <span class=\"ui-button-icon-primary ui-icon ui-icon-triangle-1-s\"><\/span>",
            "colvis": "Видимость столбцов",
            "colvisRestore": "Восстановить видимость",
            "copy": "Копировать",
            "copyKeys": "Нажмите ctrl or u2318 + C, чтобы скопировать данные таблицы в буфер обмена.  Для отмены, щелкните по сообщению или нажмите escape.",
            "copyTitle": "Скопировать в буфер обмена",
            "csv": "CSV",
            "excel": "Excel",
            "pageLength": {
                "-1": "Показать все строки",
                "_": "Показать %d строк",
                "1": "Показать 1 строку"
            },
            "removeState": "Удалить",
            "renameState": "Переименовать",
            "copySuccess": {
                "1": "Строка скопирована в буфер обмена",
                "_": "Скопировано %d строк в буфер обмена"
            },
            "createState": "Сохранить состояние",
            "removeAllStates": "Удалить все состояния",
            "savedStates": "Сохраненные состояния",
            "stateRestore": "Состояние %d",
            "updateState": "Обновить"
        },
        "decimal": ".",
        "infoThousands": ",",
        "autoFill": {
            "cancel": "Отменить",
            "fill": "Заполнить все ячейки <i>%d<i><\/i><\/i>",
            "fillHorizontal": "Заполнить ячейки по горизонтали",
            "fillVertical": "Заполнить ячейки по вертикали",
            "info": "Информация"
        },
        "datetime": {
            "previous": "Предыдущий",
            "next": "Следующий",
            "hours": "Часы",
            "minutes": "Минуты",
            "seconds": "Секунды",
            "unknown": "Неизвестный",
            "amPm": [
                "AM",
                "PM"
            ],
            "months": {
                "0": "Январь",
                "1": "Февраль",
                "10": "Ноябрь",
                "11": "Декабрь",
                "2": "Март",
                "3": "Апрель",
                "4": "Май",
                "5": "Июнь",
                "6": "Июль",
                "7": "Август",
                "8": "Сентябрь",
                "9": "Октябрь"
            },
            "weekdays": [
                "Вс",
                "Пн",
                "Вт",
                "Ср",
                "Чт",
                "Пт",
                "Сб"
            ]
        },
        "editor": {
            "close": "Закрыть",
            "create": {
                "button": "Новый",
                "title": "Создать новую запись",
                "submit": "Создать"
            },
            "edit": {
                "button": "Изменить",
                "title": "Изменить запись",
                "submit": "Изменить"
            },
            "remove": {
                "button": "Удалить",
                "title": "Удалить",
                "submit": "Удалить",
                "confirm": {
                    "_": "Вы точно хотите удалить %d строк?",
                    "1": "Вы точно хотите удалить 1 строку?"
                }
            },
            "multi": {
                "restore": "Отменить изменения",
                "title": "Несколько значений",
                "noMulti": "Это поле должно редактироватся отдельно, а не как часть групы",
                "info": "Выбранные элементы содержат разные значения для этого входа.  Чтобы отредактировать и установить для всех элементов этого ввода одинаковое значение, нажмите или коснитесь здесь, в противном случае они сохранят свои индивидуальные значения."
            },
            "error": {
                "system": "Возникла системная ошибка (<a target=\"\\\" rel=\"nofollow\" href=\"\\\">Подробнее<\/a>)."
            }
        },
        "searchPlaceholder": "Что ищете?",
        "stateRestore": {
            "creationModal": {
                "button": "Создать",
                "search": "Поиск",
                "columns": {
                    "search": "Поиск по столбцам",
                    "visible": "Видимость столбцов"
                },
                "name": "Имя:",
                "order": "Сортировка",
                "paging": "Страницы",
                "scroller": "Позиция прокрутки",
                "searchBuilder": "Редактор поиска",
                "select": "Выделение",
                "title": "Создать новое состояние",
                "toggleLabel": "Включает:"
            },
            "removeJoiner": "и",
            "removeSubmit": "Удалить",
            "renameButton": "Переименовать",
            "duplicateError": "Состояние с таким именем уже существует.",
            "emptyError": "Имя не может быть пустым.",
            "emptyStates": "Нет сохраненных состояний",
            "removeConfirm": "Вы уверены, что хотите удалить %s?",
            "removeError": "Не удалось удалить состояние.",
            "removeTitle": "Удалить состояние",
            "renameLabel": "Новое имя для %s:",
            "renameTitle": "Переименовать состояние"
        },
        "thousands": " "
    },
      columns: [
        { data: "id" },
        { data: "date" },
        { data: "user_init" },
        { data: "ticket" },
        { 
          data: "ticket_comment",
          render: function(data, type, row) {
            // replace \r\n with <br> tag to support line breaks
            return type === 'display' && data ? data.replace(/\r\n/g, '<br>') : data;
          }
        },
        { data: "priority" },
        { data: "status" },
        { data: "executor" },
        { data: "deadline" },
        { 
          data: "comment",
          render: function(data, type, row) {
            // replace \r\n with <br> tag to support line breaks
            return type === 'display' && data ? data.replace(/\r\n/g, '<br>') : data;
          }
        }
      ],

      createdRow: function(row, data, dataIndex) {
        if (data.status === 'В Работе') {
          $(row).addClass('table-primary');
        }
        if (data.status === 'Выполнено') {
          $(row).addClass('table-success');
        }
        if (data.status === 'Отложено') {
          $(row).addClass('table-danger');
        }
        if (data.status === 'Закрыто') {
          $(row).addClass('table-info');
        }
      },
      
    });

    // Форма добавления элемента
    $('#addForm').submit(function (event) {
      event.preventDefault();
    
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
          location.reload();
        },
        error: function (error) {
          console.log(error);
        }
      });
    });
    
    // Форма редактирования
    $('#editModal').on('show.bs.modal', function() {
      $.ajax({
        url: '/api/tasks/get_id',
        type: 'GET',
        success: function(response) {
          $('#idSelectEdit').empty();
          response.forEach(function(item) {
            $('#idSelectEdit').append($('<option>', {
              value: item.id,
              text: item.id
            }));
          });
          $.ajax({
            url: '/api/tasks/get_item',
            type: 'GET',
            data: { id: $('#idSelectEdit').val() },
            success: function(response) {
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
            error: function(error) {
              console.log(error);
            }
          });
        },
        error: function(error) {
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
      var select = $('#idSelectDelete').empty();
    
      $.get('/api/tasks/get_id', function (response) {
        response.forEach(function (item) {
          select.append($('<option>', { value: item.id, text: item.id }));
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

});

