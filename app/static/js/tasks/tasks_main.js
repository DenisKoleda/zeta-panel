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

      rowCallback: function(row, data, index) {
        $(row).on('dblclick', function(event) {
          // Check if the clicked element is in the first column
          if ($(event.target).closest('td').index() === 0) {
            return; // Ignore clicks on the first column
          }
          // Get the ID of the clicked row
          var id = $(row).find('td:eq(0)').text(); // Assumes the ID is in the first column
          // Construct the URL and redirect to it
          window.location.href = '/tasks/' + id;
        })
        // Double tap == Double click
        $(row).doubletap(function(event) {
          // Check if the clicked element is in the first column
          if ($(event.target).closest('td').index() === 0) {
            return; // Ignore clicks on the first column
          }
          // Get the ID of the clicked row
          var id = $(row).find('td:eq(0)').text(); // Assumes the ID is in the first column
          // Construct the URL and redirect to it
          window.location.href = '/tasks/' + id;
        })
      }
    });
  });
});

