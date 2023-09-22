$.ajax({
  url: '/api/wiki/get', // Замените URL на адрес вашего сервера и ресурса
  type: 'GET',
  dataType: 'json', // Ожидаемый тип данных (может быть 'json', 'xml', 'html' и другие)
  success: function(data) {
    // Функция, которая выполняется при успешном выполнении запроса
    console.log('Успешный запрос:');
    table.rows.add(data);
    table.draw();
  },
  error: function(xhr, status, error) {
    // Функция, которая выполняется при ошибке запроса
    console.error('Ошибка запроса:', status, error);
  }
});
// отправляем GET запрос на сервер и получаем данные

var table = $('#myTable').DataTable({
  //dom: '<"justify-content-between align-items-center"lfB><"table-responsive"rt><"justify-content-between align-items-center"ip>',
  //buttons: buttons,
  stateSave: true,
  responsive: true,
  paging: true,
  searching: true,
  ordering: true,
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

