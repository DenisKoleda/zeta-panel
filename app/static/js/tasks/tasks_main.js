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

  });
  });

