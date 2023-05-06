$(document).ready(function () {

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
    });
  });
});

