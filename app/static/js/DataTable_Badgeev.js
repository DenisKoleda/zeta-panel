$(document).ready(function () {
  var apiEndpoint = '/api/sklad/badgeev/get';
  // Клонирование thead таблицы
  $('#myTable thead tr')
    .clone(true)
    .addClass('filters')
    .appendTo('#myTable thead');

  // отправляем GET запрос на сервер и получаем данные
  $.get(apiEndpoint, function (data) {
    $('#myTable').DataTable({
      orderCellsTop: true,
      // select: true,
      // fixedHeader: true,
      paging: true,
      searching: true,
      ordering: true,
      data: data,
      language: {
        url: "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Russian.json"
      },
      columns: [
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
        { data: "comment" },
      ],
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
      },        
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
      var searchValue = value != '' ? '(((' + value + ')))' : '';
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
        url: '/api/sklad/badgeev/add',
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
        url: '/api/sklad/badgeev/get_id',
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
            url: '/api/sklad/badgeev/get_item',
            type: 'GET',
            data: { id: $('#idSelectEdit').val() },
            success: function (response) {
              // Заполняем поля формы данными об элементе
              $('#ipEdit').val(response.ip);
              $('#vlanEdit').val(response.vlan);
              $('#coreEdit').val(response.core);
              $('#configEdit').val(response.config);
              $('#statusEdit').val(response.status);
              $('#smartEdit').val(response.smart);
              $('#switchEdit').val(response.switch);
              $('#switch_portEdit').val(response.switch_port);
              $('#rackEdit').val(response.rack);
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
      $.get('/api/sklad/badgeev/get_item', { id: itemId }, function (response) {
        $('#ipEdit').val(response.ip);
        $('#vlanEdit').val(response.vlan);
        $('#coreEdit').val(response.core);
        $('#configEdit').val(response.config);
        $('#statusEdit').val(response.status);
        $('#smartEdit').val(response.smart);
        $('#switchEdit').val(response.switch);
        $('#switch_portEdit').val(response.switch_port);
        $('#rackEdit').val(response.rack);
        $('#commentEdit').val(response.comment);
        }).fail(function (error) {
        console.log(error);
      });
    });
    });
    $('#editForm').submit(function (event) {
      event.preventDefault();
    
      var data = $(this).serialize();
      $.post('/api/sklad/badgeev/update_item', data, function (response) {
        location.reload();
      }).fail(function (error) {
        console.log(error);
      });
    });
    // TODO Добавить вывод информации об удаляемом элементе
    $('#deleteModal').on('show.bs.modal', function (event) {
      var select = $('#idSelectDelete').empty();
    
      $.get('/api/sklad/badgeev/get_id', function (response) {
        response.forEach(function (item) {
          select.append($('<option>', { value: item.id, text: item.id }));
        });
      }).fail(function (error) {
        console.log(error);
      });
    });
    $('#deleteForm').submit(function (event) {
      event.preventDefault();
    
      $.post('/api/sklad/badgeev/delete_item', { id: $('#idSelectDelete').val() }, function (response) {
        $('#deleteModal').modal('hide');
        location.reload();
      }).fail(function (error) {
        console.log(error);
      });
    });
    
    
  setTimeout(function() {
    // Получаем элемент таблицы и обертываем его в контейнер с классом "table-responsive"
    $("#myTable").wrap('<div class="table-responsive"></div>');
}, 1000);

});

