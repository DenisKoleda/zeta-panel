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
      language: language
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

