$(document).ready(function () {
  var apiEndpoint = '/api/tasks/get_tasks';
  // Клонирование thead таблицы
  $('#myTable thead tr')
    .clone(true)
    .addClass('filters')
    .appendTo('#myTable thead');

  // отправляем GET запрос на сервер и получаем данные
  $.get(apiEndpoint, function (data) {
    var table = $('#myTable').DataTable({
      orderCellsTop: true,
      // select: true,
      // fixedHeader: true,
      "paging": true,
      "searching": true,
      "ordering": true,
      "data": data,
      "language": {
        "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Russian.json"
      },
      "columns": [
        { "data": "id" },
        { "data": "date" },
        { "data": "user_init" },
        { "data": "ticket" },
        { "data": "ticket_comment" },
        { "data": "priority" },
        { "data": "status" },
        { "data": "executor" },
        { "data": "deadline" },
        { "data": "comment" }
      ],
      initComplete: function() {
        var dataTable = this.api();
      
        // Add input elements to table headers
        dataTable.columns().eq(0).each(function(colIndex) {
          var columnHeader = $('.filters th').eq($(dataTable.column(colIndex).header()).index());
          var title = $(columnHeader).text();
          $(columnHeader).html('<input type="text" placeholder="' + title + '" />');
      
          // Handle input change event
          $('input', $(columnHeader)).off('keyup change').on('change', function(event) {
            // Get the search value
            $(this).attr('title', $(this).val());
            var regexr = '({search})'; //$(this).parents('th').find('select').val();
            var searchValue = this.value != '' ? '(((' + this.value + ')))' : '';
      
            // Search the column for the search value
            dataTable.column(colIndex)
              .search(searchValue, this.value != '', this.value == '')
              .draw();
          }).on('keyup', function(event) {
            event.stopPropagation();
      
            $(this).trigger('change');
            $(this).focus()[0];
          });
        });
      },
      
    });
    // Форма добавления элемента
    $('#addForm').submit(function (event) {
      event.preventDefault();

      // Получение данных из формы
      var date = $('#date').val();
      var user_init = $('#user_init').val();
      var ticket = $('#ticket').val();
      var ticket_comment = $('#ticket_comment').val();
      var priority = $('#priority').val();
      var status = $('#status').val();
      var executor = $('#executor').val();
      var deadline = $('#deadline').val();
      var comment = $('#comment').val();

      // AJAX запрос для добавления строки в базу данных
      $.ajax({
        url: '/api/tasks/add_row_task',
        type: 'POST',
        data: {
          'date': date,
          'user_init': user_init,
          'ticket': ticket,
          'ticket_comment': ticket_comment,
          'priority': priority,
          'status': status,
          'executor': executor,
          'deadline': deadline,
          'comment': comment

        },
        success: function (response) {
          // Добавление новой строки в таблицу DataTable со сгенерированным ID
          table.row.add({
            "id": response.id,
            "date": date,
            "user_init": user_init,
            "ticket": ticket,
            "ticket_comment": ticket_comment,
            "priority": priority,
            "status": status,
            "executor": executor,
            "deadline": deadline,
            "comment": comment
          }).draw(false);

          // Очистка формы и закрытие модального окна
          $('#addForm')[0].reset();
          $('#addModal').modal('hide');
        },
        error: function (error) {
          console.log(error);
        }
      });
    });
    // Форма редактирования
    $('#editModal').on('show.bs.modal', function () {
      // TODO Получить данные об элементе получается 2 раза нужно получить только все id можно заменить на таблицу, а запросы на сервере
      // Но тут надо подумать как сделать лучше по сути сейчас 2 запроса
      // get_pc_items_id - Получает все доступные id элементов
      // get_ps_item?id=1 - Получает информацию только об выбранном элементе
      $.ajax({
        url: '/api/tasks/get_tasks_id',
        type: 'GET',
        success: function (response) {
          // Очищаем список и добавляем опции для каждого элемента
          $('#idSelectEdit').empty();
          response.forEach(function (item) {
            $('#idSelectEdit').append($('<option>', {
              value: item.id,
              text: item.id
            }));
          });

          // Выполняем запрос для получения данных об элементе с выбранным ID
          var itemId = $('#idSelectEdit').val();
          $.ajax({
            url: '/api/tasks/get_task_item',
            type: 'GET',
            data: { id: itemId },
            success: function (response) {
              // Заполняем поля формы данными об элементе
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
      $.ajax({
        url: '/api/tasks/get_task_item',
        type: 'GET',
        data: { id: itemId },
        success: function (response) {
          // Заполняем поля формы данными об элементе
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
    });
    $('#editForm').submit(function (event) {
      event.preventDefault();

      var id = $('#idSelectEdit').val();
      var date = $('#dateEdit').val()
      var user_init = $('#user_initEdit').val()
      var ticket = $('#ticketEdit').val()
      var ticket_comment = $('#ticket_commentEdit').val()
      var priority = $('#priorityEdit').val()
      var status = $('#statusEdit').val()
      var executor = $('#executorEdit').val()
      var deadline = $('#deadlineEdit').val()
      var comment = $('#commentEdit').val()

      $.ajax({
        url: '/api/tasks/update_task_item',
        type: 'POST',
        data: { id: id, date: date, user_init: user_init, ticket: ticket, ticket_comment: ticket_comment, priority: priority, status: status, executor: executor, deadline: deadline },
        success: function (response) {
          // Перезагружаем страницу после обновления элемента
          location.reload();
        },
        error: function (error) {
          console.log(error);
        }
      });
    });
    // TODO Добавить вывод информации об удаляемом элементе
    $('#deleteModal').on('show.bs.modal', function (event) {
      var modal = $(this);
      var select = modal.find('#idSelectDelete');
      select.empty();

      $.ajax({
        url: '/api/tasks/get_tasks_id',
        type: 'GET',
        success: function (response) {
          response.forEach(function (item) {
            select.append($('<option>', { value: item.id, text: item.id }));
          });
        },
        error: function (error) {
          console.log(error);
        }
      });
    });
    $('#deleteForm').submit(function (event) {
      event.preventDefault();

      var id = $('#idSelectDelete').val();

      $.ajax({
        url: '/api/sklad/delete_task_item',
        type: 'POST',
        data: { id: id },
        success: function (response) {
          // Закрываем модальное окно
          $('#deleteModal').modal('hide');
          location.reload();
        },
        error: function (error) {
          console.log(error);
        }
      });
    });




  });
  setTimeout(function() {
    // Получаем элемент таблицы и обертываем его в контейнер с классом "table-responsive"
    $("#myTable").wrap('<div class="table-responsive"></div>');
}, 1000);

});

