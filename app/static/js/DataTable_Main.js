$(document).ready(function () {

  var apiEndpoint;
  var columns = [];
  switch (window.location.pathname) {
    case '/sklad/pc':
      apiEndpoint = '/api/sklad/pc/get';
      columns = [
        { data: "id" },
        { data: "name" },
        { data: "conf" },
        { data: "ip" },
        { data: "user" },
        { data: "smart" },
        { data: "comment" }
      ];
      path = 'pc'
      break;
    case '/sklad/badgeev':
      apiEndpoint = '/api/sklad/badgeev/get';
      columns = [
        { data: "id" },
        { data: "ip" },
        { data: "vlan" },
        { data: "cores" },
        { data: "config" },
        { data: "status" },
        { data: "smart" },
        { data: "switch" },
        { data: "switch_port" },
        { data: "rack" },
        { data: "comment" }
      ];
      path = 'badgeev'
      break;
    case '/sklad/ram':
      apiEndpoint = '/api/sklad/ram/get';
      columns = [
        { data: "id" },
        { data: "name" },
        { data: "type" },
        { data: "size" },
        { data: "frequency" },
        { data: "count" }
      ];
      path = 'ram'
      break;
    case '/sklad/motherboard':
      apiEndpoint = '/api/sklad/motherboard/get';
      columns = [
        { data: "id" },
        { data: "name" },
        { data: "ram" },
        { data: "m2" },
        { data: "count" }
      ];
      path = 'motherboard'
      break;
    case '/sklad/harddrive':
      apiEndpoint = '/api/sklad/harddrive/get';
      columns = [
        { data: "id" },
        { data: "name" },
        { data: "type" },
        { data: "size" },
        { data: "count" }
      ];
      path = 'harddrive'
      break;
    case '/sklad/network':
      apiEndpoint = '/api/sklad/network/get';
      columns = [
        { data: "id" },
        { data: "name" },
        { data: "type" },
        { data: "ports" },
        { data: "count" }
      ];
      path = 'network'
      break;
  }



  // отправляем GET запрос на сервер и получаем данные
  $.get(apiEndpoint, function (data) {
    var table = $('#myTable').DataTable({
      dom: '<"justify-content-between align-items-center"lfB><""rt><"justify-content-between align-items-center"ip>',
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
      columns : columns,
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
  });
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
    $('#editModal').on('show.bs.modal', function() {
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
    
      $.get('/api/sklad/' + path + '/get_id', function (response) {
        response.forEach(function (item) {
          select.append($('<option>', { value: item.id, text: item.id }));
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

