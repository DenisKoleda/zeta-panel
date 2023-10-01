var endpoint = '/api/wiki/get';

// отправляем GET запрос на сервер и получаем данные
$.get(endpoint, function (data) {
  var table = $('#myTable').DataTable({
    //dom: '<"justify-content-between align-items-center"lfB><"table-responsive"rt><"justify-content-between align-items-center"ip>',
    //buttons: buttons,
    stateSave: true,
    responsive: true,
    pagingType: 'simple',
    searching: true,
    ordering: true,
    data: data,
    language: language,
    columns: columns,
    order: [[0, 'desc']],

    rowCallback: function(row, data, index) {
      $(row).on('dblclick', function(event) {
        // Check if the clicked element is in the first column
        if ($(event.target).closest('td').index() === 0) {
          return; // Ignore clicks on the first column
        }
        // Get the ID of the clicked row
        var id = $(row).find('td:eq(0)').text(); // Assumes the ID is in the first column
        // Construct the URL and redirect to it
        window.location.href = '/wiki/' + id;
      })
      $(row).doubletap(function(event) {
        // Check if the clicked element is in the first column
        if ($(event.target).closest('td').index() === 0) {
          return; // Ignore clicks on the first column
        }
        // Get the ID of the clicked row
        var id = $(row).find('td:eq(0)').text(); // Assumes the ID is in the first column
        // Construct the URL and redirect to it
        window.location.href = '/wiki/' + id;
      })
    }
  });
});