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

