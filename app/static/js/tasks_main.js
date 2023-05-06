$(document).ready(function () {
  var apiEndpoint = '/api/tasks/get'; 

  // отправляем GET запрос на сервер и получаем данные
  $.get(apiEndpoint, function (data) {
    var table = $('#myTable').DataTable({
      dom: '<"justify-content-between align-items-center"lfB><"table-responsive"rt><"justify-content-between align-items-center"ip>',
      buttons: buttons,
      stateSave: true,
      responsive: true,
      paging: true,
      searching: true,
      ordering: true,
      data: data,
      language: language,
      columns: columns,

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
  });
  });

