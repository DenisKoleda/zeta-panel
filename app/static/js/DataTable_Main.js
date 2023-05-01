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
      break;
  }


  // Клонирование thead таблицы
  $('#myTable thead tr')
    .clone(true)
    .addClass('filters')
    .appendTo('#myTable thead');

  // отправляем GET запрос на сервер и получаем данные
  $.get(apiEndpoint, function (data) {
    $('#myTable').DataTable({
      orderCellsTop: true,
      dom: '<"justify-content-between align-items-center"lfB><"table-responsive"rt><"justify-content-between align-items-center"ip>',
      buttons:[
        'createState', 'savedStates', 'copy', 'excel', 'print', 'colvis'
        
      ],
      colReorder: true,
      //responsive: true,
      paging: true,
      searching: true,
      ordering: true,
      data: data,
      language: {
          "sProcessing":   "Обработка...",
          "sLengthMenu":   "Показать _MENU_ записей",
          "sZeroRecords":  "Записи отсутствуют.",
          "sInfo":         "Записи с _START_ до _END_ из _TOTAL_ записей",
          "sInfoEmpty":    "Записи с 0 до 0 из 0 записей",
          "sInfoFiltered": "(отфильтровано из _MAX_ записей)",
          "sInfoPostFix":  "",
          "sSearch":       "Поиск:",
          "sUrl":          "",
          "oPaginate": {
              "sFirst":    "Первая",
              "sPrevious": "Предыдущая",
              "sNext":     "Следующая",
              "sLast":     "Последняя"
          },
          "buttons": {
            "removeState": "Удалить состояние",
            "updateState": "Обновить состояние",
            "stateRestore": "Состояние %d",
            "renameState": "Переименовать состояние",
            "createState": "Сохранить состояние",
            "savedStates": "Сохраненные состояния",
            "create": "Создать",
            "edit": "Редактировать",
            "remove": "Удалить",
            "copy": "Копировать",
            "csv": "CSV",
            "excel": "Excel",
            "print": "Печать",
            "colvis": "Видимость колонок"
          }
      },
      columns : columns,
      initComplete: function() {
        var dataTable = this.api();
  
        // Add input elements to table headers
        dataTable.columns().eq(0).each(function(colIndex) {
          var columnHeader = $('.filters th').eq($(dataTable.column(colIndex).header()).index());
          addInputToHeader(columnHeader);
  
          // Handle input change event
          $('input', columnHeader).on('input', function(event) {
            handleInputChange(dataTable, colIndex, this.value);
          });
        });
  
        // Add select elements to table footers
        dataTable.columns().every(function(colIndex) {
          var column = this;
          var select = $('<select class="form-select"><option value=""></option></select>')
            .appendTo($(column.footer()).empty())
            .on('change', function() {
              handleInputChange(dataTable, colIndex, '');
            });
          column.data().unique().sort().each(function(d, j) {
            select.append('<option value="' + d + '">' + d + '</option>');
          });
        });
      }
    });
  
    function addInputToHeader(header) {
      var title = $(header).text();
      $(header).html(`
        <div class="input-group">
          <input type="text" class="form-control" placeholder="${title}" />
        </div>
      `);
    }
  
    function handleInputChange(dataTable, colIndex, value) {
      var inputVal = value != '' ? '(((' + value + ')))' : '';
      var selectVal = $(dataTable.column(colIndex).footer()).find('select').val();
      var searchValue = inputVal + (selectVal ? '^' + selectVal + '$' : '');
      dataTable.column(colIndex)
        .search(searchValue, true, false)
        .draw();
    }
    // Форма добавления элемента
    $('#addForm').submit(function (event) {
      event.preventDefault();
    
      // Получение данных из формы
      var formData = $('#addForm').serialize();
    
      // AJAX запрос для добавления строки в базу данных
      $.ajax({
        url: '/api/sklad/pc/add',
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
        url: '/api/sklad/pc/get_id',
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
            url: '/api/sklad/pc/get_item',
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
      $.get('/api/sklad/pc/get_item', { id: itemId }, function (response) {
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
    
      $.post('/api/sklad/pc/update_item', data, function (response) {
        location.reload();
      }).fail(function (error) {
        console.log(error);
      });
    });
    // TODO Добавить вывод информации об удаляемом элементе
    $('#deleteModal').on('show.bs.modal', function (event) {
      var select = $('#idSelectDelete').empty();
    
      $.get('/api/sklad/pc/get_id', function (response) {
        response.forEach(function (item) {
          select.append($('<option>', { value: item.id, text: item.id }));
        });
      }).fail(function (error) {
        console.log(error);
      });
    });
    $('#deleteForm').submit(function (event) {
      event.preventDefault();
    
      $.post('/api/sklad/pc/delete_item', { id: $('#idSelectDelete').val() }, function (response) {
        $('#deleteModal').modal('hide');
        location.reload();
      }).fail(function (error) {
        console.log(error);
      });
    });
    
});

